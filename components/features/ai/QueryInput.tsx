'use client';

import { useState, useRef } from 'react';
import { StreamingResponse } from './StreamingResponse';

const QUICK_PROMPTS = [
  { label: 'Highest LTV Segment', question: 'Which donor segment has the highest lifetime value?' },
  { label: 'Donor Retention Heatmap', question: 'What is the retention rate breakdown by segment and channel?' },
  { label: 'Campaign ROI Forecast', question: 'Which campaign had the highest return on investment?' },
];

const SUGGESTED_CARDS = [
  {
    tag: 'WEALTH INTELLIGENCE',
    title: 'Wealth Indicator Filter',
    description: 'Cross-reference your top 10% donors against giving patterns to identify dormant high-capacity prospects.',
    action: 'Run Prediction',
    question: 'Who are my top 10% donors by total giving and what is their average gift trend?',
    accent: 'brand-secondary',
  },
  {
    tag: 'CAMPAIGN STRATEGY',
    title: 'Donor Attrition Warning',
    description: 'Identify segments where giving frequency has declined — potential churn risk.',
    action: 'Analyze',
    question: 'Which donor segments show declining gift frequency over the last 6 months?',
    accent: 'amber-500',
  },
];

/**
 * AI Data Explorer — two-column layout.
 * Left: query input + quick prompts + Curator Insight response.
 * Right sidebar: Recent Queries + Suggested For You cards.
 */
export function QueryInput() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [recentQueries, setRecentQueries] = useState<{ text: string; ago: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  async function submitQuestion(q: string) {
    const trimmed = q.trim();
    if (!trimmed || isStreaming) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setResponse('');
    setHasError(false);
    setIsStreaming(true);

    // Track recent queries
    const now = new Date();
    const ago = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setRecentQueries((prev) =>
      [{ text: trimmed, ago }, ...prev.filter((x) => x.text !== trimmed)].slice(0, 5)
    );

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        credentials: 'include',
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        console.error('AI query error:', data);
        setHasError(true);
        setResponse('Failed to get a response. Please try again.');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResponse(accumulated);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      console.error('Unexpected AI query error:', err);
      setHasError(true);
      setResponse('An unexpected error occurred. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitQuestion(question);
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
      {/* ── Main column ── */}
      <div className="space-y-4">
        {/* Query input */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-brand-secondary focus-within:ring-2 focus-within:ring-brand-secondary/10">
            <div className="flex shrink-0 items-center pl-4 pr-2 text-brand-secondary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your data anything..."
              maxLength={500}
              disabled={isStreaming}
              className="flex-1 bg-transparent py-3.5 pr-2 text-[13px] text-brand-text placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitQuestion(question);
                }
              }}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={() => { abortRef.current?.abort(); setIsStreaming(false); }}
                className="m-1.5 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-50"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!question.trim()}
                className="m-1.5 flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#162d58] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Analyze
              </button>
            )}
          </div>
        </form>

        {/* Quick prompt chips */}
        {!response && !isStreaming && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Quick Prompts:
            </span>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setQuestion(p.question); submitQuestion(p.question); }}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] text-gray-600 transition-colors hover:border-brand-secondary hover:text-brand-secondary"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Curator Insight response card */}
        <StreamingResponse content={response} isStreaming={isStreaming} hasError={hasError} />
      </div>

      {/* ── Right sidebar ── */}
      <div className="space-y-4">
        {/* Recent Queries */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Recent Queries
          </p>
          {recentQueries.length === 0 ? (
            <p className="text-[12px] text-gray-300">No queries yet</p>
          ) : (
            <ul className="space-y-1">
              {recentQueries.map((q, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => { setQuestion(q.text); submitQuestion(q.text); }}
                    className="w-full rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="line-clamp-2 text-[12px] text-gray-600">{q.text}</span>
                    <span className="mt-0.5 block text-[10px] text-gray-400">{q.ago}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Suggested For You */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
          <div className="mb-1 flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-brand-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Suggested For You
            </p>
          </div>

          <div className="mt-3 space-y-3">
            {SUGGESTED_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-brand-secondary">
                  {card.tag}
                </p>
                <p className="text-[12px] font-semibold text-brand-text">{card.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{card.description}</p>
                <button
                  type="button"
                  onClick={() => { setQuestion(card.question); submitQuestion(card.question); }}
                  className="mt-2.5 w-full rounded-md bg-brand-primary py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#162d58]"
                >
                  {card.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
