import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import voiceService from "service/voiceService.js";
import { CustomRequest } from "types/customRequestType.js";
class voiceController {
  /**
   * @swagger
   * /api/voice/info:
   *    get:
   *        summary: Получение информации об участниках голосовых комнат
   *        description: Возвращает список чатов пользователя, в которых есть активные голосовые сессии, включая полные данные участников.
   *        tags: [Voice]
   *        security:
   *            - bearerAuth: []
   *        responses:
   *            200:
   *                description: Список чатов с информацией о пользователях в голосе
   *                content:
   *                    application/json:
   *                        schema:
   *                            type: array
   *                            items:
   *                                type: object
   *                                properties:
   *                                    id:
   *                                        type: string
   *                                        description: ID чата
   *                                        example: "318343e4-03f4-11f1-9289-bc24110cce17"
   *                                    members:
   *                                        type: array
   *                                        description: Массив объектов пользователей, находящихся в голосовом канале
   *                                        items:
   *                                            type: object
   *                                            properties:
   *                                                id:
   *                                                    type: number
   *                                                userName:
   *                                                    type: string
   *                                                avatar:
   *                                                    type: string
   *            401:
   *                description: Пользователь не авторизован
   *            404:
   *                description: Данные о голосовых чатах не найдены
   */
  async getVoiceInfo(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.notFound("что-то пошло не так");
      const userID = req.userId;
      const data = await voiceService.getVoiceInfo(userID);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
  /**
   * @swagger
   * /api/voice/info:
   *  post:
   *    summary: Получение подробной информации об участниках конкретного голосового канала
   *    description: Извлекает данные из Redis по chatID, парсит ID участников и возвращает полные объекты пользователей из базы данных.
   *    tags: [Voice]
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - chatID
   *            properties:
   *              chatID:
   *                type: string
   *                description: Уникальный идентификатор чата (UUID)
   *                example: "318343e4-03f4-11f1-9289-bc24110cce17"
   *    responses:
   *      200:
   *        description: Объект канала с массивом данных пользователей
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              nullable: true
   *              properties:
   *                id:
   *                  type: string
   *                  description: ID чата
   *                  example: "318343e4-03f4-11f1-9289-bc24110cce17"
   *                members:
   *                  type: array
   *                  description: Список полных объектов пользователей, находящихся в голосе
   *                  items:
   *                    type: object
   *                    properties:
   *                      id:
   *                        type: number
   *                        example: 2
   *                      userName:
   *                        type: string
   *                        example: "admin"
   *                      avatar:
   *                        type: string
   *                        example: "http://192.168.1.230:3000/image/thumb.png"
   *      400:
   *        description: Ошибка валидации (например, не передан chatID)
   *      401:
   *        description: Ошибка авторизации (невалидный токен)
   *      404:
   *        description: Пользователь не найден или сессия не активна
   */
  async getVoiceInfoByID(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.notFound("что-то пошло не так");
      const userID = req.userId;
      const { chatID = null } = req.body;
      if (!chatID) errorApi.badRequest("нет chatID");
      const data = await voiceService.getVoiceInfoByID(chatID, userID);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new voiceController();
