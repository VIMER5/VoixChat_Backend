import { User } from "module/db/model/user.js";
import errorApi from "./errorService.js";
import appService from "./appService.js";
import bcrypt from "bcryptjs";
const saltbcrypt = await bcrypt.genSalt(10);
const { cdn_url } = process.env;
class userService {
  async getUser(userID: number) {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw errorApi.notFound("пользователь не найден");
    return {
      login: user.login,
      userName: user.username,
      email: user.email,
      avatar: `${cdn_url}/image/${user.avatar}`,
      status: user.status,
      emailConfirmed: user.emailConfirmed,
      role: user.role,
      isBanned: user.isBanned,
    };
  }

  async updateProfile(userID: number, data: { username?: string; avatar?: string }) {
    const user = await User.findByPk(userID);
    if (!user) throw errorApi.notFound("Пользователь не найден");
    await user.update(data);
    return this.getUser(userID);
  }

  async changePassword(userID: number, passwordOld: string, passwordNew: string) {
    const user = await User.findByPk(userID);
    if (!user) throw errorApi.notFound("Пользователь не найден");
    
    const isMatch = await bcrypt.compare(passwordOld, user.password);
    if (!isMatch) throw errorApi.badRequest("Старый пароль неверный");

    const hashPass = await bcrypt.hash(passwordNew, saltbcrypt);
    await user.update({ password: hashPass });
    return true;
  }

  async getUserByID(userID: number) {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw errorApi.notFound("пользователь не найден");
    return {
      id: user.id,
      userName: user.username,
      avatar: await appService.normolizeUrlAvatarStr(user.avatar),
    };
  }
}

export default new userService();
