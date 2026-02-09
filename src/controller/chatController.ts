import { CustomRequest } from "types/customRequestType.js";
import { Response, NextFunction } from "express";
import errorApi from "service/errorService.js";
import chatsService from "service/chatsService.js";
import { newMessageRequest } from "validators/chat.validator.js";
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
  /**
   * @swagger
   * /api/user/chat/getChatById/{chatId}:
   *   get:
   *     summary: получить чат по ID
   *     description: получить чат по ID
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: chatId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID чата
   *         example: "095172b8-0265-11f1-9289-bc24110cce17"
   *     responses:
   *       200:
   *         description: Данные чата успешно получены
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/ChatInfo'
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Чат не найден
   *       403:
   *         description: отказано в доступе
   */
  async getChatById(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const responses = await chatsService.getChatById(chatId, req.userId);

      console.log(chatId);
      res.status(200).json(responses);
    } catch (e) {
      next(e);
    }
  }
  /**
   * @swagger
   * /api/user/chat/sendMessage:
   *   post:
   *     summary: Отправить сообщение
   *     description: получить чат по ID
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/newMessageRequest'
   *     responses:
   *       200:
   *         description: Данные чата успешно получены
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/ChatInfo'
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Чат не найден
   *       403:
   *         description: отказано в доступе
   */
  async sendMessage(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const userId = req.userId;
      if (!body) throw errorApi.badRequest("нет данных");
      const { error, value } = newMessageRequest.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) throw errorApi.badRequest(error.message);
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const data = await chatsService.sendMessage({ ...value, userId });
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new chatController();
