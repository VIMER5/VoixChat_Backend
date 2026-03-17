import express from "express";
import api from "./api.js";
import sfuController from "controller/sfuController.js";
const sfu = express.Router();

sfu.post("/live-token", sfuController.getLiveToken);

export default sfu;
