import { Sequelize } from "sequelize";
import { models, setupAssociations } from "./model/index.js";

const { db_DataBaseName, db_host, db_port, db_login, db_pass } = process.env;

const db = new Sequelize(db_DataBaseName!, db_login!, db_pass!, {
  host: db_host!,
  port: Number(db_port),
  dialect: "mysql",
  logging: false,
});

async function initModels() {
  for (const model of models) {
    model.initModel(db);
    console.log(`Модель ${model.name} инициализирована`);
  }

  setupAssociations();
  console.log("Связи моделей настроены");
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
    process.exit();
  }
}
