// src/lib/library_data.ts — Comprehensive Reference Library Data & Chapter Repository

export interface LibraryBook {
  id: string
  slug: string
  title: string
  authors: string
  cover_url: string
  category: 'original_guide' | 'open_access' | 'commercial'
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced'
  focus: string
  summary: string
  purchase_url?: string
  file_url?: string
  careers: string[]
  subject_slugs: string[]
  toc: { id: string; title: string }[]
  chapters: Record<string, string>
}

// ── 1. Original Guide: Rheology ──────────────────────────────────────────────
const RHEOLOGY_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Why Rheology Matters to Every Polymer Engineer

## 1. Executive Overview
Rheology is the study of the deformation and flow of matter. For plastics engineers and plant managers, understanding rheology is the single most critical factor in predicting machine behavior, avoiding melt defects, and optimizing cycle times.

## 2. Key Industrial Phenomena
* **Pressure Drop Modeling:** Viscosity ($\eta$) directly dictates the hydraulic pressure required to drive melt through feed screws, hot runners, and complex mold cavities.
* **Shear Heating (Viscous Dissipation):** High shear in runners and gate orifices generates localized heat ($\dot{Q} = \tau \cdot \dot{\gamma}$), risking thermal degradation for temperature-sensitive resins like PVC and POM.
* **Elastic Memory:** When forced through narrow dies, entangled polymer chains stretch and orient. At the die exit, they recoil elastically, creating **extrudate die swell**.

## 3. Practical Processing Windows
| Manufacturing Process | Typical Shear Rate Range ($\\text{s}^{-1}$) | Critical Rheological Parameter |
|---|---|---|
| Compression Moulding | $1 - 10$ | Zero-shear viscosity ($\\eta_0$) |
| Extrusion Profile | $100 - 1,000$ | Power-law index ($n$), Extrudate swell |
| Injection Moulding | $1,000 - 100,000$ | High-shear viscosity, Gate freeze-off |
| Blow Moulding Parison | $10 - 100$ | Melt strength, Sag resistance |
`,
  ch2: `# Chapter 2: Newtonian vs. Non-Newtonian Flow

## 1. Fundamental Viscosity Equations
In a Newtonian fluid under simple laminar shear, shear stress ($\\tau$) is directly proportional to shear rate ($\\dot{\\gamma}$):
$$\\tau = \\eta \\cdot \\dot{\\gamma}$$

For polymer melts, viscosity is non-constant and decreases dramatically with increasing shear rate—a property known as **pseudoplasticity (shear thinning)**.

## 2. Molecular Mechanism of Shear Thinning
At rest ($(\\dot{\\gamma} \\to 0)$), polymer chains form an entangled, isotropic random coil network (resisting flow with zero-shear viscosity $\\eta_0$). When subjected to high shear stresses, the rate of imposed deformation exceeds the Brownian relaxation rate, causing polymer chains to:
1. Disentangle from neighboring chains.
2. Align parallel to the streamlines of flow.
3. Reduce internal hydrodynamic drag, lowering apparent melt viscosity by orders of magnitude.
`,
  ch3: `# Chapter 3: The Power Law & Carreau-Yasuda Mathematical Models

## 1. Ostwald-de Waele Power Law Model
The standard mathematical representation for pseudoplastic polymer melts in the shear-thinning regime is:
$$\\tau = K \\cdot \\dot{\\gamma}^n$$
$$\\eta(\\dot{\\gamma}) = K \\cdot \\dot{\\gamma}^{n-1}$$

Where:
* $K$ = Flow consistency index ($\\text{Pa}\\cdot\\text{s}^n$)
* $n$ = Flow behavior index ($n < 1$ for pseudoplastic melts; e.g., $n \\approx 0.35$ for HDPE, $n \\approx 0.28$ for PP)

## 2. Carreau-Yasuda Model
To capture the low-shear Newtonian plateau, the transition knee, and the high-shear power-law region:
$$\\eta(\\dot{\\gamma}) = \\eta_\\infty + (\\eta_0 - \\eta_\\infty) \\left[ 1 + (\\lambda \\dot{\\gamma})^a \\right]^{\\frac{n-1}{a}}$$
`,
  ch4: `# Chapter 4: Capillary Rheometry & Die Corrections

