
import { useState } from "react";
import { X, BookPlus } from "lucide-react";
import { useBooks } from "../context/BookContext";

export default function AddBookModal({ isOpen, onClose }) {
  const { addBook } = useBooks();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    totalPages: "",
    currentPage: 0,
    status: "Want to Read",
    cover: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      totalPages: "",
      currentPage: 0,
      status: "Want to Read",
      cover: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Please enter the book title and author.");
      return;
    }

    if (
      !formData.totalPages ||
      !Number.isInteger(Number(formData.totalPages)) ||
      Number(formData.totalPages) <= 0
    ) {
      alert("Please enter a valid total page count.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.currentPage)) ||
      Number(formData.currentPage) < 0 ||
      Number(formData.currentPage) > Number(formData.totalPages)
    ) {
      alert("Current page must be between 0 and total pages.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addBook({
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim() || "Other",
        totalPages: Number(formData.totalPages),
        currentPage: Number(formData.currentPage),
        cover:
          formData.cover.trim() ||
          "https://placehold.co/300x450/e9e1d5/633f38?text=No+Cover",
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Could not add book:", error);

      alert(
        error.response?.data?.message ||
        "Something went wrong while adding the book. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="book-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Add a New Book</h2>
            <p>Add a book to your personal library.</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>Book Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author's name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Mystery">Mystery</option>
                <option value="Self-help">Self-help</option>
                <option value="Science">Science</option>
                <option value="Biography">Biography</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Pages *</label>
              <input
                type="number"
                name="totalPages"
                value={formData.totalPages}
                onChange={handleChange}
                placeholder="e.g. 320"
                min="1"
                step="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Page</label>
              <input
                type="number"
                name="currentPage"
                value={formData.currentPage}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label>Reading Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Book Cover Image URL</label>
            <input
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              placeholder="Paste an image URL (optional)"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <BookPlus size={17} />
              {isSubmitting ? "Adding..." : "Add to Library"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
