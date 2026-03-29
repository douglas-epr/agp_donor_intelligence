import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input. */
  label?: string;
  /** Error message shown below the input. */
  error?: string;
  /** Helper text shown below the input (when no error). */
  hint?: string;
}

/**
 * Accessible text input with label, error, and hint states.
 *
 * @param {InputProps} props
 * @param {string} [props.label] - Label displayed above the input.
 * @param {string} [props.error] - Error message (replaces hint when present).
 * @param {string} [props.hint] - Helper text below the input.
 */
export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-brand-text"
        >
          {label}
          {props.required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full rounded-lg border px-3 py-2.5 text-sm text-brand-text',
          'placeholder:text-gray-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent',
          error
            ? 'border-error bg-red-50 focus:ring-error'
            : 'border-gray-200 bg-white hover:border-gray-300',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-muted',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
