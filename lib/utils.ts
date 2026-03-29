import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, resolving conflicts correctly.
 *
 * @param {...ClassValue} inputs - Class names to merge.
 * @returns {string} Merged class string.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-brand-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as USD currency.
 *
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number with comma separators.
 *
 * @param {number} value - The number to format.
 * @returns {string} Formatted number string (e.g., "1,234").
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a decimal as a percentage string.
 *
 * @param {number} decimal - Value between 0 and 1.
 * @param {number} [decimals=1] - Number of decimal places.
 * @returns {string} Percentage string (e.g., "42.5%").
 */
export function formatPercent(decimal: number, decimals = 1): string {
  return `${(decimal * 100).toFixed(decimals)}%`;
}

/**
 * Formats an ISO date string as a human-readable month/year label.
 *
 * @param {string} dateStr - ISO date string (e.g., "2024-03-15").
 * @returns {string} Formatted label (e.g., "Mar 2024").
 */
export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if needed.
 *
 * @param {string} str - String to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated string.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1)}…`;
}
