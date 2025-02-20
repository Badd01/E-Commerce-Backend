import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 9000;

export default {
  port: port,
  db_url: process.env.DATABASE_URL,
  mail_id: process.env.MAIL_ID,
  mail_password: process.env.MAIL_PASSWORD,
};
