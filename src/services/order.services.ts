import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import {
  carts,
  cart_items,
  orders,
  order_items,
} from "../db/schema/order.schema";
import { eq, and } from "drizzle-orm";
import {
  TCart,
  TCartItem,
  TCartItemUpdate,
  TCartUpdate,
  TOrder,
  TOrderItem,
  TOrderUpdate,
} from "../interfaces/order.interface";

const db = drizzle(config.db_url!);
const date = new Date(Date.now());

const findCartByUserIdFromDB = async (userId: number) => {
  const [result] = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId));
  return result;
};

const createNewCart = async (data: TCart) => {
  const [result] = await db.insert(carts).values(data).returning();
  return result;
};

const findCartItemFromDB = async (cartId: number, productVariantId: number) => {
  const [result] = await db
    .select()
    .from(cart_items)
    .where(
      and(
        eq(cart_items.cartId, cartId),
        eq(cart_items.productVariantId, productVariantId)
      )
    );
  return result;
};

const updateCartItemFromDB = async (
  cartItemId: number,
  data: TCartItemUpdate
) => {
  data.updatedAt = date;
  const result = await db
    .update(cart_items)
    .set(data)
    .where(eq(cart_items.id, cartItemId))
    .returning();
  return result;
};

const createNewCartItem = async (data: TCartItem) => {
  const result = await db.insert(cart_items).values(data).returning();
  return result;
};

const updateCartIntoDB = async (cartId: number, data: TCartUpdate) => {
  data.updatedAt = date;
  await db.update(carts).set(data).where(eq(carts.id, cartId));
};

const findCartItemByCartIdFromDB = async (cartId: number) => {
  const result = await db
    .select()
    .from(cart_items)
    .where(eq(cart_items.cartId, cartId));
  return result;
};

const createNewOrder = async (data: TOrder) => {
  const [result] = await db.insert(orders).values(data).returning();
  return result;
};

const createNewOrderItem = async (data: TOrderItem[]) => {
  const result = await db.insert(order_items).values(data).returning();
  return result;
};

const deleteCartFromDB = async (cartId: number) => {
  await db.delete(cart_items).where(eq(cart_items.cartId, cartId));
  await db.delete(carts).where(eq(carts.id, cartId));
};

const findOrderByUserIdFromDB = async (userId: number) => {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId));
  return result;
};

const findOrderItemByOrderIdFromDB = async (orderId: number) => {
  const result = await db
    .select()
    .from(order_items)
    .where(eq(order_items.orderId, orderId));
  return result;
};

const updateOrderIntoDB = async (orderId: number, data: TOrderUpdate) => {
  data.updatedAt = date;
  const result = await db
    .update(orders)
    .set(data)
    .where(eq(orders.id, orderId))
    .returning();
  return result;
};

export const orderServices = {
  findCartByUserIdFromDB,
  createNewCart,
  findCartItemFromDB,
  updateCartItemFromDB,
  createNewCartItem,
  updateCartIntoDB,
  createNewOrder,
  findCartItemByCartIdFromDB,
  createNewOrderItem,
  deleteCartFromDB,
  findOrderByUserIdFromDB,
  findOrderItemByOrderIdFromDB,
  updateOrderIntoDB,
};
