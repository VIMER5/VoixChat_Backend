import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import { registerSchema, loginSchema } from "./../validators/auth.validator.js";
import authService from "service/authService.js";
import tokenService from "service/tokenService.js";
import { CustomRequest } from "./../types/customRequestType.js";
import { type TokenPayLoad } from "types/authType.js";
class authController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Регистрация нового пользователя
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Пользователь успешно зарегистрирован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegisterResponse'
   *       400:
   *         description: Некорректные данные
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      if (!body) throw errorApi.badRequest("Нет данных");
      const { error, value } = registerSchema.validate(body, {
        abortEarly: true,
        stripUnknown: true,
      });
      if (error) throw errorApi.badRequest(error.message);
      const email: string = await authService.register(value);
      res.status(201).json({
        email: email,
      });
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Вход в систему
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Успешный вход
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Некорректные данные
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      if (!body) throw errorApi.badRequest("Нет данных");
      const { error, value } = loginSchema.validate(body, {
        abortEarly: true,
        stripUnknown: true,
      });
      if (error) throw errorApi.badRequest("Неверный логин или пароль");
      const token = await authService.login(value);
      if (token) {
        res.cookie("refreshToken", token.refreshToken, {
          maxAge: 172800000,
          httpOnly: true,
          sameSite: "lax",
          secure: true,
        });
        return res.status(200).json({ access: token.accessToken });
      }
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/auth/validate:
   *   post:
   *     summary: Валидация access token
   *     tags: [Auth]
   *     security:
   *      - bearerAuth: []
   *     responses:
   *       200:
   *         description: Токен валиден
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidateResponse'
   *       401:
   *         description: Токен недействительный
   */
  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization = null } = req.headers;
      if (!authorization || typeof authorization != "string" || !authorization.includes("Bearer"))
        throw errorApi.unauthorized("нет токена");
      const access = authorization.split(" ")[1];
      const payLoad = await tokenService.isValidAccessToken(access);
      if (typeof payLoad == "boolean") throw errorApi.unauthorized("Токен недействительный");
      res.status(200).json(payLoad);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Обновление access token по refresh token
   *     description: Обновляет access token используя refresh token из cookies. Возвращает новый access token.
   *     tags: [Auth]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Токен успешно обновлен
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=172800000; SameSite=Lax; Secure
   *       401:
   *         description: Refresh token недействителен или отсутствует
   *         content:
   *           application/json:
   *             example: "Токен недействительный"
   */
  async tokenUpdateByRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken = null } = req.cookies;
      if (!refreshToken) throw errorApi.unauthorized("refreshToken отсутствует");
      const payLoad = await tokenService.isValidRefreshToken(refreshToken);
      if (typeof payLoad == "boolean") {
        res.clearCookie("refreshToken");
        throw errorApi.unauthorized("Токен недействительный");
      }
      const tokens = await tokenService.createdToken(payLoad.userId, payLoad.login);
      if (tokens) {
        res.cookie("refreshToken", tokens.refreshToken, {
          maxAge: 172800000,
          httpOnly: true,
          sameSite: "lax",
          secure: true,
        });
        return res.status(200).json({ access: tokens.accessToken });
      }
      throw new Error();
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/auth/user/sendVerifyEmailURL:
   *   get:
   *     summary: Отправка письма для подтверждения email
   *     description: Отправляет письмо с ссылкой для подтверждения email на адрес текущего пользователя
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Письмо успешно отправлено
   *       401:
   *         description: Пользователь не авторизован
   *       404:
   *         description: Пользователь не найден
   */
  async sendVerifyEmailURL(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      await authService.sendVerifyEmailURL(req.userId!);
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /api/auth/VerifyEmail/{token}:
   *   get:
   *     summary: Подтверждение email по токену
   *     description: Подтверждает email пользователя по токену из ссылки в письме
   *     tags: [Auth]
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Токен подтверждения email из ссылки
   *         example: "e56e92d5d4c369a950d39f85f70dbd8cf741e369"
   *     responses:
   *       202:
   *         description: Email успешно подтвержден
   *       400:
   *         description: Неверный или просроченный токен
   *       404:
   *         description: Пользователь не найден
   */
  async verifyEmailURL(req: Request, res: Response, next: NextFunction) {
    try {
      const { token = null } = req.params;
      if (!token) throw errorApi.badRequest("Нужен токен подтверждения");
      await authService.verifyEmailURL(token);
      res.status(202).json();
    } catch (err) {
      next(err);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      throw new Error("kjk");
    } catch (err) {
      next(err);
    }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      throw new Error("kjk");
    } catch (err) {
      next(err);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(req.params);
    } catch (err) {
      next(err);
    }
  }
  async password(req: Request, res: Response, next: NextFunction) {
    try {
      throw new Error("kjk");
    } catch (err) {
      next(err);
    }
  }
}
export default new authController();
