import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import discoveryController2 from "./controller/discoveryController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "proto", "discovery.proto"));
const proto = grpc.loadPackageDefinition(packageDefinition);
const discoveryProto = proto as any;
const server = new grpc.Server();
server.addService(discoveryProto.discovery.discoveryService.service, discoveryController2);

function d() {
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error("Failed to bind server:", error);
      return;
    }
    server.start();
    console.log(`Discovery service running on port ${port}`);
  });
}

export default { d };
