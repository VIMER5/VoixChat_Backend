import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import { registerSchema, loginSchema } from "./../validators/auth.validator.js";
import authService from "service/authService.js";
import tokenService from "service/tokenService.js";
import { type TokenPayLoad } from "types/authType.js";
class authController {
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
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      if (!body) throw errorApi.badRequest("Нет данных");
      const { error, value } = loginSchema.validate(body, {
        abortEarly: true,
        stripUnknown: true,
      });
      if (error) throw errorApi.badRequest(error.message);
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
  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { access = null } = req.body;
      if (!access) errorApi.unauthorized("нет токена");
      const payLoad = await tokenService.isValidAccessToken(access);
      if (typeof payLoad == "boolean") throw tokenService.isValidAccessToken("Токен недействительный");
      res.status(200).json(payLoad);
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
  async refresh(req: Request, res: Response, next: NextFunction) {
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
