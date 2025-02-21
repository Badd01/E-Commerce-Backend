import { Request, Response } from "express";
import {
  productImageValidationSchema,
  productValidationSchema,
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
import { sum } from "drizzle-orm";

// Product
const createProduct = async (req: Request, res: Response) => {
  try {
    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName);
    }
    const { success, data, error } = await productValidationSchema.safeParse(
      req.body
    );
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.createAProductIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product created successfully",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { tagId, brandId, price, sortBy, sortOrder, page } = req.query;

    const data = await productServices.getAllProductsFromDB({
      tagId: tagId ? Number(tagId) : undefined,
      price: price ? Number(price) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
      sortBy: sortBy
        ? (String(sortBy) as "name" | "price" | "time")
        : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as "asc" | "desc") : undefined,
      page: page ? Number(page) : undefined,
    });

    if (!data || data.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No variants found",
      });
      return;
    }

    //Ok
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: data,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const data = await productServices.getSingleProductFromDB(productId);

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No product found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName);
    }

    const { success, data, error } = await productValidationSchema.safeParse(
      req.body
    );
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.updateProductIntoDB(productId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Product updated successfuly",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    await productServices.deleteProductFromDB(productId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};

// Product variant
const createProductVariant = async (req: Request, res: Response) => {
  try {
    const { success, data, error } =
      await productVariantValidationSchema.safeParse(req.body);
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.createAProductVariantIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product variant created successfully",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllProductVariant = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductVariantFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No variants found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data variants successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSingleProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    const data = await productServices.getSingleProductVariantFromDB(
      productVariantId
    );

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No product variant found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Product variant retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
const updateProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    const { success, data, error } =
      await productVariantValidationSchema.safeParse(req.body);
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.updateProductVariantIntoDB(productVariantId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Product variant updated successfuly",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
const deleteProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    await productServices.deleteProductVariantFromDB(productVariantId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product variant successfully",
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
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
      return;
    }

    // upload to cloudinary
    const { productId, colorId } = req.body;

    //Unique publicId
    const publicId: string = productId + "-" + colorId;

    const { url } = await uploadToCloudinary(publicId, req.file.path);

    //String to number
    const id1 = Number(productId);
    const id2 = Number(colorId);

    //validation
    const { success, data, error } =
      await productImageValidationSchema.safeParse({
        productId: id1,
        colorId: id2,
        imageUrl: url,
        publicId: publicId,
      });
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.createProductImageIntoDB(data);

      //Delete file in uploads
      await fs.promises.unlink(req.file.path);
      //Created
      res.status(201).json({
        success: true,
        message: "Product image created successfully",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getAllProductImage = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductImageFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No images found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data images successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getSingleProductImage = async (req: Request, res: Response) => {
  try {
    const productImageId = Number(req.params.id);

    const data = await productServices.getSingleProductImageFromDB(
      productImageId
    );

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No product image found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Product image retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
const updateProductImage = async (req: Request, res: Response) => {
  try {
    const productImageId = Number(req.params.id);

    // if not have file
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required",
      });
      return;
    }

    // upload to cloudinary
    const { productId, colorId } = req.body;

    //Unique publicId
    const publicId: string = productId + "-" + colorId;

    const { url } = await updateToCloudinary(publicId, req.file.path);

    //String to number
    const id1 = Number(productId);
    const id2 = Number(colorId);

    //validation
    const { success, data, error } =
      await productImageValidationSchema.safeParse({
        productId: id1,
        colorId: id2,
        imageUrl: url,
        publicId: publicId,
      });

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      await productServices.updateProductImageIntoDB(productImageId, data);

      //Delete file in uploads
      await fs.promises.unlink(req.file.path);
      //OK
      res.status(200).json({
        success: true,
        message: "Product image updated successfully",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};

const ratingProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const productId = Number(req.params.id);

    const { rating } = req.body;

    const { success, data, error } = await ratingValidationSchema.safeParse({
      productId: productId,
      userId: userId,
      rating: Number(rating),
    });

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      // Rating table
      await productServices.ratingProduct(data);

      // Total rating
      const result = await productServices.getRatingProduct();
      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "No rating found",
        });
        return;
      }

      //  Sum
      const sumRating = result.reduce((sum, val) => sum + val.rating, 0);
      const totalRating = sumRating / result.length;
      console.log(totalRating);
      console.log(sumRating);
      console.log(result.length);
      console.log(result);

      await productServices.updateTotalRating(productId, totalRating);
      //OK
      res.status(200).json({
        success: true,
        message: "Rating product successfully",
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
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
