
const express = require("express");

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const {
  uploadBookFile,
} = require("../controllers/bookFileController");

const protect = require("../middleware/authMiddleware");
const uploadBook = require("../middleware/uploadMiddleware");

const router = express.Router();

// Protect all book routes
router.use(protect);

// Existing book routes
router.get("/", getBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

// Handle file upload errors
const handleBookUpload = (req, res, next) => {
  uploadBook.single("bookFile")(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "File is too large. Maximum allowed size is 50 MB.",
        });
      }

      return res.status(400).json({
        message: error.message || "Could not process the uploaded file.",
      });
    }

    next();
  });
};

// Upload a PDF or EPUB to an existing book
router.post("/:id/file", handleBookUpload, uploadBookFile);

module.exports = router;
