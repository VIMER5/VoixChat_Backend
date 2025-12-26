import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import discoveryController from "./controller/discoveryController.js";
const { ipService = "0.0.0.0", portService = 50051, nameService } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "proto", "discovery.proto"), {
  longs: Number,
  enums: Number,
  defaults: true,
  oneofs: true,
});
const discoveryProto = grpc.loadPackageDefinition(packageDefinition) as any;
const server = new grpc.Server();
server.addService(discoveryProto.discovery.discoveryService.service, discoveryController);

function start() {
  server.bindAsync(`${ipService}:${portService}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(`Ошибка при старте ${nameService}:`, error);
      return;
    }
    server.start();
    console.log(`🚀 ${nameService} запустился и готов ебашить ip:${ipService} port:${port}`);
  });
}

export default { start };
