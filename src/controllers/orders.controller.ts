import { Request, Response } from "express";
import { db } from "../utils/db";
import { carts, cartItems } from "../db/schema/cart.schema";
import { products } from "../db/schema/product.schema";
import { orders, orderItems } from "../db/schema/order.schema";
import { eq, inArray } from "drizzle-orm";
import { users } from "../db/schema/user.schema";
import {
  createOrderSchema,
  orderSchema,
  updateOrderSchema,
} from "../validations/orders.validation";
import { z } from "zod";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { shippingAddress, shippingPhone } = createOrderSchema.parse(
      req.body
    );

    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];

    const finalShippingPhone = shippingPhone || user.phoneNumber;
    const finalShippingAddress = shippingAddress || user.address;

    if (!finalShippingPhone || !finalShippingAddress) {
      res.status(400).json({
        message: "Shipping address and phone number are required",
      });
      return;
    }

    const cart = (
      await db.select().from(carts).where(eq(carts.userId, userId))
    )[0];
    if (!cart) {
      res.status(400).json({ message: "Cart not found" });
      return;
    }

    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));
    if (!items?.length) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    let totalAmount = 0;
    for (const item of items) {
      const product = (
        await db.select().from(products).where(eq(products.id, item.productId))
      )[0];
      totalAmount += product.price * item.quantity;
    }

    const orderData = orderSchema.parse({
      userId,
      totalAmount,
      shippingAddress: finalShippingAddress,
      shippingPhone: finalShippingPhone,
    });
    const order = (await db.insert(orders).values(orderData).returning())[0];

    const productIds = items.map((item) => item.productId);
    const productPrices = await db
      .select({ id: products.id, price: products.price })
      .from(products)
      .where(inArray(products.id, productIds));

    // Map for key-value
    const productPriceMap = new Map(
      productPrices.map((product) => [product.id, product.price])
    );

    const orderItemData = items.map((item) => {
      const price = productPriceMap.get(item.productId);
      if (price === undefined) {
        res.status(400).json({ error: "Product price not found" });
        throw new Error("Product price not found");
      }
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      };
    });

    await db.insert(orderItems).values(orderItemData);

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    res.status(200).json({ message: "Order created", orderId: order.id });
  } catch (error) {
    console.error("Error creating order: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id));

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting orders: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin
const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = Number(req.body.orderId);
  if (!orderId) {
    res.status(400).json({ message: "Invalid order id" });
    return;
  }
  try {
    const { status } = req.body;
    const orderStatusData = updateOrderSchema.parse(status);
    const order = (
      await db
        .update(orders)
        .set(orderStatusData)
        .where(eq(orders.id, orderId))
        .returning()
    )[0];

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id));

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting order: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getOrdersByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await db.select().from(orders);

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting orders: ", error);
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

export const ordersController = {
  createOrder,
  getOrdersByUser,
  getOrdersByAdmin,
  updateOrderStatus,
  getOrder,
  getRevenue,
};
