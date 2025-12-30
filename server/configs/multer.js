import multer from "multer";
import path from "path";

export const FILE_SIZE_LIMITS = {
  image: 3 * 1024 * 1024, // 3MB
  document: 5 * 1024 * 1024, // 5MB
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  if (file.fieldname === "image") {
    if (
      allowedImageTypes.test(extname) &&
      mimetype.startsWith("image/")
    ) {
      return cb(null, true);
    } else {
      return cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
  }

  if (file.fieldname === "document") {
    if (allowedDocTypes.test(extname) && mimetype === "application/pdf") {
      return cb(null, true);
    } else {
      return cb(new Error("Only PDF files are allowed"));
    }
  }

  cb(new Error("Invalid field name"));
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.document,
  },
});

export const checkFileSize = (req, res, next) => {
  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      if (req.files.image[0].size > FILE_SIZE_LIMITS.image) {
        return res.status(400).json({
          message: `Image size exceeds limit of ${FILE_SIZE_LIMITS.image / (1024 * 1024)}MB`,
        });
      }
    }

    if (req.files.document && req.files.document[0]) {
      if (req.files.document[0].size > FILE_SIZE_LIMITS.document) {
        return res.status(400).json({
          message: `Document size exceeds limit of ${FILE_SIZE_LIMITS.document / (1024 * 1024)}MB`,
        });
      }
    }
  }

  next();
};