interface StreamingResponseProps {
  /** The streamed text content (may be partial while streaming). */
  content: string;
  /** Whether the stream is still in progress. */
  isStreaming: boolean;
  /** Whether an error occurred. */
  hasError: boolean;
}

/**
 * "Curator Insight" card — displays streaming AI response with confidence indicator.
 */
export function StreamingResponse({ content, isStreaming, hasError }: StreamingResponseProps) {
  if (!content && !isStreaming) return null;

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

        {/* Confidence indicator */}
        {!isStreaming && content && !hasError && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Confidence</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-5 rounded-full ${i <= 3 ? 'bg-brand-accent' : 'bg-gray-100'}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-brand-accent">High</span>
          </div>
        )}

        {isStreaming && (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-secondary" />
          </div>
        )}
      </div>

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
    </div>
  );
}
