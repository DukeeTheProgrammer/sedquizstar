import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-sm dark:border-white/10 dark:bg-inkpage-dark/95">
      <div className="container mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="brand flex items-center gap-2.5" aria-label="SED QUIZSTAR home">
          <span className="font-display text-base font-semibold tracking-tight text-ink dark:text-paper sm:text-lg">
            SED<span className="text-academic">_</span>QUIZSTAR
          </span>
        </Link>

        {!isAuthPage && (
          <>
            <Link
              to="/topics"
              className={`nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-ink/5 hover:text-academic dark:text-paper dark:hover:bg-white/5 ${
                location.pathname === '/topics' ? 'bg-academic text-white' : ''
              }`}
            >
              Topics
            </Link>
            <Link
              to="/leaderboard"
              className={`nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-ink/5 hover:text-academic dark:text-paper dark:hover:bg-white/5 ${
                location.pathname === '/leaderboard' ? 'bg-academic text-white' : ''
              }`}
            >
              Leaderboard
            </Link>
            <Link
              to="/materials"
              className={`nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-ink/5 hover:text-academic dark:text-paper dark:hover:bg-white/5 ${
                location.pathname === '/materials' ? 'bg-academic text-white' : ''
              }`}
            >
              Materials
            </Link>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-ink dark:text-paper">
                Login
              </Link>
              <Link to="/register" className="rounded-md bg-academic px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-[1px]">
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={toggle}
                className="rounded-md p-2 text-ink-soft transition-colors hover:text-academic dark:text-paper/70 dark:hover:text-emerald-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/5"
                >
                  <span>{user?.name}</span>
                  <span>▾</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-ink/10 bg-card shadow-md dark:border-white/10 dark:bg-inkcard-dark py-2">
                    <p className="text-xs text-ink-soft dark:text-paper/60 px-3 py-1">
                      {user?.streak ? `Day ${user.streak} streak` : 'No streak'} · {user?.xp} XP
                    </p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/5"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/scores')}
                      className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/5"
                    >
                      My Scores
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-600/10 dark:text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
