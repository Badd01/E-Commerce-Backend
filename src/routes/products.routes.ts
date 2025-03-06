import express from "express";
import { productsController } from "../controllers/products.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/review", authenticate, productsController.createReview);
router.post(
  "/",
  authenticate,
  isAdmin,
  uploadMiddleware.single("image"),
  productsController.createProduct
);
router.get("/", productsController.getProducts);
router.get("/:slug", productsController.getProductBySlug);
router.put(
  "/:slug",
  authenticate,
  isAdmin,
  uploadMiddleware.single("image"),
  productsController.updateProduct
);
router.delete(
  "/:slug",
  authenticate,
  isAdmin,
  productsController.deleteProduct
);

export const productsRoutes = router;
