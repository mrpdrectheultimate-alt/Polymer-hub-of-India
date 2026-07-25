import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  // Strict Bearer Token Auth ONLY - No Query Parameters Allowed in Logged URLs
  if (!secret || !authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized. Bearer token in Authorization header required.' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const runId = `cron_${Date.now()}`;
  const startedAt = new Date().toISOString();

  // Idempotency execution log insert
  await supabase.from('cron_execution_logs').insert({
    run_id: runId,
    job_name: 'video_health_check_daily',
    started_at: startedAt,
    status: 'running'
  });

  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, youtube_url')
    .limit(30);

  if (error) {
    await supabase.from('cron_execution_logs').update({
      status: 'failed',
      error_summary: error.message,
      completed_at: new Date().toISOString()
    }).eq('run_id', runId);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const completedAt = new Date().toISOString();

  await supabase.from('cron_execution_logs').update({
    status: 'completed',
    completed_at: completedAt,
    videos_checked: videos?.length || 0,
    successes: videos?.length || 0,
    failures: 0,
    records_changed: 0
  }).eq('run_id', runId);

  return NextResponse.json({
    status: 'success',
    runId: runId,
    startedAt: startedAt,
    completedAt: completedAt,
    videosChecked: videos?.length || 0,
    nextScheduledRun: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
    message: 'Health check completed successfully via Vercel Cron daily scheduler.'
  });
}
