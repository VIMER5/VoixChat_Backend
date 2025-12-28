import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, "proto", "discovery.proto"));
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci);

const client = new recipesProto.discovery.discoveryService(`localhost:50051`, grpc.credentials.createInsecure());

setInterval(() => {
  const start = process.hrtime.bigint();
  client.registerService({}, () => {
    const end = process.hrtime.bigint();
    console.log(Number(end - start) / 1e6, "ms");
  });
}, 1000);
