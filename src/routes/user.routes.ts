import express from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.get("/refresh", userController.handleRefreshToken);

//User
router.put("/:id", authMiddleware, userController.updateAUser);
router.delete("/:id", authMiddleware, userController.deleteAUser);

//Admin
router.get("/all-users", authMiddleware, isAdmin, userController.getAllUsers);
router.get("/:id", authMiddleware, isAdmin, userController.getAUser);

export const userRoutes = router;
