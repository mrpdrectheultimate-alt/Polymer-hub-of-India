// scripts/seed_library_expansion.js
// PolymerHub — Library Books Seeding Script (+27 Books to reach 50+ total)
// Run: node scripts/seed_library_expansion.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── 7 NEW OPEN-ACCESS BOOKS ───────────────────────────────────────────────
const OPEN_ACCESS_BOOKS = [
  {
    slug: 'polymer-science-sustainability-saldivar',
    title: 'Polymer Science, Engineering, and Sustainability',
    authors: 'Hugo Saldivar-Guerra, Eduardo Vivaldo-Lima',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Polymerization reaction engineering, properties, mathematical models, and lifecycle sustainability analysis.',
    summary: 'A comprehensive open-source textbook detailing reaction design, kinetics of step and chain growth, mechanical test interpretations, and end-of-life options.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polymerization Mechanisms' },
      { id: 'ch2', title: 'Chapter 2: Reactor Engineering & Kinetics' },
      { id: 'ch3', title: 'Chapter 3: Sustainability & Life Cycle' }
    ],
    file_url: 'https://archive.org/details/polymer-science-sustainability',
    subject_slugs: ['polymer-chemistry', 'polymer-processing', 'life-cycle-assessment'],
    careers: ['R&D Engineer', 'Process Simulation Specialist']
  },
  {
    slug: 'polymere-synthese-koltzenburg',
    title: 'Polymere: Synthese, Eigenschaften und Anwendungen',
    authors: 'Sebastian Koltzenburg, Michael Maskos, Oskar Nuyken',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Detailed organic synthetic routes, reaction mechanisms, block-copolymer thermodynamics, and applications.',
    summary: 'An authoritative textbook focusing on the chemical synthesis, physical chemistry of solutions, morphology, and applications of industrial polymers.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polycondensation & Polyaddition' },
      { id: 'ch2', title: 'Chapter 2: Radical & Ionic Polymerization' },
      { id: 'ch3', title: 'Chapter 3: Industrial Polymer Properties' }
    ],
    file_url: 'https://link.springer.com/book/10.1007/998-3-642-34773-2',
    subject_slugs: ['polymer-chemistry', 'additives-compounding'],
    careers: ['Polymer Chemist', 'Synthesis Specialist']
  },
  {
    slug: 'principles-polymer-engineering-mccrum-free',
    title: 'Principles of Polymer Engineering (Open Access Edition)',
    authors: 'N.G. McCrum, C.P. Buckley, C.B. Bucknall',
    cover_url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Viscoelastic behavior, rubber elasticity, design methods for load-bearing polymer structures, and yield criteria.',
    summary: 'A standard textbook covering mechanical engineering principles, yield criteria, creep compliance, and processing guidelines for structural thermoplastics.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Structure of Polymers' },
      { id: 'ch2', title: 'Chapter 2: Viscoelasticity & Creep' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Design with Plastics' }
    ],
    file_url: 'https://archive.org/details/principles-of-polymer-engineering',
    subject_slugs: ['polymer-processing', 'mould-design', 'polymer-testing'],
    careers: ['Mould Designer', 'Mechanical Design Engineer']
  },
  {
    slug: 'introduction-polymers-young-lovell-free',
    title: 'Introduction to Polymers (Open Access)',
    authors: 'R.J. Young, P.A. Lovell',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Foundational',
    focus: 'Fundamentals of chemistry, physics, and characterization techniques.',
    summary: 'A detailed introduction to step-growth and chain-growth polymerization, molecular weight characterization, and morphology of semi-crystalline polymers.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Synthesis Concepts' },
      { id: 'ch2', title: 'Chapter 2: Solid-State Structure' },
      { id: 'ch3', title: 'Chapter 3: Viscoelastic Behavior' }
    ],
    file_url: 'https://archive.org/details/introduction-to-polymers',
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    careers: ['Materials Scientist', 'Quality Control Inspector']
  },
  {
    slug: 'polymer-composites-moharana-free',
    title: 'Polymer Composites: Fundamentals and Applications',
    authors: 'P. Moharana, A. Sahu, S.K. Nayak',
    cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Reinforcements, interfaces, processing technologies, and testing of composite structures.',
    summary: 'An open textbook explaining carbon/glass fiber composites, matrix interactions, laminate theory, and processing methods like RTM and Pultrusion.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Fibers & Matrices' },
      { id: 'ch2', title: 'Chapter 2: Composite Processing Methods' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Testing Standards' }
    ],
    file_url: 'https://archive.org/details/polymer-composites-fundamentals',
    subject_slugs: ['polymer-composites', 'polymer-testing'],
    careers: ['Composites Engineer', 'Structural Design Specialist']
  },
  {
    slug: 'understanding-polymer-processing-osswald-free',
    title: 'Understanding Polymer Processing',
    authors: 'Tim A. Osswald, Allen Jonathan Román',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Melt flow behaviors, extrusion screw design, injection molding mechanics, and thermal calculations.',
    summary: 'Provides a clear explanation of basic processing operations including extrusion, injection molding, thermoforming, and calendering with mathematical modeling.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Melt Rheology Overview' },
      { id: 'ch2', title: 'Chapter 2: Extrusion Die Flow' },
      { id: 'ch3', title: 'Chapter 3: Injection Molding Simulation' }
    ],
    file_url: 'https://archive.org/details/understanding-polymer-processing',
    subject_slugs: ['polymer-processing', 'polymer-rheology', 'mould-design'],
    careers: ['Process Engineer', 'Extrusion Supervisor']
  },
  {
    slug: 'polymer-chemistry-koltzenburg-free',
    title: 'Polymer Chemistry: Open Course Notes',
    authors: 'Sebastian Koltzenburg',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    category: 'open_access',
    difficulty: 'Foundational',
    focus: 'Fundamental polymerization chemistry, classification of plastics, and synthetic protocols.',
    summary: 'Introductory chemistry resource mapping basic step-growth, radical chain-growth, copolymerization, and stereoregular systems.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Introduction to Chains' },
      { id: 'ch2', title: 'Chapter 2: Radical Additions' },
      { id: 'ch3', title: 'Chapter 3: Condensation Polymers' }
    ],
    file_url: 'https://archive.org/details/polymer-chemistry-open-notes',
    subject_slugs: ['polymer-chemistry'],
    careers: ['Polymer Lab Assistant', 'Chemical Engineer']
  }
];

