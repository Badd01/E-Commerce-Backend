import nodemailer from "nodemailer";
import { MAIL_ID, MAIL_PASSWORD } from "../utils/config";

const sendEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: MAIL_ID,
      pass: MAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  const resetLink = `http://localhost:9000/api/auth/reset-password?token=${token}`;
  const info = await transporter.sendMail({
    from: `Ecomm ${MAIL_ID}`, // sender address
    to: email, // list of receivers
    subject: "Reset password", // Subject line
    text: `Click here to reset password: ${resetLink}`,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
