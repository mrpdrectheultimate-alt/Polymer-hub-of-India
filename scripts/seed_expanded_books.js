// scripts/seed_expanded_books.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const RHEOLOGY_GUIDE_CHAPTERS = {
  ch1: [
    '# Chapter 1: Why Rheology Matters to Every Polymer Engineer',
    '',
    '## 1. Introduction',
    'Rheology is the study of the flow and deformation of matter. For polymer engineers, rheology is not an abstract academic discipline; it is the physical foundation of every processing step. Whether you are extruding a profile, injection moulding a precision medical connector, or blowing a multilayer packaging film, you are forcing a polymer melt to flow through channels, gates, and dies under high shear and temperature. Viscosity determines the pressure drops, shear heating determines thermal degradation risks, and elastic recovery determines the final dimensions of the part.',
    '',
    '## 2. Processing Shear Rates',
    'Understanding the relevant shear rate regime for different processes is critical. A common mistake is using Melt Flow Index (MFI) — which measures flow at a very low shear rate ($1-10$ s⁻¹) — to predict behavior in injection moulding, which operates at shear rates exceeding $10,000$ s⁻¹. At high shear rates, shear-thinning behavior reduces viscosity by several orders of magnitude.',
    '',
    '## 3. Industrial Relevance',
    'In companies like **Reliance Industries** and **Supreme Industries**, rheology is used to design dies, select processing grades, and troubleshoot production defects. A solid grasp of rheology helps engineers prevent defects like melt fracture (sharkskin) and minimize cycle times.'
  ].join('\n'),
  ch2: [
    '# Chapter 2: Newtonian vs. Non-Newtonian: The First Big Distinction',
    '',
    '## 1. Shear Stress and Viscosity',
    'For a simple Newtonian fluid under laminar shear, the shear stress ($\\tau$) is directly proportional to the shear rate ($\\dot{\\gamma}$):',
    '$$\\tau = \\eta \\cdot \\dot{\\gamma}$$',
    'Where the viscosity ($\\eta$) is a constant, independent of shear rate. Water, simple organic solvents, and low-molecular-weight oils behave as Newtonian fluids.',
    '',
    '## 2. Non-Newtonian Behavior in Polymer Melts',
    'Polymer melts are non-Newtonian, specifically displaying **shear-thinning (pseudoplastic)** behavior: as the shear rate increases, the apparent viscosity decreases. At low shear rates, polymer chains are entangled and move slowly (zero-shear viscosity $\\eta_0$). At high shear rates, the rate of shear exceeds the rate of thermal relaxation, forcing the chains to disentangle and align parallel to the flow direction, which reduces the hydrodynamic resistance.',
    '',
    '## 3. Mathematical Modelling',
    'Engineers use models to map this behavior. Simple power-law equations are common, but they fail at the low-shear Newtonian plateau where zero-shear viscosity is reached.'
  ].join('\n'),
  ch3: [
    '# Chapter 3: The Power Law, Carreau-Yasuda, and Real Polymer Behavior',
    '',
    '## 1. The Ostwald-de Waele Power Law Model',
    'The simplest model for shear-thinning behavior is the Power Law:',
    '$$\\tau = K \\cdot \\dot{\\gamma}^n$$',
    '$$\\eta = K \\cdot \\dot{\\gamma}^{n-1}$$',
    'Where $K$ is the flow consistency index and $n$ is the flow behavior index ($n < 1$ for shear-thinning).',
    '',
    '## 2. The Carreau-Yasuda Model',
    'To cover both the zero-shear Newtonian plateau and the shear-thinning regime, the Carreau-Yasuda model is used:',
    '$$\\eta(\\dot{\\gamma}) = \\eta_\\infty + (\\eta_0 - \\eta_\\infty) \\left[ 1 + (\\lambda \\dot{\\gamma})^a \\right]^{\\frac{n-1}{a}}$$',
    'Where $\\eta_0$ is zero-shear viscosity, $\\eta_\\infty$ is infinite-shear viscosity, $\\lambda$ is relaxation time, $n$ is flow behavior index, and $a$ is a transition parameter.'
  ].join('\n'),
  ch4: [
    '# Chapter 4: Capillary Rheometry: Corrections, Calculations, and Curve Fitting',
    '',
    '## 1. Principles of Capillary Rheometry',
    'Capillary rheometers push melt through a die of radius $R$ and length $L$ at volumetric flow rate $Q$, measuring the pressure drop $\\Delta P$.',
    '',
    '## 2. Corrections',
    '- **Bagley Correction**: Accounts for entrance and exit pressure drops. Requires testing dies of varying $L/D$ ratios to isolate true wall shear stress:',
    '  $$\\tau_w = \\frac{\\Delta P_{total} - P_e}{2 (L/R)}$$',
    '- **Rabinowitsch Correction**: Accounts for the non-parabolic velocity profile of shear-thinning fluids, correcting the apparent shear rate:',
    '  $$\\dot{\\gamma}_w = \\dot{\\gamma}_{app} \\left[ \\frac{3n + 1}{4n} \\right]$$'
  ].join('\n'),
  ch5: [
    '# Chapter 5: Die Swell, Melt Fracture, and Flow Instability',
    '',
    '## 1. Die Swell (Extrudate Swell)',
    'When a polymer melt exits a die, the compressed chains elastic-relax, causing the extrudate to expand radially. Die swell is a function of shear rate, die length (longer dies allow relaxation), and polymer molecular weight distribution.',
    '',
    '## 2. Melt Fracture & Sharkskin',
    'Sharkskin is a surface defect caused by high tensile stresses at the die exit. When the shear stress exceeds the critical threshold ($\\approx 0.14$ MPa), the melt fractures. This is mitigated by adding fluoropolymer-based Polymer Processing Aids (PPA) which coat the die metal wall.'
  ].join('\n'),
  ch6: [
    '# Chapter 6: Rotational Rheometry: Oscillation, Creep, and Recovery',
    '',
    '## 1. Dynamic Mechanical Rheology',
    'Rotational rheometers use cone-plate or parallel-plate geometries to apply oscillatory shear. This determines the viscoelastic parameters:',
    '- **Storage Modulus ($G\'$)**: Measures elastic behavior (energy stored).',
    '- **Loss Modulus ($G\'\'$)**: Measures viscous behavior (energy dissipated as heat).',
    '- **Loss Factor ($\\tan \\delta$)**: Ratio of viscous to elastic moduli ($\\tan \\delta = G\'\'/G\'$).'
  ].join('\n'),
  ch7: [
    '# Chapter 7: Injecting, Extruding, Blowing: Applying Rheology to Real Processes',
    '',
    '## 1. Application to Injection Moulding',
    'High gate shear rates ($10^4$ s⁻¹) lower melt viscosity, allowing thin walls to fill. Sizing runners and gate configurations requires shear-thinning calculations to optimize fill balance.',
    '',
    '## 2. Blown Film Stability',
    'Film blowing requires high melt strength (elastic resistance) at low shear rates to prevent bubble wobble, coupled with low viscosity inside the extruder barrel to limit pressure build-up.'
  ].join('\n'),
  ch8: [
    '# Chapter 8: Rheology Testing Standards: ASTM D3835, ISO 11443, ASTM D4440',
    '',
    '## 1. Capillary Rheometry Standards (ASTM D3835 & ISO 11443)',
    'These standards govern the measurement of rheological properties of polymeric materials at various temperatures and shear rates using a capillary rheometer. It details the sample preparation, barrel dimensions, temperature controls, and pressure transducer calibration required to obtain reproducible shear viscosity data.',
    '',
    '## 2. Dynamic Mechanical Properties (ASTM D4440)',
    'This standard covers the use of rotational rheometers (parallel plate, cone-plate) to determine the viscoelastic properties of polymer melts. It specifies the testing protocol to measure storage modulus ($G\'$), loss modulus ($G\'\'$), and complex viscosity ($\\eta^*$) under oscillatory shear as a function of frequency and temperature.'
  ].join('\n')
};

