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
      const result = await ProductServices.createACategoryIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createATagIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Tag created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createASizeIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Size created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createAColorIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Color created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createAProductIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createAProductVariantIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Product variant created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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
      const result = await ProductServices.createProductImageIntoDB(data);

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Get all
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllCategoryFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllTag = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllTagFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllColor = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllColorFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllSize = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllSizeFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllProductFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllProductVariant = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllProductVariantFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllProductImage = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllProductImageFromDB();

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong",
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

    const data = await ProductServices.getSingleTagFromDB(tagId);

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
    console.error("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const data = await ProductServices.getSingleProductFromDB(productId);

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
    console.error("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const data = await ProductServices.getSingleProductVariantFromDB(
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
    console.error("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const data = await ProductServices.getSingleProductImageFromDB(
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
    console.error("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateCategoryIntoDB(
        categoryId,
        data
      );

      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "Category not found",
        });
        return;
      }
      //OK
      res.status(200).json({
        success: true,
        message: "Category updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateTagIntoDB(tagId, data);

      if (!result) {
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
        message: "Tag updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateSizeIntoDB(sizeId, data);

      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "Size not found",
        });
        return;
      }
      //OK
      res.status(200).json({
        success: true,
        message: "Size updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateColorIntoDB(colorId, data);

      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "Color not found",
        });
        return;
      }
      //OK
      res.status(200).json({
        success: true,
        message: "Color updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateProductIntoDB(productId, data);

      if (!result) {
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
        message: "Product updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateProductVariantIntoDB(
        productVariantId,
        data
      );

      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "Product variant id not found",
        });
        return;
      }
      //OK
      res.status(200).json({
        success: true,
        message: "Product variant updated successfuly",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
      const result = await ProductServices.updateProductImageIntoDB(
        productImageId,
        data
      );

      if (!result) {
        //Not Found
        res.status(404).json({
          success: false,
          message: "Product image id not found",
        });
        return;
      }

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
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteCategoryFromDB(categoryId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete category successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteTagFromDB(tagId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete tag successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteProductFromDB(productId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteSizeFromDB(sizeId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteColorFromDB(colorId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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

    const result = await ProductServices.deleteProductVariantFromDB(
      productVariantId
    );
    //OK
    res.status(200).json({
      success: true,
      message: "Delete product variant successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error:", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
