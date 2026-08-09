const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('id, name, slug, order_index')
    .order('order_index');
  
  if (error) {
    console.error('Error fetching subjects:', error);
    return;
  }
  
  console.log(`Total subjects in database: ${subjects.length}`);
  console.log(JSON.stringify(subjects, null, 2));
}

run();
