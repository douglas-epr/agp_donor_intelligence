# AGP Donor Intelligence — Architecture Document

**Version**: 1.0.0
**Last Updated**: 2026-03-29
**Stack**: Next.js 15 · Supabase · Tailwind CSS · Recharts · Anthropic Claude API

---

## Coexistence Note

This repository hosts both the **BMAD-METHOD v6.2.2** framework (in `src/`, `tools/`, `website/`) and the **AGP Donor Intelligence Next.js application** (in `app/`, `components/`, `lib/`). The Next.js App Router is at the repository root `app/` — **not** `src/app/` — to avoid colliding with BMAD's `src/` tree.

The `tsconfig.json` path alias `@/*` points to the **repo root** (`./*`), not `./src/*`.

---

## Application Directory Structure

```
app/
  (auth)/login/page.tsx        ← Email/password login form
  (auth)/layout.tsx            ← Centered auth page layout
  dashboard/layout.tsx         ← Protected route wrapper (auth guard)
  dashboard/page.tsx           ← Executive Summary Dashboard
  dashboard/upload/page.tsx    ← CSV Upload flow
  dashboard/query/page.tsx     ← AI Query interface
  api/auth/route.ts            ← POST: logout
  api/uploads/route.ts         ← POST: CSV parse + validation
  api/donors/route.ts          ← GET: paginated donor records
  api/dashboard/route.ts       ← GET: KPI + chart aggregations
  api/ai/query/route.ts        ← POST: streaming Claude query

components/
  ui/                          ← Button, Card, Input, Badge, LoadingSpinner, ErrorMessage, EmptyState
  features/csv/                ← CsvUploadZone, CsvPreviewTable, CsvValidationSummary
  features/dashboard/          ← KpiCard, GiftsOverTimeChart, CampaignPerformanceChart, DonorSegmentChart, ChannelPerformanceChart
  features/ai/                 ← QueryInput, StreamingResponse
  layout/                      ← AppShell, TopBar, Sidebar

lib/
  env.ts                       ← Runtime env validation + typed accessors
  utils.ts                     ← cn(), formatCurrency(), formatPercent(), etc.
  constants.ts                 ← Routes, CSV config, chart colors
  supabase/client.ts           ← Browser Supabase client
  supabase/server.ts           ← Server-side Supabase client + admin client
  csv/schema.ts                ← Zod schema for DonorGiftRow
  csv/parser.ts                ← CSV parse + validation logic
  data/mockDonors.ts           ← 60-row mock dataset (MVP phase)
  ai/queryBuilder.ts           ← Builds structured context for Claude (no PII)

supabase/migrations/
  001_create_uploads.sql
  002_create_donor_gifts.sql
```

---

## Database Schema

### `uploads`

Tracks CSV upload sessions per user.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | `gen_random_uuid()` |
| user_id | UUID FK | `auth.users(id) ON DELETE CASCADE` |
| filename | TEXT | Original filename |
| row_count | INTEGER | Valid row count |
| rejected_count | INTEGER | Rejected row count |
| status | TEXT | `processing` / `complete` / `error` |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto (trigger) |

RLS: All operations gated by `auth.uid() = user_id`.

### `donor_gifts`

Individual gift records linked to an upload session.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| upload_id | UUID FK | `uploads(id) ON DELETE CASCADE` |
| user_id | UUID FK | `auth.users(id) ON DELETE CASCADE` |
| donor_id | TEXT | From CSV |
| donor_name | TEXT | Nullable |
| segment | TEXT | e.g., Major Gifts, Sustainer |
| gift_date | DATE | Validated — required |
| gift_amount | NUMERIC(12,2) | Validated ≥ 0 — required |
| campaign | TEXT | Nullable |
| channel | TEXT | Nullable |
| region | TEXT | Nullable |

RLS: SELECT, INSERT, DELETE gated by `auth.uid() = user_id`.

---

## Design System

### Color Tokens (tailwind.config.ts)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand.primary` | `#1F3E77` | Navigation, headers |
| `brand.secondary` | `#2F6FED` | Primary buttons, links, chart lines |
| `brand.bg` | `#F5F7FA` | Page and card backgrounds |
| `brand.accent` | `#9EDC4B` | Growth indicators, positive metrics |
| `brand.text` | `#2A2E35` | Titles, KPI numbers, body copy |

### Typography

- Font: Inter (via `next/font/google`)
- Scale: Tailwind default (text-sm through text-3xl)

---

## API Route Contracts

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/auth` | POST | No | Sign out |
| `/api/uploads` | POST | Yes | Parse CSV, return preview + validation |
| `/api/donors` | GET | Yes | Paginated donor records |
| `/api/dashboard` | GET | Yes | KPI aggregation + chart data |
| `/api/ai/query` | POST | Yes | Streaming Claude response |

---

## Security Rules (RULES.MD)

- **Rule 0**: `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` only in `app/api/*`. Never in components.
- `user_id` always from `supabase.auth.getUser()` — never from request body.
- RLS enabled on all tables.
- No raw PII sent to Claude — only anonymized aggregated context.
- `lib/env.ts` validates all env vars at startup.

---

## AI Query Architecture

```
User question
    │
    ▼
POST /api/ai/query
    │
    ├── Auth check (Supabase session)
    │
    ├── buildDonorContext(mockDonors)
    │     → Aggregated summary (no donor names)
    │     → segments, campaigns, channels, regions, top donors
    │
    ├── buildSystemPrompt(context)
    │     → Instructs Claude to answer ONLY from provided data
    │
    ├── Anthropic Claude API (streaming)
    │
    └── ReadableStream → client (text/plain chunked)
```

---

## Integration List

| Service | Package | Purpose |
|---------|---------|---------|
| Supabase Auth | `@supabase/ssr` | Session management, login |
| Supabase DB | `@supabase/supabase-js` | PostgreSQL donor data |
| Anthropic Claude | `@anthropic-ai/sdk` | Natural language queries |
| Recharts | `recharts` | Dashboard charts |
| Zod | `zod` | CSV row validation |
| Vercel | — | Deployment |

---

## Mocking Strategy (MVP Phase)

- `lib/data/mockDonors.ts` provides 60 typed `DonorGift` rows.
- All API routes (dashboard, AI query) import from mock.
- Swap to Supabase queries: replace `mockDonors` import with `supabase.from('donor_gifts').select('*').eq('user_id', user.id)` in each API route.
- CSV parser and Zod schema are fully wired — upload validation is real, not mocked.
- Supabase Auth is real — login/session works against a live Supabase project.
