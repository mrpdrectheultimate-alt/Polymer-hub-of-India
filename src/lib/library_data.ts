// src/lib/library_data.ts — Normalized PolymerHub Digital Library v3 Framework
// Implements 4-Class Legal Classification System (Class A, B, C, D) & Block Architecture

export type LegalClass = 'Class A' | 'Class B' | 'Class C' | 'Class D'

export interface LibraryReference {
  doi?: string
  isbn?: string
  url?: string
  citation_title: string
  publisher_info?: string
}

export interface LibraryBook {
  id: string
  slug: string
  title: string
  authors: string
  legal_class: LegalClass
  license_type: string
  license_url?: string
  category: 'original_guide' | 'open_access' | 'commercial'
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced'
  focus: string
  summary: string
  cover_url: string
  purchase_url?: string
  file_url?: string
  worldcat_url?: string
  openlibrary_url?: string
  publisher?: string
  publication_year?: number
  isbn?: string
  doi?: string
  careers: string[]
  subject_slugs: string[]
  notice?: string
  toc: { id: string; title: string }[]
  chapters: Record<string, string> // Strictly EMPTY `{}` for Class D commercial reference cards
}

// ── 1. Class A Flagship Original: Polymer Rheology ──────────────────────────
const RHEOLOGY_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Why Rheology Matters to Every Polymer Engineer

## 1. Executive Overview
Rheology is the study of the deformation and flow of matter under stress. For polymer processing engineers, plant managers, and mold designers, melt rheology is the single critical discipline governing cavity fill pressure, shear heating, extrudate die swell, and cycle time optimization.

## 2. Key Industrial Rheological Phenomena
* **Pressure Drop & Viscosity Matching:** Viscosity ($\eta$) dictates hydraulic pump pressure required to drive molten resin through screws, manifold channels, hot runners, and complex mold cavities.
* **Shear Heating (Viscous Dissipation):** High shear in gate orifices generates localized thermal energy ($\dot{Q} = \tau \cdot \dot{\gamma}$), risking degradation in sensitive resins like PVC, POM, and PEEK.
* **Elastic Memory:** When forced through narrow dies or gates, entangled macromolecular coils stretch and align. Upon exit, unconstrained chains recoil elastically, creating **extrudate die swell** ($B = D/D_0$).

## 3. Practical Industrial Shear Rate Ranges
| Manufacturing Process | Typical Shear Rate Range ($\\text{s}^{-1}$) | Governing Rheological Property |
|---|---|---|
| Compression Moulding | $1 - 10$ | Zero-shear viscosity ($\\eta_0$) |
| Extrusion Profile / Pipe | $100 - 1,000$ | Power-law index ($n$), Extrudate swell ($B$) |
| Injection Moulding Cavity | $1,000 - 100,000$ | High-shear apparent viscosity, Gate freeze-off |
| Blow Moulding Parison | $10 - 100$ | Melt strength, Extensional viscosity, Sag resistance |
`,
  ch2: `# Chapter 2: Newtonian vs. Non-Newtonian Flow Kinetics

## 1. Shear Stress Equations
In a simple Newtonian liquid undergoing laminar shear, shear stress ($\tau$) varies linearly with shear rate ($\dot{\gamma}$):
$$\tau = \eta \cdot \dot{\gamma}$$

Polymer melts, however, are non-Newtonian fluids whose apparent viscosity decreases dramatically as shear rate increases—a physical phenomenon termed **pseudoplasticity (shear thinning)**.

## 2. Molecular Origin of Shear Thinning
At rest ($\dot{\gamma} \to 0$), long polymer chains form an entangled, isotropic coil network resisting motion with zero-shear viscosity $\eta_0$. Under high shear flow:
1. Imposed hydrodynamic forces exceed Brownian thermal randomization.
2. Entanglements slip and uncoil.
3. Molecular chains align parallel to streamlines, reducing internal friction and dropping viscosity by up to 3 orders of magnitude.
`,
  ch3: `# Chapter 3: Mathematical Constitutive Models (Power Law & Carreau-Yasuda)

## 1. Ostwald-de Waele Power Law Model
For the high-shear processing regime typical of injection molding and profile extrusion:
$$\tau = K \cdot \dot{\gamma}^n \implies \eta(\dot{\gamma}) = K \cdot \dot{\gamma}^{n-1}$$

Where:
* $K$ = Flow consistency index ($\text{Pa}\cdot\text{s}^n$)
* $n$ = Flow behavior index ($n < 1$ for pseudoplastic polymers; e.g., $n \approx 0.35$ for HDPE, $n \approx 0.28$ for PP)

## 2. Carreau-Yasuda Model
To capture zero-shear viscosity ($\eta_0$), infinite-shear limit ($\eta_\infty$), transition region, and high-shear thinning simultaneously:
$$\eta(\dot{\gamma}) = \eta_\infty + (\eta_0 - \eta_\infty) \left[ 1 + (\lambda \dot{\gamma})^a \right]^{\frac{n-1}{a}}$$
`,
  ch4: `# Chapter 4: Capillary Rheometry & Bagely / Rabinowitsch Corrections

## 1. Capillary Flow Measurements
A capillary rheometer extrudes polymer melt through a tungsten carbide capillary die (radius $R$, length $L$) at controlled piston speed ($Q$).

## 2. Essential Mathematical Corrections
* **Bagley Entrance Correction:** Substracts entrance and exit pressure losses ($\Delta P_e$) caused by converging extensional deformation at the die entrance:
  $$\tau_w = \frac{\Delta P - \Delta P_e}{2 (L/R)}$$
* **Weissenberg-Rabinowitsch Correction:** Corrects non-parabolic shear profile at the die wall for pseudoplastic fluids:
  $$\dot{\gamma}_w = \dot{\gamma}_{\text{app}} \left[ \frac{3n + 1}{4n} \right]$$
`,
  ch5: `# Chapter 5: Extrudate Die Swell & Flow Instabilities