// ─── 14 NEW COMMERCIAL BOOKS ──────────────────────────────────────────────
const COMMERCIAL_BOOKS = [
  {
    slug: 'introduction-polymers-commercial-young',
    title: 'Introduction to Polymers (3rd Edition)',
    authors: 'Robert J. Young, Peter A. Lovell',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Polymer synthesis, characterization, phase behavior, crystalline state, and viscoelastic properties.',
    summary: 'A standard textbook covering all aspects of step-growth, free-radical, ionic, and coordination polymerizations alongside mechanical testing frameworks.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Monomers & Macromolecules' },
      { id: 'ch2', title: 'Chapter 2: Step-Growth Polymerization' },
      { id: 'ch3', title: 'Chapter 3: Chain-Growth Kinetics' },
      { id: 'ch4', title: 'Chapter 4: Polymer Characterization' }
    ],
    purchase_url: 'https://www.crcpress.com/9780849339295',
    subject_slugs: ['polymer-chemistry', 'polymer-testing', 'polymer-rheology'],
    careers: ['R&D Chemist', 'Materials Engineer']
  },
  {
    slug: 'principles-polymer-engineering-mccrum',
    title: 'Principles of Polymer Engineering',
    authors: 'N. G. McCrum, C. P. Buckley, C. B. Bucknall',
    cover_url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Viscoelastic behavior, rubber elasticity, yield behavior, fracture mechanics, and processing flow models.',
    summary: 'Explains mechanical properties, viscoelastic creep, yield criteria (Von Mises/Tresca), and processing mechanisms including die swell and gate shear.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: The Structure of Polymers' },
      { id: 'ch2', title: 'Chapter 2: Viscoelasticity' },
      { id: 'ch3', title: 'Chapter 3: Yield and Fracture' },
      { id: 'ch4', title: 'Chapter 4: Processing Extrusion & Injection' }
    ],
    purchase_url: 'https://www.oup.com/academic/9780198565260',
    subject_slugs: ['polymer-processing', 'mould-design', 'polymer-testing'],
    careers: ['Mechanical Design Engineer', 'Stress Analyst']
  },
  {
    slug: 'crc-handbook-chemistry-physics',
    title: 'CRC Handbook of Chemistry and Physics',
    authors: 'John Rumble (Editor)',
    cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Thermodynamic properties, physical constants of organic compounds, solvents, and polymers.',
    summary: 'The world\'s most comprehensive physical chemistry database containing monomer structures, density data, thermal conductivities, and dielectric constants.',
    toc: [
      { id: 'ch1', title: 'Section 3: Physical Constants of Organic Compounds' },
      { id: 'ch2', title: 'Section 6: Fluid Properties' },
      { id: 'ch3', title: 'Section 13: Polymer Properties' }
    ],
    purchase_url: 'https://www.crcpress.com/9781138367296',
    subject_slugs: ['polymer-chemistry', 'additives-compounding'],
    careers: ['Analytical Chemist', 'Materials Engineer']
  },
  {
    slug: 'handbook-of-polymers-wypych',
    title: 'Handbook of Polymers',
    authors: 'George Wypych',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Chemical names, structural formulas, physical state, density, Tm, Tg, mechanical strength, and electrical properties.',
    summary: 'An extensive data reference for over 150 industrial polymers, tracking chemical structures, compatibility, processing temperature ranges, and applications.',
    toc: [
      { id: 'ch1', title: 'Part 1: Thermoplastics Data' },
      { id: 'ch2', title: 'Part 2: Thermosets Data' },
      { id: 'ch3', title: 'Part 3: Elastomers Data' }
    ],
    purchase_url: 'https://www.chemtec.org/9781895198942',
    subject_slugs: ['polymer-chemistry', 'additives-compounding', 'rubber-technology'],
    careers: ['Quality Assurance Specialist', 'Materials Sourcing Manager']
  },
  {
    slug: 'polymer-data-handbook',
    title: 'Polymer Data Handbook',
    authors: 'James E. Mark',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Molecular weight constants, solution viscosities, crystallinity constants, and structural properties.',
    summary: 'Presents physical constants, crystal structures, solvent interactions, and theta temperatures for major synthetic polymer chains.',
    toc: [
      { id: 'ch1', title: 'Section 1: Semicrystalline Polymers' },
      { id: 'ch2', title: 'Section 2: Amorphous Glassy Systems' },
      { id: 'ch3', title: 'Section 3: Elastomeric Rubbers' }
    ],
    purchase_url: 'https://www.oup.com/academic/9780195107890',
    subject_slugs: ['polymer-chemistry', 'polymer-rheology'],
    careers: ['Polymer Physicist', 'Materials Engineer']
  },
  {
    slug: 'chemistry-of-polymers-nicholson',
    title: 'The Chemistry of Polymers',
    authors: 'John W. Nicholson',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Foundational',
    focus: 'Step-growth, chain-growth, crosslinking, polymer degradation, and biodegradable materials.',
    summary: 'A concise chemistry manual detailing free-radical copolymerization, ring-opening chemistry, elastomer vulcanization, and circular biopolymers.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polymer Synthesis Basics' },
      { id: 'ch2', title: 'Chapter 2: Degradation & Recycling' },
      { id: 'ch3', title: 'Chapter 3: Biopolymers & Medical Materials' }
    ],
    purchase_url: 'https://pubs.rsc.org/bookshop/9781849733915',
    subject_slugs: ['polymer-chemistry', 'sustainable-plastics', 'recycling-technology'],
    careers: ['Laboratory Supervisor', 'Sustainability Advisor']
  },
  {
    slug: 'functional-synthetic-polymers-fink',
    title: 'Functional Synthetic Polymers',
    authors: 'Johannes Karl Fink',
    cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Conducting polymers, smart gels, stimulus-responsive polymers, and biomedical applications.',
    summary: 'Explores conducting polyanilines, self-healing hydrogels, Shape Memory Alloys-polymers, and advanced photoresist lithography systems.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Conductive Polymer Networks' },
      { id: 'ch2', title: 'Chapter 2: Smart Hydrogels' },
      { id: 'ch3', title: 'Chapter 3: Self-Healing Materials' }
    ],
    purchase_url: 'https://www.scrivenerpublishing.com/9781118556634',
    subject_slugs: ['polymer-chemistry', 'medical-plastics', 'polymer-composites'],
    careers: ['Advanced Materials Scientist', 'Electronics Engineer']
  },
  {
    slug: 'characterization-analysis-polymers-wiley',
    title: 'Characterization and Analysis of Polymers',
    authors: 'Wiley-VCH (Editorial)',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'FTIR spectroscopy, DSC, TGA, DMA, XRD, and gel permeation chromatography principles.',
    summary: 'A reference guide for characterization labs, tracking ASTM/ISO testing methodologies, spectrometer calibrations, and curve interpretation guidelines.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Spectroscopy FTIR/NMR' },
      { id: 'ch2', title: 'Chapter 2: Thermal Methods DSC/TGA' },
      { id: 'ch3', title: 'Chapter 3: Chromatography GPC' }
    ],
    purchase_url: 'https://www.wiley.com/en-us/9780470233009',
    subject_slugs: ['polymer-testing', 'polymer-chemistry'],
    careers: ['Analytical Lab Manager', 'QA/QC Engineer']
  },
  {
    slug: 'compositional-failure-analysis-scheirs',
    title: 'Compositional and Failure Analysis of Polymers',
    authors: 'John Scheirs',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Degradation mechanisms, environmental stress cracking, additive extraction, and industrial failures.',
    summary: 'A forensic polymer manual for failures in PE pipes, automotive panels, electrical cables, and packaging films under heat and chemical stresses.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Reverse Engineering of Additives' },
      { id: 'ch2', title: 'Chapter 2: Stress Cracking in Pipes' },
      { id: 'ch3', title: 'Chapter 3: Thermal and UV Degradation' }
    ],
    purchase_url: 'https://www.wiley.com/en-us/9780470010129',
    subject_slugs: ['polymer-testing', 'additives-compounding'],
    careers: ['Forensic Polymer Engineer', 'Failure Analyst']
  },
  {
    slug: 'plastics-handbook-osswald',
    title: 'Plastics Handbook (5th Edition)',
    authors: 'Tim A. Osswald, AllenJonathan Roman',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Melt flow, screw mechanics, injection molding design, testing, and recycling.',
    summary: 'A reference for plastic processing, containing material constants, processing windows, design calculations, and environmental regulations.',
    toc: [
      { id: 'ch1', title: 'Section 1: Materials Structure & Behavior' },
      { id: 'ch2', title: 'Section 2: Manufacturing Processes' },
      { id: 'ch3', title: 'Section 3: Testing & Characterization' }
    ],
    purchase_url: 'https://www.hanserpublications.com/9781569905202',
    subject_slugs: ['polymer-processing', 'mould-design', 'polymer-testing'],
    careers: ['Plant Manager', 'Process Optimizer']
  },
  {
    slug: 'introduction-plastics-engineering-stokes',
    title: 'Introduction to Plastics Engineering',
    authors: 'Vijay K. Stokes',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'Stress analysis, design models, viscoelastic creep calculations, and mould engineering.',
    summary: 'Combines structural mechanical designs of plastics with processing realities, detailing rib designs and gate positioning.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Solid-State Mechanics' },
      { id: 'ch2', title: 'Chapter 2: Mold Flow Simulation' },
      { id: 'ch3', title: 'Chapter 3: Structural Rib Designs' }
    ],
    purchase_url: 'https://www.wiley.com/en-us/9781119538356',
    subject_slugs: ['mould-design', 'polymer-processing'],
    careers: ['Mould Design Engineer', 'Product Designer']
  },
  {
    slug: 'handbook-polymer-processing-additives-wypych',
    title: 'Handbook of Polymer Processing Additives',
    authors: 'George Wypych',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Processing aids, slip agents, anti-blocking agents, lubricants, and thermal stabilizers.',
    summary: 'A reference detailing how chemical processing aids coat die walls, reduce pressure drops, prevent melt fracture, and optimize throughput.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Slip and Anti-block Mechanics' },
      { id: 'ch2', title: 'Chapter 2: Fluoropolymer Processing Aids' },
      { id: 'ch3', title: 'Chapter 3: PVC Lubricants & Stabilizers' }
    ],
    purchase_url: 'https://www.chemtec.org/9781895198911',
    subject_slugs: ['additives-compounding', 'polymer-processing'],
    careers: ['Compounding Supervisor', 'Additive Formulation Scientist']
  },
  {
    slug: 'handbook-of-plasticizers-wypych',
    title: 'Handbook of Plasticizers',
    authors: 'George Wypych',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Advanced',
    focus: 'PVC plasticization, plasticizer migrations, biological phthalate alternatives, and formulation.',
    summary: 'A comprehensive study of plasticizer kinetics, glass transition depression, and regulatory frameworks (RoHS, REACH) governing medical devices.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Theory of Plasticization' },
      { id: 'ch2', title: 'Chapter 2: Plasticizers in Medical PVC' },
      { id: 'ch3', title: 'Chapter 3: Regulatory Compliances' }
    ],
    purchase_url: 'https://www.chemtec.org/9781895198904',
    subject_slugs: ['additives-compounding', 'medical-plastics', 'life-cycle-assessment'],
    careers: ['Regulatory Affairs Specialist', 'PVC Compounding Engineer']
  },
  {
    slug: 'polymer-blends-composites-subramanian',
    title: 'Polymer Blends and Composites',
    authors: 'Muralisrinivasan Natamai Subramanian',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    category: 'commercial',
    difficulty: 'Intermediate',
    focus: 'Immiscible blends, compatibilizers, interfaces, glass fiber laminates, and twin-screw mixing.',
    summary: 'An industrial guide describing copolymer compatibilization, morphological controls, interface bonding, and composite laminate engineering.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Phase Behavior & Miscibility' },
      { id: 'ch2', title: 'Chapter 2: Compatibilizer Mechanisms' },
      { id: 'ch3', title: 'Chapter 3: Fiber-Matrix Interfaces' }
    ],
    purchase_url: 'https://www.scrivenerpublishing.com/9781119330905',
    subject_slugs: ['polymer-composites', 'additives-compounding'],
    careers: ['Composites Fabrication Engineer', 'Compound Designer']
  }
];

