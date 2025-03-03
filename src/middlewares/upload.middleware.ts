import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// Product image
const storage = multer.diskStorage({
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

// Only accept image
const fileFilter = (
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
  storage,
  fileFilter,
});
