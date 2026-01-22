import { User } from "module/db/model/user.js";
import errorApi from "./errorService.js";

class userService {
  async getUser(userID: number) {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw errorApi.notFound("пользователь не найден");
    return {
      login: user.login,
      userName: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      emailConfirmed: user.emailConfirmed,
    };
  }
}

export default new userService();
