/**
 * Environment variable validation and typed accessors.
 *
 * RULES.MD Rule 0: SUPABASE_SERVICE_ROLE_KEY must never be accessed
 * from client-side code. Only import server-only accessors from API routes.
 *
 * @module lib/env
 */

/** Supported deployment environments. */
export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

const PUBLIC_REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const SERVER_REQUIRED = ['SUPABASE_SERVICE_ROLE_KEY', 'ANTHROPIC_API_KEY'] as const;

/**
 * Validates all required environment variables are present.
 * Call at the top of any server-side entry point or API route.
 *
 * @throws {Error} If any required variable is missing or env mismatch detected.
 */
export function validateEnv(): void {
  const allRequired = [...PUBLIC_REQUIRED, ...SERVER_REQUIRED];
  const missing = allRequired.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Check .env.local against .env.example.'
    );
  }

  const currentEnv = getCurrentEnvironment();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (currentEnv === Environment.Development && supabaseUrl.includes('prod')) {
    throw new Error(
      'SECURITY: Production Supabase URL detected in development environment. ' +
        'Check your .env.local file.'
    );
  }
}

/**
 * Returns the current deployment environment.
 *
 * @returns {Environment}
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV ?? 'development';
  if (env === 'production') return Environment.Production;
  return Environment.Development;
}

/** Returns true when running in production. */
export function isProduction(): boolean {
  return getCurrentEnvironment() === Environment.Production;
}

/**
 * Typed, safe environment variable accessors.
 * Server-only accessors must only be called from app/api/* route handlers.
 */
export const env = {
  /** Supabase project URL — safe for browser. */
  supabaseUrl: (): string => requireEnv('NEXT_PUBLIC_SUPABASE_URL'),

  /** Supabase anon key — safe for browser. */
  supabaseAnonKey: (): string => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  /**
   * Supabase service role key — SERVER-SIDE API ROUTES ONLY.
   * Never call this from components or page files.
   */
  supabaseServiceRoleKey: (): string => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),

  /**
   * Anthropic API key — SERVER-SIDE API ROUTES ONLY.
   * Never call this from components or page files.
   */
  anthropicApiKey: (): string => requireEnv('ANTHROPIC_API_KEY'),

  /** Claude model identifier. */
  anthropicModel: (): string => process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
} as const;

/**
 * Retrieves a required environment variable, throwing if absent.
 *
 * @param {string} key - Environment variable name.
 * @returns {string} The variable value.
 * @throws {Error} If the variable is not defined.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set. ` +
        'Ensure .env.local exists and matches .env.example.'
    );
  }
  return value;
}
