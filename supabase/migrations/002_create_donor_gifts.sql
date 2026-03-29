-- Migration: 002_create_donor_gifts
-- Purpose: Store individual parsed donor gift records from CSV uploads.
-- RLS: Users can only access their own donor records.

CREATE TABLE IF NOT EXISTS donor_gifts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id     UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  donor_id      TEXT NOT NULL,
  donor_name    TEXT,
  segment       TEXT,
  gift_date     DATE NOT NULL,
  gift_amount   NUMERIC(12, 2) NOT NULL CHECK (gift_amount >= 0),
  campaign      TEXT,
  channel       TEXT,
  region        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common aggregation query patterns
CREATE INDEX IF NOT EXISTS idx_donor_gifts_user_id   ON donor_gifts (user_id);
CREATE INDEX IF NOT EXISTS idx_donor_gifts_upload_id ON donor_gifts (upload_id);
CREATE INDEX IF NOT EXISTS idx_donor_gifts_gift_date ON donor_gifts (gift_date);
CREATE INDEX IF NOT EXISTS idx_donor_gifts_campaign  ON donor_gifts (campaign);
CREATE INDEX IF NOT EXISTS idx_donor_gifts_channel   ON donor_gifts (channel);
CREATE INDEX IF NOT EXISTS idx_donor_gifts_segment   ON donor_gifts (segment);

-- Composite index for the most frequent dashboard aggregation (user + date range)
CREATE INDEX IF NOT EXISTS idx_donor_gifts_user_date
  ON donor_gifts (user_id, gift_date DESC);

-- Enable Row Level Security
ALTER TABLE donor_gifts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only read/write/delete their own gift records
CREATE POLICY "donor_gifts_select_own" ON donor_gifts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "donor_gifts_insert_own" ON donor_gifts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "donor_gifts_delete_own" ON donor_gifts
  FOR DELETE
  USING (auth.uid() = user_id);
