import express from "express";
import axios from "axios";
import httpProxy from "http-proxy";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proxy = httpProxy.createProxyServer();
const app = express();

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, "service.proto"));
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci) as any;

async function getService(name: string) {
  const { data } = await axios.get(`http://192.168.1.168:4001/services/${name}`);
  return data;
}

app.use("/api/user/:name", async (req, res) => {
  const client = new recipesProto.example.MyService(`192.168.1.168:50051`, grpc.credentials.createInsecure());
  client[req.params.name](req.body, (err: any, response: any) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.json(response);
  });
  // const instances = await getService("user-service");
  // if (!instances.length) {
  //   return res.status(503).send("Service no");
  // }
  // proxy.web(req, res, {
  //   target: `http://${instances[0].host}:${instances[0].port}`,
  // });
});
app.listen(8080, () => console.log("Gateway 8080"));
