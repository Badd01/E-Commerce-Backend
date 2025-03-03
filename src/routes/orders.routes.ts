import express from "express";
import { ordersController } from "../controllers/orders.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post("/create", authenticate, ordersController.createOrder);
router.get("/", authenticate, ordersController.getOrdersByUser);
router.get("/admin", authenticate, isAdmin, ordersController.getOrdersByAdmin);
router.put(
  "/update",
  authenticate,
  isAdmin,
  ordersController.updateOrderStatus
);

export const ordersRoutes = router;