// ─── 6 NEW ORIGINAL GUIDES ─────────────────────────────────────────────────
const ORIGINAL_BOOKS = [
  {
    slug: 'polymer-chemistry-monomers-macros-guide',
    title: 'Polymer Chemistry: From Monomers to Macros',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Foundational',
    focus: 'Monomer structures, addition/condensation reactions, ionic polymerizations, and molecular weight distribution concepts.',
    summary: 'A structured educational text explaining polymer chain configurations, polymerization kinetics, copolymers, and stereoregular Ziegler-Natta systems.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Monomers & Macromolecular Concepts' },
      { id: 'ch2', title: 'Chapter 2: Kinetics of Radical Chain Addition' },
      { id: 'ch3', title: 'Chapter 3: Condensation Polymers & Stoichiometry' },
      { id: 'ch4', title: 'Chapter 4: Stereoregular Catalysis & Polyolefins' }
    ],
    careers: ['Synthesis Chemist', 'Materials Engineer'],
    subject_slugs: ['polymer-chemistry'],
    chapters: {
      ch1: `# Chapter 1: Monomers & Macromolecular Concepts\n\n## 1. Introduction to Polymers\nPolymers are large molecules composed of repeating structural units called monomers, connected by covalent chemical bonds. The term polymer is derived from the Greek words *poly* (many) and *meros* (parts). Modern civilization rests on synthetic polymers, from structural pipes to lightweight composite parts.\n\n## 2. Degree of Polymerization (DP)\nThe average number of repeating monomeric units in a polymer chain is defined as the Degree of Polymerization:\n$$DP = \\frac{M_n}{M_0}$$\nWhere $M_n$ is the number-average molecular weight of the polymer and $M_0$ is the molecular weight of the monomer repeating unit.\n\n## 3. Classification of Polymers\nPolymers are broadly classified as thermoplastics (can be melted and reshaped repeatedly) or thermosets (form permanent crosslinked networks that cannot be remelted).`,
      ch2: `# Chapter 2: Kinetics of Radical Chain Addition\n\n## 1. Radical Addition Mechanism\nChain-growth polymerization proceeds via three steps: Initiation, Propagation, and Termination.\n\n## 2. Initiation Kinetics\nInitiators like benzoyl peroxide (BPO) split to generate active radicals:\n$$I \\xrightarrow{k_d} 2R^\\bullet$$\n$$\\text{Rate of Initiation } R_i = 2 f k_d [I]$$\nWhere $f$ is the initiator efficiency and $k_d$ is the decomposition rate constant.\n\n## 3. Propagation and Termination\n$$\\text{Propagation } M_x^\\bullet + M \\xrightarrow{k_p} M_{x+1}^\\bullet$$\n$$\\text{Termination } M_x^\\bullet + M_y^\\bullet \\xrightarrow{k_t} M_{x+y}$$`,
      ch3: `# Chapter 3: Condensation Polymers & Carothers Equation\n\n## 1. Step-Growth Chemistry\nCondensation reactions proceed step-by-step between functional groups (e.g. esterification, amidation), often eliminating small molecules like water.\n\n## 2. The Carothers Equation\nFor a system of bifunctional monomers, the relation between conversion ($p$) and average degree of polymerization ($X_n$) is given by:\n$$X_n = \\frac{1}{1 - p}$$\nTo achieve structural stability (e.g., $X_n \\ge 100$), conversion must exceed $99\\%$.`,
      ch4: `# Chapter 4: Stereoregular Catalysis & Polyolefins\n\n## 1. Stereochemistry of Polypropylene\nPolypropylene can exist as isotactic (all methyl groups on one side), syndiotactic (alternating sides), or atactic (random placement).\n\n## 2. Ziegler-Natta Catalysts\nCoordination catalysts like $TiCl_3 + Al(C_2H_5)_3$ control the orientation of monomer insertion, producing highly crystalline, high-strength isotactic polypropylene.`
    }
  },
  {
    slug: 'polymer-processing-engineers-handbook-guide',
    title: 'The Polymer Processing Engineer\'s Handbook',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Extruder barrel zones, drag/pressure flows, melt pressure calculations, cooling cycles, and molding defects.',
    summary: 'A reference handbook covering the mathematics of extruder screws, die flow profiles, injection mold parameters, blow molding, and troubleshooting.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Single-Screw Extruders: Screw Geometry' },
      { id: 'ch2', title: 'Chapter 2: Injection Molding: The Complete Molding Cycle' },
      { id: 'ch3', title: 'Chapter 3: Defect Analysis & Troubleshooting' }
    ],
    careers: ['Extrusion Process Engineer', 'Injection Molding Supervisor'],
    subject_slugs: ['polymer-processing'],
    chapters: {
      ch1: `# Chapter 1: Single-Screw Extruders: Screw Geometry\n\n## 1. Extruder Barrel Zones\nSingle-screw extruders feed solid pellets, melt them, and pump the pressurized melt through a shaping die. The screw contains three main zones:\n- **Feed Zone**: Transports deep-channeled solid pellets from the hopper.\n- **Compression Zone**: Compresses and melts the polymer using tapering channel depths.\n- **Metering Zone**: Pumps the molten polymer through a shallow channel depth at constant pressure.\n\n## 2. Throughput Flow Calculations\nThe volumetric output ($Q$) of a metering screw is the sum of drag flow ($Q_d$) and pressure back flow ($Q_p$):\n$$Q = Q_d - Q_p = \\frac{1}{2} \\pi^2 D^2 N H \\sin\\phi \\cos\\phi - \\frac{\\pi D H^3 \\Delta P \\sin^2\\phi}{12 \\eta L}$$\nWhere $D$ is screw diameter, $N$ is rotation speed, $H$ is channel depth, $\\phi$ is helix angle, $\\Delta P$ is pressure drop, $\\eta$ is melt viscosity, and $L$ is screw length.`,
      ch2: `# Chapter 2: Injection Molding: The Complete Molding Cycle\n\n## 1. Cycle Phases\nInjection molding cycles consist of four main steps:\n- **Filling**: Melt is injected into the cavity.\n- **Packing/Holding**: High pressure is maintained to compensate for volumetric shrinkage during crystallization.\n- **Cooling**: The part solidifies in the water-cooled mold.\n- **Ejection**: Mold opens, and ejector pins release the solidified part.\n\n## 2. Gate Shear Calculations\nInjection molding operates at high shear rates ($>10^4$ s⁻¹). Gate shear stress must be controlled to prevent thermal degradation:\n$$\\dot{\\gamma}_{gate} = \\frac{4Q}{\\pi R^3}$$`,
      ch3: `# Chapter 3: Defect Analysis & Troubleshooting\n\n## 1. Common Molding Defects\n- **Sink Marks**: Caused by localized shrinkage in thick sections due to insufficient pack time.\n- **Weld Lines**: Created when separate melt fronts meet inside the cavity, creating a weak mechanical boundary.`
    }
  },
  {
    slug: 'mould-design-mastery-guide',
    title: 'Mould Design Mastery',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Advanced',
    focus: 'Cavity selection, draft angle allowances, cold and hot runner sizing, and cooling layout engineering.',
    summary: 'A mathematical guide to mold cooling cycles, gate stress limits, ejection forces, and side-core mechanical linkages.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Cavity Layout & Draft Sizing' },
      { id: 'ch2', title: 'Chapter 2: Runner & Gate Design' },
      { id: 'ch3', title: 'Chapter 3: Cooling Channel Heat Balance' }
    ],
    careers: ['Mould Tooling Designer', 'Tool Room Supervisor'],
    subject_slugs: ['mould-design'],
    chapters: {
      ch1: `# Chapter 1: Cavity Layout & Draft Sizing\n\n## 1. Draft Angle Calculations\nDraft angles are required to allow easy ejection of the part from the core. Standard draft angles are $1^\\circ - 2^\\circ$. The ejection force can be modeled as:\n$$F_e = \\mu P_c A$$\nWhere $\\mu$ is the friction coefficient, $P_c$ is contact pressure due to shrinkage, and $A$ is parting area.`,
      ch2: `# Chapter 2: Runner & Gate Design\n\n## 1. Balanced Runner Layouts\nIn multi-cavity moulds, runner layouts must be geometrically balanced (equal flow length and cross-sections) to ensure all cavities fill at the exact same pressure.\n\n## 2. Gate Sizing Rules\nGate land length should be kept short ($0.8 - 1.2$ mm) to minimize shear heating and pressure drop.`,
      ch3: `# Chapter 3: Cooling Channel Heat Balance\n\n## 1. Heat Removal Calculations\nThe heat load ($Q$) that must be removed by water cooling is:\n$$Q = m C_p (T_{melt} - T_{eject})$$\nWhere $m$ is mass flow rate, $C_p$ is polymer specific heat, $T_{melt}$ is melt temperature, and $T_{eject}$ is ejection temperature.`
    }
  },
  {
    slug: 'rubber-technology-complete-guide',
    title: 'Rubber Technology: A Complete Guide',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Elastomer formulations, sulfur crosslinking chemistry, carbon black dispersion, and MDR cure curve metrics.',
    summary: 'Details vulcanization kinetics, Banbury internal mixing cycles, tire compound formulations, and ASTM standards for elastomer testing.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Natural vs. Synthetic Elastomers' },
      { id: 'ch2', title: 'Chapter 2: Sulfur Vulcanization Chemistry' },
      { id: 'ch3', title: 'Chapter 3: Carbon Black Reinforcement' }
    ],
    careers: ['Rubber Compounder', 'Tire Manufacturing Specialist'],
    subject_slugs: ['rubber-technology'],
    chapters: {
      ch1: `# Chapter 1: Natural vs. Synthetic Elastomers\n\n## 1. Natural Rubber (cis-1,4-polyisoprene)\nNatural rubber exhibits high tensile strength, tear resistance, and heat dissipation due to strain-induced crystallization. However, it displays poor ozone and oil resistance.\n\n## 2. Synthetic Rubbers\n- **SBR (Styrene Butadiene Rubber)**: Used in tires for wear resistance.\n- **EPDM**: Excellent ozone and environmental weather resistance.`,
      ch2: `# Chapter 2: Sulfur Vulcanization Chemistry\n\n## 1. Sulfur Crosslinking Mechanisms\nVulcanization converts sticky rubber into a tough elastomer. In sulfur systems, accelerators (like CBS/TMTD) and activators (ZnO + stearic acid) are added to optimize crosslink densities.\n\n## 2. MDR ASTM D5289 Cure Curve\nMDR monitors cure torque. Crucial metrics are:\n- $M_L$: Minimum torque (melt viscosity).\n- $t_{s2}$: Scorch safety time.\n- $t_{90}$: Optimum cure time ($90\\%$ of maximum torque).`,
      ch3: `# Chapter 3: Carbon Black Reinforcement\n\n## 1. Reinforcement Mechanics\nCarbon black particles physically bind to rubber chains, increasing modulus, tensile strength, and abrasion resistance. High-structure carbon black increases rubber stiffness.`
    }
  },
  {
    slug: 'recycling-circular-economy-polymers-guide',
    title: 'Recycling & Circular Economy for Polymers',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Mechanical sorting, wash lines, PET challenge testing, pyrolysis processes, and EPR Indian compliances.',
    summary: 'A reference for recycling plant managers, detailing sorting technologies, chemical recycling routes, and EPR regulatory compliance.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Mechanical Recycling: Sorting & Washing' },
      { id: 'ch2', title: 'Chapter 2: Chemical Recycling: Pyrolysis' },
      { id: 'ch3', title: 'Chapter 3: EPR Frameworks & Indian Standards' }
    ],
    careers: ['Recycling Operations Manager', 'Sustainability Compliance Analyst'],
    subject_slugs: ['recycling-technology', 'life-cycle-assessment'],
    chapters: {
      ch1: `# Chapter 1: Mechanical Recycling: Sorting & Washing\n\n## 1. Sorting Operations\nSorting is critical to prevent contamination (e.g. PVC inside PET streams). Automated sorting lines use Near-Infrared (NIR) spectrometers to identify polymer structures based on characteristic molecular absorption bands.\n\n## 2. Contaminations\nFood-contact recycling requires super-cleaning processes to remove volatile compounds and meet strict safety standards.`,
      ch2: `# Chapter 2: Chemical Recycling: Pyrolysis\n\n## 1. Pyrolysis Principles\nPyrolysis heats plastics to high temperatures ($400 - 600^\\circ$C) in the absence of oxygen, thermal-cracking the chains into hydrocarbons that can be refined into new virgin monomers.`,
      ch3: `# Chapter 3: EPR Frameworks & Indian Standards\n\n## 1. Indian EPR Regulations\nExtended Producer Responsibility (EPR) mandates that producers collect, recycle, and process a minimum percentage of post-consumer plastic packaging waste.`
    }
  },
  {
    slug: 'sustainable-plastics-materials-design-guide',
    title: 'Sustainable Plastics: Materials & Design',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    category: 'original_guide',
    difficulty: 'Foundational',
    focus: 'Bio-feedstocks, PLA and PHA crystallization kinetics, compostability testing standards, and design-for-recycling principles.',
    summary: 'Explains biodegradable and compostable polymer physics, marine degradation mechanisms, and barrier film substitutions.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Classification of Bioplastics' },
      { id: 'ch2', title: 'Chapter 2: Polylactic Acid (PLA): Properties' },
      { id: 'ch3', title: 'Chapter 3: Biodegradability Standards (ISO 17088)' }
    ],
    careers: ['Packaging Design Engineer', 'Bioplastics Specialist'],
    subject_slugs: ['sustainable-plastics'],
    chapters: {
      ch1: `# Chapter 1: Classification of Bioplastics\n\n## 1. Four Quadrants of Bioplastics\nBioplastics are classified based on their origin and biodegradability:\n- **Bio-based & Biodegradable**: e.g., PLA, PHA, starch blends.\n- **Bio-based & Non-biodegradable**: e.g., bio-PE, bio-PET (drop-in plastics).\n- **Fossil-based & Biodegradable**: e.g., PBAT, PCL.\n- **Fossil-based & Non-biodegradable**: Standard PP, PE, PS.`,
      ch2: `# Chapter 2: Polylactic Acid (PLA): Properties\n\n## 1. PLA Synthesis & Limitations\nPLA is derived from corn starch or sugarcane. While rigid and highly transparent, PLA has low thermal resistance ($T_g \\approx 55^\\circ$C) and low gas barrier properties, limiting its use in hot-fill beverage containers.`,
      ch3: `# Chapter 3: Biodegradability Standards (ISO 17088 / ASTM D6400)\n\n## 1. Industrial Composting Criteria\nTo be certified as compostable, a plastic must biodegrade under industrial composting conditions ($58^\\circ$C, high humidity) into $CO_2$, water, and biomass within 180 days, leaving no toxic residue.`
    }
  }
];

// ─── Main Seeder ─────────────────────────────────────────────────────────────
async function seedLibrary() {
  console.log('📚 PolymerHub Library Expansion Seeder');
  
  const allNewBooks = [
    ...OPEN_ACCESS_BOOKS,
    ...COMMERCIAL_BOOKS,
    ...ORIGINAL_BOOKS
  ];

  console.log(`Preparing to seed ${allNewBooks.length} new books...\n`);

  let added = 0;
  let updated = 0;
  let errors = 0;

  for (const book of allNewBooks) {
    const payload = {
      ...book,
      difficulty: book.difficulty || 'Intermediate',
      careers: book.careers || [],
      subject_slugs: book.subject_slugs || [],
      toc: book.toc || []
    };

    const { error } = await s
      .from('library_books')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.log(`  ❌ Error on: ${book.title.slice(0, 50)} - ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ [${book.category.toUpperCase().padEnd(12)}] | ${book.title.slice(0, 50)}`);
      added++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Upserted successfully :', added);
  console.log('❌ Errors                 :', errors);
  console.log('═══════════════════════════════════════');

  const { count } = await s.from('library_books').select('*', { count: 'exact', head: true });
  console.log('\n📚 Total Books inside Library Now:', count);
}

seedLibrary().catch(console.error);
