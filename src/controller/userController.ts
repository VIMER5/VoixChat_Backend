import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import userService from "service/userService.js";
import { CustomRequest } from "types/customRequestType.js";
import { getIO } from "./../socket/index.js";
import { User } from "module/db/model/user.js";
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
      const user = await User.findByPk(2, {
        include: [
          {
            model: User,
            as: "Friends",
            through: {
              where: { status: "accepted" },
            },
            attributes: ["id", "username", "avatar"],
          },
          {
            model: User,
            as: "AddedBy",
            through: {
              where: { status: "accepted" },
            },
            attributes: ["id", "username", "avatar"],
          },
        ],
      });
      const allFriends = [...user?.Friends!, ...user?.AddedBy!];
      res.status(200).json(allFriends);
    } catch (err) {
      next(err);
    }
  }
}

export default new user();
