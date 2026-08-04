-- ============================================================
-- POLYMERHUB — WEBHOOK ATOMICITY & DEDUPLICATION MIGRATION
-- Migration: 20260725_webhook_atomic_dedup.sql
-- ============================================================

-- 1. Create payment webhook events table for event deduplication
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  event_id          TEXT PRIMARY KEY,
  event_type        TEXT NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at      TIMESTAMPTZ,
  payload_hash      TEXT NOT NULL,
  processing_status TEXT NOT NULL CHECK (processing_status IN ('received', 'processed', 'failed', 'duplicate'))
);

ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages webhook events" ON public.payment_webhook_events;
CREATE POLICY "Service role manages webhook events"
  ON public.payment_webhook_events FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Unique index on payment_history(razorpay_payment_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_history_payment_id ON public.payment_history (razorpay_payment_id);

-- 3. Atomic Stored Function for Payment Webhook Processing
CREATE OR REPLACE FUNCTION public.process_payment_webhook_event(
  p_event_id TEXT,
  p_event_type TEXT,
  p_payload_hash TEXT,
  p_user_id UUID,
  p_payment_id TEXT,
  p_order_id TEXT,
  p_amount NUMERIC,
  p_currency TEXT,
  p_status TEXT,
  p_plan TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_existing_event RECORD;
  v_sub_end TIMESTAMPTZ;
BEGIN
  -- 1. Event-level Deduplication Check
  SELECT * INTO v_existing_event FROM public.payment_webhook_events WHERE event_id = p_event_id;
  IF FOUND THEN
    RETURN jsonb_build_object('status', 'duplicate_event', 'message', 'Webhook event already processed');
  END IF;

  -- 2. Log webhook event receipt
  INSERT INTO public.payment_webhook_events (event_id, event_type, payload_hash, processing_status)
  VALUES (p_event_id, p_event_type, p_payload_hash, 'received');

  -- 3. Process payment.captured event
  IF p_event_type = 'payment.captured' THEN
    v_sub_end := NOW() + INTERVAL '1 month';

    -- Update profile entitlement
    UPDATE public.profiles
    SET 
      subscription_status = 'premium',
      subscription_end_date = v_sub_end,
      razorpay_payment_id = p_payment_id,
      razorpay_order_id = p_order_id,
      updated_at = NOW()
    WHERE id = p_user_id;

    -- Upsert payment history record
    INSERT INTO public.payment_history (user_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, plan, paid_at)
    VALUES (p_user_id, p_order_id, p_payment_id, p_amount, p_currency, 'success', p_plan, NOW())
    ON CONFLICT (razorpay_payment_id) DO UPDATE
    SET status = 'success', paid_at = NOW();

    -- Mark webhook event processed
    UPDATE public.payment_webhook_events
    SET processing_status = 'processed', processed_at = NOW()
    WHERE event_id = p_event_id;

    RETURN jsonb_build_object('status', 'success', 'message', 'Entitlement updated and payment logged atomically');

  ELSIF p_event_type = 'payment.failed' THEN
    INSERT INTO public.payment_history (user_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, plan, paid_at)
    VALUES (p_user_id, p_order_id, p_payment_id, p_amount, p_currency, 'failed', p_plan, NOW())
    ON CONFLICT (razorpay_payment_id) DO NOTHING;

    UPDATE public.payment_webhook_events
    SET processing_status = 'processed', processed_at = NOW()
    WHERE event_id = p_event_id;

    RETURN jsonb_build_object('status', 'success', 'message', 'Payment failure logged');

  ELSE
    UPDATE public.payment_webhook_events
    SET processing_status = 'processed', processed_at = NOW()
    WHERE event_id = p_event_id;

    RETURN jsonb_build_object('status', 'ignored', 'message', 'Event type ignored');
  END IF;

EXCEPTION WHEN OTHERS THEN
  UPDATE public.payment_webhook_events
  SET processing_status = 'failed'
  WHERE event_id = p_event_id;

  RAISE EXCEPTION 'Webhook atomic transaction failed: %', SQLERRM;
END;
$$;
