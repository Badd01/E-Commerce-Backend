import express from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/google/callback", authController.googleCallback);

export const authRoutes = router;
