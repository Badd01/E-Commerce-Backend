import { Request, Response } from "express";
import { db } from "../utils/db";
import { products, productImages } from "../db/schema/product.schema";
import { z } from "zod";
import { updateToCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import { productSchema } from "../validations/products.validation";
import { generateUniqueSlug } from "../utils/slugify";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);
    const slug = await generateUniqueSlug(data.name);
    const product = await db
      .insert(products)
      .values({ ...data, slug })
      .returning();

    if (req.file) {
      const imageUrl = await uploadToCloudinary(slug, req.file.path);
      if (!imageUrl) {
        res.status(500).json({ message: "Error while uploading image" });
        return;
      }

      await db.insert(productImages).values({
        productId: product[0].id,
        imageUrl,
        imagePublicId: slug,
      });
    }

    res.status(201).json(product[0]);
  } catch (error) {
    console.error("Error: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};
