// scripts/test_katex_formulas.mjs
import katex from 'katex'
import { MASTER_CANONICAL_FORMULAS } from '../src/lib/formulas/formulas-data'

console.log(`Checking ${MASTER_CANONICAL_FORMULAS.length} formulas for KaTeX syntax...`)

let errors = 0
for (const f of MASTER_CANONICAL_FORMULAS) {
  try {
    katex.renderToString(f.equation_latex, {
      displayMode: true,
      throwOnError: true,
      strict: false,
      trust: true,
      macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
      }
    })
  } catch (err) {
    console.error(`❌ KaTeX error in ${f.formula_id} (${f.name}):`, err.message)
    console.error(`   LaTeX: ${f.equation_latex}`)
    errors++
  }
}

if (errors === 0) {
  console.log(`✅ All ${MASTER_CANONICAL_FORMULAS.length} formulas passed KaTeX rendering with 0 errors!`)
} else {
  console.error(`❌ Found ${errors} KaTeX errors!`)
  process.exit(1)
}
