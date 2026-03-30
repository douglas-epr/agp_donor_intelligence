interface StreamingResponseProps {
  /** The streamed text content (may be partial while streaming). */
  content: string;
  /** Whether the stream is still in progress. */
  isStreaming: boolean;
  /** Whether an error occurred. */
  hasError: boolean;
}

/**
 * "Curator Insight" card — displays streaming AI response with institutional styling.
 * Matches the reference design with share/download icons, confidence %, and breakdown link.
 */
export function StreamingResponse({ content, isStreaming, hasError }: StreamingResponseProps) {
  if (!content && !isStreaming) return null;

  const now = new Date();
  const dateStamp = now.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          <span className="text-[13px] font-bold text-brand-text">Curator Insight</span>
        </div>

        <div className="flex items-center gap-1.5">
          {isStreaming && (
            <>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary" />
            </>
          )}

          {/* Share icon */}
          <button
            aria-label="Share insight"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>

          {/* Download icon */}
          <button
            aria-label="Download insight"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Date stamp */}
      {!isStreaming && content && (
        <div className="border-b border-gray-50 px-5 py-1.5">
          <p className="text-[10px] text-gray-400">
            Generated {dateStamp} &bull; Institutional Analysis
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-4 text-[13px] leading-relaxed text-brand-text">
        {paragraphs.length > 0 ? (
          <div className="space-y-3">
            {paragraphs.map((para, i) => {
              if (para.startsWith('•') || para.startsWith('-') || para.startsWith('*')) {
                const items = para.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="space-y-1.5 pl-1">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" />
                        <span>{item.replace(/^[•\-*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{para}</p>;
            })}
            {isStreaming && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-brand-secondary align-middle" aria-hidden="true" />
            )}
          </div>
        ) : (
          isStreaming && (
            <p className="text-gray-400">Analyzing your donor data…</p>
          )
        )}

        {hasError && (
          <p className="mt-3 text-[12px] text-red-500">
            Response may be incomplete. Please try again.
          </p>
        )}
      </div>

      {/* Footer — confidence + breakdown link */}
      {!isStreaming && content && !hasError && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-brand-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <span className="text-[11px] font-semibold text-gray-500">
              Institutional Confidence: <span className="text-brand-accent">98.4%</span>
            </span>
          </div>
          <button className="text-[11px] font-semibold text-brand-secondary hover:underline">
            View Detailed Segment Breakdown →
          </button>
        </div>
      )}
    </div>
  );
}
