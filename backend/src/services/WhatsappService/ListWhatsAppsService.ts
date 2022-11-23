import Queue from "../../database/models/Queue";
import Whatsapp from "../../database/models/Whatsapp";

interface Request {
  companyId: string | number;
  limit?: string;
  pageNumber?: string;
  official?: string;
  search?: string;
  deleted?: string
};

interface Response {
  whatsapps: Whatsapp[];
  count: number;
}

const ListWhatsAppsService = async ({
  companyId,
  limit = "10",
  pageNumber = "1",
  official,
  search = "",
  deleted = "false",
}: Request): Promise<Response> => {
  let whereCondition = null;

  whereCondition = {
    companyId, 
    deleted: deleted === "true" ? true : false,
    official: official === "true" ? true : false,
  };

  const offset = +limit * (+pageNumber - 1);

  const { count, rows: whatsapps } = await Whatsapp.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Queue,
        as: "queues",
        attributes: ["id", "name", "color", "greetingMessage"]
      }
    ],
    limit: +limit < 0 ? +limit : null,
    offset: +limit < 0 ? offset : null,
    order: [["status", "DESC"]]
  });

  return { count, whatsapps };
};

export default ListWhatsAppsService;
