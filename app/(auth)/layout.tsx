/**
 * Auth layout — full-screen institutional login shell.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F0F2F5]">
      {/* Subtle background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#1F3E77 1px, transparent 1px), linear-gradient(90deg, #1F3E77 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Faint world-map watermark blobs */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/3 opacity-[0.03]" aria-hidden="true">
        <svg viewBox="0 0 400 800" fill="#1F3E77" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <ellipse cx="150" cy="200" rx="180" ry="120" />
          <ellipse cx="80" cy="450" rx="120" ry="80" />
          <ellipse cx="220" cy="650" rx="160" ry="90" />
        </svg>
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-[400px] px-4">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-gray-200 bg-white/60 px-8 py-3 backdrop-blur-sm">
        <p className="text-[11px] text-gray-400">
          © 2024 AGP Donor Intelligence. Executive Confidential.
        </p>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Security Architecture'].map((link) => (
            <button key={link} className="text-[11px] text-gray-400 hover:text-brand-primary transition-colors">
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
