import { Request, Response } from "express";
import {
  categoryValidationSchema,
  colorValidationSchema,
  sizeValidationSchema,
  tagValidationSchema,
  brandValidationSchema,
} from "../validations/attributes.validation";
import { attributesServices } from "../services/attributes.services";

// Create
const createCategory = async (req: Request, res: Response) => {
  const { success, data, error } = await categoryValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.createACategoryIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createBrand = async (req: Request, res: Response) => {
  const { success, data, error } = await brandValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.createABrandIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createTag = async (req: Request, res: Response) => {
  const { success, data, error } = await tagValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.createATagIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createSize = async (req: Request, res: Response) => {
  const { success, data, error } = await sizeValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.createASizeIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Size created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createColor = async (req: Request, res: Response) => {
  const { success, data, error } = await colorValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.createAColorIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Color created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllCategoryFromDB();
    res.status(200).json({
      success: true,
      message: "Get data categories successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllBrand = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllBrandFromDB();
    res.status(200).json({
      success: true,
      message: "Get data brands successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllTag = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllTagFromDB();
    res.status(200).json({
      success: true,
      message: "Get data tags successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllColor = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllColorFromDB();
    res.status(200).json({
      success: true,
      message: "Get data colors successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllSize = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllSizeFromDB();
    res.status(200).json({
      success: true,
      message: "Get data sizes successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get single
const getSingleTag = async (req: Request, res: Response) => {
  const tagId = Number(req.params.id);
  if (isNaN(tagId)) {
    res.status(400).json({
      success: false,
      message: "Invalid tag id",
    });
    return;
  }

  try {
    const data = await attributesServices.getSingleTagFromDB(tagId);
    res.status(data ? 200 : 404).json({
      success: !!data,
      message: data ? "Tag retrieved successfully" : "Tag not found",
      data: data,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getSingleBrand = async (req: Request, res: Response) => {
  const brandId = Number(req.params.id);
  if (isNaN(brandId)) {
    res.status(400).json({
      success: false,
      message: "Invalid brand id",
    });
    return;
  }

  try {
    const data = await attributesServices.getSingleBrandFromDB(brandId);
    res.status(data ? 200 : 404).json({
      success: !!data,
      message: data ? "Brand retrieved successfully" : "Brand not found",
      data: data,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Update
const updateCategory = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  if (isNaN(categoryId)) {
    res.status(400).json({
      success: false,
      message: "Invalid category id",
    });
    return;
  }

  const { success, data, error } = await categoryValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.updateCategoryIntoDB(categoryId, data);
    res.status(200).json({
      success: true,
      message: "Category updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateBrand = async (req: Request, res: Response) => {
  const brandId = Number(req.params.id);
  if (isNaN(brandId)) {
    res.status(400).json({
      success: false,
      message: "Invalid brand id",
    });
    return;
  }

  const { success, data, error } = await brandValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.updateBrandIntoDB(brandId, data);
    res.status(200).json({
      success: true,
      message: "Brand updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateTag = async (req: Request, res: Response) => {
  const tagId = Number(req.params.id);
  if (isNaN(tagId)) {
    res.status(400).json({
      success: false,
      message: "Invalid tag id",
    });
    return;
  }

  const { success, data, error } = await tagValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.updateTagIntoDB(tagId, data);
    res.status(200).json({
      success: true,
      message: "Tag updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateSize = async (req: Request, res: Response) => {
  const sizeId = Number(req.params.id);
  if (isNaN(sizeId)) {
    res.status(400).json({
      success: false,
      message: "Invalid size id",
    });
    return;
  }

  const { success, data, error } = await sizeValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.updateSizeIntoDB(sizeId, data);
    res.status(200).json({
      success: true,
      message: "Size updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateColor = async (req: Request, res: Response) => {
  const colorId = Number(req.params.id);
  if (isNaN(colorId)) {
    res.status(400).json({
      success: false,
      message: "Invalid color id",
    });
    return;
  }

  const { success, data, error } = await colorValidationSchema.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    await attributesServices.updateColorIntoDB(colorId, data);
    res.status(200).json({
      success: true,
      message: "Color updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Delete
const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  if (isNaN(categoryId)) {
    res.status(400).json({
      success: false,
      message: "Invalid category id",
    });
    return;
  }

  try {
    await attributesServices.deleteCategoryFromDB(categoryId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteBrand = async (req: Request, res: Response) => {
  const brandId = Number(req.params.id);
  if (isNaN(brandId)) {
    res.status(400).json({
      success: false,
      message: "Invalid brand id",
    });
    return;
  }

  try {
    await attributesServices.deleteBrandFromDB(brandId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteTag = async (req: Request, res: Response) => {
  const tagId = Number(req.params.id);
  if (isNaN(tagId)) {
    res.status(400).json({
      success: false,
      message: "Invalid tag id",
    });
    return;
  }

  try {
    await attributesServices.deleteTagFromDB(tagId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteSize = async (req: Request, res: Response) => {
  const sizeId = Number(req.params.id);
  if (isNaN(sizeId)) {
    res.status(400).json({
      success: false,
      message: "Invalid size id",
    });
    return;
  }

  try {
    await attributesServices.deleteSizeFromDB(sizeId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteColor = async (req: Request, res: Response) => {
  const colorId = Number(req.params.id);
  if (isNaN(colorId)) {
    res.status(400).json({
      success: false,
      message: "Invalid color id",
    });
    return;
  }

  try {
    await attributesServices.deleteColorFromDB(colorId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const attributesController = {
  createTag,
  createCategory,
  createSize,
  createColor,
  createBrand,
  getAllCategory,
  getAllBrand,
  getAllTag,
  getAllColor,
  getAllSize,
  getSingleTag,
  getSingleBrand,
  updateCategory,
  updateBrand,
  updateTag,
  updateSize,
  updateColor,
  deleteCategory,
  deleteBrand,
  deleteTag,
  deleteColor,
  deleteSize,
};
