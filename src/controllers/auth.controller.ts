import { Request, Response } from "express";
import { db } from "../utils/db";
import {
  passwordResetTokens,
  refreshTokens,
  users,
} from "../db/schema/user.schema";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN_SECRET,
} from "../utils/config";
import { z } from "zod";
import axios from "axios";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import { generateTokens } from "../utils/generateToken";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.parse(req.body); //Validation
    const existingUser = (
      await db.select().from(users).where(eq(users.email, result.email))
    )[0];
    if (existingUser) {
      res.status(409).json({ message: "Email already exists" }); //Conflict
      return;
    }

    const hashedPassword = await hashPassword(result.password);
    await db.insert(users).values({ ...result, password: hashedPassword });
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Error register: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message }); // Error when validation fails
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.parse(req.body); //Validation
    const data = (
      await db.select().from(users).where(eq(users.email, result.email))
    )[0];
    if (
      !data?.password ||
      !(await comparePassword(result.password, data.password))
    ) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Delete all refresh tokens of the user if server crashes
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, data.id));

    const { token, refreshToken } = generateTokens(data.id, data.role);

    await db.insert(refreshTokens).values({
      userId: data.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Logged in successfully",
      data: {
        name: data.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error login: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message }); // Error when validation fails
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken));
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error logout: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const tokenRecord = (
      await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken))
    )[0];

    if (!tokenRecord) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    if (tokenRecord.expiresAt < new Date()) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken));
      res.status(401).json({ message: "Expired refresh token" });
      return;
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      id: number;
    };

    const data = (
      await db.select().from(users).where(eq(users.id, decoded.id))
    )[0];
    if (!data) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const { token } = generateTokens(data.id, data.role);
    res.status(200).json({
      message: "Refreshed token",
      token,
    });
  } catch (error) {
    console.error("Error when handle refresh token: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );
    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { id, email, name } = userResponse.data;

    let user = (await db.select().from(users).where(eq(users.googleId, id)))[0];
    if (!user) {
      const newUser = (
        await db.insert(users).values({ email, name, googleId: id }).returning()
      )[0];
      user = newUser;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error google Callback: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = forgotPasswordSchema.parse(req.body);
    const data = (
      await db.select().from(users).where(eq(users.email, result.email))
    )[0];

    if (!data) {
      res.status(404).json({ message: "Email not found" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex"); // For client
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); // For database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(passwordResetTokens).values({
      userId: data.id,
      token: hashedToken,
      expiresAt,
    });

    await sendEmail(result.email, token);
    res.status(200).json({
      message: "Send email successfully",
    });
  } catch (error) {
    console.error("Error forgot password: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const resetToken = (
      await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token))
    )[0];

    if (!resetToken || resetToken.expiresAt < new Date()) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    // Update hashed password to db
    const hashedPassword = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetToken.userId));

    // Delete token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetToken.id));

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error reset password: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

export const authController = {
  register,
  login,
  logout,
  googleCallback,
  forgotPassword,
  resetPassword,
  refreshToken,
};
