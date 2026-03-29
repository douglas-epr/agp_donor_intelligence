# Changelog

All notable changes to AGP Donor Intelligence are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Connect CSV upload to real Supabase `donor_gifts` table
- Deploy to Vercel
- Run `npx bmad-method install --tools claude-code --yes`

---

## [0.1.0] — 2026-03-29

### Added
- **Knowledge base**: `docs/reference_docs/` with Playbook PDF and RULES.MD
- **Architecture doc**: `docs/architecture.md` covering app structure, DB schema, API contracts, design system
- **Project scaffolding**: Next.js 15 + TypeScript + Tailwind CSS configured on top of BMAD-METHOD repo
  - Replaced BMAD `package.json` with Next.js app config
  - `tsconfig.json` with `@/*` alias pointing to repo root (not `src/`)
  - `tailwind.config.ts` with AGP brand color tokens
  - `eslint.config.mjs` updated to Next.js config with BMAD dirs excluded
- **Foundation layer**: `lib/env.ts`, `lib/utils.ts`, `lib/constants.ts`, Supabase browser + server clients
- **UI primitives**: Button, Card, Input, Badge, LoadingSpinner, ErrorMessage, EmptyState
- **Layout**: AppShell (TopBar + Sidebar) using AGP Institutional Blue (`#1F3E77`)
- **Auth feature**: Email/password login page with Supabase Auth, protected dashboard layout
- **Mock dataset**: 60 realistic donor gift rows across 5 campaigns, 4 channels, 4 regions, 6 segments
- **CSV Upload feature**: Zod validation, graceful error handling, 10-row preview table, validation summary
- **Executive Dashboard**: 4 KPI cards (Total Raised, Avg Gift, Donor Count, Retention Rate) + 4 Recharts charts
- **AI Query feature**: Natural language interface → structured context builder → streaming Claude API response
- **Supabase migrations**: `uploads` and `donor_gifts` tables with full RLS policies

### chore: Initial Setup
