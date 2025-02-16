import express from "express";
import { productController } from "../controllers/product.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = express.Router();

//Create
router.post("/create/category", productController.createCategory);
router.post("/create/tag", productController.createTag);
router.post("/create", productController.createProduct);
router.post("/create/size", productController.createSize);
router.post("/create/color", productController.createColor);
router.post("/create/variant", productController.createProductVariant);
router.post(
  "/create/image",
  uploadMiddleware.single("image"),
  productController.createProductImage
);

//Get all
router.get("/category", productController.getAllCategory);
router.get("/tag", productController.getAllTag);
router.get("/", productController.getAllProduct);
router.get("/size", productController.getAllSize);
router.get("/color", productController.getAllColor);
router.get("/variant", productController.getAllProductVariant);
router.get("/image", productController.getAllProductImage);

//Get single
router.get("/tag/:id", productController.getSingleTag);
router.get("/:id", productController.getSingleProduct);
router.get("/variant/:id", productController.getSingleProductVariant);
router.get("/image/:id", productController.getSingleProductImage);

//Put
router.put("/category/:id", productController.updateCategory);
router.put("/tag/:id", productController.updateTag);
router.put("/:id", productController.updateProduct);
router.put("/size/:id", productController.updateSize);
router.put("/color/:id", productController.updateColor);
router.put("/variant/:id", productController.updateProductVariant);
router.put("/image/:id", productController.updateProductImage);

//Delete
router.delete("/category/:id", productController.deleteCategory);
router.delete("/tag/:id", productController.deleteTag);
router.delete("/:id", productController.deleteProduct);
router.delete("/size/:id", productController.deleteSize);
router.delete("/color/:id", productController.deleteColor);
router.delete("/variant/:id", productController.deleteProductVariant);

export const productRoutes = router;
