import { Chat } from "module/db/model/chat.js";
import { ChatParticipant } from "module/db/model/chatParticipant.js";
import { User } from "module/db/model/user.js";
import { Friendship } from "module/db/model/friendship.js";
import { Op } from "sequelize";
import appService from "./appService.js";
import errorApi from "./errorService.js";
import { getIO } from "socket/index.js";
import { Message } from "module/db/model/message.js";
import { newMessageRequest } from "types/ChatsType.js";
class chatsService {
  async getChatsID(userId: number) {
    let data = await User.findByPk(userId, {
      attributes: [],
      include: [{ model: Chat, as: "myChat", attributes: ["id"], through: { attributes: [] } }],
    });
    if (!data) return null;
    const result = data.get({ plain: true });
    return result;
  }
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

    if (chatCurrent.type === "private") {
      const participants = await ChatParticipant.findAll({
        where: { chatId },
      });
      if (participants.length === 2) {
        const otherParticipant = participants.find((p) => p.userId !== userId);
        if (otherParticipant) {
          const friendship = await Friendship.findOne({
            where: {
              [Op.or]: [
                { userId: userId, friendId: otherParticipant.userId },
                { userId: otherParticipant.userId, friendId: userId },
              ],
              status: "accepted",
            },
          });
          if (!friendship) throw errorApi.forbidden("Вы должны быть в друзьях, чтобы общаться в этом чате");
        }
      }
    }

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

  async createPrivateChat(user1Id: number, user2Id: number) {
    // Проверяем, существует ли уже приватный чат между этими пользователями
    // Находим чаты первого пользователя
    const user1Chats = await ChatParticipant.findAll({
      where: { userId: user1Id },
      attributes: ["chatId"],
    });

    if (user1Chats.length > 0) {
      const chatIds = user1Chats.map((cp) => cp.chatId);

      // Ищем среди этих чатов те, где есть второй пользователь и тип чата - private
      const existingChat = await Chat.findOne({
        where: {
          id: { [Op.in]: chatIds },
          type: "private",
        },
        include: [
          {
            model: User,
            as: "chatMembers",
            where: { id: user2Id },
            required: true,
            through: { attributes: [] },
          },
        ],
      });

      if (existingChat) return existingChat;
    }

    // Если чата нет, создаем новый
    const newChat = await Chat.create({
      type: "private",
    });

    await ChatParticipant.bulkCreate([
      { chatId: newChat.id, userId: user1Id },
      { chatId: newChat.id, userId: user2Id },
    ]);

    return newChat;
  }

  async createGroupChat(userId: number, name: string, members: number[], avatar?: string) {
    // Создаем сам чат
    const newChat = await Chat.create({
      type: "group",
      name: name,
      avatar: avatar || null,
    });

    // Формируем список участников (создатель + приглашенные)
    const allMembers = Array.from(new Set([userId, ...members]));
    
    await ChatParticipant.bulkCreate(
      allMembers.map(memberId => ({
        chatId: newChat.id,
        userId: memberId
      }))
    );

    // Уведомляем всех участников через сокеты о новом чате
    const io = getIO();
    allMembers.forEach(memberId => {
      io.to(`user:${memberId}`).emit("newChat", { chatId: newChat.id });
    });

    return newChat;
  }
}

export default new chatsService();
