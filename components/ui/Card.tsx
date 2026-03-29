import { cn } from '@/lib/utils';

interface CardProps {
  /** Additional class names. */
  className?: string;
  children: React.ReactNode;
}

/**
 * Executive-style card container with shadow and rounded corners.
 *
 * @param {CardProps} props
 */
export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('card-executive p-6', className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  /** Card title text. */
  title: string;
  /** Optional subtitle or description. */
  subtitle?: string;
  /** Optional element rendered on the right side. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Card header with title, optional subtitle, and action slot.
 */
export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between', className)}>
      <div>
        <h3 className="text-base font-semibold text-brand-text">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}
