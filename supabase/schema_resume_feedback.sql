-- Feedback loop table for AI resume output quality
CREATE TABLE IF NOT EXISTS public.resume_feedback_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  ip TEXT,
  user_agent TEXT,
  session_id TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  issues TEXT[] NOT NULL DEFAULT '{}',
  comment TEXT,
  generation_model TEXT,
  generation_attempt INT
);

ALTER TABLE public.resume_feedback_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'deny_all_resume_feedback_events'
      AND tablename = 'resume_feedback_events'
  ) THEN
    CREATE POLICY deny_all_resume_feedback_events
      ON public.resume_feedback_events
      FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_resume_feedback_events_created_at
  ON public.resume_feedback_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_feedback_events_rating
  ON public.resume_feedback_events(rating);
CREATE INDEX IF NOT EXISTS idx_resume_feedback_events_session
  ON public.resume_feedback_events(session_id);
