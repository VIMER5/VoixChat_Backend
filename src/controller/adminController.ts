import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRequestType.js";
import adminService from "../service/adminService.js";

class AdminController {
  async banUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { userId, isBanned } = req.body;
      const user = await adminService.banUser(userId, isBanned);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async clearChatHistory(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.body;
      const result = await adminService.clearChatHistory(chatId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getAllChats(req: CustomRequest, res: Response, next: NextFunction) {
      try {
          const chats = await adminService.getAllChats();
          res.json(chats);
      } catch (e) {
          next(e);
      }
  }
}

export default new AdminController();
