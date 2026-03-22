import { NextFunction, Request, Response } from "express";
import { WebhookEvent, WebhookReceiver } from "livekit-server-sdk";
import liveKitWebhooksService from "service/liveKitWebhooksService.js";
const receiver = new WebhookReceiver(process.env.apiKeySFU!, process.env.apiSecretSFU!);
class liveKitWebhooksController {
  async webhooks(req: Request, res: Response, next: NextFunction) {
    try {
      const event: WebhookEvent = await receiver.receive(req.body, req.get("Authorization"));
      switch (event.event) {
        case "room_started":
          liveKitWebhooksService.roomStarted(event);
          break;
        case "room_finished":
          liveKitWebhooksService.roomFinished(event);
          break;
        case "participant_joined":
          liveKitWebhooksService.participantJoined(event);
          break;
        case "participant_left":
          liveKitWebhooksService.participantLeft(event);
          break;
        case "participant_connection_aborted":
          break;
        case "track_published":
          break;
        case "track_unpublished":
          break;
        case "egress_started":
          break;
        case "egress_updated":
          break;
        case "egress_ended":
          break;
        case "ingress_started":
          break;
        case "ingress_ended":
          break;
      }
      res.status(200).send("OK");
    } catch (e) {
      next(e);
    }
  }
}

export default new liveKitWebhooksController();
