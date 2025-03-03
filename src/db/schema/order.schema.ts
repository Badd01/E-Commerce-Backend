import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { products } from "./product.schema";

export const statusEnum = pgEnum("status_enum", [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
]);

export const orders = table("orders", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer()
    .notNull()
    .references(() => users.id),
  totalAmount: t.integer().notNull(),
  status: statusEnum().notNull().default("Pending"),
  shippingPhone: t.varchar({ length: 11 }).notNull(),
  shippingAddress: t.text().notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orderItems = table("order_items", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: t
    .integer()
    .notNull()
    .references(() => orders.id),
  productId: t
    .integer()
    .notNull()
    .references(() => products.id),
  quantity: t.integer().notNull(),
  price: t.integer().notNull(),
});
