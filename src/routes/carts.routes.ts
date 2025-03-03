import express from "express";
import { cartsController } from "../controllers/carts.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post("/add", authenticate, cartsController.addToCart);
router.get("/", authenticate, cartsController.getCart);
router.delete("/delete", authenticate, cartsController.clearCart);
router.delete("/remove", authenticate, cartsController.removeCartItem);

export const cartsRoutes = router;
