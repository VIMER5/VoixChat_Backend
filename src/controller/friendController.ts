import { CustomRequest } from "types/customRequestType.js";
import { Response, NextFunction } from "express";
import errorApi from "service/errorService.js";
import friendService from "service/friendService.js";
class friendController {
  async getUserFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const friends = await friendService.getFriends(req.userId);
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  }
  async addUserFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const body = req.body;
      if (!body || !body.user) throw errorApi.badRequest("Нет данных");
      const str = body.user.split("#");
      if (str.length != 2) throw errorApi.badRequest("Неправильный формат");
      const frienId = Number(str[1]);
      if (Number.isNaN(frienId)) throw errorApi.badRequest("Неправильный формат");
      const resService = await friendService.addFriend(str[0], req.userId, frienId);

      res.status(200).json(resService);
    } catch (err) {
      next(err);
    }
  }
  async getFriendRequest(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const friends = await friendService.getFriendRequest(req.userId);
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  }
}

export default new friendController();
