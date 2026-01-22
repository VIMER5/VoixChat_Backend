import { Server } from "socket.io";

let io: Server;

export const initSocketIO = (serverInstance: Server) => {
  io = serverInstance;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