const COMPOUNDING_HANDBOOK_CHAPTERS = {
  ch1: [
    '# Chapter 1: Why Compounding is the Real Money in Plastics',
    '',
    '## 1. Introduction',
    'Neat polymer resins are commodities with low profit margins. The real value addition in the plastics industry happens in **compounding**, where base resins are combined with pigments, fillers, and functional additives to create custom engineering materials. A compounding plant converts low-cost base materials into specialized compounds for automotive, aerospace, and medical markets.',
    '',
    '## 2. Major Players',
    'Indian giants like **Plastiblends** and **Cabot India** formulate custom masterbatches, driving performance standards for local processors.'
  ].join('\n'),
  ch2: [
    '# Chapter 2: Twin-Screw Extrusion: Element Tuning and Screw Configurations',
    '',
    '## 1. Modular Screw Architecture',
    'Co-rotating twin-screw extruders are the industry standard for compounding. Their modular screws allow assembly of specialized zones:',
    '- **Conveying Elements**: Flighted elements that transport solids or melt.',
    '- **Kneading Blocks**: Discs stacked at offset angles (45°, 60°, 90°) to apply intense dispersive shear stress.',
    '- **Reverse Elements**: Pump melt backward, generating a seal for vacuum degassing.',
    '',
    '## 2. SME Mechanics',
    'Specific Mechanical Energy (SME) measures energy input per unit throughput:',
    '$$SME = \\frac{P_{\\text{motor}} \\cdot (N/N_{max}) \\cdot \\text{Torque}\\%}{\\dot{m}}$$'
  ].join('\n'),
  ch3: [
    '# Chapter 3: Masterbatches: Let-Down Ratios, Carrier Resins, and Dispersion',
    '',
    '## 1. Masterbatch Principles',
    'Masterbatches contain highly concentrated pigments or additives in a carrier resin. When processed, they are diluted with virgin resin at a specific **Let-Down Ratio (LDR)**:',
    '$$\\text{LDR (\\%)} = \\frac{C_{final}}{C_{MB}} \\times 100\\%$$',
    '',
    '## 2. Carrier Resin Selection',
    'The carrier resin must be compatible with the base resin and have a higher Melt Flow Index (lower viscosity) to ensure rapid, uniform mixing during dilution.'
  ].join('\n'),
  ch4: [
    '# Chapter 4: UV Stabilizers: HALS, Benzophenones, and Light Protection Physics',
    '',
    '## 1. Solar Photo-Oxidation',
    'UV photons cleave polymer bonds, initiating an autoxidation cycle. This results in yellowing, chalking, and loss of tensile properties.',
    '',
    '## 2. UV Absorbers vs. HALS',
    '- **UV Absorbers (UVA)**: Benzotriazoles and benzophenones absorb UV light and release it as heat. Ideal for thick sections.',
    '- **HALS**: Hindered Amine Light Stabilizers act as radical scavengers, regenerating via the Denisov cycle. Essential for thin films and fibers.'
  ].join('\n'),
  ch5: [
    '# Chapter 5: Flame Retardants: Intumescent, Halogenated, and Non-Halogenated Systems',
    '',
    '## 1. Flame Retardant Chemistry',
    'Halogenated FRs capture radicals in the gas phase but emit toxic, corrosive smoke. Modern formulations use **Halogen-Free Flame Retardants (HFFR)**.',
    '',
    '## 2. Intumescent Systems (IFR)',
    'IFR systems swell to form an insulating carbon char. They require:',
    '1. **Acid source**: Ammonium Polyphosphate (APP).',
    '2. **Carbonific agent**: Pentaerythritol (PER).',
    '3. **Blowing agent**: Melamine.'
  ].join('\n'),
  ch6: [
    '# Chapter 6: Mechanical Rubber-Toughening: Core-Shell Impact Modifiers',
    '',
    '## 1. Toughening Mechanics',
    'Brittle matrices are blended with rubber particles that act as stress concentrators, initiating energy-dissipation mechanisms: multiple micro-crazing and shear yielding.',
    '',
    '## 2. Core-Shell Rubbers (CSR)',
    'CSR particles feature an elastomeric core (butadiene-styrene) and a rigid shell (PMMA), optimizing interface adhesion and dispersion.'
  ].join('\n'),
  ch7: [
    '# Chapter 7: Inorganic Fillers and aspect ratios',
    '',
    '## 1. Inorganic Fillers',
    '- **Calcium Carbonate**: Spherical shape, low cost, minor reinforcement.',
    '- **Talc**: Platy, high aspect ratio, increases stiffness and HDT.',
    '- **Glass Fibers**: Fibrous, high aspect ratio, maximum reinforcement.'
  ].join('\n'),
  ch8: [
    '# Chapter 8: Colorants & Pigments: Titanium Dioxide, Organic Pigments, and Color Matching',
    '',
    '## 1. Colorant Classification',
    'Colorants are divided into soluble dyes and insoluble pigments. Pigments are further classified into inorganic (e.g., Titanium Dioxide ($TiO_2$) for white opacity, carbon black for black, iron oxides) and organic pigments (phthalocyanines for blues/greens, azo compounds for reds/yellows).',
    '',
    '## 2. Color Matching & CIELAB Delta E',
    'Color matching in plants utilizes spectrophotometers to measure color coordinates in the CIELAB color space. The difference between a production sample and a standard is defined by $\\Delta E^*$:',
    '$$\\Delta E^* = \\sqrt{(\\Delta L^*)^2 + (\\Delta a^*)^2 + (\\Delta b^*)^2}$$',
    'Where $L^*$ is lightness, $a^*$ is red/green coordinate, and $b^*$ is yellow/blue coordinate.'
  ].join('\n'),
  ch9: [
    '# Chapter 9: Quality Control in Compounding: Color, MFI, and Tensile Testing',
    '',
    '## 1. Compounding QC Protocols',
    'Key parameters evaluated include ash content (ASTM D5630), Melt Flow Index (ASTM D1238), color coordinates (CIELAB Delta E), and mechanical tensile properties (ASTM D638).'
  ].join('\n'),
  ch10: [
    '# Chapter 10: Sustainable Compounding: Bio-based Additives and Circular Economy',
    '',
    '## 1. Bio-based Additives & Fillers',
    'Modern formulations incorporate renewable fillers (wood flour, cellulose fibers, starch) and bio-based plasticizers (epoxidized soybean oil - ESO) to reduce the environmental impact of compound systems.',
    '',
    '## 2. Compounding Recycled Resins',
    'Processing PCR (Post-Consumer Resin) presents challenges due to polymer contamination and thermal degradation. Incorporating chain extenders (e.g., styrene-maleic anhydride copolymers) reacts with terminal groups to reconstruct degraded molecular weight backbones during extrusion.'
  ].join('\n')
};

