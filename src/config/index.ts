import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 9000;

export default {
  port: port,
  db_url: process.env.DATABASE_URL,
};
