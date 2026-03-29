# AGP Donor Intelligence — Project Status

**Last Updated**: 2026-03-29
**Current Phase**: MVP Complete (Scaffolded with Mock Data)

---

## Phase 0: Knowledge Base ✅
- [x] Copy `Playbook - AGP Donor Intelligence.pdf` → `docs/reference_docs/`
- [x] Copy `RULES.MD` → `docs/reference_docs/RULES.MD`
- [x] Create `docs/architecture.md`
- [x] Create `docs/project_status.md`
- [x] Create `docs/changelog.md`

## Phase 1: Scaffolding ✅
- [x] Replace `package.json` (BMAD → Next.js 15 app)
- [x] Delete and regenerate `package-lock.json`
- [x] Replace `eslint.config.mjs` with Next.js config + BMAD dirs excluded
- [x] Update `prettier.config.mjs` (remove BMAD plugins)
- [x] Create `tsconfig.json` (`@/*` → repo root)
- [x] Create `next.config.ts`
- [x] Create `tailwind.config.ts` (brand tokens)
- [x] Create `postcss.config.mjs`
- [x] Create `.gitignore`
- [x] Create `.env.example`
- [x] Run `npm install`

## Phase 2: Foundation ✅
- [x] `lib/env.ts` — env validation + typed accessors
- [x] `lib/utils.ts` — `cn()`, `formatCurrency()`, etc.
- [x] `lib/constants.ts` — routes, CSV config, chart colors
- [x] `lib/supabase/client.ts` — browser Supabase client
- [x] `lib/supabase/server.ts` — server Supabase client + admin client
- [x] `app/globals.css` — Tailwind directives + CSS tokens
- [x] `app/layout.tsx` — root layout with Inter font
- [x] `app/page.tsx` — root redirect

## Phase 3: UI Primitives ✅
- [x] `components/ui/Button.tsx`
- [x] `components/ui/Card.tsx`
- [x] `components/ui/Input.tsx`
- [x] `components/ui/Badge.tsx`
- [x] `components/ui/LoadingSpinner.tsx`
- [x] `components/ui/ErrorMessage.tsx`
- [x] `components/ui/EmptyState.tsx`

## Phase 4: Layout ✅
- [x] `components/layout/TopBar.tsx`
- [x] `components/layout/Sidebar.tsx`
- [x] `components/layout/AppShell.tsx`

## Phase 5: Auth ✅
- [x] `app/(auth)/layout.tsx`
- [x] `app/(auth)/login/page.tsx` — email/password form
- [x] `app/api/auth/route.ts`
- [x] `app/dashboard/layout.tsx` — protected route wrapper

## Phase 6: Mock Data ✅
- [x] `lib/data/mockDonors.ts` — 60 realistic donor gift rows

## Phase 7: CSV Upload ✅
- [x] `lib/csv/schema.ts` — Zod schema
- [x] `lib/csv/parser.ts` — parse + validate
- [x] `app/api/uploads/route.ts`
- [x] `components/features/csv/CsvValidationSummary.tsx`
- [x] `components/features/csv/CsvPreviewTable.tsx`
- [x] `components/features/csv/CsvUploadZone.tsx`
- [x] `app/dashboard/upload/page.tsx`

## Phase 8: Executive Dashboard ✅
- [x] `app/api/dashboard/route.ts` — KPI aggregation
- [x] `components/features/dashboard/KpiCard.tsx`
- [x] `components/features/dashboard/GiftsOverTimeChart.tsx`
- [x] `components/features/dashboard/CampaignPerformanceChart.tsx`
- [x] `components/features/dashboard/DonorSegmentChart.tsx`
- [x] `components/features/dashboard/ChannelPerformanceChart.tsx`
- [x] `app/dashboard/page.tsx`

## Phase 9: AI Query ✅
- [x] `lib/ai/queryBuilder.ts` — structured context builder (no PII)
- [x] `app/api/ai/query/route.ts` — streaming Claude endpoint
- [x] `components/features/ai/StreamingResponse.tsx`
- [x] `components/features/ai/QueryInput.tsx`
- [x] `app/dashboard/query/page.tsx`

## Phase 10: Supabase Migrations ✅
- [x] `supabase/migrations/001_create_uploads.sql`
- [x] `supabase/migrations/002_create_donor_gifts.sql`

---

## Next Steps (Post-MVP)

- [ ] Create Supabase project (free tier) and run migrations
- [ ] Update `.env.local` with real Supabase URL + keys
- [ ] Replace `mockDonors` imports with real Supabase queries in API routes
- [ ] Wire CSV upload to actually persist records to `donor_gifts` table
- [ ] Run `npx bmad-method install --tools claude-code --yes`
- [ ] Deploy to Vercel + set production environment variables
- [ ] Add `/api/donors` route for paginated donor record browsing
- [ ] Add session-level upload persistence (replace `sessionStorage`)
