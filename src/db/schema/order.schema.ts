import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { products, productVariants } from "./product.schema";
import { users } from "./user.schema";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "completed",
  "cancelled",
]);

const orderItem = table("order_items", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer("product_id")
    .notNull()
    .references(() => products.id),
  productVariantId: t
    .integer("product_variant_id")
    .notNull()
    .references(() => productVariants.id),
  orderId: t
    .integer("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  quantity: t.integer().notNull(),
  unitPrice: t.integer("unit_price").notNull(),
  totalPrice: t.integer("total_price").notNull(),
});

const order = table("orders", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  finalPrice: t.integer("final_price").notNull(),
  address: t.text().notNull(),
  phoneNumber: t.varchar({ length: 10 }).notNull(),
  status: orderStatusEnum().default("pending"),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp(),
});

export { orderItem, order };
