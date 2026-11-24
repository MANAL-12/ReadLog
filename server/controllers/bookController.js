
const mongoose = require('mongoose');
const Book = require('../models/Book');

// Fields users are allowed to create or update
const allowedFields = [
  'title',
  'author',
  'genre',
  'totalPages',
  'currentPage',
  'status',
  'cover',
];

// GET /api/books
// Retrieve books belonging to the logged-in user
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not retrieve books.',
    });
  }
};

// POST /api/books
// Add a new book to the logged-in user's library
const addBook = async (req, res) => {
  try {
    const bookData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        bookData[field] = req.body[field];
      }
    });

    const book = await Book.create({
      ...bookData,
      user: req.user.userId,
    });

    res.status(201).json({
      message: 'Book added successfully!',
      book,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Could not add book.',
    });
  }
};

// PUT /api/books/:id
// Update a book owned by the logged-in user
const updateBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: 'Book not found.',
      });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found.',
      });
    }

    let hasUpdates = false;

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
        hasUpdates = true;
      }
    });

    if (!hasUpdates) {
      return res.status(400).json({
        message: 'No valid book fields provided.',
      });
    }

    await book.save();

    res.status(200).json({
      message: 'Book updated successfully!',
      book,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Could not update book.',
    });
  }
};

// DELETE /api/books/:id
// Delete a book owned by the logged-in user
const deleteBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: 'Book not found.',
      });
    }

    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found.',
      });
    }

    res.status(200).json({
      message: 'Book deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not delete book.',
    });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
};
