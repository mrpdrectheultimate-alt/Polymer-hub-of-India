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
    '# Chapter 7: Fillers: Talc, Calcium Carbonate, Glass Fibers, and Aesthetics',
    '',
    '## 1. Inorganic Fillers',
    '- **Calcium Carbonate**: Spherical shape, low cost, minor reinforcement.',
    '- **Talc**: Platy, high aspect ratio, increases stiffness and HDT.',
    '- **Glass Fibers**: Fibrous, high aspect ratio, maximum reinforcement.'
  ].join('\n'),
  ch8: [
    '# Chapter 8: Quality Control in Compounding: Color, MFI, and Tensile Testing',
    '',
    '## 1. Compounding QC Protocols',
    'Key parameters evaluated include ash content (ASTM D5630), Melt Flow Index (ASTM D1238), color coordinates (CIELAB Delta E), and mechanical tensile properties (ASTM D638).'
  ].join('\n')
};

const COMMERCIAL_BOOKS = [
  {
    slug: 'allen-baker',
    title: 'Handbook of Plastic Technology',
    authors: 'Allen & Baker',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Foundational',
    focus: 'Industrial processing: injection, compression, transfer, blow moulding with troubleshooting guidelines.',
    summary: 'A complete handbook focusing on the mechanical operation and troubleshooting of primary plastics processing machinery. Ideal for factory floor engineers.',
    purchase_url: 'https://www.amazon.com/dp/B08XYZ1234',
    careers: ['Process Engineer', 'Production Engineer', 'QA/QC Manager'],
    subject_slugs: ['polymer-processing', 'mould-design'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Injection Molding Machinery and Configuration' },
      { id: 'ch2', title: 'Chapter 2: Mold Architecture and Gating Layouts' },
      { id: 'ch3', title: 'Chapter 3: Troubleshooting Processing Defects' },
      { id: 'ch4', title: 'Chapter 4: Extrusion Die Calculations' }
    ]
  },
  {
    slug: 'rosato',
    title: 'Plastics Processing Data Handbook',
    authors: 'D.V. Rosato',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Fabrication data, troubleshooting matrices, instrumentation, and process-property relationships.',
    summary: 'The most comprehensive compilation of quantitative processing data, design constants, and empirical troubleshooting guidelines for plastics fabrication.',
    purchase_url: 'https://www.amazon.com/dp/B08XYZ1235',
    careers: ['Process Engineer', 'Plant Manager', 'QA/QC Engineer'],
    subject_slugs: ['polymer-processing', 'polymer-testing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Properties of Melt Rheology' },
      { id: 'ch2', title: 'Chapter 2: Injection Molding Data Sheet Guidelines' },
      { id: 'ch3', title: 'Chapter 3: Extrusion Processing Parameters' },
      { id: 'ch4', title: 'Chapter 4: Plant Design and Safety Protocols' }
    ]
  },
  {
    slug: 'kutz',
    title: 'Applied Plastics Engineering Handbook',
    authors: 'Myer Kutz',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Materials, additives, fillers, sustainability, and 3D printing for working engineers.',
    summary: 'A modern, practical guide covering bio-based materials, sustainable processes, composite design, and digital manufacturing methods.',
    purchase_url: 'https://www.amazon.com/dp/B08XYZ1236',
    careers: ['R&D Engineer', 'Materials Specialist', 'Design Engineer'],
    subject_slugs: ['polymer-composites', 'sustainable-plastics'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Engineering Thermoplastics Selection' },
      { id: 'ch2', title: 'Chapter 2: Functional Additives and Fillers' },
      { id: 'ch3', title: 'Chapter 3: Biodegradable and Bio-based Resins' },
      { id: 'ch4', title: 'Chapter 4: 3D Printing of Polymers' }
    ]
  }
];

const OPEN_ACCESS_RESOURCES = [
  {
    slug: 'epa-recycling-manual',
    title: 'Plastic Recycling Best Practices and Systems',
    authors: 'US Environmental Protection Agency (EPA)',
    cover_url: 'https://images.unsplash.com/photo-1532996127008-05dedf1cf8d3?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Foundational',
    focus: 'Municipal solid waste management, sorting technologies, and post-consumer resin washing.',
    summary: 'A public domain guide outlining the economics, machinery setups, and washing chemistry required for high-yield post-consumer mechanical recycling.',
    file_url: 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf',
    careers: ['Recycling Consultant', 'Sustainability Analyst', 'Operations Manager'],
    subject_slugs: ['recycling-technology', 'sustainable-plastics'],
    toc: [
      { id: 'ch1', title: 'Section 1: Global Plastic Waste Streams' },
      { id: 'ch2', title: 'Section 2: Sorting and Separation Technologies' },
      { id: 'ch3', title: 'Section 3: Washing and Contaminant Removal' },
      { id: 'ch4', title: 'Section 4: Economic and Policy Drivers' }
    ]
  },
  {
    slug: 'nasa-composites-standard',
    title: 'Structural Composite Design and Analysis Manual',
    authors: 'National Aeronautics and Space Administration (NASA)',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Mechanics of unidirectional plies, laminated plate theory, and spaceflight qualification.',
    summary: 'Accredited aerospace design standard detailing the mathematics of laminate shell analysis, joint designs, and failure criteria for CFRP.',
    file_url: 'https://ntrs.nasa.gov/citations/19950002341.pdf',
    careers: ['Composite Design Engineer', 'Stress Analyst', 'Spaceflight Materials Engineer'],
    subject_slugs: ['polymer-composites'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Fiber-Matrix Micromechanics' },
      { id: 'ch2', title: 'Chapter 2: Laminated Plate Mechanical Theory' },
      { id: 'ch3', title: 'Chapter 3: Joint and Interface Attachment Design' },
      { id: 'ch4', title: 'Chapter 4: Stress and Failure Prediction Calculations' }
    ]
  }
];

