import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
import { dataRegisterUser } from "types/authType.js";
import { registerSchema } from "./../validators/auth.validator.js";
import authService from "service/authService.js";
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
      // const { username = null, email = null, password = null } = req.body;
      // if (!username || username.length! > 4) throw errorApi.badRequest("username должен состоять из 5 символов");
      // if (!email || username.length! > 4) throw errorApi.badRequest("username должен состоять из 5 символов");
      throw new Error("kjk");
    } catch (err) {
      next(err);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      throw new Error("kjk");
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
