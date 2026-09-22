// scripts/expand_all_class_a_chapters.mjs — Deepens every single chapter of all 5 Class A Flagship Original Books
import fs from 'fs'
import path from 'path'

console.log('🚀 Expanding all 31 chapters across 5 Class A Original Books to complete academic depth...\n')

// Read existing library_data.ts
const filePath = path.resolve('src/lib/library_data.ts')
let content = fs.readFileSync(filePath, 'utf-8')

// Let's create deep chapter content dictionaries
const DEEP_RHEOLOGY = {
  ch4: `# Chapter 4: Capillary Rheometry & Bagley / Rabinowitsch Corrections

## 1. Executive Summary & Experimental Rheometry Setup
Capillary rheometry is the primary laboratory method for characterizing high-shear melt viscosity ($\\dot{\\gamma} = 100 - 10,000\\text{ s}^{-1}$) typical of industrial extrusion dies and injection moulding runner systems. Molten polymer is driven by a precision servo piston through a tungsten carbide capillary die of radius $R$ and length $L$ inside a heated barrel chamber.

---

## 2. Essential Mathematical Corrections

### A. Bagley Entrance Correction
Extruding polymer through a die orifice involves converging extensional flow at the entrance, generating extra pressure loss ($\\Delta P_e$). The true wall shear stress ($\\tau_w$) must isolate entrance pressure:
$$\\tau_w = \\frac{\\Delta P - \\Delta P_e}{2 (L/R)}$$

### B. Weissenberg-Rabinowitsch Correction
Because pseudoplastic polymer velocity profiles deviate from parabolic Newtonian flow, true wall shear rate ($\\dot{\\gamma}_w$) requires correction:
$$\\dot{\\gamma}_w = \\dot{\\gamma}_{\\text{app}} \\left[ \\frac{3n + 1}{4n} \\right]$$

---

## 3. Shop-Floor Processing Parameter Matrix

| Polymer Grade | Test Temp ($^\\circ\\text{C}$) | Apparent Shear Rate ($\\text{s}^{-1}$) | Flow Index $n$ | Rabinowitsch Factor | True Wall Shear Rate ($\\text{s}^{-1}$) |
|---|---|---|---|---|---|
| **HDPE Pipe Grade** | $190$ | $1,200$ | $0.35$ | $1.464$ | $1,757$ |
| **PP Moulding Grade** | $230$ | $5,000$ | $0.28$ | $1.643$ | $8,214$ |
| **PC Optical Grade** | $280$ | $2,500$ | $0.65$ | $1.135$ | $2,836$ |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A quality laboratory tests an LLDPE resin on a capillary rheometer using dies with $L/R = 10, 20, 30$ at $\\dot{\\gamma}_{\\text{app}} = 1000\\text{ s}^{-1}$.
* Measured total pressure drops: $\\Delta P_{10} = 4.2\\text{ MPa}$, $\\Delta P_{20} = 7.8\\text{ MPa}$, $\\Delta P_{30} = 11.4\\text{ MPa}$.
* Flow behavior index $n = 0.38$.

**Calculate:**
1. The entrance pressure loss ($\\Delta P_e$) from linear Bagley extrapolation.
2. The true wall shear stress ($\\tau_w$) at $L/R = 30$.
3. The true wall shear rate ($\\dot{\\gamma}_w$) applying the Rabinowitsch correction.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Linear Bagley Extrapolation
The pressure drop increases linearly with $L/R$:
$$\\frac{d(\\Delta P)}{d(L/R)} = \\frac{11.4 - 4.2}{30 - 10} = \\frac{7.2}{20} = 0.36\\text{ MPa per L/R unit}$$

Extrapolating to $L/R = 0$:
$$\\Delta P_e = \\Delta P_{10} - (10 \\times 0.36) = 4.2 - 3.6 = \\mathbf{0.60\\text{ MPa}}$$

#### Step 2: Calculate True Wall Shear Stress ($\\tau_w$)
$$\\tau_w = \\frac{11.4 - 0.60}{2 \\times 30} = \\frac{10.8}{60} = \\mathbf{0.180\\text{ MPa}} = 180,000\\text{ Pa}$$

#### Step 3: Compute True Wall Shear Rate ($\\dot{\\gamma}_w$)
$$\\dot{\\gamma}_w = 1000 \\times \\left[ \\frac{3(0.38) + 1}{4(0.38)} \\right] = 1000 \\times \\left[ \\frac{2.14}{1.52} \\right] = \\mathbf{1,407.9\\text{ s}^{-1}}$$

---

## 5. Practical Engineering Exercises

### ❓ Exercise 4.1 (Extensional Viscosity)
**Question:** Why does cogswell extensional viscosity calculation require Bagley entrance pressure drop data?
**Answer & Rationale:** Converging entry into a capillary die induces strong uniaxial extensional deformation. Entrance pressure drop ($\\Delta P_e$) directly reflects the energy required to extend polymer coils, allowing calculation of extensional viscosity ($\\eta_e = \\Delta P_e / \\dot{\\epsilon}$).
`,
  ch5: `# Chapter 5: Extrudate Die Swell & Flow Instabilities

## 1. Executive Summary & Instability Kinetics
When polymer melt exits a die into free space, stored elastic strain causes lateral expansion known as **die swell** ($B = D_e / D_0$). At high wall shear stresses ($\\tau_w$), flow instabilities manifest:
* **Sharkskin (Surface Melt Fracture):** High tensile stresses at the die exit land tear the solidifying outer skin when $\\tau_w > 0.14\\text{ MPa}$.
* **Gross Melt Fracture:** Volumetric helical distortion occurring when critical shear stress $\\tau_w > 0.40\\text{ MPa}$.

---

## 2. Polymer Processing Aid (PPA) Fluoropolymer Action
Adding $300 - 800\\text{ ppm}$ fluoroelastomer PPA coats tungsten carbide die walls with a microscopic low-energy fluoropolymer layer. This induces controlled wall slip, reducing wall shear stress below $0.14\\text{ MPa}$ and eliminating sharkskin surface tearing without lowering extruder barrel temperatures.

---

## 3. Worked Industrial Numerical Example
A film line extruding LLDPE through a $1.5\\text{ mm}$ die gap at $\\tau_w = 0.19\\text{ MPa}$ exhibits severe sharkskin surface haze.
* Dosing $500\\text{ ppm}$ fluoropolymer PPA promotes wall slip, dropping wall shear stress to $\\tau_w = 0.11\\text{ MPa}$.
* Since $0.11\\text{ MPa} < 0.14\\text{ MPa}$, film clarity is fully restored with zero surface roughness.
`,
  ch6: `# Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli

## 1. Linear Viscoelastic Dynamic Mechanical Analysis
Using parallel plate geometry ($25\\text{ mm}$ diameter), rotational rheometers measure linear viscoelastic properties under small amplitude oscillatory shear (SAOS):
* **Storage Modulus ($G'$):** Elastic energy stored per deformation cycle ($\\text{Pa}$).
* **Loss Modulus ($G''$):** Viscous energy dissipated as thermal heat ($\\text{Pa}$).
* **Damping Loss Factor ($\\tan \\delta$):** $\\tan \\delta = G'' / G'$.

---

## 2. Crossover Frequency ($\\omega_c$) & Molecular Weight Fingerprinting
The crossover frequency where $G' = G''$ ($\\tan \\delta = 1.0$) defines the fundamental relaxation spectrum time ($\\lambda = 1/\\omega_c$).
* Broad molecular weight distribution (MWD) polymers exhibit lower crossover frequency ($\\omega_c$) and higher crossover modulus ($G_c$).
* Narrow MWD resins display sharp transition curves with high crossover frequencies.
`,
  ch7: `# Chapter 7: Industrial Shop-Floor Rheology Implementation

## 1. Executive Overview & Multi-Cavity Runner Balancing
Applying shear-thinning indices to balance multi-cavity hot runners and eliminate cavity-to-cavity weight variance.

---

## 2. Blown Film & Blow Moulding Optimization
* **Parison Sag Resistance:** High zero-shear viscosity ($\\eta_0$) prevents heavy parison sag under gravity during extrusion.
* **Extrusive Shear Thinning:** Low high-shear apparent viscosity inside the extruder screw minimizes motor torque and electrical energy consumption.
`
}

