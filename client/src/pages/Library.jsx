
import { useRef, useState } from "react";
import {
  Search,
  BookOpen,
  Trash2,
  Plus,
  BookCheck,
  Pencil,
  Upload,
  FileText,
} from "lucide-react";

import { useBooks } from "../context/BookContext";
import ProgressBar from "../components/ProgressBar";
import EditBookModal from "../components/EditBookModal";

export default function Library({ onAddBook }) {
  const { books, deleteBook, uploadBookFile } = useBooks();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [uploadingBookId, setUploadingBookId] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedBookForUpload, setSelectedBookForUpload] = useState(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || book.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getProgress = (book) => {
    if (!book.totalPages) return 0;

    return Math.min(
      100,
      Math.round((book.currentPage / book.totalPages) * 100)
    );
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    setDeletingBookId(id);

    try {
      await deleteBook(id);
    } catch (error) {
      console.error("Could not delete book:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting the book. Please try again."
      );
    } finally {
      setDeletingBookId(null);
    }
  };

  const openFilePicker = (book) => {
    setSelectedBookForUpload(book);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !selectedBookForUpload) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["pdf", "epub"].includes(extension)) {
      alert("Please select a PDF or EPUB file.");
      event.target.value = "";
      return;
    }

    const maxSize = 50 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File is too large. Maximum allowed size is 50 MB.");
      event.target.value = "";
      return;
    }

    const bookId = selectedBookForUpload.id;

    setUploadingBookId(bookId);

    try {
      await uploadBookFile(bookId, file);

      alert("Your book file was uploaded successfully!");
    } catch (error) {
      console.error("Book file upload failed:", error);

      alert(
        error.response?.data?.message ||
          "Could not upload your book file. Please try again."
      );
    } finally {
      setUploadingBookId(null);
      setSelectedBookForUpload(null);
      event.target.value = "";
    }
  };

  return (
    <div className="library-page">
      <div className="library-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
          <h1>My Library</h1>
          <p className="page-description">
            Every book has a story. Keep track of yours.
          </p>
        </div>

        <button className="library-add-button" onClick={onAddBook}>
          <Plus size={17} />
          Add a Book
        </button>
      </div>

      <div className="library-toolbar">
        <div className="library-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          className="library-filter"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="All">All Books</option>
          <option value="Currently Reading">Currently Reading</option>
          <option value="Want to Read">Want to Read</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="library-results">
        <span>
          {filteredBooks.length}{" "}
          {filteredBooks.length === 1 ? "book" : "books"}
        </span>

        <span>
          {selectedStatus === "All" ? "All statuses" : selectedStatus}
        </span>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="library-grid">
          {filteredBooks.map((book) => {
            const progress = getProgress(book);
            const isUploading = uploadingBookId === book.id;

            return (
              <article className="library-book-card" key={book.id}>
                <div className="library-cover-wrapper">
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    className="library-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/300x450/e9e1d5/633f38?text=No+Cover";
                    }}
                  />

                  <span
                    className={`book-status status-${book.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {book.status}
                  </span>
                </div>

                <div className="library-book-info">
                  <p className="library-book-genre">
                    {book.genre || "Uncategorized"}
                  </p>

                  <h3>{book.title}</h3>

                  <p className="library-book-author">{book.author}</p>

                  {book.status !== "Want to Read" && (
                    <div className="library-progress">
                      <div className="library-progress-label">
                        <span>
                          {book.currentPage} / {book.totalPages} pages
                        </span>

                        <span>{progress}%</span>
                      </div>

                      <ProgressBar progress={progress} />
                    </div>
                  )}

                  <div className="library-card-actions">
                    <span className="library-page-count">
                      <BookOpen size={14} />
                      {book.totalPages} pages
                    </span>

                    <div className="library-action-buttons">
                      <button
                        className="library-edit-button"
                        title={`Edit ${book.title}`}
                        aria-label={`Edit ${book.title}`}
                        onClick={() => setEditingBook(book)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="library-delete-button"
                        title={`Delete ${book.title}`}
                        aria-label={`Delete ${book.title}`}
                        disabled={deletingBookId === book.id}
                        onClick={() =>
                          handleDelete(book.id, book.title)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="library-file-section">
                    <button
                      className="library-upload-button"
                      onClick={() => openFilePicker(book)}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Upload size={15} />
                          Uploading...
                        </>
                      ) : book.fileUrl ? (
                        <>
                          <FileText size={15} />
                          Replace File
                        </>
                      ) : (
                        <>
                          <Upload size={15} />
                          Upload PDF/EPUB
                        </>
                      )}
                    </button>

                    {book.fileUrl && (
                      <p className="library-file-info">
                        <FileText size={13} />
                        {book.originalFileName || `${book.fileType} file`}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="library-empty-state">
          <BookCheck size={38} />
          <h3>No books found</h3>

          <p>
            {books.length === 0
              ? "Your library is empty. Add your first book to get started."
              : "Try another search term or change your selected filter."}
          </p>

          {books.length === 0 && (
            <button
              className="library-add-button"
              onClick={onAddBook}
            >
              <Plus size={17} />
              Add Your First Book
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {editingBook && (
        <EditBookModal
          isOpen={true}
          book={editingBook}
          onClose={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
