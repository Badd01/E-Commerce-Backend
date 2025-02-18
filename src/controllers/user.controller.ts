import { Request, Response } from "express";
import {
  userUpdateValidationSchema,
  userValidationSchema,
} from "../validations/user.validation";
import { userServices } from "../services/user.services";
import generateToken from "../config/jwtToken";
import generateRefreshToken from "../config/refreshToken";
import { secret } from "../config/refreshToken";
import { verify } from "jsonwebtoken";
const registerUser = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = await userValidationSchema.safeParse(
      req.body
    );

    if (!success) {
      console.log("Error: ", error);
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    } else {
      const existUser = await userServices.findUserByEmailFromDB(
        req.body.email
      );

      // Already exists
      if (existUser) {
        //Conflict
        res.status(409).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }

      // Check password, if < 8 characters long
      if (data.password.length < 8) {
        //Bad Request
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
        return;
      }

      await userServices.createAUserIntoDB(data);
      //Created
      res.status(201).json({
        success: true,
        message: "User created successfully",
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

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Check email
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
    const isValidPassword = await userServices.checkPassword(
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

    const refreshToken = await generateRefreshToken(result.email);

    await userServices.updateRefreshTokenIntoDB(result.email, refreshToken);

    //Send cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
    });

    // OK
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        phoneNumber: result.phoneNumber,
        address: result.address,
      },
      accessToken: generateToken(result.email),
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

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  //Check refresh token
  if (!cookie?.refreshToken) {
    //Unauthorized
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const refreshToken = cookie.refreshToken;
  //Find user by refresh token from db
  const result = await userServices.findUserByRefreshTokenFromDB(refreshToken);

  if (!result) {
    //Unauthorized
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = verify(refreshToken, secret) as {
      email: string;
    };

    if (result.email !== decoded.email) {
      //Unauthorized
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // New access token
    const accessToken = generateToken(result.email);
    res.json({ accessToken });
  } catch (error: any) {
    console.log("Error: ", error);
    //Unauthorized
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  const cookie = req.cookies;

  //Check refresh token
  if (!cookie?.refreshToken) {
    //Unauthorized
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const refreshToken = cookie.refreshToken;
  //Find user by refresh token from db
  const result = await userServices.findUserByRefreshTokenFromDB(refreshToken);

  if (!result) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });
    //No content
    res.sendStatus(204);
    return;
  }
  console.log("hello");
  await userServices.deleteRefreshTokenFromDB(result.email);
  res.clearCookie("refreshToken", {
    httpOnly: true,
  });
  //No content
  res.sendStatus(204);
};

const updateAUser = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id;

    if (Number(req.params.id) !== id) {
      //Forbidden
      res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource",
      });
      return;
    }

    const { success, data, error } = await userUpdateValidationSchema.safeParse(
      req.body
    );
    if (!success) {
      console.log("Error: ", error);
      //Bad Request
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    } else {
      await userServices.updateUserIntoDB(id, data);
      //OK
      res.status(200).json({
        success: true,
        message: "Update user successfully",
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.findAllUsersFromDB();
    if (!users) {
      // Not Found
      res.status(404).json({
        success: false,
        message: "No user found",
      });
      return;
    }
    //OK
    res.status(200).json({
      sucess: true,
      message: "Get all users successfully",
      data: users,
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

const getAUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userServices.findUserByIdFromDB(id);
    if (!user) {
      // Not Found
      res.status(404).json({
        success: false,
        message: "No user found",
      });
      return;
    }
    //OK
    res.status(200).json({
      success: true,
      message: "Get user successfully",
      data: user,
    });
  } catch (error: any) {
    console.log("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteAUser = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id;

    if (Number(req.params.id) !== id) {
      //Forbidden
      res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource",
      });
      return;
    }

    const user = await userServices.findUserByIdFromDB(id);
    if (!user) {
      // Not Found
      res.status(404).json({
        success: false,
        message: "No user found",
      });
      return;
    }
    await userServices.deleteUserFromDB(id);
    //OK
    res.status(200).json({
      success: true,
      message: "Delete user successfully",
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

export const userController = {
  registerUser,
  getAllUsers,
  getAUser,
  loginUser,
  updateAUser,
  deleteAUser,
  handleRefreshToken,
  logoutUser,
};
