// scripts/apply_full_class_a_expansion.mjs
import fs from 'fs';

// Import expanded chapter maps
import { COMPOUNDING_EXPANDED } from './generate_compounding_chapters.mjs';
import { DEFECT_MASTERY_EXPANDED } from './generate_defect_mastery_chapters.mjs';
import { TESTING_EXPANDED } from './generate_testing_chapters.mjs';
import { CHEMISTRY_EXPANDED } from './generate_chemistry_chapters.mjs';

// Read existing library_data.ts
const filePath = 'src/lib/library_data.ts';
let code = fs.readFileSync(filePath, 'utf-8');

// Function to construct a formatted TS Record object string
function formatRecordString(constName, chaptersObj) {
  let res = `const ${constName}: Record<string, string> = {\n`;
  const keys = Object.keys(chaptersObj);
  keys.forEach((key, index) => {
    const val = chaptersObj[key];
    res += `  ${key}: ${JSON.stringify(val)}`;
    if (index < keys.length - 1) {
      res += ',\n';
    } else {
      res += '\n';
    }
  });
  res += `}\n`;
  return res;
}

// 1. Rheology Guide: ch1-ch3 kept as is, ch4-ch7 expanded
// We need to parse existing RHEOLOGY_CHAPTERS from library_data.ts or import them
// Let's import ALL_LIBRARY_BOOKS to get existing ch1, ch2, ch3 for Rheology, Defect Mastery ch1, Chemistry ch1
import { ALL_LIBRARY_BOOKS } from '../src/lib/library_data.ts';

const rheologyBook = ALL_LIBRARY_BOOKS.find(b => b.slug === 'polymer-rheology-guide');
const compoundingBook = ALL_LIBRARY_BOOKS.find(b => b.slug === 'compounding-additives-handbook');
const defectBook = ALL_LIBRARY_BOOKS.find(b => b.slug === 'injection-moulding-defect-mastery');
const testingBook = ALL_LIBRARY_BOOKS.find(b => b.slug === 'polymer-characterization-testing-guide');
const chemistryBook = ALL_LIBRARY_BOOKS.find(b => b.slug === 'polymer-chemistry-synthesis-handbook');

// Re-import the manual rheology chapters from build_rheology.mjs
import { RHEOLOGY_EXPANDED } from './test_rheology_expansion.mjs';

const FULL_RHEOLOGY = {
  ch1: rheologyBook.chapters.ch1,
  ch2: rheologyBook.chapters.ch2,
  ch3: rheologyBook.chapters.ch3,
  ch4: RHEOLOGY_EXPANDED.ch4,
  ch5: RHEOLOGY_EXPANDED.ch5,
  ch6: RHEOLOGY_EXPANDED.ch6,
  ch7: RHEOLOGY_EXPANDED.ch7
};

const FULL_COMPOUNDING = COMPOUNDING_EXPANDED;

const FULL_DEFECT_MASTERY = {
  ch1: defectBook.chapters.ch1,
  ch2: DEFECT_MASTERY_EXPANDED.ch2,
  ch3: DEFECT_MASTERY_EXPANDED.ch3,
  ch4: DEFECT_MASTERY_EXPANDED.ch4,
  ch5: DEFECT_MASTERY_EXPANDED.ch5,
  ch6: DEFECT_MASTERY_EXPANDED.ch6
};

const FULL_TESTING = TESTING_EXPANDED;

const FULL_CHEMISTRY = {
  ch1: chemistryBook.chapters.ch1,
  ch2: CHEMISTRY_EXPANDED.ch2,
  ch3: CHEMISTRY_EXPANDED.ch3,
  ch4: CHEMISTRY_EXPANDED.ch4,
  ch5: CHEMISTRY_EXPANDED.ch5
};

console.log('Replacing 5 Class A constant declarations in library_data.ts...');

// Replace RHEOLOGY_CHAPTERS block
const rheologyStr = formatRecordString('RHEOLOGY_CHAPTERS', FULL_RHEOLOGY);
const rheologyRegex = /const RHEOLOGY_CHAPTERS: Record<string, string> = \{[\s\S]*?\n\}/;
if (!rheologyRegex.test(code)) throw new Error('Could not find RHEOLOGY_CHAPTERS block in library_data.ts');
code = code.replace(rheologyRegex, rheologyStr.trim());

// Replace COMPOUNDING_CHAPTERS block
const compoundingStr = formatRecordString('COMPOUNDING_CHAPTERS', FULL_COMPOUNDING);
const compoundingRegex = /const COMPOUNDING_CHAPTERS: Record<string, string> = \{[\s\S]*?\n\}/;
if (!compoundingRegex.test(code)) throw new Error('Could not find COMPOUNDING_CHAPTERS block in library_data.ts');
code = code.replace(compoundingRegex, compoundingStr.trim());

// Replace DEFECT_MASTERY_CHAPTERS block
const defectRegex = /const DEFECT_MASTERY_CHAPTERS: Record<string, string> = \{[\s\S]*?\n\}/;
const defectStr = formatRecordString('DEFECT_MASTERY_CHAPTERS', FULL_DEFECT_MASTERY);
if (!defectRegex.test(code)) throw new Error('Could not find DEFECT_MASTERY_CHAPTERS block in library_data.ts');
code = code.replace(defectRegex, defectStr.trim());

// Replace TESTING_CHAPTERS block
const testingRegex = /const TESTING_CHAPTERS: Record<string, string> = \{[\s\S]*?\n\}/;
const testingStr = formatRecordString('TESTING_CHAPTERS', FULL_TESTING);
if (!testingRegex.test(code)) throw new Error('Could not find TESTING_CHAPTERS block in library_data.ts');
code = code.replace(testingRegex, testingStr.trim());

// Replace CHEMISTRY_CHAPTERS block
const chemistryRegex = /const CHEMISTRY_CHAPTERS: Record<string, string> = \{[\s\S]*?\n\}/;
const chemistryStr = formatRecordString('CHEMISTRY_CHAPTERS', FULL_CHEMISTRY);
if (!chemistryRegex.test(code)) throw new Error('Could not find CHEMISTRY_CHAPTERS block in library_data.ts');
code = code.replace(chemistryRegex, chemistryStr.trim());

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated library_data.ts with 100% full Class A expanded content depth!');
