-- Users (Extending Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Resumes Table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_pdf_url TEXT,     -- Path in Supabase Storage
  translated_content JSONB,  -- The AI parsed/translated structured data
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  is_unlocked BOOLEAN DEFAULT false, -- If true, the user has paid
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments/Transactions (Stripe or Toss)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  amount_krw INT NOT NULL DEFAULT 3900,
  payment_status TEXT DEFAULT 'pending', -- pending, success, failed
  payment_id TEXT, -- Stripe session ID or Toss paymentKey
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Resumes: Users can only upload/view their own resumes
CREATE POLICY "Users can view own resumes" 
ON public.resumes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" 
ON public.resumes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" 
ON public.resumes FOR UPDATE 
USING (auth.uid() = user_id);

-- Transactions: Restrict viewing to own transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Create a storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage RLS: Users can only access their own PDF files
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);
