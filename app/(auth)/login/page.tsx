'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/lib/constants';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';

/**
 * Login page — institutional design matching the AGP Donor Intelligence brand.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Work email and security credential are required.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', { message: error.message, status: error.status });
        setErrorMessage('Invalid credentials. Please verify your email and password.');
        return;
      }

      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch (err) {
      console.error('Unexpected login error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-8 py-9 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* Logo */}
      <div className="mb-7 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5">
          {/* Vertical bar chart icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <rect x="1" y="10" width="4" height="11" rx="1" fill="#1F3E77" />
            <rect x="7" y="5" width="4" height="16" rx="1" fill="#1F3E77" />
            <rect x="13" y="1" width="4" height="20" rx="1" fill="#9EDC4B" />
            <rect x="19" y="7" width="2.5" height="14" rx="1" fill="#2F6FED" />
          </svg>
          <span className="text-[15px] font-bold tracking-[0.08em] text-brand-primary uppercase">
            AGP Donor Intelligence
          </span>
        </div>
        <p className="text-[12px] tracking-wide text-gray-400 uppercase">Secure Institutional Access</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Work Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Work Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email.admin@agpintelligence.org"
              autoComplete="email"
              required
              disabled={isLoading}
              className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3.5 pr-10 text-sm text-brand-text placeholder:text-gray-300 focus:border-brand-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 disabled:cursor-not-allowed"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>
        </div>

        {/* Security Credential */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Security Credential
            </label>
            <button type="button" className="text-[11px] font-medium text-brand-secondary hover:underline">
              FORGOT?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              disabled={isLoading}
              className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3.5 pr-10 text-sm text-brand-text placeholder:text-gray-400 focus:border-brand-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember session */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={rememberSession}
            onChange={(e) => setRememberSession(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-gray-300 text-brand-secondary accent-brand-secondary"
          />
          <span className="text-[12px] text-gray-500">Maintain secure session</span>
        </label>

        {/* Error */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-[12px] text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-[#162d58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Authenticating…
            </>
          ) : (
            <>
              Authenticate Securely
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Security badge */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
          AES 256 Multi-Layer Encryption Active
        </span>
      </div>

      {/* Links */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {['SSO Login', 'Help Center', 'Contact Support'].map((label, i) => (
          <button key={label} className="text-[11px] text-gray-400 hover:text-brand-primary transition-colors">
            {label}
            {i < 2 && <span className="ml-4 text-gray-200">|</span>}
          </button>
        ))}
      </div>

      {/* Dev bypass — only rendered when NEXT_PUBLIC_DEV_BYPASS_AUTH=true */}
      {DEV_BYPASS && (
        <div className="mt-5 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-center">
          <p className="mb-2 text-[11px] font-semibold text-amber-700">
            DEV MODE — Supabase not configured
          </p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="rounded-md bg-amber-500 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-amber-600"
          >
            Continue with mock data →
          </button>
        </div>
      )}
    </div>
  );
}
