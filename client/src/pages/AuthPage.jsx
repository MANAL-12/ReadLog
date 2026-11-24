
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';

  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(
    location.state?.message || ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(name, email, password);

        navigate('/login', {
          state: {
            message: 'Your account has been created! Please log in.',
          },
        });
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-brand">
          <div className="auth-brand-icon">R</div>
          <span>READLOG</span>
        </div>

        <div className="auth-quote">
          <span className="auth-quote-mark">“</span>
          <h1>
            A room without books is like a body without a soul.
          </h1>
          <p>Build your own little world, one book at a time.</p>
        </div>

        <div className="auth-decoration-footer">
          YOUR PERSONAL DIGITAL LIBRARY
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <div className="auth-brand-icon">R</div>
            <span>READLOG</span>
          </div>

          <span className="auth-eyebrow">
            {isRegister ? 'BEGIN YOUR JOURNEY' : 'WELCOME BACK'}
          </span>

          <h2>
            {isRegister
              ? 'Create your account'
              : 'Good to see you again.'}
          </h2>

          <p className="auth-description">
            {isRegister
              ? 'Create your personal space for all things reading.'
              : 'Sign in to continue your reading journey.'}
          </p>

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={
                  isRegister ? 'new-password' : 'current-password'
                }
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={submitting}
            >
              {submitting
                ? 'Please wait...'
                : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}

            {' '}

            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in' : 'Create account'}
            </Link>
          </div>

          <p className="auth-bottom-note">
            A little more reading, a little more living.
          </p>
        </div>
      </div>
    </div>
  );
}
