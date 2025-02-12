import express from "express";
import { productController } from "../controllers/product.controller";

const router = express.Router();

router.post("/create", productController.createProduct);
router.post("/create/variant", productController.createProductVariant);
router.post("/create/size", productController.createSize);
router.post("/create/color", productController.createColor);
router.post("/create/tag", productController.createTag);
router.post("/create/category", productController.createCategory);

export const ProductRoutes = router;
