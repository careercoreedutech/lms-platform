-- ============================================================================
-- CAREERCORE: Lead capture tables (newsletter + counseling / enrollment desk)
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- The website can INSERT into these tables with the public anon key,
-- but cannot read them back (only admins / service role can).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    source TEXT DEFAULT 'footer',
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT newsletter_email_format CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,}$')
);
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key
    ON public.newsletter_subscribers (lower(email));

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'Public can subscribe') THEN
        CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers
            FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS public.counseling_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
    email TEXT,
    track TEXT,
    preferred_time TEXT,
    topic TEXT DEFAULT 'Free counseling',
    message TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.counseling_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'counseling_requests' AND policyname = 'Public can request counseling') THEN
        CREATE POLICY "Public can request counseling" ON public.counseling_requests
            FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
END $$;
