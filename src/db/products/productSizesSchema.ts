import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema";

export const productSizesTable = pgTable("product_sizes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  size: varchar({ length: 10 }).notNull(),
});
