import slugify from "slugify";
import { db } from "./db";
import { products } from "../db/schema/product.schema";
import { categories, tags } from "../db/schema/shop.schema";
import { eq } from "drizzle-orm";

export const generateUniqueSlug = async (
  name: string,
  table: typeof categories | typeof tags | typeof products
): Promise<string> => {
  let baseSlug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Strip special characters
    remove: /[*+~.()'"!:@]/g, // Remove unwanted characters
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.select().from(table).where(eq(table.slug, slug));

    if (!existing[0]) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
