
const { Readable } = require("stream");
const path = require("path");
const mongoose = require("mongoose");

const Book = require("../models/Book");
const cloudinary = require("../config/cloudinary");

// Upload a file buffer to Cloudinary
const uploadToCloudinary = (file, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: `readlog/books/${userId}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

// Upload a PDF or EPUB file to an existing book
const uploadBookFile = async (req, res) => {
  let uploadedFile = null;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid book ID.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a PDF or EPUB file.",
      });
    }

    // Find the book belonging to the logged-in user
    const book = await Book.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found in your library.",
      });
    }

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase()
      .replace(".", "");

    // Upload the file to Cloudinary
    uploadedFile = await uploadToCloudinary(
      req.file,
      req.user.userId
    );

    // Remember the previous file in case the user replaces it
    const previousPublicId = book.filePublicId;

    // Save the new file information in MongoDB
    book.fileUrl = uploadedFile.secure_url;
    book.filePublicId = uploadedFile.public_id;
    book.fileType = extension;
    book.originalFileName = req.file.originalname;
    book.fileSize = uploadedFile.bytes;

    await book.save();

    // Remove the previous Cloudinary file after the new one is saved
    if (previousPublicId) {
      try {
        await cloudinary.uploader.destroy(previousPublicId, {
          resource_type: "raw",
        });
      } catch (cleanupError) {
        console.error(
          "Could not remove previous book file:",
          cleanupError.message
        );
      }
    }

    return res.status(200).json({
      message: "Book file uploaded successfully!",
      book,
    });
  } catch (error) {
    console.error("Book file upload error:", error.message);

    // Clean up the newly uploaded file if saving to MongoDB failed
    if (uploadedFile?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedFile.public_id, {
          resource_type: "raw",
        });
      } catch (cleanupError) {
        console.error(
          "Could not clean up uploaded file:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      message: "Could not upload your book file. Please try again.",
    });
  }
};

module.exports = {
  uploadBookFile,
};
