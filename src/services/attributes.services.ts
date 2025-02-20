import {
  TCategory,
  TColor,
  TSize,
  TTag,
} from "../interfaces/attributes.interface";
import {
  categories,
  colors,
  sizes,
  tags,
} from "../db/schema/attributes.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config";
import { eq } from "drizzle-orm";

const db = drizzle(config.db_url!);

const createACategoryIntoDB = async (data: TCategory) => {
  const result = await db.insert(categories).values(data);
  return result;
};
const getAllCategoryFromDB = async () => {
  const data = await db.select().from(categories);
  return data;
};
const updateCategoryIntoDB = async (categoryId: number, data: TCategory) => {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, categoryId));
  return result;
};
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

const deleteColorFromDB = async (colorId: number) => {
  const result = await db.delete(colors).where(eq(colors.id, colorId));
  return result;
};
const deleteSizeFromDB = async (sizeId: number) => {
  const result = await db.delete(sizes).where(eq(sizes.id, sizeId));
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
const getAllTagFromDB = async () => {
  const data = await db.select().from(tags);
  return data;
};
const getSingleTagFromDB = async (tagId: number) => {
  const [data] = await db.select().from(tags).where(eq(tags.id, tagId));
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

export const attributesServices = {
  createACategoryIntoDB,
  createATagIntoDB,
  createASizeIntoDB,
  createAColorIntoDB,
  getAllCategoryFromDB,
  getAllTagFromDB,
  getAllSizeFromDB,
  getAllColorFromDB,
  getSingleTagFromDB,
  updateCategoryIntoDB,
  updateTagIntoDB,
  updateColorIntoDB,
  updateSizeIntoDB,
  deleteCategoryFromDB,
  deleteTagFromDB,
  deleteColorFromDB,
  deleteSizeFromDB,
};
