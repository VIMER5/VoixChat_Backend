import { Sequelize } from "sequelize";
import { models } from "./model/index.js";

const { DataBase, host, port, login, pass } = process.env;

const db = new Sequelize(DataBase!, login!, pass!, {
  host: host!,
  port: Number(port),
  dialect: "mysql",
  logging: false,
});

async function initModels() {
  for (const model of models) {
    model.initModel(db);
    console.log(`Модель ${model.name} инициализирована`);
  }
}

export async function connection() {
  try {
    await initModels();
    await db.authenticate();
    console.log("Успешное подключение к БД, начинаю синхронизацию моделей.");
    await db.sync({ alter: true });
    console.log(`Процесс синхронизации моделей прошёл успешно.`);
  } catch (err) {
    console.log(err);
  }
}
