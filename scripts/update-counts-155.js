const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const subjectLessons = {
  'polymer-chemistry': 9,
  'polymer-processing': 14,
  'mould-design': 9,
  'polymer-testing': 10,
  'rubber-technology': 9,
  'recycling-technology': 8,
  'sustainable-plastics': 16,
  'polymer-composites': 13,
  'entrepreneurship-plastics': 11,
  'medical-plastics': 9,
  'additives-compounding': 11,
  'plastic-packaging-engineering': 11,
  'life-cycle-assessment': 8,
  'color-science-masterbatches': 8,
  'polymer-rheology': 9
};

function updateSubjectsArray(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [slug, count] of Object.entries(subjectLessons)) {
    const regex = new RegExp(`(slug:\\s*['"]${slug}['"][\\s\\S]*?lessons:\\s*)(\\d+)`, 'g');
    content = content.replace(regex, (match, p1, p2) => {
      console.log(`  Updating ${slug} lessons: ${p2} -> ${count} in ${path.basename(filePath)}`);
      return p1 + count;
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated subject counts in ${filePath}`);
  } else {
    console.log(`No changes made to subject counts in ${filePath}`);
  }
}

function updateGeneralReplacements() {
  const replacements = [
    {
      file: 'src/app/page.tsx',
      changes: [
        { from: '60 world-class lessons', to: '155 world-class lessons' },
        { from: "value: '102'", to: "value: '155'" },
        { from: '15 Subjects · 102 Lessons', to: '15 Subjects · 155 Lessons' },
        { from: 'across all 102 lessons', to: 'across all 155 lessons' }
      ]
    },
    {
      file: 'src/app/subjects/page.tsx',
      changes: [
        { from: '15 Subjects · 102 Lessons', to: '15 Subjects · 155 Lessons' },
        { from: 'grounded in all 102 lessons', to: 'grounded in all 155 lessons' }
      ]
    },
    {
      file: 'src/app/ai-tutor/page.tsx',
      changes: [
        { from: 'Grounded in your 102 lessons', to: 'Grounded in your 155 lessons' },
        { from: 'all 102 lessons', to: 'all 155 lessons' },
        { from: "{ label: '102 Lessons'", to: "{ label: '155 Lessons'" },
        { from: 'grounded in your 102 lessons', to: 'grounded in your 155 lessons' }
      ]
    },
    {
      file: 'src/app/dashboard/page.tsx',
      changes: [
        { from: 'All 102 lessons', to: 'All 155 lessons' }
      ]
    },
    {
      file: 'src/app/gate-mock/page.tsx',
      changes: [
        { from: 'mapped to 102 lessons', to: 'mapped to 155 lessons' }
      ]
    },
    {
      file: 'src/app/lessons/[slug]/page.tsx',
      changes: [
        { from: 'Unlock all 102 lessons', to: 'Unlock all 155 lessons' }
      ]
    },
    {
      file: 'src/app/payment/success/page.tsx',
      changes: [
        { from: 'All 102 lessons', to: 'All 155 lessons' }
      ]
    },
    {
      file: 'src/app/resources/page.tsx',
      changes: [
        { from: 'across 102 lessons', to: 'across 155 lessons' }
      ]
    },
    {
      file: 'src/app/practice/page.tsx',
      changes: [
        { from: 'ACROSS ALL 10 SUBJECTS.', to: 'ACROSS ALL 15 SUBJECTS.' },
        { from: "{ val: '10', label: 'Subjects'", to: "{ val: '15', label: 'Subjects'" }
      ]
    },
    {
      file: 'src/components/Navbar.tsx',
      changes: [
        { from: '15 subjects · 102 lessons', to: '15 subjects · 155 lessons' }
      ]
    },
    {
      file: 'src/app/layout.tsx',
      changes: [
        { from: "numberOfItems: 10", to: "numberOfItems: 15" },
        { from: "numberOfCredits: 60", to: "numberOfCredits: 155" },
        { from: "courseWorkload: 'PT60H'", to: "courseWorkload: 'PT155H'" },
        { from: "60 world-class lessons across 15 subjects", to: "155 world-class lessons across 15 subjects" }
      ]
    },
    {
      file: 'src/lib/seo.ts',
      changes: [
        { from: '102 lessons, AI Tutor', to: '155 lessons, AI Tutor' },
        { from: '60 world-class lessons.', to: '155 world-class lessons.' },
        { from: '60 world-class lessons across 10 PPE subjects', to: '155 world-class lessons across 15 PPE subjects' },
        { from: 'across all 10 PPE subjects', to: 'across all 15 subjects' },
        { from: 'all 102 PolymerHub lessons', to: 'all 155 PolymerHub lessons' },
        { from: 'all 102 lessons', to: 'all 155 lessons' },
        { from: 'Unlock all 102 lessons', to: 'Unlock all 155 lessons' },
        { from: '102 lessons total', to: '155 lessons total' },
        { from: '6 world-class lessons', to: 'complete lessons' }
      ]
    }
  ];

  replacements.forEach(entry => {
    const filePath = path.join(projectRoot, entry.file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    entry.changes.forEach(change => {
      const parts = content.split(change.from);
      if (parts.length > 1) {
        console.log(`  Replacing in ${entry.file}: "${change.from}" -> "${change.to}" (${parts.length - 1} occurrences)`);
        content = parts.join(change.to);
      }
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully updated general replacements in ${filePath}`);
    } else {
      console.log(`No general changes made in ${filePath}`);
    }
  });
}

console.log('=== RUNNING CURRICULUM COUNT UPDATE SCRIPT ===');
updateSubjectsArray(path.join(projectRoot, 'src/app/page.tsx'));
updateSubjectsArray(path.join(projectRoot, 'src/app/subjects/page.tsx'));
updateGeneralReplacements();
console.log('=== CURRICULUM COUNT UPDATE SCRIPT COMPLETE ===');
