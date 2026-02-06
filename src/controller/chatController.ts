import { CustomRequest } from "types/customRequestType.js";
import { Response, NextFunction } from "express";
import errorApi from "service/errorService.js";
import chatsService from "service/chatsService.js";
class chatController {
  /**
   * @swagger
   * /api/user/chat/getMyChats:
   *   get:
   *     summary: Получение чаты текущего пользователя
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Данные чатов успешно получены
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/GetMyChatsResponse'
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Пользователь не найден
   */
  async getMyChat(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const responses = await chatsService.getMyChats(req.userId);
      res.status(200).json(responses);
    } catch (e) {
      next(e);
    }
  }
}

export default new chatController();
