import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.portService;
const HOST = process.env.host;

async function register() {
  await axios
    .post("http://192.168.1.168:29810/register", {
      name: process.env.nameService,
      host: HOST,
      port: PORT,
    })
    .then((gg) => {
      console.log(gg.data);
    });
}

app.get("/test", (req, res) => {
  res.json({ from: `${HOST}:${PORT}` });
});
app.get("/", (req, res) => {
  res.json({ daw: "da" });
});

function ff() {
  setInterval(async () => {
    await axios
      .post("http://192.168.1.168:29810/heartbeat", {
        name: process.env.nameService,
        host: HOST,
        port: PORT,
      })
      .then((f) => {
        console.log("сердцебиение отправлено💕");
        console.log(f.data);
      });
  }, 8000);
}

app.listen(PORT, () => {
  console.log(`${PORT}`);
  register();
  ff();
});

// import grpc from "@grpc/grpc-js";
// import protoLoader from "@grpc/proto-loader";
// import path from "path";
// import { fileURLToPath } from "url";
// import { addReflection } from "grpc-server-reflection";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const packageDefinition = protoLoader.loadSync(path.join(__dirname, "service.proto"));
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// const server = new grpc.Server();

// server.addService(protoDescriptor.example.MyService.service, {
//   myMethod(call, callback) {
//     console.log(call);
//     callback(null, { message: "Hello" });
//   },
// });

// server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), async () => {
//   console.log(`UserService gRPC`);
//   server.start();
// });
