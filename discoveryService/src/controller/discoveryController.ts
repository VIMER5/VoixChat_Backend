import { Request, Response } from "express";
class discoveryController {
  async register(req: Request, res: Response) {
    try {
      const { name = null, host = null, port = null } = req.body ?? {};
      console.log(name);
    } catch (err) {
      console.log(err);
    }
  }
  async heartbeat(req: Request, res: Response) {
    try {
    } catch (err) {
      console.log(err);
    }
  }
  async services(req: Request, res: Response) {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}

export default new discoveryController();
