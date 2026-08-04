// scripts/inspect_modules.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  console.log('Inspecting modules...');
  const { data: modules, error } = await supabase.from('modules').select('*');
  if (error) {
    console.error('Error fetching modules:', error);
  } else {
    console.log(`Found ${modules.length} modules.`);
    modules.forEach(m => {
      console.log(`Module: "${m.name}" | ID: ${m.id} | Subject ID: ${m.subject_id}`);
    });
  }
}

inspect();
