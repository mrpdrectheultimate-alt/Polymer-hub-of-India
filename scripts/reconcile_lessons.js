// scripts/reconcile_lessons.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function reconcile() {
  const { data: subjects } = await supabase.from('subjects').select('id, name, slug').order('name');
  const { data: lessons } = await supabase.from('lessons').select('id, title, slug, subject_id, created_at').order('created_at');

  console.log(`Total Subjects: ${subjects ? subjects.length : 0}`);
  console.log(`Total Lessons in DB: ${lessons ? lessons.length : 0}`);

  const countsBySubject = {};
  for (const s of subjects || []) {
    countsBySubject[s.id] = { name: s.name, slug: s.slug, count: 0, lessons: [] };
  }

  for (const l of lessons || []) {
    if (countsBySubject[l.subject_id]) {
      countsBySubject[l.subject_id].count++;
      countsBySubject[l.subject_id].lessons.push(l.slug);
    } else {
      console.log("Unmapped lesson:", l.slug, "subject_id:", l.subject_id);
    }
  }

  console.log("\n--- Breakdown by Subject ---");
  let total = 0;
  for (const sid of Object.keys(countsBySubject)) {
    const s = countsBySubject[sid];
    console.log(`${s.name} (${s.slug}): ${s.count} lessons`);
    total += s.count;
  }
  console.log(`\nReconciled Total: ${total} lessons`);
}

reconcile();
