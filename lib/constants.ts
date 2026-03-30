/** Application-wide constants. */

export const APP_NAME = 'AGP Donor Intelligence';
export const APP_DESCRIPTION =
  'Nonprofit fundraising analytics powered by AI — upload donor data, explore KPIs, and ask questions.';

/** Route paths */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  UPLOAD: '/dashboard/upload',
  QUERY: '/dashboard/query',
} as const;

/** Expected CSV column names (case-insensitive match) */
export const CSV_EXPECTED_COLUMNS = [
  'donor_id',
  'donor_name',
  'segment',
  'gift_date',
  'gift_amount',
  'campaign',
  'channel',
  'region',
] as const;

/** Maximum CSV rows to process in one upload (performance guard) */
export const CSV_MAX_ROWS = 10_000;

/** Number of preview rows shown before confirming import */
export const CSV_PREVIEW_ROWS = 10;

/** Known donor segments */
export const DONOR_SEGMENTS = [
  'Major Gifts',
  'Mid-Level',
  'Sustainer',
  'First-Time',
  'Lapsed',
  'General',
] as const;

/** Known acquisition channels */
export const GIFT_CHANNELS = [
  'Email',
  'Direct Mail',
  'Event',
  'Online',
  'Phone',
] as const;

/** Chart brand colors (in order, for consistent Recharts rendering) */
export const CHART_COLORS = [
  '#2F6FED', // brand.secondary — Insight Blue
  '#9EDC4B', // brand.accent   — Momentum Green
  '#1F3E77', // brand.primary  — Institutional Blue
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#10B981', // emerald
] as const;
