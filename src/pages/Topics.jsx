import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../api';

export default function Topics() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('topics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    quizAPI.dashboard()
      .then((res) => {
        setCourses(res.data.courses || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load topics.');
        setLoading(false);
      });
  }, []);

  const visibleCourses = courses.filter((c) => !c.hidden && !c.archive);
  const filtered = activeTab === 'cbt'
    ? visibleCourses.filter((c) => c.cbt)
    : activeTab === 'archive'
      ? courses.filter((c) => c.archive)
      : visibleCourses.filter((c) => !c.cbt);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">
            {activeTab === 'cbt' ? 'CBT Exams' : activeTab === 'archive' ? 'Archive' : 'Topics'}
          </h1>
          <p className="mt-2 text-ink-soft dark:text-paper/60">
            {activeTab === 'cbt'
              ? 'Timed CBT exams · 50 shuffled questions · 30 minutes · 1.4 marks per question (70 total)'
              : 'Pick a topic to practice. Your best score is saved automatically.'}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'topics'
                ? 'bg-academic text-white'
                : 'text-ink-soft hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-white/5'
            }`}
          >
            Topics
          </button>
          <button
            onClick={() => setActiveTab('cbt')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'cbt'
                ? 'bg-academic text-white'
                : 'text-ink-soft hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-white/5'
            }`}
          >
            CBT Exams
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'archive'
                ? 'bg-academic text-white'
                : 'text-ink-soft hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-white/5'
            }`}
          >
            Archive
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading…</div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <div key={course.id} className="card flex flex-col">
              <span className="w-fit rounded-md bg-academic/10 px-2 py-0.5 text-xs font-bold text-academic dark:text-emerald-300">
                {course.code}
              </span>
              <h2 className="font-display mt-2 text-xl font-semibold text-ink dark:text-paper">
                {course.name}
                {course.cbt && <span className="ml-2 inline-block rounded-md bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold border border-gold/40 dark:text-gold">CBT Exam</span>}
              </h2>
              <p className="mt-1.5 text-sm text-ink-soft dark:text-paper/60">
                {course.cbt
                  ? `${course.exam_questions || 50} random questions · ${course.exam_minutes || 30}-minute timer · ${course.exam_total_marks || 70} marks`
                  : `${course.questions_count || 0} questions · ${course.topics_count || 0} topics`}
              </p>
              {course.progress !== undefined && course.attempted > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-ink dark:text-paper">{course.progress}% mastered</span>
                    <span className="text-xs text-ink-soft dark:text-paper/60">{course.passed}/{course.topics_count} passed</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-academic" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-auto pt-4">
                <button
                  onClick={() => navigate(`/quiz/${course.entryTopicId || course.topics?.[0]?.id}/start?mode=${activeTab === 'cbt' ? 'ranked' : 'practice'}`)}
                  className="w-full btn btn-primary"
                >
                  {course.cbt ? 'Start CBT Exam' : 'View Topics'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
