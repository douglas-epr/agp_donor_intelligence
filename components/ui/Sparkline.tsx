interface SparklineProps {
  /** Data points to render (raw numbers, auto-normalized). */
  data: number[];
  /** Line color. */
  color?: string;
  /** SVG width. */
  width?: number;
  /** SVG height. */
  height?: number;
  /** Whether the trend is positive (adds a subtle fill). */
  positive?: boolean;
}

/**
 * Minimal SVG sparkline for KPI trend visualization.
 * Renders a smooth polyline normalized to fit the given dimensions.
 */
export function Sparkline({
  data,
  color = '#9EDC4B',
  width = 80,
  height = 28,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (val - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  // Build fill path: line down, across bottom, back up
  const firstPoint = points[0].split(',');
  const lastPoint = points[points.length - 1].split(',');
  const fillPath = `M${points.join(' L')} L${lastPoint[0]},${height} L${firstPoint[0]},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Gradient fill under line */}
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#fill-${color.replace('#', '')})`} />
      <polyline
        points={polylinePoints}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
