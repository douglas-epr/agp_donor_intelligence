import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  /** Text content of the badge. */
  label: string;
  /** Visual variant. */
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-800',
};

/**
 * Small label badge for status indicators and categories.
 *
 * @param {BadgeProps} props
 * @param {string} props.label - Badge text.
 * @param {BadgeVariant} [props.variant='default'] - Color variant.
 */
export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
