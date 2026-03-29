import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Full-width button. */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-secondary text-white hover:bg-blue-600 focus-visible:ring-brand-secondary disabled:opacity-50',
  secondary:
    'bg-white text-brand-text border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300 disabled:opacity-50',
  ghost:
    'text-brand-secondary hover:bg-blue-50 focus-visible:ring-brand-secondary disabled:opacity-50',
  danger:
    'bg-error text-white hover:bg-red-700 focus-visible:ring-red-400 disabled:opacity-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
};

/**
 * Primary action button following the AGP design system.
 *
 * @param {ButtonProps} props
 * @param {ButtonVariant} [props.variant='primary'] - Visual style variant.
 * @param {ButtonSize} [props.size='md'] - Button size.
 * @param {boolean} [props.loading=false] - Shows a spinner and disables interaction.
 * @param {boolean} [props.fullWidth=false] - Makes button full-width.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
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
      )}
      {children}
    </button>
  );
}