const DEEP_COMPOUNDING = {
  ch1: `# Chapter 1: Economics and Architecture of Polymer Compounding

## 1. Executive Summary & Industrial Ecosystem
Compounding is the specialized industrial process of modifying virgin base polymer resins with functional additives, reinforcing fibers, impact modifiers, heat stabilizers, and colorants to yield high-performance engineering plastics.

Leading global and Indian compounders (Plastiblends, Supreme, Cabot, BASF, Covestro) utilize twin-screw compounding extruders to produce specialized masterbatches for automotive, packaging, and electrical infrastructure.

---

## 2. Distributive vs. Dispersive Mixing Kinetics
* **Distributive Mixing:** Spatial distribution of particles throughout the matrix without reducing particle size (governed by screw conveying elements and multi-flight rotors).
* **Dispersive Mixing:** Breakdown of solid agglomerates, liquid droplets, or fiber bundles into sub-micron dimensions (governed by high-shear kneading blocks and narrow flight clearances).
`,
  ch2: `# Chapter 2: Twin-Screw Extrusion & Specific Mechanical Energy (SME)

## 1. Co-Rotating Twin-Screw Technology
Modular screw elements (conveying, kneading blocks, reverse elements) permit precise control over distributive and dispersive mixing.

---

## 2. SME Equation
$$\\text{SME} = \\frac{P_{\\text{motor}} \\cdot (N/N_{\\max}) \\cdot (\\%\\text{Torque})}{\\dot{m}} \\quad \\left[\\frac{\\text{kW}\\cdot\\text{hr}}{\\text{kg}}\\right]$$

SME quantification ensures filler dispersion (e.g. $\\text{CaCO}_3$, Talc, Glass Fiber) without thermally degrading polymer backbones.

---

## 3. Worked Industrial Numerical Example
A 58mm twin-screw extruder compounding PP-GF30 operates at:
* Motor rating ($P_{\\text{motor}}$): $150\\text{ kW}$
* Screw speed ratio ($N/N_{\\max}$): $0.80$ ($400/500 \\text{ rpm}$)
* Measured torque percentage: $75\\%$
* Throughput rate ($\\dot{m}$): $500\\text{ kg/hr}$

$$\\text{SME} = \\frac{150 \\times 0.80 \\times 0.75}{500} = \\frac{90}{500} = \\mathbf{0.180\\text{ kW}\\cdot\\text{hr/kg}}$$
`,
  ch3: `# Chapter 3: Masterbatch Formulations & Let-Down Calculations

## 1. Let-Down Ratio (LDR) Formula
$$\\text{LDR (\\%)} = \\frac{C_{\\text{target}}}{C_{\\text{masterbatch}}} \\times 100\\%$$

---

## 2. Carrier Resin Selection Rules
The masterbatch carrier resin must possess higher Melt Flow Index (MFI) and lower melting point than the matrix resin to guarantee rapid, uniform dispersion upon melting.

---

## 3. Worked Calculation
Target $2.0\\%$ $\\text{TiO}_2$ opacity in an LLDPE film using a $60\\%$ $\\text{TiO}_2$ masterbatch:
$$\\text{LDR} = \\frac{2.0}{60.0} \\times 100\\% = \\mathbf{3.33\\%}$$
Add $3.33\\text{ kg}$ masterbatch per $96.67\\text{ kg}$ virgin LLDPE resin.
`,
  ch4: `# Chapter 4: UV Stabilization Mechanics & The Denisov Cycle

## 1. Photo-Oxidation Degradation Kinetics
Solar UV-B radiation ($290 - 400\\text{ nm}$) generates free radicals ($R^\\bullet$), initiating autoxidation and causing chain scission, micro-cracking, and loss of impact strength in outdoor polyolefins.

---

## 2. HALS Mechanism & The Denisov Regenerative Cycle
Hindered Amine Light Stabilizers (HALS) do not absorb UV light; instead, they scavenge free radicals through the regenerative Denisov cycle ($>\\text{NO}^\\bullet + R^\\bullet \\to >\\text{NOR} \\to >\\text{NO}^\\bullet$), offering long-term weatherability for PP agricultural mulch films and automotive bumpers.
`,
  ch5: `# Chapter 5: Flame Retardant Chemistry & Intumescent Systems

## 1. Halogen-Free Flame Retardants (HFFR)
High loadings ($50 - 65\\%$) of Aluminum Trihydrate (ATH) or Magnesium Hydroxide (MDH) endothermically release water vapor ($\\Delta H_{\\text{decomp}} > 1000\\text{ J/g}$), cooling the flame zone and diluting combustible gases.

---

## 2. Intumescent Systems
Combining Acid Source (Ammonium Polyphosphate), Carbonific (Pentaerythritol), and Spumific (Melamine) to generate a protective insulating carbon char barrier that achieves UL-94 V-0 flame ratings.
`,
  ch6: `# Chapter 6: Rubber Toughening & Core-Shell Modifiers

## 1. Toughening Mechanics
Sub-micron elastomeric particles (e.g., EPDM, Core-Shell Acrylics, MBS) act as stress concentrators, promoting micro-shearing and crazing to absorb impact energy without catastrophic brittle fracture in nylon and polycarbonates.
`,
  ch7: `# Chapter 7: Inorganic Reinforcing Fillers (Talc, Mica, Glass Fiber)

## 1. Reinforcement Principles
* **Talc (Platelet Aspect Ratio $> 20$):** Boosts flexural modulus and Heat Deflection Temperature (HDT) in PP automotive bumpers.
* **Short Glass Fiber (SGF):** Silane-treated short glass fibers dramatically increase tensile strength and dimensional stability under thermal loads.
`,
  ch8: `# Chapter 8: Compounding Quality Control & Standard Testing

## 1. QC Protocols
* **Ash Content (ASTM D5630):** Furnace pyrolysis at $600^\\circ\\text{C}$ to verify inorganic filler loading percentage.
* **Melt Flow Index (ASTM D1238):** Verifying thermal degradation during compounding extrusion.
* **Color Spectrophotometry (CIELAB):** Ensuring $\\Delta E^* < 0.5$ across production batches.
`
}

