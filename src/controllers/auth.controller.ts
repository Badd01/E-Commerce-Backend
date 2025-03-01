import { Request, Response } from "express";
import { db } from "../utils/db";
import { users } from "../db/schema/user.schema";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
} from "../utils/config";
import { z } from "zod";
import axios from "axios";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { eq } from "drizzle-orm";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = registerSchema.parse(req.body); //Validation
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser[0]) {
      res.status(409).json({ message: "Email already exists" }); //Conflict
      return;
    }

    const hashedPassword = await hashPassword(password);
    await db.insert(users).values({ name, email, password: hashedPassword });

    res.sendStatus(201);
  } catch (error) {
    console.error("Error: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors }); // Error when validation fails
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body); //Validation
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (
      !user[0] ||
      !user[0].password ||
      !(await comparePassword(password, user[0].password))
    ) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors }); // Error when validation fails
      return;
    }

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

    let user = await db
      .select()
      .from(users)
      .where(eq(users.googleId, id))
      .limit(1);
    if (!user[0]) {
      const newUser = await db
        .insert(users)
        .values({ email, name, googleId: id })
        .returning();
      user[0] = newUser[0];
    }
    const token = jwt.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const authController = { register, login, googleCallback };
