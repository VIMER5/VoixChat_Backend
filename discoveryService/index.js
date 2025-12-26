// import express from "express";

// const discovery = express();
// discovery.use(express.json());

// const services = {};

// discovery.post("/register", (req, res) => {
//   const { name, host, port } = req.body;
//   services[name] ??= [];
//   services[name].push({
//     host,
//     port,
//   });
//   res.status(200).json(`добавлен ${name}`);
//   console.log(`добавлен ${name}`);
// });

// discovery.get("/services/:name", (req, res) => {
//   console.log(services);
//   res.json(services[req.params.name] || []);
// });

// discovery.listen(4001, () => console.log("старт"));

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