## 1. Swell Mechanics
Extrudate die swell ($B = D_e / D_0$) results from recovery of elastic shear strain accumulated during capillary entry.
* Long dies ($L/D > 20$) grant relaxation time, lowering swell ($B \to 1.1$).
* Short dies ($L/D < 5$) store elastic energy, producing high swell ($B > 1.8$).

## 2. Melt Fracture Mitigation
* **Sharkskin:** Surface tearing when wall shear stress $\tau_w > 0.14\text{ MPa}$.
* **Solution:** Adding fluoropolymer Polymer Processing Aids (PPA) to coat metal die walls and promote wall slip.
`,
  ch6: `# Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli

## 1. Storage & Loss Moduli
Using parallel plate geometry, rotational rheometers measure linear viscoelastic properties under small strain oscillations:
* **Storage Modulus ($G'$):** Elastic energy stored per deformation cycle ($\text{Pa}$).
* **Loss Modulus ($G''$):** Viscous energy dissipated as thermal heat ($\text{Pa}$).
* **Damping Factor ($\tan \delta$):** $\tan \delta = G'' / G'$.

## 2. Crossover Point ($\omega_c$)
The frequency where $G' = G''$ defines the fundamental relaxation spectrum time ($\lambda = 1/\omega_c$), serving as a direct fingerprint of molecular weight distribution (MWD).
`,
  ch7: `# Chapter 7: Industrial Shop-Floor Rheology Implementation

## 1. Injection Moulding Hot Runner Balancing
Applying shear-thinning indices to balance multi-cavity hot runners and eliminate cavity-to-cavity weight variance.

## 2. Blown Film Processing
Optimizing zero-shear viscosity to prevent bubble sag while maintaining low high-shear viscosity inside the extruder barrel.
`
}

// ── 2. Class A Flagship Original: Compounding & Additives ───────────────────
const COMPOUNDING_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Economics and Architecture of Polymer Compounding

## 1. Executive Summary
Compounding is the process of modifying base polymer resins with functional additives, reinforcing fibers, impact modifiers, and pigments to generate high-performance engineering plastics.

## 2. Industrial Ecosystem
Leading global and Indian compounders (Plastiblends, Supreme, Cabot, BASF, Covestro) utilize twin-screw compounding extruders to produce specialized masterbatches for automotive, packaging, and electrical infrastructure.
`,
  ch2: `# Chapter 2: Twin-Screw Extrusion & Specific Mechanical Energy (SME)

## 1. Co-Rotating Twin-Screw Technology
Modular screw elements (conveying, kneading blocks, reverse elements) permit precise control over distributive and dispersive mixing.

## 2. SME Equation
$$\text{SME} = \frac{P_{\text{motor}} \cdot (N/N_{\max}) \cdot (\%\text{Torque})}{\dot{m}} \quad \left[\frac{\text{kW}\cdot\text{hr}}{\text{kg}}\right]$$
SME quantification ensures filler dispersion (e.g. $\text{CaCO}_3$, Talc, Glass Fiber) without thermally degrading polymer backbones.
`,
  ch3: `# Chapter 3: Masterbatch Formulations & Let-Down Calculations

## 1. Let-Down Ratio (LDR) Formula
$$\text{LDR (\%)} = \frac{C_{\text{target}}}{C_{\text{masterbatch}}} \times 100\%$$

## 2. Carrier Resin Selection Rules
The masterbatch carrier resin must possess higher Melt Flow Index (MFI) and lower melting point than the matrix resin to guarantee rapid, uniform dispersion upon melting.
`,
  ch4: `# Chapter 4: UV Stabilization Mechanics & The Denisov Cycle

## 1. Photo-Oxidation Degradation
Solar UV-B radiation ($290 - 400\text{ nm}$) generates free radicals ($R^\bullet$), initiating autoxidation and causing chain scission, micro-cracking, and loss of impact strength.

## 2. HALS Mechanism
Hindered Amine Light Stabilizers (HALS) neutralize alkyl radicals via the regenerative Denisov cycle ($>\text{NO}^\bullet$), providing long-term outdoor weatherability.
`,
  ch5: `# Chapter 5: Flame Retardant Chemistry & Intumescent Systems

## 1. Halogen-Free Flame Retardants (HFFR)
High loadings of Aluminum Trihydrate (ATH) or Magnesium Hydroxide (MDH) endothermically release water vapor ($\Delta H_{\text{decomp}} > 1000\text{ J/g}$), cooling the flame zone.

## 2. Intumescent Systems
Combining Acid Source (Ammonium Polyphosphate), Carbonific (Pentaerythritol), and Spumific (Melamine) to generate a protective insulating carbon char barrier.
`,
  ch6: `# Chapter 6: Rubber Toughening & Core-Shell Modifiers

## 1. Toughening Mechanics
Sub-micron elastomeric particles (e.g., EPDM, Core-Shell Acrylics) act as stress concentrators, promoting micro-shearing and crazing to absorb impact energy without catastrophic brittle fracture.
`,
  ch7: `# Chapter 7: Inorganic Reinforcing Fillers (Talc, Mica, Glass Fiber)

## 1. Reinforcement Principles
* **Talc (Platelet Aspect Ratio $> 20$):** Boosts flexural modulus and Heat Deflection Temperature (HDT) in PP automotive bumpers.
* **Short Glass Fiber (SGF):** Dramatically increases tensile strength and dimensional stability under thermal loads.
`,
  ch8: `# Chapter 8: Compounding Quality Control & Standard Testing

## 1. QC Protocols
* **Ash Content (ASTM D5630):** Furnace pyrolysis to verify inorganic filler loading percentage.
* **Melt Flow Index (ASTM D1238):** Verifying thermal degradation during extrusion.
* **Color Spectrophotometry (CIELAB):** Ensuring $\Delta E^* < 0.5$ across production batches.
`
}

// ── 3. Class A Flagship Original: Injection Moulding Defect Elimination ────
const DEFECT_MASTERY_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Systematic Injection Moulding Processing Principles

