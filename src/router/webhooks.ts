import liveKitWebhooksController from "controller/liveKitWebhooksController.js";
import express from "express";
const webhooks = express.Router();

webhooks.use("/livekit", express.text({ type: "application/webhook+json" }), liveKitWebhooksController.webhooks);

export default webhooks;
