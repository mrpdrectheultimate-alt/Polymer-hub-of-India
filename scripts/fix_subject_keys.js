const fs = require('fs');
let code = fs.readFileSync('scripts/generate_all_batch4_content.js', 'utf8');
code = code.split('SUBJECT_IDS["Plastics Entrepreneurship & Plant Setup"]').join('SUBJECT_IDS["Entrepreneurship in Plastics"]');
code = code.split('SUBJECT_IDS["Medical Plastics"]').join('SUBJECT_IDS["Medical Plastics & Biomaterials"]');
code = code.split('SUBJECT_IDS["Polymer Additives & Compounding"]').join('SUBJECT_IDS["Additives & Compounding"]');
code = code.split('SUBJECT_IDS["Plastic Packaging"]').join('SUBJECT_IDS["Plastic Packaging Engineering"]');
fs.writeFileSync('scripts/generate_all_batch4_content.js', code);
console.log('Successfully updated all lesson subject_id keys in generate_all_batch4_content.js!');
