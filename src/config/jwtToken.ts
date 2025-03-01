import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const secret = process.env.JWT_SECRET || "secret";

const generateToken = (email: string) => {
  //Refresh Token
  return jwt.sign({ email }, secret, { expiresIn: "1h" });
};

export default generateToken;
