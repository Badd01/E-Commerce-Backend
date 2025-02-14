import express from "express";
import { productController } from "../controllers/product.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = express.Router();

//Create
router.post("/create/category", productController.createCategory);
router.post("/create/tag", productController.createTag);
router.post("/create/size", productController.createSize);
router.post("/create/color", productController.createColor);
router.post("/create", productController.createProduct);
router.post("/create/variant", productController.createProductVariant);

// Upload image
router.post(
  "/create/image",
  uploadMiddleware.single("image"),
  productController.createProductImage
);

//Get
router.get("/category");
router.get("/tag");
router.get("/size");
router.get("/color");
router.get("/variant");
router.get("/image");

//Put

//Delete

export const ProductRoutes = router;
