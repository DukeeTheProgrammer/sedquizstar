import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { quizAPI } from '../api';

export default function Result() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get result from navigation state first
    const navState = location.state;
    if (navState && navState.score !== undefined) {
      setResult(navState);
      setReview(navState.review || []);
      setLoading(false);
      return;
    }

    // Fallback: fetch from API if we had submitted previously
    // For now, we rely on navigation state
    setLoading(false);
  }, [topicId, location.state]);

  const percent = result ? Math.round((result.score / result.total) * 100) : 0;
  const passed = percent >= 50;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading results…</div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-ink dark:text-paper">No result found</h2>
        <p className="mt-2 text-ink-soft dark:text-paper/60">Please take a quiz first.</p>
        <button onClick={() => navigate('/topics')} className="mt-4 btn btn-primary">
          Go to Topics
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-6 p-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-2">
          {passed ? 'You passed!' : 'Keep practicing'}
        </h2>
        <p className="text-ink-soft dark:text-paper/60">{topicId}. {result.topic?.title || 'Quiz'}</p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="160" cy="160" r="140" stroke="color-mix(in srgb, var(--color-ink) 10%, transparent)" stroke-width="20" fill="none" />
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke={passed ? 'var(--color-academic)' : 'var(--color-danger)'}
                stroke-width="20"
                fill="none"
                strokeDasharray="880"
                strokeDashoffset={880 - (percent / 100) * 880}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-ink dark:text-paper">{percent}%</span>
              <span className="text-xs text-ink-soft dark:text-paper/60">Score</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xl font-semibold text-ink dark:text-paper">
          <strong>{result.score} / {result.total}</strong> correct
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-soft dark:text-paper/60">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            modeClass(result.mode)
          }`}>
            {result.mode === 'ranked' ? 'Leaderboard' : 'Practice'}
          </span>
          {result.durationSeconds !== undefined && (
            <span>Time: {Math.floor(result.durationSeconds / 60)}m {result.durationSeconds % 60}s</span>
          )}
        </div>

        {result.xpEarned > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-academic/10 px-3 py-1 text-xs font-bold text-academic dark:text-emerald-300 border border-academic/20">
            <span>+{result.xpEarned} XP</span>
            {result.perfectBonus && <span className="text-gold">+15 Perfect!</span>}
            {result.streakBonus && <span className="text-gold">{Math.round(result.streakBonusPct * 100)}% streak</span>}
          </div>
        )}

        {result.newStreak > 0 && (
          <p className="mt-3 text-sm text-gold dark:text-gold font-semibold">Day {result.newStreak} streak</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-display text-xl font-semibold text-ink dark:text-paper">Review</h3>
          <Link to="/topics" className="text-sm text-academic hover:underline">Back to Topics</Link>
        </div>
        {review.map((r, i) => (
          <div key={r.id} className="mb-4 rounded-md border border-ink/10 bg-card p-3 dark:border-white/10 dark:bg-inkcard-dark">
            <div className="flex items-start gap-2 mb-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-academic dark:bg-emerald-300">
                {i + 1}
              </span>
              <p className="text-sm font-medium text-ink dark:text-paper">{r.prompt}</p>
            </div>
            <div className="space-y-1">
              {r.options.map((opt, oi) => {
                const isCorrect = oi === r.correct_index;
                const isChosenWrong = oi === r.chosen_index && oi !== r.correct_index;
                return (
                  <div
                    key={oi}
                    className={`text-sm p-2 rounded-md border ${
                      isCorrect
                        ? 'border-academic/50 bg-academic/5 dark:border-emerald-300/50 dark:bg-emerald-300/5'
                        : isChosenWrong
                          ? 'border-red-600/30 bg-red-600/5 dark:border-red-400/30 dark:bg-red-400/5'
                          : 'border-transparent hover:bg-ink/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold mr-2">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                    {isCorrect && <span className="ml-2 text-[10px] font-bold text-academic dark:text-emerald-300">✓ Correct</span>}
                    {isChosenWrong && <span className="ml-2 text-[10px] font-bold text-red-600 dark:text-red-400">Your answer</span>}
                  </div>
                );
              })}
            </div>
            {r.explanation && (
              <p className="mt-2 text-sm text-ink-soft dark:text-paper/60 bg-ink/5 dark:bg-white/5 p-2 rounded-md">
                <span className="font-semibold">Why:</span> {r.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/topics" className="btn btn-primary">Back to Topics</Link>
        <Link to={`/quiz/${topicId}/start?mode=${result.mode}`} className="btn btn-outline">Try Again</Link>
        {result.next && (
          <Link to={`/quiz/${result.next.id}`} className="btn btn-outline">Next Topic →</Link>
        )}
        <Link to="/daily-quest" className="btn btn-gold">Daily Quest</Link>
      </div>
    </div>
  );
}

function modeClass(mode) {
  if (mode === 'ranked') return 'bg-gold/15 text-gold border-gold/40 dark:text-gold';
  return 'bg-ink/10 text-ink-soft border-ink/20 dark:bg-white/10 dark:text-paper/60';
}
