import express from "express";
import { shopController } from "../controllers/shop.controller";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post(
  "/categories",
  authenticate,
  isAdmin,
  shopController.createCategory
);
router.post("/tags", authenticate, isAdmin, shopController.createTag);
router.post("/colors", authenticate, isAdmin, shopController.createColor);
router.post("/years", authenticate, isAdmin, shopController.createYear);

router.get("/", shopController.getAllShop);
router.get("/categories", shopController.getAllCategories);
router.get("/tags", shopController.getAllTags);
router.get("/colors", shopController.getAllColors);
router.get("/years", shopController.getAllYears);

router.put(
  "/categories/:id",
  authenticate,
  isAdmin,
  shopController.updateCategory
);
router.put("/tags/:id", authenticate, isAdmin, shopController.updateTag);
router.put("/colors/:id", authenticate, isAdmin, shopController.updateColor);
router.put("/years/:id", authenticate, isAdmin, shopController.updateYear);

router.delete(
  "/categories/:id",
  authenticate,
  isAdmin,
  shopController.deleteCategory
);
router.delete("/tags/:id", authenticate, isAdmin, shopController.deleteTag);
router.delete("/colors/:id", authenticate, isAdmin, shopController.deleteColor);
router.delete("/years/:id", authenticate, isAdmin, shopController.deleteYear);

export const shopRoutes = router;
