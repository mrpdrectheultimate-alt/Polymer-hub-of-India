const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixUpgrades() {
  console.log('=== FIXING BATCH 3 CANONICAL GRADE B UPGRADES & DB COUNT ===');

  // 1. Get content for PLA and PHA from generate_all_batch3_content
  const { data: newPla } = await supabase.from('lessons').select('content, title, summary, subject_id').eq('slug', 'polylactic-acid-pla-synthesis-properties-and-industrial-processing').single();
  const { data: newPha } = await supabase.from('lessons').select('content, title, summary, subject_id').eq('slug', 'polyhydroxyalkanoates-pha-biosynthesis-properties-and-applications').single();

  // 2. Update canonical Grade B lessons
  if (newPla) {
    await supabase.from('lessons').update({
      title: "Polylactic Acid (PLA): Synthesis, Properties, and Industrial Processing",
      content: newPla.content,
      summary: newPla.summary,
      is_premium: false
    }).eq('slug', 'polylactic-acid-pla-synthesis-properties-and-commercial-reality');
    console.log('Updated canonical slug: polylactic-acid-pla-synthesis-properties-and-commercial-reality');
  }

  if (newPha) {
    await supabase.from('lessons').update({
      title: "Polyhydroxyalkanoates (PHA): Biosynthesis, Properties, and Applications",
      content: newPha.content,
      summary: newPha.summary,
      is_premium: false
    }).eq('slug', 'polyhydroxyalkanoates-pha-nature-s-true-bioplastic');
    console.log('Updated canonical slug: polyhydroxyalkanoates-pha-nature-s-true-bioplastic');
  }

  // 3. Delete extra inserted temporary slugs
  await supabase.from('lessons').delete().eq('slug', 'polylactic-acid-pla-synthesis-properties-and-industrial-processing');
  await supabase.from('lessons').delete().eq('slug', 'polyhydroxyalkanoates-pha-biosynthesis-properties-and-applications');

  // 4. Verify Final DB Count
  const { data: finalLessons } = await supabase.from('lessons').select('id, slug');
  console.log(`Final DB Lesson Count: ${finalLessons.length} (Target: 132)`);
}

fixUpgrades();