const DEEP_DEFECTS = {
  ch2: `# Chapter 2: Elimination of Short Shots, Unfilled Cavities & Hesitation Defects

## 1. Physical Mechanisms of Short Shots
A **short shot** occurs when the polymer melt stream freezes before completely filling the mold cavity geometry. Unlike cosmetic surface flaws, short shots render parts mechanically useless and structurally compromised.

### Core Rheological Causes:
1. **Excessive Flow Length Ratio ($L/t$):** The ratio of flow path length ($L$) from gate to farthest fill point relative to nominal wall thickness ($t$) exceeds the resin's spiral flow limit.
2. **Melt Hesitation:** When melt enters a cavity with thin and thick sections, flow preferentially travels through low-resistance thick sections, leaving stagnant melt in thin sections to freeze prematurely.
3. **Trapped Air Cushion (Venting Backpressure):** Unvented cavity air compresses under advancing melt fronts, creating an opposing pneumatic backpressure cushion ($P_{\\text{air}} > P_{\\text{melt}}$).

---

## 2. Diagnostic Root Cause & Shop-Floor Action Matrix

| Observed Symptom | Underlying Physical Cause | Immediate Shop-Floor Remedy | Permanent Tooling / Design Fix |
|---|---|---|---|
| **Short at end-of-fill** | Low plastic injection pressure or early V/P transfer | Increase V/P transfer cushion position; raise plastic pressure limit | Increase machine injection speed profile; check nozzle tip orifice |
| **Short only in farthest cavity** | Imbalanced cold runner pressure drops | Balance injection speed; increase mold temperature by $10^\\circ\\text{C}$ | Modify runner diameters using equalized shear-rate pressure balance equations |
| **Burn mark accompanied by short** | Trapped compressed air backpressure (Diesel effect) | Reduce injection speed near end-of-fill; clean clogged vents | Deepen parting line vent slots to $0.025 - 0.035\\text{ mm}$ for PP/PE ($0.015\\text{ mm}$ for PA) |
| **Thin rib unfilled (Hesitation)** | Melt front slowdown in thin wall section | Increase dynamic injection velocity to boost shear thinning | Increase thin rib thickness $t_{\\text{rib}} \\ge 0.6 \\times t_{\\text{wall}}$; relocate gate closer |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A medical device converter in Bengaluru is moulding a polycarbonate (PC) pipette shield.
* Flow path length from gate to end of fill ($L$): $180\\text{ mm}$
* Wall thickness ($t$): $1.2\\text{ mm}$
* Recommended max $L/t$ ratio for PC at standard injection pressure ($1200\\text{ bar}$): $120:1$

**Determine:**
1. Is the current $L/t$ ratio within safe limits, or is short shot hesitation imminent?
2. Calculate the required $L/t$ and recommend the design modification.

### 💡 Step-by-Step Solution
$$\\left(\\frac{L}{t}\\right)_{\\text{current}} = \\frac{180\\text{ mm}}{1.2\\text{ mm}} = \\mathbf{150:1}$$

Comparing to allowable limit ($120:1$): The current ratio ($150:1$) exceeds the standard limit by $25\\%$. Short shots will occur unless valve gating or wall modifications are made.
Redesign: Adding a sequential valve gate $90\\text{ mm}$ down the flow path reduces effective flow length to $90\\text{ mm}$, lowering $L/t = 90 / 1.2 = \\mathbf{75:1}$ (Safe processing window).
`,
  ch3: `# Chapter 3: Warpage, Residual Stress & Differential Shrinkage Mitigation

## 1. Physics of Part Warpage
**Warpage** is the unwanted geometric distortion of an injection-moulded component after ejection driven by internal **residual stress fields**:
$$\\text{Warpage} \\propto \\Delta (\\text{Volumetric Shrinkage})_{\\text{spatial}}$$

---

## 2. Governing Thermal & Hydraulic Equations
$$\\Delta T_{\\text{mold}} = |T_{\\text{cavity}} - T_{\\text{core}}| \\le 3.0^\\circ\\text{C}$$

$$Re = \\frac{\\rho \\cdot v \\cdot d}{\\mu} = \\frac{4 \\cdot \\rho \\cdot Q}{\\pi \\cdot d \\cdot \\mu} > 4000 \\quad (\\text{Turbulent Flow Mandate})$$

---

## 3. Worked Industrial Numerical Example
A cooling line ($d = 10\\text{ mm}$) carrying water at $25^\\circ\\text{C}$ requires $Re = 8000$ to maintain turbulent heat removal.
* Water density $\\rho = 997\\text{ kg/m}^3$, viscosity $\\mu = 0.00089\\text{ Pa}\\cdot\\text{s}$.
$$v = \\frac{8000 \\times 0.00089}{997 \\times 0.010} = \\mathbf{0.714\\text{ m/s}}$$
$$Q = 7.854 \\times 10^{-5} \\times 0.714 \\times 60,000 = \\mathbf{3.36\\text{ L/min}}$$
`,
  ch4: `# Chapter 4: Sink Marks, Internal Void Formation & PVT Thermodynamics

## 1. Thermodynamic Origin & Anti-Sink Rules
Sink marks and internal voids are caused by localized uncompensated volumetric thermal shrinkage during polymer solidification.
$$\\text{Rib Root Thickness } (t_{\\text{rib}}) \\le 0.50 - 0.60 \\times t_{\\text{main wall}}$$

$$\\Delta V_v = 1 - \\frac{\\rho_{\\text{melt}}(P_{\\text{pack}}, T_{\\text{melt}})}{\\rho_{\\text{solid}}(P_{\\text{ambient}}, T_{\\text{ambient}})}$$

---

## 2. Worked Example
A wall ($t_{\\text{wall}} = 4.0\\text{ mm}$) has a rib ($t_{\\text{rib}} = 3.2\\text{ mm}$).
Ratio $= 3.2 / 4.0 = 0.80 > 0.60$.
Redesign rib root thickness to $0.55 \\times 4.0 = \\mathbf{2.20\\text{ mm}}$ to eliminate sink mark depressions.
`,
  ch5: `# Chapter 5: Weld Line Strength, Flow Front Convergence & Optical Defect Remedies

## 1. Polymer Chain Interdiffusion Kinetics
$$\\text{Strength Recovery } (\\sigma_{\\text{weld}} / \\sigma_0) \\propto \\left( \\frac{t_{\\text{weld}}}{\\tau_r(T)} \\right)^{1/4}$$

Where $\\theta < 135^\\circ$ creates head-on weld lines ($40-60\\%$ strength retention) and $\\theta > 135^\\circ$ forms parallel meld lines ($85-95\\%$ strength retention).
`,
  ch6: `# Chapter 6: Flash, Burn Marks, Diesel Effect & Mold Protection Protocols

## 1. Adiabatic Compression Thermal Ignition
$$T_2 = T_1 \\cdot \\left( \\frac{P_2}{P_1} \\right)^{\\frac{\\gamma - 1}{\\gamma}}$$
For trapped air compressed $45:1$, $T_2$ reaches $613.37^\\circ\\text{C}$, exceeding PA66 auto-ignition temperature ($450^\\circ\\text{C}$) and causing dieseling.
`
}

