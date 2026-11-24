
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  Bookmark,
  ChartNoAxesCombined,
  BookOpen,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'My Library', path: '/library', icon: Library },
  { name: 'Reading Lists', path: '/lists', icon: Bookmark },
  { name: 'Statistics', path: '/statistics', icon: ChartNoAxesCombined },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <h2>ReadLog</h2>
            <span>YOUR READING SPACE</span>
          </div>

          <button className="mobile-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">MENU</div>

        <nav className="sidebar-nav">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p>
              A reader lives a thousand lives before he dies.
            </p>
            <span className="quote-author">— George R. R. Martin</span>
          </div>

          <div className="sidebar-footer">
            <div className="footer-icon">
              <BookOpen size={17} />
            </div>
            <span>Made for the love of reading.</span>
          </div>
        </div>
      </aside>
    </>
  );
}
