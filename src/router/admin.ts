import express from "express";
import adminController from "../controller/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(adminMiddleware);

router.get("/users", adminController.getAllUsers);
router.post("/ban", adminController.banUser);
router.get("/chats", adminController.getAllChats);
router.post("/clear-history", adminController.clearChatHistory);

export default router;
