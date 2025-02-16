import express from "express";
import { userController } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", userController.registerAccount);
router.post("/login", userController.loginAccount);

export const userRoutes = router;
