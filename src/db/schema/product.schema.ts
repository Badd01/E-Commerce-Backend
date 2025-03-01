import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import * as c from "./category.schema";
import * as b from "./base.schema";

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
    .references(() => c.categories.id),
  tagId: t
    .integer()
    .notNull()
    .references(() => c.tags.id),
  colorId: t
    .integer()
    .notNull()
    .references(() => b.colors.id),
  seasonId: t
    .integer()
    .notNull()
    .references(() => b.seasons.id),
  yearId: t
    .integer()
    .notNull()
    .references(() => b.years.id),
  purposeId: t
    .integer()
    .notNull()
    .references(() => b.purposes.id),
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
