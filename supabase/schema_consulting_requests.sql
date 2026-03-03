CREATE TABLE IF NOT EXISTS public.consulting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  request_id TEXT UNIQUE NOT NULL,
  service TEXT NOT NULL,
  service_price TEXT,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  target_company TEXT NOT NULL,
  client_notes TEXT NOT NULL,
  payment_reference TEXT,
  payment_status TEXT DEFAULT 'paid_submitted',
  english_file_name TEXT NOT NULL,
  english_file_size BIGINT,
  english_storage_path TEXT NOT NULL,
  korean_file_name TEXT NOT NULL,
  korean_file_size BIGINT,
  korean_storage_path TEXT NOT NULL
);

ALTER TABLE public.consulting_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'deny_all_consulting_requests'
      AND tablename = 'consulting_requests'
  ) THEN
    CREATE POLICY deny_all_consulting_requests
      ON public.consulting_requests
      FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_consulting_requests_created_at ON public.consulting_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consulting_requests_email ON public.consulting_requests(applicant_email);
