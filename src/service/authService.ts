import { dataRegisterUser } from "types/authType.js";
import { User } from "module/db/model/user.js";
import errorApi from "./errorService.js";
import bcrypt from "bcryptjs";
const saltbcrypt = await bcrypt.genSalt(10);
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
    });
    return user.email;
  }
}

export default new authService();
