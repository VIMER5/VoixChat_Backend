import { transporter } from "module/mailer/index.js";
import crypto from "crypto";
import { poolRedis } from "module/redis/index.js";
const fromSupport = "VoixChat Support <support@resend.dev>";
class mailerService {
  async sendVerifyEmailURL(mail: string, login: string) {
    const hash = crypto.randomBytes(20).toString("hex");
    const url = `${process.env.domain}confirmEmail/${hash}`;
    await poolRedis.сonfirmationСodes.redis.set(hash, mail, {
      EX: Number(process.env.ttl_VerifyEmailURL),
      NX: true,
    });
    transporter
      .sendMail({
        from: fromSupport,
        to: mail,
        subject: "confirm email",
        html: `<strong>привет ${login} URL: ${url} </strong>`,
      })
      .then((info) => {
        console.log("Message sent: %s", info.messageId);
      })
      .catch(console.error);
  }
}

export default new mailerService();
