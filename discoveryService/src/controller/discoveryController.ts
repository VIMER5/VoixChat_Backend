import cacheServoce from "service/cacheServoce.js";
import grpc from "@grpc/grpc-js";
import { serviceInfoProto, infoResponse, ListServiceInstancesResponse, servicesNameRequest } from "model/protoType.js";
class discoveryController {
  async registerService(
    call: grpc.ServerUnaryCall<serviceInfoProto, infoResponse>,
    callback: grpc.sendUnaryData<infoResponse>
  ) {
    try {
      const { nameService = null, portService = null } = call.request ?? {};
      const ipService = this.getServiceIP(call);
      if (!nameService || !ipService || !portService)
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "nameService, portService is required",
            name: "ValidationError",
          },
          null
        );
      await cacheServoce.addInstance({
        nameService,
        portService,
        ipService,
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

  async heartbeat(
    call: grpc.ServerUnaryCall<serviceInfoProto, infoResponse>,
    callback: grpc.sendUnaryData<infoResponse>
  ) {
    try {
      const { nameService = null, portService = null } = call.request ?? {};
      const ipService = this.getServiceIP(call);
      if (!nameService || !ipService || !portService)
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "nameService, portService is required",
            name: "ValidationError",
          },
          null
        );
      console.log(`сердцебиение💕 от ${nameService} ${ipService}:${portService}`);
      await cacheServoce.upInstance({
        nameService,
        portService,
        ipService,
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

  async getServicesbyName(
    call: grpc.ServerUnaryCall<servicesNameRequest, ListServiceInstancesResponse>,
    callback: grpc.sendUnaryData<ListServiceInstancesResponse>
  ) {
    try {
      const { nameService = null } = call.request ?? {};
      if (!nameService)
        return callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "nameService is required",
            name: "ValidationError",
          },
          null
        );
      const data = await cacheServoce.getInstances(nameService);
      const response: ListServiceInstancesResponse = {
        success: true,
        Instances: data,
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

  private getServiceIP(call: any): string {
    return call.getPeer().split(":")[0];
  }
}
export default new discoveryController();
