import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const products = table(
  "products",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    productName: t.varchar("product_name", { length: 100 }).notNull(),
    tagId: t
      .integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    price: t.integer().notNull(),
    finalPrice: t.integer().notNull(),
    discount: t.doublePrecision().notNull(),
    rating: t.doublePrecision(),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    updatedAt: t.timestamp(),
  },
  (table) => [t.uniqueIndex("product_name_idx").on(table.productName)]
);

const categories = table(
  "categories",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    categoryName: t.varchar("category_name", { length: 100 }).notNull(),
  },
  (table) => [t.uniqueIndex("category_name_idx").on(table.categoryName)]
);

const tags = table(
  "tags",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    categoryId: t
      .integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    tagName: t.varchar("tag_name", { length: 100 }).notNull(),
  },
  (table) => [t.uniqueIndex("tag_name_idx").on(table.tagName)]
);

const sizes = table(
  "sizes",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    sizeName: t.varchar("size_name", { length: 10 }).notNull(),
  },
  (table) => [t.uniqueIndex("size_name_idx").on(table.sizeName)]
);

const colors = table(
  "colors",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    colorName: t.varchar("color_name", { length: 30 }).notNull(),
  },
  (table) => [t.uniqueIndex("color_name_idx").on(table.colorName)]
);

const productVariants = table("product_variants", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: t
    .integer("size_id")
    .notNull()
    .references(() => sizes.id),
  colorId: t
    .integer("color_id")
    .notNull()
    .references(() => colors.id),
  quantity: t.integer().notNull(),
  isStock: t.boolean("is_stock").notNull(),
});

const productImage = table("image_products", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: t
    .integer("product_variant_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  colorId: t
    .integer("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "cascade" }),
  imageUrl: t.text("product_image_path").notNull(),
  publicId: t.text("public_id").notNull(),
});

export {
  products,
  tags,
  sizes,
  colors,
  productVariants,
  categories,
  productImage,
};
