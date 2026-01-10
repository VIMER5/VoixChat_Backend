import errorService from "../service/errorService.js";
import { NextFunction, Request, Response } from "express";
export default function (err: errorService | Error, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  err instanceof errorService
    ? res.status(err.status).json(err.message)
    : res.status(500).json("Мой код решил, что сегодня выходной.");
}
