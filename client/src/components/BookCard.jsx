
import { MoreHorizontal } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function BookCard({ book }) {

  // Calculate reading progress from the current and total pages
  const totalPages = Number(book.totalPages) || 0;
  const currentPage = Number(book.currentPage) || 0;

  const progress = totalPages > 0
    ? Math.min(
        100,
        Math.max(0, Math.round((currentPage / totalPages) * 100))
      )
    : 0;

  return (
    <div className="book-card">
      <div className="book-cover-wrapper">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="book-cover"
          loading="lazy"
        />

        <span className={`book-status ${book.status === 'Completed' ? 'completed' : ''}`}>
          {book.status}
        </span>
      </div>

      <div className="book-card-info">
        <div className="book-title-row">
          <h4>{book.title}</h4>

          <button
            className="more-button"
            aria-label={`More options for ${book.title}`}
          >
            <MoreHorizontal size={19} />
          </button>
        </div>

        <p className="book-author">{book.author}</p>

        {book.status === 'Currently Reading' && (
          <>
            <div className="book-progress-info">
              <span>Reading progress</span>
              <span>{progress}%</span>
            </div>

            <ProgressBar progress={progress} />
          </>
        )}

        {book.status === 'Completed' && (
          <span className="completed-label">
            Finished reading
          </span>
        )}
      </div>
    </div>
  );
}
