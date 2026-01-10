import { Response, Request, NextFunction } from "express";
import errorApi from "service/errorService.js";
class authController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
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
