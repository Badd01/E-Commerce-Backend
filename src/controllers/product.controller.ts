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
    const { success, data, error } = await categoryValidationSchema.safeParse(
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
      await productServices.createACategoryIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Category created successfully",
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

const createTag = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await tagValidationSchema.safeParse(
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
      await productServices.createATagIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Tag created successfully",
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

const createSize = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await sizeValidationSchema.safeParse(
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
      await productServices.createASizeIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Size created successfully",
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

const createColor = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await colorValidationSchema.safeParse(
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
      await productServices.createAColorIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Color created successfully",
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

const createProduct = async (req: Request, res: Response) => {
  try {
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
    const { success, data, error } = await productImageSchema.safeParse({
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

//Get all
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllCategoryFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No categories found",
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
    });
  }
};

const getAllTag = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllTagFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No tags found",
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
    });
  }
};

const getAllColor = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllColorFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No colors found",
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
    });
  }
};

const getAllSize = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllSizeFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No sizes found",
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
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getAllProductFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No products found",
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

//Get single
const getSingleTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);

    const data = await productServices.getSingleTagFromDB(tagId);

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No tag found",
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

// Put
const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    const { success, data, error } = await categoryValidationSchema.safeParse(
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
      await productServices.updateCategoryIntoDB(categoryId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Category updated successfuly",
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

    const { success, data, error } = await tagValidationSchema.safeParse(
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
      await productServices.updateTagIntoDB(tagId, data);

      //OK
      res.status(200).json({
        success: true,
        message: "Tag updated successfuly",
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

    const { success, data, error } = await sizeValidationSchema.safeParse(
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
      await productServices.updateSizeIntoDB(sizeId, data);

      //OK
      res.status(200).json({
        success: true,
        message: "Size updated successfuly",
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

    const { success, data, error } = await colorValidationSchema.safeParse(
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
      await productServices.updateColorIntoDB(colorId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Color updated successfuly",
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
    const { success, data, error } = await productImageSchema.safeParse({
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

//Delete
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    await productServices.deleteCategoryFromDB(categoryId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete category successfully",
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

    await productServices.deleteTagFromDB(tagId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete tag successfully",
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
const deleteSize = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.id);

    await productServices.deleteSizeFromDB(sizeId);
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
const deleteColor = async (req: Request, res: Response) => {
  try {
    const colorId = Number(req.params.id);

    await productServices.deleteColorFromDB(colorId);
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
