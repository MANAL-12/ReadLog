
import { Menu, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuClick, onAddBook }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || 'M';

  return (
    <header className="top-header">
      <button
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="header-right">
        <button
          className="header-add-button"
          onClick={onAddBook}
        >
          <Plus size={17} />
          <span>Add a book</span>
        </button>

        <div className="header-user-name">
          {user?.name}
        </div>

        <div className="profile-avatar">
          {initial}
        </div>

        <button
          className="header-logout-button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
