import { Chat } from "module/db/model/chat.js";
import { ChatParticipant } from "module/db/model/chatParticipant.js";
import { User } from "module/db/model/user.js";
import { Op } from "sequelize";
import appService from "./appService.js";
class chatsService {
  async getMyChats(userId: number) {
    let data = await User.findByPk(userId, {
      attributes: ["login"],
      include: [
        {
          model: Chat,
          as: "myChat",
          attributes: ["id", "type", "name", "avatar"],
          through: {
            attributes: ["lastReadMsgId", "updatedAt"],
          },
          include: [
            {
              model: User,
              as: "chatMembers",
              where: {
                id: { [Op.ne]: userId },
              },
              attributes: ["username", "avatar", "id"],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    if (data) {
      data.myChat!.map(async (item) => {
        item.avatar = await appService.normolizeUrlAvatarStr(item.avatar);
        item.chatMembers = await appService.normolizeUrlAvatar(item.chatMembers);
      });
    }
    return data;
  }
}

export default new chatsService();
