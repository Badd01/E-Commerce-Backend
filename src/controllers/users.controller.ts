import { Request, Response } from "express";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/user.schema";
import { comparePassword, hashPassword } from "../utils/auth";
import { z } from "zod";
import {
  updateUserSchema,
  updateRoleSchema,
  changePasswordSchema,
} from "../validations/users.validation";
// User
const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  try {
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error get user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = updateUserSchema.parse(req.body);
    const updateUser = (
      await db.update(users).set(data).where(eq(users.id, userId)).returning()
    )[0];
    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updateUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user!.id;

    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user?.password) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Old password is incorrect" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    res.status(200).json({ message: "Password change successfully" });
  } catch (error) {
    console.error("Error change password: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin
const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUser = await db.select().from(users);
    res.status(200).json({ data: allUser });
  } catch (error) {
    console.error("Error get all user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateRoleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    if (!userId) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const data = updateRoleSchema.parse(req.body);
    const updateUser = (
      await db
        .update(users)
        .set({ role: data.role })
        .where(eq(users.id, userId))
        .returning()
    )[0];
    res
      .status(200)
      .json({ message: "Role updated successfully", data: updateUser });
  } catch (error) {
    console.error("Error update role user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const id = req.user!.id;
    if (!userId) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    if (id === userId) {
      res.status(400).json({ message: "You can't delete yourself" });
      return;
    }
    // Delete user => auto delete refresh token because of cascade
    await db.delete(users).where(eq(users.id, userId));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error delete user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const usersController = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  changePassword,
  updateRoleUser,
};
