import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ErrorMessageProps {
  /** User-friendly title. */
  title?: string;
  /** User-friendly description. */
  message: string;
  /** Optional retry action. */
  onRetry?: () => void;
  className?: string;
}

/**
 * User-facing error display. Shows a friendly message, never raw errors.
 * RULES.MD: Separate technical logs (console.error) from user-facing messages.
 *
 * @param {ErrorMessageProps} props
 * @param {string} [props.title='Something went wrong'] - Error heading.
 * @param {string} props.message - User-friendly error description.
 * @param {Function} [props.onRetry] - Callback for retry button.
 */
export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-error"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">{title}</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <Button
              variant="danger"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
