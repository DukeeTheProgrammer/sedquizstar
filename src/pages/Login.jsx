import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', fingerprint_hash: '', fingerprint_data: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData);
      navigate('/topics');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-ink-soft dark:text-paper/60">Login to pick up where you stopped.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Email</label>
            <input
              type="email"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Password</label>
            <input
              type="password"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft dark:text-paper/60">
          New here?{' '}
          <Link to="/register" className="font-semibold text-academic hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
