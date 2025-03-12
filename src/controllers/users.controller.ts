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
  userIdSchema,
} from "../validations/users.validation";
// User
const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userId } = userIdSchema.parse({ id: Number(req.params.id) });
    const data = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error get user: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = updateUserSchema.parse(req.body);
    const data = await db
      .update(users)
      .set(result)
      .where(eq(users.id, userId))
      .returning()
      .then((res) => res[0]);
    res.status(200).json({ message: "Profile updated successfully", data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
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
      res.status(400).json({ message: error.errors[0].message });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin
const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.select().from(users);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error get all user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateRoleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userId } = userIdSchema.parse({ id: Number(req.params.id) });
    if (req.user!.id === userId || userId === 1) {
      res.status(400).json({ message: "You can't update role this user" });
      return;
    }
    const result = updateRoleSchema.parse(req.body);
    const data = await db
      .update(users)
      .set({ role: result.role })
      .where(eq(users.id, userId))
      .returning()
      .then((res) => res[0]);
    res.status(200).json({ message: "Role updated successfully", data });
  } catch (error) {
    console.error("Error update role user: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userId } = userIdSchema.parse({ id: Number(req.params.id) });
    const id = req.user!.id;
    if (id === userId) {
      res.status(400).json({ message: "You can't delete yourself" });
      return;
    }
    // Delete user => auto delete refresh token because of cascade
    const data = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error delete user: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
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
