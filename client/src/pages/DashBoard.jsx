
import {
  BookOpen,
  BookCheck,
  Bookmark,
  Library,
  Plus,
  Sparkles,
} from "lucide-react";

import { useBooks } from "../context/BookContext";
import StatCard from "../components/StatCard";
import BookCard from "../components/BookCard";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard({ onAddBook }) {

  // Get the shared book collection
  const { books, updateBook } = useBooks();

  // Calculate statistics from actual book data
  const totalBooks = books.length;

  const currentlyReading = books.filter(
    (book) => book.status === "Currently Reading"
  );

  const completedBooks = books.filter(
    (book) => book.status === "Completed"
  );

  const wantToRead = books.filter(
    (book) => book.status === "Want to Read"
  );

  // Calculate total pages read from all books
  const totalPagesRead = books.reduce(
    (total, book) => total + (Number(book.currentPage) || 0),
    0
  );

  // Calculate overall reading progress
  const overallProgress =
    totalBooks > 0
      ? Math.round(
          (completedBooks.length / totalBooks) * 100
        )
      : 0;

  // Show the most recently added books
  const recentBooks = [...books].reverse().slice(0, 4);

  // Update a book's reading page
  const handleProgressUpdate = (book) => {
    const nextPage = prompt(
      `Enter your current page for "${book.title}" (1-${book.totalPages}):`,
      book.currentPage
    );

    if (nextPage === null) return;

    const page = Number(nextPage);

    if (
      !Number.isInteger(page) ||
      page < 0 ||
      page > book.totalPages
    ) {
      alert("Please enter a valid page number.");
      return;
    }

    updateBook(book.id, {
      currentPage: page,
      status:
        page === book.totalPages
          ? "Completed"
          : page > 0
            ? "Currently Reading"
            : book.status,
    });
  };

  return (
    <div className="dashboard-page">

      {/* Welcome Section */}
      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR READING SPACE</p>

          <h1>
            A little progress,
            <br />
            one page at a time.
          </h1>

          <p className="welcome-description">
            Every page brings you closer to a new perspective.
            Keep your reading journey moving.
          </p>
        </div>

        <button className="dashboard-add-button" onClick={onAddBook}>
          <Plus size={17} />
          Add a Book
        </button>
      </section>

      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          label="Total Books"
          value={totalBooks}
          subtitle="In your library"
          icon={Library}
        />

        <StatCard
          label="Currently Reading"
          value={currentlyReading.length}
          subtitle="Books in progress"
          icon={BookOpen}
        />

        <StatCard
          label="Completed"
          value={completedBooks.length}
          subtitle="Books finished"
          icon={BookCheck}
        />

        <StatCard
          label="Want to Read"
          value={wantToRead.length}
          subtitle="Waiting on your list"
          icon={Bookmark}
        />

      </section>

      {/* Reading Overview */}
      <section className="reading-overview">

        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PROGRESS</p>
            <h2>Reading Overview</h2>
          </div>
        </div>

        <div className="overview-card">

          <div className="overview-metric">
            <div>
              <p className="overview-label">Total Pages Read</p>
              <h3>{totalPagesRead.toLocaleString("en-IN")}</h3>
            </div>

            <BookOpen size={24} />
          </div>

          <div className="overview-progress">

            <div className="overview-progress-heading">
              <span>Library completion</span>
              <strong>{overallProgress}%</strong>
            </div>

            <ProgressBar progress={overallProgress} />

            <p>
              {completedBooks.length} of {totalBooks} books completed
            </p>

          </div>

        </div>

      </section>

      {/* Currently Reading */}
      <section className="dashboard-books-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p>
            <h2>Continue Reading</h2>
          </div>

          <span className="section-count">
            {currentlyReading.length} books
          </span>
        </div>

        {currentlyReading.length > 0 ? (

          <div className="dashboard-books-grid">

            {currentlyReading.map((book) => (
              <div className="dashboard-book-wrapper" key={book.id}>

                <BookCard book={book} />

                <button
                  className="update-progress-button"
                  onClick={() => handleProgressUpdate(book)}
                >
                  Update Reading Progress
                </button>

              </div>
            ))}

          </div>

        ) : (

          <div className="dashboard-empty">
            <BookOpen size={28} />
            <p>You're not reading anything right now.</p>
            <button onClick={onAddBook}>Start a new book</button>
          </div>

        )}

      </section>

      {/* Recently Added */}
      <section className="dashboard-books-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">FRESHLY ADDED</p>
            <h2>Recently Added</h2>
          </div>

          <Sparkles size={20} />
        </div>

        {recentBooks.length > 0 ? (

          <div className="dashboard-books-grid">

            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}

          </div>

        ) : (

          <div className="dashboard-empty">
            <p>Your library is waiting for its first book.</p>
          </div>

        )}

      </section>

    </div>
  );
}
