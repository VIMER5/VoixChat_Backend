import { CustomRequest } from "types/customRequestType.js";
import { Response, NextFunction } from "express";
import errorApi from "service/errorService.js";
import friendService from "service/friendService.js";
class friendController {
  /**
   * @swagger
   * /api/user/friend/:
   *   get:
   *     summary: Получение списка друзей пользователя
   *     description: Возвращает список всех друзей текущего пользователя
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список друзей успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                  avatar:
   *                   type: string
   *                   description: сылка на аватар в CDN
   *                  id:
   *                    type: number
   *                    description: ID друга
   *                  login:
   *                    type: string
   *                    description: login друга
   *                  username:
   *                    type: string
   *                    description: username друга
   *                  status:
   *                    type: string
   *                    description: status друга
   *                  _Friendship:
   *                    type: object
   *                    properties:
   *                      status:
   *                        type: string
   *       400:
   *         description: Некорректный запрос
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Пользователь не найден
   */
  async getUserFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw errorApi.badRequest("что-то пошло не так");
      const friends = await friendService.getFriends(req.userId);
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/user/friend/:
   *   post:
   *     summary: Добавление пользователя в друзья
   *     description: 'Отправляет запрос на добавление в друзья. Формат данных: "login#id"'
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [user]
   *             properties:
   *               user:
   *                 type: string
   *                 description: 'Идентификатор пользователя в формате "login#id"'
   *                 example: "john_doe#123"
   *     responses:
   *       200:
   *         description: Запрос на добавление в друзья отправлен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                   description: id связи пользователей
   *                 userId:
   *                   type: number
   *                   description: id инициатора запроса
   *                 friendId:
   *                   type: number
   *                   description: id кому отправили запрос
   *                 status:
   *                   type: string
   *                   description: статус связи
   *       400:
   *         description: Некорректные данные
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Пользователь не найден
   */
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
  /**
   * @swagger
   * /api/user/friend/request:
   *   get:
   *     summary: Получение входящих запросов в друзья
   *     description: Возвращает список пользователей, отправивших запрос на добавление в друзья
   *     tags: [Friends]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список запросов успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                  avatar:
   *                   type: string
   *                   description: сылка на аватар в CDN
   *                  id:
   *                    type: number
   *                    description: ID друга
   *                  login:
   *                    type: string
   *                    description: login друга
   *                  username:
   *                    type: string
   *                    description: username друга
   *                  status:
   *                    type: string
   *                    description: status друга
   *                  _Friendship:
   *                    type: object
   *                    properties:
   *                      status:
   *                        type: string
   *       400:
   *         description: Некорректный запрос
   *       401:
   *         description: Пользователь не авторизован
   */
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
