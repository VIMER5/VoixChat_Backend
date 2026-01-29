import { dataRegisterUser, dataLoginUser } from "types/authType.js";
import { User } from "module/db/model/user.js";
import { poolRedis } from "module/redis/index.js";
import errorApi from "./errorService.js";
import mailerService from "./mailerService.js";
import tokenService from "./tokenService.js";
import bcrypt from "bcryptjs";
import { getIO } from "socket/index.js";
const saltbcrypt = await bcrypt.genSalt(10);
const avatars = [
  "e4c99baaff6db314",
  "40d494e0c33a917e",
  "c841cd87cd04e839",
  "798d3c4123886829",
  "44534ed963a2d0d0",
  "016272aaa1952190",
  "44534ed963a2d0d0",
];
class authService {
  async register(data: dataRegisterUser) {
    const checkLogin = await User.findOne({ where: { login: data.login } });
    if (checkLogin) throw errorApi.badRequest(`Логин ${data.login} занят`);
    const checkEmail = await User.findOne({ where: { email: data.email } });
    if (checkEmail) throw errorApi.badRequest(`Почта ${data.email} уже используется`);
    const hashPass = await bcrypt.hash(data.password, saltbcrypt);

    const user = await User.create({
      login: data.login,
      username: data.username,
      password: hashPass,
      email: data.email,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    });
    mailerService.sendVerifyEmailURL(user.email, user.login);
    return user.email;
  }
  async login(data: dataLoginUser) {
    const user = await User.findOne({ where: { login: data.login } });
    if (user) {
      if (await bcrypt.compare(data.password, user.password)) {
        return await tokenService.createdToken(user.id, user.login);
      }
    }
    throw errorApi.badRequest("Неверный логин или пароль");
  }
  async sendVerifyEmailURL(userID: number) {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw errorApi.notFound("Пользователь не найден");
    await mailerService.sendVerifyEmailURL(user.email, user.login);
  }

  async verifyEmailURL(token: string) {
    const io = getIO();
    const mail = await poolRedis.сonfirmationСodes.redis.get(token);
    if (!mail) throw errorApi.notFound("Подтверждение не найдено");
    const user = await User.findOne({ where: { email: mail } });
    if (!user) throw errorApi.notFound("Пользователь не найден");
    await user.update({ emailConfirmed: true }, { where: { email: mail } });
    io.to(`user:${user.id}`).emit("emailConfirmed", {
      body: true,
    });
  }
}

export default new authService();
