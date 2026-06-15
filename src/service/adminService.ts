import { User } from "../module/db/model/user.js";
import { Message } from "../module/db/model/message.js";
import { Chat } from "../module/db/model/chat.js";
import errorApi from "./errorService.js";

class AdminService {
  async banUser(userId: number, isBanned: boolean) {
    const user = await User.findByPk(userId);
    if (!user) throw errorApi.notFound("Пользователь не найден");
    await user.update({ isBanned });
    return user;
  }

  async clearChatHistory(chatId: string) {
    const chat = await Chat.findByPk(chatId);
    if (!chat) throw errorApi.notFound("Чат не найден");
    await Message.destroy({ where: { chatId } });
    return { message: "История чата очищена" };
  }

  async getAllUsers() {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    });
  }

  async getAllChats() {
    return await Chat.findAll();
  }
}

export default new AdminService();
