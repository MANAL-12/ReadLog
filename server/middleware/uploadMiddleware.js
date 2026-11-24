
const multer = require("multer");
const path = require("path");

const allowedTypes = {
  ".pdf": ["application/pdf"],
  ".epub": [
    "application/epub+zip",
    "application/zip",
    "application/octet-stream",
  ],
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = allowedTypes[extension];

  if (!allowedMimeTypes) {
    return callback(
      new Error("Only PDF and EPUB files are allowed.")
    );
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Invalid file type. Please upload a valid PDF or EPUB.")
    );
  }

  callback(null, true);
};

const uploadBook = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

module.exports = uploadBook;
