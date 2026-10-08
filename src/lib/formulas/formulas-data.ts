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
    subject_id: 'plastic-packaging',
    subject_name: 'Plastic Packaging Technology',
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
    subject_id: 'color-science-masterbatch',
    subject_name: 'Color Science & Spectrophotometry',
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
]
