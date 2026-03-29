import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** Icon element to display (SVG recommended). */
  icon?: React.ReactNode;
  /** Primary heading. */
  title: string;
  /** Supporting description. */
  description?: string;
  /** Optional call-to-action element (e.g., a Button). */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty state placeholder for when there is no data to display.
 *
 * @param {EmptyStateProps} props
 * @param {string} props.title - Primary heading.
 * @param {string} [props.description] - Supporting description.
 * @param {React.ReactNode} [props.action] - Call-to-action element.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-16 px-8 text-center',
        className
      )}
    >
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-sm font-semibold text-brand-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
