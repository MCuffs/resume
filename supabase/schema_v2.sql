-- Arthurian Studio / Influencer Platform (Threads) - Supabase Schema v2
-- Goal: Separate PUBLIC profile data from PRIVATE tokens to reduce blast radius.

-- Public creator profile (safe to read publicly if you want a directory/leaderboard)
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threads_user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  -- Opt-in only. Used for public leaderboard/directory exposure.
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Private creator data (never readable from the browser)
CREATE TABLE IF NOT EXISTS creators_private (
  creator_id UUID PRIMARY KEY REFERENCES creators(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily stats history (for leaderboards / growth charts)
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers_count INT,
  posts_count INT,
  total_likes INT,
  total_comments INT,
  total_views INT,
  engagement_rate FLOAT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(creator_id, date)
);

-- Posts (optional; keep if you plan per-post analytics)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  threads_post_id TEXT UNIQUE NOT NULL,
  text TEXT,
  media_type TEXT,
  media_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  reposts_count INT DEFAULT 0,
  quotes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads / Applications (PII)
-- Store in Supabase but keep locked down (no public reads).
CREATE TABLE IF NOT EXISTS creator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'threads',
  channel_url TEXT NOT NULL,
  handle TEXT,
  followers TEXT NOT NULL,
  engagement TEXT NOT NULL,
  category TEXT NOT NULL,
  agreed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS brand_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  product_name TEXT NOT NULL,
  campaign_goal TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT
);

-- Paid brief (BM #1): one-time "Threads Campaign Blueprint"
-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_creators_threads_id ON creators(threads_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'creators_updated_at') THEN
    CREATE TRIGGER creators_updated_at
      BEFORE UPDATE ON creators
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'creators_private_updated_at') THEN
    CREATE TRIGGER creators_private_updated_at
      BEFORE UPDATE ON creators_private
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'posts_updated_at') THEN
    CREATE TRIGGER posts_updated_at
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- RLS (recommended; adjust to your auth model)
-- 1) creators can be public readable; keep writes locked down.
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read for directory/leaderboard
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_creators' AND tablename = 'creators') THEN
    CREATE POLICY public_read_creators
      ON creators FOR SELECT
      USING (true);
  END IF;
END $$;

-- Deny all access to PII tables from anon/authenticated users (service role bypasses RLS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'deny_all_creator_applications' AND tablename = 'creator_applications') THEN
    CREATE POLICY deny_all_creator_applications
      ON creator_applications FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'deny_all_brand_inquiries' AND tablename = 'brand_inquiries') THEN
    CREATE POLICY deny_all_brand_inquiries
      ON brand_inquiries FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;

END $$;

-- Deny all access to private tokens from anon/authenticated users (service role bypasses RLS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'deny_all_creators_private' AND tablename = 'creators_private') THEN
    CREATE POLICY deny_all_creators_private
      ON creators_private FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- Optional: public read daily stats (leaderboard). If you prefer, remove this and expose via serverless only.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_daily_stats' AND tablename = 'daily_stats') THEN
    CREATE POLICY public_read_daily_stats
      ON daily_stats FOR SELECT
      USING (true);
  END IF;
END $$;