async function seedLibrary() {
  console.log('=== SEEDING DIGITAL LIBRARY ARCHITECTURE ===');

  // 1. Insert Original Guides
  const originalGuides = [
    {
      slug: 'polymer-rheology-guide',
      title: 'The Practical Polymer Rheology Guide: Viscosity, Flow & Die Mechanics',
      authors: 'PolymerHub Academic Board',
      category: 'original_guide',
      difficulty: 'Advanced',
      focus: 'Melt rheology, shear-thinning equations, capillary corrections, and flow instabilities.',
      summary: 'An advanced curriculum guide explaining the physics of polymer flow, non-Newtonian mathematics, Bagley/Rabinowitsch corrections, and processing mechanics.',
      careers: ['Rheologist', 'Extrusion Engineer', 'Mould Designer'],
      subject_slugs: ['polymer-processing'],
      toc: [
        { id: 'ch1', title: 'Chapter 1: Why Rheology Matters to Every Polymer Engineer' },
        { id: 'ch2', title: 'Chapter 2: Newtonian vs. Non-Newtonian: The First Big Distinction' },
        { id: 'ch3', title: 'Chapter 3: The Power Law, Carreau-Yasuda, and Real Polymer Behavior' },
        { id: 'ch4', title: 'Chapter 4: Capillary Rheometry: Corrections and Calculations' },
        { id: 'ch5', title: 'Chapter 5: Die Swell, Melt Fracture, and Flow Instability' },
        { id: 'ch6', title: 'Chapter 6: Rotational Rheometry and Viscoelasticity' },
        { id: 'ch7', title: 'Chapter 7: Injecting, Extruding, Blowing: Applying Rheology' }
      ],
      chapters: RHEOLOGY_GUIDE_CHAPTERS
    },
    {
      slug: 'compounding-additives-handbook',
      title: 'Plastics Compounding & Additives Handbook: Formulations, Blending & Process Engineering',
      authors: 'PolymerHub Academic Board',
      category: 'original_guide',
      difficulty: 'Intermediate',
      focus: 'Twin-screw extrusion setup, masterbatches, UV stabilizers, flame retardants, and compounding QC.',
      summary: 'A practical process engineering guide detailing twin-screw mixing kinetics, stabilizer mechanisms, intumescent flame retardants, rubber toughening, and quality testing.',
      careers: ['Compounding Specialist', 'Materials Engineer', 'Additives Chemist'],
      subject_slugs: ['polymer-processing', 'sustainable-plastics'],
      toc: [
        { id: 'ch1', title: 'Chapter 1: Why Compounding is the Real Money in Plastics' },
        { id: 'ch2', title: 'Chapter 2: Twin-Screw Extrusion and SME Mechanics' },
        { id: 'ch3', title: 'Chapter 3: Masterbatches and Let-Down Calculations' },
        { id: 'ch4', title: 'Chapter 4: UV Stabilizers and HALS Denisov Cycle' },
        { id: 'ch5', title: 'Chapter 5: Flame Retardants and Intumescent Chemistry' },
        { id: 'ch6', title: 'Chapter 6: Mechanical Rubber-Toughening Mechanics' },
        { id: 'ch7', title: 'Chapter 7: Inorganic Fillers and aspect ratios' },
        { id: 'ch8', title: 'Chapter 8: Quality Control in Compounding' }
      ],
      chapters: COMPOUNDING_HANDBOOK_CHAPTERS
    }
  ];

  let added = 0;

  for (const item of originalGuides) {
    const { error } = await supabase.from('library_books').upsert(item, { onConflict: 'slug' });
    if (error) console.error(`  Failed original guide: ${item.slug}`, error.message);
    else { console.log(`  Seeded original guide: "${item.title}"`); added++; }
  }

  // 2. Insert Commercial Book Profiles
  for (const item of COMMERCIAL_BOOKS) {
    const { error } = await supabase.from('library_books').upsert(item, { onConflict: 'slug' });
    if (error) console.error(`  Failed commercial: ${item.slug}`, error.message);
    else { console.log(`  Seeded commercial book profile: "${item.title}"`); added++; }
  }

  // 3. Insert Open-Access Resources
  for (const item of OPEN_ACCESS_RESOURCES) {
    const { error } = await supabase.from('library_books').upsert(item, { onConflict: 'slug' });
    if (error) console.error(`  Failed open-access: ${item.slug}`, error.message);
    else { console.log(`  Seeded open-access resource: "${item.title}"`); added++; }
  }

  console.log(`\n✅ Seeding complete. ${added} library items upserted.`);
}

seedLibrary();
