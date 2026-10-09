// src/lib/formulas/formulas-data.ts — Master Canonical Polymer Engineering Formula Knowledge Base
import { Formula } from '@/types/formulas'

export const MASTER_CANONICAL_FORMULAS: Formula[] = [
  // ==================== 1. POLYMER CHEMISTRY ====================
  {
    formula_id: 'PH-FORM-CHEM-001',
    slug: 'carothers-equation-step-growth',
    name: 'Carothers Equation (Step-Growth Polymerization)',
    short_name: 'Carothers Equation',
    subject_id: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    category: 'Polymerization Kinetics',
    type_code: 'T3',
    type_label: 'Kinetics / Rate',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: 'X_n = \\frac{2}{2 - p \\cdot f_{avg}}',
    equation_display: 'Xn = 2 / (2 - p * favg)',
    description: 'Calculates the number-average degree of polymerization (Xn) for step-growth condensation polymerizations as a function of extent of reaction (p) and average monomer functionality (f_avg).',
    when_to_use: 'Use when modeling step-growth condensation systems (polyesters, polyamides, polyurethane) to predict molecular weight growth and gelation onset.',
    assumptions: [
      'Equal reactivity of functional groups regardless of chain length',
      'No intramolecular cyclization or side reactions',
      'Stoichiometric balance between reactive groups'
    ],
    common_mistakes: [
      'Confusing extent of reaction p with percentage (must be decimal 0.99, not 99%)',
      'Applying to chain-growth addition polymerization systems',
      'Ignoring stoichiometric imbalance (r < 1.0 requires modified Carothers form)'
    ],
    variables: [
      { symbol: 'X_n', meaning: 'Number average degree of polymerization', unit: 'dimensionless', dimension: 'dimensionless', required: true },
      { symbol: 'p', meaning: 'Extent of reaction (fraction conversion)', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.99', min: 0.90, max: 0.999, step: 0.001, default_num: 0.99 },
      { symbol: 'f_{avg}', meaning: 'Average functionality of monomers', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '2.0', min: 1.5, max: 4.0, step: 0.05, default_num: 2.0 }
    ],
    examples: [
      {
        title: 'Nylon 6,6 Polymerization at 99% Conversion',
        problem_statement: 'For a bifunctional step-growth monomer system (f_avg = 2.0) producing Nylon 6,6, calculate the degree of polymerization Xn when 99% of carboxyl groups have reacted (p = 0.99).',
        given_values: { 'f_avg': '2.0', 'p': '0.99' },
        steps: [
          'Identify Carothers Equation: Xn = 2 / (2 - p * f_avg)',
          'Substitute values: Xn = 2 / (2 - 0.99 * 2.0)',
          'Calculate denominator: 2 - 1.98 = 0.02',
          'Calculate Xn: 2 / 0.02 = 100'
        ],
        final_answer: 'Xn = 100',
        unit: 'repeat units',
        engineering_interpretation: 'At 99% conversion, average polymer chain length is 100 repeat units (Mn approx 22,600 g/mol), illustrating why step-growth requires >99% conversion for useful mechanical properties.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'p', name: 'Extent of Reaction (p)', unit: 'fraction (0.9-0.999)', defaultVal: 0.99, min: 0.90, max: 0.999, step: 0.001 },
        { symbol: 'favg', name: 'Average Functionality (f_avg)', unit: 'dimensionless', defaultVal: 2.0, min: 1.8, max: 3.5, step: 0.05 }
      ],
      calculate: (inputs) => {
        const p = inputs.p || 0.99
        const favg = inputs.favg || 2.0
        const denom = 2 - p * favg
        if (denom <= 0) {
          return { value: 0, formatted: 'Gelation Point Exceeded (Gel Network Formed)', unit: 'Xn', status: 'critical', note: 'System has passed gel point Pc = 2/favg.' }
        }
        const xn = 2 / denom
        return {
          value: Math.round(xn * 10) / 10,
          formatted: `${Math.round(xn * 10) / 10} repeat units`,
          unit: 'Xn',
          status: xn < 50 ? 'warning' : 'normal',
          note: xn < 50 ? 'Low degree of polymerization — weak mechanical strength.' : 'Optimal engineering polymer molecular weight range.'
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-002', 'PH-FORM-CHEM-003'],
    lesson_links: [
      { lesson_id: 'step-growth-polymerization-kinetics-and-carothers-equation', lesson_name: 'Step-Growth Polymerization Kinetics & Carothers Equation', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Principles of Polymerization', author: 'George Odian', publisher: 'Wiley-Interscience', edition: '4th Edition', year: 2004, page: '40-45', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },
  {
    formula_id: 'PH-FORM-CHEM-002',
    slug: 'mayo-lewis-copolymerization-equation',
    name: 'Mayo-Lewis Copolymerization Equation',
    short_name: 'Mayo-Lewis Equation',
    subject_id: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    category: 'Copolymerization',
    type_code: 'T3',
    type_label: 'Kinetics / Rate',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\\frac{d[M_1]}{d[M_2]} = \\frac{[M_1]}{[M_2]} \\cdot \\frac{r_1 [M_1] + [M_2]}{r_2 [M_2] + [M_1]}',
    equation_display: 'd[M1]/d[M2] = ([M1]/[M2]) * (r1*[M1] + [M2]) / (r2*[M2] + [M1])',
    description: 'Relates the instantaneous copolymer composition ratio (d[M1]/d[M2]) to monomer feed ratio ([M1]/[M2]) and reactivity ratios (r1, r2).',
    when_to_use: 'Use when synthesizing commercial copolymers (SAN, SBR, NBR, ABS) to predict copolymer composition drift and azeotropic feed composition.',
    assumptions: [
      'Terminal radical reactivity model applies',
      'Steady-state radical concentrations',
      'High molecular weight long-chain approximation'
    ],
    common_mistakes: [
      'Inverting monomer reactivity ratios r1 and r2',
      'Assuming feed composition remains constant during batch reactions without continuous feeding'
    ],
    variables: [
      { symbol: 'd[M_1]/d[M_2]', meaning: 'Ratio of monomers in copolymer', unit: 'molar ratio', dimension: 'dimensionless', required: true },
      { symbol: '[M_1]/[M_2]', meaning: 'Ratio of monomers in feed', unit: 'molar ratio', dimension: 'dimensionless', required: true, example_value: '1.0', min: 0.1, max: 10, step: 0.1, default_num: 1.0 },
      { symbol: 'r_1', meaning: 'Reactivity ratio for Monomer 1', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.41', min: 0.01, max: 10, step: 0.05, default_num: 0.41 },
      { symbol: 'r_2', meaning: 'Reactivity ratio for Monomer 2', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.04', min: 0.01, max: 10, step: 0.05, default_num: 0.04 }
    ],
    examples: [
      {
        title: 'Styrene-Acrylonitrile (SAN) Instantaneous Copolymer Composition',
        problem_statement: 'Styrene (M1) and Acrylonitrile (M2) are copolymerized with a feed ratio [M1]/[M2] = 1.0 (50 mol% Styrene feed). Given r1 = 0.41 and r2 = 0.04, calculate the instantaneous copolymer composition ratio.',
        given_values: { '[M1]/[M2]': '1.0', 'r1': '0.41', 'r2': '0.04' },
        steps: [
          'Apply Mayo-Lewis: d[M1]/d[M2] = 1.0 * (0.41*1.0 + 1.0) / (0.04*1.0 + 1.0)',
          'Numerator = 1.41',
          'Denominator = 1.04',
          'Calculate ratio: 1.41 / 1.04 = 1.355'
        ],
        final_answer: 'd[M1]/d[M2] = 1.355 (57.5 mol% Styrene, 42.5 mol% AN)',
        unit: 'molar ratio',
        engineering_interpretation: 'The polymer is enriched in Styrene relative to feed, necessitating continuous monomer feeding in industrial SAN manufacturing to avoid compositional haze.',
        difficulty: 'advanced'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'feedRatio', name: 'Feed Ratio [M1]/[M2]', unit: 'ratio', defaultVal: 1.0, min: 0.1, max: 10.0, step: 0.1 },
        { symbol: 'r1', name: 'Reactivity Ratio r1', unit: 'dimensionless', defaultVal: 0.41, min: 0.01, max: 5.0, step: 0.05 },
        { symbol: 'r2', name: 'Reactivity Ratio r2', unit: 'dimensionless', defaultVal: 0.04, min: 0.01, max: 5.0, step: 0.05 }
      ],
      calculate: (inputs) => {
        const f = inputs.feedRatio || 1.0
        const r1 = inputs.r1 || 0.41
        const r2 = inputs.r2 || 0.04
        const ratio = f * ((r1 * f + 1) / (r2 + f))
        const mol1 = (ratio / (1 + ratio)) * 100
        return {
          value: Math.round(ratio * 100) / 100,
          formatted: `Ratio ${Math.round(ratio * 100) / 100} : 1 (${Math.round(mol1 * 10) / 10}% M1)`,
          unit: 'molar ratio',
          note: 'Calculates instantaneous polymer chain composition.'
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-001'],
    lesson_links: [
      { lesson_id: 'copolymerization-kinetics-and-mayo-lewis-equation', lesson_name: 'Copolymerization Kinetics & Mayo-Lewis Equation', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Principles of Polymerization', author: 'George Odian', publisher: 'Wiley-Interscience', edition: '4th Edition', year: 2004, page: '135-142', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },
  {
    formula_id: 'PH-FORM-CHEM-003',
    slug: 'fox-equation-copolymer-tg',
    name: 'Fox Equation (Copolymer & Blend Tg)',
    short_name: 'Fox Equation',
    subject_id: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    category: 'Thermodynamics & Morphology',
    type_code: 'T2',
    type_label: 'Thermodynamics',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\\frac{1}{T_g} = \\frac{w_1}{T_{g1}} + \\frac{w_2}{T_{g2}}',
    equation_display: '1/Tg = (w1/Tg1) + (w2/Tg2)',
    description: 'Predicts the glass transition temperature (Tg in Kelvin) of miscible polymer blends or random copolymers based on mass fractions (w1, w2) and homopolymer Tgs.',
    when_to_use: 'Use when compounding miscible polymer blends or formulating plasticized PVC to calculate resulting Tg.',
    assumptions: [
      'Complete thermodynamic miscibility / single amorphous phase',
      'Additivity of free volume',
      'Temperatures expressed in Kelvin (K)'
    ],
    common_mistakes: [
      'Entering temperatures in Celsius instead of Kelvin',
      'Applying to immiscible phase-separated polymer blends'
    ],
    variables: [
      { symbol: 'T_g', meaning: 'Glass transition temperature of blend/copolymer', unit: 'K (°C)', dimension: 'Temperature', required: true },
      { symbol: 'w_1', meaning: 'Weight fraction of Component 1', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.70', min: 0.0, max: 1.0, step: 0.05, default_num: 0.70 },
      { symbol: 'T_{g1}', meaning: 'Glass transition of Component 1 in Kelvin', unit: 'K', dimension: 'Temperature', required: true, example_value: '358.15', min: 150, max: 600, step: 5, default_num: 358.15 },
      { symbol: 'w_2', meaning: 'Weight fraction of Component 2', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.30', min: 0.0, max: 1.0, step: 0.05, default_num: 0.30 },
      { symbol: 'T_{g2}', meaning: 'Glass transition of Component 2 in Kelvin', unit: 'K', dimension: 'Temperature', required: true, example_value: '193.15', min: 150, max: 600, step: 5, default_num: 193.15 }
    ],
    examples: [
      {
        title: 'Plasticized PVC Tg Reduction with DOP Plasticizer',
        problem_statement: 'Unplasticized PVC has Tg1 = 85°C (358.15 K). If 30 wt% DOP plasticizer (Tg2 = -80°C = 193.15 K) is compounded into PVC (w1 = 0.70, w2 = 0.30), calculate resulting flexible PVC Tg.',
        given_values: { 'w1': '0.70', 'Tg1': '358.15 K', 'w2': '0.30', 'Tg2': '193.15 K' },
        steps: [
          'Apply Fox Equation: 1/Tg = (0.70 / 358.15) + (0.30 / 193.15)',
          'Compute term 1: 0.70 / 358.15 = 0.0019545 K^-1',
          'Compute term 2: 0.30 / 193.15 = 0.0015532 K^-1',
          'Sum inverses: 1/Tg = 0.0035077 K^-1',
          'Invert to get Tg: Tg = 285.08 K = 11.93°C'
        ],
        final_answer: 'Tg = 11.9°C (285.1 K)',
        unit: '°C',
        engineering_interpretation: 'Adding 30% DOP plasticizer depresses PVC Tg from 85°C down to 11.9°C, converting rigid pipe resin into flexible room-temperature sheet packaging.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'w1', name: 'Weight Fraction Component 1 (w1)', unit: 'fraction', defaultVal: 0.70, min: 0.0, max: 1.0, step: 0.05 },
        { symbol: 'Tg1_C', name: 'Tg Component 1 (°C)', unit: '°C', defaultVal: 85, min: -100, max: 350, step: 5 },
        { symbol: 'Tg2_C', name: 'Tg Component 2 (°C)', unit: '°C', defaultVal: -80, min: -150, max: 350, step: 5 }
      ],
      calculate: (inputs) => {
        const w1 = inputs.w1 ?? 0.70
        const w2 = 1 - w1
        const tg1K = (inputs.Tg1_C ?? 85) + 273.15
        const tg2K = (inputs.Tg2_C ?? -80) + 273.15
        const invTg = w1 / tg1K + w2 / tg2K
        const tgK = 1 / invTg
        const tgC = tgK - 273.15
        return {
          value: Math.round(tgC * 10) / 10,
          formatted: `${Math.round(tgC * 10) / 10} °C (${Math.round(tgK)} K)`,
          unit: '°C',
          note: tgC < 25 ? 'Flexible rubbery behavior at room temperature (25°C).' : 'Rigid glassy state at room temperature (25°C).'
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-001'],
    lesson_links: [
      { lesson_id: 'glass-transition-temperature-tg-and-free-volume-theory', lesson_name: 'Glass Transition Temperature (Tg) & Free Volume Theory', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'paper', title: 'Second-Order Transition Temperatures and Related Properties of Polymers', author: 'T. G. Fox', publisher: 'Bull. Am. Phys. Soc.', edition: '1', year: 1956, page: '123', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 2. POLYMER PROCESSING ====================
  {
    formula_id: 'PH-FORM-PROC-001',
    slug: 'injection-moulding-clamping-tonnage',
    name: 'Injection Mould Clamping Tonnage Formula',
    short_name: 'Clamping Tonnage',
    subject_id: 'polymer-processing',
    subject_name: 'Polymer Processing',
    category: 'Injection Moulding Parameters',
    type_code: 'T5',
    type_label: 'Processing / Machine',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'F_{clamp} = \\frac{P_{cavity} \\cdot A_{projected}}{1000} \\cdot SF',
    equation_display: 'F_clamp (Tonnes) = (P_cavity * A_projected / 1000) * SF',
    description: 'Calculates the minimum machine press clamping force (in Metric Tonnes) to hold mold platens closed against peak cavity hydraulic pressure during injection.',
    when_to_use: 'Use when selecting injection molding machine size (tonnage) for a new tool or multi-cavity layout to prevent flash defects.',
    assumptions: [
      'Uniform average cavity pressure across projected parting area',
      'Rigid mold platens with minimal deflection',
      'Safety factor SF = 1.15 to 1.25'
    ],
    common_mistakes: [
      'Forgetting to include runner and cold slug well area in total projected area',
      'Using peak barrel injection pressure instead of actual in-cavity pressure (cavity pressure is ~40-60% of nozzle pressure)'
    ],
    variables: [
      { symbol: 'F_{clamp}', meaning: 'Required machine clamping force', unit: 'Metric Tonnes', dimension: 'Force', required: true },
      { symbol: 'P_{cavity}', meaning: 'Average peak cavity pressure', unit: 'bar (kg/cm²)', dimension: 'Pressure', required: true, example_value: '450', min: 150, max: 1200, step: 25, default_num: 450 },
      { symbol: 'A_{projected}', meaning: 'Total projected area (cavities + runners)', unit: 'cm²', dimension: 'Area', required: true, example_value: '480', min: 10, max: 5000, step: 10, default_num: 480 },
      { symbol: 'SF', meaning: 'Safety Factor', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '1.15', min: 1.0, max: 1.4, step: 0.05, default_num: 1.15 }
    ],
    examples: [
      {
        title: '4-Cavity Automotive PP Bracket Mold Tonnage',
        problem_statement: 'An injection mold produces 4 polypropylene brackets. Total projected area of 4 cavities + cold runner system = 480 cm². Peak average cavity pressure P = 450 bar. Calculate required machine tonnage with a 15% safety factor.',
        given_values: { 'A_projected': '480 cm²', 'P_cavity': '450 bar', 'Safety Factor (SF)': '1.15' },
        steps: [
          'Calculate unadjusted force: F_base = (450 bar * 480 cm²) / 1000 = 216 Metric Tonnes',
          'Apply safety factor: F_clamp = 216 * 1.15 = 248.4 Metric Tonnes',
          'Select standard press rating: Round up to 250 Tonnes press'
        ],
        final_answer: '250 Metric Tonnes Machine Press',
        unit: 'Metric Tonnes',
        engineering_interpretation: 'A 250T press is required to prevent mold parting line flash during high injection packing rates.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'P_bar', name: 'Cavity Pressure (bar)', unit: 'bar', defaultVal: 450, min: 150, max: 1200, step: 25 },
        { symbol: 'A_cm2', name: 'Projected Area (cm²)', unit: 'cm²', defaultVal: 480, min: 10, max: 5000, step: 10 },
        { symbol: 'SF', name: 'Safety Factor', unit: 'ratio', defaultVal: 1.15, min: 1.0, max: 1.4, step: 0.05 }
      ],
      calculate: (inputs) => {
        const p = inputs.P_bar || 450
        const a = inputs.A_cm2 || 480
        const sf = inputs.SF || 1.15
        const tonnes = (p * a / 1000) * sf
        return {
          value: Math.round(tonnes * 10) / 10,
          formatted: `${Math.round(tonnes)} Tonnes (${Math.round(tonnes * 9.80665)} kN)`,
          unit: 'Tonnes',
          status: tonnes > 650 ? 'warning' : 'normal',
          note: tonnes > 650 ? 'Requires large hydraulic or all-electric toggle press.' : 'Standard mid-size molding machine.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-002', 'PH-FORM-TOOL-001'],
    lesson_links: [
      { lesson_id: 'injection-moulding-process-parameters-and-defects', lesson_name: 'Injection Moulding Process Parameters & Defects', relationship: 'applied' }
    ],
    tool_links: [
      { tool_id: 'tonnage-calc', tool_name: 'Clamping Tonnage Calculator', tool_url: '/calculators' }
    ],
    sources: [
      { source_type: 'textbook', title: 'Injection Molding Handbook', author: 'Dominick Rosato', publisher: 'Springer', edition: '3rd Edition', year: 2000, page: '210-215', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },
  {
    formula_id: 'PH-FORM-PROC-002',
    slug: 'fourier-cooling-time-1d',
    name: '1D Fourier Transient Cooling Time Formula',
    short_name: 'Cooling Time Formula',
    subject_id: 'polymer-processing',
    subject_name: 'Polymer Processing',
    category: 'Thermal Kinetics',
    type_code: 'T5',
    type_label: 'Processing / Machine',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 't_c = \\frac{h^2}{\\pi^2 \\cdot \\alpha} \\ln\\left[ \\frac{8}{\\pi^2} \\cdot \\frac{T_{melt} - T_{mold}}{T_{eject} - T_{mold}} \\right]',
    equation_display: 'tc = (h^2 / (pi^2 * alpha)) * ln((8/pi^2) * ((T_melt - T_mold)/(T_eject - T_mold)))',
    description: 'Calculates the required in-mold cooling time (tc in seconds) for a plastic component center-plane temperature to drop below ejection threshold.',
    when_to_use: 'Use during mold design and cycle time optimization to estimate required cooling time based on wall thickness and thermal diffusivity.',
    assumptions: [
      '1D transient heat conduction through flat plate of uniform wall thickness h',
      'Constant mold wall surface temperature Tw',
      'Constant material thermal diffusivity alpha'
    ],
    common_mistakes: [
      'Cooling time scales with h^2 — doubling wall thickness quadruples cooling time!',
      'Using thermal conductivity k instead of thermal diffusivity alpha'
    ],
    variables: [
      { symbol: 't_c', meaning: 'Cooling time', unit: 'seconds', dimension: 'Time', required: true },
      { symbol: 'h', meaning: 'Part wall thickness', unit: 'mm', dimension: 'Length', required: true, example_value: '2.5', min: 0.5, max: 10.0, step: 0.1, default_num: 2.5 },
      { symbol: '\\alpha', meaning: 'Thermal diffusivity', unit: 'mm²/s', dimension: 'Area/Time', required: true, example_value: '0.085', min: 0.04, max: 0.20, step: 0.005, default_num: 0.085 },
      { symbol: 'T_{melt}', meaning: 'Melt injection temperature', unit: '°C', dimension: 'Temperature', required: true, example_value: '230', min: 140, max: 380, step: 5, default_num: 230 },
      { symbol: 'T_{mold}', meaning: 'Mold wall temperature', unit: '°C', dimension: 'Temperature', required: true, example_value: '40', min: 10, max: 120, step: 5, default_num: 40 },
      { symbol: 'T_{eject}', meaning: 'Ejection temperature', unit: '°C', dimension: 'Temperature', required: true, example_value: '90', min: 40, max: 200, step: 5, default_num: 90 }
    ],
    examples: [
      {
        title: 'Polypropylene Container 3mm Wall Cooling Time',
        problem_statement: 'Calculate in-mold cooling time for a polypropylene container wall (h = 3.0 mm, thermal diffusivity alpha = 0.085 mm²/s) injected at Tm = 230°C into a mold at Tw = 30°C and ejected at Te = 90°C.',
        given_values: { 'h': '3.0 mm', 'alpha': '0.085 mm²/s', 'Tm': '230°C', 'Tw': '30°C', 'Te': '90°C' },
        steps: [
          'Calculate temperature ratio term: (8 / pi^2) * ((230 - 30) / (90 - 30)) = 0.81057 * (200 / 60) = 2.7019',
          'Calculate natural log: ln(2.7019) = 0.9939',
          'Calculate diffusion time factor: h^2 / (pi^2 * alpha) = (3.0)^2 / (9.8696 * 0.085) = 10.728 s',
          'Multiply terms: tc = 10.728 * 0.9939 = 10.66 s'
        ],
        final_answer: 'tc = 10.7 seconds',
        unit: 'seconds',
        engineering_interpretation: 'Cooling time is 10.7s. Thinning the wall to 2.0 mm would reduce cooling time to 4.7s, increasing production output by 56%.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'h_mm', name: 'Wall Thickness (mm)', unit: 'mm', defaultVal: 2.5, min: 0.5, max: 8.0, step: 0.1 },
        { symbol: 'alpha', name: 'Thermal Diffusivity (mm²/s)', unit: 'mm²/s', defaultVal: 0.085, min: 0.04, max: 0.20, step: 0.005 },
        { symbol: 'Tm', name: 'Melt Temp (°C)', unit: '°C', defaultVal: 230, min: 140, max: 360, step: 5 },
        { symbol: 'Tw', name: 'Mold Temp (°C)', unit: '°C', defaultVal: 40, min: 10, max: 120, step: 5 },
        { symbol: 'Te', name: 'Ejection Temp (°C)', unit: '°C', defaultVal: 90, min: 40, max: 200, step: 5 }
      ],
      calculate: (inputs) => {
        const h = inputs.h_mm || 2.5
        const alpha = inputs.alpha || 0.085
        const tm = inputs.Tm || 230
        const tw = inputs.Tw || 40
        const te = inputs.Te || 90
        const pi2 = Math.PI * Math.PI
        const ratio = (8 / pi2) * ((tm - tw) / (te - tw))
        const tc = (h * h / (pi2 * alpha)) * Math.log(ratio)
        return {
          value: Math.round(tc * 10) / 10,
          formatted: `${Math.round(tc * 10) / 10} seconds`,
          unit: 'seconds',
          status: tc > 25 ? 'warning' : 'normal',
          note: tc > 25 ? 'Long cooling cycle — consider conformal cooling channels.' : 'Optimized fast cycle cooling time.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-001', 'PH-FORM-TOOL-001'],
    lesson_links: [
      { lesson_id: 'cooling-system-design-and-cycle-time-optimization', lesson_name: 'Cooling System Design & Cycle Time Optimization', relationship: 'introduced' }
    ],
    tool_links: [
      { tool_id: 'cooling-calc', tool_name: 'Cooling Time Calculator', tool_url: '/calculators' }
    ],
    sources: [
      { source_type: 'textbook', title: 'Principles of Polymer Processing', author: 'Z. Tadmor & C. Gogos', publisher: 'Wiley', edition: '2nd Edition', year: 2006, page: '450-458', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 3. RHEOLOGY & MELT FLOW ====================
  {
    formula_id: 'PH-FORM-RHEO-001',
    slug: 'power-law-shear-thinning-model',
    name: 'Ostwald-de Waele Power-Law Shear Thinning Model',
    short_name: 'Power-Law Model',
    subject_id: 'polymer-rheology',
    subject_name: 'Polymer Rheology',
    category: 'Non-Newtonian Flow',
    type_code: 'T4',
    type_label: 'Rheology / Flow',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\\tau = K \\cdot \\dot{\\gamma}^n \\quad \\Rightarrow \\quad \\eta(\\dot{\\gamma}) = K \\cdot \\dot{\\gamma}^{n-1}',
    equation_display: 'tau = K * gamma_dot^n  =>  eta = K * gamma_dot^(n-1)',
    description: 'Models pseudoplastic shear-thinning behavior of polymer melts where apparent melt viscosity (eta) decreases non-linearly with increasing shear rate (gamma_dot).',
    when_to_use: 'Use when modeling polymer flow through extrusion dies, injection mold gates, or capillary viscometers.',
    assumptions: [
      'Steady-state shear flow',
      'Isothermal melt conditions',
      'Pseudoplastic flow behavior index n < 1.0'
    ],
    common_mistakes: [
      'Confusing consistency index K (Pa·s^n) with dynamic viscosity at low shear',
      'Assuming power law holds at zero shear rate (does not predict zero-shear viscosity plateau eta_0)'
    ],
    variables: [
      { symbol: '\\tau', meaning: 'Shear stress', unit: 'Pa (N/m²)', dimension: 'Pressure', required: true },
      { symbol: '\\eta', meaning: 'Apparent viscosity', unit: 'Pa·s', dimension: 'Viscosity', required: true },
      { symbol: 'K', meaning: 'Consistency index', unit: 'Pa·s^n', dimension: 'Viscosity coefficient', required: true, example_value: '8500', min: 500, max: 50000, step: 500, default_num: 8500 },
      { symbol: '\\dot{\\gamma}', meaning: 'Shear rate', unit: 's⁻¹', dimension: '1/Time', required: true, example_value: '2500', min: 1, max: 100000, step: 100, default_num: 2500 },
      { symbol: 'n', meaning: 'Flow behavior index (n < 1)', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.35', min: 0.15, max: 0.9, step: 0.05, default_num: 0.35 }
    ],
    examples: [
      {
        title: 'Polypropylene High Shear Gate Viscosity Drop',
        problem_statement: 'A PP injection molding grade resin has consistency index K = 8,500 Pa·s^n and power law index n = 0.35 at 230°C. Calculate apparent viscosity at gate shear rate 10,000 s⁻¹.',
        given_values: { 'K': '8500', 'n': '0.35', 'Shear Rate': '10,000 s⁻¹' },
        steps: [
          'Apply Power-Law viscosity form: eta = K * (gamma_dot)^(n - 1)',
          'Compute exponent: n - 1 = 0.35 - 1.0 = -0.65',
          'Calculate shear factor: (10,000)^(-0.65) = 0.0025119',
          'Multiply by K: eta = 8500 * 0.0025119 = 21.35 Pa·s'
        ],
        final_answer: 'eta = 21.4 Pa·s',
        unit: 'Pa·s',
        engineering_interpretation: 'Viscosity drops by 89x under high injection shear rate compared to extrusion shear rates (10 s⁻¹), allowing high-velocity cavity filling.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'K', name: 'Consistency Index K (Pa·s^n)', unit: 'Pa·s^n', defaultVal: 8500, min: 500, max: 40000, step: 500 },
        { symbol: 'n', name: 'Flow Index n (n < 1)', unit: 'dimensionless', defaultVal: 0.35, min: 0.15, max: 0.85, step: 0.05 },
        { symbol: 'gamma_dot', name: 'Shear Rate (s⁻¹)', unit: 's⁻¹', defaultVal: 2500, min: 1, max: 50000, step: 100 }
      ],
      calculate: (inputs) => {
        const k = inputs.K || 8500
        const n = inputs.n || 0.35
        const g = inputs.gamma_dot || 2500
        const eta = k * Math.pow(g, n - 1)
        const tau = k * Math.pow(g, n)
        return {
          value: Math.round(eta * 10) / 10,
          formatted: `${Math.round(eta * 10) / 10} Pa·s (Stress = ${Math.round(tau / 1000)} kPa)`,
          unit: 'Pa·s',
          status: g > 20000 ? 'warning' : 'normal',
          note: g > 20000 ? 'High shear rate — monitor viscous shear heating risk.' : 'Standard molding flow range.'
        }
      }
    },
    related_ids: ['PH-FORM-RHEO-002', 'PH-FORM-PROC-001'],
    lesson_links: [
      { lesson_id: 'non-newtonian-flow-behavior-and-power-law-model', lesson_name: 'Non-Newtonian Flow Behavior & Power-Law Model', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Polymer Rheology: Fundamentals and Applications', author: 'R. S. Lenk', publisher: 'Elsevier', edition: '1st Edition', year: 1978, page: '88-95', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 4. TESTING & CHARACTERIZATION ====================
  {
    formula_id: 'PH-FORM-TEST-001',
    slug: 'astm-d638-tensile-properties',
    name: 'Engineering Tensile Stress, Strain & Young’s Modulus',
    short_name: 'Tensile Properties (ASTM D638)',
    subject_id: 'polymer-testing',
    subject_name: 'Polymer Testing & Characterization',
    category: 'Mechanical Testing',
    type_code: 'T6',
    type_label: 'Mechanics / Strength',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\\sigma = \\frac{F}{A_0}, \\quad \\epsilon = \\frac{\\Delta L}{L_0}, \\quad E = \\frac{\\sigma}{\\epsilon}',
    equation_display: 'sigma = F / A0, epsilon = DeltaL / L0, E = sigma / epsilon',
    description: 'Calculates engineering tensile stress (sigma), strain elongation (epsilon), and Young’s Elastic Modulus (E) per ASTM D638 / ISO 527.',
    when_to_use: 'Use when testing polymer dumbbell test bars on a Universal Testing Machine (UTM) to determine tensile yield strength and modulus.',
    assumptions: [
      'Uniaxial tension in elastic deformation region',
      'Uniform initial cross-sectional area A0',
      'Constant testing crosshead speed'
    ],
    common_mistakes: [
      'Using instantaneous deformed area instead of initial area A0 (that would be true stress)',
      'Measuring strain across grip displacement instead of extensometer gauge length L0'
    ],
    variables: [
      { symbol: '\\sigma', meaning: 'Engineering tensile stress', unit: 'MPa (N/mm²)', dimension: 'Pressure', required: true },
      { symbol: '\\epsilon', meaning: 'Engineering tensile strain', unit: 'mm/mm (%)', dimension: 'dimensionless', required: true },
      { symbol: 'E', meaning: 'Young’s Elastic Modulus', unit: 'MPa (GPa)', dimension: 'Pressure', required: true },
      { symbol: 'F', meaning: 'Applied load force', unit: 'N', dimension: 'Force', required: true, example_value: '1250', min: 50, max: 50000, step: 50, default_num: 1250 },
      { symbol: 'A_0', meaning: 'Initial cross-sectional area', unit: 'mm²', dimension: 'Area', required: true, example_value: '41.6', min: 5, max: 200, step: 1.0, default_num: 41.6 },
      { symbol: '\\Delta L', meaning: 'Gauge length extension', unit: 'mm', dimension: 'Length', required: true, example_value: '1.2', min: 0.1, max: 50, step: 0.1, default_num: 1.2 },
      { symbol: 'L_0', meaning: 'Original gauge length', unit: 'mm', dimension: 'Length', required: true, example_value: '50.0', min: 25, max: 100, step: 5, default_num: 50.0 }
    ],
    examples: [
      {
        title: 'HDPE Injection Molded Dogbone Tensile Test',
        problem_statement: 'An HDPE dogbone specimen (A0 = 41.6 mm², L0 = 50.0 mm) tested on an Instron UTM reaches 1,250 N force at a 1.2 mm gauge extension in the linear elastic zone. Calculate stress, strain, and Young’s modulus.',
        given_values: { 'F': '1,250 N', 'A0': '41.6 mm²', 'DeltaL': '1.2 mm', 'L0': '50.0 mm' },
        steps: [
          'Calculate stress: sigma = 1250 N / 41.6 mm² = 30.048 MPa',
          'Calculate strain: epsilon = 1.2 mm / 50.0 mm = 0.024 mm/mm (2.4%)',
          'Calculate Young’s modulus: E = 30.048 MPa / 0.024 = 1,252 MPa = 1.25 GPa'
        ],
        final_answer: 'Sigma = 30.0 MPa, Epsilon = 2.4%, E = 1.25 GPa',
        unit: 'GPa',
        engineering_interpretation: 'Modulus E = 1.25 GPa falls within standard commercial HDPE injection molding grade specifications (1.1 - 1.4 GPa).',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'F_N', name: 'Applied Load Force (N)', unit: 'N', defaultVal: 1250, min: 100, max: 20000, step: 50 },
        { symbol: 'A0_mm2', name: 'Initial Area A0 (mm²)', unit: 'mm²', defaultVal: 41.6, min: 5, max: 200, step: 0.5 },
        { symbol: 'dL_mm', name: 'Extension DeltaL (mm)', unit: 'mm', defaultVal: 1.2, min: 0.1, max: 20, step: 0.1 },
        { symbol: 'L0_mm', name: 'Gauge Length L0 (mm)', unit: 'mm', defaultVal: 50.0, min: 25, max: 100, step: 5 }
      ],
      calculate: (inputs) => {
        const f = inputs.F_N || 1250
        const a0 = inputs.A0_mm2 || 41.6
        const dl = inputs.dL_mm || 1.2
        const l0 = inputs.L0_mm || 50.0
        const stress = f / a0
        const strain = dl / l0
        const e_MPa = stress / strain
        const e_GPa = e_MPa / 1000
        return {
          value: Math.round(e_MPa),
          formatted: `E = ${Math.round(e_GPa * 100) / 100} GPa (Sigma = ${Math.round(stress * 10) / 10} MPa)`,
          unit: 'MPa',
          note: 'Calculated per ASTM D638 / ISO 527 standards.'
        }
      }
    },
    related_ids: ['PH-FORM-TEST-002'],
    lesson_links: [
      { lesson_id: 'astm-d638-tensile-properties-of-plastics', lesson_name: 'ASTM D638 Tensile Properties of Plastics', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'standard', title: 'ASTM D638: Standard Test Method for Tensile Properties of Plastics', author: 'ASTM International', publisher: 'ASTM International', edition: '2022', year: 2022, page: '1-15', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 5. MOULD & DIE DESIGN ====================
  {
    formula_id: 'PH-FORM-TOOL-001',
    slug: 'hagen-poiseuille-runner-pressure-drop',
    name: 'Hagen-Poiseuille Circular Runner Pressure Drop',
    short_name: 'Runner Pressure Loss',
    subject_id: 'mould-design',
    subject_name: 'Mould & Die Design',
    category: 'Feed System Hydraulics',
    type_code: 'T5',
    type_label: 'Processing / Machine',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\\Delta P_{runner} = \\frac{128 \\cdot \\mu \\cdot Q \\cdot L}{\\pi \\cdot d^4}',
    equation_display: 'DeltaP = (128 * mu * Q * L) / (pi * d^4)',
    description: 'Calculates the viscous hydraulic pressure drop (DeltaP in bar) across a round injection mold runner channel of diameter d and length L.',
    when_to_use: 'Use when sizing cold runners or balancing multi-cavity feed layouts to avoid excessive pressure drop.',
    assumptions: [
      'Laminar viscous flow through circular pipe',
      'Incompressible melt flow',
      'Apparent viscosity mu evaluated at runner shear rate'
    ],
    common_mistakes: [
      'Pressure drop scales inversely with diameter to 4th power (1/d^4) — small size reductions drastically increase pressure drop!'
    ],
    variables: [
      { symbol: '\\Delta P', meaning: 'Pressure drop loss', unit: 'bar (MPa)', dimension: 'Pressure', required: true },
      { symbol: '\\mu', meaning: 'Melt dynamic viscosity', unit: 'Pa·s', dimension: 'Viscosity', required: true, example_value: '250', min: 30, max: 1500, step: 25, default_num: 250 },
      { symbol: 'Q', meaning: 'Volumetric flow rate', unit: 'cm³/s', dimension: 'Volume/Time', required: true, example_value: '35', min: 5, max: 200, step: 5, default_num: 35 },
      { symbol: 'L', meaning: 'Runner length', unit: 'mm', dimension: 'Length', required: true, example_value: '120', min: 10, max: 500, step: 10, default_num: 120 },
      { symbol: 'd', meaning: 'Runner diameter', unit: 'mm', dimension: 'Length', required: true, example_value: '6.0', min: 2.0, max: 14.0, step: 0.5, default_num: 6.0 }
    ],
    examples: [
      {
        title: '8-Cavity Mold Cold Runner Pressure Drop',
        problem_statement: 'Calculate the pressure drop across a 6.0 mm round runner of length 120 mm carrying polypropylene melt (viscosity mu = 250 Pa·s) at flow rate Q = 35 cm³/s (35,000 mm³/s).',
        given_values: { 'd': '6.0 mm', 'L': '120 mm', 'Q': '35 cm³/s', 'mu': '250 Pa·s' },
        steps: [
          'Compute d^4: 6.0^4 = 1,296 mm^4',
          'Substitute into Hagen-Poiseuille: DeltaP = (128 * 0.000250 MPa·s * 35000 mm³/s * 120 mm) / (3.14159 * 1296 mm^4)',
          'Numerator = 134,400',
          'Denominator = 4,071.5',
          'Calculate DeltaP: 33.01 MPa = 330.1 bar'
        ],
        final_answer: 'DeltaP = 330 bar (33 MPa)',
        unit: 'bar',
        engineering_interpretation: 'Runner pressure loss is 330 bar. Increasing runner diameter to 7.0 mm drops pressure loss to 178 bar, saving 152 bar machine injection pressure.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'd_mm', name: 'Runner Diameter (mm)', unit: 'mm', defaultVal: 6.0, min: 2.5, max: 12.0, step: 0.5 },
        { symbol: 'L_mm', name: 'Runner Length (mm)', unit: 'mm', defaultVal: 120, min: 10, max: 400, step: 10 },
        { symbol: 'Q_cm3s', name: 'Flow Rate (cm³/s)', unit: 'cm³/s', defaultVal: 35, min: 5, max: 150, step: 5 },
        { symbol: 'mu_Pas', name: 'Viscosity (Pa·s)', unit: 'Pa·s', defaultVal: 250, min: 50, max: 1000, step: 25 }
      ],
      calculate: (inputs) => {
        const d = inputs.d_mm || 6.0
        const L = inputs.L_mm || 120
        const Q = (inputs.Q_cm3s || 35) * 1000
        const mu = (inputs.mu_Pas || 250) * 1e-9
        const deltaP_MPa = (128 * mu * Q * L) / (Math.PI * Math.pow(d, 4))
        const deltaP_bar = deltaP_MPa * 10
        return {
          value: Math.round(deltaP_bar * 10) / 10,
          formatted: `${Math.round(deltaP_bar)} bar (${Math.round(deltaP_MPa * 10) / 10} MPa)`,
          unit: 'bar',
          status: deltaP_bar > 500 ? 'warning' : 'normal',
          note: deltaP_bar > 500 ? 'High runner pressure loss — increase runner diameter.' : 'Acceptable pressure drop.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-001'],
    lesson_links: [
      { lesson_id: 'runner-system-balancing-and-pressure-drop-analysis', lesson_name: 'Runner System Balancing & Pressure Drop Analysis', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'handbook', title: 'Injection Mold Design Handbook', author: 'Viktor Lowen', publisher: 'Hanser', edition: '1st Edition', year: 2013, page: '102-108', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 6. RUBBER & ELASTOMERS ====================
  {
    formula_id: 'PH-FORM-RUBB-001',
    slug: 'flory-rehner-crosslink-density',
    name: 'Flory-Rehner Vulcanized Rubber Crosslink Density',
    short_name: 'Flory-Rehner Equation',
    subject_id: 'rubber-technology',
    subject_name: 'Rubber & Elastomer Technology',
    category: 'Vulcanization & Network Mechanics',
    type_code: 'T2',
    type_label: 'Thermodynamics',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\\nu_e = - \\frac{\\ln(1 - v_2) + v_2 + \\chi \\cdot v_2^2}{V_1 \\cdot \\left( v_2^{1/3} - \\frac{v_2}{2} \\right)}',
    equation_display: 'nu_e = -(ln(1 - v2) + v2 + chi*v2^2) / (V1 * (v2^(1/3) - v2/2))',
    description: 'Calculates network crosslink density (nue in mol/cm³) of vulcanized rubber from equilibrium solvent swelling measurement.',
    when_to_use: 'Use when evaluating sulfur/peroxide vulcanization state in tire treads or industrial seals via equilibrium swelling.',
    assumptions: [
      'Affine network deformation model',
      'Equilibrium swelling in solvent',
      'Isotropic gel expansion'
    ],
    common_mistakes: [
      'Using un-swollen polymer volume fraction instead of swollen gel fraction v2'
    ],
    variables: [
      { symbol: '\\nu_e', meaning: 'Crosslink density', unit: 'mol/cm³', dimension: 'Amount/Volume', required: true },
      { symbol: 'v_2', meaning: 'Volume fraction of rubber in swollen gel', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.22', min: 0.05, max: 0.60, step: 0.01, default_num: 0.22 },
      { symbol: 'V_1', meaning: 'Solvent molar volume (Toluene = 106.3)', unit: 'cm³/mol', dimension: 'Volume/Amount', required: true, example_value: '106.3', min: 50, max: 200, step: 1.0, default_num: 106.3 },
      { symbol: '\\chi', meaning: 'Flory-Huggins polymer-solvent parameter', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.39', min: 0.1, max: 0.9, step: 0.01, default_num: 0.39 }
    ],
    examples: [
      {
        title: 'Natural Rubber Tire Tread Vulcanization Density',
        problem_statement: 'A sulfur-cured Natural Rubber sample swollen in toluene at equilibrium gives v2 = 0.22. Given toluene V1 = 106.3 cm³/mol and NR/toluene interaction chi = 0.39, calculate crosslink density nue.',
        given_values: { 'v2': '0.22', 'V1': '106.3 cm³/mol', 'chi': '0.39' },
        steps: [
          'Calculate numerator: -[ln(1 - 0.22) + 0.22 + 0.39 * (0.22)^2] = -[-0.24846 + 0.22 + 0.018876] = 0.009584',
          'Calculate denominator: 106.3 * ((0.22)^(1/3) - 0.22/2) = 106.3 * (0.60368 - 0.11) = 52.478',
          'Divide: nue = 0.009584 / 52.478 = 1.826 x 10^-4 mol/cm³'
        ],
        final_answer: 'nue = 1.83 x 10⁻⁴ mol/cm³',
        unit: 'mol/cm³',
        engineering_interpretation: 'Crosslink density of 1.83x10^-4 mol/cm³ confirms adequate sulfur crosslinking for commercial passenger tire treads.',
        difficulty: 'advanced'
      }
    ],
    related_ids: ['PH-FORM-CHEM-001'],
    lesson_links: [
      { lesson_id: 'vulcanization-kinetics-and-crosslink-density-measurement', lesson_name: 'Vulcanization Kinetics & Crosslink Density Measurement', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'paper', title: 'Statistical Mechanics of Cross-Linked Polymer Networks', author: 'P. J. Flory & J. Rehner', publisher: 'J. Chem. Phys.', edition: '11', year: 1943, page: '521', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 7. COMPOSITES & FIBERS ====================
  {
    formula_id: 'PH-FORM-COMP-001',
    slug: 'voigt-rule-of-mixtures-longitudinal',
    name: 'Voigt Longitudinal Rule of Mixtures',
    short_name: 'Voigt Composite Modulus',
    subject_id: 'polymer-composites',
    subject_name: 'Polymer Composites & Fiber Engineering',
    category: 'Micromechanics',
    type_code: 'T8',
    type_label: 'Composites',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'E_{11} = V_f \\cdot E_f + (1 - V_f) \\cdot E_m',
    equation_display: 'E11 = Vf * Ef + (1 - Vf) * Em',
    description: 'Predicts the longitudinal elastic modulus (E11 in GPa) of unidirectional fiber reinforced polymer (FRP) composites parallel to fiber axis.',
    when_to_use: 'Use when designing continuous fiber reinforced structural parts (CFRP, GFRP) loaded along fiber direction.',
    assumptions: [
      'Continuous unidirectional parallel fibers',
      'Perfect fiber-matrix interfacial bonding',
      'Isostrain deformation along fiber direction'
    ],
    common_mistakes: [
      'Applying Voigt equation to transverse loading (transverse requires Reuss inverse model)'
    ],
    variables: [
      { symbol: 'E_{11}', meaning: 'Longitudinal composite modulus', unit: 'GPa', dimension: 'Pressure', required: true },
      { symbol: 'V_f', meaning: 'Fiber volume fraction', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.60', min: 0.1, max: 0.75, step: 0.05, default_num: 0.60 },
      { symbol: 'E_f', meaning: 'Fiber tensile modulus', unit: 'GPa', dimension: 'Pressure', required: true, example_value: '230', min: 40, max: 600, step: 10, default_num: 230 },
      { symbol: 'E_m', meaning: 'Matrix resin modulus', unit: 'GPa', dimension: 'Pressure', required: true, example_value: '3.5', min: 1.0, max: 10, step: 0.5, default_num: 3.5 }
    ],
    examples: [
      {
        title: 'Aerospace Carbon/Epoxy Laminate Longitudinal Stiffness',
        problem_statement: 'Calculate longitudinal modulus E11 for an aerospace grade unidirectional Carbon/Epoxy prepreg laminate with 60 vol% carbon fiber (Ef = 230 GPa) in epoxy matrix (Em = 3.5 GPa).',
        given_values: { 'Vf': '0.60', 'Ef': '230 GPa', 'Em': '3.5 GPa' },
        steps: [
          'Apply Voigt Model: E11 = (0.60 * 230) + (1 - 0.60) * 3.5',
          'Fiber contribution = 138 GPa',
          'Matrix contribution = 1.4 GPa',
          'Sum contributions: E11 = 138 + 1.4 = 139.4 GPa'
        ],
        final_answer: 'E11 = 139.4 GPa',
        unit: 'GPa',
        engineering_interpretation: 'Longitudinal modulus is 139.4 GPa. Carbon fibers carry 99% of the tensile load, providing high specific stiffness at 1/5th steel density.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'Vf', name: 'Fiber Volume Fraction (Vf)', unit: 'fraction', defaultVal: 0.60, min: 0.10, max: 0.75, step: 0.05 },
        { symbol: 'Ef', name: 'Fiber Modulus Ef (GPa)', unit: 'GPa', defaultVal: 230, min: 40, max: 600, step: 10 },
        { symbol: 'Em', name: 'Matrix Modulus Em (GPa)', unit: 'GPa', defaultVal: 3.5, min: 1.0, max: 10, step: 0.5 }
      ],
      calculate: (inputs) => {
        const vf = inputs.Vf || 0.60
        const ef = inputs.Ef || 230
        const em = inputs.Em || 3.5
        const e11 = vf * ef + (1 - vf) * em
        return {
          value: Math.round(e11 * 10) / 10,
          formatted: `${Math.round(e11 * 10) / 10} GPa`,
          unit: 'GPa',
          note: 'Calculated using Voigt longitudinal micromechanics model.'
        }
      }
    },
    related_ids: ['PH-FORM-TEST-001'],
    lesson_links: [
      { lesson_id: 'micromechanics-and-rule-of-mixtures-for-composites', lesson_name: 'Micromechanics & Rule of Mixtures for Composites', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Analysis and Performance of Fiber Composites', author: 'B. D. Agarwal & L. J. Broutman', publisher: 'Wiley', edition: '3rd Edition', year: 2006, page: '75-82', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 8. PACKAGING & BARRIER ====================
  {
    formula_id: 'PH-FORM-PACK-001',
    slug: 'fickian-film-oxygen-transmission-rate',
    name: 'Fickian Film Oxygen Transmission Rate (OTR)',
    short_name: 'OTR Barrier Formula',
    subject_id: 'plastic-packaging-engineering',
    subject_name: 'Plastic Packaging Engineering',
    category: 'Barrier Physics',
    type_code: 'T7',
    type_label: 'Transport / Barrier',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'OTR = \\frac{P_{O2} \\cdot \\Delta p}{t}',
    equation_display: 'OTR = (P_O2 * DeltaP) / t',
    description: 'Calculates the steady-state volumetric flux of oxygen gas passing through a flexible packaging film per unit area per day (cc/m²/day).',
    when_to_use: 'Use when designing food, snack, or pharmaceutical multi-layer packaging to determine barrier layer thickness required for target shelf-life.',
    assumptions: [
      'Steady-state Fickian diffusion',
      'Henry’s law gas solubility relationship',
      'Constant gas partial pressure differential'
    ],
    common_mistakes: [
      'Confusing material permeability coefficient PO2 with total film transmission rate OTR',
      'Ignoring relative humidity effects on EVOH moisture sensitivity'
    ],
    variables: [
      { symbol: 'OTR', meaning: 'Oxygen transmission rate', unit: 'cc/(m²·day)', dimension: 'Flux', required: true },
      { symbol: 'P_{O2}', meaning: 'Permeability coefficient', unit: 'cc·mil/(m²·day·atm)', dimension: 'Permeability', required: true, example_value: '3.0', min: 0.01, max: 5000, step: 0.1, default_num: 3.0 },
      { symbol: '\\Delta p', meaning: 'Oxygen partial pressure difference', unit: 'atm', dimension: 'Pressure', required: true, example_value: '0.21', min: 0.05, max: 1.0, step: 0.05, default_num: 0.21 },
      { symbol: 't', meaning: 'Barrier layer thickness', unit: 'mil (1 mil = 25.4 μm)', dimension: 'Length', required: true, example_value: '2.0', min: 0.1, max: 20, step: 0.1, default_num: 2.0 }
    ],
    examples: [
      {
        title: 'EVOH vs LLDPE Barrier Packaging OTR Comparison',
        problem_statement: 'Compare the OTR of (a) a 2.0 mil LLDPE film (PO2 = 2,500 cc·mil/m²·day·atm) versus (b) a 0.2 mil EVOH barrier layer (PO2 = 0.05 cc·mil/m²·day·atm) under ambient air (0.21 atm O2).',
        given_values: { 't_LLDPE': '2.0 mil', 'P_LLDPE': '2500', 't_EVOH': '0.2 mil', 'P_EVOH': '0.05', 'DeltaP': '0.21 atm' },
        steps: [
          'LLDPE OTR = (2500 * 0.21) / 2.0 = 262.5 cc/(m²·day)',
          'EVOH OTR = (0.05 * 0.21) / 0.2 = 0.0525 cc/(m²·day)'
        ],
        final_answer: 'LLDPE = 262.5 cc/m²/day; EVOH = 0.0525 cc/m²/day',
        unit: 'cc/(m²·day)',
        engineering_interpretation: 'A 0.2 mil (5 micron) EVOH layer provides a 5,000x barrier improvement over PE, preventing lipid oxidation in snack food.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'P_O2', name: 'Permeability PO2', unit: 'cc·mil/(m²·day·atm)', defaultVal: 3.0, min: 0.01, max: 3000, step: 0.1 },
        { symbol: 'DeltaP', name: 'O2 Partial Pressure (atm)', unit: 'atm', defaultVal: 0.21, min: 0.05, max: 1.0, step: 0.05 },
        { symbol: 't_mil', name: 'Barrier Thickness (mil)', unit: 'mil', defaultVal: 2.0, min: 0.1, max: 10, step: 0.1 }
      ],
      calculate: (inputs) => {
        const p = inputs.P_O2 || 3.0
        const dp = inputs.DeltaP || 0.21
        const t = inputs.t_mil || 2.0
        const otr = (p * dp) / t
        return {
          value: Math.round(otr * 1000) / 1000,
          formatted: `${Math.round(otr * 100) / 100} cc/(m²·day)`,
          unit: 'cc/(m²·day)',
          note: otr < 1.0 ? 'High-barrier food packaging classification.' : 'Standard general-purpose film barrier.'
        }
      }
    },
    related_ids: ['PH-FORM-PACK-002'],
    lesson_links: [
      { lesson_id: 'barrier-polymers-evoh-pvdc-and-gas-permeability-math', lesson_name: 'Barrier Polymers (EVOH, PVDC) & Gas Permeability Math', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Plastic Packaging: Materials, Processing, Applications', author: 'O. G. Piringer & A. L. Baner', publisher: 'Wiley-VCH', edition: '2nd Edition', year: 2008, page: '110-118', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 9. RECYCLING & SUSTAINABILITY ====================
  {
    formula_id: 'PH-FORM-SUST-001',
    slug: 'moefcc-epr-plastic-credit-obligation',
    name: 'MoEFCC EPR Plastic Credit Obligation Formula',
    short_name: 'EPR Credit Formula',
    subject_id: 'sustainable-plastics',
    subject_name: 'Sustainable Plastics & Circular Economy',
    category: 'EPR Compliance & Regulations',
    type_code: 'T11',
    type_label: 'Sustainability / LCA',
    difficulty: 'foundation',
    is_gate: false,
    is_shopfloor: true,
    equation_latex: 'EPR_{obligation} = M_{sales} \\cdot \\%_{target} \\cdot (1 - w_{recycled})',
    equation_display: 'EPR_credit (Tonnes) = M_sales * Target_% * (1 - Recycled_%)',
    description: 'Calculates the net metric tonnes of CPCB plastic recycling credits an Indian Brand Owner/FMCG manufacturer must procure under MoEFCC EPR rules.',
    when_to_use: 'Use when auditing corporate ESG compliance or estimating annual plastic credit purchases under Indian environmental regulations.',
    assumptions: [
      'MoEFCC Plastic Waste Management Rules 2022 framework',
      'CPCB registered recycler credit certificates',
      'Category I rigid / Category II flexible packaging targets'
    ],
    common_mistakes: [
      'Not deducting in-house post-consumer recycled (PCR) content verified by CPCB audits'
    ],
    variables: [
      { symbol: 'EPR_{obligation}', meaning: 'Required CPCB credit volume', unit: 'Metric Tonnes', dimension: 'Mass', required: true },
      { symbol: 'M_{sales}', meaning: 'Annual plastic packaging sales', unit: 'Metric Tonnes', dimension: 'Mass', required: true, example_value: '1200', min: 10, max: 100000, step: 50, default_num: 1200 },
      { symbol: '\\%_{target}', meaning: 'Statutory target percentage', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '1.0', min: 0.5, max: 1.0, step: 0.05, default_num: 1.0 },
      { symbol: 'w_{recycled}', meaning: 'Direct PCR content fraction incorporated', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.15', min: 0.0, max: 0.6, step: 0.05, default_num: 0.15 }
    ],
    examples: [
      {
        title: 'FMCG Rigid HDPE Personal Care Bottle EPR Deficit',
        problem_statement: 'An Indian FMCG brand sells 1,200 Tonnes of rigid HDPE packaging annually incorporating 15% certified PCR content. At 100% statutory MoEFCC target, calculate required credit purchase volume.',
        given_values: { 'M_sales': '1,200 Tonnes', 'Target': '1.0 (100%)', 'PCR Content': '0.15 (15%)' },
        steps: [
          'Apply EPR formula: Net EPR = 1200 * 1.0 * (1 - 0.15)',
          'Compute credit deficit: 1200 * 0.85 = 1,020 Metric Tonnes'
        ],
        final_answer: '1,020 Metric Tonnes CPCB Credits',
        unit: 'Metric Tonnes',
        engineering_interpretation: 'The brand must purchase 1,020 Category I rigid plastic credits from registered CPCB recyclers to remain compliant.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'Msales', name: 'Packaging Volume (Tonnes)', unit: 'Tonnes', defaultVal: 1200, min: 50, max: 50000, step: 50 },
        { symbol: 'Target', name: 'MoEFCC Target (0.5-1.0)', unit: 'fraction', defaultVal: 1.0, min: 0.5, max: 1.0, step: 0.05 },
        { symbol: 'PcrPct', name: 'PCR Content (0.0-0.6)', unit: 'fraction', defaultVal: 0.15, min: 0.0, max: 0.6, step: 0.05 }
      ],
      calculate: (inputs) => {
        const m = inputs.Msales || 1200
        const t = inputs.Target || 1.0
        const r = inputs.PcrPct || 0.15
        const netEpr = m * t * (1 - r)
        const estCost = netEpr * 2690
        return {
          value: Math.round(netEpr),
          formatted: `${Math.round(netEpr).toLocaleString()} Tonnes (Est. Cost: ₹${(Math.round(estCost / 100000) / 10).toFixed(1)} Lakhs)`,
          unit: 'Tonnes',
          note: 'Calculated using CPCB Category I/II Plastic Credit Exchange benchmark rates.'
        }
      }
    },
    related_ids: ['PH-FORM-SUST-002'],
    lesson_links: [
      { lesson_id: 'epr-compliance-guidelines-and-plastic-credit-trading-in-india', lesson_name: 'EPR Compliance Guidelines & Plastic Credit Trading in India', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'standard', title: 'Plastic Waste Management Rules (EPR Amendment)', author: 'MoEFCC India', publisher: 'Government of India Gazette', edition: '2022', year: 2022, page: '1-42', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 10. COLOR SCIENCE & OPTICS ====================
  {
    formula_id: 'PH-FORM-COLOR-001',
    slug: 'cie-lab-delta-e-1976-color-difference',
    name: 'CIE L*a*b* Delta-E 1976 Color Difference Formula',
    short_name: 'CIE Delta-E 1976',
    subject_id: 'color-science-masterbatches',
    subject_name: 'Color Science & Masterbatch Technology',
    category: 'Color Matching & Quality Control',
    type_code: 'T9',
    type_label: 'Testing / Standards',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\\Delta E^*_{ab} = \\sqrt{ (\\Delta L^*)^2 + (\\Delta a^*)^2 + (\\Delta b^*)^2 }',
    equation_display: 'DeltaE = sqrt((L1 - L2)^2 + (a1 - a2)^2 + (b1 - b2)^2)',
    description: 'Calculates the total color difference (DeltaE*) between a production molded part and a target color master standard in 3D CIE L*a*b* color space.',
    when_to_use: 'Use in quality control lab spectrophotometry to determine if a masterbatch color match passes customer specification.',
    assumptions: [
      'Standard D65 illuminant, 10° observer angle',
      'Euclidean distance model in L*a*b* color space'
    ],
    common_mistakes: [
      'Confusing DeltaE 1976 with DeltaE 2000 (dE2000 includes perceptual weighting for chroma and hue)'
    ],
    variables: [
      { symbol: '\\Delta E^*', meaning: 'Total color difference distance', unit: 'units', dimension: 'dimensionless', required: true },
      { symbol: '\\Delta L^*', meaning: 'Lightness difference (L_sample - L_target)', unit: 'units', dimension: 'dimensionless', required: true, example_value: '0.3', min: -5, max: 5, step: 0.05, default_num: 0.3 },
      { symbol: '\\Delta a^*', meaning: 'Red/Green difference (a_sample - a_target)', unit: 'units', dimension: 'dimensionless', required: true, example_value: '-0.4', min: -5, max: 5, step: 0.05, default_num: -0.4 },
      { symbol: '\\Delta b^*', meaning: 'Yellow/Blue difference (b_sample - b_target)', unit: 'units', dimension: 'dimensionless', required: true, example_value: '0.2', min: -5, max: 5, step: 0.05, default_num: 0.2 }
    ],
    examples: [
      {
        title: 'Automotive Yellow Door Handle Color Pass/Fail QC',
        problem_statement: 'A target color standard has L*=72.4, a*=14.2, b*=48.5. Molded production part reads L*=72.7, a*=13.8, b*=48.7. Calculate DeltaE* and check against DeltaE <= 0.80 automotive tolerance.',
        given_values: { 'dL': '0.3', 'da': '-0.4', 'db': '0.2' },
        steps: [
          'Calculate squared differences: (0.3)^2 = 0.09, (-0.4)^2 = 0.16, (0.2)^2 = 0.04',
          'Sum squares: 0.09 + 0.16 + 0.04 = 0.29',
          'Take square root: sqrt(0.29) = 0.5385'
        ],
        final_answer: 'DeltaE* = 0.54 units (PASS)',
        unit: 'units',
        engineering_interpretation: 'DeltaE = 0.54 is below the 0.80 automotive pass threshold, indicating a commercially acceptable visual match.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'dL', name: 'dL* (Lightness Diff)', unit: 'units', defaultVal: 0.3, min: -5, max: 5, step: 0.05 },
        { symbol: 'da', name: 'da* (Red/Green Diff)', unit: 'units', defaultVal: -0.4, min: -5, max: 5, step: 0.05 },
        { symbol: 'db', name: 'db* (Yellow/Blue Diff)', unit: 'units', defaultVal: 0.2, min: -5, max: 5, step: 0.05 }
      ],
      calculate: (inputs) => {
        const dl = inputs.dL || 0.3
        const da = inputs.da || -0.4
        const db = inputs.db || 0.2
        const de = Math.sqrt(dl * dl + da * da + db * db)
        return {
          value: Math.round(de * 100) / 100,
          formatted: `${Math.round(de * 100) / 100} units`,
          unit: 'units',
          note: de < 0.5 ? 'Imperceptible color difference (Commercial Pass).' : de < 1.0 ? 'Acceptable industrial match.' : 'Noticeable color drift (QC Reject).'
        }
      }
    },
    related_ids: [],
    lesson_links: [
      { lesson_id: 'cie-lab-color-space-and-spectrophotometric-color-matching', lesson_name: 'CIE L*a*b* Color Space & Spectrophotometric Color Matching', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'textbook', title: 'Colorimetry: Understanding the CIE System', author: 'Janos Schanda', publisher: 'Wiley-Interscience', edition: '1st Edition', year: 2007, page: '65-72', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 11. ENTREPRENEURSHIP & FACTORY SETUP ====================
  {
    formula_id: 'PH-FORM-ENTR-001',
    slug: 'plastics-factory-break-even-point',
    name: 'Plastics Factory Break-Even Point (BEP) Analysis',
    short_name: 'Break-Even Point (BEP)',
    subject_id: 'entrepreneurship-plastics',
    subject_name: 'Entrepreneurship & Factory Setup',
    category: 'Factory Financials & Economics',
    type_code: 'T10',
    type_label: 'Statistics / Quality',
    difficulty: 'foundation',
    is_gate: false,
    is_shopfloor: true,
    equation_latex: 'BEP_{units} = \\frac{F_{fixed}}{P_{selling} - V_{variable}} \\quad \\Rightarrow \\quad BEP_{sales} = \\frac{F_{fixed}}{1 - \\frac{V}{P}}',
    equation_display: 'BEP_units = Fixed_Cost / (Selling_Price - Variable_Cost)',
    description: 'Calculates the minimum annual production quantity (in kg or units) or sales revenue required for a plastics manufacturing plant to cover fixed overheads.',
    when_to_use: 'Use when building project reports for bank loans (MUDRA, PMEGP) or calculating plant capacity utilization for profitability.',
    assumptions: [
      'Constant selling price per unit',
      'Linear variable costs with volume',
      'Fixed costs include machine EMI, factory rent, base salaries, and fixed electrical load'
    ],
    common_mistakes: [
      'Excluding machine loan interest and maintenance reserve from annual fixed costs'
    ],
    variables: [
      { symbol: 'BEP_{units}', meaning: 'Break-even volume', unit: 'kg/year', dimension: 'Mass/Time', required: true },
      { symbol: 'F_{fixed}', meaning: 'Annual fixed overhead costs', unit: '₹ (Rupees)', dimension: 'Currency', required: true, example_value: '3600000', min: 500000, max: 50000000, step: 100000, default_num: 3600000 },
      { symbol: 'P_{selling}', meaning: 'Selling price realization per kg', unit: '₹/kg', dimension: 'Currency/Mass', required: true, example_value: '165', min: 50, max: 1000, step: 5, default_num: 165 },
      { symbol: 'V_{variable}', meaning: 'Variable cost per kg (resin + power)', unit: '₹/kg', dimension: 'Currency/Mass', required: true, example_value: '125', min: 30, max: 800, step: 5, default_num: 125 }
    ],
    examples: [
      {
        title: '₹50 Lakh PVC Pipe Extrusion Plant Break-Even',
        problem_statement: 'A new PVC pipe extrusion factory has annual fixed costs F = ₹36 Lakhs (₹3,600,000). PVC pipe selling price = ₹165/kg. Variable cost (resin + power + additives) = ₹125/kg. Calculate annual break-even output in kg and monthly revenue.',
        given_values: { 'Fixed Costs': '₹3,600,000', 'Selling Price': '₹165/kg', 'Variable Cost': '₹125/kg' },
        steps: [
          'Calculate contribution margin: ₹165 - ₹125 = ₹40/kg',
          'Divide fixed costs by margin: BEP = ₹3,600,000 / ₹40 = 90,000 kg/year (90 Tonnes/year)',
          'Calculate monthly revenue: 90,000 kg * ₹165/kg = ₹1.485 Crores/year (₹12.37 Lakhs/month)'
        ],
        final_answer: '90 Tonnes/year (7.5 Tonnes/month)',
        unit: 'Tonnes/year',
        engineering_interpretation: 'The plant must process at least 7.5 Tonnes/month to achieve break-even; all production above 90 Tonnes generates net profit at ₹40/kg margin.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'F_fixed', name: 'Fixed Overhead Costs (₹)', unit: '₹/year', defaultVal: 3600000, min: 500000, max: 20000000, step: 100000 },
        { symbol: 'P_sell', name: 'Selling Price (₹/kg)', unit: '₹/kg', defaultVal: 165, min: 60, max: 800, step: 5 },
        { symbol: 'V_var', name: 'Variable Cost (₹/kg)', unit: '₹/kg', defaultVal: 125, min: 40, max: 600, step: 5 }
      ],
      calculate: (inputs) => {
        const f = inputs.F_fixed || 3600000
        const p = inputs.P_sell || 165
        const v = inputs.V_var || 125
        const margin = p - v
        if (margin <= 0) {
          return { value: 0, formatted: 'Invalid Margin (Selling Price <= Variable Cost)', unit: 'kg', status: 'critical', note: 'Selling price must exceed variable cost.' }
        }
        const bepKg = f / margin
        const bepRev = bepKg * p
        return {
          value: Math.round(bepKg),
          formatted: `${Math.round(bepKg / 1000)} Tonnes/year (₹${(Math.round(bepRev / 100000) / 10).toFixed(1)} Lakhs Revenue)`,
          unit: 'kg/year',
          note: `Contribution margin is ₹${margin}/kg.`
        }
      }
    },
    related_ids: [],
    lesson_links: [
      { lesson_id: 'cost-estimation-machinery-roi-and-break-even-analysis', lesson_name: 'Cost Estimation, Machinery ROI & Break-Even Analysis', relationship: 'introduced' }
    ],
    tool_links: [],
    sources: [
      { source_type: 'handbook', title: 'Plastics Manufacturing Systems Engineering', author: 'David Kazmer', publisher: 'Hanser', edition: '2nd Edition', year: 2016, page: '310-318', verified_at: '2026-10-08' }
    ],
    status: 'published',
    verified_at: '2026-10-08',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  }
,
  // ==================== 1. POLYMER CHEMISTRY (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-CHEM-004',
    slug: 'flory-fox-equation-tg-molecular-weight',
    name: 'Flory-Fox Equation (Tg Dependence on Molecular Weight)',
    short_name: 'Flory-Fox Equation',
    subject_id: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    category: 'Thermodynamics & Transitions',
    type_code: 'T2',
    type_label: 'Thermodynamics',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: 'T_g = T_{g,\infty} - \frac{K_{ff}}{\overline{M}_n}',
    equation_display: 'Tg = Tg_infinity - (Kff / Mn)',
    description: 'Relates the glass transition temperature (Tg) of a linear polymer to its number-average molecular weight (Mn) based on chain-end free volume theory.',
    when_to_use: 'Use when estimating the glass transition temperature of oligomers or lower molecular weight polymers before reaching the high-MW asymptotic plateau Tg,infinity.',
    assumptions: [
      'Chain ends possess higher free volume than chain middle segments',
      'Linear homopolymer chains without long-chain branching',
      'Equilibrium free volume state at transition'
    ],
    common_mistakes: [
      'Using weight-average Mw instead of number-average Mn',
      'Forgetting that temperatures in theoretical free volume equations must be in Kelvin before converting to Celsius'
    ],
    variables: [
      { symbol: 'T_g', meaning: 'Glass transition temperature at given Mn', unit: '°C (or K)', dimension: 'Temperature', required: true },
      { symbol: 'T_{g,\infty}', meaning: 'Asymptotic Tg at infinite molecular weight', unit: '°C', dimension: 'Temperature', required: true, example_value: '100', min: -100, max: 300, step: 1, default_num: 100 },
      { symbol: 'K_{ff}', meaning: 'Flory-Fox constant for polymer', unit: 'K·g/mol', dimension: 'Temperature·Mass/Mole', required: true, example_value: '180000', min: 10000, max: 500000, step: 5000, default_num: 180000 },
      { symbol: '\overline{M}_n', meaning: 'Number-average molecular weight', unit: 'g/mol', dimension: 'Mass/Mole', required: true, example_value: '25000', min: 1000, max: 200000, step: 1000, default_num: 25000 }
    ],
    examples: [
      {
        title: 'Polystyrene Tg Prediction at Mn = 25,000 g/mol',
        problem_statement: 'For Polystyrene, Tg,infinity is 100°C (373 K) and Kff is 1.8 × 10^5 K·g/mol. Calculate Tg for a polystyrene sample with Mn = 25,000 g/mol.',
        given_values: { 'Tg_infinity': '100°C', 'Kff': '180,000 K·g/mol', 'Mn': '25,000 g/mol' },
        steps: [
          'Identify formula: Tg = Tg_infinity - (Kff / Mn)',
          'Calculate depression: 180,000 / 25,000 = 7.2°C',
          'Calculate Tg: 100°C - 7.2°C = 92.8°C'
        ],
        final_answer: 'Tg = 92.8°C',
        unit: '°C',
        engineering_interpretation: 'The presence of chain ends lowers Tg by 7.2°C compared to high-MW polystyrene, indicating reduced thermal stability for short-chain oligomeric grades.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'Tg_inf', name: 'Asymptotic Tg,inf (°C)', unit: '°C', defaultVal: 100, min: -50, max: 350, step: 1 },
        { symbol: 'Kff', name: 'Flory-Fox Constant Kff', unit: 'K·g/mol', defaultVal: 180000, min: 20000, max: 400000, step: 5000 },
        { symbol: 'Mn', name: 'Number-Average Mn', unit: 'g/mol', defaultVal: 25000, min: 2000, max: 150000, step: 1000 }
      ],
      calculate: (inputs) => {
        const tgInf = inputs.Tg_inf || 100
        const kff = inputs.Kff || 180000
        const mn = inputs.Mn || 25000
        const depression = kff / mn
        const tg = tgInf - depression
        return {
          value: Math.round(tg * 10) / 10,
          formatted: `${Math.round(tg * 10) / 10} °C (${Math.round((tg + 273.15) * 10) / 10} K)`,
          unit: '°C',
          note: `Depression due to chain-end free volume is ${Math.round(depression * 10) / 10} °C.`
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-003'],
    lesson_links: [{ lesson_id: 'glass-transition-temperature-and-free-volume-theory', lesson_name: 'Glass Transition Temperature (Tg) & Free Volume Theory', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'Principles of Polymer Chemistry', author: 'Paul J. Flory', publisher: 'Cornell University Press', edition: '1st Edition', year: 1953, page: '347-350', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },
  {
    formula_id: 'PH-FORM-CHEM-005',
    slug: 'mark-houwink-sakurada-intrinsic-viscosity',
    name: 'Mark-Houwink-Sakurada Equation (Intrinsic Viscosity to MW)',
    short_name: 'Mark-Houwink Equation',
    subject_id: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    category: 'Polymer Characterization',
    type_code: 'T9',
    type_label: 'Testing / Standards',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '[\eta] = K \cdot \overline{M}_v^a',
    equation_display: '[eta] = K * (Mv)^a',
    description: 'Empirical relation connecting limiting viscosity number (intrinsic viscosity [eta]) of a dilute polymer solution to viscosity-average molecular weight (Mv).',
    when_to_use: 'Use when determining polymer molecular weight via capillary Ubbelohde viscometry in a specified solvent and temperature.',
    assumptions: [
      'Dilute solution regime where polymer coils do not overlap (c < c*)',
      'Known Mark-Houwink constants K and a for the specific polymer-solvent-temperature system',
      'Newtonian solvent behavior at zero shear limit'
    ],
    common_mistakes: [
      'Using K and a values for a different solvent or temperature',
      'Confusing intrinsic viscosity [eta] (dL/g or mL/g) with dynamic melt viscosity (Pa·s)'
    ],
    variables: [
      { symbol: '[\eta]', meaning: 'Intrinsic viscosity (limiting viscosity number)', unit: 'dL/g', dimension: 'Volume/Mass', required: true },
      { symbol: 'K', meaning: 'Mark-Houwink constant', unit: 'dL/g', dimension: 'Volume/Mass', required: true, example_value: '0.00016', min: 0.00001, max: 0.01, step: 0.00001, default_num: 0.00016 },
      { symbol: 'a', meaning: 'Mark-Houwink exponent (conformation parameter)', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '0.70', min: 0.5, max: 1.0, step: 0.01, default_num: 0.70 },
      { symbol: '\overline{M}_v', meaning: 'Viscosity-average molecular weight', unit: 'g/mol', dimension: 'Mass/Mole', required: true, example_value: '120000', min: 5000, max: 2000000, step: 5000, default_num: 120000 }
    ],
    examples: [
      {
        title: 'High-Density Polyethylene Mv in Decalin at 135°C',
        problem_statement: 'For HDPE in decalin at 135°C, K = 6.2 × 10^-4 dL/g and a = 0.70. If measured [eta] = 2.15 dL/g, determine the viscosity-average molecular weight Mv.',
        given_values: { '[eta]': '2.15 dL/g', 'K': '6.2e-4 dL/g', 'a': '0.70' },
        steps: [
          'Rearrange formula: Mv = ([eta] / K)^(1/a)',
          'Compute [eta]/K: 2.15 / (6.2e-4) = 3467.74',
          'Raise to power 1/0.70 (1.4286): (3467.74)^1.4286 = 115,200 g/mol'
        ],
        final_answer: 'Mv = 115,200 g/mol',
        unit: 'g/mol',
        engineering_interpretation: 'The intrinsic viscosity of 2.15 dL/g corresponds to high molecular weight extrusion pipe grade HDPE suitable for PE-100 pressure pipe applications.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'K_val', name: 'Mark-Houwink K (×10^-4 dL/g)', unit: '×10^-4 dL/g', defaultVal: 6.2, min: 0.5, max: 20, step: 0.1 },
        { symbol: 'a_val', name: 'Exponent a', unit: 'dimensionless', defaultVal: 0.70, min: 0.50, max: 0.90, step: 0.01 },
        { symbol: 'eta_val', name: 'Intrinsic Viscosity [eta]', unit: 'dL/g', defaultVal: 2.15, min: 0.2, max: 10, step: 0.05 }
      ],
      calculate: (inputs) => {
        const k = (inputs.K_val || 6.2) * 1e-4
        const a = inputs.a_val || 0.70
        const eta = inputs.eta_val || 2.15
        const mv = Math.pow(eta / k, 1 / a)
        return {
          value: Math.round(mv),
          formatted: `${Math.round(mv).toLocaleString()} g/mol`,
          unit: 'g/mol',
          note: `Conformation exponent a = ${a} indicates good polymer-solvent interaction.`
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-001'],
    lesson_links: [{ lesson_id: 'molecular-weight-averages-and-dilute-solution-viscometry', lesson_name: 'Molecular Weight Averages & Dilute Solution Viscometry', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'Polymer Physics', author: 'Michael Rubinstein & Ralph Colby', publisher: 'Oxford University Press', edition: '1st Edition', year: 2003, page: '38-42', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 2. POLYMER PROCESSING (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-PROC-003',
    slug: 'single-screw-extruder-drag-flow-rate',
    name: 'Single-Screw Extruder Drag Flow Rate (Throughput Capacity)',
    short_name: 'Extruder Drag Flow',
    subject_id: 'polymer-processing',
    subject_name: 'Polymer Processing',
    category: 'Extrusion Technology',
    type_code: 'T5',
    type_label: 'Processing / Machine',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'Q_d = \frac{1}{2} \pi^2 D^2 H N \sin\theta \cos\theta',
    equation_display: 'Qd = 0.5 * pi^2 * D^2 * H * N * sin(theta) * cos(theta)',
    description: 'Calculates theoretical open-discharge volumetric drag flow rate Qd generated by the rotating screw in the metering zone of a single-screw plastics extruder.',
    when_to_use: 'Use when sizing single-screw extruders or estimating maximum theoretical melt throughput before subtracting pressure flow backflow.',
    assumptions: [
      'Isothermal Newtonian melt behavior in metering channel',
      'Flat plate channel unwrapping approximation (H << D)',
      'No wall slip at barrel or screw surfaces'
    ],
    common_mistakes: [
      'Forgetting that actual output Q is lower than Qd due to head pressure backflow Qp and leakage Ql',
      'Using screw speed in RPM instead of rev/second when computing in SI units'
    ],
    variables: [
      { symbol: 'Q_d', meaning: 'Volumetric drag flow rate', unit: 'cm³/s (or kg/h)', dimension: 'Volume/Time', required: true },
      { symbol: 'D', meaning: 'Screw outside diameter', unit: 'mm', dimension: 'Length', required: true, example_value: '65', min: 20, max: 250, step: 5, default_num: 65 },
      { symbol: 'H', meaning: 'Metering channel depth', unit: 'mm', dimension: 'Length', required: true, example_value: '3.5', min: 1, max: 15, step: 0.5, default_num: 3.5 },
      { symbol: 'N', meaning: 'Screw rotational speed', unit: 'RPM', dimension: 'Frequency', required: true, example_value: '80', min: 10, max: 250, step: 5, default_num: 80 },
      { symbol: '\theta', meaning: 'Screw flight helix angle (standard square pitch is 17.65°)', unit: 'degrees', dimension: 'Angle', required: true, example_value: '17.65', min: 10, max: 30, step: 0.1, default_num: 17.65 }
    ],
    examples: [
      {
        title: '65 mm HDPE Pipe Extruder Metering Drag Output',
        problem_statement: 'A 65 mm single-screw extruder operates at 80 RPM with metering channel depth H = 3.5 mm and standard square pitch helix angle theta = 17.65°. Melt density is 0.76 g/cm³. Calculate volumetric drag output and mass throughput in kg/h.',
        given_values: { 'D': '65 mm', 'H': '3.5 mm', 'N': '80 RPM', 'theta': '17.65°', 'rho': '0.76 g/cm³' },
        steps: [
          'Convert units: D = 6.5 cm, H = 0.35 cm, N = 80/60 = 1.333 rev/s',
          'Calculate angle term: sin(17.65°) * cos(17.65°) = 0.3032 * 0.9529 = 0.2889',
          'Compute Qd = 0.5 * pi^2 * (6.5)^2 * 0.35 * 1.333 * 0.2889 = 28.18 cm³/s',
          'Calculate mass throughput: 28.18 cm³/s * 0.76 g/cm³ * 3600 / 1000 = 77.1 kg/h'
        ],
        final_answer: 'Qd = 28.2 cm³/s (77.1 kg/h)',
        unit: 'kg/h',
        engineering_interpretation: 'At zero head pressure, maximum theoretical throughput is 77.1 kg/h. In actual pipe extrusion against 200 bar die pressure, net output will be approx 70–80% of Qd (55–62 kg/h).',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'D_mm', name: 'Screw Diameter D (mm)', unit: 'mm', defaultVal: 65, min: 25, max: 150, step: 5 },
        { symbol: 'H_mm', name: 'Channel Depth H (mm)', unit: 'mm', defaultVal: 3.5, min: 1, max: 10, step: 0.2 },
        { symbol: 'N_rpm', name: 'Screw Speed (RPM)', unit: 'RPM', defaultVal: 80, min: 10, max: 200, step: 5 },
        { symbol: 'melt_rho', name: 'Melt Density (g/cm³)', unit: 'g/cm³', defaultVal: 0.76, min: 0.6, max: 1.4, step: 0.02 }
      ],
      calculate: (inputs) => {
        const D = (inputs.D_mm || 65) / 10
        const H = (inputs.H_mm || 3.5) / 10
        const N = (inputs.N_rpm || 80) / 60
        const rho = inputs.melt_rho || 0.76
        const thetaRad = (17.65 * Math.PI) / 180
        const qdVol = 0.5 * Math.PI * Math.PI * D * D * H * N * Math.sin(thetaRad) * Math.cos(thetaRad)
        const massKgh = (qdVol * rho * 3600) / 1000
        return {
          value: Math.round(massKgh * 10) / 10,
          formatted: `${Math.round(massKgh * 10) / 10} kg/h (${Math.round(qdVol * 10) / 10} cm³/s)`,
          unit: 'kg/h',
          note: 'Theoretical maximum drag flow at zero head pressure.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-001', 'PH-FORM-PROC-002'],
    lesson_links: [{ lesson_id: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic', lesson_name: 'Single Screw Extrusion Drag Flow, Pressure Flow & Die Characteristic', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'Principles of Polymer Processing', author: 'Zeev Tadmor & Costas Gogos', publisher: 'Wiley-Interscience', edition: '2nd Edition', year: 2006, page: '360-375', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 3. MOULD DESIGN (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-MOULD-002',
    slug: 'injection-mould-cavity-shrinkage-sizing',
    name: 'Injection Mould Cavity Shrinkage Dimension Sizing Formula',
    short_name: 'Mould Cavity Sizing',
    subject_id: 'mould-design',
    subject_name: 'Mould & Die Design',
    category: 'Mould Cavity Engineering',
    type_code: 'T5',
    type_label: 'Processing / Machine',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'D_c = D_p \cdot (1 + S_l)',
    equation_display: 'Dc = Dp * (1 + Sl)',
    description: 'Calculates the required machined mould cavity dimension (Dc) from the desired cold molded plastic part dimension (Dp) and polymer linear shrinkage rate (Sl).',
    when_to_use: 'Use during CNC machining and EDM electrode sizing of injection mould cavities and cores to ensure final molded parts meet drawing tolerances.',
    assumptions: [
      'Uniform isotropic shrinkage across part section',
      'Standard ambient measurement at 23°C / 50% RH after 24-48 hours relaxation',
      'Optimum pack and hold pressure applied during moulding'
    ],
    common_mistakes: [
      'Ignoring differential shrinkage between flow direction and transverse direction in fiber-filled resins',
      'Neglecting post-molding crystallization shrinkage in semi-crystalline POM, PA, and PBT'
    ],
    variables: [
      { symbol: 'D_c', meaning: 'Machined mould cavity dimension', unit: 'mm', dimension: 'Length', required: true },
      { symbol: 'D_p', meaning: 'Required nominal part drawing dimension', unit: 'mm', dimension: 'Length', required: true, example_value: '50.00', min: 1, max: 1000, step: 0.1, default_num: 50.00 },
      { symbol: 'S_l', meaning: 'Linear shrinkage rate fraction (e.g., 2% = 0.020)', unit: 'fraction (mm/mm)', dimension: 'dimensionless', required: true, example_value: '0.020', min: 0.001, max: 0.050, step: 0.001, default_num: 0.020 }
    ],
    examples: [
      {
        title: '50.00 mm POM Acetal Gear Diameter Cavity Sizing',
        problem_statement: 'A precision acetal (POM homopolymer) spur gear requires finished outside diameter Dp = 50.00 mm. Acetal linear shrinkage is 2.0% (Sl = 0.020). Determine the CNC cavity machining diameter.',
        given_values: { 'Dp': '50.00 mm', 'Sl': '0.020 (2.0%)' },
        steps: [
          'Apply shrinkage equation: Dc = Dp * (1 + Sl)',
          'Substitute values: Dc = 50.00 * (1 + 0.020)',
          'Compute cavity dimension: Dc = 50.00 * 1.020 = 51.00 mm'
        ],
        final_answer: 'Dc = 51.00 mm',
        unit: 'mm',
        engineering_interpretation: 'The CNC toolpath must cut the mould cavity to exactly 51.00 mm (+0.02/-0.00 mm) so that after cooling and post-mold shrinkage, the gear contracts to the nominal 50.00 mm drawing dimension.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'Dp_val', name: 'Nominal Part Dimension Dp (mm)', unit: 'mm', defaultVal: 50.0, min: 5, max: 500, step: 0.5 },
        { symbol: 'Sl_pct', name: 'Linear Shrinkage Rate (%)', unit: '%', defaultVal: 2.0, min: 0.2, max: 4.5, step: 0.1 }
      ],
      calculate: (inputs) => {
        const dp = inputs.Dp_val || 50.0
        const sl = (inputs.Sl_pct || 2.0) / 100
        const dc = dp * (1 + sl)
        const diff = dc - dp
        return {
          value: Math.round(dc * 1000) / 1000,
          formatted: `Dc = ${(Math.round(dc * 1000) / 1000).toFixed(3)} mm`,
          unit: 'mm',
          note: `Mould steel cavity is oversized by +${(Math.round(diff * 1000) / 1000).toFixed(3)} mm to compensate for resin cooling contraction.`
        }
      }
    },
    related_ids: ['PH-FORM-MOULD-001', 'PH-FORM-PROC-001'],
    lesson_links: [{ lesson_id: 'cavity-design-shrinkage-estimation-and-parting-line-selection', lesson_name: 'Cavity Design, Shrinkage Estimation & Parting Line Selection', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Injection Molds for Beginners', author: 'Rainer Dangel', publisher: 'Hanser', edition: '2nd Edition', year: 2020, page: '82-88', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 4. POLYMER RHEOLOGY (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-RHEO-002',
    slug: 'wlf-equation-temperature-shift-factor',
    name: 'Williams-Landel-Ferry (WLF) Shift Factor Equation',
    short_name: 'WLF Equation',
    subject_id: 'polymer-rheology',
    subject_name: 'Polymer Rheology & Melt Flow',
    category: 'Time-Temperature Superposition (TTS)',
    type_code: 'T4',
    type_label: 'Rheology / Flow',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\log a_T = \frac{-C_1 (T - T_g)}{C_2 + (T - T_g)}',
    equation_display: 'log(aT) = -C1 * (T - Tg) / (C2 + (T - Tg))',
    description: 'Calculates the horizontal shift factor aT for constructing viscoelastic master curves across temperatures from Tg up to Tg + 100°C based on fractional free volume expansion.',
    when_to_use: 'Use when applying Time-Temperature Superposition (TTS) to predict long-term polymer creep, relaxation modulus, and dynamic shear storage/loss moduli.',
    assumptions: [
      'Temperature regime is between Tg and Tg + 100°C',
      'Universal constants C1 = 17.44 and C2 = 51.6 K for reference state at Tg',
      'Free volume increases linearly above Tg'
    ],
    common_mistakes: [
      'Applying the WLF equation at temperatures far above Tg + 100°C (Arrhenius relation applies at T > Tg + 100°C)',
      'Mixing up Celsius and Kelvin temperature differences'
    ],
    variables: [
      { symbol: '\log a_T', meaning: 'Logarithm of temperature shift factor', unit: 'dimensionless', dimension: 'dimensionless', required: true },
      { symbol: 'T', meaning: 'Experimental test temperature', unit: '°C (or K)', dimension: 'Temperature', required: true, example_value: '130', min: -50, max: 300, step: 1, default_num: 130 },
      { symbol: 'T_g', meaning: 'Polymer glass transition temperature', unit: '°C (or K)', dimension: 'Temperature', required: true, example_value: '100', min: -100, max: 250, step: 1, default_num: 100 },
      { symbol: 'C_1', meaning: 'Universal WLF constant C1', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '17.44', min: 10, max: 25, step: 0.1, default_num: 17.44 },
      { symbol: 'C_2', meaning: 'Universal WLF constant C2', unit: 'K', dimension: 'Temperature', required: true, example_value: '51.6', min: 30, max: 80, step: 0.5, default_num: 51.6 }
    ],
    examples: [
      {
        title: 'Polystyrene Rheological Time Shift at 30°C Above Tg',
        problem_statement: 'For Polystyrene with Tg = 100°C, calculate the shift factor log(aT) and shift multiplier aT at test temperature T = 130°C using standard WLF constants C1 = 17.44 and C2 = 51.6 K.',
        given_values: { 'T': '130°C', 'Tg': '100°C', 'C1': '17.44', 'C2': '51.6 K' },
        steps: [
          'Calculate temperature difference: T - Tg = 130 - 100 = 30 K',
          'Evaluate numerator: -17.44 * 30 = -523.2',
          'Evaluate denominator: 51.6 + 30 = 81.6',
          'Calculate log(aT): -523.2 / 81.6 = -6.41',
          'Calculate aT: 10^(-6.41) = 3.89 × 10^-7'
        ],
        final_answer: 'log(aT) = -6.41 (aT = 3.89 × 10^-7)',
        unit: 'dimensionless',
        engineering_interpretation: 'At 130°C, molecular relaxation processes occur approximately 2.5 million times faster than at Tg, compressing long-term creep timescales into laboratory testing windows.',
        difficulty: 'advanced'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'T_exp', name: 'Test Temperature T (°C)', unit: '°C', defaultVal: 130, min: -20, max: 250, step: 1 },
        { symbol: 'T_glass', name: 'Glass Transition Tg (°C)', unit: '°C', defaultVal: 100, min: -80, max: 200, step: 1 },
        { symbol: 'C1_val', name: 'WLF Constant C1', unit: 'dimensionless', defaultVal: 17.44, min: 10, max: 25, step: 0.1 },
        { symbol: 'C2_val', name: 'WLF Constant C2', unit: 'K', defaultVal: 51.6, min: 30, max: 80, step: 0.5 }
      ],
      calculate: (inputs) => {
        const T = inputs.T_exp || 130
        const Tg = inputs.T_glass || 100
        const C1 = inputs.C1_val || 17.44
        const C2 = inputs.C2_val || 51.6
        const deltaT = T - Tg
        if (C2 + deltaT <= 0) {
          return { value: 0, formatted: 'Invalid Temperature (Outside WLF Range)', unit: 'log(aT)', status: 'critical', note: 'Denominator C2 + (T - Tg) must be > 0.' }
        }
        const logAt = (-C1 * deltaT) / (C2 + deltaT)
        const at = Math.pow(10, logAt)
        return {
          value: Math.round(logAt * 100) / 100,
          formatted: `log(aT) = ${(Math.round(logAt * 100) / 100).toFixed(2)} (aT = ${at.toExponential(2)})`,
          unit: 'dimensionless',
          note: `Temperature shift of ${deltaT} K above Tg.`
        }
      }
    },
    related_ids: ['PH-FORM-RHEO-001'],
    lesson_links: [{ lesson_id: 'viscoelasticity-and-time-temperature-superposition-wlf-equation', lesson_name: 'Viscoelasticity & Time-Temperature Superposition (WLF Equation)', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'paper', title: 'Temperature Dependence of Relaxation Mechanisms in Amorphous Polymers', author: 'M.L. Williams, R.F. Landel, J.D. Ferry', publisher: 'J. Am. Chem. Soc.', edition: 'Vol 77', year: 1955, page: '3701-3707', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 5. POLYMER TESTING (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-TEST-002',
    slug: 'dsc-degree-of-crystallinity-formula',
    name: 'DSC Degree of Crystallinity Percentage Formula',
    short_name: 'DSC Crystallinity (Xc)',
    subject_id: 'polymer-testing',
    subject_name: 'Polymer Testing & Quality Control',
    category: 'Thermal Characterization',
    type_code: 'T9',
    type_label: 'Testing / Standards',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'X_c = \frac{\Delta H_m - \Delta H_{cc}}{\Delta H_m^0 \cdot (1 - w_f)} \times 100',
    equation_display: 'Xc = [ (Delta Hm - Delta Hcc) / (Delta Hm0 * (1 - wf)) ] * 100',
    description: 'Determines the weight percentage degree of crystallinity (Xc) in semi-crystalline polymers from Differential Scanning Calorimetry (DSC) endothermic melting enthalpy and cold crystallization enthalpy.',
    when_to_use: 'Use when analyzing polymer morphology, injection molding cooling rates, annealing effects, and barrier/mechanical stiffness properties.',
    assumptions: [
      'Known theoretical 100% crystalline enthalpy Delta Hm0 from literature',
      'Linear or sigmoidal baseline subtraction across melting transition peak',
      'Accurately determined inorganic filler weight fraction wf'
    ],
    common_mistakes: [
      'Ignoring cold crystallization enthalpy Delta Hcc in PET or PLA',
      'Forgetting to subtract inorganic filler weight fraction (1 - wf) in glass-filled compounds'
    ],
    variables: [
      { symbol: 'X_c', meaning: 'Degree of crystallinity', unit: '%', dimension: 'dimensionless', required: true },
      { symbol: '\Delta H_m', meaning: 'Measured melting enthalpy peak area', unit: 'J/g', dimension: 'Energy/Mass', required: true, example_value: '95.5', min: 10, max: 250, step: 0.5, default_num: 95.5 },
      { symbol: '\Delta H_{cc}', meaning: 'Cold crystallization enthalpy (if present)', unit: 'J/g', dimension: 'Energy/Mass', required: false, example_value: '0.0', min: 0, max: 100, step: 0.5, default_num: 0.0 },
      { symbol: '\Delta H_m^0', meaning: 'Melting enthalpy of 100% crystalline polymer', unit: 'J/g', dimension: 'Energy/Mass', required: true, example_value: '207.1', min: 50, max: 350, step: 1, default_num: 207.1 },
      { symbol: 'w_f', meaning: 'Weight fraction of non-crystallizable filler/reinforcement', unit: 'fraction', dimension: 'dimensionless', required: false, example_value: '0.0', min: 0, max: 0.6, step: 0.05, default_num: 0.0 }
    ],
    examples: [
      {
        title: 'Isotactic Polypropylene (iPP) DSC Crystallinity Measurement',
        problem_statement: 'A moulded Polypropylene sample displays a DSC melting peak enthalpy Delta Hm = 98.4 J/g. Given that 100% crystalline iPP has Delta Hm0 = 207.1 J/g and the sample has no filler (wf = 0), calculate Xc.',
        given_values: { 'Delta Hm': '98.4 J/g', 'Delta Hm0': '207.1 J/g', 'Delta Hcc': '0 J/g', 'wf': '0' },
        steps: [
          'Apply formula: Xc = (Delta Hm - Delta Hcc) / (Delta Hm0 * (1 - wf)) * 100',
          'Substitute values: Xc = (98.4 - 0) / (207.1 * 1.0) * 100',
          'Calculate: 98.4 / 207.1 * 100 = 47.51%'
        ],
        final_answer: 'Xc = 47.5%',
        unit: '%',
        engineering_interpretation: 'The moulded PP part has 47.5% crystalline lamellae, providing the expected balance of flexural modulus (>1300 MPa) and impact toughness.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'dH_m', name: 'Melting Enthalpy Delta Hm (J/g)', unit: 'J/g', defaultVal: 98.4, min: 10, max: 250, step: 0.5 },
        { symbol: 'dH_cc', name: 'Cold Cryst. Delta Hcc (J/g)', unit: 'J/g', defaultVal: 0.0, min: 0, max: 80, step: 0.5 },
        { symbol: 'dH_zero', name: '100% Cryst. Delta Hm0 (J/g)', unit: 'J/g', defaultVal: 207.1, min: 50, max: 300, step: 1 },
        { symbol: 'w_filler', name: 'Filler Weight Fraction (0-0.5)', unit: 'fraction', defaultVal: 0.0, min: 0, max: 0.5, step: 0.05 }
      ],
      calculate: (inputs) => {
        const dHm = inputs.dH_m || 98.4
        const dHcc = inputs.dH_cc || 0.0
        const dHm0 = inputs.dH_zero || 207.1
        const wf = inputs.w_filler || 0.0
        const netEnthalpy = Math.max(0, dHm - dHcc)
        const xc = (netEnthalpy / (dHm0 * (1 - wf))) * 100
        return {
          value: Math.round(xc * 10) / 10,
          formatted: `Xc = ${Math.round(xc * 10) / 10}%`,
          unit: '%',
          note: `Net heat of fusion: ${Math.round(netEnthalpy * 10) / 10} J/g.`
        }
      }
    },
    related_ids: ['PH-FORM-TEST-001'],
    lesson_links: [{ lesson_id: 'dsc-and-tga-crystallinity-and-thermal-degradation', lesson_name: 'DSC & TGA Crystallinity & Thermal Degradation', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Thermal Analysis of Polymers: Fundamentals and Applications', author: 'Joseph D. Menczel', publisher: 'Wiley', edition: '1st Edition', year: 2009, page: '112-118', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 6. PLASTIC PACKAGING (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-PACK-002',
    slug: 'water-vapor-transmission-rate-wvtr-film',
    name: 'Water Vapor Transmission Rate (WVTR) Through Barrier Films',
    short_name: 'WVTR Barrier Formula',
    subject_id: 'plastic-packaging-engineering',
    subject_name: 'Plastic Packaging Engineering',
    category: 'Barrier & Permeation',
    type_code: 'T7',
    type_label: 'Transport / Barrier',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'WVTR = \frac{P_{H_2O} \cdot \Delta p_{H_2O}}{l}',
    equation_display: 'WVTR = (P_H2O * Delta_p_H2O) / l',
    description: 'Calculates the steady-state water vapor transmission rate (WVTR) across a barrier packaging film under specified relative humidity and temperature gradients (ASTM F1249 / ISO 15106).',
    when_to_use: 'Use when engineering moisture barrier films for pharmaceutical blister packs, snack packaging, and desiccated electronic moisture-sensitive components.',
    assumptions: [
      'Steady-state Fickian diffusion with constant permeability coefficient',
      '100% relative humidity on upstream side and 0% on downstream dry sensor side',
      'No pinholes, micro-voids, or flex-crack defects'
    ],
    common_mistakes: [
      'Confusing OTR (Oxygen Transmission Rate) units with WVTR (Water Vapor Transmission Rate) units',
      'Ignoring temperature dependence (WVTR approximately doubles every 10°C temperature rise)'
    ],
    variables: [
      { symbol: 'WVTR', meaning: 'Water vapor transmission rate', unit: 'g/(m²·day)', dimension: 'Mass/(Area·Time)', required: true },
      { symbol: 'P_{H_2O}', meaning: 'Water vapor permeability of polymer', unit: 'g·mil/(100 in²·day) or g·mm/(m²·day)', dimension: 'Permeability', required: true, example_value: '0.08', min: 0.001, max: 5.0, step: 0.005, default_num: 0.08 },
      { symbol: 'l', meaning: 'Film barrier thickness', unit: 'μm (microns)', dimension: 'Length', required: true, example_value: '25', min: 5, max: 250, step: 5, default_num: 25 }
    ],
    examples: [
      {
        title: 'Biaxially Oriented Polypropylene (BOPP) 25 μm Moisture Barrier',
        problem_statement: 'A metallized BOPP film has thickness l = 25 μm and water vapor permeance coefficient producing WVTR = 0.85 g/(m²·day) at 38°C / 90% RH. Calculate moisture ingress over 180 days across a 0.04 m² pouch.',
        given_values: { 'WVTR': '0.85 g/(m²·day)', 'Area': '0.04 m²', 'Time': '180 days' },
        steps: [
          'Calculate daily transmission: 0.85 g/(m²·day) * 0.04 m² = 0.034 g/day',
          'Multiply by shelf life: 0.034 g/day * 180 days = 6.12 grams of moisture'
        ],
        final_answer: '6.12 grams moisture ingress',
        unit: 'grams',
        engineering_interpretation: 'The 25 μm metallized BOPP barrier successfully limits moisture ingress to under 6.5 g, maintaining crispness and preventing rancidity for dry snack shelf life.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'film_wvtr', name: 'Film WVTR (g/m²·day)', unit: 'g/m²·day', defaultVal: 0.85, min: 0.05, max: 25, step: 0.1 },
        { symbol: 'pouch_area', name: 'Package Surface Area (m²)', unit: 'm²', defaultVal: 0.04, min: 0.01, max: 0.5, step: 0.01 },
        { symbol: 'shelf_days', name: 'Shelf Life Duration (Days)', unit: 'Days', defaultVal: 180, min: 10, max: 730, step: 10 }
      ],
      calculate: (inputs) => {
        const wvtr = inputs.film_wvtr || 0.85
        const area = inputs.pouch_area || 0.04
        const days = inputs.shelf_days || 180
        const totalWater = wvtr * area * days
        return {
          value: Math.round(totalWater * 100) / 100,
          formatted: `${(Math.round(totalWater * 100) / 100).toFixed(2)} grams H2O`,
          unit: 'grams',
          note: `Daily moisture ingress: ${(wvtr * area).toFixed(4)} g/day.`
        }
      }
    },
    related_ids: ['PH-FORM-PACK-001'],
    lesson_links: [{ lesson_id: 'barrier-polymers-evoh-pvdc-and-gas-permeability-math', lesson_name: 'Barrier Polymers (EVOH, PVDC) & Gas Permeability Math', relationship: 'applied' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Plastic Packaging: Properties, Processing, Applications, and Regulations', author: 'Susan E. M. Selke & John D. Culter', publisher: 'Hanser', edition: '3rd Edition', year: 2016, page: '240-248', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 7. SUSTAINABLE PLASTICS (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-SUST-002',
    slug: 'biobased-carbon-content-percentage-astm-d6866',
    name: 'Biobased Carbon Content Percentage Formula (ASTM D6866)',
    short_name: 'Biobased Carbon Content',
    subject_id: 'sustainable-plastics',
    subject_name: 'Sustainable Plastics & Circular Economy',
    category: 'Bio-Content Standards',
    type_code: 'T11',
    type_label: 'Sustainability / LCA',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\text{Biobased Carbon \%} = \frac{^{14}\text{C}_{sample}}{^{14}\text{C}_{modern}} \times 100',
    equation_display: 'Biobased Carbon % = (14C_sample / 14C_modern) * 100',
    description: 'Measures the percentage of renewable modern bio-based carbon relative to total organic carbon in polymers using Accelerator Mass Spectrometry (AMS) radiocarbon dating (ASTM D6866).',
    when_to_use: 'Use when certifying bio-PE, bio-PET, PLA blends, and USDA BioPreferred label compliance.',
    assumptions: [
      'Petrochemical fossil carbon contains zero detectable 14C (half-life 5730 years; fossil feedstocks are >100 million years old)',
      'Modern atmospheric biological carbon has standard 14C activity reference',
      'Clean organic combustion to graphite target for AMS detection'
    ],
    common_mistakes: [
      'Confusing biobased carbon percentage (fraction of carbon atoms) with total biobased product weight fraction (which includes oxygen/hydrogen)',
      'Assuming biodegradable polymers are automatically 100% biobased (e.g., PBAT is fossil-derived biodegradable)'
    ],
    variables: [
      { symbol: 'Biobased\% ', meaning: 'Biobased carbon content', unit: '% of Total Organic Carbon', dimension: 'fraction', required: true },
      { symbol: '^{14}\text{C}_{sample}', meaning: 'Measured 14C isotope activity in sample', unit: 'pMC (percent Modern Carbon)', dimension: 'Activity', required: true, example_value: '31.5', min: 0, max: 120, step: 0.5, default_num: 31.5 },
      { symbol: '^{14}\text{C}_{modern}', meaning: 'Standard modern reference radiocarbon activity', unit: 'pMC', dimension: 'Activity', required: true, example_value: '100.0', min: 95, max: 105, step: 0.1, default_num: 100.0 }
    ],
    examples: [
      {
        title: 'Bio-PET Beverage Bottle Resin Biobased Carbon Verification',
        problem_statement: 'Bio-PET synthesized from bio-based ethylene glycol (30 wt% of PET molecule) and fossil PTA has 14C sample activity measured at 20.0 pMC against 100 pMC modern standard. Calculate biobased carbon content.',
        given_values: { '14C_sample': '20.0 pMC', '14C_modern': '100.0 pMC' },
        steps: [
          'Apply ASTM D6866 formula: Biobased Carbon % = (20.0 / 100.0) * 100',
          'Calculate: 20.0%'
        ],
        final_answer: '20.0% Biobased Carbon',
        unit: '%',
        engineering_interpretation: 'The Bio-PET bottle contains 20% renewable biogenic carbon atoms (derived from sugarcane bio-MEG), meeting USDA BioPreferred certification minimum threshold for biobased polyester.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'pMC_sample', name: 'Measured 14C Activity (pMC)', unit: 'pMC', defaultVal: 20.0, min: 0, max: 110, step: 0.5 },
        { symbol: 'pMC_ref', name: 'Modern Reference Activity (pMC)', unit: 'pMC', defaultVal: 100.0, min: 95, max: 105, step: 0.5 }
      ],
      calculate: (inputs) => {
        const sample = inputs.pMC_sample || 20.0
        const ref = inputs.pMC_ref || 100.0
        const bioPct = (sample / ref) * 100
        return {
          value: Math.round(bioPct * 10) / 10,
          formatted: `${Math.round(bioPct * 10) / 10}% Biobased Carbon`,
          unit: '%',
          note: bioPct >= 20 ? 'Qualifies for USDA BioPreferred certification.' : 'Below minimum biobased threshold for certification.'
        }
      }
    },
    related_ids: ['PH-FORM-SUST-001'],
    lesson_links: [{ lesson_id: 'pla-synthesis-properties-industrial-composting', lesson_name: 'PLA Synthesis, Properties & Industrial Composting', relationship: 'applied' }],
    tool_links: [],
    sources: [{ source_type: 'standard', title: 'Standard Test Methods for Determining the Biobased Content of Solid, Liquid, and Gaseous Samples Using Radiocarbon Analysis', author: 'ASTM Committee D20', publisher: 'ASTM International', edition: 'ASTM D6866-24', year: 2024, page: '1-12', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 8. RECYCLING TECHNOLOGY ====================
  {
    formula_id: 'PH-FORM-RECY-001',
    slug: 'mechanical-recycling-mass-balance-flake-yield',
    name: 'Mechanical Recycling Mass Balance & Washing Flake Yield',
    short_name: 'Recycling Flake Yield',
    subject_id: 'recycling-technology',
    subject_name: 'Recycling Technology & Processing',
    category: 'Mechanical Recycling Operations',
    type_code: 'T11',
    type_label: 'Sustainability / LCA',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'Y_{flake} = \frac{M_{clean\_flake}}{M_{raw\_bales}} \times 100',
    equation_display: 'Y_flake = (M_clean_flake / M_raw_bales) * 100',
    description: 'Calculates the net industrial yield percentage of clean, hot-washed flakes produced from raw baled post-consumer plastic waste after accounting for label, cap, dirt, and moisture losses.',
    when_to_use: 'Use when budgeting PET bottle washing plants, calculating recycling unit economics, and verifying mass-balance audits for CPCB EPR recycling credits.',
    assumptions: [
      'Accurate weighbridge mass tracking for input bales and output gaylords/silos',
      'Moisture content of finished clean flakes is <1.0% after spin drying',
      'All reject streams (sludge, labels, PO caps, fines) are mass-accounted'
    ],
    common_mistakes: [
      'Neglecting moisture in incoming wet bales during rainy season',
      'Failing to separate polyolefin cap yield (HDPE/PP) from clear PET flake yield'
    ],
    variables: [
      { symbol: 'Y_{flake}', meaning: 'Net clean flake recovery yield', unit: '%', dimension: 'fraction', required: true },
      { symbol: 'M_{clean\_flake}', meaning: 'Mass of clean hot-washed flakes produced', unit: 'Tonnes', dimension: 'Mass', required: true, example_value: '720', min: 10, max: 10000, step: 10, default_num: 720 },
      { symbol: 'M_{raw\_bales}', meaning: 'Mass of raw incoming post-consumer bales', unit: 'Tonnes', dimension: 'Mass', required: true, example_value: '1000', min: 10, max: 10000, step: 10, default_num: 1000 }
    ],
    examples: [
      {
        title: '1,000 Tonne PET Bottle Washing Plant Yield Audit',
        problem_statement: 'A recycling wash plant in Gujarat processes 1,000 Tonnes of post-consumer baled PET bottles. Process losses: 12% moisture & dirt, 6% PP/HDPE bottle caps, 8% PVC/OPP labels and fines, 2% color reject bottles. Determine clean rPET flake yield.',
        given_values: { 'Input Bales': '1,000 Tonnes', 'Total Loss': '12% + 6% + 8% + 2% = 28%' },
        steps: [
          'Calculate total percentage loss: 28%',
          'Calculate clean flake mass: 1,000 Tonnes * (1 - 0.28) = 720 Tonnes',
          'Calculate yield: (720 / 1000) * 100 = 72.0%'
        ],
        final_answer: 'Yield = 72.0% (720 Tonnes Clean rPET Flakes)',
        unit: '%',
        engineering_interpretation: 'A 72% net flake yield is benchmark performance for Indian municipal collection streams. The 60 Tonnes of separated HDPE/PP caps represent a secondary revenue stream at ₹45–55/kg.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'bale_input', name: 'Raw Bale Input (Tonnes)', unit: 'Tonnes', defaultVal: 1000, min: 10, max: 5000, step: 25 },
        { symbol: 'dirt_loss', name: 'Dirt & Moisture Loss (%)', unit: '%', defaultVal: 12.0, min: 2, max: 25, step: 0.5 },
        { symbol: 'label_loss', name: 'Labels & Adhesives Loss (%)', unit: '%', defaultVal: 8.0, min: 2, max: 15, step: 0.5 },
        { symbol: 'cap_fraction', name: 'Caps & Closures Separated (%)', unit: '%', defaultVal: 6.0, min: 2, max: 10, step: 0.5 }
      ],
      calculate: (inputs) => {
        const input = inputs.bale_input || 1000
        const dirt = inputs.dirt_loss || 12.0
        const labels = inputs.label_loss || 8.0
        const caps = inputs.cap_fraction || 6.0
        const totalLossPct = dirt + labels + caps + 2.0
        const cleanFlake = input * (1 - totalLossPct / 100)
        const yieldPct = (cleanFlake / input) * 100
        return {
          value: Math.round(yieldPct * 10) / 10,
          formatted: `${Math.round(yieldPct * 10) / 10}% Yield (${Math.round(cleanFlake)} Tonnes Flake)`,
          unit: '%',
          note: `Total reject loss is ${totalLossPct}%. Also generates ${Math.round((input * caps) / 100)} Tonnes PO caps.`
        }
      }
    },
    related_ids: ['PH-FORM-SUST-001'],
    lesson_links: [{ lesson_id: 'mechanical-recycling-sorting-washing-decontamination-pelletizing', lesson_name: 'Mechanical Recycling: Sorting, Washing, Decontamination & Pelletizing', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Recycling of Plastics', author: 'Francesco Paolo La Mantia', publisher: 'ChemTec Publishing', edition: '1st Edition', year: 2002, page: '145-152', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 9. RUBBER TECHNOLOGY (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-RUBB-002',
    slug: 'mooney-rivlin-rubber-strain-energy-density',
    name: 'Mooney-Rivlin Strain Energy Density Equation (Hyperelasticity)',
    short_name: 'Mooney-Rivlin Model',
    subject_id: 'rubber-technology',
    subject_name: 'Rubber & Elastomer Technology',
    category: 'Hyperelastic Constitutive Models',
    type_code: 'T6',
    type_label: 'Mechanics / Strength',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: 'W = C_{10} (I_1 - 3) + C_{01} (I_2 - 3)',
    equation_display: 'W = C10 * (I1 - 3) + C01 * (I2 - 3)',
    description: 'Phenomenological hyperelastic model expressing strain energy density function W for vulcanized elastomers undergoing moderate deformations up to 100–200% strain.',
    when_to_use: 'Use in FEA nonlinear simulation of rubber O-rings, tyres, engine mounts, and elastomeric seals undergoing large elastic deformation.',
    assumptions: [
      'Isotropic, incompressible material behavior (I3 = 1)',
      'Valid for moderate elongation ratios (lambda < 2.5) before non-Gaussian strain hardening',
      'Reversible hyperelastic deformation without Mullins stress-softening effect'
    ],
    common_mistakes: [
      'Extrapolating beyond 250% elongation where finite chain extensibility causes severe upward stress deviation',
      'Using linear Hooke’s law Young’s modulus E for large deformation rubber problems'
    ],
    variables: [
      { symbol: 'W', meaning: 'Strain energy density per unit undeformed volume', unit: 'MJ/m³ (or MPa)', dimension: 'Energy/Volume', required: true },
      { symbol: 'C_{10}', meaning: 'First Mooney-Rivlin material constant (crosslink network term)', unit: 'MPa', dimension: 'Pressure', required: true, example_value: '0.40', min: 0.05, max: 5.0, step: 0.05, default_num: 0.40 },
      { symbol: 'C_{01}', meaning: 'Second Mooney-Rivlin material constant (chain entanglement term)', unit: 'MPa', dimension: 'Pressure', required: true, example_value: '0.10', min: 0.01, max: 2.0, step: 0.01, default_num: 0.10 },
      { symbol: 'I_1', meaning: 'First invariant of Cauchy-Green deformation tensor', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '3.25', min: 3.0, max: 10.0, step: 0.05, default_num: 3.25 },
      { symbol: 'I_2', meaning: 'Second invariant of Cauchy-Green deformation tensor', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '3.25', min: 3.0, max: 10.0, step: 0.05, default_num: 3.25 }
    ],
    examples: [
      {
        title: 'Natural Rubber Tyre Tread Strain Energy at 50% Elongation',
        problem_statement: 'For vulcanized NR compound with C10 = 0.40 MPa and C01 = 0.10 MPa under uniaxial stretch lambda = 1.5 (50% tensile strain). Calculate invariants I1, I2 and strain energy density W.',
        given_values: { 'lambda': '1.5', 'C10': '0.40 MPa', 'C01': '0.10 MPa' },
        steps: [
          'For uniaxial incompressible stretch: I1 = lambda^2 + 2/lambda = 1.5^2 + 2/1.5 = 2.25 + 1.333 = 3.583',
          'Calculate I2 = 2*lambda + 1/lambda^2 = 2*1.5 + 1/2.25 = 3.0 + 0.444 = 3.444',
          'Evaluate W: 0.40 * (3.583 - 3) + 0.10 * (3.444 - 3)',
          'W = 0.40 * 0.583 + 0.10 * 0.444 = 0.2332 + 0.0444 = 0.278 MPa'
        ],
        final_answer: 'W = 0.278 MJ/m³ (0.278 MPa)',
        unit: 'MJ/m³',
        engineering_interpretation: 'The compound stores 0.278 MJ/m³ elastic strain energy at 50% extension. Initial shear modulus G = 2*(C10 + C01) = 2*(0.40 + 0.10) = 1.00 MPa, with Young’s modulus E approx 3.0 MPa.',
        difficulty: 'advanced'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'lambda_val', name: 'Uniaxial Stretch Ratio (lambda)', unit: 'extension ratio', defaultVal: 1.5, min: 1.05, max: 2.5, step: 0.05 },
        { symbol: 'c10_val', name: 'Constant C10', unit: 'MPa', defaultVal: 0.40, min: 0.05, max: 2.0, step: 0.05 },
        { symbol: 'c01_val', name: 'Constant C01', unit: 'MPa', defaultVal: 0.10, min: 0.01, max: 1.0, step: 0.01 }
      ],
      calculate: (inputs) => {
        const lam = inputs.lambda_val || 1.5
        const c10 = inputs.c10_val || 0.40
        const c01 = inputs.c01_val || 0.10
        const I1 = lam * lam + 2 / lam
        const I2 = 2 * lam + 1 / (lam * lam)
        const W = c10 * (I1 - 3) + c01 * (I2 - 3)
        const G = 2 * (c10 + c01)
        return {
          value: Math.round(W * 1000) / 1000,
          formatted: `W = ${(Math.round(W * 1000) / 1000).toFixed(3)} MJ/m³`,
          unit: 'MJ/m³',
          note: `Initial shear modulus G0 = ${(Math.round(G * 100) / 100).toFixed(2)} MPa; Young's Modulus E0 ≈ ${(Math.round(3 * G * 100) / 100).toFixed(2)} MPa.`
        }
      }
    },
    related_ids: ['PH-FORM-RUBB-001'],
    lesson_links: [{ lesson_id: 'vulcanization-kinetics-and-crosslink-density-measurement', lesson_name: 'Vulcanization Kinetics & Crosslink Density Measurement', relationship: 'applied' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'The Physics of Rubber Elasticity', author: 'L.R.G. Treloar', publisher: 'Oxford University Press', edition: '3rd Edition', year: 2005, page: '211-224', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 10. POLYMER COMPOSITES (ADDITIONAL) ====================
  {
    formula_id: 'PH-FORM-COMP-002',
    slug: 'reuss-transverse-rule-of-mixtures-modulus',
    name: 'Reuss Transverse Rule of Mixtures Modulus (Inverse / Series Model)',
    short_name: 'Reuss Transverse Modulus',
    subject_id: 'polymer-composites',
    subject_name: 'Polymer Composites & Fiber Engineering',
    category: 'Micromechanics',
    type_code: 'T8',
    type_label: 'Composites',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\frac{1}{E_2} = \frac{V_f}{E_f} + \frac{1 - V_f}{E_m}',
    equation_display: '1 / E2 = (Vf / Ef) + ((1 - Vf) / Em)',
    description: 'Calculates the lower-bound transverse elastic modulus (E2) perpendicular to fiber alignment in continuous unidirectional fiber-reinforced composites under isostress assumption.',
    when_to_use: 'Use when calculating laminate ABD stiffness matrices, finite element composite ply orientations, and assessing matrix-dominated transverse stiffness.',
    assumptions: [
      'Constant stress across fiber and matrix (isostress / series model)',
      'Perfect fiber-matrix interfacial bonding without voids',
      'Linear elastic isotropic matrix and transversely isotropic fibers'
    ],
    common_mistakes: [
      'Using Voigt parallel rule of mixtures for transverse loading direction',
      'Forgetting to invert the result (E2 = 1 / [Vf/Ef + Vm/Em])'
    ],
    variables: [
      { symbol: 'E_2', meaning: 'Transverse composite Young’s modulus', unit: 'GPa', dimension: 'Pressure', required: true },
      { symbol: 'V_f', meaning: 'Fiber volume fraction (0.1 to 0.7)', unit: 'fraction', dimension: 'dimensionless', required: true, example_value: '0.60', min: 0.1, max: 0.8, step: 0.05, default_num: 0.60 },
      { symbol: 'E_f', meaning: 'Fiber tensile modulus', unit: 'GPa', dimension: 'Pressure', required: true, example_value: '230.0', min: 50, max: 600, step: 10, default_num: 230.0 },
      { symbol: 'E_m', meaning: 'Polymer matrix tensile modulus', unit: 'GPa', dimension: 'Pressure', required: true, example_value: '3.5', min: 1.0, max: 10.0, step: 0.1, default_num: 3.5 }
    ],
    examples: [
      {
        title: 'Carbon Fiber / Epoxy Prepreg Transverse Modulus E2',
        problem_statement: 'A unidirectional carbon fiber epoxy aerospace prepreg has fiber volume fraction Vf = 0.60. Carbon fiber modulus Ef = 230 GPa, epoxy matrix modulus Em = 3.5 GPa. Calculate longitudinal E1 (Voigt) and transverse E2 (Reuss).',
        given_values: { 'Vf': '0.60', 'Ef': '230 GPa', 'Em': '3.5 GPa' },
        steps: [
          'Calculate Voigt E1: 0.60 * 230 + 0.40 * 3.5 = 138 + 1.4 = 139.4 GPa',
          'Calculate Reuss 1/E2: (0.60 / 230) + (0.40 / 3.5)',
          'Term 1: 0.60 / 230 = 0.00261',
          'Term 2: 0.40 / 3.5 = 0.11429',
          'Sum = 0.11690 => Invert E2 = 1 / 0.11690 = 8.55 GPa'
        ],
        final_answer: 'E2 = 8.55 GPa (compared to E1 = 139.4 GPa)',
        unit: 'GPa',
        engineering_interpretation: 'While longitudinal modulus E1 reaches 139.4 GPa due to high-stiffness carbon fibers, transverse modulus E2 is only 8.55 GPa (matrix dominated), illustrating extreme mechanical anisotropy and necessitating cross-ply [0/90] or quasi-isotropic [0/±45/90] layup sequences.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'V_fib', name: 'Fiber Volume Fraction Vf', unit: 'fraction', defaultVal: 0.60, min: 0.1, max: 0.75, step: 0.05 },
        { symbol: 'E_fib', name: 'Fiber Modulus Ef (GPa)', unit: 'GPa', defaultVal: 230.0, min: 30, max: 500, step: 10 },
        { symbol: 'E_mat', name: 'Matrix Modulus Em (GPa)', unit: 'GPa', defaultVal: 3.5, min: 1.0, max: 8.0, step: 0.2 }
      ],
      calculate: (inputs) => {
        const vf = inputs.V_fib || 0.60
        const ef = inputs.E_fib || 230.0
        const em = inputs.E_mat || 3.5
        const vm = 1 - vf
        const invE2 = vf / ef + vm / em
        const e2 = 1 / invE2
        const e1 = vf * ef + vm * em
        return {
          value: Math.round(e2 * 10) / 10,
          formatted: `E2 = ${Math.round(e2 * 10) / 10} GPa (vs E1 = ${Math.round(e1 * 10) / 10} GPa)`,
          unit: 'GPa',
          note: `Anisotropy ratio E1/E2 is ${Math.round((e1 / e2) * 10) / 10}x.`
        }
      }
    },
    related_ids: ['PH-FORM-COMP-001'],
    lesson_links: [{ lesson_id: 'micromechanics-and-rule-of-mixtures-for-composites', lesson_name: 'Micromechanics & Rule of Mixtures for Composites', relationship: 'derived' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'Mechanics of Composite Materials', author: 'Robert M. Jones', publisher: 'CRC Press', edition: '2nd Edition', year: 1998, page: '92-99', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 11. ADDITIVES & COMPOUNDING ====================
  {
    formula_id: 'PH-FORM-ADD-001',
    slug: 'phr-to-weight-percentage-compounding-conversion',
    name: 'Parts Per Hundred Resin (PHR) to Weight Percentage Conversion',
    short_name: 'PHR to Weight %',
    subject_id: 'additives-compounding',
    subject_name: 'Additives & Compounding Technology',
    category: 'Formulation Mathematics',
    type_code: 'T1',
    type_label: 'Definition / Identity',
    difficulty: 'foundation',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: 'w_i = \frac{\text{PHR}_i}{100 + \sum_{j} \text{PHR}_j} \times 100',
    equation_display: 'wi = [ PHR_i / (100 + Sum(PHR_j)) ] * 100',
    description: 'Converts rubber and plastics recipe formulations written in Parts Per Hundred Resin (PHR) into exact weight percentage (wt%) for gravimetric feeder calibration.',
    when_to_use: 'Use when preparing twin-screw extruder loss-in-weight gravimetric feeder setpoints from laboratory rubber/PVC master formulation recipes.',
    assumptions: [
      'Resin base is fixed at exactly 100 parts by definition',
      'All liquid and solid components summed in mass units',
      'Zero volatile solvent loss during weighing'
    ],
    common_mistakes: [
      'Assuming PHR is identical to percentage (e.g., 40 PHR plasticizer is NOT 40% of the formulation)',
      'Forgetting to sum all additives in the denominator (plasticizer, stabilizer, filler, lubricant)'
    ],
    variables: [
      { symbol: 'w_i', meaning: 'Weight percentage of ingredient i', unit: 'wt%', dimension: 'fraction', required: true },
      { symbol: '\text{PHR}_i', meaning: 'Parts per hundred resin of component i', unit: 'PHR', dimension: 'fraction', required: true, example_value: '40.0', min: 0.1, max: 200, step: 0.5, default_num: 40.0 },
      { symbol: '\sum \text{PHR}_j', meaning: 'Sum of all additives in formulation', unit: 'PHR', dimension: 'fraction', required: true, example_value: '60.0', min: 0.5, max: 300, step: 1.0, default_num: 60.0 }
    ],
    examples: [
      {
        title: 'Flexible PVC Cable Compound DOP Plasticizer Conversion',
        problem_statement: 'A flexible PVC formulation contains: 100 PHR PVC resin, 40 PHR DOP plasticizer, 15 PHR CaCO3 filler, 3 PHR Ca-Zn stabilizer, 2 PHR lubricants. Total additives = 60 PHR. Convert 40 PHR DOP into wt%.',
        given_values: { 'PHR_DOP': '40', 'Total Additives': '60 PHR', 'Base Resin': '100 PHR' },
        steps: [
          'Total batch weight = 100 (PVC) + 60 (Additives) = 160 parts',
          'Calculate wt% DOP = (40 / 160) * 100 = 25.0 wt%',
          'Calculate wt% PVC = (100 / 160) * 100 = 62.5 wt%'
        ],
        final_answer: '25.0 wt% DOP (PVC = 62.5 wt%)',
        unit: 'wt%',
        engineering_interpretation: '40 PHR DOP equals exactly 25.0% by weight of the final compound. A twin-screw loss-in-weight feeder must dose DOP liquid at 25.0% of total plant throughput rate.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'target_phr', name: 'Additive Dosage (PHR)', unit: 'PHR', defaultVal: 40.0, min: 0.5, max: 150, step: 0.5 },
        { symbol: 'total_additive_phr', name: 'Total All Additives (PHR)', unit: 'PHR', defaultVal: 60.0, min: 1.0, max: 250, step: 1.0 }
      ],
      calculate: (inputs) => {
        const target = inputs.target_phr || 40.0
        const total = inputs.total_additive_phr || 60.0
        const denom = 100 + total
        const wtPct = (target / denom) * 100
        const baseResinPct = (100 / denom) * 100
        return {
          value: Math.round(wtPct * 10) / 10,
          formatted: `${Math.round(wtPct * 10) / 10} wt% (Resin is ${Math.round(baseResinPct * 10) / 10} wt%)`,
          unit: 'wt%',
          note: `Total batch mass is ${denom} parts per 100 parts resin.`
        }
      }
    },
    related_ids: [],
    lesson_links: [{ lesson_id: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants', lesson_name: 'PVC Formulation: Heat Stabilizers, Plasticizers & Lubricants', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Plastics Additives Handbook', author: 'Hans Zweifel', publisher: 'Hanser', edition: '5th Edition', year: 2001, page: '427-435', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 12. LIFE CYCLE ASSESSMENT (LCA) ====================
  {
    formula_id: 'PH-FORM-LCA-001',
    slug: 'global-warming-potential-gwp-carbon-footprint',
    name: 'Global Warming Potential (GWP) Carbon Footprint per kg Resin',
    short_name: 'GWP Carbon Footprint',
    subject_id: 'life-cycle-assessment',
    subject_name: 'Life Cycle Assessment (LCA)',
    category: 'Environmental Metrics',
    type_code: 'T11',
    type_label: 'Sustainability / LCA',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: true,
    equation_latex: '\text{GWP} = \sum_{i} (m_i \cdot EF_i) + (E_{elec} \cdot EF_{grid})',
    equation_display: 'GWP = Sum(m_i * EF_i) + (E_elec * EF_grid)',
    description: 'Computes cradle-to-gate Global Warming Potential (GWP in kg CO2e / kg polymer) according to ISO 14040/14044 methodology by summing raw material emissions and plant electrical grid consumption.',
    when_to_use: 'Use when preparing Environmental Product Declarations (EPD), corporate ESG greenhouse gas reports, and comparing virgin vs recycled resin environmental offsets.',
    assumptions: [
      'Cradle-to-gate boundary (feedstock extraction, cracking, polymerization, and granulation)',
      'Indian regional electrical grid emission factor EF_grid approx 0.82 kg CO2e / kWh',
      'Standard 100-year GWP horizon factors from IPCC AR6'
    ],
    common_mistakes: [
      'Comparing cradle-to-gate figures with cradle-to-grave figures (which include end-of-life incineration)',
      'Using European grid electricity factors (0.25–0.40) for manufacturing plants located in India (0.82)'
    ],
    variables: [
      { symbol: '\text{GWP}', meaning: 'Global Warming Potential', unit: 'kg CO2e / kg polymer', dimension: 'Mass/Mass', required: true },
      { symbol: 'm_i \cdot EF_i', meaning: 'Feedstock embodied carbon emissions', unit: 'kg CO2e / kg', dimension: 'Mass/Mass', required: true, example_value: '1.80', min: 0.1, max: 10.0, step: 0.1, default_num: 1.80 },
      { symbol: 'E_{elec}', meaning: 'Plant electrical energy consumption', unit: 'kWh / kg', dimension: 'Energy/Mass', required: true, example_value: '0.45', min: 0.1, max: 3.0, step: 0.05, default_num: 0.45 },
      { symbol: 'EF_{grid}', meaning: 'Electrical grid carbon intensity factor', unit: 'kg CO2e / kWh', dimension: 'Mass/Energy', required: true, example_value: '0.82', min: 0.2, max: 1.2, step: 0.02, default_num: 0.82 }
    ],
    examples: [
      {
        title: 'Virgin HDPE vs 100% Recycled rHDPE Carbon Footprint Comparison',
        problem_statement: 'Virgin HDPE has cradle-to-gate monomer carbon 1.70 kg CO2e/kg and polymerization energy 0.40 kWh/kg. Recycled rHDPE wash/extrusion requires zero virgin monomer (0.15 kg CO2e/kg transport/chemicals) and 0.50 kWh/kg electrical energy. Compute GWP for both at EF_grid = 0.82 kg CO2e/kWh.',
        given_values: { 'Virgin Monomer': '1.70', 'Virgin Elec': '0.40 kWh', 'Recycled Feed': '0.15', 'Recycled Elec': '0.50 kWh', 'EF_grid': '0.82' },
        steps: [
          'Virgin GWP = 1.70 + (0.40 * 0.82) = 1.70 + 0.328 = 2.03 kg CO2e / kg',
          'Recycled GWP = 0.15 + (0.50 * 0.82) = 0.15 + 0.410 = 0.56 kg CO2e / kg',
          'Calculate carbon reduction: (2.03 - 0.56) / 2.03 * 100 = 72.4%'
        ],
        final_answer: 'Virgin: 2.03 kg CO2e/kg | Recycled: 0.56 kg CO2e/kg (72.4% Reduction)',
        unit: 'kg CO2e / kg',
        engineering_interpretation: 'Switching 1,000 Tonnes of virgin HDPE to rHDPE saves 1,470 Tonnes of net CO2 equivalent emissions, unlocking substantial EPR environmental benefit credits.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'feed_ef', name: 'Feedstock Embodied Carbon (kg CO2e/kg)', unit: 'kg CO2e/kg', defaultVal: 1.70, min: 0.1, max: 5.0, step: 0.1 },
        { symbol: 'elec_kwh', name: 'Plant Energy Usage (kWh/kg)', unit: 'kWh/kg', defaultVal: 0.45, min: 0.1, max: 2.5, step: 0.05 },
        { symbol: 'grid_ef', name: 'Grid Factor (kg CO2e/kWh)', unit: 'kg CO2e/kWh', defaultVal: 0.82, min: 0.2, max: 1.1, step: 0.02 }
      ],
      calculate: (inputs) => {
        const feed = inputs.feed_ef || 1.70
        const elec = inputs.elec_kwh || 0.45
        const grid = inputs.grid_ef || 0.82
        const total = feed + elec * grid
        return {
          value: Math.round(total * 100) / 100,
          formatted: `${(Math.round(total * 100) / 100).toFixed(2)} kg CO2e / kg resin`,
          unit: 'kg CO2e/kg',
          note: `Electricity accounts for ${Math.round(((elec * grid) / total) * 100)}% of total carbon footprint.`
        }
      }
    },
    related_ids: ['PH-FORM-SUST-001'],
    lesson_links: [{ lesson_id: 'life-cycle-assessment-iso-14040-carbon-footprint-and-circularity-metrics', lesson_name: 'Life Cycle Assessment: ISO 14040, Carbon Footprint & Circularity Metrics', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'standard', title: 'Environmental management — Life cycle assessment — Requirements and guidelines', author: 'ISO TC 207', publisher: 'International Organization for Standardization', edition: 'ISO 14044:2006', year: 2006, page: '1-46', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 13. MEDICAL PLASTICS ====================
  {
    formula_id: 'PH-FORM-MED-001',
    slug: 'higuchi-model-polymeric-drug-release',
    name: 'Higuchi Model for Fickian Drug Release from Polymeric Matrices',
    short_name: 'Higuchi Drug Release',
    subject_id: 'medical-plastics',
    subject_name: 'Medical Plastics & Biocompatibility',
    category: 'Biomedical Delivery Systems',
    type_code: 'T7',
    type_label: 'Transport / Barrier',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: 'M_t = A \sqrt{D \cdot (2C_0 - C_s) \cdot C_s \cdot t}',
    equation_display: 'Mt = A * sqrt(D * (2*C0 - Cs) * Cs * t)',
    description: 'Classical square-root-of-time kinetic relation describing diffusion-controlled drug release from planar non-degradable polymeric matrices (EVA, PDMS, PMMA).',
    when_to_use: 'Use when modeling transdermal patches, contraceptive implants, or biomedical stent coatings where drug release is governed by Fickian matrix diffusion.',
    assumptions: [
      'Initial drug loading C0 is much greater than drug solubility Cs in matrix (C0 >> Cs)',
      'Pseudo-steady state diffusion with planar one-dimensional release geometry',
      'Constant diffusion coefficient D without polymer matrix swelling or dissolution'
    ],
    common_mistakes: [
      'Applying the Higuchi model to biodegradable polymers undergoing surface erosion',
      'Forgetting that release fraction plotted against sqrt(t) must yield a straight line passing through the origin'
    ],
    variables: [
      { symbol: 'M_t / A', meaning: 'Cumulative drug released per unit surface area', unit: 'mg/cm²', dimension: 'Mass/Area', required: true },
      { symbol: 'C_0', meaning: 'Initial drug concentration in polymer matrix', unit: 'mg/cm³', dimension: 'Mass/Volume', required: true, example_value: '50.0', min: 5, max: 200, step: 1, default_num: 50.0 },
      { symbol: 'C_s', meaning: 'Drug saturation solubility in polymer matrix', unit: 'mg/cm³', dimension: 'Mass/Volume', required: true, example_value: '2.5', min: 0.1, max: 20, step: 0.1, default_num: 2.5 },
      { symbol: 'D', meaning: 'Drug diffusion coefficient in polymer matrix', unit: 'cm²/s', dimension: 'Area/Time', required: true, example_value: '1.2e-8', min: 1e-10, max: 1e-6, step: 1e-9, default_num: 1.2e-8 },
      { symbol: 't', meaning: 'Release time duration', unit: 'hours', dimension: 'Time', required: true, example_value: '24', min: 1, max: 720, step: 1, default_num: 24 }
    ],
    examples: [
      {
        title: 'Silicone PDMS Subdermal Implant Drug Release',
        problem_statement: 'A planar silicone implant with area A = 2.0 cm² contains initial drug load C0 = 50 mg/cm³ and solubility Cs = 2.0 mg/cm³. Diffusion coefficient D = 1.0 × 10^-8 cm²/s. Calculate cumulative drug released after 24 hours (86,400 s).',
        given_values: { 'A': '2.0 cm²', 'C0': '50 mg/cm³', 'Cs': '2.0 mg/cm³', 'D': '1.0e-8 cm²/s', 't': '86,400 s' },
        steps: [
          'Calculate term (2*C0 - Cs) * Cs: (100 - 2) * 2 = 98 * 2 = 196 mg²/cm^6',
          'Multiply by D * t: 1.0e-8 * 86,400 * 196 = 8.64e-4 * 196 = 0.1693 mg²/cm^4',
          'Take square root: sqrt(0.1693) = 0.4115 mg/cm²',
          'Multiply by area A = 2.0 cm²: Mt = 2.0 * 0.4115 = 0.823 mg'
        ],
        final_answer: 'Mt = 0.823 mg released in 24 hours',
        unit: 'mg',
        engineering_interpretation: 'The square-root-of-time dependence delivers 0.82 mg in the first 24 hours. Release rate gradually decreases as the depletion boundary recedes into the polymeric matrix.',
        difficulty: 'advanced'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'C0_val', name: 'Initial Drug Load C0 (mg/cm³)', unit: 'mg/cm³', defaultVal: 50.0, min: 10, max: 150, step: 5 },
        { symbol: 'Cs_val', name: 'Drug Solubility Cs (mg/cm³)', unit: 'mg/cm³', defaultVal: 2.0, min: 0.2, max: 10, step: 0.2 },
        { symbol: 'A_val', name: 'Matrix Surface Area (cm²)', unit: 'cm²', defaultVal: 2.0, min: 0.5, max: 10, step: 0.5 },
        { symbol: 't_hours', name: 'Time Duration (hours)', unit: 'hours', defaultVal: 24, min: 1, max: 168, step: 1 }
      ],
      calculate: (inputs) => {
        const C0 = inputs.C0_val || 50.0
        const Cs = inputs.Cs_val || 2.0
        const A = inputs.A_val || 2.0
        const tSec = (inputs.t_hours || 24) * 3600
        const D = 1.0e-8
        const term = D * (2 * C0 - Cs) * Cs * tSec
        const mtPerA = Math.sqrt(term)
        const mt = A * mtPerA
        return {
          value: Math.round(mt * 1000) / 1000,
          formatted: `${(Math.round(mt * 1000) / 1000).toFixed(3)} mg total released`,
          unit: 'mg',
          note: `Release flux is ${(Math.round(mtPerA * 1000) / 1000).toFixed(3)} mg/cm².`
        }
      }
    },
    related_ids: ['PH-FORM-PACK-001'],
    lesson_links: [{ lesson_id: 'biocompatible-polymers-iso-10993-usp-class-vi-and-sterilization', lesson_name: 'Biocompatible Polymers: ISO 10993, USP Class VI & Sterilization', relationship: 'applied' }],
    tool_links: [],
    sources: [{ source_type: 'paper', title: 'Mechanism of Sustained-Action Medication: Theoretical Analysis of Rate of Release of Solid Drugs Dispersed in Solid Matrices', author: 'Takeru Higuchi', publisher: 'J. Pharm. Sci.', edition: 'Vol 52', year: 1963, page: '1145-1149', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 14. DIGITAL TWINS & AI ====================
  {
    formula_id: 'PH-FORM-DIGI-001',
    slug: 'cavity-pressure-integral-injection-mould-work',
    name: 'Cavity Pressure Integral (Mould Cavity Energy Work Done)',
    short_name: 'Cavity Pressure Integral',
    subject_id: 'digital-twins-plastics',
    subject_name: 'Digital Twins, Industry 4.0 & AI',
    category: 'In-Line Sensor Analytics',
    type_code: 'T12',
    type_label: 'Control / Automation',
    difficulty: 'intermediate',
    is_gate: false,
    is_shopfloor: true,
    equation_latex: 'W_{cav} = \int_{t_{inj}}^{t_{freeze}} P_{cav}(t) \, dt',
    equation_display: 'W_cav = Integral [ P_cav(t) * dt ] from t_inj to t_freeze',
    description: 'Integral of the cavity pressure sensor signal curve over time (bar·s). Serves as the primary Digital Twin metric for automated 100% part quality classification and sink/flash defect prediction.',
    when_to_use: 'Use in piezoelectric cavity pressure monitoring systems (Kistler / RJG eDART) for real-time robotic reject degating.',
    assumptions: [
      'Cavity pressure sensor flush-mounted near gate or at end-of-fill',
      'Continuous sampling rate of at least 100–500 Hz',
      'Stable melt temperature and screw recovery dynamics'
    ],
    common_mistakes: [
      'Using hydraulic injection pressure instead of actual in-cavity melt pressure',
      'Failing to reset piezoelectric charge amplifier baseline between shots'
    ],
    variables: [
      { symbol: 'W_{cav}', meaning: 'Cavity pressure curve integral', unit: 'bar·s', dimension: 'Pressure·Time', required: true },
      { symbol: 'P_{peak}', meaning: 'Peak holding cavity pressure', unit: 'bar', dimension: 'Pressure', required: true, example_value: '450', min: 100, max: 1500, step: 10, default_num: 450 },
      { symbol: 't_{pack}', meaning: 'Packing and hold duration', unit: 'seconds', dimension: 'Time', required: true, example_value: '4.5', min: 0.5, max: 30, step: 0.5, default_num: 4.5 }
    ],
    examples: [
      {
        title: 'RJG eDART Cavity Pressure Integral Tolerance Monitoring',
        problem_statement: 'An automotive lens cavity pressure curve averages 420 bar over a 4.0 s pack/hold time with trapezoidal shape factor 0.85. Calculate W_cav and classify if nominal tolerance is 1400 ± 50 bar·s.',
        given_values: { 'P_avg': '420 bar', 't': '4.0 s', 'shape': '0.85' },
        steps: [
          'Calculate integral: W_cav = 420 bar * 4.0 s * 0.85 = 1,428 bar·s',
          'Compare to tolerance: 1400 ± 50 bar·s => 1350 to 1450 bar·s',
          'Evaluate: 1428 bar·s falls within specification window'
        ],
        final_answer: 'W_cav = 1,428 bar·s (PASS / In-Tolerance)',
        unit: 'bar·s',
        engineering_interpretation: 'W_cav of 1,428 bar·s confirms correct cavity packing without short shot or flash. The robot places the part in the pass chute.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'P_peak_bar', name: 'Peak Cavity Pressure (bar)', unit: 'bar', defaultVal: 420, min: 100, max: 1200, step: 10 },
        { symbol: 't_hold_s', name: 'Hold Time (s)', unit: 's', defaultVal: 4.0, min: 0.5, max: 20, step: 0.5 },
        { symbol: 'shape_factor', name: 'Curve Shape Factor (0.7-0.95)', unit: 'ratio', defaultVal: 0.85, min: 0.6, max: 1.0, step: 0.05 }
      ],
      calculate: (inputs) => {
        const p = inputs.P_peak_bar || 420
        const t = inputs.t_hold_s || 4.0
        const s = inputs.shape_factor || 0.85
        const wCav = p * t * s
        return {
          value: Math.round(wCav),
          formatted: `W_cav = ${Math.round(wCav)} bar·s`,
          unit: 'bar·s',
          note: wCav < 1000 ? 'Low pressure integral — risk of sink marks or short shot.' : 'Good packing density.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-001'],
    lesson_links: [{ lesson_id: 'cavity-pressure-sensors-and-industry-4-0-closed-loop-control', lesson_name: 'Cavity Pressure Sensors & Industry 4.0 Closed-Loop Control', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Cavity Pressure Technology in Injection Molding', author: 'Kistler Instrumente AG', publisher: 'Kistler Application Manual', edition: '4th Edition', year: 2021, page: '22-29', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 15. BIOPROCESSING & FERMENTATION ====================
  {
    formula_id: 'PH-FORM-BIO-001',
    slug: 'monod-kinetics-pha-microbial-biopolymer-growth',
    name: 'Monod Specific Microbial Growth Rate for PHA Biopolymers',
    short_name: 'Monod Growth Kinetics',
    subject_id: 'bioprocessing-fermentation',
    subject_name: 'Bioprocessing & Microbial Fermentation',
    category: 'Fermentation Kinetics',
    type_code: 'T3',
    type_label: 'Kinetics / Rate',
    difficulty: 'intermediate',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\mu = \mu_{max} \frac{[S]}{K_s + [S]}',
    equation_display: 'mu = mu_max * ( [S] / (Ks + [S]) )',
    description: 'Empirical model relating the specific microbial growth rate mu of polymer-producing bacteria (such as Cupriavidus necator producing PHB) to limiting carbon substrate concentration [S].',
    when_to_use: 'Use when modeling fed-batch bioreactors for bacterial polyhydroxyalkanoate (PHA/PHB) biosynthesis to optimize biomass growth before nutrient-limiting polymer accumulation phase.',
    assumptions: [
      'Single growth-limiting substrate (e.g., glucose, glycerol, or volatile fatty acids)',
      'No substrate inhibition or toxic metabolite accumulation',
      'Homogeneous mixing throughout the agitated bioreactor vessel'
    ],
    common_mistakes: [
      'Confusing biomass growth phase with PHA polymer accumulation phase (PHA accumulates when nitrogen/phosphorus is limited)',
      'Forgetting that at high substrate concentrations [S] >> Ks, the growth rate reaches asymptotic mu_max'
    ],
    variables: [
      { symbol: '\mu', meaning: 'Specific microbial growth rate', unit: 'h⁻¹', dimension: '1/Time', required: true },
      { symbol: '\mu_{max}', meaning: 'Maximum specific growth rate', unit: 'h⁻¹', dimension: '1/Time', required: true, example_value: '0.35', min: 0.05, max: 1.5, step: 0.05, default_num: 0.35 },
      { symbol: '[S]', meaning: 'Limiting substrate concentration (glucose)', unit: 'g/L', dimension: 'Mass/Volume', required: true, example_value: '5.0', min: 0.1, max: 100, step: 0.5, default_num: 5.0 },
      { symbol: 'K_s', meaning: 'Substrate affinity constant (half-velocity constant)', unit: 'g/L', dimension: 'Mass/Volume', required: true, example_value: '0.50', min: 0.05, max: 10, step: 0.05, default_num: 0.50 }
    ],
    examples: [
      {
        title: 'Cupriavidus necator Growth Rate for PHB Production',
        problem_statement: 'In a 10,000 L fermenter producing polyhydroxybutyrate (PHB), Cupriavidus necator has mu_max = 0.36 h^-1 and Ks = 0.40 g/L for glucose. Calculate specific growth rate mu when glucose concentration is maintained at [S] = 3.6 g/L.',
        given_values: { 'mu_max': '0.36 h^-1', 'Ks': '0.40 g/L', '[S]': '3.6 g/L' },
        steps: [
          'Apply Monod equation: mu = mu_max * [S] / (Ks + [S])',
          'Substitute values: mu = 0.36 * 3.6 / (0.40 + 3.6)',
          'Evaluate denominator: 0.40 + 3.6 = 4.0 g/L',
          'Calculate mu: 0.36 * (3.6 / 4.0) = 0.36 * 0.90 = 0.324 h^-1'
        ],
        final_answer: 'mu = 0.324 h⁻¹ (Doubling time t_d = 2.14 hours)',
        unit: 'h⁻¹',
        engineering_interpretation: 'At 3.6 g/L glucose, the culture grows at 90% of its maximum potential rate, rapidly building bacterial cell density before nutrient starvation triggers intracellular PHB granule accumulation.',
        difficulty: 'intermediate'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'mu_max_val', name: 'Max Growth Rate mu_max (h⁻¹)', unit: 'h⁻¹', defaultVal: 0.36, min: 0.1, max: 1.0, step: 0.02 },
        { symbol: 'S_conc', name: 'Substrate Concentration [S] (g/L)', unit: 'g/L', defaultVal: 3.6, min: 0.1, max: 50, step: 0.2 },
        { symbol: 'Ks_val', name: 'Monod Constant Ks (g/L)', unit: 'g/L', defaultVal: 0.40, min: 0.05, max: 5.0, step: 0.05 }
      ],
      calculate: (inputs) => {
        const muMax = inputs.mu_max_val || 0.36
        const S = inputs.S_conc || 3.6
        const Ks = inputs.Ks_val || 0.40
        const mu = muMax * (S / (Ks + S))
        const doublingTime = Math.log(2) / mu
        return {
          value: Math.round(mu * 1000) / 1000,
          formatted: `mu = ${(Math.round(mu * 1000) / 1000).toFixed(3)} h⁻¹`,
          unit: 'h⁻¹',
          note: `Biomass doubling time td = ${(Math.round(doublingTime * 10) / 10).toFixed(1)} hours.`
        }
      }
    },
    related_ids: ['PH-FORM-CHEM-001'],
    lesson_links: [{ lesson_id: 'microbial-fermentation-kinetics-and-pha-polyhydroxyalkanoate-production', lesson_name: 'Microbial Fermentation Kinetics & PHA Production', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'textbook', title: 'Bioprocess Engineering: Basic Concepts', author: 'Michael L. Shuler & Fikret Kargi', publisher: 'Prentice Hall', edition: '2nd Edition', year: 2002, page: '160-168', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 16. ROBOTICS IN MANUFACTURING ====================
  {
    formula_id: 'PH-FORM-ROBO-001',
    slug: 'cartesian-robot-demoulding-takeout-time',
    name: '3-Axis Cartesian Robot Demoulding Take-Out Time Formula',
    short_name: 'Robot Demoulding Time',
    subject_id: 'robotics-plastics',
    subject_name: 'Robotics & Automation in Plastics',
    category: 'Automation Cycle Time',
    type_code: 'T12',
    type_label: 'Control / Automation',
    difficulty: 'foundation',
    is_gate: false,
    is_shopfloor: true,
    equation_latex: 't_{takeout} = t_{enter} + t_{grip} + t_{strip} + t_{exit}',
    equation_display: 't_takeout = t_enter + t_grip + t_strip + t_exit',
    description: 'Calculates the mould-open time consumed by a high-speed top-entry Cartesian servo robot entering the mould space, gripping parts with end-of-arm tooling (EOAT), stripping from ejector pins, and exiting to safe clearance.',
    when_to_use: 'Use when calculating injection moulding overall cycle time and maximizing machine throughput in high-cavity packaging and medical moulding lines.',
    assumptions: [
      'Full servo acceleration and deceleration trajectories with S-curve smoothing',
      'Vacuum switch confirmation feedback time is included in t_grip',
      'Mould opening stroke is sufficient for EOAT clearance'
    ],
    common_mistakes: [
      'Assuming robot cycle time equals total machine cycle time (robot runs in parallel with cooling while mould is closed)',
      'Forgetting that only the mould-open portion (take-out time) directly increases overall cycle time'
    ],
    variables: [
      { symbol: 't_{takeout}', meaning: 'Total mould open take-out delay', unit: 'seconds', dimension: 'Time', required: true },
      { symbol: 't_{enter}', meaning: 'Robot vertical axis entry time into cavity', unit: 'seconds', dimension: 'Time', required: true, example_value: '0.45', min: 0.1, max: 3.0, step: 0.05, default_num: 0.45 },
      { symbol: 't_{grip}', meaning: 'Vacuum suction cup build & sensor confirmation', unit: 'seconds', dimension: 'Time', required: true, example_value: '0.15', min: 0.05, max: 1.0, step: 0.05, default_num: 0.15 },
      { symbol: 't_{strip}', meaning: 'Ejector stroke forward & part extraction', unit: 'seconds', dimension: 'Time', required: true, example_value: '0.25', min: 0.1, max: 2.0, step: 0.05, default_num: 0.25 },
      { symbol: 't_{exit}', meaning: 'Robot ascent out of mould to safe clearance', unit: 'seconds', dimension: 'Time', required: true, example_value: '0.45', min: 0.1, max: 3.0, step: 0.05, default_num: 0.45 }
    ],
    examples: [
      {
        title: 'High-Speed 32-Cavity Bottle Cap Demoulding Robot',
        problem_statement: 'A 32-cavity beverage closure mould uses a high-speed side-entry servo robot. Entry time = 0.35 s, vacuum grip = 0.10 s, ejector assist strip = 0.15 s, exit time = 0.35 s. Calculate total take-out time and percentage of 5.5 s overall cycle.',
        given_values: { 't_enter': '0.35 s', 't_grip': '0.10 s', 't_strip': '0.15 s', 't_exit': '0.35 s', 'Total Cycle': '5.5 s' },
        steps: [
          'Sum take-out components: 0.35 + 0.10 + 0.15 + 0.35 = 0.95 seconds',
          'Calculate cycle fraction: (0.95 / 5.5) * 100 = 17.27%'
        ],
        final_answer: 't_takeout = 0.95 seconds (17.3% of cycle)',
        unit: 'seconds',
        engineering_interpretation: 'The robot take-out time is under 1.0 second, allowing a fast 5.5 second overall cycle yielding over 20,900 caps per hour from a single 32-cavity mould.',
        difficulty: 'foundation'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 't_in', name: 'Entry Time (s)', unit: 's', defaultVal: 0.35, min: 0.1, max: 2.0, step: 0.05 },
        { symbol: 't_vac', name: 'Vacuum Grip Time (s)', unit: 's', defaultVal: 0.10, min: 0.05, max: 0.8, step: 0.05 },
        { symbol: 't_ext', name: 'Strip/Eject Time (s)', unit: 's', defaultVal: 0.15, min: 0.05, max: 1.0, step: 0.05 },
        { symbol: 't_out', name: 'Exit Time (s)', unit: 's', defaultVal: 0.35, min: 0.1, max: 2.0, step: 0.05 }
      ],
      calculate: (inputs) => {
        const tin = inputs.t_in || 0.35
        const tvac = inputs.t_vac || 0.10
        const text = inputs.t_ext || 0.15
        const tout = inputs.t_out || 0.35
        const total = tin + tvac + text + tout
        return {
          value: Math.round(total * 100) / 100,
          formatted: `t_takeout = ${(Math.round(total * 100) / 100).toFixed(2)} seconds`,
          unit: 'seconds',
          note: 'Mould open time delay added to cycle.'
        }
      }
    },
    related_ids: ['PH-FORM-PROC-001', 'PH-FORM-PROC-002'],
    lesson_links: [{ lesson_id: 'cartesian-and-6-axis-articulated-robots-for-demoulding-and-degating', lesson_name: 'Cartesian & 6-Axis Articulated Robots for Demoulding & Degating', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'handbook', title: 'Robotics and Automation in the Plastics Industry', author: 'Christian Hopmann', publisher: 'Hanser', edition: '1st Edition', year: 2018, page: '45-52', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  },

  // ==================== 17. POLYMER NANOTECHNOLOGY ====================
  {
    formula_id: 'PH-FORM-NANO-001',
    slug: 'percolation-threshold-conductive-nanocomposites',
    name: 'Electrical Percolation Threshold in Carbon Nanotube Nanocomposites',
    short_name: 'Percolation Threshold',
    subject_id: 'polymer-nanotechnology',
    subject_name: 'Polymer Nanotechnology & Nanocomposites',
    category: 'Nanocomposite Conductivity',
    type_code: 'T6',
    type_label: 'Mechanics / Strength',
    difficulty: 'advanced',
    is_gate: true,
    is_shopfloor: false,
    equation_latex: '\sigma = \sigma_0 (\phi - \phi_c)^t \quad \text{for } \phi > \phi_c',
    equation_display: 'sigma = sigma_0 * (phi - phi_c)^t',
    description: 'Power-law scaling equation describing the sharp insulator-to-conductor transition in polymer nanocomposites filled with conductive nanoparticles (carbon nanotubes, graphene, or carbon black).',
    when_to_use: 'Use when formulating electrically conductive plastics for Electrostatic Discharge (ESD) protection, EMI shielding, and fuel tank grounding.',
    assumptions: [
      'Volume fraction phi is above the critical percolation threshold phi_c',
      'Uniform dispersion without severe agglomeration',
      'Universal critical exponent t approx 1.6 to 2.0 for three-dimensional random networks'
    ],
    common_mistakes: [
      'Assuming spherical particle percolation threshold (approx 16 vol%) applies to high aspect ratio CNTs (which percolate at <0.5 vol%)',
      'Applying the equation below the percolation threshold phi < phi_c'
    ],
    variables: [
      { symbol: '\sigma', meaning: 'Electrical conductivity of nanocomposite', unit: 'S/m', dimension: 'Conductivity', required: true },
      { symbol: '\sigma_0', meaning: 'Conductivity scaling factor (filler intrinsic conductivity)', unit: 'S/m', dimension: 'Conductivity', required: true, example_value: '10000', min: 100, max: 1000000, step: 1000, default_num: 10000 },
      { symbol: '\phi', meaning: 'Volume fraction of conductive nanofiller', unit: 'volume fraction', dimension: 'dimensionless', required: true, example_value: '0.025', min: 0.001, max: 0.20, step: 0.002, default_num: 0.025 },
      { symbol: '\phi_c', meaning: 'Critical percolation threshold volume fraction', unit: 'volume fraction', dimension: 'dimensionless', required: true, example_value: '0.008', min: 0.001, max: 0.10, step: 0.001, default_num: 0.008 },
      { symbol: 't', meaning: 'Critical universal conductivity exponent', unit: 'dimensionless', dimension: 'dimensionless', required: true, example_value: '2.0', min: 1.3, max: 2.5, step: 0.1, default_num: 2.0 }
    ],
    examples: [
      {
        title: 'Multi-Walled Carbon Nanotube (MWCNT) / Polycarbonate ESD Compound',
        problem_statement: 'MWCNTs dispersed in Polycarbonate have percolation threshold phi_c = 0.008 (0.8 vol%). Scaling factor sigma0 = 1.0 × 10^4 S/m, exponent t = 2.0. Calculate conductivity at filler loading phi = 0.025 (2.5 vol%).',
        given_values: { 'phi_c': '0.008', 'phi': '0.025', 'sigma0': '10,000 S/m', 't': '2.0' },
        steps: [
          'Calculate effective volume above threshold: phi - phi_c = 0.025 - 0.008 = 0.017',
          'Raise to power t = 2.0: (0.017)^2 = 2.89 × 10^-4',
          'Multiply by sigma0: 10,000 * 2.89 × 10^-4 = 2.89 S/m'
        ],
        final_answer: 'sigma = 2.89 S/m (Volume Resistivity rho = 0.35 Ohm·m)',
        unit: 'S/m',
        engineering_interpretation: 'The conductivity jumps by over 14 orders of magnitude from base PC (10^-14 S/m) to 2.89 S/m, placing the compound firmly in the ESD and EMI shielding protection range.',
        difficulty: 'advanced'
      }
    ],
    calc_config: {
      inputs: [
        { symbol: 'phi_vol', name: 'Filler Loading phi (vol fraction)', unit: 'vol fraction', defaultVal: 0.025, min: 0.002, max: 0.10, step: 0.002 },
        { symbol: 'phi_c_val', name: 'Percolation Threshold phi_c', unit: 'vol fraction', defaultVal: 0.008, min: 0.001, max: 0.05, step: 0.001 },
        { symbol: 'sigma0_val', name: 'Scaling Factor sigma_0 (S/m)', unit: 'S/m', defaultVal: 10000, min: 500, max: 50000, step: 500 },
        { symbol: 'exp_t', name: 'Exponent t', unit: 'dimensionless', defaultVal: 2.0, min: 1.4, max: 2.5, step: 0.1 }
      ],
      calculate: (inputs) => {
        const phi = inputs.phi_vol || 0.025
        const phic = inputs.phi_c_val || 0.008
        const sigma0 = inputs.sigma0_val || 10000
        const t = inputs.exp_t || 2.0
        if (phi <= phic) {
          return { value: 0, formatted: 'Insulating State (phi <= phi_c)', unit: 'S/m', status: 'warning', note: 'Below percolation threshold; network is not interconnected.' }
        }
        const delta = phi - phic
        const sigma = sigma0 * Math.pow(delta, t)
        return {
          value: Math.round(sigma * 100) / 100,
          formatted: `sigma = ${(Math.round(sigma * 100) / 100).toFixed(2)} S/m`,
          unit: 'S/m',
          note: 'Electrically conductive percolation network formed.'
        }
      }
    },
    related_ids: ['PH-FORM-COMP-001'],
    lesson_links: [{ lesson_id: 'carbon-nanotubes-and-graphene-percolation-threshold-and-conductivity', lesson_name: 'Carbon Nanotubes & Graphene: Percolation Threshold & Conductivity', relationship: 'introduced' }],
    tool_links: [],
    sources: [{ source_type: 'paper', title: 'Electrical Conductivity of Carbon Nanotube-Polymer Composites', author: 'W. Bauhofer & J.Z. Kovacs', publisher: 'Composites Science and Technology', edition: 'Vol 69', year: 2009, page: '1486-1498', verified_at: '2026-10-09' }],
    status: 'published',
    verified_at: '2026-10-09',
    reviewed_by: 'PolymerHub Academic Editorial Board'
  }

]
