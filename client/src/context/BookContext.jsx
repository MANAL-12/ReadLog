
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";
import { useAuth } from "./AuthContext";

const BookContext = createContext(null);

const normalizeBook = (book) => ({
  ...book,
  id: book._id,
});

export function BookProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id || user?.id || null;

  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");

  const [lists, setLists] = useState([]);
  const [listsUserId, setListsUserId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const loadUserData = async () => {
      if (!userId) {
        setBooks([]);
        setLists([]);
        setListsUserId(null);
        setBooksError("");
        setBooksLoading(false);
        return;
      }

      setBooks([]);
      setBooksLoading(true);
      setBooksError("");

      const storageKey = `readlog-lists-${userId}`;

      try {
        const savedLists = localStorage.getItem(storageKey);
        const parsedLists = savedLists ? JSON.parse(savedLists) : [];

        if (!cancelled) {
          setLists(Array.isArray(parsedLists) ? parsedLists : []);
          setListsUserId(userId);
        }
      } catch (error) {
        console.error("Could not load reading lists:", error);

        if (!cancelled) {
          setLists([]);
          setListsUserId(userId);
        }
      }

      try {
        const response = await API.get("/books");

        if (!cancelled) {
          const fetchedBooks = response.data.books || [];
          setBooks(fetchedBooks.map(normalizeBook));
        }
      } catch (error) {
        console.error("Could not load books:", error);

        if (!cancelled) {
          setBooks([]);
          setBooksError(
            error.response?.data?.message ||
              "Could not load your books. Please refresh the page."
          );
        }
      } finally {
        if (!cancelled) {
          setBooksLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  useEffect(() => {
    if (!userId || listsUserId !== userId) return;

    localStorage.setItem(
      `readlog-lists-${userId}`,
      JSON.stringify(lists)
    );
  }, [lists, userId, listsUserId]);

  // Add a new book
  const addBook = async (bookData) => {
    const response = await API.post("/books", bookData);

    const newBook = normalizeBook(response.data.book);

    setBooks((previousBooks) => [newBook, ...previousBooks]);

    return newBook;
  };

  // Update an existing book
  const updateBook = async (id, updatedData) => {
    const response = await API.put(`/books/${id}`, updatedData);

    const updatedBook = normalizeBook(response.data.book);

    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === id ? updatedBook : book
      )
    );

    return updatedBook;
  };

  // Upload a PDF or EPUB file
  const uploadBookFile = async (id, file) => {
    const formData = new FormData();

    formData.append("bookFile", file);

    const response = await API.post(
      `/books/${id}/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedBook = normalizeBook(response.data.book);

    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === id ? updatedBook : book
      )
    );

    return updatedBook;
  };

  // Delete a book
  const deleteBook = async (id) => {
    await API.delete(`/books/${id}`);

    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.id !== id)
    );

    setLists((previousLists) =>
      previousLists.map((list) => ({
        ...list,
        bookIds: list.bookIds.filter(
          (bookId) => bookId !== id
        ),
      }))
    );
  };

  // Create a reading list
  const addList = (name, description = "") => {
    const newList = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      bookIds: [],
    };

    setLists((previousLists) => [...previousLists, newList]);
  };

  // Delete a reading list
  const deleteList = (listId) => {
    setLists((previousLists) =>
      previousLists.filter((list) => list.id !== listId)
    );
  };

  // Add a book to a reading list
  const addBookToList = (listId, bookId) => {
    setLists((previousLists) =>
      previousLists.map((list) => {
        if (
          list.id === listId &&
          !list.bookIds.includes(bookId)
        ) {
          return {
            ...list,
            bookIds: [...list.bookIds, bookId],
          };
        }

        return list;
      })
    );
  };

  // Remove a book from a reading list
  const removeBookFromList = (listId, bookId) => {
    setLists((previousLists) =>
      previousLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              bookIds: list.bookIds.filter(
                (id) => id !== bookId
              ),
            }
          : list
      )
    );
  };

  return (
    <BookContext.Provider
      value={{
        books,
        booksLoading,
        booksError,
        addBook,
        updateBook,
        uploadBookFile,
        deleteBook,
        lists,
        addList,
        deleteList,
        addBookToList,
        removeBookFromList,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
