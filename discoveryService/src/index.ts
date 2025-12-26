import express from "express";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import gRPC from "./gRPC.js";

await isValidENV();
gRPC.start();

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
