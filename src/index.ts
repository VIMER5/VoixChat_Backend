import { connection } from "module/db/index.js";
import express from "express";
const port = process.env.server_port || 3030;
// await connection();
validationENV();
const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Мы стартанули на ${port}`);
});

function validationENV() {
  const envRequired: string[] = ["db_DataBaseName", "db_host", "db_port", "db_login", "db_pass"];
  let errorENV: string[] = [];
  for (const name of envRequired) if (!process.env[name]) errorENV.push(`${name} Required`);
  if (errorENV.length != 0) {
    console.error("Ошибка env:");
    console.log(errorENV);
    process.exit();
  }
}
