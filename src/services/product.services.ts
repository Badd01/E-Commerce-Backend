import {
  TProduct,
  TProductImage,
  TProductVariant,
  TRating,
} from "../interfaces/product.interface";
import {
  productImages,
  products,
  productVariants,
  ratings,
} from "../db/schema/product.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq, and, lte, asc, desc } from "drizzle-orm";

const db = drizzle(config.db_url!);

// Product
const createAProductIntoDB = async (data: TProduct) => {
  await db.insert(products).values(data);
};
const getAllProductsFromDB = async (obj: {
  tagId?: number;
  brandId?: number;
  price?: number;
  sortBy?: "name" | "price" | "time";
  sortOrder?: "asc" | "desc";
  page?: number;
}) => {
  const data = db
    .select()
    .from(products)
    .where(
      and(
        obj.tagId ? eq(products.tagId, obj.tagId) : undefined,
        obj.brandId ? eq(products.brandId, obj.brandId) : undefined,
        obj.price ? lte(products.price, obj.price) : undefined
      )
    )
    .orderBy(
      obj.sortBy === "name"
        ? obj.sortOrder === "desc"
          ? desc(products.slug)
          : asc(products.slug)
        : obj.sortBy === "price"
        ? obj.sortOrder === "desc"
          ? desc(products.price)
          : asc(products.price)
        : obj.sortBy === "time"
        ? obj.sortOrder === "desc"
          ? desc(products.createdAt)
          : asc(products.createdAt)
        : desc(products.createdAt)
    )
    .limit(10)
    .offset(obj.page ? (obj.page - 1) * 10 : 0);

  return data;
};

const getSingleProductFromDB = async (productId: number) => {
  const [data] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));
  return data;
};
const updateProductIntoDB = async (productId: number, data: TProduct) => {
  await db.update(products).set(data).where(eq(products.id, productId));
};
const deleteProductFromDB = async (productId: number) => {
  await db.delete(products).where(eq(products.id, productId));
};

// Product variant
const createAProductVariantIntoDB = async (data: TProductVariant) => {
  await db.insert(productVariants).values(data);
};
const getAllProductVariantFromDB = async () => {
  const data = await db.select().from(productVariants);
  return data;
};
const getSingleProductVariantFromDB = async (productVariantId: number) => {
  const [data] = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.id, productVariantId));
  return data;
};
const updateProductVariantIntoDB = async (
  productVariantId: number,
  data: TProductVariant
) => {
  await db
    .update(productVariants)
    .set(data)
    .where(eq(productVariants.id, productVariantId));
};
const deleteProductVariantFromDB = async (productVariantId: number) => {
  await db
    .delete(productVariants)
    .where(eq(productVariants.id, productVariantId));
};

// Product image
const createProductImageIntoDB = async (data: TProductImage) => {
  await db.insert(productImages).values(data);
};
const getAllProductImageFromDB = async () => {
  const data = await db.select().from(productImages);
  return data;
};
const getSingleProductImageFromDB = async (productImageId: number) => {
  const [data] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, productImageId));
  return data;
};
const updateProductImageIntoDB = async (
  productImageId: number,
  data: TProductImage
) => {
  await db
    .update(productImages)
    .set(data)
    .where(eq(productImages.id, productImageId));
};

// Rating
const ratingProduct = async (data: TRating) => {
  await db.insert(ratings).values(data);
};

const getRatingProduct = async () => {
  const data = await db.select({ rating: ratings.rating }).from(ratings);
  return data;
};

const updateTotalRating = async (productId: number, totalRating: number) => {
  await db
    .update(products)
    .set({ totalRating: totalRating })
    .where(eq(products.id, productId));
};

export const productServices = {
  createAProductIntoDB,
  createAProductVariantIntoDB,
  createProductImageIntoDB,
  getAllProductsFromDB,
  getAllProductVariantFromDB,
  getAllProductImageFromDB,
  getSingleProductFromDB,
  getSingleProductImageFromDB,
  getSingleProductVariantFromDB,
  updateProductImageIntoDB,
  updateProductIntoDB,
  updateProductVariantIntoDB,
  deleteProductFromDB,
  deleteProductVariantFromDB,
  ratingProduct,
  updateTotalRating,
  getRatingProduct,
};
