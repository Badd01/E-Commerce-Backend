import {
  TProduct,
  TProductImage,
  TProductVariant,
} from "../interfaces/product.interface";
import {
  productImages,
  products,
  productVariants,
} from "../db/schema/product.schema";
import * as schema from "../db/schema/product.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq, and, lte, ilike, asc, desc } from "drizzle-orm";

const db = drizzle(config.db_url!, { schema });

// Product
const createAProductIntoDB = async (data: TProduct) => {
  const result = await db.insert(products).values(data);
  return result;
};
const getAllProductsFromDB = async (obj: {
  tagId?: number;
  slug?: string;
  brand?: string;
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
        obj.slug ? ilike(products.slug, obj.slug) : undefined,
        obj.brand ? ilike(products.brand, obj.brand) : undefined,
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
  const data1 = await db.query.products.findMany();
  return data;
};
const updateProductIntoDB = async (productId: number, data: TProduct) => {
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, productId));
  return result;
};
const deleteProductFromDB = async (productId: number) => {
  const result = await db.delete(products).where(eq(products.id, productId));
  return result;
};

// Product variant
const createAProductVariantIntoDB = async (data: TProductVariant) => {
  const result = await db.insert(productVariants).values(data);
  return result;
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
  const result = await db
    .update(productVariants)
    .set(data)
    .where(eq(productVariants.id, productVariantId));
  return result;
};
const deleteProductVariantFromDB = async (productVariantId: number) => {
  const result = await db
    .delete(productVariants)
    .where(eq(productVariants.id, productVariantId));
  return result;
};

// Product image
const createProductImageIntoDB = async (data: TProductImage) => {
  const result = await db.insert(productImages).values(data);
  return result;
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
  const result = await db
    .update(productImages)
    .set(data)
    .where(eq(productImages.id, productImageId));
  return result;
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
};
