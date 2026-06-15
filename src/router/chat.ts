import chatController from "controller/chatController.js";
import express from "express";

const chat = express.Router();
chat.get("/getMyChats", chatController.getMyChat);
chat.post("/createGroup", chatController.createGroupChat);
chat.get("/getChatById/:chatId", chatController.getChatById);
chat.post("/getMoreMessages", chatController.getMoreMessages);
chat.post("/sendMessage", chatController.sendMessage);
export default chat;
