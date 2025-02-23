import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { productVariants } from "./product.schema";
import { users } from "./user.schema";
import { sql } from "drizzle-orm";

export const orderStatusEnum = pgEnum("status_enum", [
  "pending",
  "cancelled",
  "processing",
  "on delivery",
  "completed",
]);

export const paymentMethodEnum = pgEnum("payment_method_enum", ["COD"]);

const carts = table("carts", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalPrice: t.integer("total_price").notNull().default(0),
  totalQuantity: t.integer("total_quantity").notNull().default(0),
  createdAt: t
    .timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t
    .timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const cart_items = table(
  "card_items",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    cartId: t
      .integer("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productVariantId: t
      .integer("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: t.integer("quantity").notNull(),
    price: t.integer("price").notNull().default(0),
    createdAt: t
      .timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t
      .timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    t.uniqueIndex("cart_item_unique").on(table.cartId, table.productVariantId),
  ]
);

const orders = table("orders", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: t.text("address").notNull(),
  totalQuantity: t.integer("total_quantity").notNull(),
  totalPrice: t.integer("total_price").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull().default("COD"),
  status: orderStatusEnum("status").notNull().default("pending"),
  orderDate: t
    .timestamp("order_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t
    .timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const order_items = table(
  "order_items",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    orderId: t
      .integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productVariantId: t
      .integer("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: t.integer("quantity").notNull(),
    price: t.integer("price").notNull().default(0),
  },
  (table) => [
    t
      .uniqueIndex("order_item_unique")
      .on(table.orderId, table.productVariantId),
  ]
);

export { carts, cart_items, order_items, orders };
