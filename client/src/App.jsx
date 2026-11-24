
import { useState } from 'react';

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddBookModal from './components/AddBookModal';

import Dashboard from './pages/DashBoard';
import Library from './pages/Library';
import ReadingLists from './pages/ReadingLists';
import Statistics from './pages/Statistics';
import AuthPage from './pages/AuthPage';

import { useAuth } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
// Show the page only when a user is logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading ReadLog...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Keep logged-in users away from login/register pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading ReadLog...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);

  return (
    <div className="app-layout">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onAddBook={() => setAddBookOpen(true)}
        />

        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  onAddBook={() => setAddBookOpen(true)}
                />
              }
            />

            <Route
              path="/library"
              element={
                <Library
                  onAddBook={() => setAddBookOpen(true)}
                />
              }
            />

            <Route path="/lists" element={<ReadingLists />} />

            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>

      </main>

      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
      />

    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage mode="login" />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthPage mode="register" />
          </PublicRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
