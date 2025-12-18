import { Request, Response } from "express";
import cacheServoce from "service/cacheServoce.js";
class discoveryController {
  async register(req: Request, res: Response) {
    try {
      const { name = null, host = null, port = null } = req.body ?? {};
      if (!name || !host || !port)
        return res.status(400).json({
          access: false,
          message: "нет данных",
        });
      await cacheServoce.addInstance({
        name: name,
        port: port,
        ip: host,
      });
      res.status(200).json({
        access: true,
        message: "ок",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async heartbeat(req: Request, res: Response) {
    try {
      const { name = null, host = null, port = null } = req.body ?? {};
      if (!name || !host || !port)
        return res.status(400).json({
          access: false,
          message: "нет данных",
        });
      console.log(`сердцебиение💕 от ${name} ${host}:${port}`);
      await cacheServoce.upInstance({
        name: name,
        port: port,
        ip: host,
      });
      res.status(200).json({
        access: true,
        message: "ок",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async services(req: Request, res: Response) {
    try {
      const { name = null } = req.params ?? {};
      if (!name)
        return res.status(400).json({
          access: false,
          message: "нет данных",
        });
      const data = await cacheServoce.getInstances(name);
      res.status(200).json({
        access: true,
        message: data ?? null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new discoveryController();
