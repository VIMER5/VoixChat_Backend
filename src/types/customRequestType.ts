import { Request } from "express";
import { Socket } from "socket.io";
export interface CustomRequest extends Request {
  userId?: number;
  login?: string;
  role?: "user" | "admin";
  isBanned?: boolean;
}

export interface CustomRequestSocketIO extends Socket {
  userId?: number;
  login?: string;
  role?: "user" | "admin";
  isBanned?: boolean;
}
