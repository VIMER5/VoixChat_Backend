import express from "express";
import api from "./api.js";
import webhooks from "./webhooks.js";
const router = express.Router();

router.use("/api", api);
router.use("/webhooks", webhooks);
export default router;
