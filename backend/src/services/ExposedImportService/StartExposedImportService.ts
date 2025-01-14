/*eslint-disable*/

import { Op } from "sequelize";
import ExposedImport from "../../database/models/ExposedImport";
import FileRegister from "../../database/models/FileRegister";
import Whatsapp from "../../database/models/Whatsapp";
import AppError from "../../errors/AppError";
import { removePhoneNumberWith9Country, preparePhoneNumber9Digit, removePhoneNumber9Digit,removePhoneNumberCountry, removePhoneNumber9DigitCountry } from "../../utils/common";
import { createClient } from 'redis';

interface Request {
  exposedImportId: string;
  companyId: number;
  payload: any;
}

const objToString = (obj: any) => {
  try {
    const string = JSON.stringify(obj);
    return string;
  } catch {
    return "";
  }
};

const getDinamicValue = (path: any, payload: any) => {
  const keys = path.split(".");
  let value = payload;

  for (let i = 0; i < keys.length; i++) {
    if (value === undefined) {
      return "";
    }

    if (Array.isArray(value)) {
      const array = [];

      for (const item of value) {
        array.push(item[keys[i]]);
      }

      value = array;
    } else {
      value = value[keys[i]];
    }
  }

  return (value && typeof value === "string") ? value : objToString(value);
};

const getRelationValue = (newValue: any, payload: any) => {
  if (!newValue) return "";

  let value = newValue;

  if(!value)
    return '';

  while (value.match(/\{{(.*?)\}}/)) {
    const param = value.match(/\{{(.*?)\}}/);

    const dinamicValue = getDinamicValue(param[1].trim(), payload);

    value = value.replace(param[0], dinamicValue);
  }

  return value;
};

let numberDispatcher = {};

