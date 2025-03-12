import { Request, Response } from "express";
import { db } from "../utils/db";
import { products, productImages } from "../db/schema/product.schema";
import { z } from "zod";
import {
  deleteFromCloudinary,
  updateToCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary";
import {
  productSchema,
  productsIdSchema,
} from "../validations/products.validation";
import { generateUniqueSlug } from "../utils/slugify";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { reviews } from "../db/schema/review.schema";
import { orderItems, orders } from "../db/schema/order.schema";
import { reviewsSchema } from "../validations/users.validation";
import fs from "fs";
import { categories, tags, colors, years } from "../db/schema/shop.schema";

type TImage = {
  imageUrl: string;
};

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

    const data = await db
      .select()
      .from(products)
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .innerJoin(tags, eq(tags.id, products.tagId))
      .innerJoin(colors, eq(colors.id, products.colorId))
      .innerJoin(years, eq(years.id, products.yearId))
      .innerJoin(productImages, eq(productImages.productId, products.id))
      .orderBy(
        sortOrder === "asc" ? asc(products[sortBy]) : desc(products[sortBy])
      )
      .limit(limit)
      .offset(offset);

    const totalItems = await db
      .select({ count: count() })
      .from(products)
      .then((result) => result[0]?.count || 0);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data,
      pagination: {
        currentPage: page,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error getting products: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productId } = productsIdSchema.parse({
      id: Number(req.params.id),
    });

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .innerJoin(tags, eq(tags.id, products.tagId))
      .innerJoin(colors, eq(colors.id, products.colorId))
      .innerJoin(years, eq(years.id, products.yearId))
      .then((res) => res[0]);

    // Slug unique
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    console.log(product);

    const image = await db
      .select({ imageUrl: productImages.imageUrl })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .then((res) => res[0]);

    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId));

    res
      .status(200)
      .json({ data: { ...product, image: image.imageUrl }, review });
  } catch (error) {
    console.error("Error getting product: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin
const createProduct = async (req: Request, res: Response): Promise<void> => {
  let imagePublicId: string | null = null;
  try {
    const result = productSchema.parse({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      tagId: Number(req.body.tagId),
      colorId: Number(req.body.colorId),
      yearId: Number(req.body.yearId),
    });
    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }
    const slug = await generateUniqueSlug(result.name, products);
    imagePublicId = slug;
    const imageUrl = await uploadToCloudinary(slug, req.file.path);

    // Transaction to create product and image auto rollback if error
    const data = await db.transaction(async (tx) => {
      const product = await tx
        .insert(products)
        .values({ ...result, slug })
        .returning()
        .then((res) => res[0]);

      const image = await tx
        .insert(productImages)
        .values({
          productId: product.id,
          imageUrl,
          imagePublicId: slug,
        })
        .returning({
          imageUrl: productImages.imageUrl,
        })
        .then((res) => res[0]);
      return { ...product, image: image.imageUrl };
    });

    res.status(201).json({ message: "Product created successfully", data });
  } catch (error: any) {
    console.error("Error creating product: ", error);
    if (imagePublicId) {
      await deleteFromCloudinary(imagePublicId);
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productId } = productsIdSchema.parse({
      id: Number(req.params.id),
    });
    const result = productSchema.parse({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId),
      tagId: Number(req.body.tagId),
      colorId: Number(req.body.colorId),
      yearId: Number(req.body.yearId),
    });

    const oldProduct = await db
      .select({
        name: products.name,
        slug: products.slug,
        imageUrl: productImages.imageUrl,
      })
      .from(products)
      .innerJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(products.id, productId))
      .then((res) => res[0]);

    if (!oldProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let newSlug: string | undefined;
    if (result.name !== oldProduct.name) {
      newSlug = await generateUniqueSlug(result.name, products);
    }

    const product = await db
      .update(products)
      .set({
        ...result,
        ...(newSlug && { slug: newSlug }), // Optional newSlug if name is updated, return false if newSlug is undefined => no update
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0]);

    let image = oldProduct.imageUrl;

    if (req.file) {
      const imageUrl = await updateToCloudinary(
        oldProduct.slug,
        newSlug || oldProduct.slug,
        req.file.path
      );

      await db
        .update(productImages)
        .set({
          imageUrl,
          ...(newSlug && { imagePublicId: newSlug }),
        })
        .where(eq(productImages.productId, productId));

      image = imageUrl;
    }
    res.status(200).json({
      message: "Product updated successfully",
      data: { ...product, image },
    });
  } catch (error: any) {
    console.error("Error updating product: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productId } = productsIdSchema.parse({
      id: Number(req.params.id),
    });

    // delete product => auto delete product image because of cascade
    const data = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0]);

    if (!data) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await deleteFromCloudinary(data.slug);

    res.status(200).json({ message: "Deleted product successfully", data });
  } catch (error) {
    console.error("Error deleting product: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = reviewsSchema.parse({
      productId: Number(req.params.id),
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });

    const userId = req.user!.id;
    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.status, "Delivered")))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id));
    if (!order?.length) {
      res
        .status(403)
        .json({ message: "You can only review purchased products" });
      return;
    }

    const reviewData = { productId, userId, rating, comment };

    const data = await db.insert(reviews).values(reviewData);

    res.status(201).json({ message: "Review added", data });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const productsController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createReview,
};
