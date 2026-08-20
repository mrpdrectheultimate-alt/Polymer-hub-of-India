// src/lib/screencasts.ts

export interface SolverInput {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

export interface ScreencastItem {
  id: string;
  title: string;
  subject: string;
  youtubeId: string;
  duration: string;
  description: string;
  formula: string;
  solver: {
    inputs: SolverInput[];
    calculate: (inputs: Record<string, number>) => Record<string, string | number>;
  };
}

export const screencasts: ScreencastItem[] = [
  // 1. DSC Thermogram
  {
    id: 'dsc-thermogram',
    title: 'How to Read a DSC Thermogram',
    subject: 'Polymer Testing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '12:34',
    description: 'Learn to identify Glass Transition (Tg), Cold Crystallization (Tc), and Melting (Tm) peaks on a DSC curve, and calculate % Crystallinity.',
    formula: 'Crystallinity (%) = (\u0394Hm / \u0394Hm\u00B0) \u00D7 100',
    solver: {
      inputs: [
        { id: 'delta_hm', label: '\u0394Hm (melting enthalpy)', min: 0, max: 200, step: 0.1, default: 50, unit: 'J/g' },
        { id: 'delta_hm_standard', label: '\u0394Hm\u00B0 (100% crystalline)', min: 10, max: 300, step: 0.1, default: 100, unit: 'J/g' },
      ],
      calculate: (inputs) => {
        const deltaHm = inputs.delta_hm ?? 50;
        const deltaHmStd = inputs.delta_hm_standard ?? 100;
        const crystallinity = (deltaHm / Math.max(deltaHmStd, 1)) * 100;
        return { crystallinity: crystallinity.toFixed(1) + '%' };
      },
    },
  },
  // 2. MFI Calculations
  {
    id: 'mfi-calculations',
    title: 'Solving Melt Flow Index (MFI) Calculations',
    subject: 'Polymer Rheology',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '10:21',
    description: 'Convert MFI to shear viscosity and estimate molecular weight using power-law relationships.',
    formula: '\u03B7 = K \u00D7 (MFI)^n',
    solver: {
      inputs: [
        { id: 'mfi', label: 'MFI (g/10 min)', min: 0.1, max: 100, step: 0.1, default: 5, unit: 'g/10 min' },
        { id: 'k_factor', label: 'K Factor', min: 100, max: 5000, step: 10, default: 1000, unit: 'Pa\u00B7s' },
        { id: 'n_exponent', label: 'n (power-law index)', min: 0.1, max: 1, step: 0.01, default: 0.5, unit: '' },
      ],
      calculate: (inputs) => {
        const mfi = inputs.mfi ?? 5;
        const k = inputs.k_factor ?? 1000;
        const n = inputs.n_exponent ?? 0.5;
        const viscosity = k * Math.pow(Math.max(mfi, 0.01), n);
        const mw = 100000 / Math.pow(Math.max(mfi, 0.01), 0.5);
        return {
          viscosity: viscosity.toFixed(0) + ' Pa\u00B7s',
          molecular_weight: mw.toFixed(0) + ' g/mol',
        };
      },
    },
  },
  // 3. Stress-Strain Curve
  {
    id: 'stress-strain-curve',
    title: 'Engineering Stress-Strain Curve Analysis',
    subject: 'Polymer Testing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '14:05',
    description: 'Calculate yield stress, Young modulus, and toughness area under the stress-strain curve per ASTM D638.',
    formula: 'E = \u03C3/\u03B5 | Toughness = \u222B\u03C3 d\u03B5',
    solver: {
      inputs: [
        { id: 'yield_stress', label: 'Yield Stress', min: 0, max: 200, step: 0.1, default: 45, unit: 'MPa' },
        { id: 'strain_at_yield', label: 'Strain at Yield', min: 0.001, max: 0.5, step: 0.001, default: 0.05, unit: 'mm/mm' },
        { id: 'ultimate_stress', label: 'Ultimate Stress', min: 0, max: 300, step: 0.1, default: 55, unit: 'MPa' },
        { id: 'strain_at_break', label: 'Strain at Break', min: 0.01, max: 2, step: 0.01, default: 0.5, unit: 'mm/mm' },
      ],
      calculate: (inputs) => {
        const ys = inputs.yield_stress ?? 45;
        const sy = inputs.strain_at_yield ?? 0.05;
        const us = inputs.ultimate_stress ?? 55;
        const sb = inputs.strain_at_break ?? 0.5;
        const modulus = ys / Math.max(sy, 0.0001);
        const toughness = (us * sb) / 2;
        return {
          modulus: modulus.toFixed(0) + ' MPa',
          toughness: toughness.toFixed(1) + ' MJ/m\u00B3',
        };
      },
    },
  },
  // 4. Injection Molding Gate Sizing
  {
    id: 'gate-sizing',
    title: 'Injection Molding Gate & Runner Sizing',
    subject: 'Mould Design',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '11:42',
    description: 'Calculate gate diameter, fill time, and pressure drop for injection molding gates.',
    formula: 'd = n\u00B7c\u00B7A^(1/2) | \u0394P = 8\u03B7LQ / \u03C0r\u2074',
    solver: {
      inputs: [
        { id: 'part_thickness', label: 'Part Thickness', min: 0.5, max: 10, step: 0.1, default: 2, unit: 'mm' },
        { id: 'flow_length', label: 'Flow Length', min: 10, max: 500, step: 1, default: 100, unit: 'mm' },
        { id: 'viscosity', label: 'Melt Viscosity', min: 100, max: 5000, step: 10, default: 1000, unit: 'Pa\u00B7s' },
      ],
      calculate: (inputs) => {
        const pt = inputs.part_thickness ?? 2;
        const fl = inputs.flow_length ?? 100;
        const visc = inputs.viscosity ?? 1000;
        const gateDiameter = 0.8 * Math.pow(Math.max(pt, 0.1), 0.5);
        const fillTime = (fl / 100) * 2;
        const r = gateDiameter / 2;
        const pressureDrop = (8 * visc * fl * 0.01) / (Math.PI * Math.pow(Math.max(r, 0.1), 4));
        return {
          gate_diameter: gateDiameter.toFixed(2) + ' mm',
          fill_time: fillTime.toFixed(1) + ' s',
          pressure_drop: pressureDrop.toFixed(0) + ' MPa',
        };
      },
    },
  },
  // 5. Molecular Weight (Mn, Mw, PDI)
  {
    id: 'molecular-weight',
    title: 'Number & Weight Average Molecular Weight',
    subject: 'Polymer Chemistry',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '13:18',
    description: 'Calculate Mn, Mw, and Polydispersity Index (PDI) for multi-fraction polymer mixtures.',
    formula: 'Mn = \u03A3NiMi / \u03A3Ni | Mw = \u03A3NiMi\u00B2 / \u03A3NiMi | PDI = Mw/Mn',
    solver: {
      inputs: [
        { id: 'frac1_mw', label: 'Fraction 1: Molecular Weight', min: 1000, max: 1000000, step: 1000, default: 50000, unit: 'g/mol' },
        { id: 'frac1_weight', label: 'Fraction 1: Weight (g)', min: 0.1, max: 100, step: 0.1, default: 10, unit: 'g' },
        { id: 'frac2_mw', label: 'Fraction 2: Molecular Weight', min: 1000, max: 1000000, step: 1000, default: 100000, unit: 'g/mol' },
        { id: 'frac2_weight', label: 'Fraction 2: Weight (g)', min: 0.1, max: 100, step: 0.1, default: 20, unit: 'g' },
        { id: 'frac3_mw', label: 'Fraction 3: Molecular Weight', min: 1000, max: 1000000, step: 1000, default: 200000, unit: 'g/mol' },
        { id: 'frac3_weight', label: 'Fraction 3: Weight (g)', min: 0.1, max: 100, step: 0.1, default: 5, unit: 'g' },
      ],
      calculate: (inputs) => {
        const fractions = [
          { mw: inputs.frac1_mw ?? 50000, w: inputs.frac1_weight ?? 10 },
          { mw: inputs.frac2_mw ?? 100000, w: inputs.frac2_weight ?? 20 },
          { mw: inputs.frac3_mw ?? 200000, w: inputs.frac3_weight ?? 5 },
        ];
        const totalWeight = fractions.reduce((sum, f) => sum + f.w, 0);
        const mnNumerator = fractions.reduce((sum, f) => sum + f.w, 0);
        const mnDenominator = fractions.reduce((sum, f) => sum + (f.w / f.mw), 0);
        const mn = mnDenominator > 0 ? mnNumerator / mnDenominator : 0;
        const mwNumerator = fractions.reduce((sum, f) => sum + f.w * f.mw, 0);
        const mw = totalWeight > 0 ? mwNumerator / totalWeight : 0;
        const pdi = mn > 0 ? mw / mn : 1;
        return {
          mn: mn.toFixed(0) + ' g/mol',
          mw: mw.toFixed(0) + ' g/mol',
          pdi: pdi.toFixed(3),
        };
      },
    },
  },
  // 6. Extruder Screw Compression Ratio
  {
    id: 'extruder-compression-ratio',
    title: 'Extruder Screw Geometry & Compression Ratio',
    subject: 'Polymer Processing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '10:55',
    description: 'Calculate feed vs metering depth compression ratio and volumetric output for single screw extruders.',
    formula: 'CR = hf / hm | Q = \u03C0\u00B2 D\u00B2 N h sin\u03B8 cos\u03B8',
    solver: {
      inputs: [
        { id: 'feed_depth', label: 'Feed Depth (hf)', min: 1, max: 20, step: 0.1, default: 10, unit: 'mm' },
        { id: 'metering_depth', label: 'Metering Depth (hm)', min: 0.5, max: 10, step: 0.1, default: 3, unit: 'mm' },
        { id: 'screw_diameter', label: 'Screw Diameter (D)', min: 20, max: 200, step: 1, default: 60, unit: 'mm' },
        { id: 'screw_rpm', label: 'Screw RPM (N)', min: 10, max: 200, step: 1, default: 50, unit: 'rpm' },
      ],
      calculate: (inputs) => {
        const hf = inputs.feed_depth ?? 10;
        const hm = inputs.metering_depth ?? 3;
        const D = inputs.screw_diameter ?? 60;
        const N = inputs.screw_rpm ?? 50;
        const compressionRatio = hf / Math.max(hm, 0.1);
        const helixAngle = (17.7 * Math.PI) / 180;
        const Q = (Math.PI * Math.PI * Math.pow(D, 2) * N * hm * Math.sin(helixAngle) * Math.cos(helixAngle)) / 1000;
        return {
          compression_ratio: compressionRatio.toFixed(2) + ':1',
          volumetric_output: Q.toFixed(1) + ' cm\u00B3/min',
        };
      },
    },
  },
  // 7. Masterbatch Let-Down Ratio (LDR)
  {
    id: 'masterbatch-ldr',
    title: 'Masterbatch Let-Down Ratio (LDR) & Pigment Dosing',
    subject: 'Additives & Compounding',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '09:30',
    description: 'Calculate the required masterbatch percentage and cost per kg for pigment/colorant dosing.',
    formula: 'LDR% = (MB weight / Total weight) \u00D7 100',
    solver: {
      inputs: [
        { id: 'masterbatch_weight', label: 'Masterbatch Weight', min: 0.1, max: 100, step: 0.1, default: 5, unit: 'kg' },
        { id: 'resin_weight', label: 'Resin Weight', min: 0.1, max: 1000, step: 0.1, default: 95, unit: 'kg' },
        { id: 'mb_cost_per_kg', label: 'Masterbatch Cost', min: 0, max: 1000, step: 1, default: 200, unit: '\u20B9/kg' },
        { id: 'resin_cost_per_kg', label: 'Resin Cost', min: 0, max: 500, step: 1, default: 100, unit: '\u20B9/kg' },
      ],
      calculate: (inputs) => {
        const mbW = inputs.masterbatch_weight ?? 5;
        const rW = inputs.resin_weight ?? 95;
        const mbCost = inputs.mb_cost_per_kg ?? 200;
        const rCost = inputs.resin_cost_per_kg ?? 100;
        const total = mbW + rW;
        const ldrPercent = total > 0 ? (mbW / total) * 100 : 0;
        const costPerKg = total > 0 ? (mbW * mbCost + rW * rCost) / total : 0;
        return {
          ldr: ldrPercent.toFixed(1) + '%',
          cost_per_kg: '\u20B9' + costPerKg.toFixed(2) + '/kg',
        };
      },
    },
  },
  // 8. Blow Molding Parison & BUR
  {
    id: 'blow-molding-bur',
    title: 'Blow Molding Parison Sag & Blow-Up Ratio (BUR)',
    subject: 'Polymer Processing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '08:45',
    description: 'Calculate parison diameter, sag, and blow-up ratio for extrusion blow molding.',
    formula: 'BUR = Dbottle / Ddie',
    solver: {
      inputs: [
        { id: 'die_diameter', label: 'Die Diameter', min: 10, max: 200, step: 1, default: 50, unit: 'mm' },
        { id: 'bottle_diameter', label: 'Bottle Diameter', min: 20, max: 400, step: 1, default: 120, unit: 'mm' },
        { id: 'die_gap', label: 'Die Gap', min: 0.5, max: 10, step: 0.1, default: 2, unit: 'mm' },
      ],
      calculate: (inputs) => {
        const dd = inputs.die_diameter ?? 50;
        const bd = inputs.bottle_diameter ?? 120;
        const dg = inputs.die_gap ?? 2;
        const bur = bd / Math.max(dd, 1);
        const parisonThickness = dg * Math.sqrt(bur);
        return {
          bur: bur.toFixed(2) + ':1',
          parison_thickness: parisonThickness.toFixed(2) + ' mm',
        };
      },
    },
  },
  // 9. Shore Hardness Correlation
  {
    id: 'shore-hardness',
    title: 'Shore A vs Shore D Hardness Correlation',
    subject: 'Rubber Technology',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '07:20',
    description: 'Convert between Shore A and Shore D hardness scales with indentation depth calculations.',
    formula: 'Shore D = 0.5 \u00D7 Shore A + 25 (est.)',
    solver: {
      inputs: [
        { id: 'shore_a', label: 'Shore A Hardness', min: 0, max: 100, step: 0.1, default: 70, unit: 'Shore A' },
      ],
      calculate: (inputs) => {
        const sa = inputs.shore_a ?? 70;
        const shoreD = 0.5 * sa + 25;
        const indentation = 100 - sa;
        return {
          shore_d: shoreD.toFixed(1) + ' Shore D',
          indentation: indentation.toFixed(1) + '%',
        };
      },
    },
  },
  // 10. HDT vs Vicat
  {
    id: 'hdt-vicat',
    title: 'HDT vs Vicat Softening Point Interpretation',
    subject: 'Polymer Testing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '09:15',
    description: 'Interpret Heat Deflection Temperature (HDT) at 0.455 MPa and 1.82 MPa vs Vicat softening point.',
    formula: 'HDT (0.455 MPa) \u2248 Vicat + 20\u00B0C (est.)',
    solver: {
      inputs: [
        { id: 'vicat_temp', label: 'Vicat Softening Point', min: 50, max: 250, step: 1, default: 150, unit: '\u00B0C' },
      ],
      calculate: (inputs) => {
        const vt = inputs.vicat_temp ?? 150;
        const hdt_045 = vt + 20;
        const hdt_182 = hdt_045 - 15;
        return {
          hdt_045: hdt_045.toFixed(0) + ' \u00B0C',
          hdt_182: hdt_182.toFixed(0) + ' \u00B0C',
        };
      },
    },
  },
  // 11. Carbon Footprint & LCA
  {
    id: 'carbon-footprint-lca',
    title: 'Carbon Footprint & LCA for Polymers',
    subject: 'Life Cycle Assessment',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '11:00',
    description: 'Compare virgin vs recycled PCR CO\u2082 equivalent emissions and calculate offset savings.',
    formula: 'CO\u2082e Offset = Virgin CO\u2082e - Recycled CO\u2082e',
    solver: {
      inputs: [
        { id: 'virgin_co2', label: 'Virgin CO\u2082e', min: 0, max: 10, step: 0.01, default: 2.5, unit: 'kg CO\u2082e/kg' },
        { id: 'recycled_co2', label: 'Recycled CO\u2082e', min: 0, max: 5, step: 0.01, default: 0.8, unit: 'kg CO\u2082e/kg' },
        { id: 'annual_production', label: 'Annual Production', min: 0, max: 100000, step: 100, default: 5000, unit: 'kg/year' },
      ],
      calculate: (inputs) => {
        const v = inputs.virgin_co2 ?? 2.5;
        const r = inputs.recycled_co2 ?? 0.8;
        const prod = inputs.annual_production ?? 5000;
        const offset = v - r;
        const annualSavings = offset * prod;
        return {
          offset: offset.toFixed(2) + ' kg CO\u2082e/kg',
          annual_savings: annualSavings.toFixed(0) + ' kg CO\u2082e/year',
        };
      },
    },
  },
  // 12. Rotational Molding Cycle Time & PIAT
  {
    id: 'rotomolding-piat',
    title: 'Rotational Molding Cycle Time & Peak Internal Air Temp (PIAT)',
    subject: 'Polymer Processing',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '10:30',
    description: 'Calculate optimal PIAT cure window and cycle time for rotational molding.',
    formula: 'PIAT = Oven Temp \u00D7 (Part Thickness)^0.4',
    solver: {
      inputs: [
        { id: 'part_thickness', label: 'Part Thickness', min: 1, max: 20, step: 0.5, default: 6, unit: 'mm' },
        { id: 'oven_temp', label: 'Oven Temperature', min: 200, max: 400, step: 5, default: 300, unit: '\u00B0C' },
        { id: 'cooling_rate', label: 'Cooling Rate', min: 1, max: 10, step: 0.1, default: 5, unit: '\u00B0C/min' },
      ],
      calculate: (inputs) => {
        const pt = inputs.part_thickness ?? 6;
        const ot = inputs.oven_temp ?? 300;
        const cr = inputs.cooling_rate ?? 5;
        const piat = ot * Math.pow(pt / 6, 0.4);
        const heatingTime = 10 + pt * 1.5;
        const coolingTime = (ot - 40) / Math.max(cr, 0.1);
        const totalTime = heatingTime + coolingTime + 5;
        return {
          piat: piat.toFixed(0) + ' \u00B0C',
          heating_time: heatingTime.toFixed(0) + ' min',
          cooling_time: coolingTime.toFixed(0) + ' min',
          total_cycle_time: totalTime.toFixed(0) + ' min',
        };
      },
    },
  },
];
