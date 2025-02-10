import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema";

export const productColorsTable = pgTable("product_colors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  color: varchar({ length: 30 }).notNull(),
});
