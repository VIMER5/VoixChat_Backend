// import express from "express";
// import axios from "axios";

// const app = express();
// const PORT = 9000;
// const HOST = "192.168.1.168";

// async function register() {
//   await axios
//     .post("http://192.168.1.168:4001/register", {
//       name: "user-service",
//       host: HOST,
//       port: PORT,
//     })
//     .then((gg) => {
//       console.log(gg.data);
//     });
// }

// app.get("/test", (req, res) => {
//   res.json({ from: `${HOST}:${PORT}` });
// });
// app.get("/", (req, res) => {
//   res.json({ daw: "da" });
// });

// app.listen(PORT, () => {
//   console.log(`${PORT}`);
//   register();
// });

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { addReflection } from "grpc-server-reflection";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "service.proto"));
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(protoDescriptor.example.MyService.service, {
  myMethod(call, callback) {
    console.log(call);
    callback(null, { message: "Hello" });
  },
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), async () => {
  console.log(`UserService gRPC`);
  server.start();
});
