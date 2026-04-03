import voiceController from "controller/voiceController.js";
import express from "express";

const voice = express.Router();
voice.get("/info", voiceController.getVoiceInfo);
export default voice;
