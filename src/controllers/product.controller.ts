import { Request, Response } from "express";
import {
  categoryValidationSchema,
  colorValidationSchema,
  productValidationSchema,
  productVariantValidationSchema,
  sizeValidationSchema,
  tagValidationSchema,
} from "../validations/product.validation";
import { ProductServices } from "../services/product.services";

const createCategory = async (req: Request, res: Response) => {
  try {
    const parser = categoryValidationSchema.parse(req.body);
    const result = await ProductServices.createACategoryIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const createTag = async (req: Request, res: Response) => {
  try {
    const parser = tagValidationSchema.parse(req.body);
    const result = await ProductServices.createATagIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Tag created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const createSize = async (req: Request, res: Response) => {
  try {
    const parser = sizeValidationSchema.parse(req.body);
    const result = await ProductServices.createASizeIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Size created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const createColor = async (req: Request, res: Response) => {
  try {
    const parser = colorValidationSchema.parse(req.body);
    const result = await ProductServices.createAColorIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Color created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const parser = productValidationSchema.parse(req.body);
    const result = await ProductServices.createAProductIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const createProductVariant = async (req: Request, res: Response) => {
  try {
    const parser = productVariantValidationSchema.parse(req.body);
    const result = await ProductServices.createAProductVariantIntoDB(parser);

    res.status(200).json({
      success: true,
      message: "Product variant created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

export const productController = {
  createProduct,
  createTag,
  createCategory,
  createSize,
  createColor,
  createProductVariant,
};
