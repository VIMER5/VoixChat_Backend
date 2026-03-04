import { Server, Socket } from "socket.io";
import { CustomRequestSocketIO } from "types/customRequestType.js";
import chatsService from "./../service/chatsService.js";

let onlineMap = new Map();

export const onConnection = async (io: Server, socket: CustomRequestSocketIO) => {
  const userId = socket.userId;

  console.log(`User connected: ${userId}`);
  const f = await chatsService.getMyChats(userId!);
  if (f?.myChat) {
    for (const id of f.myChat) {
      socket.join(`chat:${id.id}`);
      console.log(`User connected: chat:${id.id}`);
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
    console.log(`User disconnected: ${userId}`);
  });
};
