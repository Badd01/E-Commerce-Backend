import {
  doublePrecision,
  integer,
  pgTable,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  categories: varchar({ length: 255 }).notNull(),
  description: text(),
  price: doublePrecision().notNull(),
  oldPrice: doublePrecision(),
  image: varchar({ length: 255 }).notNull(),
  rating: doublePrecision(),
});
