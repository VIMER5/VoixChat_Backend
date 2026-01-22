import errorService from "../service/errorService.js";
import { NextFunction, Request, Response } from "express";
import tokenService from "service/tokenService.js";
import { CustomRequest, CustomRequestSocketIO } from "types/customRequestType.js";
export default async function (req: CustomRequest, res: Response, next: NextFunction) {
  const { authorization = null } = req.headers;
  if (!authorization || typeof authorization != "string" || !authorization.includes("Bearer"))
    throw errorService.unauthorized("нет токена");
  const access = authorization.split(" ")[1];
  const payLoad = await tokenService.isValidAccessToken(access);
  if (typeof payLoad == "boolean") throw errorService.unauthorized("Токен недействительный");
  req.userId = payLoad.userId;
  req.login = payLoad.login;
  next();
}
export async function guardSocketIo(socket: CustomRequestSocketIO, next: any) {
  const { token = null } = socket.handshake.auth;
  if (!token) return next(new Error("Unauthorized"));
  const payLoad = await tokenService.isValidAccessToken(token);
  if (typeof payLoad == "boolean") return next(new Error("Unauthorized"));
  socket.userId = payLoad.userId;
  socket.login = payLoad.login;
  next();
}
