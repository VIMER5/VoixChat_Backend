import { AccessToken } from "livekit-server-sdk";
import { LiveTokenRequest } from "types/stanType.js";
import chatsService from "./chatsService.js";

const { apiKeySFU, apiSecretSFU, ttlTokenSFU } = process.env;

class sfuService {
  async genTokenLive(data: LiveTokenRequest, userID: number): Promise<{ token: string }> {
    const chat = await chatsService.getChatById(data.roomName, userID);
    console.log(chat);
    const at = new AccessToken(apiKeySFU, apiSecretSFU, {
      identity: `user_${userID}`,
      name: data.participantName,
      ttl: ttlTokenSFU,
    });
    at.addGrant({
      roomJoin: true,
      room: data.roomName,
      canPublish: true,
      canSubscribe: true,
    });
    return {
      token: await at.toJwt(),
    };
  }
}

export default new sfuService();
