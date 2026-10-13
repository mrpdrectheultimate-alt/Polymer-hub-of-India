import 'katex/dist/katex.min.css'
import { Formula } from '@/types/formulas'
import { renderFormula, validateLatex } from './latex-utils'

export { renderFormula, validateLatex }

export function renderFormulaLatex(latex: string, displayMode: boolean = true): string {
  return renderFormula(latex, displayMode)
}

export function getFormulaAccessibleLabel(formula: Formula): string {
  const variableList = formula.variables
    .map((v) => `${v.symbol} represents ${v.meaning} in ${v.unit}`)
    .join(', ')
  return `Formula: ${formula.name}. Equation: ${formula.equation_display}. Where ${variableList}.`
}
