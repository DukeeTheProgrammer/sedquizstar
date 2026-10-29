import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authAPI.profile()
      .then((res) => {
        setProfile(res.data.profile);
        setStats(res.data.stats);
        setAchievements(res.data.achievements || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load profile.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading profile…</div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">My Profile</h1>
        <p className="mt-2 text-ink-soft dark:text-paper/60">Manage your account details and view your progress.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-6">
        {[
          { label: 'Topics practiced', value: stats?.topics || 0 },
          { label: 'Total attempts', value: stats?.attempts || 0 },
          { label: 'Best score', value: stats?.best || 0 },
          { label: 'XP earned', value: stats?.xp || 0, accent: 'green' },
          { label: 'Current streak', value: stats?.streak || 0, accent: 'gold' },
          { label: 'Best streak', value: stats?.longestStreak || 0 },
        ].map((stat) => (
          <div key={stat.label} className="stat-tile">
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
        <div className="stat-tile ring-1 ring-gold/40">
          <p className="stat-value">{stats?.dueCount || 0}</p>
          <p className="stat-label">Due for review</p>
          {stats?.dueCount > 0 && (
            <button className="mt-2 btn btn-primary btn-sm">Review now</button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-paper">Achievements</h2>
          <span className="text-xs text-ink-soft dark:text-paper/60">Informational badges, not pressure</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-md p-3 text-center border ${
                a.unlocked
                  ? 'border-gold/40 bg-gold/5 dark:border-emerald-300/50 dark:bg-emerald-300/5'
                  : 'border-ink/10 text-ink-soft dark:border-white/10 dark:bg-inkcard-dark opacity-50 grayscale'
              }`}
            >
              <div className="flex items-center justify-center mb-1">{a.iconSvg}</div>
              <p className="text-xs font-semibold text-ink dark:text-paper">{a.name}</p>
              <p className="text-[10px] text-ink-faint dark:text-pair/50">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mb-3">Account Details</h2>
        <form className="flex flex-col gap-3 max-w-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Display Name</label>
            <input
              type="text"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              defaultValue={profile?.name || ''}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink dark:text-paper">Email</label>
            <input
              type="email"
              className="rounded-md border border-ink/18 bg-card p-3 w-full dark:border-white/15 dark:bg-inkcard-dark focus:border-academic focus:outline-none focus:ring-1 focus:ring-academic"
              defaultValue={profile?.email || ''}
              disabled
            />
          </div>
          <p className="text-xs text-ink-faint dark:text-paper/50 mt-1">
            Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
          </p>
        </form>
      </div>
    </div>
  );
}
