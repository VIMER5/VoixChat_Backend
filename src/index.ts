import { connection } from "module/db/index.js";
import errorMiddleware from "middleware/errorMiddleware.js";
import router from "router/index.js";
import express from "express";
const port = process.env.server_port || 3030;
validationENV();

import { connectionAllRedis } from "module/redis/redisConnect.js";
import { poolRedis } from "module/redis/index.js";
await connectionAllRedis(poolRedis);
await connection();

const app = express();
app.use(express.json());
app.use(router);
app.use(errorMiddleware);
app.listen(port, () => {
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
  ];
  let errorENV: string[] = [];
  for (const name of envRequired) if (!process.env[name]) errorENV.push(`${name} Required`);
  if (errorENV.length != 0) {
    console.error("Ошибка env:");
    console.log(errorENV);
    process.exit();
  }
}
