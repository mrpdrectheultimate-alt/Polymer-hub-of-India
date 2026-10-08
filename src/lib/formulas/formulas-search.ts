// src/lib/formulas/formulas-search.ts — Search, Indexing, and Filtering Engine for Formula Library
import { Formula, FormulaType, FormulaDifficulty } from '@/types/formulas'
import { MASTER_CANONICAL_FORMULAS } from './formulas-data'

export interface SearchFilterOptions {
  query?: string
  subjectId?: string
  typeCode?: FormulaType | 'ALL'
  difficulty?: FormulaDifficulty | 'ALL'
  isGateOnly?: boolean
  isShopfloorOnly?: boolean
}

export function filterFormulas(options: SearchFilterOptions): Formula[] {
  const {
    query = '',
    subjectId = 'all',
    typeCode = 'ALL',
    difficulty = 'ALL',
    isGateOnly = false,
    isShopfloorOnly = false
  } = options

  const cleanQuery = query.trim().toLowerCase()

  return MASTER_CANONICAL_FORMULAS.filter((formula) => {
    // 1. Text & Symbol Match
    if (cleanQuery) {
      const matchName = formula.name.toLowerCase().includes(cleanQuery)
      const matchShortName = formula.short_name.toLowerCase().includes(cleanQuery)
      const matchLatex = formula.equation_latex.toLowerCase().includes(cleanQuery)
      const matchDisplay = formula.equation_display.toLowerCase().includes(cleanQuery)
      const matchDesc = formula.description.toLowerCase().includes(cleanQuery)
      const matchWhen = formula.when_to_use.toLowerCase().includes(cleanQuery)
      const matchId = formula.formula_id.toLowerCase().includes(cleanQuery)
      const matchVarSymbol = formula.variables.some((v) => v.symbol.toLowerCase().includes(cleanQuery))
      const matchVarMeaning = formula.variables.some((v) => v.meaning.toLowerCase().includes(cleanQuery))

      const matchesText =
        matchName ||
        matchShortName ||
        matchLatex ||
        matchDisplay ||
        matchDesc ||
        matchWhen ||
        matchId ||
        matchVarSymbol ||
        matchVarMeaning

      if (!matchesText) return false
    }

    // 2. Subject Filter
    if (subjectId !== 'all' && formula.subject_id !== subjectId) {
      return false
    }

    // 3. Type Filter T1-T12
    if (typeCode !== 'ALL' && formula.type_code !== typeCode) {
      return false
    }

    // 4. Difficulty Filter
    if (difficulty !== 'ALL' && formula.difficulty !== difficulty) {
      return false
    }

    // 5. GATE Only Filter
    if (isGateOnly && !formula.is_gate) {
      return false
    }

    // 6. Shopfloor Only Filter
    if (isShopfloorOnly && !formula.is_shopfloor) {
      return false
    }

    return true
  })
}

export function getFormulaBySlug(slug: string): Formula | undefined {
  return MASTER_CANONICAL_FORMULAS.find((f) => f.slug === slug || f.formula_id === slug)
}

export function getFormulasBySubject(subjectId: string): Formula[] {
  if (subjectId === 'all') return MASTER_CANONICAL_FORMULAS
  return MASTER_CANONICAL_FORMULAS.filter((f) => f.subject_id === subjectId)
}
