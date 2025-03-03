import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { products } from "./product.schema";

export const reviews = table("reviews", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .integer()
    .notNull()
    .references(() => users.id),
  productId: t
    .integer()
    .notNull()
    .references(() => products.id),
  rating: t.integer().notNull(),
  comment: t.text(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