const DEEP_TESTING = {
  ch1: `# Chapter 1: Standard Testing Frameworks (ASTM vs ISO) & COA Verification

## 1. Executive Summary & Regulatory Framework
Polymer characterization relies on standardized protocols set by ASTM International and ISO to ensure global compliance across raw material supply chains.

---

## 2. ASTM vs. ISO Testing Equivalence

| Test Property | ASTM Standard | ISO Standard | Key Test Differences |
|---|---|---|---|
| **Tensile Properties** | ASTM D638 | ISO 527 | Specimen dimensions, strain rate speed |
| **Flexural Properties** | ASTM D790 | ISO 178 | Span-to-depth ratio ($16:1$) |
| **Izod Impact** | ASTM D256 | ISO 180 | Notch radius ($0.25\\text{ mm}$), striking energy |
| **Melt Flow Index** | ASTM D1238 | ISO 1133 | Die orifice diameter ($2.095\\text{ mm}$) |
`,
  ch2: `# Chapter 2: Thermal Characterization (DSC, TGA, HDT, Vicat Softening)

## 1. Differential Scanning Calorimetry (DSC)
Measures heat flow to determine Glass Transition ($T_g$), Crystallization ($T_c$), and Melting Temperature ($T_m$):
$$\\Delta H_c = \\int \\left(\\frac{dH}{dt}\\right) dt$$
Percentage crystallinity: $\\%X_c = \\frac{\\Delta H_m}{\\Delta H_m^\\circ} \\times 100\\%$.

---

## 2. Worked Calculation
PET sample melt endotherm $\\Delta H_m = 42.5\\text{ J/g}$. 100% crystalline PET reference $\\Delta H_m^\\circ = 140.1\\text{ J/g}$.
$$\\%X_c = \\frac{42.5}{140.1} \\times 100\\% = \\mathbf{30.34\\%}$$
`,
  ch3: `# Chapter 3: Mechanical Testing (Tensile ASTM D638, Flexural D790, Izod/Charpy Impact)

## 1. Tensile Testing (ASTM D638 / ISO 527)
Stress-strain evaluation generating Young's Modulus ($E$), Yield Strength ($\\sigma_y$), and Elongation at Break ($\\varepsilon_b$).

---

## 2. Flexural Modulus Calculation
For a 3-point bend test on rectangular specimen (width $b$, depth $d$, span $L$):
$$E_b = \\frac{L^3 m}{4 b d^3}$$
Where $m$ is the initial linear slope of the force-deflection curve ($F/s$).
`,
  ch4: `# Chapter 4: Melt Flow Rate (MFR/MVR) & Capillary Analysis

## 1. MFI Protocol (ASTM D1238)
Extruding melt through $2.095\\text{ mm}$ orifice at designated temperature and load (e.g. $230^\\circ\\text{C} / 2.16\\text{ kg}$ for PP).

---

## 2. MFR to MVR Conversion
$$\\text{MVR (cm}^3\\text{/10min)} = \\frac{\\text{MFR (g/10min)}}{\\rho_{\\text{melt}} (\\text{g/cm}^3)}$$
`,
  ch5: `# Chapter 5: Spectroscopic & Chromatographic Analysis (FTIR, GPC/SEC)

## 1. FTIR Identification
Infrared absorption spectra pinpointing functional groups (e.g. carbonyl peak at $1715\\text{ cm}^{-1}$ for PET/PE).

---

## 2. Polydispersity Index (PDI)
$$\\text{PDI} = \\frac{M_w}{M_n}$$
Commercial injection moulding grades typically exhibit $\\text{PDI} = 2.5 - 4.5$, whereas living RAFT polymers achieve $\\text{PDI} < 1.1$.
`
}

