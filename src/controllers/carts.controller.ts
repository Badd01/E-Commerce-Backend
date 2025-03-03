import { Request, Response } from "express";
import { db } from "../utils/db";
import { carts, cartItems } from "../db/schema/cart.schema";
import { and, eq } from "drizzle-orm";

const addToCart = async (req: Request, res: Response): Promise<void> => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);

  if (!productId || !quantity) {
    res.status(400).json({ message: "Invalid product id or quantity" });
    return;
  }
  try {
    const userId = req.user!.id;
    let cart = (
      await db.select().from(carts).where(eq(carts.userId, userId))
    )[0];

    // If cart not found, create
    if (!cart)
      cart = (await db.insert(carts).values({ userId }).returning())[0];

    // Check item in cart
    const existingItem = (
      await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.productId, productId))
    )[0];
    if (existingItem) {
      // If item already in cart, update
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // If item not in cart, add
      await db
        .insert(cartItems)
        .values({ cartId: cart.id, productId, quantity });
    }

    res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const cart = (
      await db.select().from(carts).where(eq(carts.userId, userId))
    )[0];
    if (!cart) {
      res.json({ items: [] });
      return;
    }

    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  const productId = Number(req.body.productId);
  if (!productId) {
    res.status(400).json({ message: "Invalid product id" });
    return;
  }

  try {
    const userId = req.user!.id;
    const cart = (
      await db.select().from(carts).where(eq(carts.userId, userId))
    )[0];

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const existingItem = (
      await db
        .select()
        .from(cartItems)
        .where(
          and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId))
        )
    )[0];

    if (!existingItem) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    await db.delete(cartItems).where(eq(cartItems.productId, productId));

    res.sendStatus(204);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const cart = (
      await db.select().from(carts).where(eq(carts.userId, userId))
    )[0];

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    res.sendStatus(204);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const cartsController = {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
};
