-- ============================================================
-- POLYMERHUB — PREMIUM ACCESS, RAZORPAY & PROTECTED PDF HARDENING
-- Migration: 20260725_premium_razorpay_pdf_hardening.sql
-- ============================================================

-- 1. Subscriptions table with expiration timestamps
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code           TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('active', 'expired', 'refunded', 'cancelled')),
  starts_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_order_id   TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own subscription" ON public.subscriptions;
CREATE POLICY "Users read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_payment_id ON public.subscriptions (razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions (user_id, status, expires_at);

-- 2. Payment Requests table
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code         TEXT NOT NULL,
  amount            INTEGER NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT UNIQUE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'expired')),
  expires_at        TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own payment requests" ON public.payment_requests;
CREATE POLICY "Users read own payment requests"
  ON public.payment_requests FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 3. PDF Download Log table
CREATE TABLE IF NOT EXISTS public.pdf_download_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id     UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pdf_download_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own download log" ON public.pdf_download_log;
CREATE POLICY "Users view own download log"
  ON public.pdf_download_log FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own download log" ON public.pdf_download_log;
CREATE POLICY "Users insert own download log"
  ON public.pdf_download_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Atomic entitlement activation RPC handling verification vs webhook race conditions
CREATE OR REPLACE FUNCTION public.activate_premium_entitlement(
  p_user_id UUID,
  p_plan_code TEXT,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_duration_days INT DEFAULT 30
)
RETURNS TABLE (
  success BOOLEAN,
  already_processed BOOLEAN,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_existing_sub RECORD;
  v_new_expires TIMESTAMPTZ;
BEGIN
  -- 1. Check if this exact payment ID was already processed
  SELECT * INTO v_existing_sub FROM public.subscriptions WHERE razorpay_payment_id = p_payment_id;
  IF FOUND THEN
    RETURN QUERY SELECT true, true, v_existing_sub.expires_at;
    RETURN;
  END IF;

  -- 2. Calculate new expiration (Extend existing active subscription if present)
  SELECT MAX(s.expires_at) INTO v_new_expires
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id AND s.status = 'active' AND s.expires_at > NOW();

  IF v_new_expires IS NULL THEN
    v_new_expires := NOW() + (p_duration_days || ' days')::INTERVAL;
  ELSE
    v_new_expires := v_new_expires + (p_duration_days || ' days')::INTERVAL;
  END IF;

  -- 3. Insert new subscription atomically
  INSERT INTO public.subscriptions (
    user_id,
    plan_code,
    status,
    starts_at,
    expires_at,
    razorpay_payment_id,
    razorpay_order_id
  ) VALUES (
    p_user_id,
    p_plan_code,
    'active',
    NOW(),
    v_new_expires,
    p_payment_id,
    p_order_id
  );

  -- 4. Update profile subscription status
  UPDATE public.profiles
  SET is_premium = true,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- 5. Mark payment request as paid
  UPDATE public.payment_requests
  SET status = 'paid'
  WHERE razorpay_order_id = p_order_id;

  RETURN QUERY SELECT true, false, v_new_expires;
END;
$$;
