import multer from "multer";
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

const uploadImage = multer({ storage: storageImage });
