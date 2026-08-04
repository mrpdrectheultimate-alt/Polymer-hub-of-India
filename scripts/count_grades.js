const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function countGrades() {
  const { data: lessons, error } = await supabase.from('lessons').select('id, title, slug, quality_score, review_status');
  if (error) {
    console.error(error);
    process.exit(1);
  }

  let gradeA = 0, gradeB = 0, gradeC = 0, gradeD = 0;
  const gradeBList = [];

  lessons.forEach(l => {
    const score = l.quality_score || 0;
    let grade = "A";
    if (score < 50) grade = "D";
    else if (score < 70) grade = "C";
    else if (score < 85) grade = "B";

    if (grade === "A") gradeA++;
    else if (grade === "B") {
      gradeB++;
      gradeBList.push({ slug: l.slug, title: l.title, score });
    }
    else if (grade === "C") gradeC++;
    else if (grade === "D") gradeD++;
  });

  console.log(`Grade A: ${gradeA}`);
  console.log(`Grade B: ${gradeB}`);
  console.log(`Grade C: ${gradeC}`);
  console.log(`Grade D: ${gradeD}`);
  console.log(`Total Grade B Count: ${gradeBList.length}`);
}

countGrades();
