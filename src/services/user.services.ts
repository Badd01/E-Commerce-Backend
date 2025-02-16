import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { TUser } from "../interfaces/user.interface";
import { users } from "../db/schema/user.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const db = drizzle(config.db_url!);

//Create
const createAnAccountIntoDB = async (data: TUser) => {
  data.password = await bcrypt.hash(data.password, 10);
  const result = await db.insert(users).values(data);
  return result;
};

const findUserByEmailFromDB = async (data: string) => {
  const [result] = await db.select().from(users).where(eq(users.email, data));
  return result;
};

const checkPassword = async (inputPassword: string, dbPassword: string) => {
  return bcrypt.compare(inputPassword, dbPassword);
};

export const userServices = {
  createAnAccountIntoDB,
  findUserByEmailFromDB,
  checkPassword,
};
