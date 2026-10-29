import { useEffect, useState } from 'react';
import { leaderboardAPI, scoresAPI } from '../api';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([leaderboardAPI.leaderboard(), scoresAPI.myScores()])
      .then(([lbRes, scoresRes]) => {
        setData({ lb: lbRes.data, scores: scoresRes.data });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load leaderboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading leaderboard…</div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  const { lb, scores } = data;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Leaderboard</h1>
        <p className="mt-2 text-ink-soft dark:text-paper/60">Top performers across all courses.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="card p-5">
          <p className="text-xs text-ink-soft dark:text-paper/60 uppercase tracking-wider mb-3">Overall Best</p>
          <p className="text-2xl font-bold text-ink dark:text-paper">{lb.overallBest.length} players</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-soft dark:text-paper/60 uppercase tracking-wider mb-3">My Best</p>
          <p className="text-2xl font-bold text-ink dark:text-paper">{scores.stats?.bestPercent || 0}%</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-soft dark:text-paper/60 uppercase tracking-wider mb-3">My Average</p>
          <p className="text-2xl font-bold text-ink dark:text-paper">{scores.stats?.avgPercent || 0}%</p>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mb-4">Overall Best</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink/10 dark:border-white/10">
                <th className="pb-2 text-xs font-semibold text-ink-soft dark:text-pair/60">Rank</th>
                <th className="pb-2 text-xs font-semibold text-ink-soft dark:text-pair/60">Name</th>
                <th className="pb-2 text-xs font-semibold text-ink-soft dark:text-pair/60">Avg Score</th>
                <th className="pb-2 text-xs font-semibold text-ink-soft dark:text-pair/60">XP</th>
                <th className="pb-2 text-xs font-semibold text-ink-soft dark:text-pair/60">Topics</th>
              </tr>
            </thead>
            <tbody>
              {lb.overallBest.map((row, i) => (
                <tr key={i} className="border-b border-ink/5 dark:border-white/5 last:border-0">
                  <td className="py-2 text-sm font-bold text-ink dark:text-paper">{i + 1}</td>
                  <td className="py-2 text-sm text-ink dark:text-paper">{row.name}</td>
                  <td className="py-2 text-sm text-ink-soft dark:text-pair/60">{row.avgPercent}%</td>
                  <td className="py-2 text-sm text-ink-soft dark:text-pair/60">{row.xp}</td>
                  <td className="py-2 text-sm text-ink-soft dark:text-pair/60">{row.topicsDone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mb-4">Per-Topic Top 5</h2>
        {lb.perTopic.map((pt) => (
          <div key={pt.topic.id} className="mb-5">
            <h3 className="font-semibold text-ink dark:text-paper mb-2">{pt.topic.number}. {pt.topic.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink/10 dark:border-white/10">
                    <th className="pb-1 text-[10px] font-semibold text-ink-soft dark:text-pair/60">Rank</th>
                    <th className="pb-1 text-[10px] font-semibold text-ink-soft dark:text-pair/60">Name</th>
                    <th className="pb-1 text-[10px] font-semibold text-ink-soft dark:text-pair/60">Score</th>
                    <th className="pb-1 text-[10px] font-semibold text-ink-soft dark:text-pair/60">%</th>
                  </tr>
                </thead>
                <tbody>
                  {pt.top.map((row, i) => (
                    <tr key={i} className="border-b border-ink/5 dark:border-white/5 last:border-0">
                      <td className="py-1 text-[10px] font-bold text-ink dark:text-paper">{i + 1}</td>
                      <td className="py-1 text-[10px] text-ink dark:text-paper">{row.name}</td>
                      <td className="py-1 text-[10px] text-ink-soft dark:text-pair/60">{row.score}/{row.total}</td>
                      <td className="py-1 text-[10px] text-ink-soft dark:text-pair/60">{Math.round((row.score / row.total) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
