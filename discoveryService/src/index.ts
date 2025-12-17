import express from "express";
import router from "./router.js";

await isValidENV();

const discoveryApp = express();
discoveryApp.use(express.json());
discoveryApp.use(router);

discoveryApp.listen(process.env.portService, () => {
  console.log(`🚀 ${process.env.nameService} запустился и готов ебашить`);
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
