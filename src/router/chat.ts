import chatController from "controller/chatController.js";
import express from "express";

const chat = express.Router();
chat.get("/getMyChats", chatController.getMyChat);
chat.get("/getChatById/:chatId", chatController.getChatById);
chat.post("/sendMessage", chatController.sendMessage);
export default chat;
