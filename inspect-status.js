const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectStatus() {
  const { data, error } = await supabase.from('videos').select('embed_status');
  if (error) {
    console.error('Error:', error);
    return;
  }
  const counts = {};
  data.forEach(v => {
    counts[v.embed_status] = (counts[v.embed_status] || 0) + 1;
  });
  console.log('Current embed_status counts in DB:', counts);
}

inspectStatus();
