import { Server, Socket } from "socket.io";
import { CustomRequestSocketIO } from "types/customRequestType.js";

export const onConnection = (io: Server, socket: CustomRequestSocketIO) => {
  const userId = socket.userId;

  console.log(`User connected: ${userId}`);
  socket.join(`user:${userId}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
};
