import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { LiveTokenRequest } from "types/stanType.js";
import chatsService from "./chatsService.js";
import { getIO } from "socket/index.js";

const { apiKeySFU, apiSecretSFU, ttlTokenSFU, hostSFU } = process.env;
const roomService = new RoomServiceClient(hostSFU!, apiKeySFU, apiSecretSFU);
class sfuService {
  async genTokenLive(data: LiveTokenRequest, userID: number): Promise<{ token: string }> {
    const chat = await chatsService.getChatById(data.roomName, userID);
    const participants = await roomService.listParticipants(data.roomName);
    // console.log(chat);
    const at = new AccessToken(apiKeySFU, apiSecretSFU, {
      identity: `user_${userID}`,
      name: data.roomName,
      ttl: ttlTokenSFU,
    });
    at.addGrant({
      roomJoin: true,
      room: data.roomName,
      canPublish: true,
      canSubscribe: true,
    });
    if (chat.type == "private" && participants.length === 0) {
      const io = getIO();
      chat.chatMembers.forEach((user: any) => {
        io.to(`user:${user.id}`).emit("newCallVoice", {
          body: {
            chatID: chat.id,
            chatName: chat.name ?? chat.chatMembers[0].username,
            avatar: chat.avatar ?? chat.chatMembers[0].avatar,
          },
        });
      });

      // io.to(`chat:${data.roomName}`).emit();
    }
    return {
      token: await at.toJwt(),
    };
  }
}

export default new sfuService();
