import { connection } from "module/db/index.js";
import errorMiddleware from "middleware/errorMiddleware.js";
import router from "router/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { onConnection } from "./socket/socket.js";
import { guardSocketIo } from "middleware/guardMiddleware.js";
import { initSocketIO, getIO } from "./socket/index.js";
const port = process.env.server_port || 3030;
validationENV();

import { connectionAllRedis } from "module/redis/redisConnect.js";
import { poolRedis } from "module/redis/index.js";
// test();
await connectionAllRedis(poolRedis);
await connection();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

const httpServer = createServer(app);
initSocketIO(
  new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  }),
);
let io = getIO();
io.use(guardSocketIo);
io.on("connection", (socket) => onConnection(io, socket));
httpServer.listen(port, () => {
  console.log(`Мы стартанули на ${port}`);
});

function validationENV() {
  const envRequired: string[] = [
    "db_DataBaseName",
    "db_host",
    "db_port",
    "db_login",
    "db_pass",
    "redis_login",
    "redis_pass",
    "redis_host",
    "redis_port",
    "smtp_host",
    "smtp_port",
    "smtp_user",
    "smtp_pass",
    "domain",
    "ttl_VerifyEmailURL",
    "token_accessSecretKey",
    "ttl_ACCESS_TOKEN",
    "token_refreshSecretKey",
    "ttl_REFRESH_TOKEN",
  ];
  let errorENV: string[] = [];
  for (const name of envRequired) if (!process.env[name]) errorENV.push(`${name} Required`);
  if (errorENV.length != 0) {
    console.error("Ошибка env:");
    console.log(errorENV);
    process.exit();
  }
}
