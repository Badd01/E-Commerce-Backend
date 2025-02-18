import {
  TCategory,
  TColor,
  TProduct,
  TProductImage,
  TProductVariant,
  TSize,
  TTag,
} from "../interfaces/product.interface";
import {
  categories,
  colors,
  productImages,
  products,
  productVariants,
  sizes,
  tags,
} from "../db/schema/product.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq } from "drizzle-orm";

const db = drizzle(config.db_url!);

//Create
const createACategoryIntoDB = async (data: TCategory) => {
  const result = await db.insert(categories).values(data);
  return result;
};

const createATagIntoDB = async (data: TTag) => {
  const result = await db.insert(tags).values(data);
  return result;
};

const createASizeIntoDB = async (data: TSize) => {
  const result = await db.insert(sizes).values(data);
  return result;
};

const createAColorIntoDB = async (data: TColor) => {
  const result = await db.insert(colors).values(data);
  return result;
};

const createAProductIntoDB = async (data: TProduct) => {
  const result = await db.insert(products).values(data);
  return result;
};

const createAProductVariantIntoDB = async (data: TProductVariant) => {
  const result = await db.insert(productVariants).values(data);
  return result;
};

const createProductImageIntoDB = async (data: TProductImage) => {
  const result = await db.insert(productImages).values(data);
  return result;
};

//Get all
const getAllCategoryFromDB = async () => {
  const data = await db.select().from(categories);
  return data;
};

const getAllTagFromDB = async () => {
  const data = await db.select().from(tags);
  return data;
};

const getAllColorFromDB = async () => {
  const data = await db.select().from(colors);
  return data;
};

const getAllSizeFromDB = async () => {
  const data = await db.select().from(sizes);
  return data;
};

const getAllProductFromDB = async () => {
  const data = await db.select().from(products);
  return data;
};

const getAllProductVariantFromDB = async () => {
  const data = await db.select().from(productVariants);
  return data;
};

const getAllProductImageFromDB = async () => {
  const data = await db.select().from(productImages);
  return data;
};

//Get single
const getSingleTagFromDB = async (tagId: number) => {
  const [data] = await db.select().from(tags).where(eq(tags.id, tagId));
  return data;
};

const getSingleProductFromDB = async (productId: number) => {
  const [data] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));
  return data;
};

const getSingleProductVariantFromDB = async (productVariantId: number) => {
  const [data] = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.id, productVariantId));
  return data;
};

const getSingleProductImageFromDB = async (productImageId: number) => {
  const [data] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, productImageId));
  return data;
};

//Put
const updateCategoryIntoDB = async (categoryId: number, data: TCategory) => {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, categoryId));
  return result;
};

const updateTagIntoDB = async (tagId: number, data: TTag) => {
  const result = await db.update(tags).set(data).where(eq(tags.id, tagId));
  return result;
};

const updateSizeIntoDB = async (sizeId: number, data: TSize) => {
  const result = await db.update(sizes).set(data).where(eq(sizes.id, sizeId));
  return result;
};

const updateColorIntoDB = async (colorId: number, data: TColor) => {
  const result = await db
    .update(colors)
    .set(data)
    .where(eq(colors.id, colorId));
  return result;
};

const updateProductIntoDB = async (productId: number, data: TProduct) => {
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, productId));
  return result;
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

//Delete
const deleteCategoryFromDB = async (categoryId: number) => {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, categoryId));
  return result;
};
const deleteTagFromDB = async (tagId: number) => {
  const result = await db.delete(tags).where(eq(tags.id, tagId));
  return result;
};
const deleteProductFromDB = async (productId: number) => {
  const result = await db.delete(products).where(eq(products.id, productId));
  return result;
};
const deleteColorFromDB = async (colorId: number) => {
  const result = await db.delete(colors).where(eq(colors.id, colorId));
  return result;
};
const deleteSizeFromDB = async (sizeId: number) => {
  const result = await db.delete(sizes).where(eq(sizes.id, sizeId));
  return result;
};
const deleteProductVariantFromDB = async (productVariantId: number) => {
  const result = await db
    .delete(productVariants)
    .where(eq(productVariants.id, productVariantId));
  return result;
};

export const productServices = {
  createAProductIntoDB,
  createACategoryIntoDB,
  createATagIntoDB,
  createASizeIntoDB,
  createAColorIntoDB,
  createAProductVariantIntoDB,
  createProductImageIntoDB,
  getAllCategoryFromDB,
  getAllTagFromDB,
  getAllSizeFromDB,
  getAllColorFromDB,
  getAllProductFromDB,
  getAllProductVariantFromDB,
  getAllProductImageFromDB,
  getSingleTagFromDB,
  getSingleProductFromDB,
  getSingleProductImageFromDB,
  getSingleProductVariantFromDB,
  updateCategoryIntoDB,
  updateTagIntoDB,
  updateColorIntoDB,
  updateSizeIntoDB,
  updateProductImageIntoDB,
  updateProductIntoDB,
  updateProductVariantIntoDB,
  deleteCategoryFromDB,
  deleteTagFromDB,
  deleteProductFromDB,
  deleteColorFromDB,
  deleteSizeFromDB,
  deleteProductVariantFromDB,
};
