import express from "express";
import discoveryController from "@controller/discoveryController.js";
const router = express.Router();
router.post("/register", discoveryController.register);
router.post("/heartbeat", discoveryController.heartbeat);
router.post("/services/:name", discoveryController.services);
export default router;
