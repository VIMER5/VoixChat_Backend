import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequestType.js";
import errorService from "../service/errorService.js";

export default function (req: CustomRequest, res: Response, next: NextFunction) {
    if (req.role !== "admin") {
        throw errorService.forbidden("Доступ запрещен. Требуются права администратора.");
    }
    next();
}
