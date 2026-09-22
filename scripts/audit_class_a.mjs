import { ALL_LIBRARY_BOOKS } from '../src/lib/library_data.ts';

ALL_LIBRARY_BOOKS.filter(b => b.legal_class === 'Class A').forEach(b => {
  console.log(`\n=== ${b.title} (${b.slug}) ===`);
  Object.entries(b.chapters || {}).forEach(([ch, content]) => {
    const words = content.split(/\s+/).length;
    const status = words >= 300 ? '✅ EXCELLENT (>300 words)' : words >= 150 ? '⚠️ PASSABLE (>150 words)' : '❌ STUB (<150 words)';
    console.log(`  ${ch}: ${words} words -> ${status}`);
  });
});
