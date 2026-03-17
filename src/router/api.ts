import express from "express";
import auth from "./auth.js";
import user from "./user.js";
import guardMiddleware from "./../middleware/guardMiddleware.js";
import sfu from "./sfu.js";
const api = express.Router();

api.use("/auth", auth);
api.use("/user", guardMiddleware, user);
api.use("/sfu", guardMiddleware, sfu);
export default api;
