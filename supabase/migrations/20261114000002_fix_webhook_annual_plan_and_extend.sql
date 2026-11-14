-- ============================================================
-- POLYMERHUB — FIX WEBHOOK ATOMIC DEDUP FOR ANNUAL PLANS & RENEWALS
-- Migration: 20261114000002_fix_webhook_annual_plan_and_extend.sql
-- ============================================================

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
  v_current_sub_end TIMESTAMPTZ;
  v_current_status TEXT;
  v_base_date TIMESTAMPTZ;
  v_sub_end TIMESTAMPTZ;
  v_is_annual BOOLEAN;
BEGIN
  -- 1. Event-level Deduplication Check
  SELECT * INTO v_existing_event FROM public.payment_webhook_events WHERE event_id = p_event_id;
  IF FOUND THEN
    RETURN jsonb_build_object('status', 'duplicate_event', 'message', 'Webhook event already processed');
  END IF;

  -- 2. Log webhook event receipt
  INSERT INTO public.payment_webhook_events (event_id, event_type, payload_hash, processing_status)
  VALUES (p_event_id, p_event_type, p_payload_hash, 'received');

  -- 3. Process payment.captured or order.paid events
  IF p_event_type IN ('payment.captured', 'order.paid') THEN
    -- Fetch current profile subscription to avoid wiping unexpired days on renewals
    SELECT subscription_end_date, subscription_status 
    INTO v_current_sub_end, v_current_status
    FROM public.profiles 
    WHERE id = p_user_id;

    IF v_current_status = 'premium' AND v_current_sub_end IS NOT NULL AND v_current_sub_end > NOW() THEN
      v_base_date := v_current_sub_end;
    ELSE
      v_base_date := NOW();
    END IF;

    -- Determine if annual (>= 1000 or plan contains annual)
    v_is_annual := (p_amount >= 1000) OR (p_plan ILIKE '%annual%');

    IF v_is_annual THEN
      v_sub_end := v_base_date + INTERVAL '1 year';
    ELSE
      v_sub_end := v_base_date + INTERVAL '1 month';
    END IF;

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

    RETURN jsonb_build_object(
      'status', 'success', 
      'message', 'Entitlement updated and payment logged atomically',
      'plan', CASE WHEN v_is_annual THEN 'premium_annual' ELSE 'premium_monthly' END,
      'subscription_end_date', v_sub_end
    );

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
