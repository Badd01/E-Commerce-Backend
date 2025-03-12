import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import * as s from "./shop.schema";

export const products = table("products", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text().notNull(),
  slug: t.text().notNull().unique(),
  description: t.text(),
  price: t.integer().notNull(),
  stock: t.integer().notNull(),
  categoryId: t
    .integer()
    .notNull()
    .references(() => s.categories.id, { onDelete: "cascade" }),
  tagId: t
    .integer()
    .notNull()
    .references(() => s.tags.id, { onDelete: "cascade" }),
  colorId: t
    .integer()
    .notNull()
    .references(() => s.colors.id, { onDelete: "cascade" }),
  yearId: t
    .integer()
    .notNull()
    .references(() => s.years.id, { onDelete: "cascade" }),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productImages = table("product_images", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageUrl: t.text("image_url").notNull(),
  imagePublicId: t.text("image_public_id").notNull(),
});
