import express from "express";
import friendController from "controller/friendController.js";
const friend = express.Router();

friend.get("/request", friendController.getFriendRequest);

friend.get("/", friendController.getUserFriend);
friend.post("/", friendController.addUserFriend);

export default friend;
