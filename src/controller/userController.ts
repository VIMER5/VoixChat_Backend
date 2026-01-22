import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import userService from "service/userService.js";
import { CustomRequest } from "types/customRequestType.js";
import { getIO } from "./../socket/index.js";
class user {
  async getCurrentUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.notFound("что-то пошло не так");
      const data = await userService.getUser(req.userId);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  async getCurrentUser2(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.notFound("что-то пошло не так");
      const data = await userService.getUser(req.userId);
      const io = getIO();
      io.to(`user:${req.userId}`).emit("test", {
        title: "Новое сообщение",
        body: "message",
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

export default new user();
