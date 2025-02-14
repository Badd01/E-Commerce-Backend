import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// Product image
const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/db/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check file filter
const checkFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not a image!"));
  }
};

export const uploadMiddleware = multer({
  storage: storageImage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
