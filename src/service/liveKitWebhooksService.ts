import { WebhookEvent } from "livekit-server-sdk";
import { poolRedis } from "module/redis/index.js";
import { getIO } from "socket/index.js";
import userService from "./userService.js";

class liveKitWebhooksService {
  async roomStarted(event: WebhookEvent) {
    await this.existence(event.room!.name);
  }

  async roomFinished(event: WebhookEvent) {
    if (await this.existence(event.room!.name)) return await poolRedis.voiceInfo.redis.del(event.room!.name);
  }
  async participantLeft(event: WebhookEvent) {
    const roomKey = event.room!.name;
    const participantId = event.participant?.identity;
    if (!participantId) return;
    await this.existence(roomKey);
    const members = await this.getMembers(roomKey);
    const io = getIO();
    io.to(`chat:${roomKey}`).emit("disconnectedUserInVoice", {
      body: {
        id: roomKey,
        userID: Number(participantId.split("_")[1]),
      },
    });
    const userIndex = members.findIndex((m: any) => m.id === participantId);
    if (userIndex !== -1) {
      await poolRedis.voiceInfo.redis.json.arrPop(roomKey, {
        path: "$.members",
        index: userIndex,
      });
    }
  }

  async participantJoined(event: WebhookEvent) {
    const roomKey = event.room!.name;
    const participant = event.participant;

    if (!participant) return;

    const newUser = {
      id: participant.identity,
      name: participant.name,
      joinedAt: Date.now(),
      status: "connected",
    };
    await this.existence(roomKey);
    let members = await this.getMembers(roomKey);
    const userIndex = members.findIndex((m: any) => m.id === newUser.id);

    if (userIndex === -1) {
      await poolRedis.voiceInfo.redis.json.set(roomKey, "$.members", [], { NX: true });
      await poolRedis.voiceInfo.redis.json.arrAppend(roomKey, "$.members", newUser);
    } else {
      await poolRedis.voiceInfo.redis.json.set(roomKey, `$.members[${userIndex}]`, newUser);
    }
    await poolRedis.voiceInfo.redis.expire(roomKey, 86400);
    const io = getIO();
    const user = {
      ...(await userService.getUserByID(Number(participant.identity.split("_")[1]))),
      status: newUser.status,
    };
    io.to(`chat:${roomKey}`).emit("connectedUserInVoice", {
      body: {
        id: roomKey,
        userInfo: user,
      },
    });
  }

  private async getMembers(key: string): Promise<any[]> {
    const result = await poolRedis.voiceInfo.redis.json.get(key, {
      path: "$.members",
    });
    return Array.isArray(result) && result.length > 0 ? (result[0] as any[]) : [];
  }

  private async existence(key: string): Promise<boolean> {
    try {
      const types = await poolRedis.voiceInfo.redis.json.type(key, {
        path: "$",
      });
      if (Array.isArray(types) && types[0] === "object") {
        await poolRedis.voiceInfo.redis.expire(key, 86400);
        return true;
      }
      await poolRedis.voiceInfo.redis.del(key);
      await poolRedis.voiceInfo.redis.json.set(key, "$", { members: [] });
      await poolRedis.voiceInfo.redis.expire(key, 86400);

      return true;
    } catch (e) {
      console.error(`Ошибка при проверке ключа ${key}:`, e);
      return false;
    }
  }
}

export default new liveKitWebhooksService();
