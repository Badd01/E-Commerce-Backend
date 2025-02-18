import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config/jwtToken";
import { userServices } from "../services/user.services";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    //Unauthorized
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const decoded = verify(token, secret) as { email: string };

    // Find user
    const user = await userServices.findUserByEmailFromDB(decoded.email);

    if (!user) {
      //Unauthorized
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    // Attach user to request
    (req as any).user = user;
    console.log(user);

    next();
  } catch (error: any) {
    console.log("Error: ", error);
    //Unauthorized
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Get user from request
  const user = (req as any).user;

  // Check role
  if (user.role !== "Admin") {
    //Forbidden
    res.status(403).json({ success: false, message: "Forbidden! Not Admin" });
    return;
  }

  next();
};

export { authMiddleware, isAdmin };