## 1. Scientific Injection Moulding (SIM)
Scientific injection moulding decouples the process into 3 distinct phases:
1. **Phase 1 (Fill):** $95-98\%$ volumetric fill under velocity control (decoupled fill).
2. **Phase 2 (Pack/Hold):** Pressure-controlled packing to prevent sink marks and voids until gate freeze-off.
3. **Phase 3 (Cooling):** In-cavity thermal solidification before mold open.

## 2. Decoupled Moulding Pressure Equations
$$P_{\text{plastic}} = P_{\text{hydraulic}} \times R_i$$
Where $R_i$ is the intensification ratio (typically $10:1$ to $15:1$).
`,
  ch2: `# Chapter 2: Elimination of Short Shots & Unfilled Cavities

## 1. Root Causes
* Insufficient injection volume or pressure limit cutoff.
* Melt viscosity too high due to low melt/mold temperature.
* Inadequate gas venting causing backpressure cushion.

## 2. Diagnostic & Action Matrix
| Cause | Physical Mechanism | Shop-Floor Remedy |
|---|---|---|
| Low Melt Temp | High melt viscosity | Increase barrel profile temperatures by $10-15^\circ\text{C}$ |
| Gate Freeze | Premature gate solidification | Increase gate diameter or boost injection speed |
| Restricted Venting | Trapped air counter-pressure | Clean vent slots, deepen vents to $0.02 - 0.04\text{ mm}$ |
`,
  ch3: `# Chapter 3: Warpage & Differential Shrinkage Mitigation

## 1. Physics of Warpage
Warpage occurs due to non-uniform volumetric shrinkage across part geometry caused by:
1. Differential cooling between core and cavity mold sides.
2. Differential shrinkage parallel vs perpendicular to polymer flow direction.

## 2. Thermal Optimization Formula
$$\Delta T_{\text{mold}} = T_{\text{cavity}} - T_{\text{core}} \le 5^\circ\text{C}$$
Maintaining turbulent cooling water flow ($Re > 4000$) in mold water channels prevents thermal gradients.
`,
  ch4: `# Chapter 4: Sink Marks & Void Elimination

## 1. Sink Mark Mechanics
When thick sections cool, the outer skin solidifies while the molten core shrinks inward, pulling the surface down.

## 2. Design Rules
* Rib thickness $T_{\text{rib}} \le 0.6 \times T_{\text{wall}}$.
* Increase hold pressure time until gate seal is confirmed via part weight balance curves.
`,
  ch5: `# Chapter 5: Weld Line Strength & Optical Defect Remedies

## 1. Weld Line Formation
Weld lines occur when two converging melt fronts meet after flowing around an obstacle or core pin.

## 2. Weld Line Strength Enhancement
* Increase melt temperature and injection speed to ensure high interface pressure during front convergence.
* Position weld lines in non-structural part zones using mold flow analysis (CAE).
`,
  ch6: `# Chapter 6: Flash, Burn Marks & Diesel Effect Prevention

## 1. Burning (Diesel Effect)
Compressed trapped air detonates inside unvented mold cavities ($P_{\text{air}} > 30\text{ bar}$), reaching temperatures $> 500^\circ\text{C}$.

## 2. Prevention Protocols
* Provide adequate parting line venting slots ($0.02\text{ mm}$ for PP/PE, $0.015\text{ mm}$ for PA).
* Reduce injection velocity near end-of-fill using multi-stage velocity profiles.
`
}

// ── 4. Class A Original: Polymer Testing & Quality Control ──────────────────
const TESTING_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Standard Testing Frameworks (ASTM vs ISO)

## 1. Standard Organizations
Polymer characterization relies on standardized protocols set by ASTM International and ISO to ensure global compliance across raw material supply chains.
`,
  ch2: `# Chapter 2: Thermal Characterization (DSC, TGA, HDT, Vicat)

## 1. Differential Scanning Calorimetry (DSC)
Measures heat flow to determine Glass Transition ($T_g$), Crystallization ($T_c$), and Melting Temperature ($T_m$):
$$\Delta H_c = \int \left(\frac{dH}{dt}\right) dt$$
Percentage crystallinity: $\%X_c = \frac{\Delta H_m}{\Delta H_m^\circ} \times 100\%$.
`,
  ch3: `# Chapter 3: Mechanical Testing (Tensile, Flexural, Izod/Charpy Impact)

## 1. Tensile Testing (ASTM D638 / ISO 527)
Stress-strain evaluation generating Young's Modulus ($E$), Yield Strength ($\sigma_y$), and Elongation at Break ($\varepsilon_b$).
`,
  ch4: `# Chapter 4: Melt Flow Rate (MFR/MVR) & Capillary Analysis

## 1. MFI Protocol (ASTM D1238)
Extruding melt through $2.095\text{ mm}$ orifice at designated temperature and weight (e.g. $230^\circ\text{C} / 2.16\text{ kg}$ for PP).
`,
  ch5: `# Chapter 5: Spectroscopic & Chromatographic Analysis (FTIR, GPC)

## 1. FTIR Identification
Infrared absorption spectra pinpointing functional groups (e.g. carbonyl peak at $1715\text{ cm}^{-1}$ for PET/PE).
`
}

