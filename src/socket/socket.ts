import { Server, Socket } from "socket.io";
import { CustomRequestSocketIO } from "types/customRequestType.js";
import chatsService from "./../service/chatsService.js";

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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
};
