import express from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { orderController } from "../controllers/order.controller";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.delete("/logout", userController.logoutUser);
router.get("/refresh", userController.handleRefreshToken);

//Password
router.post("/forgot-password", userController.forgotPasswordToken);
router.put("/reset-password/:token", userController.resetPassword);

//Order
router.post("/cart", authMiddleware, orderController.addToCart);
router.get("/cart", authMiddleware, orderController.getCart);
router.delete("/cart", authMiddleware, orderController.deleteCart);
router.post("/order", authMiddleware, orderController.createOrder);
router.get("/order", authMiddleware, orderController.getOrder);
router.get("/order/:id", authMiddleware, orderController.getOrderDetail);
router.put("/order/:id", authMiddleware, orderController.updateOrder);

//User
router.patch("/me", authMiddleware, userController.updateAUser);
router.delete("/me", authMiddleware, userController.deleteAUser);
router.put("/password", authMiddleware, userController.updatePassword);

//Admin
router.get("/users", authMiddleware, isAdmin, userController.getAllUsers);
router.get("/:id", authMiddleware, isAdmin, userController.getAUser);

export const userRoutes = router;
