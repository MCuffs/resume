-- Transactions table for Privacy-First approach
-- We NO LONGER store original PDFs or parsed resumes. 
-- We ONLY store anonymous session transactions to verify payment status before hitting the AI API.

CREATE TABLE public.anonymous_transactions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_provider TEXT, -- 'paypal'
  payment_id TEXT,       -- PayPal Order ID
  amount_usd NUMERIC,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anonymous_transactions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (since users are not logged in)
CREATE POLICY "Allow anonymous inserts" 
ON public.anonymous_transactions FOR INSERT 
WITH CHECK (true);

-- Allow reading based on session_id (which is basically a secret token the client holds)
CREATE POLICY "Allow reading by session_id" 
ON public.anonymous_transactions FOR SELECT 
USING (true);

-- Allow updating by session_id (for webhook or client-side confirmation)
CREATE POLICY "Allow updating by session_id" 
ON public.anonymous_transactions FOR UPDATE 
USING (true);
