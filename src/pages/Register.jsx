import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', fingerprint_hash: '', fingerprint_data: '', terms: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await register(formData);
      setSuccess('Account created. A verification link has been sent to your email — click it, then log in.');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Account Created</h1>
            <p className="mt-2 text-ink-soft dark:text-paper/60">{success}</p>
          </div>
          <div className="rounded-md border border-academic/30 bg-academic/10 px-4 py-4">
            <p className="text-sm text-ink-soft dark:text-paper/60">Check your inbox (and spam folder) for the verification link.</p>
          </div>
          <div className="mt-6 text-center">
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Create your account</h1>
          <p className="mt-2 text-ink-soft dark:text-paper/60">Save your scores and start climbing the leaderboard.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Full Name</label>
            <input
              type="text"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Email</label>
            <input
              type="email"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
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
              minLength={6}
              autoComplete="new-password"
            />
            <p className="text-xs text-ink-faint dark:text-paper/50">At least 6 characters.</p>
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-ink dark:text-paper">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              required
            />
            <span>
              I agree to the <a href="/terms" className="font-semibold text-academic hover:underline">Terms and Conditions</a> · one account per device
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft dark:text-paper/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-academic hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
