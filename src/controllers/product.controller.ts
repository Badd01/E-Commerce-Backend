import { Request, Response } from "express";
import {
  categoryValidationSchema,
  colorValidationSchema,
  productImageSchema,
  productValidationSchema,
  productVariantValidationSchema,
  sizeValidationSchema,
  tagValidationSchema,
} from "../validations/product.validation";
import { ProductServices } from "../services/product.services";
import { uploadToCloudinary } from "../helpers/cloudinary.helper";
import fs from "fs";

//Category
const createCategory = async (req: Request, res: Response) => {
  try {
    const parser = categoryValidationSchema.parse(req.body);
    const result = await ProductServices.createACategoryIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// const getCategory = async (req: Request, res: Response) => {
//   try {
//     res.status(201).json({
//       success: true,
//       message: "Get data category successfully",
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };

//Tag
const createTag = async (req: Request, res: Response) => {
  try {
    const parser = tagValidationSchema.parse(req.body);
    const result = await ProductServices.createATagIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Size
const createSize = async (req: Request, res: Response) => {
  try {
    const parser = sizeValidationSchema.parse(req.body);
    const result = await ProductServices.createASizeIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Size created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Color
const createColor = async (req: Request, res: Response) => {
  try {
    const parser = colorValidationSchema.parse(req.body);
    const result = await ProductServices.createAColorIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Color created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Product
const createProduct = async (req: Request, res: Response) => {
  try {
    const parser = productValidationSchema.parse(req.body);
    const result = await ProductServices.createAProductIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Product variant
const createProductVariant = async (req: Request, res: Response) => {
  try {
    const parser = productVariantValidationSchema.parse(req.body);
    const result = await ProductServices.createAProductVariantIntoDB(parser);

    res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Product image
const createProductImage = async (req: Request, res: Response) => {
  try {
    // if not have file
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required",
      });
    } else {
      // upload to cloudinary
      const { productId, colorId } = req.body;
      const { url, publicId } = await uploadToCloudinary(req.file.path);

      //validation
      const parser = productImageSchema.parse({
        productId,
        colorId,
        imageUrl: url,
        publicId,
      });
      const result = await ProductServices.createProductImageIntoDB(parser);

      //Delete file in uploads
      fs.unlinkSync(req.file.path);

      res.status(201).json({
        success: true,
        message: "Product image created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
  createProductImage,
};
