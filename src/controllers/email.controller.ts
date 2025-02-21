import nodemailer from "nodemailer";
import config from "../config";
import { TUserEmail } from "../interfaces/user.interface";

const sendEmail = async (data: TUserEmail) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.mail_id,
      pass: config.mail_password,
    },
  });
  console.log(config.mail_id, config.mail_password);

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "Ecomm <no-reply@ecomm.com>", // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>\
};

export default sendEmail;
