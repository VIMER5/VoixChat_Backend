import express from "express";
import friendController from "controller/friendController.js";
const friend = express.Router();

friend.get("/request", friendController.getFriendRequest);
friend.patch("/accept", friendController.acceptFriendRequest);
friend.delete("/decline", friendController.declineFriendRequest);

friend.get("/", friendController.getUserFriend);
friend.post("/", friendController.addUserFriend);
friend.delete("/", friendController.removeFriend);

export default friend;
