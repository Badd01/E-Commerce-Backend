import {
  TCategory,
  TColor,
  TSize,
  TTag,
  TBrand,
} from "../interfaces/attributes.interface";
import {
  categories,
  colors,
  sizes,
  tags,
  brands,
} from "../db/schema/attributes.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq } from "drizzle-orm";

const db = drizzle(config.db_url!);

const createACategoryIntoDB = async (data: TCategory) => {
  await db.insert(categories).values(data);
};
const getAllCategoryFromDB = async () => {
  const data = await db.select().from(categories);
  return data;
};
const updateCategoryIntoDB = async (categoryId: number, data: TCategory) => {
  await db.update(categories).set(data).where(eq(categories.id, categoryId));
};
const deleteCategoryFromDB = async (categoryId: number) => {
  await db.delete(categories).where(eq(categories.id, categoryId));
};

const createABrandIntoDB = async (data: TBrand) => {
  await db.insert(brands).values(data);
};

const getAllBrandFromDB = async () => {
  const data = await db.select().from(brands);
  return data;
};
const getSingleBrandFromDB = async (brandId: number) => {
  const [data] = await db.select().from(brands).where(eq(brands.id, brandId));
  return data;
};

const updateBrandIntoDB = async (brandId: number, data: TBrand) => {
  await db.update(brands).set(data).where(eq(brands.id, brandId));
};
const deleteBrandFromDB = async (brandId: number) => {
  await db.delete(brands).where(eq(brands.id, brandId));
};

const createATagIntoDB = async (data: TTag) => {
  await db.insert(tags).values(data);
};

const getAllTagFromDB = async () => {
  const data = await db.select().from(tags);
  return data;
};
const getSingleTagFromDB = async (tagId: number) => {
  const [data] = await db.select().from(tags).where(eq(tags.id, tagId));
  return data;
};

const updateTagIntoDB = async (tagId: number, data: TTag) => {
  await db.update(tags).set(data).where(eq(tags.id, tagId));
};
const deleteTagFromDB = async (tagId: number) => {
  await db.delete(tags).where(eq(tags.id, tagId));
};
const createASizeIntoDB = async (data: TSize) => {
  await db.insert(sizes).values(data);
};
const getAllSizeFromDB = async () => {
  const data = await db.select().from(sizes);
  return data;
};
const updateSizeIntoDB = async (sizeId: number, data: TSize) => {
  await db.update(sizes).set(data).where(eq(sizes.id, sizeId));
};

const deleteSizeFromDB = async (sizeId: number) => {
  await db.delete(sizes).where(eq(sizes.id, sizeId));
};
const createAColorIntoDB = async (data: TColor) => {
  await db.insert(colors).values(data);
};
const getAllColorFromDB = async () => {
  const data = await db.select().from(colors);
  return data;
};

const updateColorIntoDB = async (colorId: number, data: TColor) => {
  await db.update(colors).set(data).where(eq(colors.id, colorId));
};

const deleteColorFromDB = async (colorId: number) => {
  await db.delete(colors).where(eq(colors.id, colorId));
};

export const attributesServices = {
  createACategoryIntoDB,
  createATagIntoDB,
  createASizeIntoDB,
  createAColorIntoDB,
  createABrandIntoDB,
  getAllCategoryFromDB,
  getAllBrandFromDB,
  getAllTagFromDB,
  getAllSizeFromDB,
  getAllColorFromDB,
  getSingleTagFromDB,
  getSingleBrandFromDB,
  updateCategoryIntoDB,
  updateTagIntoDB,
  updateBrandIntoDB,
  updateColorIntoDB,
  updateSizeIntoDB,
  deleteCategoryFromDB,
  deleteTagFromDB,
  deleteColorFromDB,
  deleteSizeFromDB,
  deleteBrandFromDB,
};
