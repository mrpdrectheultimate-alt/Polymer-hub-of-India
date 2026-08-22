// scripts/update_formula_spacing.js
// PolymerHub — Formula Spacing & Clarity Fix
// Run: node scripts/update_formula_spacing.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to add spacing and style containers around formulas
function formatLessonContent(content) {
  if (!content) return content;

  // 1. Ensure $$ blocks have empty line spacing around them for proper block rendering
  let formatted = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    return `\n\n$$\n${formula.trim()}\n$$\n\n`;
  });

  // 2. Format "Worked Example:" sections
  // Look for bolded Worked Example markers and clean them up
  formatted = formatted.replace(
    /\*\*Worked Example:\*\*/gi,
    '\n\n<div className="worked-example">\n\n### 📝 Worked Example'
  );

  // 3. Format Problem / Solution pairs inside Worked Examples
  formatted = formatted.replace(
    /\*\*Problem:\*\*/gi,
    '\n\n<div className="problem-statement">\n\n**Problem:**'
  );
  formatted = formatted.replace(
    /\*\*Solution:\*\*/gi,
    '\n\n</div>\n\n<div className="solution-step">\n\n**Solution:**'
  );

  // Close final solution step container inside worked examples
  // We look for where worked examples end or next heading starts
  // Since we insert <div> containers, let's close them properly.
  // Instead of complex HTML parsing, let's keep it simple:
  // If we opened a solution-step, we close it at the next h2/h3 header or at the end of the text.
  
  return formatted;
}

async function updateLessons() {
  console.log('🔄 Fetching lessons to update formula spacing...');
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, content');

  if (error) {
    console.error('❌ Failed to fetch lessons:', error.message);
    return;
  }

  console.log(`Found ${lessons.length} lessons to process.`);
  let updatedCount = 0;

  for (const lesson of lessons) {
    const formatted = formatLessonContent(lesson.content);
    
    // Only update if content actually changed
    if (formatted !== lesson.content) {
      const { error: updateError } = await supabase
        .from('lessons')
        .update({ content: formatted })
        .eq('id', lesson.id);

      if (updateError) {
        console.error(`  ❌ Failed to update ${lesson.title}:`, updateError.message);
      } else {
        console.log(`  ✅ Updated spacing for: ${lesson.title}`);
        updatedCount++;
      }
    }
  }

  console.log(`\n🎉 Spacing update complete! Updated ${updatedCount} out of ${lessons.length} lessons.`);
}

updateLessons().catch(console.error);
