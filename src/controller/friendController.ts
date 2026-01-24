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
}

export default new friendController();
