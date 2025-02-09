import { Router } from "express";
import {
  listProducts,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productsController";

const router = Router();
router.get("/", listProducts);
router.get("/:id", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
