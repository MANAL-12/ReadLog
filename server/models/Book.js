
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      default: "Other",
      trim: true,
    },

    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },

    currentPage: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Want to Read", "Currently Reading", "Completed"],
      default: "Want to Read",
    },

    cover: {
      type: String,
      default: "",
    },

    // Uploaded book file information
    fileUrl: {
      type: String,
      default: "",
    },

    filePublicId: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["pdf", "epub", ""],
      default: "",
    },

    originalFileName: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Validate reading progress
bookSchema.pre("validate", function () {
  if (this.currentPage > this.totalPages) {
    this.invalidate(
      "currentPage",
      "Current page cannot exceed total pages."
    );
  }

  if (this.currentPage === this.totalPages) {
    this.status = "Completed";
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
