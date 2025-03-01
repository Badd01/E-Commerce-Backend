import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { products } from "./product.schema";

export const carts = table("carts", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer()
    .notNull()
    .references(() => users.id),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const cartItems = table("cart_items", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer()
    .notNull()
    .references(() => products.id),
  cartId: t
    .integer()
    .notNull()
    .references(() => carts.id),
  quantity: t.integer().notNull(),
});
