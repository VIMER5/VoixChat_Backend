import express from "express";
import auth from "./auth.js";
import user from "./user.js";
import admin from "./admin.js";
import guardMiddleware from "./../middleware/guardMiddleware.js";
import sfu from "./sfu.js";
import voice from "./voice.js";
const api = express.Router();

api.use("/auth", auth);
api.use("/user", guardMiddleware, user);
api.use("/admin", guardMiddleware, admin);
api.use("/sfu", guardMiddleware, sfu);
api.use("/voice", guardMiddleware, voice); //
export default api;