const TESTING_GUIDE_CHAPTERS = {
  ch1: [
    '# Chapter 1: Introduction to Polymer Testing: Why Testing Matters',
    '',
    '## 1. Industrial Significance',
    'Testing is critical to ensure polymer parts meet engineering specifications and regulatory codes. Raw resins exhibit variability in molecular weight distribution and rheology, and processing introduces thermal history and orientation states that directly affect mechanical and aesthetic performance.',
    '',
    '## 2. Quality Control vs failure Analysis',
    'Quality Control (QC) focuses on routine checks (e.g., checking if MFI matches batch tolerances). Failure Analysis investigates components that cracked or warped in service, tracing chemical degradation or stress concentration origins.'
  ].join('\n'),
  ch2: [
    '# Chapter 2: Tensile Testing (ASTM D638)',
    '',
    '## 1. Mechanics of Tensile Testing',
    'Tensile testing applies uniaxial tension load to dumbbell-shaped specimens. The stress ($\\sigma$) is calculated by dividing force ($F$) by the initial cross-sectional area ($A_0$):',
    '$$\\sigma = \\frac{F}{A_0}$$',
    'The strain ($\\epsilon$) is the change in gauge length ($\\Delta L$) relative to initial length ($L_0$):',
    '$$\\epsilon = \\frac{\\Delta L}{L_0}$$',
    '',
    '## 2. Key Tensile Parameters',
    '- **Young\'s Modulus ($E$)**: Slope of linear elastic region ($E = \\sigma / \\epsilon$).',
    '- **Yield Point**: Stress at which plastic deformation begins.',
    '- **Ultimate Tensile Strength**: Maximum stress sustained before fracture.',
    '- **Elongation at Break**: Strain level at specimen rupture.'
  ].join('\n'),
  ch3: [
    '# Chapter 3: Impact Testing (ASTM D256, D6110)',
    '',
    '## 1. Izod Impact Testing (ASTM D256)',
    'Izod impact tests measure the energy required to break a notched cantilever beam specimen with a swinging pendulum. The notch acts as a stress concentrator, forcing brittle crack propagation.',
    '',
    '## 2. Charpy Impact Testing (ASTM D6110)',
    'In Charpy tests, the specimen is supported horizontally at both ends (simply supported) and struck in the middle. Results are reported in energy absorbed per unit width ($J/m$) or area ($kJ/m^2$).'
  ].join('\n'),
  ch4: [
    '# Chapter 4: Flexural Testing (ASTM D790)',
    '',
    '## 1. Flexural Strength and Modulus',
    'Flexural tests evaluate a polymer beam under three-point loading conditions. Flexural stress ($\\sigma_f$) at the outer surface is:',
    '$$\\sigma_f = \\frac{3 F L}{2 b d^2}$$',
    'Flexural strain ($\\epsilon_f$) is calculated as:',
    '$$\\epsilon_f = \\frac{6 D d}{L^2}$$',
    'Where $F$ is load, $L$ is support span, $b$ is beam width, $d$ is thickness, and $D$ is deflection at center.'
  ].join('\n'),
  ch5: [
    '# Chapter 5: Hardness Testing (Shore A/D)',
    '',
    '## 1. Shore Durometer Scales',
    'Hardness measures resistance to localized indentation. It is tested using Shore durometer scales:',
    '- **Shore A**: Used for soft elastomers, rubbers, and flexible PVC. Uses a blunt cone indenter.',
    '- **Shore D**: Used for hard plastics (Nylon, PC, HDPE). Uses a sharp needle indenter.',
    'Hardness values range from 0 to 100, where higher values indicate greater resistance to indentation.'
  ].join('\n'),
  ch6: [
    '# Chapter 6: Thermal Analysis: DSC, TGA, and DMA',
    '',
    '## 1. Differential Scanning Calorimetry (DSC - ASTM D3418)',
    'DSC measures heat flow differences between a sample and reference pan. It reveals transitions: Glass Transition ($T_g$), Crystallization Peak ($T_c$), and Melting Peak ($T_m$).',
    '',
    '## 2. Thermogravimetric Analysis (TGA - ASTM E1131)',
    'TGA monitors sample weight changes as a function of temperature under nitrogen or air. Used to determine thermal stability and filler content.',
    '',
    '## 3. Dynamic Mechanical Analysis (DMA)',
    'DMA measures dynamic modulus under sinusoidal stress, revealing $G\'$ (storage), $G\'\'$ (loss), and $\\tan \\delta$.'
  ].join('\n'),
  ch7: [
    '# Chapter 7: Melt Flow Indexer (ASTM D1238, ISO 1133)',
    '',
    '## 1. Melt Flow Rate (MFR) & Melt Volume Rate (MVR)',
    'MFI tests measure the rate of extrusion of molten resins through a standard die ($2.095$ mm diameter, $8.0$ mm length) at a specified temperature and load (e.g. $2.16$ kg for PE). It is reported in grams per 10 minutes ($g/10$ min) and relates inversely to molecular weight.'
  ].join('\n'),
  ch8: [
    '# Chapter 8: Rheological Testing: Capillary and Rotational Rheometry',
    '',
    '## 1. Capillary Rheometery',
    'Used for high shear rates ($10$ to $10^5$ s⁻¹) corresponding to injection molding. Measures wall shear stress vs apparent shear rate.',
    '',
    '## 2. Rotational Rheometry',
    'Used for low shear rates ($10^{-3}$ to $10^2$ s⁻¹) and viscoelastic behavior. Measures zero-shear viscosity and oscillatory modulus values.'
  ].join('\n'),
  ch9: [
    '# Chapter 9: Chemical Characterization: FTIR, NMR, and GPC',
    '',
    '## 1. Fourier Transform Infrared Spectroscopy (FTIR)',
    'FTIR identifies functional groups and chemical compositions based on molecular vibrational absorptions. Used to identify unknown plastics or analyze oxidation level.',
    '',
    '## 2. Gel Permeation Chromatography (GPC)',
    'Also known as Size Exclusion Chromatography (SEC). Separates polymer chains based on hydrodynamic volume to map complete molecular weight distributions ($M_n$, $M_w$, $M_z$).'
  ].join('\n'),
  ch10: [
    '# Chapter 10: Standards & Accreditation: ASTM, ISO, BIS, and NABL',
    '',
    '## 1. Global Standard Organizations',
    'Standards published by **ASTM International** and **ISO** define testing methodologies to ensure global alignment. In India, the **Bureau of Indian Standards (BIS)** publishes Indian Standards (IS codes).',
    '',
    '## 2. Laboratory Accreditation (NABL)',
    'The National Accreditation Board for Testing and Calibration Laboratories (NABL) certifies testing laboratories under **ISO/IEC 17025** guidelines, confirming technical competence.'
  ].join('\n')
};

