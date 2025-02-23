import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { tags, sizes, colors, brands } from "./attributes.schema";
import { users } from "./user.schema";
import { sql } from "drizzle-orm";

const products = table(
  "products",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    productName: t.varchar("product_name", { length: 100 }).notNull(),
    slug: t.varchar("slug_name", { length: 100 }).notNull(),
    tagId: t
      .integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    brandId: t
      .integer("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    totalRating: t.real("total_rating"),
    sold: t.integer("total_sold").notNull().default(0),
    createdAt: t
      .timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t
      .timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [t.uniqueIndex("slug_name_unique").on(table.slug)]
);

const productVariants = table(
  "product_variants",
  {
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
    price: t.integer().notNull(),
    quantity: t.integer().notNull(),
    isStock: t.boolean("is_stock").notNull(),
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
    t
      .uniqueIndex("variant_unique")
      .on(table.productId, table.sizeId, table.colorId),
  ]
);

const productImages = table(
  "product_images",
  {
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
    createdAt: t
      .timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t
      .timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [t.uniqueIndex("image_unique").on(table.publicId)]
);

const ratings = table(
  "ratings",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: t
      .integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: t
      .integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    rating: t.integer().notNull(),
    createdAt: t
      .timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t
      .timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [t.uniqueIndex("rating_unique").on(table.userId, table.productId)]
);

export { products, productVariants, productImages, ratings };
