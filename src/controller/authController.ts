import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
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
      const { error, value } = registerSchema.validate(body, {
        abortEarly: true,
        stripUnknown: true,
      });
      if (error) throw errorApi.badRequest(error.message);
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