const booksToSeed = [
  // 1. Expanded Rheology Guide
  {
    slug: 'polymer-rheology-guide',
    title: 'The Complete Guide to Polymer Rheology',
    authors: 'PolymerHub Editorial Board',
    category: 'original_guide',
    difficulty: 'Advanced',
    focus: 'Melt rheology, shear-thinning equations, capillary corrections, and testing standards.',
    summary: 'A comprehensive, calculations-grounded engineering guide covering polymer flow behavior, non-Newtonian models, capillary rheometry corrections, and rotational viscoelastic standards.',
    subject_slugs: ['polymer-chemistry', 'polymer-processing', 'polymer-rheology'],
    careers: ['Rheologist', 'Extrusion Engineer', 'Mould Designer'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Why Rheology Matters to Every Polymer Engineer' },
      { id: 'ch2', title: 'Chapter 2: Newtonian vs. Non-Newtonian: The First Big Distinction' },
      { id: 'ch3', title: 'Chapter 3: The Power Law, Carreau-Yasuda, and Real Polymer Behavior' },
      { id: 'ch4', title: 'Chapter 4: Capillary Rheometry: Corrections and Calculations' },
      { id: 'ch5', title: 'Chapter 5: Die Swell, Melt Fracture, and Flow Instability' },
      { id: 'ch6', title: 'Chapter 6: Rotational Rheometry and Viscoelasticity' },
      { id: 'ch7', title: 'Chapter 7: Injecting, Extruding, Blowing: Applying Rheology' },
      { id: 'ch8', title: 'Chapter 8: Rheology Testing Standards (ASTM D3835, ISO 11443, ASTM D4440)' }
    ],
    chapters: RHEOLOGY_GUIDE_CHAPTERS,
    free_access: true
  },
  // 2. Expanded Compounding Handbook
  {
    slug: 'compounding-additives-handbook',
    title: 'Plastics Compounding & Additives Handbook',
    authors: 'PolymerHub Editorial Board',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Twin-screw extrusion setup, masterbatches, UV stabilizers, flame retardants, compounding QC, colorants, and sustainable compounding.',
    summary: 'A detailed compounding and formulations handbook outlining modular screw kinetics, let-down calculations, autoxidation chemistry, carbon black dispersion, and post-consumer resin compounding.',
    subject_slugs: ['polymer-processing', 'additives-compounding', 'sustainable-plastics'],
    careers: ['Compounding Specialist', 'Materials Engineer', 'Additives Chemist'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Why Compounding is the Real Money in Plastics' },
      { id: 'ch2', title: 'Chapter 2: Twin-Screw Extrusion and SME Mechanics' },
      { id: 'ch3', title: 'Chapter 3: Masterbatches and Let-Down Calculations' },
      { id: 'ch4', title: 'Chapter 4: UV Stabilizers and HALS Denisov Cycle' },
      { id: 'ch5', title: 'Chapter 5: Flame Retardants and Intumescent Chemistry' },
      { id: 'ch6', title: 'Chapter 6: Mechanical Rubber-Toughening Mechanics' },
      { id: 'ch7', title: 'Chapter 7: Inorganic Fillers and aspect ratios' },
      { id: 'ch8', title: 'Chapter 8: Colorants & Pigments: Titanium Dioxide and Color Matching' },
      { id: 'ch9', title: 'Chapter 9: Quality Control in Compounding' },
      { id: 'ch10', title: 'Chapter 10: Sustainable Compounding & Bio-based Additives' }
    ],
    chapters: COMPOUNDING_HANDBOOK_CHAPTERS,
    free_access: true
  },
  // 3. New Testing Guide
  {
    slug: 'polymer-testing-characterization-guide',
    title: 'Polymer Testing & Characterization Guide',
    authors: 'PolymerHub Editorial Board',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Mechanical testing, thermal analysis, rheology, chemical characterization, standards, and laboratory accreditation.',
    summary: 'An authoritative testing guide covering ASTM/ISO standards for tensile, impact, flexural, hardness, DSC, TGA, DMA, and MFI testing along with chemical analysis (FTIR, NMR, GPC).',
    subject_slugs: ['polymer-testing', 'polymer-chemistry', 'quality-management-systems'],
    careers: ['QA/QC Engineer', 'Testing Lab In-charge', 'Failure Analyst', 'Materials Scientist'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Introduction to Polymer Testing: Why Testing Matters' },
      { id: 'ch2', title: 'Chapter 2: Tensile Testing (ASTM D638)' },
      { id: 'ch3', title: 'Chapter 3: Impact Testing (ASTM D256, D6110)' },
      { id: 'ch4', title: 'Chapter 4: Flexural Testing (ASTM D790)' },
      { id: 'ch5', title: 'Chapter 5: Hardness Testing (Shore A/D)' },
      { id: 'ch6', title: 'Chapter 6: Thermal Analysis: DSC, TGA, and DMA' },
      { id: 'ch7', title: 'Chapter 7: Melt Flow Indexer (ASTM D1238, ISO 1133)' },
      { id: 'ch8', title: 'Chapter 8: Rheological Testing: Capillary and Rotational Rheometry' },
      { id: 'ch9', title: 'Chapter 9: Chemical Characterization: FTIR, NMR, and GPC' },
      { id: 'ch10', title: 'Chapter 10: Standards & Accreditation: ASTM, ISO, BIS, and NABL' }
    ],
    chapters: TESTING_GUIDE_CHAPTERS,
    free_access: true
  },
  // 4. Open-Access Book 1
  {
    slug: 'plastics-materials-processing-strong-free',
    title: 'Plastics Materials and Processing (3rd Edition)',
    authors: 'A. Brent Strong',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Comprehensive coverage of plastics materials, processing methods, and applications.',
    summary: 'Comprehensive coverage of plastics materials, processing methods, and applications. Includes injection molding, extrusion, blow molding, thermoforming, and advanced topics.',
    file_url: 'https://archive.org/details/plasticsmaterial0000stro',
    purchase_url: 'https://archive.org/details/plasticsmaterial0000stro',
    subject_slugs: ['polymer-processing', 'polymer-materials'],
    careers: ['Process Engineer', 'Materials Specialist', 'R&D Researcher'],
    free_access: true
  },
  // 5. Open-Access Book 2
  {
    slug: 'handbook-plastics-elastomers-composites-harper-free',
    title: 'Handbook of Plastics, Elastomers, and Composites (4th Edition)',
    authors: 'Charles A. Harper',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Properties, processing, testing, and applications of plastics, elastomers, and composites.',
    summary: 'Comprehensive handbook covering plastics, elastomers, and composites. Includes properties, processing, testing, and applications.',
    file_url: 'https://archive.org/details/handbookofplasti0000unse',
    purchase_url: 'https://archive.org/details/handbookofplasti0000unse',
    subject_slugs: ['polymer-chemistry', 'polymer-processing', 'polymer-composites'],
    careers: ['Materials Design Engineer', 'R&D Manager', 'Composites Engineer'],
    free_access: true
  }
];

async function seedExpandedBooks() {
  console.log('=== SEEDING EXPANDED DIGITAL LIBRARY BOOKS ===\n');
  
  let upsertCount = 0;
  for (const book of booksToSeed) {
    console.log(`📖 Seeding book profile: "${book.title}" (slug: ${book.slug})`);
    
    const bookData = { ...book };
    delete bookData.free_access;

    const { error } = await supabase
      .from('library_books')
      .upsert(bookData, { onConflict: 'slug' });
      
    if (error) {
      console.error(`  ❌ Failed to seed: ${book.title}`, error.message);
    } else {
      console.log(`  ✅ Successfully seeded: ${book.title}`);
      upsertCount++;
    }
  }
  
  console.log(`\n🎉 Done! Seeded ${upsertCount} of ${booksToSeed.length} books successfully.`);
}

seedExpandedBooks().catch(console.error);
