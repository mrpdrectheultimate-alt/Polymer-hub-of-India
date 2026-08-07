import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET || process.env.NEXT_PUBLIC_CRON_SECRET;

  // Verify Bearer token authorization header
  if (!secret || !authHeader || authHeader !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const runId = `cron_${Date.now()}`;
  const startedAt = new Date().toISOString();

  // Create cron run idempotency audit log
  await supabase.from('cron_execution_logs').insert({
    run_id: runId,
    job_name: 'video-health-check',
    started_at: startedAt,
    status: 'running'
  });

  // Select all videos to analyze health status
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    await supabase.from('cron_execution_logs').update({
      status: 'failed',
      error_summary: error.message,
      completed_at: new Date().toISOString()
    }).eq('run_id', runId);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Detect available schema columns dynamically to avoid schema-drift failures
  const sampleVideo = videos?.[0] || {};
  const hasLastCheckedAt = 'last_checked_at' in sampleVideo;
  const hasOembedVerifiedAt = 'oembed_verified_at' in sampleVideo;
  const hasEmbedError = 'embed_error' in sampleVideo;
  const hasFailureReason = 'failure_reason' in sampleVideo;

  let working = 0;
  let broken = 0;

  for (const video of videos || []) {
    const ytId = video.youtube_id;
    if (!ytId) {
      const updateData: Record<string, string | null> = { embed_status: 'broken' };
      if (hasLastCheckedAt) updateData.last_checked_at = new Date().toISOString();
      if (hasOembedVerifiedAt) updateData.oembed_verified_at = new Date().toISOString();
      if (hasEmbedError) updateData.embed_error = 'Missing YouTube ID';
      if (hasFailureReason) updateData.failure_reason = 'Missing YouTube ID';

      await supabase.from('videos').update(updateData).eq('id', video.id);
      broken++;
      continue;
    }

    try {
      // Execute HEAD/GET request on oEmbed API with 5 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const status = res.ok ? 'working' : 'broken';
      const errorMsg = res.ok ? null : `oEmbed status ${res.status}`;

      if (status === 'working') working++;
      else broken++;

      const updateData: Record<string, string | null> = { embed_status: status };
      if (hasLastCheckedAt) updateData.last_checked_at = new Date().toISOString();
      if (hasOembedVerifiedAt) updateData.oembed_verified_at = new Date().toISOString();
      if (hasEmbedError) updateData.embed_error = errorMsg;
      if (hasFailureReason) updateData.failure_reason = errorMsg;

      await supabase.from('videos').update(updateData).eq('id', video.id);
    } catch (err: unknown) {
      broken++;
      const errMsg = err instanceof Error ? err.message : 'Fetch aborted / network failure';
      
      const updateData: Record<string, string | null> = { embed_status: 'broken' };
      if (hasLastCheckedAt) updateData.last_checked_at = new Date().toISOString();
      if (hasOembedVerifiedAt) updateData.oembed_verified_at = new Date().toISOString();
      if (hasEmbedError) updateData.embed_error = errMsg;
      if (hasFailureReason) updateData.failure_reason = errMsg;

      await supabase.from('videos').update(updateData).eq('id', video.id);
    }
  }

  const completedAt = new Date().toISOString();

  // Log completion metrics in audit history
  await supabase.from('cron_execution_logs').update({
    status: 'completed',
    completed_at: completedAt,
    videos_checked: videos?.length || 0,
    successes: working,
    failures: broken,
    records_changed: working + broken
  }).eq('run_id', runId);

  return NextResponse.json({
    total: videos?.length || 0,
    working,
    broken,
    timestamp: completedAt
  });
}
