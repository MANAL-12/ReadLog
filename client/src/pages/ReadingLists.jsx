
import { useState } from "react";
import {
  Plus,
  Bookmark,
  BookOpen,
  Trash2,
  X,
  Library,
} from "lucide-react";

import { useBooks } from "../context/BookContext";

export default function ReadingLists() {
  const {
    books,
    lists,
    addList,
    deleteList,
    addBookToList,
    removeBookFromList,
  } = useBooks();

  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [selectedBooks, setSelectedBooks] = useState({});

  // Create a new reading list
  const handleCreateList = (event) => {
    event.preventDefault();

    if (!listName.trim()) {
      alert("Please enter a name for your reading list.");
      return;
    }

    addList(listName, listDescription);

    setListName("");
    setListDescription("");
  };

  // Add a selected book to a particular list
  const handleAddBook = (listId) => {
    const bookId = selectedBooks[listId];

    if (!bookId) {
      alert("Please select a book first.");
      return;
    }

    addBookToList(listId, bookId);

    setSelectedBooks((previous) => ({
      ...previous,
      [listId]: "",
    }));
  };

  // Delete a complete reading list
  const handleDeleteList = (listId, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (confirmed) {
      deleteList(listId);
    }
  };

  return (
    <div className="reading-lists-page">

      {/* Page heading */}
      <div className="reading-lists-heading">
        <div>
          <p className="eyebrow">ORGANISE YOUR READING</p>
          <h1>Reading Lists</h1>
          <p className="page-description">
            Gather books around your interests, moods and goals.
          </p>
        </div>
      </div>

      {/* Create list form */}
      <section className="create-list-card">
        <div className="create-list-title">
          <div className="create-list-icon">
            <Bookmark size={20} />
          </div>
          <div>
            <h2>Create a New List</h2>
            <p>Give your collection a name and a little description.</p>
          </div>
        </div>

        <form onSubmit={handleCreateList} className="create-list-form">
          <div className="form-group">
            <label htmlFor="listName">List Name *</label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="e.g. Books to Read in 2027"
              maxLength={60}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="listDescription">Description</label>
            <input
              id="listDescription"
              type="text"
              value={listDescription}
              onChange={(event) => setListDescription(event.target.value)}
              placeholder="A little note about this collection..."
              maxLength={120}
            />
          </div>

          <button type="submit" className="create-list-button">
            <Plus size={17} />
            Create List
          </button>
        </form>
      </section>

      {/* List collection */}
      <section className="reading-list-collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR COLLECTIONS</p>
            <h2>My Reading Lists</h2>
          </div>
          <span className="section-count">
            {lists.length} {lists.length === 1 ? "list" : "lists"}
          </span>
        </div>

        {lists.length > 0 ? (
          <div className="reading-lists-grid">
            {lists.map((list) => {
              const listBooks = list.bookIds
                .map((bookId) =>
                  books.find((book) => book.id === bookId)
                )
                .filter(Boolean);

              const availableBooks = books.filter(
                (book) => !list.bookIds.includes(book.id)
              );

              return (
                <article className="reading-list-card" key={list.id}>
                  <div className="reading-list-card-header">
                    <div className="reading-list-card-icon">
                      <Bookmark size={19} />
                    </div>

                    <button
                      className="delete-list-button"
                      title={`Delete ${list.name}`}
                      onClick={() =>
                        handleDeleteList(list.id, list.name)
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <h3>{list.name}</h3>

                  <p className="reading-list-description">
                    {list.description || "A personal collection of books."}
                  </p>

                  <div className="reading-list-count">
                    <BookOpen size={15} />
                    {listBooks.length}{" "}
                    {listBooks.length === 1 ? "book" : "books"}
                  </div>

                  {/* Books inside this list */}
                  <div className="reading-list-books">
                    {listBooks.length > 0 ? (
                      listBooks.map((book) => (
                        <div className="reading-list-book" key={book.id}>
                          <img
                            src={book.cover}
                            alt={`Cover of ${book.title}`}
                            onError={(event) => {
                              event.currentTarget.src =
                                "https://placehold.co/60x90/e9e1d5/633f38?text=Book";
                            }}
                          />

                          <div className="reading-list-book-info">
                            <h4>{book.title}</h4>
                            <p>{book.author}</p>
                          </div>

                          <button
                            className="remove-list-book-button"
                            title={`Remove ${book.title} from this list`}
                            onClick={() =>
                              removeBookFromList(list.id, book.id)
                            }
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-list-message">
                        <Library size={23} />
                        <p>No books added yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Add books to this list */}
                  <div className="add-book-to-list">
                    {availableBooks.length > 0 ? (
                      <>
                        <select
                          value={selectedBooks[list.id] || ""}
                          onChange={(event) =>
                            setSelectedBooks((previous) => ({
                              ...previous,
                              [list.id]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Choose a book...</option>
                          {availableBooks.map((book) => (
                            <option key={book.id} value={book.id}>
                              {book.title}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleAddBook(list.id)}
                          disabled={!selectedBooks[list.id]}
                        >
                          <Plus size={15} />
                          Add
                        </button>
                      </>
                    ) : (
                      <p className="all-books-added">
                        All your library books are in this list.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="reading-lists-empty">
            <Bookmark size={38} />
            <h3>Your reading lists start here</h3>
            <p>
              Create your first list to organise books into
              collections that matter to you.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