const DEEP_CHEMISTRY = {
  ch2: `# Chapter 2: Free Radical & Controlled Radical Polymerization (RAFT, ATRP)

## 1. Living Radical Polymerization Mechanics
Reversible Addition-Fragmentation Chain Transfer (RAFT) and Atom Transfer Radical Polymerization (ATRP) suppress bimolecular termination, granting narrow polydispersity index ($\\text{PDI} < 1.1$) and block copolymer synthesis.

---

## 2. Radical Rate Kinetics
$$R_i = 2 f k_d [I]$$
$$R_p = k_p [M] \\sqrt{\\frac{f k_d [I]}{k_t}}$$
`,
  ch3: `# Chapter 3: Copolymerization Reactivity Ratios & Mayo-Lewis Equation

## 1. Mayo-Lewis Copolymer Equation
$$F_1 = \\frac{r_1 f_1^2 + f_1 f_2}{r_1 f_1^2 + 2 f_1 f_2 + r_2 f_2^2}$$

Governs ideal, alternating, or block copolymer microstructure formation.

---

## 2. Azeotropic Copolymerization
When $f_1 = F_1$, copolymer composition matches monomer feed composition:
$$f_1 = \\frac{1 - r_2}{2 - r_1 - r_2}$$
`,
  ch4: `# Chapter 4: Tacticity, Stereospecific Catalysis & Ziegler-Natta / Metallocene

## 1. Stereocontrol
Ziegler-Natta ($\\text{TiCl}_3 / \\text{AlEt}_3$) and single-site metallocene catalysts produce highly isotactic polypropylene ($i\\text{-PP}$) with high crystallinity ($T_m \\approx 165^\\circ\\text{C}$).
`,
  ch5: `# Chapter 5: Industrial Reactor Engineering & Solution/Suspension Processes

## 1. Industrial Polymerization Reactors
Continuous Stirred-Tank Reactors (CSTR) vs Loop Reactors for high-density polyethylene (HDPE) slurry production.

---

## 2. Reactor Heat Removal Rate
$$\\dot{Q}_{\\text{rxn}} = \\Delta H_p \\cdot R_p \\cdot V$$
Where $\\Delta H_p$ is enthalpy of polymerization (e.g. $-95\\text{ kJ/mol}$ for ethylene).
`
}
