import {
  TProduct,
  TProductFilter,
  TProductImage,
  TProductImageUpdate,
  TProductUpdate,
  TProductVariant,
  TProductVariantUpdate,
  TRating,
} from "../interfaces/product.interface";
import {
  productImages,
  products,
  productVariants,
  ratings,
} from "../db/schema/prosduct.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq, and, lte, asc, desc, gt } from "drizzle-orm";

const db = drizzle(config.db_url!);
const date = new Date(Date.now());

// Product
const createAProductIntoDB = async (data: TProduct) => {
  await db.insert(products).values(data);
};
const getAllProductsFromDB = async (data: TProductFilter) => {
  const result = db
    .select()
    .from(products)
    .where(
      and(
        data.tagId ? eq(products.tagId, data.tagId) : undefined,
        data.brandId ? eq(products.brandId, data.brandId) : undefined
      )
    )
    .orderBy(
      data.sortBy === "name"
        ? data.sortOrder === "desc"
          ? desc(products.slug)
          : asc(products.slug)
        : data.sortBy === "time"
        ? data.sortOrder === "desc"
          ? desc(products.createdAt)
          : asc(products.createdAt)
        : desc(products.createdAt)
    )
    .limit(10)
    .offset(data.page ? (data.page - 1) * 10 : 0);

  return result;
};

const getSingleProductFromDB = async (productId: number) => {
  const [data] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));
  return data;
};
const updateProductIntoDB = async (productId: number, data: TProductUpdate) => {
  data.updatedAt = date;
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
  data: TProductVariantUpdate
) => {
  data.updatedAt = date;
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
  data: TProductImageUpdate
) => {
  data.updatedAt = date;
  await db
    .update(productImages)
    .set(data)
    .where(eq(productImages.id, productImageId));
};

// Rating
const ratingProduct = async (data: TRating) => {
  data.createdAt = date;
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
