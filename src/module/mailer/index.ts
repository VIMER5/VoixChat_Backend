import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.smtp_host,
  port: process.env.smtp_port,
  secure: false,
  auth: {
    user: process.env.smtp_user,
    pass: process.env.smtp_pass,
  },
} as TransportOptions);

// function test() {
//   transporter
//     .sendMail({
//       from: "Example App <no-reply@resend.dev>",
//       to: "top.michan@mail.ru",
//       subject: "Hello from tests",
//       text: "This message was sent from a Node.js integration test.",
//     })
//     .then((info) => {
//       console.log("Message sent: %s", info.messageId);
//       // Get a URL to preview the message in Ethereal's web interface
//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     })
//     .catch(console.error);
// }