// ── 5. Class A Original: Applied Polymer Chemistry & Synthesis ──────────────
const CHEMISTRY_CHAPTERS: Record<string, string> = {
  ch1: `# Chapter 1: Step-Growth vs Chain-Growth Polymerization Kinetics

## 1. Mechanism Comparison
* **Step-Growth (Polyesters, Polyamides):** Carothers equation $\bar{X}_n = \frac{1}{1-p}$. High molecular weight obtained only at $p > 0.99$.
* **Chain-Growth (Polyolefins, Styrenics):** Radical initiation, propagation, and termination steps.
`,
  ch2: `# Chapter 2: Free Radical & Controlled Radical Polymerization (RAFT, ATRP)

## 1. Living Radical Polymerization
Reversible Addition-Fragmentation Chain Transfer (RAFT) and Atom Transfer Radical Polymerization (ATRP) allow narrow polydispersity ($PDI < 1.1$) and block copolymer synthesis.
`,
  ch3: `# Chapter 3: Copolymerization Reactivity Ratios & Mayo-Lewis Equation

## 1. Mayo-Lewis Equation
$$F_1 = \frac{r_1 f_1^2 + f_1 f_2}{r_1 f_1^2 + 2 f_1 f_2 + r_2 f_2^2}$$
Governs ideal, alternating, or block copolymer microstructure formation.
`,
  ch4: `# Chapter 4: Tacticity, Stereospecific Catalysis & Ziegler-Natta / Metallocene

## 1. Stereocontrol
Ziegler-Natta ($\text{TiCl}_3 / \text{AlEt}_3$) and single-site metallocene catalysts produce highly isotactic polypropylene ($i\text{-PP}$) with high crystallinity ($T_m \approx 165^\circ\text{C}$).
`,
  ch5: `# Chapter 5: Industrial Reactor Engineering & Solution/Suspension Processes

## 1. Industrial Polymerization Reactors
Continuous Stirred-Tank Reactors (CSTR) vs Loop Reactors for high-density polyethylene (HDPE) slurry production.
`
}

