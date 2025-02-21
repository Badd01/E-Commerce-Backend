import express from "express";
import { productController } from "../controllers/product.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { isAdmin, authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

//Product
router.post(
  "/create",
  authMiddleware,
  isAdmin,
  productController.createProduct
);
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, isAdmin, productController.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, productController.deleteProduct);

// Product variant
router.post(
  "/create/variant",
  authMiddleware,
  isAdmin,
  productController.createProductVariant
);
router.get("/variant", productController.getAllProductVariant);
router.get("/variant/:id", productController.getSingleProductVariant);
router.put(
  "/variant/:id",
  authMiddleware,
  isAdmin,
  productController.updateProductVariant
);

router.delete(
  "/variant/:id",
  authMiddleware,
  isAdmin,
  productController.deleteProductVariant
);
//Product image
router.post(
  "/create/image",
  authMiddleware,
  isAdmin,
  uploadMiddleware.single("image"),
  productController.createProductImage
);
router.get("/image", productController.getAllProductImage);
router.get("/image/:id", productController.getSingleProductImage);
router.put(
  "/image/:id",
  authMiddleware,
  isAdmin,
  productController.updateProductImage
);

//Rating
router.post("/rating/:id", authMiddleware, productController.ratingProduct);

export const productRoutes = router;
