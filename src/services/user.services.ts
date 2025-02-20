import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { TUser, TUserUpdate } from "../interfaces/user.interface";
import { users } from "../db/schema/user.schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const db = drizzle(config.db_url!);

//User
const createAUserIntoDB = async (data: TUser) => {
  data.password = await bcrypt.hash(data.password, 10);
  const result = await db.insert(users).values(data);
  return result;
};

const updatePasswordIntoDB = async (email: string, password: string) => {
  password = await bcrypt.hash(password, 10);
  const result = await db
    .update(users)
    .set({ password: password })
    .where(eq(users.email, email));
  return result;
};

const createPasswordResetToken = async (email: string) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db
    .update(users)
    .set({
      passwordResetToken: passwordResetToken,
      passwordResetExpires: passwordResetExpires,
    })
    .where(eq(users.email, email));

  return resetToken;
};

const findUserByEmailFromDB = async (data: string) => {
  const [result] = await db.select().from(users).where(eq(users.email, data));
  return result;
};

const checkPassword = async (inputPassword: string, dbPassword: string) => {
  return bcrypt.compare(inputPassword, dbPassword);
};

// Admin
const findAllUsersFromDB = async () => {
  const result = await db.select().from(users);
  return result;
};

const findUserByIdFromDB = async (id: number) => {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
};

const findUserByRefreshTokenFromDB = async (token: string) => {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.refreshToken, token));
  return result;
};

const findUserByPasswordResetTokenFromDB = async (
  token: string,
  expires: Date
) => {
  const [result] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.passwordResetToken, token),
        gt(users.passwordResetExpires, expires)
      )
    );
  return result;
};

const resetPasswordIntoDB = async (email: string, password: string) => {
  password = await bcrypt.hash(password, 10);
  const result = await db
    .update(users)
    .set({
      password: password,
      passwordChangedAt: new Date(),
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    })
    .where(eq(users.email, email));
  return result;
};

const deleteUserFromDB = async (id: number) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result;
};

const updateUserIntoDB = async (id: number, data: TUserUpdate) => {
  const result = await db.update(users).set(data).where(eq(users.id, id));
  return result;
};

const updateRefreshTokenIntoDB = async (email: string, token: string) => {
  const result = await db
    .update(users)
    .set({ refreshToken: token })
    .where(eq(users.email, email));
  return result;
};

const deleteRefreshTokenFromDB = async (email: string) => {
  const result = await db
    .update(users)
    .set({ refreshToken: null })
    .where(eq(users.email, email));
  return result;
};

export const userServices = {
  createAUserIntoDB,
  findUserByEmailFromDB,
  checkPassword,
  findAllUsersFromDB,
  findUserByIdFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
  updateRefreshTokenIntoDB,
  findUserByRefreshTokenFromDB,
  deleteRefreshTokenFromDB,
  updatePasswordIntoDB,
  createPasswordResetToken,
  resetPasswordIntoDB,
  findUserByPasswordResetTokenFromDB,
};
