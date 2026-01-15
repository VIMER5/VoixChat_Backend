import JWT from "jsonwebtoken";
import errorApi from "./errorService.js";
class tokenService {
  async createdToken(userId: number, login: string) {
    const accessToken = JWT.sign({ userId: userId, login: login }, process.env.token_accessSecretKey!, {
      expiresIn: Number(process.env.ttl_ACCESS_TOKEN),
    });
    const refreshToken = JWT.sign({ userId: userId, login: login }, process.env.token_refreshSecretKey!, {
      expiresIn: Number(process.env.ttl_REFRESH_TOKEN),
    });
    return { accessToken, refreshToken };
  }
}

export default new tokenService();
