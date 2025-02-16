import { Request, Response } from "express";
import { userValidationSchema } from "../validations/user.validation";
import { userServices } from "../services/user.services";

// User
const registerAccount = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = userValidationSchema.safeParse(req.body);

    if (!success) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: error,
      });
    } else {
      const existUser = await userServices.findUserByEmailFromDB(
        req.body.email
      );

      if (existUser) {
        //Conflict
        res.status(409).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }

      if (data.password.length < 8) {
        //Bad Request
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
        return;
      }

      const result = await userServices.createAnAccountIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Find email
    const result = await userServices.findUserByEmailFromDB(email);
    if (!result) {
      //Unauthorized
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    //Check password
    const isValidPassword = userServices.checkPassword(
      password,
      result.password
    );
    if (!isValidPassword) {
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid password",
      });
      return;
    }

    // OK
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const updateAcount = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const deleteAccount = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//Admin
const getAllAcount = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.log("Error: ", error);
    //Internal Server Error
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const userController = {
  registerAccount,
  getAllAcount,
  loginAccount,
  updateAcount,
  deleteAccount,
};
