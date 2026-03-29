-- Migration: 001_create_uploads
-- Purpose: Track CSV file ingestion sessions per authenticated user.
-- RLS: Users can only access their own upload records.

CREATE TABLE IF NOT EXISTS uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename        TEXT NOT NULL,
  row_count       INTEGER NOT NULL DEFAULT 0,
  rejected_count  INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'processing'
                  CHECK (status IN ('processing', 'complete', 'error')),
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for per-user listing (most frequent query pattern)
CREATE INDEX IF NOT EXISTS idx_uploads_user_id    ON uploads (user_id);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads (created_at DESC);

-- Enable Row Level Security
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only see and modify their own uploads
CREATE POLICY "uploads_select_own" ON uploads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "uploads_insert_own" ON uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "uploads_update_own" ON uploads
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "uploads_delete_own" ON uploads
  FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER uploads_updated_at
  BEFORE UPDATE ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
