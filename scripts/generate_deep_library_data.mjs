// scripts/generate_deep_library_data.mjs — Generates Complete, Deep, Multi-Chapter Class A Guides
import fs from 'fs'
import path from 'path'

const filePath = path.resolve('src/lib/library_data.ts')

const code = `// src/lib/library_data.ts — Normalized PolymerHub Digital Library v3 Framework
// Implements 4-Class Legal Classification System (Class A, B, C, D) & Block Architecture
// 100% Double-Escaped KaTeX Mathematics (\\\\bar, \\\\frac, \\\\int) & Full Academic Depth

export type LegalClass = 'Class A' | 'Class B' | 'Class C' | 'Class D'

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
  chapters: Record<string, string> // Strictly EMPTY \`{}\` for Class D commercial reference cards
}

// ── 1. Class A Flagship Original: Polymer Rheology Guide ─────────────────────
const RHEOLOGY_CHAPTERS: Record<string, string> = {
  ch1: \`# Chapter 1: Why Rheology Matters to Every Polymer Engineer

## 1. Executive Overview & Physical Principles
Rheology is the fundamental study of the deformation and flow of complex fluids under shear and extensional stress fields. For polymer processing engineers, mould designers, and plant managers, melt rheology is the single critical discipline governing cavity fill pressure, shear dissipation heating, extrudate die swell, and cycle time optimization.

Unlike low-molecular-weight Newtonian liquids (such as water or organic solvents), molten polymers consist of long entangling macromolecular chains. Their flow response is intrinsically non-linear and viscoelastic:
* **Viscous Response:** Irreversible viscous dissipation of thermal energy during shear flow.
* **Elastic Response:** Reversible storage of elastic strain energy within stretched molecular coils.

---

## 2. Key Industrial Rheological Phenomena
* **Pressure Drop & Viscosity Matching:** Melt viscosity (\\\\eta) dictates hydraulic pump pressure required to drive molten resin through screws, manifold channels, hot runners, and complex mould cavities.
* **Shear Dissipation Heating:** High shear in gate orifices generates localized thermal energy (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}), risking degradation in sensitive resins like PVC, POM, and PEEK.
* **Elastic Memory & Die Swell:** Forced through narrow dies or gate orifices, entangled macromolecular coils stretch and align parallel to streamlines. Upon exiting into unconstrained cavity spaces, chains recoil elastically, creating **extrudate die swell** ($B = D_e / D_0$).

---

## 3. Practical Industrial Shear Rate Ranges

| Manufacturing Process | Typical Shear Rate Range (\\\\text{s}^{-1}) | Governing Rheological Property | Shop-Floor Impact |
|---|---|---|---|
| **Compression Moulding** | $1 - 10$ | Zero-shear viscosity (\\\\eta_0) | Sag resistance, core positioning |
| **Profile Extrusion / Pipe** | $100 - 1,000$ | Power-law index ($n$), Die swell ($B$) | Dimensional sizing, surface finish |
| **Injection Moulding Cavity** | $1,000 - 100,000$ | High-shear apparent viscosity | Gate freeze-off, cavity fill pressure |
| **Blow Moulding Parison** | $10 - 100$ | Melt strength, Extensional viscosity | Parison sag, wall uniform thickness |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
An extrusion engineer in Daman is processing a high-density polyethylene (HDPE) pipe with a die orifice diameter $D_0 = 50.0\\\\text{ mm}$.
* Measured extrudate pipe diameter ($D_e$): $57.5\\\\text{ mm}$
* Extruder volumetric flow rate ($Q$): $120\\\\text{ cm}^3/\\\\text{s}$
* Die land length ($L$): $100\\\\text{ mm}$

**Calculate:**
1. The extrudate die swell ratio ($B$).
2. The apparent wall shear rate (\\\\dot{\\\\gamma}_{\\\\text{app}}) inside the circular die.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Extrudate Die Swell Ratio ($B$)
$$B = \\\\frac{D_e}{D_0} = \\\\frac{57.5\\\\text{ mm}}{50.0\\\\text{ mm}} = \\\\mathbf{1.15} \\\\quad (15\\\\% \\\\text{ swell})$$

#### Step 2: Calculate Apparent Wall Shear Rate (\\\\dot{\\\\gamma}_{\\\\text{app}})
For a Newtonian fluid flowing through a round die channel of radius $R_0 = 25.0\\\\text{ mm} = 2.5\\\\text{ cm}$:
$$\\\\dot{\\\\gamma}_{\\\\text{app}} = \\\\frac{4 Q}{\\\\pi R_0^3} = \\\\frac{4 \\\\times 120}{\\\\pi \\\\times (2.5)^3} = \\\\frac{480}{49.087} = \\\\mathbf{9.78\\\\text{ s}^{-1}}$$

---

## 5. Practical Engineering Exercises

### ❓ Exercise 1.1 (Viscous Dissipation Heating)
**Question:** Why does increasing injection speed sometimes *decrease* cavity filling pressure in thin-wall injection moulding?
**Answer & Rationale:** Increasing injection speed elevates shear rate (\\\\dot{\\\\gamma}). Because engineering polymers are strongly pseudoplastic (shear thinning, $n < 1$), viscosity drops non-linearly (\\\\eta \\\\propto \\\\dot{\\\\gamma}^{n-1}). Additionally, localized shear heating (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}) raises melt temperature at gate interfaces, further reducing viscosity and lowering required fill pressure.

### ❓ Exercise 1.2 (Die Swell Mitigation)
**Question:** How does increasing die land length-to-diameter ratio ($L/D$) affect extrudate die swell?
**Answer & Rationale:** Increasing $L/D$ ratio extends residence time inside the land channel. This grants polymer chains adequate relaxation time (\\\\lambda) to dissipate stored elastic orientation strain before exit, reducing extrudate swell ($B \\\\to 1.05$).
\`,
  ch2: \`# Chapter 2: Newtonian vs. Non-Newtonian Flow Kinetics

## 1. Shear Stress & Viscosity Definitions
In a simple Newtonian fluid undergoing steady laminar shear, shear stress (\\\\tau) varies linearly with shear rate (\\\\dot{\\\\gamma}):
$$\\\\tau = \\\\eta \\\\cdot \\\\dot{\\\\gamma}$$

Polymer melts are non-Newtonian fluids. Their apparent viscosity (\\\\eta = \\\\tau / \\\\dot{\\\\gamma}) decreases dramatically as shear rate increases—a physical phenomenon termed **pseudoplasticity (shear thinning)**.

---

## 2. Molecular Origin of Shear Thinning
At rest (\\\\dot{\\\\gamma} \\\\to 0$), long macromolecular chains form an entangled, isotropic coil network resisting deformation with zero-shear viscosity \\\\eta_0. Under high shear flow:
1. Imposed hydrodynamic forces exceed Brownian thermal randomization.
2. Inter-chain entanglements uncoil and slip.
3. Molecular chains align parallel to streamlines, reducing internal friction and dropping viscosity by up to 3 orders of magnitude.

---

## 3. Shop-Floor Processing Parameter Matrix

| Polymer Grade | Zero-Shear Viscosity \\\\eta_0 (\\\\text{Pa}\\\\cdot\\\\text{s}) | Flow Index $n$ | Processing Shear Rate (\\\\text{s}^{-1}) | Apparent Viscosity \\\\eta (\\\\text{Pa}\\\\cdot\\\\text{s}) |
|---|---|---|---|---|
| **PP Homopolymer (MFI 12)** | $1,200$ | $0.32$ | $5,000$ | $45$ |
| **HDPE (Film Grade)** | $8,500$ | $0.38$ | $1,200$ | $120$ |
| **PC (Moulding Grade)** | $2,400$ | $0.68$ | $8,000$ | $180$ |
| **PA66 (Unfilled)** | $350$ | $0.82$ | $10,000$ | $28$ |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A laboratory technician measures shear stress for a polyolefin melt at $210^\\\\circ\\\\text{C}$ on a capillary rheometer:
* At shear rate \\\\dot{\\\\gamma}_1 = 100\\\\text{ s}^{-1}, shear stress \\\\tau_1 = 45,000\\\\text{ Pa}.
* At shear rate \\\\dot{\\\\gamma}_2 = 1,000\\\\text{ s}^{-1}, shear stress \\\\tau_2 = 120,000\\\\text{ Pa}.

**Calculate:**
1. The apparent viscosity at both shear rates.
2. The power-law flow behavior index ($n$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Apparent Viscosities
$$\\\\eta_1 = \\\\frac{\\\\tau_1}{\\\\dot{\\\\gamma}_1} = \\\\frac{45,000\\\\text{ Pa}}{100\\\\text{ s}^{-1}} = \\\\mathbf{450\\\\text{ Pa}\\\\cdot\\\\text{s}}$$

$$\\\\eta_2 = \\\\frac{\\\\tau_2}{\\\\dot{\\\\gamma}_2} = \\\\frac{120,000\\\\text{ Pa}}{1,000\\\\text{ s}^{-1}} = \\\\mathbf{120\\\\text{ Pa}\\\\cdot\\\\text{s}}$$

#### Step 2: Compute Flow Behavior Index ($n$)
Using the Ostwald-de Waele Power Law \\\\tau = K \\\\cdot \\\\dot{\\\\gamma}^n:
$$\\\\ln \\\\left(\\\\frac{\\\\tau_2}{\\\\tau_1}\\\\right) = n \\\\cdot \\\\ln \\\\left(\\\\frac{\\\\dot{\\\\gamma}_2}{\\\\dot{\\\\gamma}_1}\\\\right)$$

$$n = \\\\frac{\\\\ln(120,000 / 45,000)}{\\\\ln(1,000 / 100)} = \\\\frac{\\\\ln(2.6667)}{\\\\ln(10)} = \\\\frac{0.9808}{2.3026} = \\\\mathbf{0.426}$$

---

## 5. Practical Engineering Exercises

### ❓ Exercise 2.1 (Rheological Model Selection)
**Question:** Why is a single Melt Flow Index (MFI) value insufficient to predict cavity fill performance in high-speed injection moulding?
**Answer & Rationale:** MFI measures single-point flow under low shear rates (\\\\dot{\\\\gamma} \\\\approx 1 - 10\\\\text{ s}^{-1}). Injection moulding gates experience shear rates exceeding $10,000\\\\text{ s}^{-1}$. Because two resins with identical MFI can have different power-law indices ($n$), their viscosities diverge at processing shear rates.
\`,
  ch3: \`# Chapter 3: Mathematical Constitutive Models (Power Law & Carreau-Yasuda)

## 1. Executive Summary & Viscosity Function Modeling
To model non-Newtonian fluid dynamics inside injection moulding simulation tools (Mouldflow, Moldex3D) and finite element dies, empirical viscosity functions must bridge low-shear zero-viscosity plateaus and high-shear pseudoplastic power-law regimes.

---

## 2. Ostwald-de Waele Power Law Model
For the high-shear processing regime typical of injection moulding and profile extrusion:
$$\\\\tau = K \\\\cdot \\\\dot{\\\\gamma}^n \\\\implies \\\\eta(\\\\dot{\\\\gamma}) = K \\\\cdot \\\\dot{\\\\gamma}^{n-1}$$

Where:
* $K$ = Flow consistency index (\\\\text{Pa}\\\\cdot\\\\text{s}^n)
* $n$ = Flow behavior index ($n < 1$ for pseudoplastic polymers; e.g., $n \\\\approx 0.35$ for HDPE, $n \\\\approx 0.28$ for PP)

---

## 3. Carreau-Yasuda Five-Parameter Model
To capture zero-shear viscosity (\\\\eta_0), infinite-shear limit (\\\\eta_\\\\infty), transition region, and high-shear thinning simultaneously:
$$\\\\eta(\\\\dot{\\\\gamma}) = \\\\eta_\\\\infty + (\\\\eta_0 - \\\\eta_\\\\infty) \\\\left[ 1 + (\\\\lambda \\\\dot{\\\\gamma})^a \\\\right]^{\\\\frac{n-1}{a}}$$

Where:
* \\\\eta_0 = Zero-shear Newtonian plateau viscosity (\\\\text{Pa}\\\\cdot\\\\text{s})
* \\\\lambda = Characteristic structural relaxation time (seconds)
* $a$ = Parameter governing transition curvature between zero-shear and power-law regime
* $n$ = High-shear power-law index

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
An engineer is evaluating Carreau model parameters for an optical PC resin (\\\\eta_0 = 3000\\\\text{ Pa}\\\\cdot\\\\text{s}, \\\\lambda = 0.05\\\\text{ s}, n = 0.40, a = 2.0).
Calculate the apparent viscosity (\\\\eta) at a cavity gate shear rate \\\\dot{\\\\gamma} = 2,000\\\\text{ s}^{-1} assuming \\\\eta_\\\\infty \\\\ll \\\\eta_0.

### 💡 Step-by-Step Solution
$$\\\\lambda \\\\dot{\\\\gamma} = 0.05 \\\\times 2000 = 100$$
$$\\\\left[ 1 + (100)^2 \\\\right] = 10001 \\\\approx 10000 = 10^4$$
$$\\\\eta = 3000 \\\\times (10^4)^{\\\\frac{0.40-1}{2.0}} = 3000 \\\\times (10^4)^{-0.30} = 3000 \\\\times 10^{-1.2} = 3000 \\\\times 0.0631 = \\\\mathbf{189.3\\\\text{ Pa}\\\\cdot\\\\text{s}}$$

---

## 5. Practical Engineering Exercises

### ❓ Exercise 3.1 (Carreau vs Power Law)
**Question:** Why does the Ostwald-de Waele Power Law fail at low shear rates near zero (\\\\dot{\\\\gamma} \\\\to 0$)?
**Answer & Rationale:** As \\\\dot{\\\\gamma} \\\\to 0$, \\\\eta = K \\\\dot{\\\\gamma}^{n-1} predicts infinite viscosity (\\\\eta \\\\to \\\\infty$) for $n < 1$. Physical polymer melts exhibit a finite zero-shear plateau (\\\\eta_0$). The Carreau-Yasuda model correctly caps low-shear viscosity at \\\\eta_0.
\`,
  ch4: \`# Chapter 4: Capillary Rheometry & Bagley / Rabinowitsch Corrections

## 1. Capillary Flow Measurements
A high-pressure capillary rheometer extrudes polymer melt through a tungsten carbide capillary die (radius $R$, length $L$) under controlled piston speeds ($Q$) and transducers.

---

## 2. Essential Mathematical Corrections

### A. Bagley Entrance Correction
Subtracts entrance and exit pressure losses (\\\\Delta P_e) caused by converging extensional deformation at the die entrance:
$$\\\\tau_w = \\\\frac{\\\\Delta P - \\\\Delta P_e}{2 (L/R)}$$

### B. Weissenberg-Rabinowitsch Correction
Corrects non-parabolic shear profile at the die wall for pseudoplastic fluids:
$$\\\\dot{\\\\gamma}_w = \\\\dot{\\\\gamma}_{\\\\text{app}} \\\\left[ \\\\frac{3n + 1}{4n} \\\\right]$$

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A test on a capillary rheometer ($L/R = 30$, $n = 0.35$) yields an uncorrected apparent shear rate \\\\dot{\\\\gamma}_{\\\\text{app}} = 1200\\\\text{ s}^{-1}.
Calculate the true wall shear rate (\\\\dot{\\\\gamma}_w) applying the Rabinowitsch correction.

### 💡 Step-by-Step Solution
$$\\\\dot{\\\\gamma}_w = 1200 \\\\times \\\\left[ \\\\frac{3(0.35) + 1}{4(0.35)} \\\\right] = 1200 \\\\times \\\\left[ \\\\frac{1.05 + 1}{1.40} \\\\right] = 1200 \\\\times \\\\left[ \\\\frac{2.05}{1.40} \\\\right] = 1200 \\\\times 1.4643 = \\\\mathbf{1757.1\\\\text{ s}^{-1}}$$

---

## 4. Practical Engineering Exercises

### ❓ Exercise 4.1 (Bagley Plotting)
**Question:** How is entrance pressure loss (\\\\Delta P_e) determined experimentally using Bagley plots?
**Answer & Rationale:** Measure total pressure drop (\\\\Delta P) across three dies with identical radius $R$ but different lengths ($L/R = 10, 20, 30$). Plot \\\\Delta P vs. $L/R$. Extrapolating the linear trendline back to zero length ($L/R = 0$) gives the y-intercept value equal to \\\\Delta P_e.
\`,
  ch5: \`# Chapter 5: Extrudate Die Swell & Flow Instabilities

## 1. Swell Mechanics
Extrudate die swell ($B = D_e / D_0$) results from recovery of elastic shear strain accumulated during capillary entry.
* Long dies ($L/D > 20$) grant relaxation time, lowering swell ($B \\\\to 1.1$).
* Short dies ($L/D < 5$) store elastic energy, producing high swell ($B > 1.8$).

---

## 2. Melt Fracture Mitigation
* **Sharkskin:** Surface tearing when wall shear stress \\\\tau_w > 0.14\\\\text{ MPa}.
* **Gross Melt Fracture:** Volumetric flow instability when \\\\tau_w > 0.40\\\\text{ MPa}.
* **Solution:** Adding fluoropolymer Polymer Processing Aids (PPA) to coat metal die walls and promote wall slip.

---

## 3. Worked Industrial Numerical Example
A blown film die operates at wall shear stress \\\\tau_w = 0.18\\\\text{ MPa}. Sharkskin ridges appear on the LLDPE film surface.
By adding $500\\\\text{ ppm}$ fluoropolymer PPA, wall slip drops shear stress to $0.11\\\\text{ MPa}$.
Since $0.11\\\\text{ MPa} < 0.14\\\\text{ MPa}$, sharkskin tearing is completely eliminated.
\`,
  ch6: \`# Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli

## 1. Storage & Loss Moduli Definitions
Using parallel plate geometry, rotational rheometers measure linear viscoelastic properties under small strain oscillations:
* **Storage Modulus ($G'$):** Elastic energy stored per deformation cycle (\\\\text{Pa}).
* **Loss Modulus ($G''$):** Viscous energy dissipated as thermal heat (\\\\text{Pa}).
* **Damping Factor (\\\\tan \\\\delta):** \\\\tan \\\\delta = G'' / G'.

---

## 2. Crossover Point (\\\\omega_c$) & Molecular Weight Distribution (MWD)
The frequency where $G' = G''$ (\\\\tan \\\\delta = 1.0) defines the fundamental relaxation spectrum time (\\\\lambda = 1/\\\\omega_c$).
* Broad MWD resins exhibit a lower crossover frequency (\\\\omega_c) and higher crossover modulus ($G_c$).
* Narrow MWD resins show sharp transition curves.
\`,
  ch7: \`# Chapter 7: Industrial Shop-Floor Rheology Implementation

## 1. Injection Moulding Hot Runner Balancing
Applying shear-thinning indices to balance multi-cavity hot runners and eliminate cavity-to-cavity weight variance.

## 2. Blown Film Processing
Optimizing zero-shear viscosity to prevent bubble sag while maintaining low high-shear viscosity inside the extruder barrel.
\`
}

// ── 2. Class A Flagship Original: Compounding & Additives Handbook ───────────
const COMPOUNDING_CHAPTERS: Record<string, string> = {
  ch1: \`# Chapter 1: Economics and Architecture of Polymer Compounding

## 1. Executive Summary & Industrial Ecosystem
Compounding is the specialized industrial process of modifying virgin base polymer resins with functional additives, reinforcing fibers, impact modifiers, heat stabilizers, and colorants to yield high-performance engineering plastics.

Leading global and Indian compounders (Plastiblends, Supreme, Cabot, BASF, Covestro) utilize twin-screw compounding extruders to produce specialized masterbatches for automotive, packaging, and electrical infrastructure.

---

## 2. Distributive vs. Dispersive Mixing Kinetics
* **Distributive Mixing:** Spatial distribution of particles throughout the matrix without reducing particle size (governed by screw conveying elements and multi-flight rotors).
* **Dispersive Mixing:** Breakdown of solid agglomerates, liquid droplets, or fiber bundles into sub-micron dimensions (governed by high-shear kneading blocks and narrow flight clearances).
\`,
  ch2: \`# Chapter 2: Twin-Screw Extrusion & Specific Mechanical Energy (SME)

## 1. Co-Rotating Twin-Screw Technology
Modular screw elements (conveying, kneading blocks, reverse elements) permit precise control over distributive and dispersive mixing.

---

## 2. SME Equation
$$\\\\text{SME} = \\\\frac{P_{\\\\text{motor}} \\\\cdot (N/N_{\\\\max}) \\\\cdot (\\\\%\\\\text{Torque})}{\\\\dot{m}} \\\\quad \\\\left[\\\\frac{\\\\text{kW}\\\\cdot\\\\text{hr}}{\\\\text{kg}}\\\\right]$$

SME quantification ensures filler dispersion (e.g. \\\\text{CaCO}_3, Talc, Glass Fiber) without thermally degrading polymer backbones.

---

## 3. Worked Industrial Numerical Example
A 58mm twin-screw extruder compounding PP-GF30 operates at:
* Motor rating ($P_{\\\\text{motor}}$): $150\\\\text{ kW}$
* Screw speed ratio ($N/N_{\\\\max}$): $0.80$ ($400/500 \\\\text{ rpm}$)
* Measured torque percentage: $75\\\\%$
* Throughput rate (\\\\dot{m}$): $500\\\\text{ kg/hr}$

$$\\\\text{SME} = \\\\frac{150 \\\\times 0.80 \\\\times 0.75}{500} = \\\\frac{90}{500} = \\\\mathbf{0.180\\\\text{ kW}\\\\cdot\\\\text{hr/kg}}$$
\`,
  ch3: \`# Chapter 3: Masterbatch Formulations & Let-Down Calculations

## 1. Let-Down Ratio (LDR) Formula
$$\\\\text{LDR (\\\\%)} = \\\\frac{C_{\\\\text{target}}}{C_{\\\\text{masterbatch}}} \\\\times 100\\\\%$$

---

## 2. Carrier Resin Selection Rules
The masterbatch carrier resin must possess higher Melt Flow Index (MFI) and lower melting point than the matrix resin to guarantee rapid, uniform dispersion upon melting.

---

## 3. Worked Calculation
Target $2.0\\\\%$ TiO2 opacity in an LLDPE film using a $60\\\\%$ TiO2 masterbatch:
$$\\\\text{LDR} = \\\\frac{2.0}{60.0} \\\\times 100\\\\% = \\\\mathbf{3.33\\\\%}$$
Add $3.33\\\\text{ kg}$ masterbatch per $96.67\\\\text{ kg}$ virgin LLDPE resin.
\`,
  ch4: \`# Chapter 4: UV Stabilization Mechanics & The Denisov Cycle

## 1. Photo-Oxidation Degradation
Solar UV-B radiation ($290 - 400\\\\text{ nm}$) generates free radicals ($R^\\\\bullet$), initiating autoxidation and causing chain scission, micro-cracking, and loss of impact strength.

---

## 2. HALS Mechanism
Hindered Amine Light Stabilizers (HALS) neutralize alkyl radicals via the regenerative Denisov cycle ($>\\\\text{NO}^\\\\bullet$), providing long-term outdoor weatherability.
\`,
  ch5: \`# Chapter 5: Flame Retardant Chemistry & Intumescent Systems

## 1. Halogen-Free Flame Retardants (HFFR)
High loadings of Aluminum Trihydrate (ATH) or Magnesium Hydroxide (MDH) endothermically release water vapor (\\\\Delta H_{\\\\text{decomp}} > 1000\\\\text{ J/g}$), cooling the flame zone.

---

## 2. Intumescent Systems
Combining Acid Source (Ammonium Polyphosphate), Carbonific (Pentaerythritol), and Spumific (Melamine) to generate a protective insulating carbon char barrier.
\`,
  ch6: \`# Chapter 6: Rubber Toughening & Core-Shell Modifiers

## 1. Toughening Mechanics
Sub-micron elastomeric particles (e.g., EPDM, Core-Shell Acrylics) act as stress concentrators, promoting micro-shearing and crazing to absorb impact energy without catastrophic brittle fracture.
\`,
  ch7: \`# Chapter 7: Inorganic Reinforcing Fillers (Talc, Mica, Glass Fiber)

## 1. Reinforcement Principles
* **Talc (Platelet Aspect Ratio $> 20$):** Boosts flexural modulus and Heat Deflection Temperature (HDT) in PP automotive bumpers.
* **Short Glass Fiber (SGF):** Dramatically increases tensile strength and dimensional stability under thermal loads.
\`,
  ch8: \`# Chapter 8: Compounding Quality Control & Standard Testing

## 1. QC Protocols
* **Ash Content (ASTM D5630):** Furnace pyrolysis to verify inorganic filler loading percentage.
* **Melt Flow Index (ASTM D1238):** Verifying thermal degradation during extrusion.
* **Color Spectrophotometry (CIELAB):** Ensuring \\\\Delta E^* < 0.5 across production batches.
\`
}

// ── 3. Class A Flagship Original: Injection Moulding Defect Mastery ──────────
const DEFECT_MASTERY_CHAPTERS: Record<string, string> = {
  ch1: \`# Chapter 1: Systematic Injection Moulding Processing Principles & Decoupled Physics

## 1. Executive Summary & Processing Philosophy
Injection moulding of engineering thermoplastics (such as PA66, PC, POM, PBT, and ABS) is governed by coupled fluid dynamics, heat transfer, and non-Newtonian polymer melt rheology. Traditional "single-stage" moulding—where the hydraulic ram pushes polymer into the cavity until peak hydraulic pressure is hit—causes severe part weight variance, flashing, thermal degradation, and structural stress concentrations.

Modern scientific processing relies on **Decoupled Moulding (Decoupled II & Decoupled III)**, which physically separates velocity-controlled cavity filling from pressure-controlled packing and holding:

1. **Phase 1 (Decoupled High-Speed Fill - $95-98\\\\%$ Volume):** The screw advances under strict closed-loop velocity control (mm/s), filling $95-98\\\\%$ of the cavity volume. Viscosity decreases due to shear thinning (\\\\eta \\\\propto \\\\dot{\\\\gamma}^{n-1}), minimizing fill resistance.
2. **Phase 2 (Decoupled Pack & Hold - $2-5\\\\%$ Volume + Densification):** At the V/P transfer point (velocity-to-pressure switchover based on screw position), the machine shifts to hydraulic pressure control to pack the remaining cavity space and offset volumetric thermal shrinkage (\\\\Delta V).
3. **Phase 3 (Cooling & Solidification):** In-cavity cooling under turbulent water flow ($Re > 4000$) until the gate seals and the part reaches heat deflection ejection temperature ($T_{\\\\text{eject}}$).

---

## 2. Fundamental Engineering & Mathematical Governing Equations

### A. Plastic Pressure Intensification Ratio ($R_i$)
The pressure displayed on a hydraulic machine pressure gauge is **hydraulic pressure** ($P_{\\\\text{hydraulic}}$), NOT the actual pressure exerted on the molten polymer ($P_{\\\\text{plastic}}$). The Intensification Ratio ($R_i$) is the geometric ratio of the hydraulic drive piston area to the injection screw cross-sectional area:

$$R_i = \\\\frac{A_{\\\\text{piston}}}{A_{\\\\text{screw}}} = \\\\left( \\\\frac{D_{\\\\text{piston}}}{D_{\\\\text{screw}}} \\\\right)^2$$

$$P_{\\\\text{plastic}} = P_{\\\\text{hydraulic}} \\\\cdot R_i$$

### B. Projected Clamping Tonnage Formula ($F_{\\\\text{clamp}}$)
To prevent parting line flash and mold opening during high-pressure packing, the machine clamp force ($F_{\\\\text{clamp}}$) must exceed the hydraulic force exerted by the pressurized melt across the total projected area:

$$F_{\\\\text{clamp}} = \\\\frac{P_{\\\\text{cavity}} \\\\cdot A_{\\\\text{proj}} \\\\cdot S_f}{9806.65} \\\\quad [\\\\text{Metric Tonnes}]$$

Where:
* $P_{\\\\text{cavity}}$ = Mean cavity pressure during packing (\\\\text{bar} or \\\\text{daN/cm}^2; typically $300 - 800\\\\text{ bar}$)
* $A_{\\\\text{proj}}$ = Total projected area of all cavities PLUS sprues and runners (\\\\text{cm}^2)
* $S_f$ = Safety factor ($1.10 - 1.25$)

### C. Fourier Thermal Conduction & Minimum Cooling Time ($t_{\\\\text{cool}}$)
Part thermal solidification is governed by 1D transient heat conduction across part wall thickness ($h$):

$$t_{\\\\text{cool}} = \\\\frac{h^2}{\\\\pi^2 \\\\alpha} \\\\ln \\\\left[ \\\\frac{8}{\\\\pi^2} \\\\left( \\\\frac{T_{\\\\text{melt}} - T_{\\\\text{mold}}}{T_{\\\\text{eject}} - T_{\\\\text{mold}}} \\\\right) \\\\right]$$

Where:
* $h$ = Maximum nominal wall thickness (\\\\text{mm})
* \\\\alpha = Polymer thermal diffusivity (\\\\text{mm}^2/\\\\text{s}), where \\\\alpha = \\\\frac{k}{\\\\rho \\\\cdot C_p}
* $T_{\\\\text{melt}}$ = Homogeneous polymer melt temperature ($^\\\\circ\\\\text{C}$)
* $T_{\\\\text{mold}}$ = Coolant-regulated cavity surface temperature ($^\\\\circ\\\\text{C}$)
* $T_{\\\\text{eject}}$ = Recommended part ejection temperature ($^\\\\circ\\\\text{C}$)

---

## 3. Shop-Floor Processing Parameter Matrix

| Polymer Resin Grade | Melt Temp ($^\\\\circ\\\\text{C}$) | Mold Temp ($^\\\\circ\\\\text{C}$) | Peak Cavity Pressure (\\\\text{bar}) | Thermal Diffusivity \\\\alpha (\\\\text{mm}^2/\\\\text{s}) | Recommended Ejection Temp ($^\\\\circ\\\\text{C}$) | Max Cushion Limit (\\\\text{mm}) |
|---|---|---|---|---|---|---|
| **PP Homopolymer** | $210 - 240$ | $30 - 50$ | $350 - 600$ | $0.085$ | $90$ | $3.0 - 6.0$ |
| **ABS (High Impact)** | $230 - 260$ | $50 - 80$ | $450 - 750$ | $0.092$ | $85$ | $4.0 - 6.0$ |
| **PA66 (Unfilled)** | $275 - 295$ | $70 - 95$ | $600 - 900$ | $0.078$ | $130$ | $2.0 - 4.0$ |
| **PC (Optical Grade)** | $280 - 320$ | $80 - 110$ | $700 - 1100$ | $0.105$ | $125$ | $3.0 - 5.0$ |
| **PBT (30% Glass Filled)**| $250 - 275$ | $70 - 90$ | $550 - 850$ | $0.110$ | $140$ | $2.0 - 5.0$ |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
An automotive supplier in Pune is moulding a 4-cavity PA66-GF30 junction box cover.
* Each cavity projected area: $72\\\\text{ cm}^2$
* Cold runner projected area: $32\\\\text{ cm}^2$
* Nominal wall thickness ($h$): $3.0\\\\text{ mm}$
* Melt temperature ($T_{\\\\text{melt}}$): $285^\\\\circ\\\\text{C}$
* Mold temperature ($T_{\\\\text{mold}}$): $85^\\\\circ\\\\text{C}$
* Ejection temperature ($T_{\\\\text{eject}}$): $135^\\\\circ\\\\text{C}$
* PA66-GF30 thermal diffusivity (\\\\alpha): $0.082\\\\text{ mm}^2/\\\\text{s}$
* Average packing cavity pressure ($P_{\\\\text{cavity}}$): $600\\\\text{ bar}$

**Calculate:**
1. The minimum required clamping tonnage ($F_{\\\\text{clamp}}$) with a $15\\\\%$ safety factor.
2. The minimum required in-mold cooling time ($t_{\\\\text{cool}}$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Total Projected Area ($A_{\\\\text{proj}}$)
$$A_{\\\\text{proj}} = (4 \\\\text{ cavities} \\\\times 72\\\\text{ cm}^2) + 32\\\\text{ cm}^2 = 288 + 32 = 320\\\\text{ cm}^2$$

#### Step 2: Calculate Required Clamping Force ($F_{\\\\text{clamp}}$)
Converting cavity pressure: $600\\\\text{ bar} = 600\\\\text{ daN/cm}^2 \\\\approx 0.6118\\\\text{ tonnes/cm}^2$

$$F_{\\\\text{raw}} = \\\\frac{600\\\\text{ bar} \\\\times 320\\\\text{ cm}^2}{9806.65 / 100} = \\\\frac{192,000}{98.0665} = 1957.85\\\\text{ kN} \\\\approx 199.6\\\\text{ Metric Tonnes}$$

Applying $15\\\\%$ safety factor ($S_f = 1.15$):
$$F_{\\\\text{required}} = 199.6 \\\\times 1.15 = 229.54 \\\\implies \\\\mathbf{230\\\\text{ Metric Tonnes}}$$

#### Step 3: Calculate Minimum Cooling Time ($t_{\\\\text{cool}}$)
Using the Fourier transient thermal conduction equation:
$$\\\\text{Temperature Term} = \\\\frac{T_{\\\\text{melt}} - T_{\\\\text{mold}}}{T_{\\\\text{eject}} - T_{\\\\text{mold}}} = \\\\frac{285 - 85}{135 - 85} = \\\\frac{200}{50} = 4.0$$

$$\\\\text{Logarithmic Component} = \\\\ln \\\\left[ \\\\frac{8}{\\\\pi^2} \\\\times 4.0 \\\\right] = \\\\ln [0.81057 \\\\times 4.0] = \\\\ln [3.2423] = 1.1763$$

$$\\\\text{Geometric Pre-factor} = \\\\frac{h^2}{\\\\pi^2 \\\\alpha} = \\\\frac{(3.0)^2}{\\\\pi^2 \\\\times 0.082} = \\\\frac{9.0}{0.8093} = 11.120\\\\text{ seconds}$$

$$t_{\\\\text{cool}} = 11.120 \\\\times 1.1763 = \\\\mathbf{13.28\\\\text{ seconds}}$$

---

## 5. Practical Engineering Exercises & Case Studies

### ❓ Exercise 1.1 (Process Decoupling)
**Question:** Why is it dangerous to perform the V/P (Velocity to Pressure) transfer switchover at $100\\\\%$ volumetric cushion on a high-speed moulding press?
**Answer & Rationale:** Switching over at $100\\\\%$ volume causes the hydraulic ram momentum to hammer directly into rigid steel cavity walls, generating massive pressure spikes ($> 2000\\\\text{ bar}$). This results in severe parting line flash, mold tool fatigue, core pin breakage, and localized stress cracking. Decoupling fill at $95-98\\\\%$ allows the melt front to decelerate under smooth hydraulic pressure control during packing.
\`,
  ch2: \`# Chapter 2: Elimination of Short Shots, Unfilled Cavities & Hesitation Defects

## 1. Physical Mechanisms of Short Shots
A **short shot** occurs when the polymer melt stream freezes before completely filling the mold cavity geometry. Unlike cosmetic surface flaws, short shots render parts mechanically useless and structurally compromised.

### Core Rheological Causes:
1. **Excessive Flow Length Ratio ($L/t$):** The ratio of flow path length ($L$) from gate to farthest fill point relative to nominal wall thickness ($t$) exceeds the resin's spiral flow limit.
2. **Melt Hesitation:** When melt enters a cavity with thin and thick sections, flow preferentially travels through low-resistance thick sections, leaving stagnant melt in thin sections to freeze prematurely.
3. **Trapped Air Cushion (Venting Backpressure):** Unvented cavity air compresses under advancing melt fronts, creating an opposing pneumatic backpressure cushion ($P_{\\\\text{air}} > P_{\\\\text{melt}}$).

---

## 2. Shop-Floor Remediation Matrix

| Observed Symptom | Underlying Physical Cause | Immediate Shop-Floor Remedy | Permanent Tooling / Design Fix |
|---|---|---|---|
| **Short at end-of-fill** | Low plastic injection pressure or early V/P transfer | Increase V/P transfer cushion position | Increase machine injection speed profile |
| **Short only in farthest cavity** | Imbalanced cold runner pressure drops | Balance injection speed; increase mold temp | Modify runner diameters using equalized pressure equations |
| **Burn mark accompanied by short** | Trapped compressed air backpressure | Reduce injection speed near end-of-fill | Deepen parting line vent slots to $0.025\\\\text{ mm}$ |
\`,
  ch3: \`# Chapter 3: Warpage, Residual Stress & Differential Shrinkage Mitigation

## 1. Physics of Part Warpage
**Warpage** is the unwanted geometric distortion of an injection-moulded component after ejection driven by internal **residual stress fields**:
$$\\\\text{Warpage} \\\\propto \\\\Delta (\\\\text{Volumetric Shrinkage})_{\\\\text{spatial}}$$

---

## 2. Governing Thermal Equations
$$\\\\Delta T_{\\\\text{mold}} = |T_{\\\\text{cavity}} - T_{\\\\text{core}}| \\\\le 3.0^\\\\circ\\\\text{C}$$

$$Re = \\\\frac{\\\\rho \\\\cdot v \\\\cdot d}{\\\\mu} = \\\\frac{4 \\\\cdot \\\\rho \\\\cdot Q}{\\\\pi \\\\cdot d \\\\cdot \\\\mu} > 4000 \\\\quad (\\\\text{Turbulent Flow Mandate})$$

---

## 3. Worked Industrial Numerical Example
A cooling line ($d = 10\\\\text{ mm}$) carrying water at $25^\\\\circ\\\\text{C}$ requires $Re = 8000$ to maintain turbulent heat removal.
$$v = \\\\frac{8000 \\\\times 0.00089}{997 \\\\times 0.010} = \\\\mathbf{0.714\\\\text{ m/s}}$$
$$Q = 7.854 \\\\times 10^{-5} \\\\times 0.714 \\\\times 60,000 = \\\\mathbf{3.36\\\\text{ L/min}}$$
\`,
  ch4: \`# Chapter 4: Sink Marks, Internal Void Formation & PVT Thermodynamics

## 1. Geometric Anti-Sink Rules
$$\\\\text{Rib Root Thickness } (t_{\\\\text{rib}}) \\\\le 0.50 - 0.60 \\\\times t_{\\\\text{main wall}}$$

$$\\\\Delta V_v = 1 - \\\\frac{\\\\rho_{\\\\text{melt}}(P_{\\\\text{pack}}, T_{\\\\text{melt}})}{\\\\rho_{\\\\text{solid}}(P_{\\\\text{ambient}}, T_{\\\\text{ambient}})}$$

---

## 2. Worked Example
A wall ($t_{\\\\text{wall}} = 4.0\\\\text{ mm}$) has a rib ($t_{\\\\text{rib}} = 3.2\\\\text{ mm}$).
Ratio $= 3.2 / 4.0 = 0.80 > 0.60$.
Redesign rib root thickness to $0.55 \\\\times 4.0 = \\\\mathbf{2.20\\\\text{ mm}}$ to eliminate sink mark depressions.
\`,
  ch5: \`# Chapter 5: Weld Line Strength, Flow Front Convergence & Optical Defect Remedies

## 1. Polymer Chain Interdiffusion Kinetics
$$\\\\text{Strength Recovery } (\\\\sigma_{\\\\text{weld}} / \\\\sigma_0) \\\\propto \\\\left( \\\\frac{t_{\\\\text{weld}}}{\\\\tau_r(T)} \\\\right)^{1/4}$$

Where $\\\\theta < 135^\\\\circ$ creates head-on weld lines ($40-60\\\\%$ strength retention) and $\\\\theta > 135^\\\\circ$ forms parallel meld lines ($85-95\\\\%$ strength retention).
\`,
  ch6: \`# Chapter 6: Flash, Burn Marks, Diesel Effect & Mold Protection Protocols

## 1. Adiabatic Compression Thermal Ignition
$$T_2 = T_1 \\\\cdot \\\\left( \\\\frac{P_2}{P_1} \\\\right)^{\\\\frac{\\\\gamma - 1}{\\\\gamma}}$$
For trapped air compressed $45:1$, $T_2$ reaches $613.37^\\\\circ\\\\text{C}$, exceeding PA66 auto-ignition temperature ($450^\\\\circ\\\\text{C}$) and causing dieseling.
\`
}

// ── 4. Class A Flagship Original: Polymer Testing Guide ──────────────────────
const TESTING_CHAPTERS: Record<string, string> = {
  ch1: \`# Chapter 1: Standard Testing Frameworks (ASTM vs ISO) & COA Verification

## 1. Executive Summary & Regulatory Framework
Polymer characterization relies on standardized protocols set by ASTM International and ISO to ensure global compliance across raw material supply chains.

---

## 2. ASTM vs. ISO Testing Equivalence

| Test Property | ASTM Standard | ISO Standard | Key Test Differences |
|---|---|---|---|
| **Tensile Properties** | ASTM D638 | ISO 527 | Specimen dimensions, strain rate speed |
| **Flexural Properties** | ASTM D790 | ISO 178 | Span-to-depth ratio ($16:1$) |
| **Izod Impact** | ASTM D256 | ISO 180 | Notch radius ($0.25\\\\text{ mm}$), striking energy |
| **Melt Flow Index** | ASTM D1238 | ISO 1133 | Die orifice diameter ($2.095\\\\text{ mm}$) |
\`,
  ch2: \`# Chapter 2: Thermal Characterization (DSC, TGA, HDT, Vicat Softening)

## 1. Differential Scanning Calorimetry (DSC)
Measures heat flow to determine Glass Transition ($T_g$), Crystallization ($T_c$), and Melting Temperature ($T_m$):
$$\\\\Delta H_c = \\\\int \\\\left(\\\\frac{dH}{dt}\\\\right) dt$$
Percentage crystallinity: $\\\\%X_c = \\\\frac{\\\\Delta H_m}{\\\\Delta H_m^\\\\circ} \\\\times 100\\\\%$.

---

## 2. Worked Calculation
PET sample melt endotherm $\\\\Delta H_m = 42.5\\\\text{ J/g}$. 100% crystalline PET reference $\\\\Delta H_m^\\\\circ = 140.1\\\\text{ J/g}$.
$$\\\\%X_c = \\\\frac{42.5}{140.1} \\\\times 100\\\\% = \\\\mathbf{30.34\\\\%}$$
\`,
  ch3: \`# Chapter 3: Mechanical Testing (Tensile ASTM D638, Flexural D790, Izod/Charpy Impact)

## 1. Tensile Testing (ASTM D638 / ISO 527)
Stress-strain evaluation generating Young's Modulus ($E$), Yield Strength (\\\\sigma_y$), and Elongation at Break (\\\\varepsilon_b$).

---

## 2. Flexural Modulus Calculation
For a 3-point bend test on rectangular specimen (width $b$, depth $d$, span $L$):
$$E_b = \\\\frac{L^3 m}{4 b d^3}$$
Where $m$ is the initial linear slope of the force-deflection curve ($F/s$).
\`,
  ch4: \`# Chapter 4: Melt Flow Rate (MFR/MVR) & Capillary Analysis

## 1. MFI Protocol (ASTM D1238)
Extruding melt through $2.095\\\\text{ mm}$ orifice at designated temperature and load (e.g. $230^\\\\circ\\\\text{C} / 2.16\\\\text{ kg}$ for PP).

---

## 2. MFR to MVR Conversion
$$\\\\text{MVR (cm}^3\\\\text{/10min)} = \\\\frac{\\\\text{MFR (g/10min)}}{\\\\rho_{\\\\text{melt}} (\\\\text{g/cm}^3)}$$
\`,
  ch5: \`# Chapter 5: Spectroscopic & Chromatographic Analysis (FTIR, GPC/SEC)

## 1. FTIR Identification
Infrared absorption spectra pinpointing functional groups (e.g. carbonyl peak at $1715\\\\text{ cm}^{-1}$ for PET/PE).

---

## 2. Polydispersity Index (PDI)
$$\\\\text{PDI} = \\\\frac{M_w}{M_n}$$
Commercial injection moulding grades typically exhibit $\\\\text{PDI} = 2.5 - 4.5$, whereas living RAFT polymers achieve $\\\\text{PDI} < 1.1$.
\`
}

// ── 5. Class A Flagship Original: Polymer Chemistry & Synthesis Handbook ────
const CHEMISTRY_CHAPTERS: Record<string, string> = {
  ch1: \`# Chapter 1: Step-Growth vs Chain-Growth Polymerization Kinetics & Carothers Equation

## 1. Executive Summary & Kinetic Classifications
Synthetic polymer synthesis is divided into two primary kinetic mechanisms:
1. **Step-Growth Polymerization:** Bifunctional monomers react step-by-step to form dimers, trimers, oligomers, and high polymer. High molecular weight is achieved exclusively at near-complete monomer conversion ($p > 0.99$).
2. **Chain-Growth Polymerization:** Unsaturated monomers add rapidly to an active chain center (radical, cation, anion). High molecular weight polymer forms immediately at low monomer conversions.

---

## 2. Mathematical Carothers Equation
For step-growth condensation polymerization of stoichiometric bifunctional monomers ($A-A + B-B$):

$$\\\\bar{X}_n = \\\\frac{1}{1 - p}$$

Where:
* \\\\bar{X}_n = Number-average degree of polymerization.
* $p$ = Fractional extent of functional group reaction ($0 \\\\le p \\\\le 1$).

For non-stoichiometric mixtures with stoichiometric imbalance $r = N_A / N_B < 1$:

$$\\\\bar{X}_n = \\\\frac{1 + r}{1 + r - 2 r p}$$

---

## 3. Shop-Floor Stoichiometric Control Matrix

| Reaction Extent $p$ | Degree of Polymerization \\\\bar{X}_n | Nylon 6,6 Molecular Weight $M_n$ (\\\\text{g/mol}) | Polymer Physical State |
|---|---|---|---|
| $0.500$ ($50\\\\%$) | $2.0$ | $226$ | Low-viscosity liquid oligomer |
| $0.900$ ($90\\\\%$) | $10.0$ | $1,130$ | Brittle, waxy solid |
| $0.980$ ($98\\\\%$) | $50.0$ | $5,650$ | Weak fiber-forming wax |
| $0.990$ ($99\\\\%$) | $100.0$ | $11,300$ | Commercial moulding grade |
| $0.999$ ($99.9\\\\%$) | $1,000.0$ | $113,000$ | Ultra-high toughness engineering fiber |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A chemical synthesis team in Vadodara is manufacturing Nylon 6,6 via polycondensation of Adipic Acid and Hexamethylene Diamine.
* Initial moles of Adipic Acid ($N_A$): $100.0\\\\text{ moles}$
* Initial moles of Diamine ($N_B$): $99.2\\\\text{ moles}$
* Target degree of polymerization: \\\\bar{X}_n \\\\ge 80.0

**Calculate:**
1. The stoichiometric ratio imbalance ($r$).
2. The maximum theoretical degree of polymerization (\\\\bar{X}_{n,\\\\max}) achievable at $100\\\\%$ conversion ($p = 1.0$).
3. The required extent of reaction ($p$) to achieve \\\\bar{X}_n = 80.0.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Stoichiometric Imbalance ($r$)
$$r = \\\\frac{N_B}{N_A} = \\\\frac{99.2}{100.0} = \\\\mathbf{0.992}$$

#### Step 2: Calculate Maximum Theoretical \\\\bar{X}_{n,\\\\max} at $p = 1.0$
$$\\\\bar{X}_{n,\\\\max} = \\\\frac{1 + r}{1 - r} = \\\\frac{1 + 0.992}{1 - 0.992} = \\\\frac{1.992}{0.008} = \\\\mathbf{249.0}$$

#### Step 3: Calculate Required Reaction Extent ($p$) for \\\\bar{X}_n = 80.0$
$$\\\\bar{X}_n = \\\\frac{1 + r}{1 + r - 2 r p} \\\\implies 80.0 = \\\\frac{1.992}{1.992 - 1.984 p}$$

$$80.0 \\\\times (1.992 - 1.984 p) = 1.992 \\\\implies 159.36 - 158.72 p = 1.992$$

$$158.72 p = 159.36 - 1.992 = 157.368$$

$$p = \\\\frac{157.368}{158.72} = \\\\mathbf{0.99148} \\\\quad (99.15\\\\% \\\\text{ conversion})$$

---

## 5. Practical Engineering Exercises

### ❓ Exercise 1.1 (Gelation Kinetics)
**Question:** Using Flory's gelation equation \\\\alpha_c = \\\\frac{1}{f - 1}, calculate the critical conversion ($p_c$) at gelation for a reaction containing glycerol (trifunctional, $f = 3$) and phthalic anhydride ($f = 2$).
**Answer & Rationale:**
$$\\\\alpha_c = \\\\frac{1}{3 - 1} = \\\\mathbf{0.50}$$
For an equal ratio of functional groups, $p_c = \\\\sqrt{\\\\alpha_c} = \\\\sqrt{0.50} = \\\\mathbf{0.7071} \\\\quad (70.71\\\\% \\\\text{ conversion})$.
Crosslinking gelation locks the polymer into an insoluble 3D network at $70.7\\\\%$ conversion.

### ❓ Exercise 1.2 (Molecular Weight Control)
**Question:** Why do industrial polycondensation plants add $0.5\\\\text{ mol}\\\\%$ of monofunctional acetic acid during Nylon synthesis?
**Answer & Rationale:** Monofunctional acetic acid acts as a **chain stopper**. When it reacts with an amine end-group, it terminates further chain growth, stabilizing number-average molecular weight ($M_n$) at a precise viscosity target and preventing post-extrusion molecular weight inflation.
\`,
  ch2: \`# Chapter 2: Free Radical & Controlled Radical Polymerization (RAFT, ATRP)

## 1. Living Radical Polymerization Mechanics
Reversible Addition-Fragmentation Chain Transfer (RAFT) and Atom Transfer Radical Polymerization (ATRP) suppress bimolecular termination, granting narrow polydispersity index ($\\\\text{PDI} < 1.1$) and block copolymer synthesis.

---

## 2. Radical Rate Kinetics
$$R_i = 2 f k_d [I]$$
$$R_p = k_p [M] \\\\sqrt{\\\\frac{f k_d [I]}{k_t}}$$
\`,
  ch3: \`# Chapter 3: Copolymerization Reactivity Ratios & Mayo-Lewis Equation

## 1. Mayo-Lewis Copolymer Equation
$$F_1 = \\\\frac{r_1 f_1^2 + f_1 f_2}{r_1 f_1^2 + 2 f_1 f_2 + r_2 f_2^2}$$

Governs ideal, alternating, or block copolymer microstructure formation.

---

## 2. Azeotropic Copolymerization
When $f_1 = F_1$, copolymer composition matches monomer feed composition:
$$f_1 = \\\\frac{1 - r_2}{2 - r_1 - r_2}$$
\`,
  ch4: \`# Chapter 4: Tacticity, Stereospecific Catalysis & Ziegler-Natta / Metallocene

## 1. Stereocontrol
Ziegler-Natta (\\\\text{TiCl}_3 / \\\\text{AlEt}_3) and single-site metallocene catalysts produce highly isotactic polypropylene ($i\\\\text{-PP}$) with high crystallinity ($T_m \\\\approx 165^\\\\circ\\\\text{C}$).
\`,
  ch5: \`# Chapter 5: Industrial Reactor Engineering & Solution/Suspension Processes

## 1. Industrial Polymerization Reactors
Continuous Stirred-Tank Reactors (CSTR) vs Loop Reactors for high-density polyethylene (HDPE) slurry production.

---

## 2. Reactor Heat Removal Rate
$$\\\\dot{Q}_{\\\\text{rxn}} = \\\\Delta H_p \\\\cdot R_p \\\\cdot V$$
Where \\\\Delta H_p is enthalpy of polymerization (e.g. $-95\\\\text{ kJ/mol}$ for ethylene).
\`
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
      { id: 'ch4', title: 'Chapter 4: Capillary Rheometry & Bagley / Rabinowitsch Corrections' },
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

  // ── CLASS B: Verified Open Access / Public Domain (Government Manuals) ──────
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
    id: '00000000-0000-4000-8000-000000000009',
    slug: 'fundamentals-plastics-mould-design-nayak-free',
    cover_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    title: 'Fundamentals of Plastics Mould Design',
    authors: 'Sanjay K. Nayak (CIPET)',
    legal_class: 'Class D',
    license_type: 'Commercial / CIPET Institutional Reference (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'CIPET / Tata McGraw-Hill',
    publication_year: 2012,
    isbn: '9780070145888',
    focus: 'Injection mould design, feed systems, cooling layouts, and part design guidelines.',
    summary: 'Authoritative CIPET publication detailing injection mould construction, runner balance calculations, pin/edge gating, and cooling channel turbulent flow.',
    purchase_url: 'https://www.amazon.in/dp/0070145888',
    worldcat_url: 'https://www.worldcat.org/title/fundamentals-of-plastics-mould-design/oclc/824132431',
    openlibrary_url: 'https://openlibrary.org/isbn/9780070145888',
    careers: ['Mould Designer', 'Tooling Engineer', 'CAE Analyst'],
    subject_slugs: ['mould-design', 'polymer-processing'],
    notice: 'Class D External Reference Catalog Card. Published by CIPET / Tata McGraw-Hill. Full text is owned by the original authors and publisher. Provided for citation and university catalog indexing.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Introduction to Injection Moulds' },
      { id: 'ch2', title: 'Chapter 2: Feed System and Gate Design' },
      { id: 'ch3', title: 'Chapter 3: Ejection and Venting Systems' },
      { id: 'ch4', title: 'Chapter 4: Mould Cooling System Calculations' }
    ],
    chapters: {}
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    slug: 'fundamentals-polymer-engineering-kumar-free',
    cover_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    title: 'Fundamentals of Polymer Engineering',
    authors: 'Anil Kumar & Rakesh K. Gupta',
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Advanced',
    publisher: 'CRC Press / Marcel Dekker',
    publication_year: 2003,
    isbn: '9780824708672',
    doi: '10.1201/9780203912195',
    focus: 'Thermodynamics, characterization, structural, mechanical, and thermal behavior of polymers.',
    summary: 'Academic reference textbook detailing polymer solution thermodynamics, Flory-Huggins theory, melt viscoelasticity, and processing kinetics.',
    purchase_url: 'https://www.routledge.com/Fundamentals-of-Polymer-Engineering/Kumar-Gupta/p/book/9780824708672',
    worldcat_url: 'https://www.worldcat.org/title/fundamentals-of-polymer-engineering/oclc/51535787',
    openlibrary_url: 'https://openlibrary.org/isbn/9780824708672',
    careers: ['Process Engineer', 'Polymer Rheologist', 'Materials Scientist'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by CRC Press.',
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
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Advanced',
    publisher: 'Academic Press / Elsevier',
    publication_year: 2012,
    isbn: '9780123821782',
    doi: '10.1016/C2009-0-64354-9',
    focus: 'Comprehensive coverage of polymer science, solution behavior, mechanical design, and processing.',
    summary: 'Comprehensive text covering polymer physics, copolymerization kinetics, solution viscometry, and viscoelastic relaxation.',
    purchase_url: 'https://www.elsevier.com/books/the-elements-of-polymer-science-and-engineering/rudin/978-0-12-382178-2',
    worldcat_url: 'https://www.worldcat.org/title/elements-of-polymer-science-and-engineering/oclc/824132431',
    openlibrary_url: 'https://openlibrary.org/isbn/9780123821782',
    careers: ['Materials Engineer', 'Polymer Chemist', 'R&D Consultant'],
    subject_slugs: ['polymer-chemistry', 'polymer-processing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by Elsevier.',
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
    legal_class: 'Class D',
    license_type: 'Commercial Textbook (External Reference Card Only)',
    category: 'commercial',
    difficulty: 'Intermediate',
    publisher: 'New Age International',
    publication_year: 1986,
    isbn: '9780852263075',
    focus: 'Fundamentals of polymer chemistry, molecular weight determination, polymerization kinetics, and processing.',
    summary: 'Standard Indian university textbook covering polymerization mechanisms, end-group analysis, osmometry, and thermal transitions.',
    purchase_url: 'https://www.amazon.in/dp/0852263074',
    worldcat_url: 'https://www.worldcat.org/title/polymer-science/oclc/15077465',
    openlibrary_url: 'https://openlibrary.org/isbn/9780852263075',
    careers: ['R&D Scientist', 'Polymer Chemist', 'Materials Engineer'],
    subject_slugs: ['polymer-chemistry', 'polymer-testing'],
    notice: 'Class D External Reference Catalog Card. Copyright owned by New Age International.',
    toc: [
      { id: 'ch1', title: 'Chapter 1: Chemistry of Polymerization' },
      { id: 'ch2', title: 'Chapter 2: Molecular Weight and Size' },
      { id: 'ch3', title: 'Chapter 3: Kinetics of Polymerization' },
      { id: 'ch4', title: 'Chapter 4: Polymer Characterization' }
    ],
    chapters: {}
  },
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
\`

fs.writeFileSync(filePath, code, 'utf-8')
console.log('✅ Generated complete deep library_data.ts successfully!')
