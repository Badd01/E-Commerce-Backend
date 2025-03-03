import { Request, Response } from "express";
import { db } from "../utils/db";
import { eq, and } from "drizzle-orm";
import { users } from "../db/schema/user.schema";
import { comparePassword, hashPassword } from "../utils/auth";
import { z } from "zod";
import { ADMIN } from "../utils/config";
import {
  updateUserSchema,
  changePasswordSchema,
  reviewSchema,
} from "../validations/users.validation";
import { orders, orderItems } from "../db/schema/order.schema";
import { reviews } from "../db/schema/review.schema";
import { products } from "../db/schema/product.schema";
// User
const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error get user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = updateUserSchema.parse(req.body);
    const user = (
      await db.update(users).set(data).where(eq(users.id, userId)).returning()
    )[0];
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    // Delete user => auto delete refresh token because of cascade
    await db.delete(users).where(eq(users.id, userId));
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.sendStatus(204);
  } catch (error) {
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

const createReview = async (req: Request, res: Response): Promise<void> => {
  const productId = Number(req.body.productId);
  const rating = Number(req.body.rating);
  if (!productId || !rating) {
    res.status(400).json({ message: "Invalid product ID or rating" });
    return;
  }
  try {
    const comment = req.body;
    const userId = req.user!.id;
    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.status, "Delivered")))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id));
    if (!order?.length) {
      res
        .status(403)
        .json({ message: "You can only review purchased products" });
      return;
    }

    const reviewData = reviewSchema.parse({
      userId,
      productId,
      rating,
      comment,
    });

    await db.insert(reviews).values(reviewData);

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error("Error creating review:", error);
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
    const role = req.user!.role;
    if (role !== ADMIN) {
      res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
      return;
    }

    const allUser = await db.select().from(users);
    res.status(200).json({ allUser });
  } catch (error) {
    console.error("Error get all user: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getRevenue = async (req: Request, res: Response): Promise<void> => {
  try {
    const revenue = await db
      .select({ totalAmount: orders.totalAmount })
      .from(orders)
      .where(eq(orders.status, "Delivered"));

    if (!revenue?.length) {
      res.json({ totalRevenue: 0 });
      return;
    }

    const totalRevenue = revenue.reduce(
      (prev, curr) => prev + curr.totalAmount,
      0
    );

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const usersController = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  changePassword,
  getRevenue,
  createReview,
};
