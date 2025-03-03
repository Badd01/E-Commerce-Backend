import express from "express";
import { usersController } from "../controllers/users.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";

const router = express.Router();

//User
router.post("/review", authenticate, usersController.createReview);
router.get("/me", authenticate, usersController.getUser);
router.put("/me", authenticate, usersController.updateUser);
router.delete("/me", authenticate, usersController.deleteUser);
router.put("/me/password", authenticate, usersController.changePassword);

//Admin
router.get("/all-user", authenticate, isAdmin, usersController.getAllUser);
router.get("/revenue", authenticate, isAdmin, usersController.getRevenue);

export const usersRoutes = router;