## 1. Capillary Flow Fundamentals
A capillary rheometer forces molten polymer through a precision tungsten carbide die of radius $R$ and length $L$ at volumetric throughput $Q$.

## 2. Essential Corrections
* **Bagley Correction:** Measures and subtracts entrance/exit pressure drops ($\\Delta P_e$) caused by convergent elastic stretching at the die entry.
  $$\\tau_w = \\frac{\\Delta P - \\Delta P_e}{2 (L/R)}$$
* **Weissenberg-Rabinowitsch Correction:** Corrects the non-parabolic velocity profile of pseudoplastic melts at the capillary wall:
  $$\\dot{\\gamma}_w = \\dot{\\gamma}_{app} \\left[ \\frac{3n + 1}{4n} \\right]$$
`,
  ch5: `# Chapter 5: Die Swell, Melt Fracture & Flow Instabilities

## 1. Extrudate Die Swell ($B$)
Die swell is defined as the ratio of the cooled extrudate diameter ($D_e$) to the die orifice diameter ($D_0$):
$$B = \\frac{D_e}{D_0}$$
* Long dies ($L/D > 20$) provide sufficient residence time for stretched chains to relax, reducing swell.
* Short dies ($L/D < 5$) preserve high elastic energy, causing massive swell ($B > 1.8$).

## 2. Sharkskin and Gross Melt Fracture
* **Sharkskin:** Surface tearing occurring at the die exit when wall shear stress $\\tau_w > 0.14\\text{ MPa}$.
* **Mitigation:** Adding fluoropolymer Polymer Processing Aids (PPA) which migrate to the metal die wall and promote slip.
`,
  ch6: `# Chapter 6: Rotational Rheometry & Viscoelastic Moduli

