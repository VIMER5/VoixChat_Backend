import chatController from "controller/chatController.js";
import express from "express";

const chat = express.Router();
chat.get("/getMyChats", chatController.getMyChat);
export default chat;
