import { poolRedis } from "module/redis/index.js";
import chatsService from "./chatsService.js";
import userService from "./userService.js";

class voiceService {
  async getVoiceInfo(userID: number) {
    let { myChat = null } = await chatsService.getChatsID(userID);
    if (!myChat) return null;
    const data = await Promise.all(
      myChat.map(async (id: any) => {
        const types = await poolRedis.voiceInfo.redis.json.type(id.id, {
          path: "$",
        });
        if (Array.isArray(types) && types[0] === "object") {
          let result = await poolRedis.voiceInfo.redis.json.get(id.id, {
            path: "$.members",
          });

          if (result && Array.isArray(result) && result[0] && Array.isArray(result[0])) {
            const memberIds = await Promise.all(
              result[0].map(async (item: any) => {
                const temp = Number(item.id.split("_")[1]);

                return await userService.getUserByID(temp);
              }),
            );
            return { ...id, members: memberIds };
          }
        }
        return;
      }),
    );

    return data.filter((item) => item != null);
  }
}

export default new voiceService();
