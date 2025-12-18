import express from "express";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await isValidENV();

const discoveryApp = express();
discoveryApp.use(express.json());
discoveryApp.use(router);

discoveryApp.listen(process.env.portService, () => {
  console.log(`🚀 ${process.env.nameService} запустился и готов ебашить❤️‍🔥 port:${process.env.portService}`);
});

async function isValidENV() {
  let errorEnv: string[] = [];
  if (!process.env.nameService) errorEnv.push("Укажите nameService в env");
  if (!process.env.portService) errorEnv.push("Укажите portService в env");
  if (errorEnv.length != 0) {
    for (let item of errorEnv) {
      console.log(item);
    }
    process.exit();
  }
}
