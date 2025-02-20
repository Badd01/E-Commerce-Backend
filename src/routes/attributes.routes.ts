import express from "express";
import { attributesController } from "../controllers/attributes.controller";
import { isAdmin, authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

//Category
router.post(
  "/create/category",
  authMiddleware,
  isAdmin,
  attributesController.createCategory
);
router.get("/category", attributesController.getAllCategory);
router.put(
  "/category/:id",
  authMiddleware,
  isAdmin,
  attributesController.updateCategory
);
router.delete(
  "/category/:id",
  authMiddleware,
  isAdmin,
  attributesController.deleteCategory
);

// Tag
router.post(
  "/create/tag",
  authMiddleware,
  isAdmin,
  attributesController.createTag
);
router.get("/tag", attributesController.getAllTag);
router.get("/tag/:id", attributesController.getSingleTag);
router.put("/tag/:id", authMiddleware, isAdmin, attributesController.updateTag);
router.delete(
  "/tag/:id",
  authMiddleware,
  isAdmin,
  attributesController.deleteTag
);

//Size
router.post(
  "/create/size",
  authMiddleware,
  isAdmin,
  attributesController.createSize
);
router.get("/size", attributesController.getAllSize);
router.put(
  "/size/:id",
  authMiddleware,
  isAdmin,
  attributesController.updateSize
);
router.delete(
  "/size/:id",
  authMiddleware,
  isAdmin,
  attributesController.deleteSize
);

//Color
router.post(
  "/create/color",
  authMiddleware,
  isAdmin,
  attributesController.createColor
);
router.get("/color", attributesController.getAllColor);
router.put(
  "/color/:id",
  authMiddleware,
  isAdmin,
  attributesController.updateColor
);
router.delete(
  "/color/:id",
  authMiddleware,
  isAdmin,
  attributesController.deleteColor
);

export const attributesRoutes = router;
