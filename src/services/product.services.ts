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
  productImage,
  products,
  productVariants,
  sizes,
  tags,
} from "../db/schema/product.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";

const db = drizzle(config.db_url!);

//Create
const createACategoryIntoDB = async (categoryData: TCategory) => {
  const result = await db.insert(categories).values(categoryData);
  return result;
};

const createATagIntoDB = async (tagData: TTag) => {
  const result = await db.insert(tags).values(tagData);
  return result;
};

const createASizeIntoDB = async (sizeData: TSize) => {
  const result = await db.insert(sizes).values(sizeData);
  return result;
};

const createAColorIntoDB = async (colorData: TColor) => {
  const result = await db.insert(colors).values(colorData);
  return result;
};

const createAProductIntoDB = async (productData: TProduct) => {
  const result = await db.insert(products).values(productData);
  return result;
};

const createAProductVariantIntoDB = async (
  productVariantData: TProductVariant
) => {
  const result = await db.insert(productVariants).values(productVariantData);
  return result;
};

const createProductImageIntoDB = async (productImageData: TProductImage) => {
  const result = await db.insert(productImage).values(productImageData);
  return result;
};

//Get

//Put

//Delete

export const ProductServices = {
  createAProductIntoDB,
  createACategoryIntoDB,
  createATagIntoDB,
  createASizeIntoDB,
  createAColorIntoDB,
  createAProductVariantIntoDB,
  createProductImageIntoDB,
};
