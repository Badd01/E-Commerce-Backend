import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const products = table(
  "products",
  {
    id: t.integer("product_id").primaryKey().generatedAlwaysAsIdentity(),
    productName: t.varchar("product_name", { length: 50 }).notNull(),
    productImage: t.text("product_image").notNull(),
    tagId: t
      .integer("tag_id")
      .references(() => tags.id, { onDelete: "cascade" }),
    price: t.integer().notNull(),
    discount: t.smallint().notNull().default(0),
    rating: t.smallint(),
    createAt: t.timestamp("create_at").defaultNow(),
  },
  (table) => [t.uniqueIndex("product_name_idx").on(table.productName)]
);

export const categories = table(
  "categories",
  {
    id: t.integer("category_id").primaryKey().generatedAlwaysAsIdentity(),
    categoryName: t.varchar("category_name", { length: 256 }).notNull(),
  },
  (table) => [t.uniqueIndex("category_name_idx").on(table.categoryName)]
);

export const tags = table(
  "tags",
  {
    id: t.integer("tag_id").primaryKey().generatedAlwaysAsIdentity(),
    categoryId: t
      .integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" }),
    tagName: t.varchar("tag_name", { length: 256 }).notNull(),
  },
  (table) => [t.uniqueIndex("tag_name_idx").on(table.tagName)]
);

export const sizes = table(
  "sizes",
  {
    id: t.integer("size_id").primaryKey().generatedAlwaysAsIdentity(),
    sizeName: t.varchar("size_name", { length: 10 }).notNull(),
  },
  (table) => [t.uniqueIndex("size_name_idx").on(table.sizeName)]
);

export const colors = table(
  "colors",
  {
    id: t.integer("color_id").primaryKey().generatedAlwaysAsIdentity(),
    colorName: t.varchar("color_name", { length: 20 }).notNull(),
  },
  (table) => [t.uniqueIndex("color_name_idx").on(table.colorName)]
);

export const productVariants = table("product_variants", {
  id: t.integer("product_variant_id").primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer("product_id")
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: t.integer("size_id").references(() => sizes.id),
  colorId: t.integer("color_id").references(() => colors.id),
});

export const productParams = table("product_params", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productVariantId: t
    .integer("product_variant_id")
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: t.integer().notNull(),
  isStock: t.boolean("is_stock").default(true),
});
