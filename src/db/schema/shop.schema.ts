import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const categories = table("categories", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text().notNull().unique(),
  slug: t.text().notNull().unique(),
});

export const tags = table("tags", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text().notNull().unique(),
  slug: t.text().notNull().unique(),
  categoryId: t
    .integer()
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

export const colors = table("colors", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text().notNull().unique(),
});

export const years = table("years", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.integer().notNull().unique(),
});
