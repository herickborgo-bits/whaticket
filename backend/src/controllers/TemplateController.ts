import { Request, Response } from "express";
import ListTemplateService from "../services/TemplateService/ListTemplateService";
import CreateTemplateService from "../services/TemplateService/CreateTemplateService";

export const index = async (req: Request, res: Response): Promise<Response> => {
    const { whatsAppId } = req.params;

    const response = await ListTemplateService({ whatsAppId })

    return res.status(200).json(response);
}

export const store = async (req: Request, res: Response): Promise<Response> => {
    const { templateName, category, whatsAppsId, bodyText, footerText } = req.body;

    const response = await CreateTemplateService({ templateName, category, whatsAppsId, bodyText, footerText });

    return res.status(200).json(response);
}