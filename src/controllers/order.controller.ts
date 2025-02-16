import { Request, Response } from "express";

//User
const createOrder = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const getOrderByUser = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const getOrderDetail = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const updateOrderByUser = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//Admin
const getOrdersByAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const updateOrderByAdmin = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export {
  createOrder,
  getOrderDetail,
  getOrderByUser,
  updateOrderByUser,
  getOrdersByAdmin,
  updateOrderByAdmin,
};
