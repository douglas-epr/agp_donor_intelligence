import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Size of the spinner. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label for screen readers. */
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * Animated loading spinner.
 *
 * @param {LoadingSpinnerProps} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size.
 * @param {string} [props.label='Loading...'] - Screen reader label.
 */
export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  className,
}: LoadingSpinnerProps) {
  return (
    <div role="status" className={cn('flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin text-brand-secondary', sizeStyles[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