const StartExposedImportService = async ({
  exposedImportId,
  companyId,
  payload
}: Request): Promise<ExposedImport> => {
  const exposedImport = await ExposedImport.findOne({
    where: {
      id: exposedImportId,
      companyId,
      deletedAt: { [Op.is]: null }
    }
  });

  if (!exposedImport) {
    throw new AppError("ERR_NO_IMPORT_FOUND", 404);
  }

  let client = null;

  try {
    client = createClient({
      url: process.env.REDIS_URL
    });
  } catch (err) {
    console.log("REDIS ERR - START EXPOSED IMPORT", err);
  }

  if (client) {
    try {
      client.on('error', err => console.log('Redis Client Error', err));
      await client.connect();
    } catch (err) {
      console.log("REDIS ERR - START EXPOSED IMPORT", err);
    }
  }

  const mapping = JSON.parse(exposedImport.mapping);
  let totalRegisters = exposedImport.qtdeRegister;
  var today = new Date();
  today.setHours(today.getHours() - 4);

  if (Array.isArray(payload)) {
    let registersToInsert = [];

    for (const obj of payload) {
      try {
        const name = getRelationValue(mapping.name, obj);
        const phoneNumber = getRelationValue(mapping.phoneNumber, obj);
        const documentNumber = getRelationValue(mapping.documentNumber, obj);
        const template = getRelationValue(mapping.template, obj);
        const templateParams = getRelationValue(mapping.templateParams, obj);
        const message = getRelationValue(mapping.message, obj);
        const var1 = getRelationValue(mapping.var1, obj);
        const var2 = getRelationValue(mapping.var2, obj);
        const var3 = getRelationValue(mapping.var3, obj);
        const var4 = getRelationValue(mapping.var4, obj);
        const var5 = getRelationValue(mapping.var5, obj);
        const whatsappName = getRelationValue(mapping.phoneNumberFrom, obj);
        let whatsappId = null;

        if (whatsappName) {
          const whatsapp = await Whatsapp.findOne({
            where: { name: whatsappName, companyId, official: true, deleted: false }
          });

          whatsappId = whatsapp ? whatsapp.id : null;
        }

        const register = {
          name,
          phoneNumber,
          exposedImportId,
          documentNumber,
          template,
          templateParams,
          message,
          var1,
          var2,
          var3,
          var4,
          var5,
          companyId,
          whatsappId
        };

        registersToInsert.push(register);

        if (client) {
          try {
            await client.set(`${phoneNumber}-${companyId}`, JSON.stringify(register), {
              EX: parseInt(process.env.REDIS_SAVE_TIME)
            });
          } catch (err) {
            console.log("REDIS ERR - START EXPOSED IMPORT", err);
          }
        }

        if (registersToInsert.length >= 500) {
          await FileRegister.bulkCreate(registersToInsert);
          totalRegisters += registersToInsert.length;
          registersToInsert = [];
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (registersToInsert.length > 0) {
      totalRegisters += registersToInsert.length;
      await FileRegister.bulkCreate(registersToInsert);
    }
    console.log("update exposedImport exposedImportService 145");
    await exposedImport.update({ qtdeRegister: totalRegisters });
  } else {
    const name = getRelationValue(mapping.name, payload);
    const phoneNumber = getRelationValue(mapping.phoneNumber, payload);

    if(numberDispatcher[phoneNumber]) {
      numberDispatcher[phoneNumber] = [];
      throw new AppError("DUPLICATED_NUMBER", 403);
    }
  
    numberDispatcher[phoneNumber] = [];

    const validDuplicated = getRelationValue("checkDuplicated", payload);

    if(payload.checkDuplicated == undefined || validDuplicated === true) {
      const register = await FileRegister.findAll({
        where: {
          companyId: companyId,
          createdAt: {
            [Op.gte]: today
          },
          phoneNumber: 
            { 
              [Op.or]: [
                removePhoneNumberWith9Country(phoneNumber),
                preparePhoneNumber9Digit(phoneNumber),
                removePhoneNumber9Digit(phoneNumber),
                removePhoneNumberCountry(phoneNumber),
                removePhoneNumber9DigitCountry(phoneNumber)
              ],
            }
       },
       order: [["createdAt", "DESC"]] 
      });
  
       if(register.length > 0) {
        delete numberDispatcher[phoneNumber];
        throw new AppError("DUPLICATED_NUMBER", 403);
       }
    }

    const documentNumber = getRelationValue(mapping.documentNumber, payload);
    const template = getRelationValue(mapping.template, payload);
    const templateParams = getRelationValue(mapping.templateParams, payload);
    const message = getRelationValue(mapping.message, payload);
    const var1 = getRelationValue(mapping.var1, payload);
    const var2 = getRelationValue(mapping.var2, payload);
    const var3 = getRelationValue(mapping.var3, payload);
    const var4 = getRelationValue(mapping.var4, payload);
    const var5 = getRelationValue(mapping.var5, payload);
    const whatsappName = getRelationValue(mapping.phoneNumberFrom, payload);
    let whatsappId = null;

    if (whatsappName) {
      const whatsapp = await Whatsapp.findOne({
        where: { name: whatsappName, companyId, official: true, deleted: false }
      });

      whatsappId = whatsapp ? whatsapp.id : null;
    }

    const register = {
      name,
      phoneNumber,
      exposedImportId,
      documentNumber,
      template,
      templateParams,
      message,
      var1,
      var2,
      var3,
      var4,
      var5,
      companyId,
      whatsappId
    }

    if (client) {
      try {
        await client.set(`${phoneNumber}-${companyId}`, JSON.stringify(register), {
          EX: parseInt(process.env.REDIS_SAVE_TIME)
        });
      } catch (err) {
        console.log("REDIS ERR - START EXPOSED IMPORT", err);
      }
    }

    await FileRegister.create(register);
    console.log("update exposedImport exposedImportService 186");
    await exposedImport.update({ qtdeRegister: totalRegisters + 1 });
    delete numberDispatcher[phoneNumber];
  }

  if (client) await client.disconnect();

  exposedImport.reload();

  return exposedImport;
};

export default StartExposedImportService;
