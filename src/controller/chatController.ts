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
  /**
   * @swagger
   * /api/user/chat/getMoreMessages:
   *   post:
   *     summary: Получить следующие 20 сообщений чата
   *     description: Пагинация сообщений чата с использованием beforeId (пагинация по ID сообщения)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - chatId
   *             properties:
   *               chatId:
   *                 type: string
   *                 format: uuid
   *                 description: UUID идентификатор чата
   *                 example: "318343e4-03f4-11f1-9289-bc24110cce17"
   *               beforeId:
   *                 type: integer
   *                 description: ID сообщения, до которого нужно получить сообщения (для пагинации). Если не указан, вернет последние 20 сообщений
   *                 example: 54
   *     responses:
   *       200:
   *         description: Сообщения успешно получены
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: ID сообщения
   *                     example: 55
   *                   content:
   *                     type: string
   *                     description: Текст сообщения
   *                     example: "Привет, как дела?"
   *                   type:
   *                     type: string
   *                     enum: [text, image, file, audio]
   *                     description: Тип сообщения
   *                     example: "text"
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     description: Дата создания сообщения
   *                     example: "2024-01-15T10:30:00.000Z"
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     description: Дата обновления сообщения
   *                     example: "2024-01-15T10:30:00.000Z"
   *                   _User:
   *                     type: object
   *                     description: Информация об отправителе
   *                     properties:
   *                       id:
   *                         type: integer
   *                         description: ID пользователя
   *                         example: 1
   *                       username:
   *                         type: string
   *                         description: Имя пользователя
   *                         example: "john_doe"
   *                       avatar:
   *                         type: string
   *                         description: URL аватара пользователя (нормализованный)
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Чат не найден
   *       403:
   *         description: отказано в доступе
   */
  async getMoreMessages(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { chatId = null, beforeId = null } = req.body;
      const userId = req.userId;
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      if (!chatId || !beforeId) throw errorApi.badRequest("нет данных");
      const data = await chatsService.getMoreMessages(chatId, beforeId);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new chatController();
