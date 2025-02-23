import { Request, Response } from "express";
import {
  productImageUpdateValidation,
  productImageValidationSchema,
  productUpdateValidation,
  productValidationSchema,
  productVariantUpdateValidation,
  productVariantValidationSchema,
  ratingValidationSchema,
} from "../validations/product.validation";
import { productServices } from "../services/product.services";
import {
  updateToCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary.helper";
import fs from "fs";
import slugify from "slugify"; // convert string to string with dash
import { is } from "drizzle-orm";

// Product
const createProduct = async (req: Request, res: Response) => {
  if (req.body.productName) {
    req.body.slug = slugify(req.body.productName);
  }
  const { success, data, error } = await productValidationSchema.safeParse(
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
    await productServices.createAProductIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { tagId, brandId, sortBy, sortOrder, page } = req.query;
    const data = await productServices.getAllProductsFromDB({
      tagId: Number(tagId) || undefined,
      brandId: Number(brandId) || undefined,
      sortBy: sortBy as "name" | "time",
      sortOrder: sortOrder as "asc" | "desc",
      page: Number(page) || 1,
    });
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: data,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSingleProduct = async (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (isNaN(productId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    const data = await productServices.getSingleProductFromDB(productId);
    res.status(data ? 200 : 404).json({
      success: !!data,
      message: data ? "Product retrieved successfully" : "Product not found",
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
const updateProduct = async (req: Request, res: Response) => {
  if (req.body.productName) {
    req.body.slug = slugify(req.body.productName);
  }
  const productId = Number(req.params.id);
  if (isNaN(productId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  const { success, data, error } = await productUpdateValidation.safeParse(
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
    await productServices.updateProductIntoDB(productId, data);

    res.status(200).json({
      success: true,
      message: "Product updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  if (isNaN(productId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
    return;
  }

  try {
    await productServices.deleteProductFromDB(productId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Product variant
const createProductVariant = async (req: Request, res: Response) => {
  const { success, data, error } =
    await productVariantValidationSchema.safeParse(req.body);
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
    await productServices.createAProductVariantIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Product variant created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllProductVariant = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductVariantFromDB();
    res.status(200).json({
      success: true,
      message: "Get data variants successfully",
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
const getSingleProductVariant = async (req: Request, res: Response) => {
  const productVariantId = Number(req.params.id);
  if (isNaN(productVariantId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product variant ID",
    });
    return;
  }

  try {
    const data = await productServices.getSingleProductVariantFromDB(
      productVariantId
    );
    res.status(data ? 200 : 404).json({
      success: !!data,
      message: data
        ? "Product variant retrieved successfully"
        : "Product variant not found",
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
const updateProductVariant = async (req: Request, res: Response) => {
  const productVariantId = Number(req.params.id);
  if (isNaN(productVariantId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product variant ID",
    });
    return;
  }
  const { success, data, error } =
    await productVariantUpdateValidation.safeParse(req.body);
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
    await productServices.updateProductVariantIntoDB(productVariantId, data);
    res.status(200).json({
      success: true,
      message: "Product variant updated successfuly",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const deleteProductVariant = async (req: Request, res: Response) => {
  const productVariantId = Number(req.params.id);
  if (isNaN(productVariantId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product variant ID",
    });
    return;
  }

  try {
    await productServices.deleteProductVariantFromDB(productVariantId);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Product image
const createProductImage = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "File is required",
    });
    return;
  }

  // upload to cloudinary
  const productId = Number(req.body.productId);
  const colorId = Number(req.body.colorId);
  if (isNaN(productId) || isNaN(colorId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product id or color id",
    });
    return;
  }

  const publicId: string = productId + "-" + colorId; //Unique publicI
  const imageUrl = await uploadToCloudinary(publicId, req.file.path);
  if (!imageUrl) {
    res.status(500).json({
      success: false,
      message: "Failed to upload image to cloudinary",
    });
    return;
  }

  const { success, data, error } = await productImageValidationSchema.safeParse(
    {
      productId,
      colorId,
      imageUrl,
      publicId,
    }
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
    await productServices.createProductImageIntoDB(data);
    res.status(201).json({
      success: true,
      message: "Product image created successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  } finally {
    if (req.file?.path) {
      await fs.promises
        .unlink(req.file.path)
        .then(() => console.log("Temporary file deleted successfully"))
        .catch((err) => console.error("Error deleting temp file:", err));
    }
  }
};
const getAllProductImage = async (req: Request, res: Response) => {
  try {
    const data = await productServices.getAllProductImageFromDB();
    res.status(200).json({
      success: true,
      message: "Product image retrieved successfully",
      data: data,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSingleProductImage = async (req: Request, res: Response) => {
  const productImageId = Number(req.params.id);
  if (isNaN(productImageId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product image ID",
    });
    return;
  }

  try {
    const data = await productServices.getSingleProductImageFromDB(
      productImageId
    );
    res.status(data ? 200 : 404).json({
      success: !!data,
      message: data
        ? "Product image retrieved successfully"
        : "No product image found",
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
const updateProductImage = async (req: Request, res: Response) => {
  const productImageId = Number(req.params.id);
  if (isNaN(productImageId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product image ID",
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "File is required",
    });
    return;
  }

  // upload to cloudinary
  const productId = Number(req.body.productId);
  const colorId = Number(req.body.colorId);
  if (isNaN(productId) || isNaN(colorId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product id or color id",
    });
    return;
  }
  const publicId: string = productId + "-" + colorId; //Unique publicI
  const imageUrl = await updateToCloudinary(publicId, req.file.path);
  if (!imageUrl) {
    res.status(500).json({
      success: false,
      message: "Failed to upload image to cloudinary",
    });
    return;
  }

  const { success, data, error } = await productImageUpdateValidation.safeParse(
    {
      imageUrl,
      publicId,
    }
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
    await productServices.updateProductImageIntoDB(productImageId, data);
    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  } finally {
    if (req.file?.path) {
      await fs.promises
        .unlink(req.file.path)
        .then(() => console.log("Temporary file deleted successfully"))
        .catch((err) => console.error("Error deleting temp file:", err));
    }
  }
};

const ratingProduct = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productId = Number(req.body.productId);
  const rating = Number(req.body.rating);
  if (isNaN(rating) || isNaN(productId)) {
    res.status(400).json({
      success: false,
      message: "Invalid rating or product id",
    });
    return;
  }

  const { success, data, error } = await ratingValidationSchema.safeParse({
    productId,
    userId,
    rating,
  });

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
    // Rating table
    await productServices.ratingProduct(data);

    // Product table
    const result = await productServices.getRatingProduct();
    const sumRating = result.reduce((sum, val) => sum + val.rating, 0); // sum = 0, sum = sum + val.rating,
    const totalRating = Math.round((sumRating * 10) / result.length) / 10; // x.y
    await productServices.updateTotalRating(productId, totalRating);

    res.status(200).json({
      success: true,
      message: "Rating product successfully",
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const productController = {
  createProduct,
  createProductVariant,
  createProductImage,
  getAllProduct,
  getAllProductVariant,
  getAllProductImage,
  getSingleProduct,
  getSingleProductImage,
  getSingleProductVariant,
  updateProduct,
  updateProductImage,
  updateProductVariant,
  deleteProduct,
  deleteProductVariant,
  ratingProduct,
};
