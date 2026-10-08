// src/lib/formulas/katex-config.ts — Safe KaTeX Math Rendering Configuration & Accessibility Utility
import katex from 'katex'
import { Formula } from '@/types/formulas'

export function renderFormulaLatex(latex: string, displayMode: boolean = true): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#EF4444',
      strict: false,
      trust: true,
      macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
      },
    })
  } catch (err) {
    console.error('KaTeX rendering error:', err)
    return `<span className="font-mono text-amber-300 font-bold">${latex}</span>`
  }
}

export function getFormulaAccessibleLabel(formula: Formula): string {
  const variableList = formula.variables
    .map((v) => `${v.symbol} represents ${v.meaning} in ${v.unit}`)
    .join(', ')
  return `Formula: ${formula.name}. Equation: ${formula.equation_display}. Where ${variableList}.`
}
