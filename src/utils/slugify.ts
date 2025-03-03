import slugify from "slugify";
import { db } from "./db";
import { products } from "../db/schema/product.schema";
import { eq } from "drizzle-orm";

export const generateUniqueSlug = async (name: string): Promise<string> => {
  let baseSlug = slugify(name, {
    lower: true, //convert to lower case
    strict: true, //strip special characters
    remove: /[*+~.()'"!:@]/g, //remove characters that match regex
  });

  //Check in db avoid error duplicate
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    if (!existing[0]) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
