// scripts/build_100pct_deep_library.mjs — Fills every single Class A chapter to 400+ words
import fs from 'fs'

function makeChapter(title, sec1Title, sec1Content, formula, sec2Title, sec2Content, tableHeaders, tableRows, problemStmt, solutionSteps, exQ, exAns) {
  let tableMd = ''
  if (tableHeaders && tableRows) {
    tableMd = `\n| ${tableHeaders.join(' | ')} |\n|${tableHeaders.map(() => '---').join('|')}|\n`
    tableRows.forEach(row => {
      tableMd += `| ${row.join(' | ')} |\n`
    })
  }

  let formulaMd = formula ? `\n$$\n${formula}\n$$\n` : ''

  return `# ${title}

## 1. ${sec1Title}
${sec1Content}

---

## 2. ${sec2Title}
${sec2Content}
${formulaMd}
${tableMd}
---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
${problemStmt}

### 💡 Step-by-Step Mathematical Solution
${solutionSteps}

---

## 4. Practical Engineering Exercises & Case Studies

### ❓ Exercise Questions
**Question:** ${exQ}
**Answer & Rationale:** ${exAns}
`
}

console.log('Generating complete deep library dataset...')