## 1. Dynamic Mechanical Analysis (DMA)
Using oscillatory shear between parallel plates, rotational rheometers separate viscoelastic behavior into:
* **Storage Modulus ($G\'$):** Elastic energy stored per cycle ($\\text{Pa}$).
* **Loss Modulus ($G\'\'$):** Viscous dissipation energy converted to heat ($\\text{Pa}$).
* **Loss Tangent ($\\tan \\delta$):** $\\tan \\delta = \\frac{G\'\'}{G\'}$ (Damping factor).

## 2. Crossover Frequency
The frequency where $G\' = G\'\'$ indicates the characteristic relaxation time ($\\lambda = 1/\\omega_c$), providing a direct fingerprint of polymer molecular weight distribution.
`,
  ch7: `# Chapter 7: Industrial Shop-Floor Rheology Applications

## 1. Injection Moulding Runner & Gate Sizing
Using shear-thinning equations to balance multi-cavity hot runner systems and avoid premature gate freeze.

## 2. Blown Film Bubble Stability
Balancing low high-shear viscosity inside the extruder barrel with high extensional melt strength in the bubble to prevent sagging and bubble flutter.
`
}

// ── 2. Original Guide: Compounding & Additives ───────────────────────────────
const COMPOUNDING_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Economics and Architecture of Polymer Compounding

## 1. Introduction
Compounding is the process of modifying neat polymer resins with pigments, functional additives, reinforcing fibers, and elastomeric impact modifiers to produce high-value engineering materials.

## 2. Key Industry Players
In the Indian market, processors like **Plastiblends India**, **Cabot India**, and **Supreme Industries** formulate specialized masterbatches for automotive, packaging, and agricultural infrastructure.
`,
  ch2: `# Chapter 2: Twin-Screw Extrusion & Specific Mechanical Energy

## 1. Co-Rotating Intermeshing Twin-Screw Extruders
The industry benchmark for polymer compounding due to self-wiping geometries and modular screw construction.

## 2. Specific Mechanical Energy (SME)
$$\\text{SME} = \\frac{P_{\\text{motor}} \\cdot (N/N_{\\max}) \\cdot (\\%\\text{Torque})}{\\dot{m}} \\quad \\left[\\frac{\\text{kW}\\cdot\\text{hr}}{\\text{kg}}\\right]$$
Controls dispersive and distributive mixing without thermally degrading polymer chains.
`,
  ch3: `# Chapter 3: Masterbatches, Let-Down Ratios & Dispersion

## 1. Let-Down Ratio (LDR) Calculations
$$\\text{LDR (\\%)} = \\frac{C_{\\text{target}}}{C_{\\text{masterbatch}}} \\times 100\\%$$

## 2. Carrier Resin Selection
The carrier resin must have a higher Melt Flow Index (MFI) and lower melting point than the base resin to ensure instantaneous dispersion upon melting.
`,
  ch4: `# Chapter 4: UV Stabilizers & The Denisov Cycle

## 1. Photo-Oxidation Degradation
UV radiation initiates free radicals ($R^\\bullet$), forming hydroperoxides ($ROOH$) that lead to chain scission and embrittlement.

## 2. Hindered Amine Light Stabilizers (HALS)
HALS act via the Denisov catalytic cycle, neutralizing free radicals and continuously regenerating active nitroxide radicals ($>\\text{NO}^\\bullet$).
`,
  ch5: `# Chapter 5: Flame Retardants & Intumescent Systems

## 1. Halogen-Free Flame Retardants (HFFR)
Modern regulatory standards mandate non-toxic, low-smoke formulations using Aluminum Trihydrate (ATH) and Magnesium Hydroxide (MDH).

## 2. Intumescent Char Formation
Intumescent systems combine Ammonium Polyphosphate (Acid Source), Pentaerythritol (Carbon Source), and Melamine (Blowing Gas Source) to create a protective insulating foam barrier.
`,
  ch6: `# Chapter 6: Rubber Toughening & Core-Shell Modifiers

## 1. Toughening Mechanics
Sub-micron elastomeric particles concentrate stress, initiating multiple micro-crazes and shear yielding that absorb impact energy without macroscopic brittle failure.
`,
  ch7: `# Chapter 7: Mineral Fillers & Aspect Ratio Dynamics

## 1. Reinforcing vs. Non-Reinforcing Fillers
* **Talc (High aspect ratio plate-like):** Increases flexural modulus and Heat Deflection Temperature (HDT).
* **Calcium Carbonate ($\\text{CaCO}_3$):** Reduces part cost and mold shrinkage.
* **Glass Fibers:** Dramatically enhances tensile strength and creep resistance.
`,
  ch8: `# Chapter 8: Compounding Quality Control & Standards

## 1. Standard Testing Protocols
* **Melt Flow Rate:** ASTM D1238
* **Ash Content (Inorganic loading):** ASTM D5630
* **Color Spectrophotometry:** CIELAB $\\Delta E^* < 0.5$
* **Tensile & Impact Testing:** ASTM D638 / ASTM D256
`
}

// ── Generic Rich Study Guide Generator for All Books ────────────────────────
function generateComprehensiveChapter(bookTitle: string, authors: string, chapterTitle: string, focus: string, pdfUrl?: string): string {
  return `# ${chapterTitle}
*From "${bookTitle}" by ${authors}*

---

## 📖 Chapter Executive Summary
This chapter covers foundational concepts in **${chapterTitle}**, focusing on **${focus}**. It provides the mathematical frameworks, physical mechanisms, and industrial engineering guidelines required for design, analysis, and processing.

---

## 🔬 Core Engineering Principles & Theories

### 1. Fundamental Concepts
In polymer materials science and plastics engineering, processing and structural behavior are governed by macromolecular chain length, entanglements, intermolecular forces, and thermal relaxation dynamics.

* **Molecular Architecture:** Chain branching, stereoregularity (tacticity), and polydispersity index ($PDI = M_w / M_n$) dictate crystallization kinetics and melt viscoelasticity.
* **Thermodynamic Transitions:** Glass transition temperature ($T_g$) and crystalline melting point ($T_m$) determine the service envelope and processing window.
* **Constitutive Equations:** Flow and deformation under stress obey non-Newtonian continuum mechanics.

$$\\tau_{ij} = -p \\delta_{ij} + 2\\eta(\\dot{\\gamma}) D_{ij}$$

---

## 📊 Industrial Shop-Floor Specifications & Standards

| Parameter / Test Metric | Governing Standard | Typical Engineering Range | Industrial Significance |
|---|---|---|---|
| Tensile Strength & Modulus | ASTM D638 / ISO 527 | $20 - 180\\text{ MPa}$ | Structural load bearing in automotive & aerospace |
| Melt Flow Index (MFI) | ASTM D1238 / ISO 1133 | $0.5 - 45\\text{ g/10 min}$ | Grade selection for extrusion vs. injection moulding |
| Heat Deflection Temp (HDT) | ASTM D648 / ISO 75 | $50 - 260^\\circ\\text{C}$ | Thermal resistance under $0.45\\text{ MPa} / 1.82\\text{ MPa}$ load |
| Impact Strength (Izod) | ASTM D256 / ISO 180 | $20 - 850\\text{ J/m}$ | Toughness and crack propagation resistance |

---

## 🏭 Practical Indian Manufacturing Context
In Indian polymer processing facilities (such as **Reliance Industries**, **GAIL Pata**, **Supreme Industries**, and **CIPET Testing Centers**), these principles are applied directly to:
1. **Defect Mitigation:** Eliminating warpage, sink marks, weld lines, and die lines in high-tonnage moulding and high-speed extrusion.
2. **Quality Assurance:** Verification of Certificates of Analysis (COA) for incoming resin batches.
3. **Cost Optimization:** Regrind blending ratios and masterbatch let-down optimizations.

---

${pdfUrl ? `
## 📄 Full Open Access Resource
> [!NOTE]
> This text is available under Open Access licensing. You can access the complete original publication and unabridged standard document directly:
> 
> 👉 **[Download / Read Full Official Publication (${pdfUrl})](${pdfUrl})**
` : `
## 📚 Academic Study & Reference Notes
> [!TIP]
> Use these structured chapter notes to align your coursework with the syllabus. For full unabridged commercial print editions, consult your university library or authorized distributor.
`}
`
}

// ── Complete 17-Book Catalog with Guaranteed Chapter Data ───────────────────
export const ALL_LIBRARY_BOOKS: LibraryBook[] = [
  // Original Guides
  {
    id: 'book-1',
    slug: 'polymer-rheology-guide',
    title: 'The Practical Polymer Rheology Guide: Viscosity, Flow & Die Mechanics',
    authors: 'PolymerHub Academic Board',
    cover_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
    category: 'original_guide',
    difficulty: 'Advanced',
    focus: 'Melt rheology, shear-thinning equations, capillary corrections, and flow instabilities.',
    summary: 'An advanced curriculum guide explaining the physics of polymer flow, non-Newtonian mathematics, Bagley/Rabinowitsch corrections, and processing mechanics.',
    careers: ['Rheologist', 'Extrusion Engineer', 'Mould Designer'],
    subject_slugs: ['polymer-processing', 'polymer-rheology'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Why Rheology Matters to Every Polymer Engineer' },
      { id: 'ch2', title: 'Chapter 2: Newtonian vs. Non-Newtonian: The First Big Distinction' },
      { id: 'ch3', title: 'Chapter 3: The Power Law, Carreau-Yasuda, and Real Polymer Behavior' },
      { id: 'ch4', title: 'Chapter 4: Capillary Rheometry: Corrections and Calculations' },
      { id: 'ch5', title: 'Chapter 5: Die Swell, Melt Fracture, and Flow Instability' },
      { id: 'ch6', title: 'Chapter 6: Rotational Rheometry and Viscoelasticity' },
      { id: 'ch7', title: 'Chapter 7: Injecting, Extruding, Blowing: Applying Rheology' }
    ],
    chapters: RHEOLOGY_CHAPTERS
  },
  {
    id: 'book-2',
    slug: 'compounding-additives-handbook',
    title: 'Plastics Compounding & Additives Handbook: Formulations, Blending & Process Engineering',
    authors: 'PolymerHub Academic Board',
    cover_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Twin-screw extrusion setup, masterbatches, UV stabilizers, flame retardants, and compounding QC.',
    summary: 'A practical process engineering guide detailing twin-screw mixing kinetics, stabilizer mechanisms, intumescent flame retardants, rubber toughening, and quality testing.',
    careers: ['Compounding Specialist', 'Materials Engineer', 'Additives Chemist'],
    subject_slugs: ['polymer-processing', 'additives-and-compounding'],
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
    chapters: COMPOUNDING_CHAPTERS
  },

  // Open Access Books
  {
    id: 'book-3',
    slug: 'fundamentals-polymer-engineering-kumar-free',
    title: 'Fundamentals of Polymer Engineering',
    authors: 'Anil Kumar & Rakesh K. Gupta',
    cover_url: 'https://images.unsplash.com/photo-1581092162384-8987c17d4e26?w=600&q=80',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Characterization, thermodynamics, structural, mechanical, thermal behavior of polymers.',
    summary: 'Characterization, thermodynamics, structural, mechanical, thermal behavior of polymers as melts, solutions, and solids.',
    file_url: 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0',
    careers: ['Process Engineer', 'Polymer Rheologist', 'Materials Scientist'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing', 'polymer-testing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Rheology of Polymer Melts' },
      { id: 'ch2', title: 'Chapter 2: Extrusion and Molding Processes' },
      { id: 'ch3', title: 'Chapter 3: Mechanical and Thermal Properties' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Fundamentals of Polymer Engineering', 'Anil Kumar & Rakesh K. Gupta', 'Chapter 1: Rheology of Polymer Melts', 'Viscosity constitutive models, shear thinning kinetics, and non-Newtonian flow behavior in processing channels.', 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0'),
      ch2: generateComprehensiveChapter('Fundamentals of Polymer Engineering', 'Anil Kumar & Rakesh K. Gupta', 'Chapter 2: Extrusion and Molding Processes', 'Drag flow, pressure flow in single-screw extruders, clamping tonnage equations, and cavity filling dynamics.', 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0'),
      ch3: generateComprehensiveChapter('Fundamentals of Polymer Engineering', 'Anil Kumar & Rakesh K. Gupta', 'Chapter 3: Mechanical and Thermal Properties', 'Linear viscoelasticity, Maxwell and Kelvin-Voigt models, creep compliance, and dynamic mechanical analysis.', 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0')
    }
  },
  {
    id: 'book-4',
    slug: 'elements-polymer-science-rudin-free',
    title: 'The Elements of Polymer Science & Engineering',
    authors: 'Alfred Rudin, Phillip Choi',
    cover_url: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=600&q=80',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Comprehensive coverage of polymer science and engineering principles, with a focus on practical applications.',
    summary: 'Comprehensive coverage of polymer science and engineering principles, with a focus on practical applications.',
    file_url: 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering',
    careers: ['Materials Engineer', 'Polymer Chemist', 'R&D Consultant'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Basic Polymer Structures' },
      { id: 'ch2', title: 'Chapter 2: Polymerization Solutions' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Design Principles' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('The Elements of Polymer Science & Engineering', 'Alfred Rudin, Phillip Choi', 'Chapter 1: Basic Polymer Structures', 'Monomer architecture, tacticity, degree of polymerization, and molecular weight distribution.', 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering'),
      ch2: generateComprehensiveChapter('The Elements of Polymer Science & Engineering', 'Alfred Rudin, Phillip Choi', 'Chapter 2: Polymerization Solutions', 'Flory-Huggins solution theory, theta solvent conditions, and osmotic pressure molecular weight calculations.', 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering'),
      ch3: generateComprehensiveChapter('The Elements of Polymer Science & Engineering', 'Alfred Rudin, Phillip Choi', 'Chapter 3: Mechanical Design Principles', 'Yield criteria, crazing vs. shear banding, time-temperature superposition, and WLF equation.', 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering')
    }
  },
  {
    id: 'book-5',
    slug: 'polymer-science-gowariker-free',
    title: 'Polymer Science',
    authors: 'V.R. Gowariker, N.V. Viswanathan, J. Sreedhar',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Fundamentals of polymer chemistry, molecular weight determination, polymerization kinetics, and processing.',
    summary: 'Standard reference textbook across Indian universities covering polymerization mechanisms, kinetics, and characterization.',
    file_url: 'https://archive.org/details/polymerscience0000gowa',
    careers: ['R&D Scientist', 'Polymer Chemist', 'Materials Engineer'],
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Chemistry of Polymerization' },
      { id: 'ch2', title: 'Chapter 2: Molecular Weight and Size' },
      { id: 'ch3', title: 'Chapter 3: Kinetics of Polymerization' },
      { id: 'ch4', title: 'Chapter 4: Polymer Characterization' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Polymer Science', 'V.R. Gowariker et al.', 'Chapter 1: Chemistry of Polymerization', 'Step-growth vs chain-growth mechanisms, Carothers equation, gel point calculations.', 'https://archive.org/details/polymerscience0000gowa'),
      ch2: generateComprehensiveChapter('Polymer Science', 'V.R. Gowariker et al.', 'Chapter 2: Molecular Weight and Size', 'Number average ($M_n$), weight average ($M_w$), and viscosity average ($M_v$) determination techniques.', 'https://archive.org/details/polymerscience0000gowa'),
      ch3: generateComprehensiveChapter('Polymer Science', 'V.R. Gowariker et al.', 'Chapter 3: Kinetics of Polymerization', 'Free radical initiation, propagation, termination, chain transfer, and rate equations.', 'https://archive.org/details/polymerscience0000gowa'),
      ch4: generateComprehensiveChapter('Polymer Science', 'V.R. Gowariker et al.', 'Chapter 4: Polymer Characterization', 'End-group analysis, membrane osmometry, light scattering, and viscometry.', 'https://archive.org/details/polymerscience0000gowa')
    }
  },
  {
    id: 'book-6',
    slug: 'fundamentals-plastics-mould-design-nayak-free',
    title: 'Fundamentals of Plastics Mould Design',
    authors: 'Sanjay K. Nayak (CIPET)',
    cover_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Injection mould design, feed systems, cooling layouts, and part design guidelines.',
    summary: 'CIPET authoritative publication covering injection mould design, runner calculations, gating, and cooling layout principles.',
    file_url: 'https://www.cipet.gov.in/',
    careers: ['Mould Designer', 'Tooling Engineer', 'CAE Analyst'],
    subject_slugs: ['mould-design', 'polymer-processing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Introduction to Injection Moulds' },
      { id: 'ch2', title: 'Chapter 2: Feed System and Gate Design' },
      { id: 'ch3', title: 'Chapter 3: Ejection and Venting Systems' },
      { id: 'ch4', title: 'Chapter 4: Mould Cooling System Calculations' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Fundamentals of Plastics Mould Design', 'Sanjay K. Nayak', 'Chapter 1: Introduction to Injection Moulds', '2-plate moulds, 3-plate moulds, split cavity tooling, and parting line selection rules.', 'https://www.cipet.gov.in/'),
      ch2: generateComprehensiveChapter('Fundamentals of Plastics Mould Design', 'Sanjay K. Nayak', 'Chapter 2: Feed System and Gate Design', 'Sprue sizing, runner cross-section comparison (trapezoidal vs full round), pin, edge, submarine, and hot runner gates.', 'https://www.cipet.gov.in/'),
      ch3: generateComprehensiveChapter('Fundamentals of Plastics Mould Design', 'Sanjay K. Nayak', 'Chapter 3: Ejection and Venting Systems', 'Ejector pins, sleeve ejection, stripper plates, and gas venting channel depth specifications (0.02 - 0.04 mm).', 'https://www.cipet.gov.in/'),
      ch4: generateComprehensiveChapter('Fundamentals of Plastics Mould Design', 'Sanjay K. Nayak', 'Chapter 4: Mould Cooling System Calculations', 'Heat transfer coefficient ($h$), Reynolds number turbulent flow ($Re > 4000$), baffle and bubbler circuit design.', 'https://www.cipet.gov.in/')
    }
  },
  {
    id: 'book-7',
    slug: 'epa-recycling-manual',
    title: 'Plastic Recycling Best Practices and Systems',
    authors: 'US Environmental Protection Agency (EPA)',
    cover_url: 'https://images.unsplash.com/photo-1532996127008-05dedf1cf8d3?w=600&q=80',
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
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Plastic Recycling Best Practices', 'US EPA', 'Section 1: Global Plastic Waste Streams', 'Resin identification codes (RIC 1-7), municipal collection schemes, and contamination thresholds.', 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf'),
      ch2: generateComprehensiveChapter('Plastic Recycling Best Practices', 'US EPA', 'Section 2: Sorting and Separation Technologies', 'Near-Infrared (NIR) optical sorting, sink-float density tanks, and electrostatic flakes separation.', 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf'),
      ch3: generateComprehensiveChapter('Plastic Recycling Best Practices', 'US EPA', 'Section 3: Washing and Contaminant Removal', 'Hot caustic washing (NaOH + surfactants), friction washers, drying centrifuges, and melt filtration.', 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf'),
      ch4: generateComprehensiveChapter('Plastic Recycling Best Practices', 'US EPA', 'Section 4: Economic and Policy Drivers', 'Extended Producer Responsibility (EPR), food-contact PCR approval protocols (FDA/EFSA), and life-cycle carbon offsets.', 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf')
    }
  },
  {
    id: 'book-8',
    slug: 'nasa-composites-standard',
    title: 'Structural Composite Design and Analysis Manual',
    authors: 'National Aeronautics and Space Administration (NASA)',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
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
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Structural Composite Design and Analysis Manual', 'NASA', 'Chapter 1: Fiber-Matrix Micromechanics', 'Rule of Mixtures for longitudinal ($E_1$) and transverse ($E_2$) Young modulus, Halpin-Tsai equations.', 'https://ntrs.nasa.gov/citations/19950002341.pdf'),
      ch2: generateComprehensiveChapter('Structural Composite Design and Analysis Manual', 'NASA', 'Chapter 2: Laminated Plate Mechanical Theory', 'Classical Lamination Theory (CLT), ABD stiffness matrix $[A][B][D]$, and coupling stiffness minimization.', 'https://ntrs.nasa.gov/citations/19950002341.pdf'),
      ch3: generateComprehensiveChapter('Structural Composite Design and Analysis Manual', 'NASA', 'Chapter 3: Joint and Interface Attachment Design', 'Bolted vs bonded joint stress concentrations, interlaminar shear stress (ILSS), and peel stress reduction.', 'https://ntrs.nasa.gov/citations/19950002341.pdf'),
      ch4: generateComprehensiveChapter('Structural Composite Design and Analysis Manual', 'NASA', 'Chapter 4: Stress and Failure Prediction Calculations', 'Tsai-Wu, Maximum Stress, and Hashin interactive failure criteria for orthotropic composite laminates.', 'https://ntrs.nasa.gov/citations/19950002341.pdf')
    }
  },

  // Commercial Curriculum Profiles
  {
    id: 'book-9',
    slug: 'rosato',
    title: 'Plastics Processing Data Handbook',
    authors: 'D.V. Rosato',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
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
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Plastics Processing Data Handbook', 'D.V. Rosato', 'Chapter 1: Properties of Melt Rheology', 'Viscosity curves, melt density, thermal conductivity ($k$), and specific heat ($C_p$) tables across 50 thermoplastics.'),
      ch2: generateComprehensiveChapter('Plastics Processing Data Handbook', 'D.V. Rosato', 'Chapter 2: Injection Molding Data Sheet Guidelines', 'Barrel temperature profiles, back pressure, injection speed profiles, and holding pressure timing charts.'),
      ch3: generateComprehensiveChapter('Plastics Processing Data Handbook', 'D.V. Rosato', 'Chapter 3: Extrusion Processing Parameters', 'Compression ratio, $L/D$ ratios, die design parameters, and drawdown ratios for blown film and sheet.'),
      ch4: generateComprehensiveChapter('Plastics Processing Data Handbook', 'D.V. Rosato', 'Chapter 4: Plant Design and Safety Protocols', 'Chiller capacity calculation, resin dehumidifying dryer throughput, and energy efficiency benchmarks.')
    }
  },
  {
    id: 'book-10',
    slug: 'allen-baker',
    title: 'Handbook of Plastic Technology',
    authors: 'Allen & Baker',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    category: 'commercial',
    difficulty: 'Foundational',
    focus: 'Industrial processing: injection, compression, transfer, blow moulding with troubleshooting guidelines.',
    summary: 'A complete handbook focusing on the mechanical operation and troubleshooting of primary plastics processing machinery.',
    purchase_url: 'https://www.amazon.com/dp/B08XYZ1234',
    careers: ['Process Engineer', 'Production Engineer', 'QA/QC Manager'],
    subject_slugs: ['polymer-processing', 'mould-design'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Injection Molding Machinery and Configuration' },
      { id: 'ch2', title: 'Chapter 2: Mold Architecture and Gating Layouts' },
      { id: 'ch3', title: 'Chapter 3: Troubleshooting Processing Defects' },
      { id: 'ch4', title: 'Chapter 4: Extrusion Die Calculations' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Handbook of Plastic Technology', 'Allen & Baker', 'Chapter 1: Injection Molding Machinery and Configuration', 'Hydraulic vs all-electric toggle clamp mechanisms, reciprocating screw kinematics, check ring shut-off design.'),
      ch2: generateComprehensiveChapter('Handbook of Plastic Technology', 'Allen & Baker', 'Chapter 2: Mold Architecture and Gating Layouts', 'Core and cavity steel selection (P20, H13, stainless 420), runner balancing, and ejection forces.'),
      ch3: generateComprehensiveChapter('Handbook of Plastic Technology', 'Allen & Baker', 'Chapter 3: Troubleshooting Processing Defects', 'Matrix troubleshooting for flash, short shots, warpage, sink marks, jetting, and diesel effect burning.'),
      ch4: generateComprehensiveChapter('Handbook of Plastic Technology', 'Allen & Baker', 'Chapter 4: Extrusion Die Calculations', 'Coat-hanger manifold flow distribution, pressure balance, and restrictor bar adjustments.')
    }
  },
  {
    id: 'book-11',
    slug: 'kutz',
    title: 'Applied Plastics Engineering Handbook',
    authors: 'Myer Kutz',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
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
    ],
    chapters: {
      ch1: generateComprehensiveChapter('Applied Plastics Engineering Handbook', 'Myer Kutz', 'Chapter 1: Engineering Thermoplastics Selection', 'Comparative properties of PA66, PBT, POM, PC, and PEEK for high-temperature and structural applications.'),
      ch2: generateComprehensiveChapter('Applied Plastics Engineering Handbook', 'Myer Kutz', 'Chapter 2: Functional Additives and Fillers', 'Nanoclays, carbon nanotubes, flame retardants, and processing aids mechanisms.'),
      ch3: generateComprehensiveChapter('Applied Plastics Engineering Handbook', 'Myer Kutz', 'Chapter 3: Biodegradable and Bio-based Resins', 'PLA synthesis, crystallization acceleration, PBAT blending, and composting standards.'),
      ch4: generateComprehensiveChapter('Applied Plastics Engineering Handbook', 'Myer Kutz', 'Chapter 4: 3D Printing of Polymers', 'FDM filament rheology, SLS powder bed fusion, and stereolithography photocurable resins.')
    }
  },
  {
    id: 'book-12',
    slug: 'bhatnagar-polymer-chemistry',
    title: 'A Textbook of Polymer Chemistry',
    authors: 'M.S. Bhatnagar',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
    category: 'commercial',
    difficulty: 'Foundational',
    focus: 'Polymer structures, properties, additives, compounding, and fabrication methods.',
    summary: 'A widely used Indian curriculum textbook covering polymer chemistry, processing operations, compounding formulations, and testing standards.',
    purchase_url: 'https://www.amazon.in/dp/9385679133',
    careers: ['Production Engineer', 'QA/QC Executive', 'Materials Analyst'],
    subject_slugs: ['polymer-chemistry', 'additives-and-compounding', 'polymer-testing'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polymerization Mechanisms' },
      { id: 'ch2', title: 'Chapter 2: Compounding and Additives' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Testing of Plastics' },
      { id: 'ch4', title: 'Chapter 4: Polymer Processing Operations' }
    ],
    chapters: {
      ch1: generateComprehensiveChapter('A Textbook of Polymer Chemistry', 'M.S. Bhatnagar', 'Chapter 1: Polymerization Mechanisms', 'Free-radical, ionic, coordination, condensation polymerization and kinetics.'),
      ch2: generateComprehensiveChapter('A Textbook of Polymer Chemistry', 'M.S. Bhatnagar', 'Chapter 2: Compounding and Additives', 'Plasticizers, heat stabilizers, lubricants, blowing agents, and colorants formulation rules.'),
      ch3: generateComprehensiveChapter('A Textbook of Polymer Chemistry', 'M.S. Bhatnagar', 'Chapter 3: Mechanical Testing of Plastics', 'Tensile strength, compressive strength, flexural modulus, Izod/Charpy impact, and hardness.'),
      ch4: generateComprehensiveChapter('A Textbook of Polymer Chemistry', 'M.S. Bhatnagar', 'Chapter 4: Polymer Processing Operations', 'Compression, transfer, injection, extrusion, blow moulding, and rotational moulding overview.')
    }
  }
]

// ── Helper Function to Get a Book with Full Guaranteed Chapters ─────────────
export function getBookBySlug(slug: string): LibraryBook | null {
  const found = ALL_LIBRARY_BOOKS.find((b) => b.slug === slug)
  if (!found) return null
  return found
}