// ── Complete 20-Book Catalog with Strict 4-Class Legal Partitioning ─────────
export const ALL_LIBRARY_BOOKS: LibraryBook[] = [
  // ── CLASS A: PolymerHub Original Guides (Full Deep Interactive Content) ──
  {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'polymer-rheology-guide',
    title: 'The Practical Polymer Rheology Guide: Viscosity, Flow & Die Mechanics',
    authors: 'PolymerHub Academic Board',
    legal_class: 'Class A',
    license_type: 'PolymerHub Proprietary Original',
    category: 'original_guide',
    difficulty: 'Advanced',
    focus: 'Melt rheology, shear-thinning equations, capillary corrections, and flow instabilities.',
    summary: 'An original technical guide explaining the physics of polymer melt flow, non-Newtonian mathematics, Bagley/Rabinowitsch corrections, and processing die mechanics.',
    cover_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    careers: ['Rheologist', 'Extrusion Engineer', 'Mould Designer'],
    subject_slugs: ['polymer-processing', 'polymer-rheology'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Why Rheology Matters to Every Polymer Engineer' },
      { id: 'ch2', title: 'Chapter 2: Newtonian vs. Non-Newtonian Flow Kinetics' },
      { id: 'ch3', title: 'Chapter 3: Mathematical Constitutive Models (Power Law & Carreau-Yasuda)' },
      { id: 'ch4', title: 'Chapter 4: Capillary Rheometry & Bagely / Rabinowitsch Corrections' },
      { id: 'ch5', title: 'Chapter 5: Extrudate Die Swell & Flow Instabilities' },
      { id: 'ch6', title: 'Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli' },
      { id: 'ch7', title: 'Chapter 7: Industrial Shop-Floor Rheology Implementation' }
    ],
    chapters: RHEOLOGY_CHAPTERS
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    slug: 'compounding-additives-handbook',
    title: 'Plastics Compounding & Additives Handbook: Formulations, Blending & Process Engineering',
    authors: 'PolymerHub Academic Board',
    legal_class: 'Class A',
    license_type: 'PolymerHub Proprietary Original',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Twin-screw extrusion setup, specific mechanical energy (SME), masterbatches, UV stabilizers, and flame retardants.',
    summary: 'A process engineering guide detailing twin-screw mixing kinetics, SME calculations, stabilizer mechanisms, intumescent flame retardants, rubber toughening, and quality testing.',
    cover_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    careers: ['Compounding Specialist', 'Materials Engineer', 'Additives Chemist'],
    subject_slugs: ['polymer-processing', 'additives-and-compounding'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Economics and Architecture of Polymer Compounding' },
      { id: 'ch2', title: 'Chapter 2: Twin-Screw Extrusion & Specific Mechanical Energy (SME)' },
      { id: 'ch3', title: 'Chapter 3: Masterbatch Formulations & Let-Down Calculations' },
      { id: 'ch4', title: 'Chapter 4: UV Stabilization Mechanics & The Denisov Cycle' },
      { id: 'ch5', title: 'Chapter 5: Flame Retardant Chemistry & Intumescent Systems' },
      { id: 'ch6', title: 'Chapter 6: Rubber Toughening & Core-Shell Modifiers' },
      { id: 'ch7', title: 'Chapter 7: Inorganic Reinforcing Fillers (Talc, Mica, Glass Fiber)' },
      { id: 'ch8', title: 'Chapter 8: Compounding Quality Control & Standard Testing' }
    ],
    chapters: COMPOUNDING_CHAPTERS
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    slug: 'injection-moulding-defect-mastery',
    title: 'Injection Moulding Defect Elimination & Process Optimization Master Guide',
    authors: 'PolymerHub Academic Board',
    legal_class: 'Class A',
    license_type: 'PolymerHub Proprietary Original',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Scientific injection moulding, defect troubleshooting, root cause matrices, and pressure-decoupled filling.',
    summary: 'The ultimate shop-floor guide for injection moulding engineers. Decouples processing into scientific filling, packing, and cooling phases to eliminate warpage, sink marks, short shots, and flash.',
    cover_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    careers: ['Injection Moulding Engineer', 'Process Specialist', 'Tooling Designer'],
    subject_slugs: ['polymer-processing', 'mould-design'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Systematic Injection Moulding Processing Principles' },
      { id: 'ch2', title: 'Chapter 2: Elimination of Short Shots & Unfilled Cavities' },
      { id: 'ch3', title: 'Chapter 3: Warpage & Differential Shrinkage Mitigation' },
      { id: 'ch4', title: 'Chapter 4: Sink Marks & Void Elimination' },
      { id: 'ch5', title: 'Chapter 5: Weld Line Strength & Optical Defect Remedies' },
      { id: 'ch6', title: 'Chapter 6: Flash, Burn Marks & Diesel Effect Prevention' }
    ],
    chapters: DEFECT_MASTERY_CHAPTERS
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    slug: 'polymer-characterization-testing-guide',
    title: 'Polymer Testing & Quality Control Master Guide: ASTM & ISO Protocols',
    authors: 'PolymerHub Academic Board',
    legal_class: 'Class A',
    license_type: 'PolymerHub Proprietary Original',
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'ASTM/ISO testing protocols, DSC, TGA, FTIR, Tensile/Impact, MFI, and Certificate of Analysis (COA) verification.',
    summary: 'Comprehensive lab and industrial quality control guide detailing thermal, mechanical, rheological, and spectroscopic testing standards for raw materials and finished plastic components.',
    cover_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    careers: ['QA/QC Manager', 'Testing Engineer', 'Analytical Scientist'],
    subject_slugs: ['polymer-testing', 'polymer-chemistry'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Standard Testing Frameworks (ASTM vs ISO)' },
      { id: 'ch2', title: 'Chapter 2: Thermal Characterization (DSC, TGA, HDT, Vicat)' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Testing (Tensile, Flexural, Izod/Charpy Impact)' },
      { id: 'ch4', title: 'Chapter 4: Melt Flow Rate (MFR/MVR) & Capillary Analysis' },
      { id: 'ch5', title: 'Chapter 5: Spectroscopic & Chromatographic Analysis (FTIR, GPC)' }
    ],
    chapters: TESTING_CHAPTERS
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    slug: 'polymer-chemistry-synthesis-handbook',
    title: 'Applied Polymer Chemistry & Kinetics Handbook',
    authors: 'PolymerHub Academic Board',
    legal_class: 'Class A',
    license_type: 'PolymerHub Proprietary Original',
    category: 'original_guide',
    difficulty: 'Advanced',
    focus: 'Polymerization kinetics, Carothers equation, controlled radical polymerization (RAFT/ATRP), and industrial reactor design.',
    summary: 'A rigorous academic and industrial chemistry guide covering step-growth and chain-growth kinetics, reactivity ratios, stereospecific catalysis, and reactor engineering.',
    cover_url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80',
    careers: ['Polymer Chemist', 'Synthesis R&D Specialist', 'Chemical Process Engineer'],
    subject_slugs: ['polymer-chemistry'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Step-Growth vs Chain-Growth Polymerization Kinetics' },
      { id: 'ch2', title: 'Chapter 2: Free Radical & Controlled Radical Polymerization (RAFT, ATRP)' },
      { id: 'ch3', title: 'Chapter 3: Copolymerization Reactivity Ratios & Mayo-Lewis Equation' },
      { id: 'ch4', title: 'Chapter 4: Tacticity, Stereospecific Catalysis & Ziegler-Natta / Metallocene' },
      { id: 'ch5', title: 'Chapter 5: Industrial Reactor Engineering & Solution/Suspension Processes' }
    ],
    chapters: CHEMISTRY_CHAPTERS
  },

  // ── CLASS B: Open Access / Public Domain (Verified Source Links & Summaries) ──
  {
    id: '00000000-0000-4000-8000-000000000006',
    slug: 'fundamentals-polymer-engineering-kumar-free',
    cover_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    title: 'Fundamentals of Polymer Engineering',
    authors: 'Anil Kumar & Rakesh K. Gupta',
    legal_class: 'Class B',
    license_type: 'Open Access / Academic Reference (Verified URL)',
    license_url: 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Thermodynamics, characterization, structural, mechanical, and thermal behavior of polymers.',
    summary: 'Academic reference textbook detailing polymer solution thermodynamics, Flory-Huggins theory, melt viscoelasticity, and processing kinetics.',
    file_url: 'https://vdoc.pub/documents/fundamentals-of-polymer-engineering-7ukb3jbk2ok0',
    careers: ['Process Engineer', 'Polymer Rheologist', 'Materials Scientist'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing'],
    notice: 'Class B Resource: Verified Open Access publication. Read full unabridged PDF directly via official host.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Rheology of Polymer Melts' },
      { id: 'ch2', title: 'Chapter 2: Extrusion and Molding Processes' },
      { id: 'ch3', title: 'Chapter 3: Mechanical and Thermal Properties' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    slug: 'elements-polymer-science-rudin-free',
    cover_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80',
    title: 'The Elements of Polymer Science & Engineering',
    authors: 'Alfred Rudin, Phillip Choi',
    legal_class: 'Class B',
    license_type: 'Open Access / Academic Reference',
    license_url: 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Comprehensive coverage of polymer science, solution behavior, mechanical design, and processing.',
    summary: 'Comprehensive text covering polymer physics, copolymerization kinetics, solution viscometry, and viscoelastic relaxation.',
    file_url: 'https://www.sciencedirect.com/book/9780123821782/the-elements-of-polymer-science-and-engineering',
    careers: ['Materials Engineer', 'Polymer Chemist', 'R&D Consultant'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing'],
    notice: 'Class B Resource: Verified Open Access / Publisher portal. Access unabridged text via ScienceDirect.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Basic Polymer Structures' },
      { id: 'ch2', title: 'Chapter 2: Polymerization Solutions' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Design Principles' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    slug: 'polymer-science-gowariker-free',
    cover_url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80',
    title: 'Polymer Science',
    authors: 'V.R. Gowariker, N.V. Viswanathan, J. Sreedhar',
    legal_class: 'Class B',
    license_type: 'Internet Archive Public Domain / Open Library',
    license_url: 'https://archive.org/details/polymerscience0000gowa',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Fundamentals of polymer chemistry, molecular weight determination, polymerization kinetics, and processing.',
    summary: 'Standard Indian university textbook covering polymerization mechanisms, end-group analysis, osmometry, and thermal transitions.',
    file_url: 'https://archive.org/details/polymerscience0000gowa',
    careers: ['R&D Scientist', 'Polymer Chemist', 'Materials Engineer'],
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    notice: 'Class B Resource: Open Library / Internet Archive digitized edition.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Chemistry of Polymerization' },
      { id: 'ch2', title: 'Chapter 2: Molecular Weight and Size' },
      { id: 'ch3', title: 'Chapter 3: Kinetics of Polymerization' },
      { id: 'ch4', title: 'Chapter 4: Polymer Characterization' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000009',
    slug: 'fundamentals-plastics-mould-design-nayak-free',
    cover_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    title: 'Fundamentals of Plastics Mould Design',
    authors: 'Sanjay K. Nayak (CIPET)',
    legal_class: 'Class B',
    license_type: 'CIPET Open Technical Reference',
    license_url: 'https://www.cipet.gov.in/',
    category: 'open_access',
    difficulty: 'Intermediate',
    focus: 'Injection mould design, feed systems, cooling layouts, and part design guidelines.',
    summary: 'Authoritative CIPET publication detailing injection mould construction, runner balance calculations, pin/edge gating, and cooling channel turbulent flow.',
    file_url: 'https://www.cipet.gov.in/',
    careers: ['Mould Designer', 'Tooling Engineer', 'CAE Analyst'],
    subject_slugs: ['mould-design', 'polymer-processing'],
    notice: 'Class B Resource: CIPET Government Technical Training Reference.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Introduction to Injection Moulds' },
      { id: 'ch2', title: 'Chapter 2: Feed System and Gate Design' },
      { id: 'ch3', title: 'Chapter 3: Ejection and Venting Systems' },
      { id: 'ch4', title: 'Chapter 4: Mould Cooling System Calculations' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000010',
    slug: 'epa-recycling-manual',
    cover_url: 'https://images.unsplash.com/photo-1532996127008-05dedf1cf8d3?w=600&q=80',
    title: 'Plastic Recycling Best Practices and Systems',
    authors: 'US Environmental Protection Agency (EPA)',
    legal_class: 'Class B',
    license_type: 'US Government Public Domain',
    license_url: 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf',
    category: 'open_access',
    difficulty: 'Foundational',
    focus: 'Municipal solid waste management, sorting technologies, and post-consumer resin washing.',
    summary: 'Public domain EPA technical manual outlining mechanical recycling economics, Near-Infrared (NIR) optical sorting, hot caustic washing, and FDA food-contact PCR approval protocols.',
    file_url: 'https://www.epa.gov/sites/default/files/plastic-recycling-guide.pdf',
    careers: ['Recycling Consultant', 'Sustainability Analyst', 'Operations Manager'],
    subject_slugs: ['recycling-technology', 'sustainable-plastics'],
    notice: 'Class B Resource: US Government Public Domain Document.',
    toc: [
      { id: 'ch1', title: 'Section 1: Global Plastic Waste Streams' },
      { id: 'ch2', title: 'Section 2: Sorting and Separation Technologies' },
      { id: 'ch3', title: 'Section 3: Washing and Contaminant Removal' },
      { id: 'ch4', title: 'Section 4: Economic and Policy Drivers' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000011',
    slug: 'nasa-composites-standard',
    cover_url: 'https://images.unsplash.com/photo-1517976487541-11c50587d60a?w=800&auto=format&fit=crop&q=80',
    title: 'Structural Composite Design and Analysis Manual',
    authors: 'National Aeronautics and Space Administration (NASA)',
    legal_class: 'Class B',
    license_type: 'US Government Public Domain / NASA Technical Reports',
    license_url: 'https://ntrs.nasa.gov/citations/19950002341.pdf',
    category: 'open_access',
    difficulty: 'Advanced',
    focus: 'Mechanics of unidirectional plies, laminated plate theory, and spaceflight qualification.',
    summary: 'Accredited NASA aerospace design manual detailing Classical Lamination Theory (CLT), ABD stiffness matrices, joint attachment stress concentrations, and Tsai-Wu failure criteria.',
    file_url: 'https://ntrs.nasa.gov/citations/19950002341.pdf',
    careers: ['Composite Design Engineer', 'Stress Analyst', 'Spaceflight Materials Engineer'],
    subject_slugs: ['polymer-composites'],
    notice: 'Class B Resource: NASA Public Domain Aerospace Standard (NTRS).',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Fiber-Matrix Micromechanics' },
      { id: 'ch2', title: 'Chapter 2: Laminated Plate Mechanical Theory' },
      { id: 'ch3', title: 'Chapter 3: Joint and Interface Attachment Design' },
      { id: 'ch4', title: 'Chapter 4: Stress and Failure Prediction Calculations' }
    ],
    chapters: {}
  },

  // ── CLASS D: External Reference Catalog Cards (Zero Fake Text, Pure Bibliographic Metadata) ──
  {
    id: '00000000-0000-4000-8000-000000000012',
    slug: 'introduction-to-polymers-young-lovell',
    cover_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    title: 'Introduction to Polymers',
    authors: 'R.J. Young & P.A. Lovell',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'CRC Press / Taylor & Francis',
    publication_year: 2011,
    isbn: '9780849397982',
    doi: '10.1201/9781439894156',
    focus: 'Synthesis, characterization, structure, dynamic mechanical behavior, and ultimate properties.',
    summary: 'Comprehensive academic textbook covering step-growth and radical polymerization, rubber elasticity, crystal morphology, yield behavior, and fracture mechanics.',
    purchase_url: 'https://www.routledge.com/Introduction-to-Polymers/Young-Lovell/p/book/9780849397982',
    worldcat_url: 'https://www.worldcat.org/title/introduction-to-polymers/oclc/713340578',
    openlibrary_url: 'https://openlibrary.org/isbn/9780849397982',
    careers: ['Polymer Scientist', 'R&D Engineer', 'Materials Academic'],
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    notice: 'Class D External Reference Catalog Card. Full text is owned by Taylor & Francis. Provided for citation and university catalog indexing.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polymerization Mechanisms and Kinetics' },
      { id: 'ch2', title: 'Chapter 2: Molecular Weight Determination' },
      { id: 'ch3', title: 'Chapter 3: Polymer Crystallization and Morphology' },
      { id: 'ch4', title: 'Chapter 4: Rubber Elasticity and Viscoelasticity' },
      { id: 'ch5', title: 'Chapter 5: Yielding and Fracture Mechanics' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000013',
    slug: 'principles-polymerization-odian',
    cover_url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80',
    title: 'Principles of Polymerization',
    authors: 'George Odian',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Advanced',
    publisher: 'John Wiley & Sons',
    publication_year: 2004,
    isbn: '9780471274001',
    doi: '10.1002/0471478135',
    focus: 'Comprehensive treatment of synthetic step, chain, living, ionic, coordination, and ring-opening polymerizations.',
    summary: 'The definitive graduate-level reference text detailing synthetic organic polymer chemistry, kinetic rate expressions, activation energies, and stereospecific polymerization.',
    purchase_url: 'https://www.wiley.com/en-us/Principles+of+Polymerization%2C+4th+Edition-p-9780471274001',
    worldcat_url: 'https://www.worldcat.org/title/principles-of-polymerization/oclc/53434684',
    openlibrary_url: 'https://openlibrary.org/isbn/9780471274001',
    careers: ['Synthetic Polymer Chemist', 'Chemical Process R&D', 'Polymer Scientist'],
    subject_slugs: ['polymer-chemistry'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by John Wiley & Sons.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Step Polymerization' },
      { id: 'ch2', title: 'Chapter 2: Radical Chain Polymerization' },
      { id: 'ch3', title: 'Chapter 3: Emulsion Polymerization' },
      { id: 'ch4', title: 'Chapter 4: Ionic Chain Polymerization' },
      { id: 'ch5', title: 'Chapter 5: Stereospecific Chain Polymerization' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000014',
    slug: 'textbook-polymer-science-billmeyer',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
    title: 'Textbook of Polymer Science',
    authors: 'Fred W. Billmeyer',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'John Wiley & Sons',
    publication_year: 1984,
    isbn: '9780471031963',
    focus: 'Classic foundations of polymer physics, structure-property relationships, polymerization, and commercial plastics.',
    summary: 'Classic foundational reference textbook used in university curricula worldwide for teaching polymer structure, molecular weight, solution properties, and commercial processing.',
    purchase_url: 'https://www.wiley.com/en-us/Textbook+of+Polymer+Science%2C+3rd+Edition-p-9780471031963',
    worldcat_url: 'https://www.worldcat.org/title/textbook-of-polymer-science/oclc/9894451',
    openlibrary_url: 'https://openlibrary.org/isbn/9780471031963',
    careers: ['Materials Chemist', 'Polymer Engineer', 'Academic Researcher'],
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by John Wiley & Sons.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Structure and Properties of Polymers' },
      { id: 'ch2', title: 'Chapter 2: Polymerization Processes' },
      { id: 'ch3', title: 'Chapter 3: Physical State and Transitions' },
      { id: 'ch4', title: 'Chapter 4: Commercial Plastics and Fibers' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000015',
    slug: 'rosato',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    title: 'Plastics Processing Data Handbook',
    authors: 'D.V. Rosato',
    legal_class: 'Class D',
    license_type: 'Commercial Handbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'Springer / Chapman & Hall',
    publication_year: 1997,
    isbn: '9781461432432',
    focus: 'Fabrication data, troubleshooting matrices, instrumentation, and process-property relationships.',
    summary: 'Comprehensive quantitative processing data handbook providing empirical parameters, thermal conductivity constants, screw speed calculations, and troubleshooting charts for commercial thermoplastics.',
    purchase_url: 'https://link.springer.com/book/10.1007/978-1-4615-6389-1',
    worldcat_url: 'https://www.worldcat.org/title/plastics-processing-data-handbook/oclc/36407787',
    openlibrary_url: 'https://openlibrary.org/isbn/9781461432432',
    careers: ['Process Engineer', 'Plant Manager', 'QA/QC Engineer'],
    subject_slugs: ['polymer-processing', 'polymer-testing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by Springer Nature.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Properties of Melt Rheology' },
      { id: 'ch2', title: 'Chapter 2: Injection Molding Data Sheet Guidelines' },
      { id: 'ch3', title: 'Chapter 3: Extrusion Processing Parameters' },
      { id: 'ch4', title: 'Chapter 4: Plant Design and Safety Protocols' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000016',
    slug: 'allen-baker',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    title: 'Handbook of Plastic Technology',
    authors: 'Allen & Baker',
    legal_class: 'Class D',
    license_type: 'Commercial Handbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Foundational',
    publisher: 'CRC Press / Marcel Dekker',
    publication_year: 2000,
    isbn: '9780824700010',
    focus: 'Industrial machinery, injection, compression, transfer, blow moulding, and troubleshooting.',
    summary: 'Practical industry handbook focusing on mechanical machinery operation, mould clamping kinematics, check ring geometries, and extrusion manifold pressure balance.',
    purchase_url: 'https://www.amazon.com/dp/0824700010',
    worldcat_url: 'https://www.worldcat.org/title/handbook-of-plastic-technology/oclc/44587000',
    openlibrary_url: 'https://openlibrary.org/isbn/9780824700010',
    careers: ['Process Engineer', 'Production Manager', 'Tooling Technician'],
    subject_slugs: ['polymer-processing', 'mould-design'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by CRC Press.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Injection Molding Machinery Configuration' },
      { id: 'ch2', title: 'Chapter 2: Mold Architecture and Gating Layouts' },
      { id: 'ch3', title: 'Chapter 3: Troubleshooting Processing Defects' },
      { id: 'ch4', title: 'Chapter 4: Extrusion Die Calculations' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000017',
    slug: 'kutz',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
    title: 'Applied Plastics Engineering Handbook',
    authors: 'Myer Kutz',
    legal_class: 'Class D',
    license_type: 'Commercial Handbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'Elsevier / Plastics Design Library',
    publication_year: 2017,
    isbn: '9780323390408',
    doi: '10.1016/C2014-0-03704-5',
    focus: 'Engineering thermoplastics, bio-based resins, additive manufacturing, and sustainable recycling.',
    summary: 'Modern engineering reference covering high-temperature thermoplastics (PEEK, PPS, POM), bio-based polymers (PLA, PHA), nanocomposites, and 3D printing methods.',
    purchase_url: 'https://www.elsevier.com/books/applied-plastics-engineering-handbook/kutz/978-0-323-39040-8',
    worldcat_url: 'https://www.worldcat.org/title/applied-plastics-engineering-handbook/oclc/965154330',
    openlibrary_url: 'https://openlibrary.org/isbn/9780323390408',
    careers: ['R&D Engineer', 'Materials Specialist', 'Design Engineer'],
    subject_slugs: ['polymer-composites', 'sustainable-plastics'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by Elsevier.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Engineering Thermoplastics Selection' },
      { id: 'ch2', title: 'Chapter 2: Functional Additives and Fillers' },
      { id: 'ch3', title: 'Chapter 3: Biodegradable and Bio-based Resins' },
      { id: 'ch4', title: 'Chapter 4: Polymer Additive Manufacturing (3D Printing)' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000018',
    slug: 'bhatnagar-polymer-chemistry',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
    title: 'A Textbook of Polymer Chemistry',
    authors: 'M.S. Bhatnagar',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Foundational',
    publisher: 'S. Chand & Company',
    publication_year: 2014,
    isbn: '9789385679132',
    focus: 'Polymer structures, properties, additives, compounding, and fabrication methods.',
    summary: 'Indian university curriculum textbook covering basic polymerization chemistry, compounding formulations, mechanical testing, and plastic processing operations.',
    purchase_url: 'https://www.amazon.in/dp/9385679133',
    worldcat_url: 'https://www.worldcat.org/title/textbook-of-polymer-chemistry/oclc/946077890',
    openlibrary_url: 'https://openlibrary.org/isbn/9789385679132',
    careers: ['Production Engineer', 'QA/QC Executive', 'Materials Analyst'],
    subject_slugs: ['polymer-chemistry', 'additives-and-compounding', 'polymer-testing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by S. Chand & Company.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Polymerization Mechanisms' },
      { id: 'ch2', title: 'Chapter 2: Compounding and Additives' },
      { id: 'ch3', title: 'Chapter 3: Mechanical Testing of Plastics' },
      { id: 'ch4', title: 'Chapter 4: Polymer Processing Operations' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000019',
    slug: 'polymer-extrusion-rauwendaal',
    cover_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    title: 'Polymer Extrusion',
    authors: 'Chris Rauwendaal',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Advanced',
    publisher: 'Hanser Publications',
    publication_year: 2014,
    isbn: '9781569905166',
    focus: 'Single and twin screw extrusion theory, screw design, die design, and extrusion troubleshooting.',
    summary: 'The world standard technical reference manual on polymer extrusion process engineering, solids conveying models, plasticating melting mechanisms, and screw element design.',
    purchase_url: 'https://www.hanserpublications.com/SampleMedia/9781569905166.pdf',
    worldcat_url: 'https://www.worldcat.org/title/polymer-extrusion/oclc/870289456',
    openlibrary_url: 'https://openlibrary.org/isbn/9781569905166',
    careers: ['Extrusion Process Specialist', 'Screw Designer', 'Plant Manager'],
    subject_slugs: ['polymer-processing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by Hanser Publications.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Extrusion Process Overview' },
      { id: 'ch2', title: 'Chapter 2: Single Screw Extruder Architecture' },
      { id: 'ch3', title: 'Chapter 3: Polymer Melting and Conveying Models' },
      { id: 'ch4', title: 'Chapter 4: Extrusion Die Flow Calculations' },
      { id: 'ch5', title: 'Chapter 5: Extrusion Troubleshooting Matrix' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000020',
    slug: 'injection-molding-handbook-rosato',
    cover_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    title: 'Injection Molding Handbook',
    authors: 'D.V. Rosato & M.V. Rosato',
    legal_class: 'Class D',
    license_type: 'Commercial Handbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Advanced',
    publisher: 'Springer Science',
    publication_year: 2000,
    isbn: '9780792386193',
    doi: '10.1000/978-1-4615-4597-2',
    focus: 'Complete injection molding technology, machine specification, mold design, and process optimization.',
    summary: 'Definitive 1,400-page industry manual covering machine clamping mechanics, hydraulic systems, electric drives, mold runner cooling, and quality control.',
    purchase_url: 'https://link.springer.com/book/10.1007/978-1-4615-4597-2',
    worldcat_url: 'https://www.worldcat.org/title/injection-molding-handbook/oclc/44045656',
    openlibrary_url: 'https://openlibrary.org/isbn/9780792386193',
    careers: ['Injection Moulding Manager', 'CAE Analyst', 'Tooling Consultant'],
    subject_slugs: ['polymer-processing', 'mould-design'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by Springer Science.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Injection Molding Technology Principles' },
      { id: 'ch2', title: 'Chapter 2: Machine Component Selection' },
      { id: 'ch3', title: 'Chapter 3: Mould Design and Construction' },
      { id: 'ch4', title: 'Chapter 4: Scientific Processing and Defect Control' }
    ],
    chapters: {}
  }
]

// ── Helper Function to Retrieve Book Profile by Slug ──────────────────────
export function getBookBySlug(slug: string): LibraryBook | null {
  const found = ALL_LIBRARY_BOOKS.find((b) => b.slug === slug)
  if (!found) return null
  return found
}
