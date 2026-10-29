import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../api';

export default function Quiz() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [mode, setMode] = useState('practice');
  const [topic, setTopic] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const modeFromUrl = new URLSearchParams(window.location.search).get('mode') || 'practice';
    setMode(modeFromUrl);
    quizAPI.startQuiz(topicId, { mode: modeFromUrl })
      .then((res) => {
        setQuestions(res.data.questions || []);
        setExam(res.data.exam || null);
        setTopic(res.data.topic);
        setCourse(res.data.course);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load quiz.');
        setLoading(false);
      });
  }, [topicId]);

  const [answers, setAnswers] = useState({});
  const [startedAt] = useState(Date.now());

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    questions.forEach((q) => {
      payload[`q${q.id}`] = answers[q.id] ?? -1;
    });
    try {
      const res = await quizAPI.submitQuiz(topicId, payload);
      navigate(`/result/${topicId}`, { state: res.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading quiz…</div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  const durationMinutes = exam?.durationMinutes || 30;
  const deadline = exam?.startedAt ? exam.startedAt + durationMinutes * 60 * 1000 : 0;
  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());

  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, deadline]);

  const minutes = Math.floor(Math.max(0, timeLeft) / 60000);
  const seconds = Math.floor((Math.max(0, timeLeft) % 60000) / 1000);
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">
            {topic?.number}. {topic?.title}
          </h1>
          <p className="mt-2 text-ink-soft dark:text-paper/60">
            {mode === 'ranked' ? 'Leaderboard mode · countdown timer active' : 'Practice mode · no timer, score stays private'}
          </p>
        </div>
        {exam && (
          <div className="rounded-md border border-gold/40 bg-gold/10 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-goldink dark:text-gold">Time Remaining</span>
              <span className="font-mono font-bold text-goldink dark:text-gold">{timeStr}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="w-full bg-card rounded-lg border border-ink/10 p-4 dark:border-white/10 dark:bg-inkcard-dark">
          <div className="w-full bg-ink/5 dark:bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
            <div className="h-full bg-academic" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
          <p className="text-xs text-ink-soft dark:text-paper/60 mb-4">{answeredCount} / {questions.length} answered</p>
          {questions.map((q, idx) => (
            <div key={q.id} className="mb-5">
              <p className="font-semibold text-ink dark:text-paper mb-2">{idx + 1}. {q.prompt}</p>
              <div className="space-y-1">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="cursor-pointer flex items-start gap-2 p-2 rounded-md border border-transparent hover:border-academic/50 hover:bg-academic/5 transition-colors dark:hover:border-emerald-300/50 dark:hover:bg-emerald-300/5">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={oi}
                      checked={answers[q.id] === oi}
                      onChange={() => handleOptionChange(q.id, oi)}
                      className="rounded border-ink-accent text-academic dark:text-emerald-300 focus:ring-academic"
                    />
                    <span className="text-sm text-ink dark:text-paper">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={() => navigate('/topics')} className="btn btn-outline">
            Cancel
          </button>
          <button
            type="submit"
            disabled={answeredCount === 0}
            className="btn btn-primary"
          >
            Submit Quiz
          </button>
        </div>
      </form>

      {exam && timeLeft <= 0 && (
        <div className="mt-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
          Time's up — please submit your answers.
        </div>
      )}
    </div>
  );
}
