import express from "express";
import { usersController } from "../controllers/users.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.get("/all-user", authenticate, isAdmin, usersController.getAllUser);
router.put("/update", authenticate, usersController.updateUser);
router.put("/update/password", authenticate, usersController.changePassword);
router.put(
  "/update/role/:id",
  authenticate,
  isAdmin,
  usersController.updateRoleUser
);
router.get("/:id", authenticate, usersController.getUser);
router.delete("/:id", authenticate, isAdmin, usersController.deleteUser);

export const usersRoutes = router;
