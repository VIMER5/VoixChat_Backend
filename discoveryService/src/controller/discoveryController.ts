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
import grpc from "@grpc/grpc-js";
import { serviceInfo, infoResponse } from "model/protoType.js";
class discoveryController2 {
  async registerService(
    call: grpc.ServerUnaryCall<serviceInfo, infoResponse>,
    callback: grpc.sendUnaryData<infoResponse>
  ) {
    try {
      const { nameService = null, ipService = null, portService = null } = call.request ?? {};
      if (!nameService || !ipService || !portService)
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "nameService, ipService, portService is required",
            name: "ValidationError",
          },
          null
        );
      await cacheServoce.addInstance({
        name: nameService,
        port: portService,
        ip: ipService,
      });
      const response: infoResponse = {
        success: true,
        message: `add ${nameService}`,
      };
      callback(null, response);
    } catch (err) {
      console.log(
        `Ебать-ебать, вот и опять пятисотка прилетела! А это значит кто-то получит а-та-та на сервере: ${err}`
      );
      callback({ code: grpc.status.UNKNOWN, message: `${err}` }, null);
    }
  }

  async heartbeat(call: grpc.ServerUnaryCall<serviceInfo, infoResponse>, callback: grpc.sendUnaryData<infoResponse>) {
    try {
      const { nameService = null, ipService = null, portService = null } = call.request ?? {};
      if (!nameService || !ipService || !portService)
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "nameService, ipService, portService is required",
            name: "ValidationError",
          },
          null
        );
      console.log(`сердцебиение💕 от ${nameService} ${ipService}:${portService}`);
      await cacheServoce.upInstance({
        name: nameService,
        port: portService,
        ip: ipService,
      });
      const response: infoResponse = {
        success: true,
        message: `10-4 ${nameService}`,
      };
      callback(null, response);
    } catch (err) {
      console.log(
        `Ебать-ебать, вот и опять пятисотка прилетела! А это значит кто-то получит а-та-та на сервере: ${err}`
      );
      callback({ code: grpc.status.UNKNOWN, message: `${err}` }, null);
    }
  }
  [methodName: string]: grpc.UntypedHandleCall;
}
export default new discoveryController2();
// export default new discoveryController();
