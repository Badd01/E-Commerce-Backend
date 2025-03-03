import { Request, Response } from "express";
import { db } from "../utils/db";
import { products, productImages } from "../db/schema/product.schema";
import { z } from "zod";
import {
  deleteFromCloudinary,
  updateToCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary";
import { productSchema } from "../validations/products.validation";
import { generateUniqueSlug } from "../utils/slugify";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { reviews } from "../db/schema/review.schema";

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * 10;
    const validColumns = {
      name: products.name,
      price: products.price,
      createdAt: products.createdAt,
    };

    const sortBy =
      (req.query.sortBy as keyof typeof validColumns) || "createdAt"; // type: name, price,createdAt => key: name || price || createdAt

    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const productList = await db
      .select()
      .from(products)
      .orderBy(
        sortOrder === "asc" ? asc(products[sortBy]) : desc(products[sortBy])
      )
      .limit(limit)
      .offset(offset);

    const total = (await db.select().from(products)).length;

    const productIdList = productList.map((product) => product.id);
    const imageList = await db
      .select({
        productId: productImages.productId,
        imageUrl: productImages.imageUrl,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIdList));

    const productWithImageList = productList.map((product) => ({
      ...product,
      image: imageList.filter((image) => image.productId === product.id),
    }));

    res.status(200).json({ products: productWithImageList, total, page });
  } catch (error) {
    console.error("Error getting products: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = (
      await db.select().from(products).where(eq(products.slug, slug))
    )[0];

    // Slug unique
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const image = (
      await db
        .select({ imageUrl: productImages.imageUrl })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
    )[0];

    if (!image) {
      res.status(404).json({ message: "Product image not found" });
      return;
    }

    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id));

    res.status(200).json({ product, image, review });
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin
const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);
    const slug = await generateUniqueSlug(data.name);
    const product = (
      await db
        .insert(products)
        .values({ ...data, slug })
        .returning()
    )[0];

    if (req.file) {
      const imageUrl = await uploadToCloudinary(slug, req.file.path);
      if (!imageUrl) {
        res.status(500).json({ message: "Error while uploading image" });
        return;
      }

      await db.insert(productImages).values({
        productId: product.id,
        imageUrl,
        imagePublicId: slug,
      });
    }

    res.status(201).json({ product });
  } catch (error) {
    console.error("Error creating product: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const data = productSchema.partial().parse(req.body); // partial() make all properties optional
    const updatedProduct = (
      await db
        .update(products)
        .set(data)
        .where(eq(products.slug, slug))
        .returning()
    )[0];

    //Slug unique
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (req.file) {
      const imageUrl = await updateToCloudinary(slug, req.file.path);
      if (!imageUrl) {
        res.status(500).json({ message: "Error while updating image" });
        return;
      }
      await db.update(productImages).set({
        imageUrl,
        imagePublicId: slug,
      });
    }

    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.error("Error updating product: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors[0]);
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // delete product => auto delete product image because of cascade
    const deletedProduct = (
      await db.delete(products).where(eq(products.slug, slug)).returning()
    )[0];

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await deleteFromCloudinary(slug);

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const productsController = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
