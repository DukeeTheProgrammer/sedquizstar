import { useEffect, useState } from 'react';
import { quizAPI } from '../api';

export default function Materials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    quizAPI.materials()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load materials.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-ink-soft dark:text-paper/60">Loading materials…</div>
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
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Study Materials</h1>
        <p className="mt-2 text-ink-soft dark:text-paper/60">Class notes per course, plus tools, timetables and uploads from your admin.</p>
      </div>

      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mb-3">Class Notes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.notesCourses.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="w-fit rounded-md bg-academic/10 px-2 py-0.5 text-xs font-bold text-academic dark:text-emerald-300">
                  {c.code}
                </span>
                <span className="text-xs text-ink-soft dark:text-pair/60">{c.notes} notes</span>
              </div>
              <h3 className="font-semibold text-ink dark:text-paper">{c.name}</h3>
              <p className="mt-1 text-sm text-ink-soft dark:text-pair/60">{c.archive ? 'Archived' : 'Active'} · {c.code}</p>
              <button
                className="mt-3 btn btn-outline btn-sm"
                onClick={() => {}}
              >
                Open notes →
              </button>
            </div>
          ))}
        </div>
      </div>

      {data.groups.map((group) => (
        <div key={group.category} className="mb-8">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mb-3">{group.category}</h2>
          <div className="space-y-3">
            {group.items.map((m) => (
              <div key={m.id} className="card p-4">
                <h3 className="font-semibold text-ink dark:text-paper">{m.title}</h3>
                {m.body && (
                  <p className="mt-1 text-sm text-ink-soft dark:text-pair/60 line-clamp-2">
                    {m.body.length > 200 ? m.body.slice(0, 200) + '…' : m.body}
                  </p>
                )}
                {m.link_url && (
                  <a
                    href={m.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-academic hover:underline dark:text-emerald-300"
                  >
                    Open link →
                  </a>
                )}
                {m.file_name && (
                  <div className="mt-3">
                    <a
                      href={`/api/quiz/materials/${m.id}/file`}
                      className="btn btn-outline btn-sm"
                    >
                      ↓ {m.file_name}{m.file_size ? ` (${Math.round(m.file_size / 1024)} KB)` : ''}
                    </a>
                  </div>
                )}
                <p className="mt-2 text-xs text-ink-faint dark:text-pair/50">
                  {new Date(m.updated_at || m.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
