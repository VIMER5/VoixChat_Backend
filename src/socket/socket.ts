import { Server, Socket } from "socket.io";
import { CustomRequestSocketIO } from "types/customRequestType.js";
import chatsService from "./../service/chatsService.js";
import friendService from "service/friendService.js";

let onlineMap = new Map();

export const onConnection = async (io: Server, socket: CustomRequestSocketIO) => {
  const userId = socket.userId;

  console.log(`User connected: ${userId}`);
  const userChat = await chatsService.getMyChats(userId!);
  const userFriends = await friendService.getFriends(userId!);
  onlineMap.set(userId, "online");
  if (userFriends && Array.isArray(userFriends)) {
    for (const user of userFriends) {
      socket.join(`friend:${user.id}`);
      console.log(`User[${userId}] connected room: friend:${user.id}`);
    }
    socket.to(`friend:${userId}`).emit("friend-online", {
      userID: userId,
      status: "online",
    });
    const friendsStatuses = userFriends.map((friend) => ({
      userID: friend.id,
      status: onlineMap.get(friend.id) || "offline",
    }));
    socket.emit("friends-statuses", friendsStatuses);
  }

  if (userChat?.myChat) {
    for (const id of userChat.myChat) {
      socket.join(`chat:${id.id}`);
      console.log(`User[${userId}] connected room: chat:${id.id}`);
    }
  }
  socket.join(`user:${userId}`);

  socket.on("call-user", (data) => {
    console.log(data);
    socket.to(`chat:${data.to}`).emit("offer-call", {
      sdp: data.sdp,
      from: socket.id,
      chatID: data.to,
    });
  });
  socket.on("offer-answer", (data) => {
    console.log(data);
    socket.to(data.to).emit("answer-made", {
      sdp: data.sdp,
      from: socket.id,
    });
  });
  socket.on("ice-candidate", (data) => {
    socket.to(`chat:${data.to}`).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    onlineMap.set(userId, "offline");
    console.log(`User disconnected: ${userId}`);
    socket.to(`friend:${userId}`).emit("friend-offline", {
      userID: userId,
      status: "offline",
    });
  });
};
