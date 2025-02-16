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
import { productServices } from "../services/product.services";
import {
  updateToCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary.helper";
import fs from "fs";

//Create
const createCategory = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = categoryValidationSchema.safeParse(
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
      const result = await productServices.createACategoryIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const createTag = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = tagValidationSchema.safeParse(req.body);

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.createATagIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Tag created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const createSize = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = sizeValidationSchema.safeParse(req.body);

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.createASizeIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Size created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const createColor = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = colorValidationSchema.safeParse(req.body);

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.createAColorIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Color created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = productValidationSchema.safeParse(
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
      const result = await productServices.createAProductIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const createProductVariant = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = productVariantValidationSchema.safeParse(
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
      const result = await productServices.createAProductVariantIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product variant created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

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
    const { success, data, error } = productImageSchema.safeParse({
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
      const result = await productServices.createProductImageIntoDB(data);

      //Delete file in uploads
      await fs.promises.unlink(req.file.path);
      //Created
      res.status(201).json({
        success: true,
        message: "Product image created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

//Get all
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllCategoryFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No categories found",
        data: [],
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data categories successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllTag = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllTagFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No tags found",
        data: [],
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data tags successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllColor = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllColorFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No colors found",
        data: [],
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data colors successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllSize = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllSizeFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No sizes found",
        data: [],
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data sizes successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No products found",
        data: [],
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data products successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllProductVariant = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductVariantFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No variants found",
        data: [],
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
      error: error,
    });
  }
};

const getAllProductImage = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductImageFromDB();

    if (!result || result.length === 0) {
      //OK
      res.status(200).json({
        success: true,
        message: "No images found",
        data: [],
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
      error: error,
    });
  }
};

//Get single
const getSingleTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);

    // Not a number
    if (isNaN(tagId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid tag Id",
      });
      return;
    }

    const data = await productServices.getSingleTagFromDB(tagId);

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "Tag not found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Tag retrieved successfully",
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

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    // Not a number
    if (isNaN(productId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product Id",
      });
      return;
    }

    const data = await productServices.getSingleProductFromDB(productId);

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "Product not found",
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

const getSingleProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    // Not a number
    if (isNaN(productVariantId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product variant Id",
      });
      return;
    }

    const data = await productServices.getSingleProductVariantFromDB(
      productVariantId
    );

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "Product variant not found",
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

const getSingleProductImage = async (req: Request, res: Response) => {
  try {
    const productImageId = Number(req.params.id);

    // Not a number
    if (isNaN(productImageId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product image Id",
      });
      return;
    }

    const data = await productServices.getSingleProductImageFromDB(
      productImageId
    );

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "Product image not found",
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

// Put
const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(categoryId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid category Id",
      });
      return;
    }

    const { success, data, error } = categoryValidationSchema.safeParse(
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
      const result = await productServices.updateCategoryIntoDB(
        categoryId,
        data
      );
      //OK
      res.status(200).json({
        success: true,
        message: "Category updated successfuly",
        data: result,
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

const updateTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(tagId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid tag Id",
      });
      return;
    }

    const { success, data, error } = tagValidationSchema.safeParse(req.body);
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.updateTagIntoDB(tagId, data);

      //OK
      res.status(200).json({
        success: true,
        message: "Tag updated successfuly",
        data: result,
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

const updateSize = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(sizeId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid size Id",
      });
      return;
    }

    const { success, data, error } = sizeValidationSchema.safeParse(req.body);
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.updateSizeIntoDB(sizeId, data);

      //OK
      res.status(200).json({
        success: true,
        message: "Size updated successfuly",
        data: result,
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

const updateColor = async (req: Request, res: Response) => {
  try {
    const colorId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(colorId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid color Id",
      });
      return;
    }

    const { success, data, error } = colorValidationSchema.safeParse(req.body);
    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const result = await productServices.updateColorIntoDB(colorId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Color updated successfuly",
        data: result,
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

const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(productId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product Id",
      });
      return;
    }

    const { success, data, error } = productValidationSchema.safeParse(
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
      const result = await productServices.updateProductIntoDB(productId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Product updated successfuly",
        data: result,
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

const updateProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(productVariantId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product variant Id",
      });
      return;
    }

    const { success, data, error } = productVariantValidationSchema.safeParse(
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
      const result = await productServices.updateProductVariantIntoDB(
        productVariantId,
        data
      );
      //OK
      res.status(200).json({
        success: true,
        message: "Product variant updated successfuly",
        data: result,
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

const updateProductImage = async (req: Request, res: Response) => {
  try {
    const productImageId = Number(req.params.id);

    // Not a number or no data
    if (isNaN(productImageId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product image Id",
      });
      return;
    }

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
    const { success, data, error } = productImageSchema.safeParse({
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
      const result = await productServices.updateProductImageIntoDB(
        productImageId,
        data
      );

      //Delete file in uploads
      await fs.promises.unlink(req.file.path);
      //OK
      res.status(200).json({
        success: true,
        message: "Product image updated successfully",
        data: result,
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

//Delete
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    if (isNaN(categoryId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid category Id",
      });
      return;
    }

    const result = await productServices.deleteCategoryFromDB(categoryId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete category successfully",
      data: result,
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
const deleteTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);

    if (isNaN(tagId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid tag Id",
      });
      return;
    }

    const result = await productServices.deleteTagFromDB(tagId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete tag successfully",
      data: result,
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
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product Id",
      });
      return;
    }

    const result = await productServices.deleteProductFromDB(productId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
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
const deleteSize = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.id);

    if (isNaN(sizeId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid size Id",
      });
      return;
    }

    const result = await productServices.deleteSizeFromDB(sizeId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
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
const deleteColor = async (req: Request, res: Response) => {
  try {
    const colorId = Number(req.params.id);

    if (isNaN(colorId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid color Id",
      });
      return;
    }

    const result = await productServices.deleteColorFromDB(colorId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
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
const deleteProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariantId = Number(req.params.id);

    if (isNaN(productVariantId)) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid product variant Id",
      });
      return;
    }

    const result = await productServices.deleteProductVariantFromDB(
      productVariantId
    );
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product variant successfully",
      data: result,
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

export const productController = {
  createProduct,
  createTag,
  createCategory,
  createSize,
  createColor,
  createProductVariant,
  createProductImage,
  getAllCategory,
  getAllTag,
  getAllColor,
  getAllSize,
  getAllProduct,
  getAllProductVariant,
  getAllProductImage,
  getSingleTag,
  getSingleProduct,
  getSingleProductImage,
  getSingleProductVariant,
  updateCategory,
  updateTag,
  updateSize,
  updateColor,
  updateProduct,
  updateProductImage,
  updateProductVariant,
  deleteCategory,
  deleteTag,
  deleteProduct,
  deleteColor,
  deleteSize,
  deleteProductVariant,
};
