import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADMIN, JWT_SECRET } from "../utils/config";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id: number;
      role: string;
    };
    if (!decoded.id || !decoded.role) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.log("Error verifying token: ", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== ADMIN) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};
