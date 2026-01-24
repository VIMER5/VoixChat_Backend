import express from "express";
import friendController from "controller/friendController.js";
const friend = express.Router();

friend.get("/", friendController.getUserFriend);

export default friend;
