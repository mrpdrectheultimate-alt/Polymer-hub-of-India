const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function reconcileExact132() {
  console.log('=== RECONCILING BATCH 3 EXACT 132 LESSON LEDGER ===');

  // 1. Delete extra PET slug 'polyethylene-terephthalate-pet-synthesis-crystallization-and-bottle-grade-processing'
  // and update 'rigid-packaging-pet-hdpe-pp' with the PET bottle processing content!
  const { data: petNew } = await supabase.from('lessons').select('content, title, summary').eq('slug', 'polyethylene-terephthalate-pet-synthesis-crystallization-and-bottle-grade-processing').single();

  if (petNew) {
    await supabase.from('lessons').update({
      title: "Polyethylene Terephthalate (PET): Synthesis, Crystallization & Bottle Processing",
      content: petNew.content,
      summary: petNew.summary,
      is_premium: false
    }).eq('slug', 'rigid-packaging-pet-hdpe-pp');
    console.log('Upgraded canonical Grade B slug: rigid-packaging-pet-hdpe-pp');

    await supabase.from('lessons').delete().eq('slug', 'polyethylene-terephthalate-pet-synthesis-crystallization-and-bottle-grade-processing');
    console.log('Deleted temporary extra slug: polyethylene-terephthalate-pet-synthesis-crystallization-and-bottle-grade-processing');
  }

  // 2. Check DB Count
  const { data: finalLessons } = await supabase.from('lessons').select('id, slug');
  console.log(`Reconciled DB Lesson Count: ${finalLessons.length} (Target: 132)`);
}

reconcileExact132();
