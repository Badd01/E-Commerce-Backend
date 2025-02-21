import { Request, Response } from "express";
import {
  categoryValidationSchema,
  colorValidationSchema,
  sizeValidationSchema,
  tagValidationSchema,
  brandValidationSchema,
} from "../validations/attributes.validation";
import { attributesServices } from "../services/attributes.services";

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
      await attributesServices.createACategoryIntoDB(data);
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

const createBrand = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await brandValidationSchema.safeParse(
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
      await attributesServices.createABrandIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Brand created successfully",
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
      await attributesServices.createATagIntoDB(data);
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
      await attributesServices.createASizeIntoDB(data);
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
      await attributesServices.createAColorIntoDB(data);
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

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllCategoryFromDB();

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

const getAllBrand = async (req: Request, res: Response) => {
  try {
    const result = await attributesServices.getAllBrandFromDB();

    if (!result || result.length === 0) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No brand found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get data brands successfully",
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
    const result = await attributesServices.getAllTagFromDB();

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
    const result = await attributesServices.getAllColorFromDB();

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
    const result = await attributesServices.getAllSizeFromDB();

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

const getSingleTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);

    const data = await attributesServices.getSingleTagFromDB(tagId);

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

const getSingleBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    const data = await attributesServices.getSingleBrandFromDB(brandId);

    if (!data) {
      //Not Found
      res.status(404).json({
        success: false,
        message: "No brand found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Brand retrieved successfully",
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
      await attributesServices.updateCategoryIntoDB(categoryId, data);
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

const updateBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    const { success, data, error } = await brandValidationSchema.safeParse(
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
      await attributesServices.updateBrandIntoDB(brandId, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Brand updated successfuly",
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
      await attributesServices.updateTagIntoDB(tagId, data);

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
      await attributesServices.updateSizeIntoDB(sizeId, data);

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
      await attributesServices.updateColorIntoDB(colorId, data);
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
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    await attributesServices.deleteCategoryFromDB(categoryId);
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

const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    await attributesServices.deleteBrandFromDB(brandId);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete brand successfully",
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

    await attributesServices.deleteTagFromDB(tagId);
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

const deleteSize = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.id);

    await attributesServices.deleteSizeFromDB(sizeId);
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

    await attributesServices.deleteColorFromDB(colorId);
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
