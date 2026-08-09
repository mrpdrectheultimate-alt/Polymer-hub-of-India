const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Concurrency batch execution helper
async function mapLimit(items, limit, fn) {
  const results = [];
  const executing = new Set();
  
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    executing.add(p);
    
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

async function checkVideo(video) {
  const ytId = video.youtube_id;
  if (!ytId) {
    return { id: video.id, title: video.title, status: 'broken', error: 'Missing YouTube ID' };
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const status = res.ok ? 'working' : 'broken';
    const errorMsg = res.ok ? null : `oEmbed status ${res.status}`;
    
    return { id: video.id, title: video.title, status, error: errorMsg, youtube_id: ytId, subject: video.subject_slug };
  } catch (err) {
    return { id: video.id, title: video.title, status: 'broken', error: err.message || 'Fetch failed', youtube_id: ytId, subject: video.subject_slug };
  }
}

async function run() {
  console.log('Fetching all videos from Supabase...');
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching videos:', error);
    return;
  }
  
  console.log(`Loaded ${videos.length} videos. Starting oEmbed validation audit (concurrency = 15)...`);
  
  const results = await mapLimit(videos, 15, checkVideo);
  
  console.log('Audit complete! Updating video statuses in database...');
  
  const brokenList = [];
  let workingCount = 0;
  let brokenCount = 0;
  
  const sampleVideo = videos[0] || {};
  const hasLastCheckedAt = 'last_checked_at' in sampleVideo;
  const hasOembedVerifiedAt = 'oembed_verified_at' in sampleVideo;
  const hasEmbedError = 'embed_error' in sampleVideo;
  const hasFailureReason = 'failure_reason' in sampleVideo;
  
  for (const r of results) {
    const isBroken = r.status === 'broken';
    const updateData = { 
      embed_status: isBroken ? 'invalid' : 'working',
      status: isBroken ? 'draft' : 'published'
    };
    if (hasLastCheckedAt) updateData.last_checked_at = new Date().toISOString();
    if (hasOembedVerifiedAt) updateData.oembed_verified_at = new Date().toISOString();
    if (hasEmbedError) updateData.embed_error = r.error;
    if (hasFailureReason) updateData.failure_reason = r.error;
    
    if (r.status === 'working') {
      workingCount++;
    } else {
      brokenCount++;
      brokenList.push(r);
    }
    
    const { error: updateErr } = await supabase.from('videos').update(updateData).eq('id', r.id);
    if (updateErr) {
      console.error(`Failed to update video ${r.title} (${r.id}):`, updateErr);
    }
  }
  
  console.log('=== AUDIT RESULTS SUMMARY ===');
  console.log(`Total Audited: ${videos.length}`);
  console.log(`Working Videos: ${workingCount}`);
  console.log(`Broken Videos: ${brokenCount}`);
  
  // Write report to file
  const fs = require('fs');
  fs.writeFileSync('broken_videos_report.json', JSON.stringify(brokenList, null, 2));
  console.log(`Wrote list of ${brokenCount} broken videos to broken_videos_report.json`);
}

run();
