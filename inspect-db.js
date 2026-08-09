const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkVideos() {
  try {
    const { data: videos, count, error } = await supabase
      .from('videos')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching videos from DB:', error);
      return;
    }

    console.log('=== DATABASE VIDEO STATS ===');
    console.log('Total Videos in Database:', count || (videos ? videos.length : 0));
    if (videos && videos.length > 0) {
      console.log('Columns in videos table:', Object.keys(videos[0]));
      console.log('Sample of first 5 videos:');
      videos.slice(0, 5).forEach((v, index) => {
        console.log(`[${index + 1}] ID: ${v.id}, Title: "${v.title}", YouTube ID: ${v.youtube_id || v.external_video_id}`);
      });
      const hasEmbedStatus = 'embed_status' in videos[0];
      if (hasEmbedStatus) {
        const brokenCount = videos.filter(v => v.embed_status === 'broken').length;
        const activeCount = videos.filter(v => v.embed_status === 'active' || v.embed_status === 'working').length;
        const pendingCount = videos.filter(v => !v.embed_status || v.embed_status === 'pending').length;
        console.log(`Broken: ${brokenCount}, Active/Working: ${activeCount}, Pending/None: ${pendingCount}`);
      } else {
        console.log('embed_status column does NOT exist in schema.');
      }
    } else {
      console.log('No videos found in the database.');
    }
  } catch (err) {
    console.error('Fatal execution error:', err);
  }
}

checkVideos();
