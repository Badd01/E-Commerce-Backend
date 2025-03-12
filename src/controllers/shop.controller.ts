import { Request, Response } from "express";
import {
  categoriesSchema,
  colorsSchema,
  tagsSchema,
  yearsSchema,
  colorsIdSchema,
  yearsIdSchema,
  tagsIdSchema,
  categoriesIdSchema,
} from "../validations/shop.validation";
import { generateUniqueSlug } from "../utils/slugify";
import { db } from "../utils/db";
import { categories, tags, colors, years } from "../db/schema/shop.schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = categoriesSchema.parse(req.body);
    const slug = await generateUniqueSlug(result.name, categories);
    const data = await db
      .insert(categories)
      .values({ ...result, slug })
      .returning()
      .then((res) => res[0]);

    res.status(201).json({ message: "Category created successfully", data });
  } catch (error: any) {
    console.error("Error creating category: ", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};
const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = tagsSchema.parse({
      ...req.body,
      categoryId: Number(req.body.categoryId),
    });
    const slug = await generateUniqueSlug(result.name, tags);
    const data = await db
      .insert(tags)
      .values({ ...result, slug })
      .returning()
      .then((res) => res[0]);
    res.status(201).json({ message: "Tag created successfully", data });
  } catch (error: any) {
    console.error("Error creating tag: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};
const createColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = colorsSchema.parse(req.body);
    const data = await db
      .insert(colors)
      .values(result)
      .returning()
      .then((res) => res[0]);

    res.status(201).json({ message: "Color created successfully", data });
  } catch (error: any) {
    console.error("Error creating color: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
const createYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = yearsSchema.parse({
      ...req.body,
      name: Number(req.body.name),
    });
    const data = await db
      .insert(years)
      .values(result)
      .returning()
      .then((res) => res[0]);
    res.status(201).json({ message: "Year created successfully", data });
  } catch (error: any) {
    console.error("Error creating year: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    if (error.code === "23505") {
      res.status(409).json({ message: "Duplicate name" });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.select().from(categories);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting categories: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getAllTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.select().from(tags);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting tags: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getAllColors = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.select().from(colors);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting colors: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getAllYears = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.select().from(years);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting years: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllShop = async (req: Request, res: Response): Promise<void> => {
  try {
    // promise concurrency methods
    const [category, tag, color, year] = await Promise.all([
      db.select().from(categories),
      db.select().from(tags),
      db.select().from(colors),
      db.select().from(years),
    ]);
    res
      .status(200)
      .json({ categories: category, tags: tag, colors: color, years: year });
  } catch (error) {
    console.error("Error getting shop: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: categoryId } = categoriesIdSchema.parse({
      id: Number(req.params.id),
    });
    const result = categoriesSchema.parse(req.body);
    const newSlug = await generateUniqueSlug(result.name, categories);
    const data = await db
      .update(categories)
      .set({ ...result, slug: newSlug })
      .where(eq(categories.id, categoryId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category updated successfully", data });
  } catch (error) {
    console.error("Error updating category: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: tagId } = tagsIdSchema.parse({ id: Number(req.params.id) });
    const result = tagsSchema.parse({
      ...req.body,
      categoryId: Number(req.body.categoryId),
    });
    const newSlug = await generateUniqueSlug(result.name, tags);
    const data = await db
      .update(tags)
      .set({ ...result, slug: newSlug })
      .where(eq(tags.id, tagId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ message: "Tag updated successfully", data });
  } catch (error) {
    console.error("Error updating tag: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: colorId } = colorsIdSchema.parse({ id: Number(req.params.id) });
    const result = colorsSchema.parse(req.body);
    const data = await db
      .update(colors)
      .set(result)
      .where(eq(colors.id, colorId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Color not found" });
      return;
    }

    res.status(200).json({ message: "Color updated successfully", data });
  } catch (error) {
    console.error("Error updating color: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: yearId } = yearsIdSchema.parse({
      id: Number(req.params.id),
    });
    const result = yearsSchema.parse({
      ...req.body,
      name: Number(req.body.year),
    });
    const data = await db
      .update(years)
      .set(result)
      .where(eq(years.id, yearId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Year not found" });
      return;
    }

    res.status(200).json({ message: "Year updated successfully", data });
  } catch (error) {
    console.error("Error updating year: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: categoryId } = categoriesIdSchema.parse({
      id: Number(req.params.id),
    });
    const data = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully", data });
  } catch (error) {
    console.error("Error deleting category: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: tagId } = tagsIdSchema.parse({ id: Number(req.params.id) });
    const data = await db
      .delete(tags)
      .where(eq(tags.id, tagId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ message: "Tag deleted successfully", data });
  } catch (error) {
    console.error("Error deleting tag: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: colorId } = colorsIdSchema.parse({ id: Number(req.params.id) });
    const data = await db
      .delete(colors)
      .where(eq(colors.id, colorId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Color not found" });
      return;
    }

    res.status(200).json({ message: "Color deleted successfully", data });
  } catch (error) {
    console.error("Error deleting color: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: yearId } = yearsIdSchema.parse({
      id: Number(req.params.id),
    });
    const data = await db
      .delete(years)
      .where(eq(years.id, yearId))
      .returning()
      .then((res) => res[0]);
    if (!data) {
      res.status(404).json({ message: "Year not found" });
      return;
    }
    res.status(200).json({ message: "Year deleted successfully", data });
  } catch (error) {
    console.error("Error deleting year: ", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: { message: error.errors[0] }.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const shopController = {
  createCategory,
  createTag,
  createColor,
  createYear,
  getAllShop,
  getAllCategories,
  getAllTags,
  getAllColors,
  getAllYears,
  updateCategory,
  updateTag,
  updateColor,
  updateYear,
  deleteCategory,
  deleteTag,
  deleteColor,
  deleteYear,
};
