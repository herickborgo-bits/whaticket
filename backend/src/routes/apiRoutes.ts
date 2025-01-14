/*eslint-disable */
import express from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

import * as ApiController from "../controllers/ApiController";
import * as WhatsAppController from "../controllers/WhatsAppController";
import * as FileRegisterController from "../controllers/FileRegisterController";
import * as FlowsController from "../controllers/FlowsController";
import * as TicketController from "../controllers/TicketController";
import * as TemplateController from "../controllers/TemplateController";
import * as MessageController from "../controllers/MessageController";
import isAuthApi from "../middleware/isAuthApi";
import isAuth from "../middleware/isAuth";

const upload = multer(uploadConfig);

const ApiRoutes = express.Router();

ApiRoutes.get(
  "/tickets/isInBot/:messageId",
  isAuthApi,
  TicketController.isInBot
);

ApiRoutes.post(
  "/tickets/isInBot",
  isAuthApi,
  TicketController.isInBotPost
);

ApiRoutes.post(
  "/tickets/changeQueueOrResolve",
  isAuthApi,
  TicketController.changeQueueOrResolve
);

ApiRoutes.get(
  "/whatsapp/flow/:connectionName",
  isAuthApi,
  FlowsController.connection
);

ApiRoutes.post(
  "/whatsapp/botmessage",
  isAuthApi,
  WhatsAppController.botMessageApi
);

ApiRoutes.post(
  "/whatsapp/botmessagecustomer",
  isAuthApi,
  WhatsAppController.botMessageCustomer
);

ApiRoutes.post(
  "/whatsapp/nof/sessionstatus",
  isAuthApi,
  WhatsAppController.nofSessionStatus
);
ApiRoutes.post(
  "/whatsapp/nof/updateqrcode",
  isAuthApi,
  WhatsAppController.nofSessionQRUpdate
);

ApiRoutes.post(
  "/whatsapp/quality",
  isAuthApi,
  WhatsAppController.qualityNumber
);

ApiRoutes.post(
  "/whatsapp/messageStatus",
  isAuthApi,
  WhatsAppController.messageStatus
);

ApiRoutes.post(
  "/whatsapp/newMessage",
  isAuthApi,
  WhatsAppController.newMessage
);

ApiRoutes.get(
  "/verifyImportedFiles",
  isAuthApi,
  ApiController.importDispatcherFileProcess
);

ApiRoutes.get(
  "/dispatcherRegisterProcess",
  isAuthApi,
  ApiController.dispatcherRegisterProcess
);

ApiRoutes.post("/sendMessage", isAuthApi, ApiController.sendMessageApi);
ApiRoutes.post("/checkIfPingConversation", isAuthApi, ApiController.checkIfPingConnectionApi);

ApiRoutes.post("/send", isAuthApi, upload.array("medias"), ApiController.index);

ApiRoutes.get(
  "/fileRegisters/getInfo/",
  isAuthApi,
  FileRegisterController.getInfo
);

ApiRoutes.post(
  "/officialTemplates/updateStatus",
  isAuthApi,
  TemplateController.updateStatus
);

ApiRoutes.get("/tickets/inticket", isAuthApi, TicketController.containTicket);

ApiRoutes.get("/whatsapp/getCallback/", isAuthApi, WhatsAppController.getCallbackUrl);

ApiRoutes.get(
  "/officialTemplates/getParams/",
  isAuthApi,
  TemplateController.getParams
);

ApiRoutes.get(
  "/getMessages/",
  isAuthApi,
  MessageController.getMessages
);

export default ApiRoutes;
