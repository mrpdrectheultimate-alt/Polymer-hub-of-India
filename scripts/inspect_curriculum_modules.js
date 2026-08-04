// scripts/inspect_curriculum_modules.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  console.log('Inspecting curriculum_modules...');
  const { data: modules, error } = await supabase.from('curriculum_modules').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${modules.length} modules.`);
    modules.forEach(m => {
      console.log(`Subject ID: ${m.subject_id} | Module: "${m.name}" | ID: ${m.id} | Slug: ${m.slug}`);
    });
  }
}

inspect();
