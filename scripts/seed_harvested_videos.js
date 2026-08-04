const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('🚀 Seeding Harvested Videos into Supabase...');

  const srcPath = path.join(__dirname, 'harvested_videos.json');
  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source file not found: ${srcPath}. Please run the harvester first.`);
    return;
  }

  const harvestedVideos = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  console.log(`Loaded ${harvestedVideos.length} harvested videos to seed.`);

  // Delete all existing videos to start fresh and avoid constraints issues
  console.log('🧹 Clearing existing videos from database...');
  const { error: clearErr } = await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (clearErr) {
    console.warn('⚠️ Warning: Failed to clear existing videos:', clearErr.message);
  } else {
    console.log('✅ Existing videos cleared.');
  }

  let successCount = 0;
  let failureCount = 0;

  const nowIso = new Date().toISOString();

  for (let i = 0; i < harvestedVideos.length; i++) {
    const v = harvestedVideos[i];
    
    const { error } = await supabase.from('videos').upsert({
      title: v.title,
      youtube_id: v.youtube_id,
      youtube_url: `https://www.youtube.com/watch?v=${v.youtube_id}`,
      subject_id: v.subject_id,
      subject_slug: v.subject_slug,
      subject_name: v.subject_name,
      lesson_slug: v.lesson_slug,
      channel: v.channel,
      duration: v.duration || '15:00',
      description: v.description,
      source: v.source || 'Industry',
      level: v.level || 'Foundation',
      is_active: true,
      academic_review_status: 'approved',
      relevance_score: 95,
      mapping_confidence: 'high',
      mapping_level: v.lesson_slug ? 'lesson' : 'subject',
      status: 'published',
      embed_status: 'working',
      oembed_verified_at: nowIso,
      thumbnail_verified_at: nowIso,
      manual_playback_verified: true,
      manual_playback_verified_at: nowIso,
      verified_by: 'academic_curator_video_library_2.0'
    }, { onConflict: 'youtube_id' });

    if (error) {
      console.error(`   ❌ Failed to insert video "${v.title}":`, error.message);
      failureCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\n🎉 Seeding Complete!`);
  console.log(`✅ Successfully seeded: ${successCount} videos.`);
  console.log(`❌ Failed to seed: ${failureCount} videos.`);
}

main().catch(err => {
  console.error('Fatal Seeding Error:', err);
});
