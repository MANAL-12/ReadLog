
import { useState, useEffect } from "react";
import {
  BookOpen,
  BookCheck,
  Library,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useBooks } from "../context/BookContext";
import { useAuth } from "../context/AuthContext";

const CHART_COLORS = [
  "#633F38",
  "#283B32",
  "#B58A65",
  "#9C8177",
  "#A6A18B",
  "#D0BCA5",
  "#817B71",
  "#C5A7A0",
];

export default function Statistics() {
  const { books } = useBooks();
  const { user } = useAuth();

  const userId = user?._id || user?.id || null;

  const [readingGoal, setReadingGoal] = useState(24);
  const [goalInput, setGoalInput] = useState("24");

  // Load the reading goal belonging to the logged-in user
  useEffect(() => {
    if (!userId) {
      setReadingGoal(24);
      setGoalInput("24");
      return;
    }

    const storageKey = `readlog-reading-goal-${userId}`;

    const savedGoal = Number(localStorage.getItem(storageKey));
    const goal = Number.isInteger(savedGoal) && savedGoal > 0
      ? savedGoal
      : 24;

    setReadingGoal(goal);
    setGoalInput(String(goal));
  }, [userId]);

  // Calculate basic reading statistics
  const totalBooks = books.length;

  const completedBooks = books.filter(
    (book) => book.status === "Completed"
  );

  const currentlyReading = books.filter(
    (book) => book.status === "Currently Reading"
  );

  const wantToRead = books.filter(
    (book) => book.status === "Want to Read"
  );

  const totalPagesRead = books.reduce(
    (total, book) => total + (Number(book.currentPage) || 0),
    0
  );

  const completionRate = totalBooks > 0
    ? Math.round((completedBooks.length / totalBooks) * 100)
    : 0;

  // Prepare data for the reading status chart
  const statusData = [
    { name: "Completed", value: completedBooks.length },
    { name: "Currently Reading", value: currentlyReading.length },
    { name: "Want to Read", value: wantToRead.length },
  ];

  // Prepare data for the genre chart
  const genreCounts = books.reduce((counts, book) => {
    const genre = book.genre?.trim() || "Uncategorized";

    counts[genre] = (counts[genre] || 0) + 1;

    return counts;
  }, {});

  const genreData = Object.entries(genreCounts).map(
    ([name, value]) => ({
      name,
      books: value,
    })
  );

  // Calculate yearly goal progress
  const goalProgress = readingGoal > 0
    ? Math.min(
        100,
        Math.round((completedBooks.length / readingGoal) * 100)
      )
    : 0;

  // Update and save the reading goal
  const handleGoalUpdate = (event) => {
    event.preventDefault();

    const newGoal = Number(goalInput);

    if (!Number.isInteger(newGoal) || newGoal <= 0) {
      alert("Please enter a valid reading goal.");
      return;
    }

    if (!userId) {
      alert("Please log in to update your reading goal.");
      return;
    }

    setReadingGoal(newGoal);

    localStorage.setItem(
      `readlog-reading-goal-${userId}`,
      String(newGoal)
    );
  };

  return (
    <div className="statistics-page">

      {/* Page heading */}
      <div className="statistics-heading">
        <div>
          <p className="eyebrow">YOUR READING JOURNEY</p>
          <h1>Reading Statistics</h1>
          <p className="page-description">
            A closer look at your reading habits and progress.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <section className="statistics-summary">
        <div className="statistics-card">
          <div className="statistics-card-top">
            <span>Total Books</span>
            <Library size={19} />
          </div>
          <h2>{totalBooks}</h2>
          <p>Books in your library</p>
        </div>

        <div className="statistics-card">
          <div className="statistics-card-top">
            <span>Books Completed</span>
            <BookCheck size={19} />
          </div>
          <h2>{completedBooks.length}</h2>
          <p>Books finished reading</p>
        </div>

        <div className="statistics-card">
          <div className="statistics-card-top">
            <span>Pages Read</span>
            <BookOpen size={19} />
          </div>
          <h2>{totalPagesRead.toLocaleString("en-IN")}</h2>
          <p>Pages across your library</p>
        </div>

        <div className="statistics-card">
          <div className="statistics-card-top">
            <span>Completion Rate</span>
            <TrendingUp size={19} />
          </div>
          <h2>{completionRate}%</h2>
          <p>Of your library completed</p>
        </div>
      </section>

      {/* Charts */}
      <section className="statistics-charts">

        {/* Genre distribution */}
        <div className="statistics-chart-card">
          <div className="statistics-section-heading">
            <div>
              <p className="eyebrow">WHAT YOU READ</p>
              <h2>Genre Distribution</h2>
            </div>
          </div>

          {genreData.length > 0 ? (
            <>
              <div className="genre-chart">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      dataKey="books"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {genreData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="genre-legend">
                {genreData.map((genre, index) => (
                  <div className="genre-legend-item" key={genre.name}>
                    <span
                      className="genre-dot"
                      style={{
                        backgroundColor:
                          CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                    <span>{genre.name}</span>
                    <strong>{genre.books}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="statistics-no-data">
              Add books to see your genre distribution.
            </p>
          )}
        </div>

        {/* Reading status */}
        <div className="statistics-chart-card">
          <div className="statistics-section-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>Reading Status</h2>
            </div>
          </div>

          {totalBooks > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#eee8df"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#817b71" }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={115}
                  tick={{ fontSize: 10, fill: "#817b71" }}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  name="Books"
                  fill="#633F38"
                  radius={[0, 5, 5, 0]}
                  barSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="statistics-no-data">
              Add books to see your reading status.
            </p>
          )}
        </div>
      </section>

      {/* Reading goal */}
      <section className="reading-goal-card">
        <div className="reading-goal-heading">
          <div className="goal-icon">
            <Target size={22} />
          </div>

          <div>
            <p className="eyebrow">A GOAL TO WORK TOWARDS</p>
            <h2>Your Yearly Reading Goal</h2>
          </div>
        </div>

        <div className="reading-goal-progress">
          <div className="reading-goal-numbers">
            <div>
              <h3>{completedBooks.length} / {readingGoal}</h3>
              <p>Books completed towards your goal</p>
            </div>

            <strong>{goalProgress}%</strong>
          </div>

          <div className="goal-progress-track">
            <div
              className="goal-progress-fill"
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          <p className="goal-remaining">
            {Math.max(0, readingGoal - completedBooks.length)} books
            remaining to reach your goal.
          </p>
        </div>

        <form className="reading-goal-form" onSubmit={handleGoalUpdate}>
          <label htmlFor="readingGoal">Set your reading goal</label>

          <input
            id="readingGoal"
            type="number"
            min="1"
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
          />

          <button type="submit">Update Goal</button>
        </form>
      </section>
    </div>
  );
}
