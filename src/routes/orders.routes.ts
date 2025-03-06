import express from "express";
import { ordersController } from "../controllers/orders.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.get("/revenue", authenticate, isAdmin, ordersController.getRevenue);
router.post("/create", authenticate, ordersController.createOrder);

router.get(
  "/all-order",
  authenticate,
  isAdmin,
  ordersController.getOrdersByAdmin
);

router.get("/order/:id", authenticate, isAdmin, ordersController.getOrder);
router.put(
  "/order/:id",
  authenticate,
  isAdmin,
  ordersController.updateOrderStatus
);
router.get("/:id", authenticate, ordersController.getOrdersByUser);

export const ordersRoutes = router;
