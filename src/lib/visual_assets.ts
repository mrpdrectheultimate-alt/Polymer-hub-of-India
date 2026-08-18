// src/lib/visual_assets.ts

export interface VisualAsset {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  subject: string;
  chapter: string;
  topic: string;
  type: 'diagram' | 'photo' | 'graph' | 'animation';
  source: string;
  attribution?: string;
  relatedLessonSlug?: string;
}

export const visualAssets: VisualAsset[] = [
  // === POLYMER CHEMISTRY ===
  // 1. Structure (6 assets)
  {
    id: 'pc-struct-01',
    title: 'Amorphous vs Crystalline Arrangements',
    description: 'Schematic comparison showing the disordered arrangement of polymer chains in the amorphous state versus the highly ordered, folded alignment in crystalline lamellae.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Crystallinity',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-4'
  },
  {
    id: 'pc-struct-02',
    title: 'Linear, Branched, and Crosslinked Architectures',
    description: 'Diagram showing how chain branching and crosslinking affect entanglement density, free volume, tensile modulus, and thermoplastic processability.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Chain Architecture',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-3'
  },
  {
    id: 'pc-struct-03',
    title: 'Spherulite Growth Under Polarized Light',
    description: 'Microphotograph displaying Maltese cross patterns in polymer spherulites grown during slow crystallization from melt, signifying radial crystalline order.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Spherulites',
    type: 'photo',
    source: 'PolymerHub Research Lab',
    relatedLessonSlug: 'polymer-chemistry-4'
  },
  {
    id: 'pc-struct-04',
    title: 'Glass Transition (Tg) Molecular Motion',
    description: 'Schematic representing chain segments shifting from frozen glassy states to cooperative short-range crankshaft motions above the glass transition temperature.',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Glass Transition',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-7'
  },
  {
    id: 'pc-struct-05',
    title: 'Tacticity Configurations (Isotactic, Syndiotactic, Atactic)',
    description: 'Visual map of stereochemical isomerism in polypropylene, contrasting the spatial orientation of methyl substituent groups along the main carbon backbone.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Stereochemistry',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-6'
  },
  {
    id: 'pc-struct-06',
    title: 'Copolymer Structures (Random, Alternating, Block, Graft)',
    description: 'Schematic diagram illustrating the distribution of monomer types A and B along copolymer backbones, highlighting microphase separation in block structures.',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymer Structure',
    topic: 'Copolymers',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-3'
  },

  // 2. Polymerization (6 assets)
  {
    id: 'pc-poly-01',
    title: 'Free-Radical Initiation, Propagation, and Termination',
    description: 'Reaction pathway detailing thermal initiator dissociation (peroxides), radical addition to monomer, chain propagation, and coupling/disproportionation termination.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymerization',
    topic: 'Free Radical Polymerization',
    type: 'diagram',
    source: 'PolymerHub Chemical Database',
    relatedLessonSlug: 'polymer-chemistry-2'
  },
  {
    id: 'pc-poly-02',
    title: 'Step-Growth vs Chain-Growth Kinetics',
    description: 'Comparison graph showing average molecular weight (DP) versus fractional conversion (p), showing the steep increase in molecular weight only at p > 0.99 for step-growth (Carothers equation).',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymerization',
    topic: 'Kinetics',
    type: 'graph',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-chemistry-5'
  },
  {
    id: 'pc-poly-03',
    title: 'Ziegler-Natta Catalyst Active Complex',
    description: 'Molecular diagram of the titanium chloride-triethylaluminum active site showing coordination of ethylene monomers and stereospecific insertion mechanism.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymerization',
    topic: 'Ziegler-Natta Catalysts',
    type: 'diagram',
    source: 'PolymerHub Catalysis Center',
    relatedLessonSlug: 'polymer-chemistry-6'
  },
  {
    id: 'pc-poly-04',
    title: 'Gel Permeation Chromatograph (GPC) Calibration',
    description: 'Standard chromatogram showing molecular size exclusion, elution volumes, and log Mw calibration curve mapping Mn, Mw, and polydispersity index.',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Molecular Weight',
    topic: 'Molecular Weight Distribution',
    type: 'graph',
    source: 'PolymerHub Testing Center',
    relatedLessonSlug: 'polymer-chemistry-5'
  },
  {
    id: 'pc-poly-05',
    title: 'Emulsion Polymerization Micelle Formation',
    description: 'Detailed schematic showing surfactant micelles, aqueous initiator, monomer droplets, and the nucleation of latex particles inside the swollen micelle core.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymerization',
    topic: 'Emulsion Polymerization',
    type: 'diagram',
    source: 'PolymerHub Colloids Lab',
    relatedLessonSlug: 'polymer-chemistry-2'
  },
  {
    id: 'pc-poly-06',
    title: 'Anionic Living Polymerization Pathway',
    description: 'Chemical synthesis schematic showing polymerization of styrene using butyl lithium initiator in a solvent, resulting in highly monodisperse block structures.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Chemistry',
    chapter: 'Polymerization',
    topic: 'Anionic Polymerization',
    type: 'diagram',
    source: 'PolymerHub Synthesis Center',
    relatedLessonSlug: 'polymer-chemistry-2'
  },

  // === POLYMER PROCESSING ===
  // 3. Injection Molding (8 assets)
  {
    id: 'pp-inj-01',
    title: 'Reciprocating Screw Assembly Cross Section',
    description: 'Cross-sectional CAD diagram detailing the feeding, transition, and metering zones of an injection molding screw, featuring non-return check valves.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Screw Design',
    type: 'diagram',
    source: 'PolymerHub Processing Lab',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-02',
    title: 'Six-Stage Injection Molding Process Cycle',
    description: 'Step-by-step schematic showing the complete process: Clamping -> Injection -> Packing & Holding -> Cooling -> Mold Opening -> Part Ejection.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Process Cycle',
    type: 'diagram',
    source: 'PolymerHub Processing Lab',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-03',
    title: 'Defect Analysis: Mold Flash and Short Shots',
    description: 'High-contrast photographs showing flash defects at parting lines from excessive pressure, compared to incomplete filling (short shots) from low melt temperature.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Troubleshooting Defects',
    type: 'photo',
    source: 'Supreme Industries QC Center',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-04',
    title: 'Mold Cavity Pressure Curve',
    description: 'Graph showing pressure profiles inside the mold cavity during filling, packing, gate freeze-off, and cooling phases, illustrating peak pressure points.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Cavity Pressure Control',
    type: 'graph',
    source: 'PolymerHub Automation Systems',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-05',
    title: 'Conformal vs Conventional Mold Cooling Channels',
    description: 'Schematic comparing traditional drilled straight-line cooling lines with metal 3D-printed conformal channels that follow the exact contours of the core and cavity.',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Mold Cooling',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-06',
    title: 'Parting Line and Slide Core Mechanical Mechanisms',
    description: 'Mechanical blueprint of a mould tool containing sliding splits, angle pins, and guide blocks to release complex negative undercuts during tool opening.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Mold Mechanisms',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-07',
    title: 'Hot Runner Manifold Valve Gate System',
    description: 'Schematic cross section of a valve-gated hot runner manifold showing hydraulic pistons actuation, control needles, and thermocontrol systems.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Hot Runner Systems',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'polymer-processing-1'
  },
  {
    id: 'pp-inj-08',
    title: 'Clamping Force vs Part Projection Area Diagram',
    description: 'Engineering graph plotting required machine tonnage as a function of projected part surface area and plastic melt pressure to avoid parting-line separation.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Injection Molding',
    topic: 'Clamping Unit Calculations',
    type: 'graph',
    source: 'PolymerHub Automation Systems',
    relatedLessonSlug: 'polymer-processing-1'
  },

  // 4. Extrusion (6 assets)
  {
    id: 'pp-ext-01',
    title: 'Extruder Feed, Compression, and Metering Zones',
    description: 'Schematic showing single screw zones, explaining the pressure buildup via channel depth reductions (compression ratio) and solid bed melting mechanics.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Screw Design',
    type: 'diagram',
    source: 'PolymerHub Processing Lab',
    relatedLessonSlug: 'polymer-processing-2'
  },
  {
    id: 'pp-ext-02',
    title: 'Blown Film Bubble and Air Ring Assembly',
    description: 'Diagram of blown film extrusion showing the annular die, internal bubble cooling, calibration cage, nip rollers, and lay-flat winders.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Blown Film Extrusion',
    type: 'diagram',
    source: 'Reliance Industries Film Center',
    relatedLessonSlug: 'polymer-processing-2'
  },
  {
    id: 'pp-ext-03',
    title: 'Co-Rotating Twin-Screw Extrusion Elements',
    description: 'CAD illustration of modular kneading blocks, forward/reverse conveying elements, and mechanical shear generation for additive dispersion.',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Compounding Machinery',
    type: 'diagram',
    source: 'PolymerHub Additives Center',
    relatedLessonSlug: 'polymer-processing-2'
  },
  {
    id: 'pp-ext-04',
    title: 'Profile Extrusion Calibrator Sizing Die',
    description: 'Engineering schematic showing a vacuum sizing tank calibration unit used to preserve precise window profile tolerances during melt cooling.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Profile Extrusion',
    type: 'diagram',
    source: 'Supreme Industries Tooling Lab',
    relatedLessonSlug: 'polymer-processing-2'
  },
  {
    id: 'pp-ext-05',
    title: 'Co-Extrusion Feedblock Feed Assembly',
    description: 'Cross-section of a co-extrusion feedblock distributing multiple melt layers from separate extruders into a single flat die for multi-layer barrier film production.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Co-Extrusion Systems',
    type: 'diagram',
    source: 'PolymerHub Processing Lab',
    relatedLessonSlug: 'polymer-processing-2'
  },
  {
    id: 'pp-ext-06',
    title: 'Extrudate Melt Fracture and Sharkskin Defect',
    description: 'Photographs showing the transition from smooth extrudate surfaces to periodic sharkskin ripples and chaotic melt fracture due to excessive wall shear stresses.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Processing',
    chapter: 'Extrusion',
    topic: 'Extrusion Defects',
    type: 'photo',
    source: 'PolymerHub Rheology Lab',
    relatedLessonSlug: 'polymer-processing-2'
  },

  // === POLYMER TESTING ===
  // 5. Tensile Testing (5 assets)
  {
    id: 'pt-tens-01',
    title: 'Universal Testing Machine (UTM) Tensile Grip Setup',
    description: 'Photograph of a standard ASTM D638 tensile test setup, showing dumbbell specimens clamped in pneumatic jaws with an extensometer attached.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Tensile Testing',
    topic: 'Testing Hardware',
    type: 'photo',
    source: 'PolymerHub Testing Lab',
    relatedLessonSlug: 'polymer-testing-2'
  },
  {
    id: 'pt-tens-02',
    title: 'Typical Polymer Stress-Strain Curve',
    description: 'Engineering graph highlighting yield point, ultimate tensile strength, elongation at yield, necking propagation, and break point for brittle, ductile, and elastomeric polymers.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Tensile Testing',
    topic: 'Stress-Strain',
    type: 'graph',
    source: 'PolymerHub Calibration Lab',
    relatedLessonSlug: 'polymer-testing-2'
  },
  {
    id: 'pt-tens-03',
    title: 'Dumbbell Specimen Dimensions (ASTM D638 Type I)',
    description: 'Dimensioned drawing of the standard Type I tensile dumbbell bar, illustrating gauge length, width of narrow section, fillet radius, and thickness limits.',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Tensile Testing',
    topic: 'Specimen Geometry',
    type: 'diagram',
    source: 'PolymerHub Standards Council',
    relatedLessonSlug: 'polymer-testing-2'
  },
  {
    id: 'pt-tens-04',
    title: 'Stress Strain Curve of Brittle vs Ductile Resins',
    description: 'Graph contrasting the high modulus, low elongation behavior of polystyrene (PS) with the lower modulus, cold-drawing behavior of high-density polyethylene (HDPE).',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Tensile Testing',
    topic: 'Mechanical Comparison',
    type: 'graph',
    source: 'PolymerHub Testing Lab',
    relatedLessonSlug: 'polymer-testing-2'
  },
  {
    id: 'pt-tens-05',
    title: 'Tensile Necking propagation Mechanism',
    description: 'Diagram showing shear band nucleation and localized molecular orientation along the draw direction during cold-drawing of ductile polymer sheets.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Tensile Testing',
    topic: 'Molecular Orientation',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'polymer-testing-2'
  },

  // 6. Impact Testing (4 assets)
  {
    id: 'pt-imp-01',
    title: 'Charpy vs Izod Specimen Placement',
    description: 'Schematic illustrating the difference in sample configuration: Charpy (simply supported horizontal beam, notch facing away from hammer) vs Izod (cantilever vertical beam, notch facing the hammer).',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Impact Testing',
    topic: 'Specimen Configuration',
    type: 'diagram',
    source: 'PolymerHub Testing Lab',
    relatedLessonSlug: 'polymer-testing-3'
  },
  {
    id: 'pt-imp-02',
    title: 'Standard V-Notch Specimen Profile',
    description: 'Engineering drawing of the notched region detailing notch radius (0.25 mm), angle (45 degrees), and remaining ligand depth crucial to ASTM D256 impact energy values.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Impact Testing',
    topic: 'Notch Sensitivity',
    type: 'diagram',
    source: 'PolymerHub Standards Council',
    relatedLessonSlug: 'polymer-testing-3'
  },
  {
    id: 'pt-imp-03',
    title: 'Instrumented Impact Force-Time Curve',
    description: 'Graph showing dynamic force response during high-speed pendulum impact, distinguishing crack initiation energy from crack propagation energy.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Impact Testing',
    topic: 'Energy Partitioning',
    type: 'graph',
    source: 'PolymerHub Research Lab',
    relatedLessonSlug: 'polymer-testing-3'
  },
  {
    id: 'pt-imp-04',
    title: 'Ductile vs Brittle Impact Fractures',
    description: 'SEM micrograph displaying stress whitened shear lips in PC (ductile shear yield) vs flat, smooth cleavage surfaces in PMMA (brittle fracture).',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Impact Testing',
    topic: 'Fracture Mechanics',
    type: 'photo',
    source: 'PolymerHub Materials Database',
    relatedLessonSlug: 'polymer-testing-3'
  },

  // 7. Thermal Analysis (5 assets)
  {
    id: 'pt-therm-01',
    title: 'DSC Thermogram Peak Analysis',
    description: 'Standard differential scanning calorimetry plot showing baseline shifts from glass transition (Tg), exothermic cold crystallization (Tc), and endothermic melting (Tm) peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Thermal Analysis',
    topic: 'Differential Scanning Calorimetry',
    type: 'graph',
    source: 'PolymerHub Thermal Lab',
    relatedLessonSlug: 'polymer-testing-4'
  },
  {
    id: 'pt-therm-02',
    title: 'TGA Weight Loss Step Analysis',
    description: 'Thermogravimetric analysis curve detailing thermal degradation stages of filled compounding polymers, marking degradation onset, maximum rate, and filler ash content.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Thermal Analysis',
    topic: 'Thermogravimetric Analysis',
    type: 'graph',
    source: 'PolymerHub Thermal Lab',
    relatedLessonSlug: 'polymer-testing-4'
  },
  {
    id: 'pt-therm-03',
    title: 'DMA Viscoelastic Modulus Curves',
    description: 'Dynamic mechanical analysis plot charting storage modulus (E\'), loss modulus (E\"), and tan delta peak transition versus temperature, identifying primary alpha relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Thermal Analysis',
    topic: 'Dynamic Mechanical Analysis',
    type: 'graph',
    source: 'PolymerHub Rheology Center',
    relatedLessonSlug: 'polymer-testing-4'
  },
  {
    id: 'pt-therm-04',
    title: 'DSC Heat Flux Sensor Layout',
    description: 'Schematic cross section of a heat flux DSC cell, showing furnace, thermoelectric disc, sample and reference pans, and thermocouple placements.',
    imageUrl: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Thermal Analysis',
    topic: 'Calorimeter Design',
    type: 'diagram',
    source: 'PolymerHub Instrumentation Center',
    relatedLessonSlug: 'polymer-testing-4'
  },
  {
    id: 'pt-therm-05',
    title: 'TGA Furnace and Microbalance Schematic',
    description: 'Diagram outlining horizontal microbalance balances, quartz furnace tubes, gas purge configurations, and sample pan hangdown wires inside TGA systems.',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Testing',
    chapter: 'Thermal Analysis',
    topic: 'Thermogravimetric Balance',
    type: 'diagram',
    source: 'PolymerHub Thermal Lab',
    relatedLessonSlug: 'polymer-testing-4'
  },

  // === MOULD DESIGN ===
  // 8. Mould Design (6 assets)
  {
    id: 'md-mould-01',
    title: 'Edge vs Pin vs Submarine Gates',
    description: 'Detailed schematic of different gate architectures, showing how they feed plastic melt into cavities and how parts are degated (manually or automatically).',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Gate Design',
    topic: 'Gate Selection',
    type: 'diagram',
    source: 'CIPET Tool Design Center',
    relatedLessonSlug: 'mould-design-1'
  },
  {
    id: 'md-mould-02',
    title: 'Ejector Pin and Sleeve Assembly Plate',
    description: 'Mechanical schematic illustrating the mold ejection plate containing return pins, ejector pins, and stripper sleeve ejectors that eject the part.',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Ejection Systems',
    topic: 'Mechanical Ejection',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'mould-design-3'
  },
  {
    id: 'md-mould-03',
    title: 'Balanced vs Unbalanced Runner Systems',
    description: 'Schematic comparison showing standard circular branching layouts (naturally balanced runner length) vs unbalanced linear configurations leading to uneven cavity fill pressures.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Runner Design',
    topic: 'Runner Balancing',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'mould-design-1'
  },
  {
    id: 'md-mould-04',
    title: 'Mold venting Channel Profile',
    description: 'Detailed drawing showing the dimensions of venting grooves at parting lines (typically 0.015-0.03 mm depth depending on viscosity) to allow air escape without causing flash.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Ejection Systems',
    topic: 'Mold Venting',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'mould-design-3'
  },
  {
    id: 'md-mould-05',
    title: 'Stripper Plate Ejection Mechanism',
    description: 'Mould assembly diagram demonstrating stripper plate movements to push thin-walled round cylindrical cup shapes off core pins without creating localized pin marks.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Ejection Systems',
    topic: 'Stripper Plate',
    type: 'diagram',
    source: 'PolymerHub Tooling Lab',
    relatedLessonSlug: 'mould-design-3'
  },
  {
    id: 'md-mould-06',
    title: 'Conformal Cooling Channel Thermal Analysis',
    description: 'FEA thermal map showing hot spots and temperature gradients across conventional vs conformal mould cooling layout designs during cooling cycles.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Mould Design',
    chapter: 'Cooling Systems',
    topic: 'Conformal Cooling',
    type: 'graph',
    source: 'PolymerHub CAE simulations',
    relatedLessonSlug: 'mould-design-2'
  },

  // === RUBBER TECHNOLOGY ===
  // 9. Rubber Technology (5 assets)
  {
    id: 'rt-rubb-01',
    title: 'Sulfur Vulcanization Crosslinking Bridges',
    description: 'Chemical diagram showing the formation of mono, di, and polysulfidic crosslink bridges between cis-1,4-polyisoprene chains, transforming elastic rubber into stable vulcanizates.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Rubber Technology',
    chapter: 'Vulcanization',
    topic: 'Sulfur Vulcanization',
    type: 'diagram',
    source: 'PolymerHub Rubber Institute',
    relatedLessonSlug: 'rubber-technology-1'
  },
  {
    id: 'rt-rubb-02',
    title: 'Oscillating Disc Rheometer (ODR) Cure Curve',
    description: 'Rheogram displaying torque limits (ML, MH), scorch time (ts2), and optimum cure time (tc90) during compounding and vulcanization.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Rubber Technology',
    chapter: 'Vulcanization',
    topic: 'ODR Cure Curve',
    type: 'graph',
    source: 'PolymerHub Testing Center',
    relatedLessonSlug: 'rubber-technology-1'
  },
  {
    id: 'rt-rubb-03',
    title: 'Carbon Black Reinforcement Mechanism',
    description: 'Schematic detailing physical adsorption and chain occlusion of rubber elastomer chains on the surface of primary carbon black aggregate structures.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    subject: 'Rubber Technology',
    chapter: 'Rubber Compounding',
    topic: 'Reinforcing Fillers',
    type: 'diagram',
    source: 'PolymerHub Academic Board',
    relatedLessonSlug: 'rubber-technology-2'
  },
  {
    id: 'rt-rubb-04',
    title: 'Internal Mixer Banbury Chamber',
    description: 'Detailed schematic showing co-rotating intermeshing rotors, floating ram pressure systems, and intensive mixing zones inside Banbury compound mixing chambers.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Rubber Technology',
    chapter: 'Rubber Compounding',
    topic: 'Compounding Machinery',
    type: 'diagram',
    source: 'PolymerHub Compounding Lab',
    relatedLessonSlug: 'rubber-technology-2'
  },
  {
    id: 'rt-rubb-05',
    title: 'Two Roll Mill Rubber Compounding',
    description: 'Photograph of rubber processing showing natural rubber sheeting band formations around front rollers and manual pigment addition inside friction nips.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    subject: 'Rubber Technology',
    chapter: 'Rubber Compounding',
    topic: 'Milling Operations',
    type: 'photo',
    source: 'PolymerHub Compounding Lab',
    relatedLessonSlug: 'rubber-technology-2'
  },

  // === RECYCLING TECHNOLOGY ===
  // 10. Recycling Technology (5 assets)
  {
    id: 'rc-recy-01',
    title: 'Float-Sink Sort Tank separation',
    description: 'Schematic illustrating the separation of mixed plastics based on density differences (e.g., separating PE/PP with density < 1.0 from PET/PVC with density > 1.0 using water).',
    imageUrl: 'https://images.unsplash.com/photo-1532996127008-05dedf1cf8d3?auto=format&fit=crop&q=80&w=600',
    subject: 'Recycling Technology',
    chapter: 'Mechanical Recycling',
    topic: 'Separation Technologies',
    type: 'diagram',
    source: 'EPA Recycling manual',
    relatedLessonSlug: 'recycling-technology-2'
  },
  {
    id: 'rc-recy-02',
    title: 'Near-Infrared (NIR) Optical Sorting Unit',
    description: 'Schematic of an automated sorting line showing air nozzles ejecting target plastic containers based on their reflective NIR spectra signatures.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    subject: 'Recycling Technology',
    chapter: 'Mechanical Recycling',
    topic: 'Optical Sorting',
    type: 'diagram',
    source: 'PolymerHub Sorting Systems',
    relatedLessonSlug: 'recycling-technology-2'
  },
  {
    id: 'rc-recy-03',
    title: 'Plastic Pyrolysis Process Flow',
    description: 'Flowchart detailing thermo-chemical recycling of mixed polyolefins, converting waste polymer chains to pyrolysis oil, synthesis gas, and carbonaceous char.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    subject: 'Recycling Technology',
    chapter: 'Chemical Recycling',
    topic: 'Pyrolysis',
    type: 'diagram',
    source: 'PolymerHub Green Chemistry Center',
    relatedLessonSlug: 'recycling-technology-3'
  },
  {
    id: 'rc-recy-04',
    title: 'PET Glycolysis Chemical Pathway',
    description: 'Reaction mechanism illustrating depolymerization of polyethylene terephthalate (PET) flakes using ethylene glycol to recover bis(2-hydroxyethyl) terephthalate (BHET) monomer.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Recycling Technology',
    chapter: 'Chemical Recycling',
    topic: 'Solvolysis of PET',
    type: 'diagram',
    source: 'PolymerHub Chemistry Lab',
    relatedLessonSlug: 'recycling-technology-3'
  },
  {
    id: 'rc-recy-05',
    title: 'Mixed Post-Consumer Pellets Re-compounding',
    description: 'Close-up photograph showing recycled pellets containing minor color variations and pinholes, illustrating mechanical recycling grade quality challenges.',
    imageUrl: 'https://images.unsplash.com/photo-1605600611220-b796b44d1100?auto=format&fit=crop&q=80&w=600',
    subject: 'Recycling Technology',
    chapter: 'Mechanical Recycling',
    topic: 'Recycled Pellet Quality',
    type: 'photo',
    source: 'EPA Testing Laboratory',
    relatedLessonSlug: 'recycling-technology-2'
  },

  // === SUSTAINABLE PLASTICS ===
  // 11. Sustainable Plastics (4 assets)
  {
    id: 'sp-sust-01',
    title: 'PLA and PHA Molecular Structures',
    description: 'Chemical structures showing the differences between poly(lactic acid) (PLA, synthesised from lactic acid monomers) and polyhydroxyalkanoates (PHA, synthesised intracellularly by bacteria).',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Sustainable Plastics',
    chapter: 'Bioplastics',
    topic: 'Polymer Chemistries',
    type: 'diagram',
    source: 'PolymerHub Green Materials Lab',
    relatedLessonSlug: 'sustainable-plastics-2'
  },
  {
    id: 'sp-sust-02',
    title: 'Compostability Degradation Phases',
    description: 'Chronological photo sequence showing bioplastic film disintegration and complete biodegradation in industrial composting environments within 180 days.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    subject: 'Sustainable Plastics',
    chapter: 'Compostability',
    topic: 'Compost Standards',
    type: 'photo',
    source: 'CIPET Biodegradability Lab',
    relatedLessonSlug: 'sustainable-plastics-1'
  },
  {
    id: 'sp-sust-03',
    title: 'Starch Plasticized Matrix Blend Morphology',
    description: 'SEM micrograph displaying dispersion of thermoplastic starch (TPS) domains inside a hydrophobic biodegradable polyester matrix (e.g., PBAT) for bag extrusion.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    subject: 'Sustainable Plastics',
    chapter: 'Bioplastics',
    topic: 'Starch Blends',
    type: 'photo',
    source: 'PolymerHub Materials Database',
    relatedLessonSlug: 'sustainable-plastics-2'
  },
  {
    id: 'sp-sust-04',
    title: 'Industrial composting Standard EN 13432 Certification Flowchart',
    description: 'Flowchart detailing the testing stages required for compostability marks: biodegradation, disintegration, ecotoxicity limits, and heavy metal concentrations.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    subject: 'Sustainable Plastics',
    chapter: 'Compostability',
    topic: 'Compost Standards',
    type: 'diagram',
    source: 'PolymerHub Certification Center',
    relatedLessonSlug: 'sustainable-plastics-1'
  },

  // === POLYMER COMPOSITES ===
  // 12. Composites (4 assets)
  {
    id: 'pc-comp-01',
    title: 'Carbon vs Glass Fiber Cross Section',
    description: 'Cross-section micrograph highlighting carbon fiber diameters (5-7 microns, highly structured) compared to E-glass fibers (10-15 microns, circular silicate sections) embedded inside epoxy matrices.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Composites',
    chapter: 'Reinforcements',
    topic: 'Reinforcements',
    type: 'photo',
    source: 'NASA Composites Lab',
    relatedLessonSlug: 'polymer-composites-2'
  },
  {
    id: 'pc-comp-02',
    title: 'Filament Winding Manufacturing Layout',
    description: 'Schematic illustrating dry continuous fiber roving creels pulled through impregnation resin baths and wound onto rotating mandrels under computer tension controls.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Composites',
    chapter: 'Manufacturing',
    topic: 'Composite Manufacturing',
    type: 'diagram',
    source: 'PolymerHub Composite Center',
    relatedLessonSlug: 'polymer-composites-3'
  },
  {
    id: 'pc-comp-03',
    title: 'Vacuum Assisted Resin Transfer Molding (VARTM)',
    description: 'Schematic setup showing dry reinforcing fabric plies inside bagging films, vacuum line draws, feed line manifolds, and atmospheric pressure driven resin infusion flow front lines.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Composites',
    chapter: 'Manufacturing',
    topic: 'Resin Infusion Systems',
    type: 'diagram',
    source: 'NASA Composites Manual',
    relatedLessonSlug: 'polymer-composites-3'
  },
  {
    id: 'pc-comp-04',
    title: 'Fiber Orientation Modulus Distribution',
    description: 'Engineering graph plotting tensile modulus of glass-fiber-reinforced composites as a function of the angle of fiber alignment relative to the loading direction.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    subject: 'Polymer Composites',
    chapter: 'Reinforcements',
    topic: 'Stress-Strain',
    type: 'graph',
    source: 'PolymerHub CAE simulations',
    relatedLessonSlug: 'polymer-composites-2'
  }
];
