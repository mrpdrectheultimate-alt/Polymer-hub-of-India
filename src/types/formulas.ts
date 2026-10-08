// src/types/formulas.ts — PolymerHub Formula Library TypeScript Interfaces

export type FormulaType =
  | 'T1'  // Definition / Identity
  | 'T2'  // Thermodynamics
  | 'T3'  // Kinetics / Rate
  | 'T4'  // Rheology / Flow
  | 'T5'  // Processing / Machine
  | 'T6'  // Mechanics / Strength
  | 'T7'  // Transport / Barrier
  | 'T8'  // Composites
  | 'T9'  // Testing / Standards
  | 'T10' // Statistics / Quality
  | 'T11' // Sustainability / LCA
  | 'T12' // Control / Automation

export type FormulaDifficulty = 'foundation' | 'intermediate' | 'advanced' | 'research'

export interface FormulaVariable {
  symbol: string
  meaning: string
  unit: string
  dimension: string
  required: boolean
  example_value?: string
  min?: number
  max?: number
  step?: number
  default_num?: number
}

export interface FormulaExample {
  title: string
  problem_statement: string
  given_values: Record<string, string>
  steps: string[]
  final_answer: string
  unit: string
  engineering_interpretation: string
  difficulty: FormulaDifficulty
}

export interface FormulaSource {
  source_type: 'standard' | 'textbook' | 'paper' | 'handbook'
  title: string
  author: string
  publisher: string
  edition: string
  year: number
  page: string
  isbn?: string
  doi?: string
  verified_at: string
}

export interface LessonLink {
  lesson_id: string
  lesson_name: string
  relationship: 'introduced' | 'used' | 'derived' | 'applied'
  section_ref?: string
}

export interface ToolLink {
  tool_id: string
  tool_name: string
  tool_url: string
}

export interface FormulaCalcInput {
  symbol: string
  name: string
  unit: string
  defaultVal: number
  min: number
  max: number
  step: number
}

export interface FormulaCalcConfig {
  inputs: FormulaCalcInput[]
  calculate: (inputs: Record<string, number>) => {
    value: number
    formatted: string
    unit: string
    status?: 'normal' | 'warning' | 'critical'
    note?: string
  }
}

export interface Formula {
  // Identity
  formula_id: string          // e.g. "PH-FORM-CHEM-001"
  slug: string                // e.g. "carothers-equation-step-growth"
  name: string                // e.g. "Carothers Equation (Step-Growth)"
  short_name: string          // e.g. "Carothers Equation"

  // Classification
  subject_id: string          // e.g. "polymer-chemistry"
  subject_name: string        // e.g. "Polymer Chemistry"
  category: string            // e.g. "Polymerization Kinetics"
  type_code: FormulaType
  type_label: string
  difficulty: FormulaDifficulty
  is_gate: boolean
  is_shopfloor: boolean

  // Mathematical Content
  equation_latex: string      // "X_n = \\frac{2}{2 - p \\cdot f_{avg}}"
  equation_display: string    // "Xn = 2 / (2 - p * favg)"

  // Educational Content
  description: string
  when_to_use: string
  assumptions: string[]
  common_mistakes: string[]

  // Variables
  variables: FormulaVariable[]

  // Worked Examples
  examples: FormulaExample[]

  // Relationships & Links
  related_ids: string[]
  lesson_links: LessonLink[]
  tool_links: ToolLink[]

  // Interactive Solver Config (if applicable)
  calc_config?: FormulaCalcConfig

  // Sources & Verification
  sources: FormulaSource[]

  // Metadata
  status: 'draft' | 'reviewed' | 'published' | 'deprecated'
  verified_at: string
  reviewed_by: string
}
