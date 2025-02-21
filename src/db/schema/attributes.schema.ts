import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const categories = table(
  "categories",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    categoryName: t.varchar("category_name").notNull(),
  },
  (table) => [t.uniqueIndex("category_name_unique").on(table.categoryName)]
);

const brands = table(
  "brands",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    brandName: t.varchar("brand_name").notNull(),
  },
  (table) => [t.uniqueIndex("brand_name_unique").on(table.brandName)]
);

const tags = table(
  "tags",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    categoryId: t
      .integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    tagName: t.varchar("tag_name").notNull(),
  },
  (table) => [t.uniqueIndex("tag_name_unique").on(table.tagName)]
);

const sizes = table(
  "sizes",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    sizeName: t.varchar("size_name").notNull(),
  },
  (table) => [t.uniqueIndex("size_name_unique").on(table.sizeName)]
);

const colors = table(
  "colors",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    colorName: t.varchar("color_name").notNull(),
  },
  (table) => [t.uniqueIndex("color_name_unique").on(table.colorName)]
);

export { tags, sizes, colors, categories, brands };
