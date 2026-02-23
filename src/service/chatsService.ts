import { Chat } from "module/db/model/chat.js";
import { ChatParticipant } from "module/db/model/chatParticipant.js";
import { User } from "module/db/model/user.js";
import { Op } from "sequelize";
import appService from "./appService.js";
import errorApi from "./errorService.js";
import { getIO } from "socket/index.js";
import { Message } from "module/db/model/message.js";
import { newMessageRequest } from "types/ChatsType.js";
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
            {
              required: false,
              model: Message,
              limit: 20,
              attributes: ["id", "content", "type", "createdAt", "updatedAt", "userId", "chatId"],
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: User,
                  attributes: ["id", "username", "avatar"],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!data) return null;
    const result = data.get({ plain: true });
    if (result.myChat) {
      await Promise.all(
        result.myChat.map(async (chat: any) => {
          chat.avatar = await appService.normolizeUrlAvatarStr(chat.avatar);
          chat.chatMembers = await appService.normolizeUrlAvatar(chat.chatMembers);
          if (chat._Messages && chat._Messages.length > 0) {
            await Promise.all(
              chat._Messages.map(async (msg: any) => {
                if (msg._User) {
                  msg._User.avatar = await appService.normolizeUrlAvatarStr(msg._User.avatar);
                }
                delete msg.userId;
                delete msg.chatId;
              }),
            );
          }
        }),
      );
    }
    return result;
  }
  async getChatById(chatId: string, userId: number) {
    const isParticipant = await ChatParticipant.findOne({
      where: { chatId, userId },
    });
    if (!isParticipant) throw errorApi.forbidden("Вы не являетесь участником этого чата");
    const chatCurrent = await Chat.findByPk(chatId, {
      attributes: ["id", "type", "name", "avatar"],
      include: [
        {
          model: User,
          as: "chatMembers",
          where: {
            id: { [Op.ne]: userId },
          },
          attributes: ["id", "username", "avatar"],
          through: {
            attributes: [],
          },
        },
        {
          required: false,
          model: Message,
          order: [["createdAt", "DESC"]],
          limit: 20,
          attributes: ["id", "content", "type", "createdAt", "updatedAt", "userId", "chatId"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "avatar"],
            },
          ],
        },
      ],
    });

    if (!chatCurrent) throw errorApi.notFound("Чат не найден");

    const chat = chatCurrent.get({ plain: true });
    chat.avatar = await appService.normolizeUrlAvatarStr(chat.avatar);
    if (chat.chatMembers) {
      chat.chatMembers = await appService.normolizeUrlAvatar(chat.chatMembers);
    }
    if (chat._Messages && chat._Messages.length > 0) {
      await Promise.all(
        chat._Messages.map(async (msg: any) => {
          if (msg._User) msg._User.avatar = await appService.normolizeUrlAvatarStr(msg._User.avatar);
          delete msg.userId;
          delete msg.chatId;
        }),
      );
    }
    return {
      ...chat,
      _ChatParticipant: {
        lastReadMsgId: isParticipant.lastReadMsgId,
        updatedAt: isParticipant.updatedAt,
      },
    };
  }
  async getMoreMessages(chatId: string, beforeId: number) {
    const chatDataMSG = await Message.findAll({
      where: {
        chatId: chatId,
        id: { [Op.lt]: beforeId },
      },
      limit: 20,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "content", "type", "createdAt", "updatedAt", "userId", "chatId"],
      include: [
        {
          model: User,
          as: "_User",
          attributes: ["id", "username", "avatar"],
        },
      ],
    });
    if (!chatDataMSG) throw errorApi.notFound("Чат не найден");
    const chat = chatDataMSG.map((msg) => msg.get({ plain: true }));
    if (chat && chat.length > 0) {
      await Promise.all(
        chat.map(async (msg: any) => {
          if (msg._User) msg._User.avatar = await appService.normolizeUrlAvatarStr(msg._User.avatar);
          delete msg.userId;
          delete msg.chatId;
        }),
      );
    }
    return chat;
  }
  async sendMessage(data: newMessageRequest) {
    const chat = await this.getChatById(data.chatId, data.userId);
    const io = getIO();
    if (chat) {
      let message = await Message.create({
        content: data.content,
        userId: data.userId,
        chatId: data.chatId,
        type: data.type,
      });

      await message.reload({
        include: [
          {
            model: User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      });
      if (message._User) {
        const urlAva = await appService.normolizeUrlAvatarStr(message._User.avatar);
        if (urlAva) message._User.avatar = urlAva;
      }
      io.to(`chat:${data.chatId}`).emit("newMessage", {
        chatId: data.chatId,
        body: {
          id: message.id,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          _User: {
            ...message._User!.dataValues,
          },
        },
      });
      return "ok";
    }
  }
}

export default new chatsService();
