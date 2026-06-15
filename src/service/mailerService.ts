import { transporter } from "module/mailer/index.js";
import crypto from "crypto";
import { poolRedis } from "module/redis/index.js";
const fromSupport = "VoixChat Support <support@voixchat.ru>";
class mailerService {
  async sendVerifyEmailURL(mail: string, login: string) {
    const hash = crypto.randomBytes(20).toString("hex");
    const url = `${process.env.urlVerifyEmail}${hash}`;
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

  async sendResetPasswordURL(mail: string, login: string) {
    const hash = crypto.randomBytes(20).toString("hex");
    const url = `${process.env.urlResetPassword}${hash}`;
    // Используем тот же пул редиса или создаем новый, если нужно. 
    // Для простоты используем poolRedis.сonfirmationСodes
    await poolRedis.сonfirmationСodes.redis.set(hash, mail, {
      EX: 3600, // 1 час на восстановление
      NX: true,
    });
    transporter
      .sendMail({
        from: fromSupport,
        to: mail,
        subject: "Восстановление пароля VoixChat",
        html: `<strong>Привет, ${login}! Перейдите по ссылке для сброса пароля: <a href="${url}">${url}</a></strong>`,
      })
      .then((info) => {
        console.log("Reset email sent: %s", info.messageId);
      })
      .catch(console.error);
  }
}

export default new mailerService();
