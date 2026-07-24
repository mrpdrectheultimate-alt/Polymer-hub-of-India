const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUBJECT_IDS = {
  "Polymer Chemistry": "25503bc3-fb0e-4991-a226-1d7b464e2946",
  "Polymer Processing": "09931597-70cc-4cab-905c-336a4d6dde09",
  "Rubber Technology": "b9399968-d0df-4953-9bec-1f07d61de8ab"
};

// LESSON 2
const lesson2 = {
  slug: "living-and-controlled-ionic-polymerization",
  title: "Living and Controlled Ionic Polymerization",
  subject_id: SUBJECT_IDS["Polymer Chemistry"],
  summary: "Covers termination-free living anionic carbanions, modern dispersity symbol Đ = Mw/Mn, and controlled cationic active-dormant equilibria.",
  content: `# Living and Controlled Ionic Polymerization

> **Subject**: Polymer Chemistry  
> **Target Level**: Advanced  
> **Prerequisites**: Introduction to Polymer Structure and Molecular Weight  

---

## 1. Why This Topic Matters
Living ionic polymerization provides precise control over molecular weight, narrow molecular weight distribution, and chain architecture (block copolymers, star polymers). By eliminating termination and chain transfer reactions, living carbanionic systems allow sequential addition of different monomers to produce thermoplastic elastomers like Styrene-Butadiene-Styrene (SBS) and SEBS.

---

## 2. Core Chemical & Engineering Principles

### 2.1 Modern Dispersity Symbol & Ideal Living Dispersity
The modern IUPAC symbol for molecular weight dispersity is $\\text{Đ} = M_w / M_n$ (replacing historical PDI). For an ideal living polymerization where all chains initiate simultaneously and grow at identical rates, the chain lengths follow a Poisson distribution:

$$\\text{Đ} \\approx 1 + \\frac{1}{\\overline{DP}_n}$$

*Ideal Living Assumptions Required*:
1. Rapid initiation relative to propagation ($k_i \\gg k_p$).
2. Negligible termination rate ($k_t \\to 0$).
3. Negligible chain transfer ($k_{tr} \\to 0$).
4. Equal reactivity of active growing chain ends.
5. Homogeneous, ultra-pure reaction conditions.

### 2.2 Living Anionic Polymerization & Block Copolymerization
Initiated by organolithium compounds (e.g. sec-butyllithium) in non-polar hydrocarbon solvents. Active carbanion chain ends ($\sim\\text{CH}_2-\\text{CH(Ph)}^-\\text{Li}^+$) remain active indefinitely after monomer consumption, allowing sequential addition of butadiene and styrene:

$$M_n = \\frac{[\\text{M}]_0}{[\\text{I}]_0} \\times MW_{\\text{monomer}} \\times \\text{Conversion}$$

### 2.3 Controlled Cationic Polymerization
Controlled cationic systems (e.g. isobutylene polymerization initiated by tertiary ethers + $\\text{TiCl}_4$ Lewis acid) establish a dynamic equilibrium between active carbenium ions and dormant alkyl halides:

$$\sim\\text{C-Cl} + \\text{TiCl}_4 \\rightleftharpoons \\sim\\text{C}^+ \\text{TiCl}_5^-$$

*Limitations*: Unlike anionic living systems, cationic systems require low temperatures ($-80^\\circ\\text{C}$) and nucleophilic additives (e.g. 2,6-lutidine) to suppress $\\beta$-proton elimination and chain transfer to monomer.

---

## 3. Process Control Specifications

| Parameter | Living Anionic SBS Synthesis | Controlled Cationic Polyisobutylene | Value Status |
|---|---|---|---|
| Reaction Temperature | $40^\\circ\\text{C} - 60^\\circ\\text{C}$ | $-80^\\circ\\text{C} - -60^\\circ\\text{C}$ | illustrative_processing_range |
| Initiator System | sec-Butyllithium | Cumyl chloride / $\\text{TiCl}_4$ | illustrative_processing_range |
| Solvent | Cyclohexane / Hexane | Methyl chloride / Hexane (60:40) | illustrative_processing_range |
| Impurity Level ($\text{H}_2\text{O}, \text{O}_2$) | $< 1\\text{ ppm}$ | $< 5\\text{ ppm}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Molecular Weight & Dispersity (ASTM D5296)
1. **Sample Preparation**: Dissolve $10\\text{ mg}$ SBS copolymer in $10\\text{ mL}$ HPLC-grade THF.
2. **SEC Column Calibration**: Calibrate Size Exclusion Chromatography (SEC) columns using monodisperse Polystyrene standards.
3. **Refractive Index Detection**: Determine $M_n$, $M_w$, and $\\text{Đ} = M_w / M_n$ (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A living anionic polymerization of styrene ($MW = 104.15\\text{ g/mol}$) is carried out in cyclohexane at $50^\\circ\\text{C}$ using sec-butyllithium initiator. Initial concentrations: $[M]_0 = 2.50\\text{ mol/L}$, $[I]_0 = 0.0025\\text{ mol/L}$. Polymerization reaches $100\\%$ conversion.
1. Calculate the theoretical number-average degree of polymerization $\\overline{DP}_n$.
2. Calculate number-average molecular weight $M_n$.
3. Calculate theoretical dispersity $\\text{Đ} = M_w / M_n$.

### Step-by-Step Solution

**Step 1: Calculate $\\overline{DP}_n$**
$$\\overline{DP}_n = \\frac{[M]_0}{[I]_0} \\times \\text{Conversion} = \\frac{2.50}{0.0025} \\times 1.00 = 1000$$

**Step 2: Calculate $M_n$**
$$M_n = \\overline{DP}_n \\times MW_{\\text{monomer}} = 1000 \\times 104.15 = 104,150 \\text{ g/mol}$$

**Step 3: Calculate Dispersity $\\text{Đ}$**
$$\\text{Đ} = 1 + \\frac{1}{\\overline{DP}_n} = 1 + \\frac{1}{1000} = 1.001$$

*Reproduced Result*: $M_n = 104,150\\text{ g/mol}$, Dispersity $\\text{Đ} = 1.001$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Purified Styrene Monomer + Cyclohexane"] --> B["Charge Reactor & Add sec-BuLi (50°C)"]
    B --> C["First Block Growth (Living Polystyryl Anion)"]
    C --> D["Add Butadiene Monomer"]
    D --> E["Diblocks Growth (Styrene-Butadiene Anion)"]
    E --> F["Add Second Styrene Charge"]
    F --> G["Quench with Methanol -> SBS Triblock Copolymer (Đ = 1.05)"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the IUPAC recommended symbol for molecular weight dispersity ($M_w / M_n$)?**
   - A) PDI
   - B) $\\text{Đ}$
   - C) $\\eta$
   - D) $\\alpha$
   - *Answer*: B. $\\text{Đ}$ (Dispersity) is the modern official IUPAC symbol.

2. **Under what condition is the dispersity formula $\\text{Đ} \\approx 1 + 1/\\overline{DP}_n$ valid?**
   - A) Free-radical emulsion polymerization
   - B) Ideal living polymerization with fast initiation and zero termination/transfer
   - C) High-temperature step-growth condensation
   - D) Heterogeneous Ziegler-Natta coordination polymerization
   - *Answer*: B. Valid only when initiation is rapid and termination/transfer are completely absent.

3. **Why do controlled cationic polymerizations require low temperatures ($-80^\\circ\\text{C}$)?**
   - A) To prevent solvent freezing
   - B) To suppress $\\beta$-proton elimination and chain transfer to monomer
   - C) To increase carbanion solubility
   - D) To evaporate volatile Lewis acids
   - *Answer*: B. Low thermal energy suppresses high activation energy chain transfer side reactions.

4. **Calculate $M_n$ for a living polymerization with $[M]_0 = 3.0\\text{ M}$, $[I]_0 = 0.003\\text{ M}$, conversion $= 100\\%$, monomer $MW = 100\\text{ g/mol}$.**
   - A) $10,000\\text{ g/mol}$
   - B) $100,000\\text{ g/mol}$
   - C) $300,000\\text{ g/mol}$
   - D) $1,000,000\\text{ g/mol}$
   - *Answer*: B. $\\overline{DP}_n = 3.0 / 0.003 = 1000$. $M_n = 1000 \\times 100 = 100,000\\text{ g/mol}$.

5. **In SBS triblock copolymer synthesis by sequential living anionic polymerization, what occurs after all butadiene is consumed?**
   - A) Chains terminate automatically
   - B) Active carbanions remain alive to initiate the second styrene block
   - C) Polymer undergoes spontaneous crosslinking
   - D) Catalyst precipitates out of solution
   - *Answer*: B. Living chain ends remain active to initiate subsequent monomer charges.
`
};

// LESSON 3
const lesson3 = {
  slug: "polymer-solution-thermodynamics-flory-huggins-theory",
  title: "Polymer Solution Thermodynamics: Flory-Huggins Theory & Phase Diagrams",
  subject_id: SUBJECT_IDS["Polymer Chemistry"],
  summary: "Lattice statistics, Flory-Huggins free energy equation, critical chi parameter, binodal vs spinodal envelopes, and Theta condition.",
  content: `# Polymer Solution Thermodynamics: Flory-Huggins Theory & Phase Diagrams

> **Subject**: Polymer Chemistry  
> **Target Level**: Advanced  
> **Prerequisites**: Thermoplastics vs Thermosets: Structure and Behavior  

---

## 1. Why This Topic Matters
Polymer solutions depart dramatically from ideal solution behavior due to the large size disparity between polymer chains and solvent molecules. The Flory-Huggins lattice model provides the mathematical framework for understanding polymer solubility, phase separation, solvent quality ($\Theta$ conditions), and membrane formation via thermally induced phase separation (TIPS).

---

## 2. Core Chemical & Engineering Principles

### 2.1 Flory-Huggins Free Energy of Mixing
The free energy of mixing per lattice site $\\Delta G_{mix}$ for a polymer solution is given by:

$$\\frac{\\Delta G_{mix}}{R T} = \\frac{\\phi_1}{N_1} \\ln\\phi_1 + \\frac{\\phi_2}{N_2} \\ln\\phi_2 + \\chi \\phi_1 \\phi_2$$

Where:
- $\\phi_1, \\phi_2$ are volume fractions of solvent and polymer ($\\phi_1 + \\phi_2 = 1$).
- $N_1, N_2$ are segment ratios.
- $\\chi$ is the dimensionless Flory-Huggins interaction parameter ($\\chi = \\Delta H_{mix} / (R T \\phi_1 \\phi_2)$).

### 2.2 Critical Interaction Parameter $\\chi_c$ (Small-Molecule Solvent $N_1 = 1$)
For a binary polymer-solvent system where component 1 is a small-molecule solvent ($N_1 = 1$) and component 2 is a polymer of segment length $N_2$, the critical point equations are:

$$\\chi_c = \\frac{1}{2} \\left( 1 + \\frac{1}{\\sqrt{N_2}} \\right)^2, \\quad \\phi_{2,c} = \\frac{1}{1 + \\sqrt{N_2}}$$

*Assumptions*: $N_1 = 1$, incompressible lattice, mean-field approximation. For polymer-polymer blends ($N_1 > 1, N_2 > 1$), both $N_1$ and $N_2$ must be included: $\\chi_c = \\frac{1}{2} (1/\\sqrt{N_1} + 1/\\sqrt{N_2})^2$.

### 2.3 Phase Envelopes & The Theta ($\\Theta$) Condition
- **Binodal Curve**: Locus of points where chemical potentials of components in coexisting phases are equal ($\\Delta \\mu_i^\\alpha = \\Delta \\mu_i^\\beta$).
- **Spinodal Curve**: Boundary separating metastable from unstable regions, defined by $\\frac{\\partial^2 \\Delta G_{mix}}{\\partial \\phi_2^2} = 0$.
- **Theta ($\\Theta$) Condition**: Temperature where $\\chi = 0.5$ in the long-chain dilute solution limit ($N_2 \\to \\infty$). At $T = \\Theta$, second virial coefficient $A_2 = 0$, and polymer-solvent interactions equal polymer-polymer contacts.

---

## 3. Thermodynamic Parameters

| Parameter | Good Solvent | Theta Solvent | Poor Solvent | Value Status |
|---|---|---|---|---|
| Interaction Parameter $\\chi$ | $< 0.5$ | $\\approx 0.5$ | $> 0.5$ | illustrative_processing_range |
| Second Virial Coeff. $A_2$ | $> 0$ | $= 0$ | $< 0$ | illustrative_processing_range |
| Polymer Conformation | Expanded Coil | Unperturbed Gaussian Coil | Collapsed Globule | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Intrinsic Viscosity & Theta Temp (ISO 1628-1)
1. **Dilute Solution Prep**: Dissolve polymer sample in solvent at 5 concentrations ($0.1 - 1.0\\text{ g/dL}$).
2. **Capillary Viscometry**: Measure efflux times using Ubbelohde viscometer at controlled temperature $T$.
3. **Extrapolation**: Extrapolate reduced viscosity $\\eta_{sp}/c$ to zero concentration to determine intrinsic viscosity $[\\eta]$ (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
Consider a monodisperse Polystyrene polymer dissolved in a solvent ($N_1 = 1$). The degree of polymerization $N_2 = 1000$.
1. Calculate the critical Flory-Huggins interaction parameter $\\chi_c$.
2. Calculate the critical polymer volume fraction $\\phi_{2,c}$.

### Step-by-Step Solution

**Step 1: Calculate $\\chi_c$**
$$\\chi_c = \\frac{1}{2} \\left( 1 + \\frac{1}{\\sqrt{1000}} \\right)^2$$
$$\\sqrt{1000} = 31.62277 \\implies \\frac{1}{31.62277} = 0.03162$$
$$\\chi_c = 0.5 \\times (1.03162)^2 = 0.5 \\times 1.06425 = 0.5321$$

**Step 2: Calculate $\\phi_{2,c}$**
$$\\phi_{2,c} = \\frac{1}{1 + \\sqrt{1000}} = \\frac{1}{1 + 31.62277} = \\frac{1}{32.62277} = 0.03065$$

*Reproduced Result*: $\\chi_c = 0.5321$, $\\phi_{2,c} = 0.03065$ ($3.065\\%$ polymer volume fraction).

---

## 6. Phase Diagram

\`\`\`mermaid
graph TD
    A["Temperature T vs Volume Fraction φ2"] --> B["Single Phase Homogeneous Region (T > UCST)"]
    B --> C["Binodal Curve (Phase Coexistence Boundary)"]
    C --> D["Metastable Region (Nucleation and Growth)"]
    D --> E["Spinodal Curve (d2G/dφ22 = 0)"]
    E --> F["Unstable Region (Spinodal Decomposition)"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What does $\\chi = 0.5$ represent in Flory-Huggins theory for long polymer chains in dilute solution?**
   - A) Maximum polymer solubility
   - B) Theta ($\\Theta$) condition where $A_2 = 0$
   - C) Instantaneous spinodal decomposition
   - D) Complete phase separation at all temperatures
   - *Answer*: B. At $\\chi = 0.5$, net segment-solvent interaction matches segment-segment interaction ($A_2 = 0$).

2. **For a polymer with $N_2 = 400$ in solvent ($N_1 = 1$), calculate the critical volume fraction $\\phi_{2,c}$.**
   - A) $0.0476$
   - B) $0.0500$
   - C) $0.2500$
   - D) $0.5000$
   - *Answer*: A. $\\phi_{2,c} = 1 / (1 + \\sqrt{400}) = 1 / 21 = 0.0476$.

3. **What phase separation mechanism occurs inside the spinodal region ($\\partial^2 \\Delta G_{mix} / \\partial \\phi_2^2 < 0$)?**
   - A) Nucleation and growth
   - B) Spinodal decomposition (spontaneous barrierless phase separation)
   - C) Crystallization
   - D) Chemical gelation
   - *Answer*: B. Spinodal decomposition proceeds spontaneously without thermodynamic energy barrier.

4. **Which equation correctly describes the Flory-Huggins entropy of mixing for $N_1$ solvent and $N_2$ polymer segments?**
   - A) $\\Delta S_{mix} / R = -[\\phi_1 \\ln\\phi_1 + \\phi_2 \\ln\\phi_2]$
   - B) $\\Delta S_{mix} / R = -[(\\phi_1 / N_1) \\ln\\phi_1 + (\\phi_2 / N_2) \\ln\\phi_2]$
   - C) $\\Delta S_{mix} / R = \\chi \\phi_1 \\phi_2$
   - D) $\\Delta S_{mix} / R = (N_1 + N_2) \\ln(\\phi_1 \\phi_2)$
   - *Answer*: B. Entropy of mixing is reduced by chain connectivity factors $N_1$ and $N_2$.

5. **As polymer degree of polymerization $N_2 \\to \\infty$, what does the critical interaction parameter $\\chi_c$ approach?**
   - A) $0.00$
   - B) $0.50$
   - C) $1.00$
   - D) $\\infty$
   - *Answer*: B. $\\lim_{N_2 \\to \\infty} 0.5(1 + 1/\\sqrt{N_2})^2 = 0.50$.
`
};

// LESSON 4
const lesson4 = {
  slug: "extrusion-die-swell-drawdown-and-dimensional-control",
  title: "Extrusion Die Swell, Drawdown and Dimensional Control",
  subject_id: SUBJECT_IDS["Polymer Processing"],
  summary: "Applied extrudate swell ratio B, drawdown ratio DDR, haul-off velocity, vacuum sizing calibrator heat transfer, and wall thickness tolerance control.",
  content: `# Extrusion Die Swell, Drawdown and Dimensional Control

> **Subject**: Polymer Processing  
> **Target Level**: Intermediate  
> **Prerequisites**: Extrusion Process: Screw Design and Die Types  

---

## 1. Why This Topic Matters
When viscoelastic polymer melts exit an extrusion die, normal stress differences stored during shear flow relax, causing the extrudate cross-section to expand—a phenomenon known as **die swell**. To achieve precise final pipe, sheet, or film dimensions, processing engineers must balance die land geometry, haul-off drawdown speeds, and vacuum sizing tank calibration.

---

## 2. Core Engineering Principles

### 2.1 Relaxed Extrudate Swell Ratio $B$
The extrudate swell ratio $B$ is defined as:

$$B = \\frac{D_{\\text{relaxed}}}{D_{\\text{die}}}$$

Where $D_{\\text{relaxed}}$ is the unconstrained, fully relaxed extrudate dimension measured after cooling, and $D_{\\text{die}}$ is the die land exit dimension. Swell increases with higher shear rates and shorter die land length-to-diameter ratios ($L/D_{die}$).

### 2.2 Area Drawdown Ratio (DDR)
To pull extrudate down to target dimensions, a haul-off unit applies tensile drawdown:

$$\\text{DDR}_{\\text{area}} = \\frac{A_{\\text{die}}}{A_{\\text{product}}} = \\frac{v_{\\text{haul-off}}}{v_{\\text{die-exit}}}$$

Where $A_{\\text{die}}$ is die exit cross-sectional area, $A_{\\text{product}}$ is final cooled product area, $v_{\\text{die-exit}}$ is linear exit melt velocity, and $v_{\\text{haul-off}}$ is puller linear speed.

### 2.3 Process Dimensional Control Steps
Extrudate dimensions undergo 5 distinct physical stages:
1. **Die Exit**: Elastic recovery causes free extrudate die swell ($B > 1.0$).
2. **Drawdown Zone**: Haul-off puller applies longitudinal tension ($\\text{DDR} > 1.0$).
3. **Vacuum Calibrator**: Outer surface pinned against sleeve by differential vacuum pressure ($15 - 30\\text{ kPa}$).
4. **Cooling Tank**: Water spray baths ($15^\\circ\\text{C} - 20^\\circ\\text{C}$) freeze polymer below $T_g$ or $T_m$.
5. **Cooling Shrinkage**: Thermal contraction ($1.5\\% - 2.5\\%$ for semicrystalline HDPE/PP).

---

## 3. Processing Parameters

| Parameter | HDPE Pipe Extrusion | LLDPE Blown Film Extrusion | Value Status |
|---|---|---|---|
| Die Land L/D Ratio | $10:1 - 15:1$ | $8:1 - 12:1$ | illustrative_processing_range |
| Area Drawdown Ratio (DDR) | $1.1 - 1.3$ | $8.0 - 25.0$ | illustrative_processing_range |
| Vacuum Tank Vacuum | $15 - 30\\text{ kPa}$ | N/A (Air Ring Pressure) | illustrative_processing_range |
| Haul-Off Line Speed | $2 - 15\\text{ m/min}$ | $20 - 100\\text{ m/min}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Extrudate Swell Test (ISO 11443)
1. **Capillary Rheometer Test**: Extrude HDPE melt at $190^\\circ\\text{C}$ through capillary die ($D = 1.0\\text{ mm}, L = 30\\text{ mm}$).
2. **Optical Swell Measurement**: Measure relaxed strand diameter $D_{\\text{relaxed}}$ using laser micrometer $10\\text{ mm}$ below die face.
3. **Calculation**: Compute $B = D_{\\text{relaxed}} / D_{\\text{die}}$ (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
An HDPE pipe extrusion die has an outer die diameter $D_{\\text{die}} = 32.0\\text{ mm}$ and pin core diameter $d_{\\text{die}} = 28.0\\text{ mm}$. The target finished pipe has outer diameter $D_{\\text{pipe}} = 25.0\\text{ mm}$ and wall thickness $t = 2.0\\text{ mm}$ ($d_{\\text{pipe}} = 21.0\\text{ mm}$). Melt exit velocity $v_{\\text{die-exit}} = 3.0\\text{ m/min}$.
1. Calculate annular die exit area $A_{\\text{die}}$.
2. Calculate target pipe cross-sectional area $A_{\\text{pipe}}$.
3. Calculate required area drawdown ratio $\\text{DDR}_{\\text{area}}$.
4. Calculate required haul-off puller speed $v_{\\text{haul-off}}$.

### Step-by-Step Solution

**Step 1: Calculate $A_{\\text{die}}$**
$$A_{\\text{die}} = \\frac{\\pi}{4} (D_{\\text{die}}^2 - d_{\\text{die}}^2) = \\frac{\\pi}{4} (32.0^2 - 28.0^2) = \\frac{\\pi}{4} (1024 - 784) = \\frac{\\pi}{4} (240) = 188.496 \\text{ mm}^2$$

**Step 2: Calculate $A_{\\text{pipe}}$**
$$A_{\\text{pipe}} = \\frac{\\pi}{4} (D_{\\text{pipe}}^2 - d_{\\text{pipe}}^2) = \\frac{\\pi}{4} (25.0^2 - 21.0^2) = \\frac{\\pi}{4} (625 - 441) = \\frac{\\pi}{4} (184) = 144.513 \\text{ mm}^2$$

**Step 3: Calculate $\\text{DDR}_{\\text{area}}$**
$$\\text{DDR}_{\\text{area}} = \\frac{A_{\\text{die}}}{A_{\\text{pipe}}} = \\frac{188.496}{144.513} = 1.3044$$

**Step 4: Calculate $v_{\\text{haul-off}}$**
$$v_{\\text{haul-off}} = v_{\\text{die-exit}} \\times \\text{DDR}_{\\text{area}} = 3.0 \\times 1.3044 = 3.913 \\text{ m/min}$$

*Reproduced Result*: $A_{\\text{die}} = 188.50\\text{ mm}^2$, $A_{\\text{pipe}} = 144.51\\text{ mm}^2$, $\\text{DDR}_{\\text{area}} = 1.304$, Haul-Off Speed = $3.91\\text{ m/min}$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Extruder Melt Flow"] --> B["Die Exit (Free Swell B = 1.15)"]
    B --> C["Vacuum Calibrator Tank (15-30 kPa)"]
    C --> D["Water Spray Cooling Tanks (15-20°C)"]
    D --> E["Haul-Off Puller (Speed v_haul = 3.91 m/min)"]
    E --> F["Finished Pipe (OD 25.0mm ± 0.1mm)"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What causes extrudate die swell upon exiting an extrusion die?**
   - A) High thermal expansion of solvent
   - B) Elastic recovery of molecular orientation stored during shear flow
   - C) Moisture evaporation at ambient pressure
   - D) Gravitational sagging
   - *Answer*: B. Elastic normal stress recovery causes extrudate expansion.

2. **How does increasing die land length-to-diameter ratio ($L/D_{die}$) affect die swell?**
   - A) Increases swell
   - B) Decreases swell by providing longer relaxation time
   - C) Has zero effect
   - D) Causes immediate melt fracture
   - *Answer*: B. Longer land length allows stresses to relax inside the die.

3. **Calculate haul-off speed if die exit velocity is $4.0\\text{ m/min}$ and area drawdown ratio is $1.25$.**
   - A) $3.2\\text{ m/min}$
   - B) $4.0\\text{ m/min}$
   - C) $5.0\\text{ m/min}$
   - D) $6.25\\text{ m/min}$
   - *Answer*: C. $v_{\\text{haul-off}} = 4.0 \\times 1.25 = 5.0\\text{ m/min}$.

4. **What is the primary function of the vacuum calibrator tank in pipe extrusion?**
   - A) To melt outer pipe surfaces
   - B) To pin extrudate outer diameter against sizing sleeve until frozen
   - C) To induce high molecular orientation
   - D) To measure melt pressure drop
   - *Answer*: B. Vacuum holds pipe outer diameter firmly against calibrator sleeve.

5. **If a die annular area is $200\\text{ mm}^2$ and target pipe area is $160\\text{ mm}^2$, what is $\\text{DDR}_{\\text{area}}$?**
   - A) $0.80$
   - B) $1.25$
   - C) $1.60$
   - D) $2.00$
   - *Answer*: B. $\\text{DDR}_{\\text{area}} = 200 / 160 = 1.25$.
`
};

// LESSON 5
const lesson5 = {
  slug: "smc-and-bmc-process-engineering-charge-pattern-cure-control",
  title: "SMC and BMC Process Engineering: Charge-Pattern Design, Cure Control and Defect Analysis",
  subject_id: SUBJECT_IDS["Polymer Processing"],
  summary: "Thermoset SMC/BMC compression moulding, charge coverage guidelines, press tonnage calculation, cure kinetics, and defect mitigation.",
  content: `# SMC and BMC Process Engineering: Charge-Pattern Design, Cure Control and Defect Analysis

> **Subject**: Polymer Processing  
> **Target Level**: Advanced  
> **Prerequisites**: Thermoplastics vs Thermosets: Structure and Behavior  

---

## 1. Why This Topic Matters
Sheet Moulding Compound (SMC) and Bulk Moulding Compound (BMC) are glass-fiber-reinforced unsaturated polyester thermosets widely used for high-strength automotive body panels and electrical enclosures. Mastering compression moulding press force calculation, charge pattern placement ($40\\% - 70\\%$ area coverage), and exothermic crosslinking cure cycles is critical to preventing defects such as fiber wash, porosity, and thermal warpage.

---

## 2. Core Engineering Principles

### 2.1 Charge Pattern Coverage Guidelines
Placing SMC sheets inside a heated compression mold requires optimizing charge coverage:
- *Recommended Charge Area*: $40\\% - 70\\%$ of total mold cavity projected area (illustrative_processing_range).
- *Too Small Charge ($< 40\\%$)*: Excessive flow length causes glass fiber separation ("fiber wash") and knit-line weakness.
- *Too Large Charge ($> 70\\%$)*: Traps air pockets and causes surface blisters due to insufficient flow path for air venting.

### 2.2 Mold Press Force Calculation
Required hydraulic press tonnage is calculated from projected part area, cavity moulding pressure, and safety factors:

$$\\text{Press Force (kN)} = A_{\\text{mould}} \\times P_{\\text{effective}} \\times S_{\\text{factor}}$$

Where $A_{\\text{mould}}$ is projected cavity area ($\\text{m}^2$), $P_{\\text{effective}}$ is moulding pressure ($\\text{kPa}$), and $S_{\\text{factor}} \\approx 1.15$ accounts for dynamic flow resistance.

---

## 3. Industrial Process Specifications

| Parameter | SMC Automotive Panel | BMC Electrical Component | Value Status |
|---|---|---|---|
| Mold Temperature | $140^\\circ\\text{C} - 160^\\circ\\text{C}$ | $150^\\circ\\text{C} - 170^\\circ\\text{C}$ | illustrative_processing_range |
| Injection/Closing Speed | $20 - 50\\text{ mm/s}$ | $10 - 30\\text{ mm/s}$ | illustrative_processing_range |
| Moulding Pressure | $5 - 12\\text{ MPa}$ ($50 - 120\\text{ bar}$) | $8 - 15\\text{ MPa}$ ($80 - 150\\text{ bar}$) | illustrative_processing_range |
| Cure Time | $60 - 120\\text{ s}$ per mm thickness | $30 - 90\\text{ s}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Cohesive Strength (ASTM D952)
1. **Specimen Preparation**: Bond $25.4\\times 25.4\\text{ mm}$ SMC test specimen between steel loading blocks.
2. **Tensile Loading**: Apply axial tension at $1.3\\text{ mm/min}$ until internal core shear failure.
3. **Data Recording**: Report peak cohesive stress in $\\text{MPa}$ (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
An SMC compression moulding tool produces a structural automotive tailgate.
- Projected part area $A_{\\text{mould}} = 0.85\\text{ m}^2$.
- Required effective moulding pressure $P_{\\text{effective}} = 10\\text{ MPa} = 10,000\\text{ kPa}$.
- Safety factor $S_{\\text{factor}} = 1.15$.
1. Calculate the required press force in $\\text{kN}$.
2. Convert press force to metric tonnes ($1\\text{ tonne} = 9.80665\\text{ kN}$).

### Step-by-Step Solution

**Step 1: Calculate Press Force in $\\text{kN}$**
$$\\text{Press Force (kN)} = A_{\\text{mould}} \\times P_{\\text{effective}} \\times S_{\\text{factor}}$$
$$\\text{Press Force} = 0.85 \\text{ m}^2 \\times 10,000 \\text{ kPa} \\times 1.15 = 8500 \\times 1.15 = 9,775 \\text{ kN}$$

**Step 2: Convert to Metric Tonnes**
$$\\text{Press Tonnage} = \\frac{9775 \\text{ kN}}{9.80665 \\text{ kN/tonne}} = 996.77 \\text{ tonnes}$$

*Reproduced Result*: Press Force = $9,775\\text{ kN} \\approx 996.8\\text{ metric tonnes}$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["SMC Sheet Cut (40-70% Cavity Area)"] --> B["Place Charge on Lower Heated Mold (150°C)"]
    B --> C["Rapid Press Closure (30 mm/s)"]
    C --> D["Melt Flow & Cavity Filling (10 MPa)"]
    D --> E["Exothermic Free-Radical Cure Dwell (90 s)"]
    E --> F["Press Opening & Ejection of Finished SMC Part"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **Why is a $40\\% - 70\\%$ charge coverage recommended for SMC compression moulding?**
   - A) To maximize resin degradation
   - B) To balance air venting against glass fiber separation ("fiber wash")
   - C) To reduce press tonnage to zero
   - D) To eliminate crosslinking initiators
   - *Answer*: B. Prevents trapped air while avoiding fiber separation.

2. **Calculate press tonnage for an SMC part with area $0.50\\text{ m}^2$, pressure $8.0\\text{ MPa}$ ($8000\\text{ kPa}$), safety factor $1.10$.**
   - A) $440\\text{ tonnes}$
   - B) $448.6\\text{ tonnes}$
   - C) $500\\text{ tonnes}$
   - D) $880\\text{ tonnes}$
   - *Answer*: B. $F = 0.50 \\times 8000 \\times 1.10 = 4400\\text{ kN} / 9.80665 = 448.6\\text{ tonnes}$.

3. **What defect occurs when glass fibers are pushed away from matrix resin during long flow paths?**
   - A) Blistering
   - B) Fiber wash
   - C) Warpage
   - D) Under-cure
   - *Answer*: B. Long matrix flow carries resin faster than heavy fibers, leaving resin-rich unreinforced zones.

4. **What is the typical mold temperature range for SMC compression moulding?**
   - A) $50^\\circ\\text{C} - 80^\\circ\\text{C}$
   - B) $140^\\circ\\text{C} - 160^\\circ\\text{C}$
   - C) $250^\\circ\\text{C} - 300^\\circ\\text{C}$
   - D) $400^\\circ\\text{C} - 450^\\circ\\text{C}$
   - *Answer*: B. Standard mold temperature for styrene-polyester free radical cure.

5. **In BMC processing, why are closed injection-compression tools sometimes preferred over open compression charges?**
   - A) To eliminate glass fibers completely
   - B) To automate dosing and reduce cycle time for complex 3D shapes
   - C) To lower moulding pressure to ambient
   - D) To increase cure time by 500%
   - *Answer*: B. Automated plunger dosing enables fast production of complex electrical parts.
`
};

// LESSON 6
const lesson6 = {
  slug: "rubber-compounding-fillers-carbon-black-and-additives",
  title: "Rubber Compounding: Fillers, Carbon Black, and Additives",
  subject_id: SUBJECT_IDS["Rubber Technology"],
  summary: "Compounding formulation, Banbury internal mixer fill factor, carbon black dispersion, and unit energy batch calculation.",
  content: `# Rubber Compounding: Fillers, Carbon Black, and Additives

> **Subject**: Rubber Technology  
> **Target Level**: Intermediate  
> **Prerequisites**: Natural Rubber vs Synthetic Rubber: Sources and Selection  

---

## 1. Why This Topic Matters
Uncompounded rubber lacks mechanical strength, thermal stability, and wear resistance. **Rubber compounding** combines base elastomers with reinforcing fillers (carbon black, precipitated silica), vulcanization packages (sulfur, accelerators, zinc oxide, stearic acid), and protective agents (antioxidants, antiozonants). Controlling internal mixer chamber fill factor ($FF = 0.65 - 0.75$) and unit energy consumption ($\\text{kWh/kg}$) is essential for uniform dispersion and reproducible cure behavior.

---

## 2. Core Formulation Principles

### 2.1 Internal Mixer Chamber Fill Factor ($FF$)
Internal Banbury mixers require precise volumetric loading:

$$\\text{Fill Factor } (FF) = \\frac{V_{\\text{compound}}}{V_{\\text{chamber}}}$$

Where $V_{\\text{compound}}$ is compound batch volume (L) and $V_{\\text{chamber}}$ is net free chamber volume (L).
- *Recommended $FF$ Range*: $0.65 - 0.75$ (illustrative_processing_range).
- *Batch Mass Calculation*:
  $$m_{\\text{batch}} = V_{\\text{chamber}} \\times FF \\times \\rho_{\\text{compound}}$$
  Where $\\rho_{\\text{compound}}$ is compound specific gravity ($\\text{kg/L}$).

### 2.2 Reinforcement & Carbon Black Grades
Carbon black reinforces rubber via physical adsorption and surface chemical bonding:
- **N220 / N330 (High Structure)**: High abrasion resistance for tyre treads.
- **N550 / N660 (Medium Structure)**: High extrudability and low heat build-up for carcass and hoses.

---

## 3. Formulating & Processing Parameters

| Parameter | Tyre Tread Formulation (phr) | Hose Compound (phr) | Value Status |
|---|---|---|---|
| Natural Rubber (NR) / SBR | $50 / 50$ | $100\\text{ NBR}$ | illustrative_processing_range |
| Carbon Black (N220 / N550) | $60\\text{ phr}$ | $40\\text{ phr}$ | illustrative_processing_range |
| Zinc Oxide / Stearic Acid | $5.0 / 2.0\\text{ phr}$ | $4.0 / 1.5\\text{ phr}$ | illustrative_processing_range |
| Internal Mixer Fill Factor | $0.70$ | $0.68$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Rubber Mixing (ASTM D3182)
1. **Equipment Setup**: Set Banbury mixer rotor speed to $50\\text{ rpm}$ and cooling water to $50^\\circ\\text{C}$.
2. **Masterbatch Pass**: Charge rubber, masticate 60s, add zinc oxide, stearic acid, carbon black in 2 splits, dump at $150^\\circ\\text{C}$.
3. **Final Pass**: Add sulfur and accelerators on 2-roll mill below $100^\\circ\\text{C}$ to prevent scorch (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A Banbury mixer has net chamber volume $V_{\\text{chamber}} = 160.0\\text{ Liters}$.
- Target fill factor $FF = 0.70$.
- Compound formulation total specific gravity $\\rho_{\\text{compound}} = 1.18\\text{ g/cm}^3 = 1.18\\text{ kg/L}$.
1. Calculate the required compound batch volume $V_{\\text{compound}}$ in Liters.
2. Calculate the required total batch mass $m_{\\text{batch}}$ in $\\text{kg}$.
3. If the formulation calls for $60.0\\text{ phr}$ carbon black on a $100.0\\text{ phr}$ total polymer base (total formulation = $180.0\\text{ phr}$), calculate the mass of carbon black required per batch.

### Step-by-Step Solution

**Step 1: Calculate $V_{\\text{compound}}$**
$$V_{\\text{compound}} = V_{\\text{chamber}} \\times FF = 160.0 \\times 0.70 = 112.0 \\text{ Liters}$$

**Step 2: Calculate $m_{\\text{batch}}$**
$$m_{\\text{batch}} = V_{\\text{compound}} \\times \\rho_{\\text{compound}} = 112.0 \\text{ L} \\times 1.18 \\text{ kg/L} = 132.16 \\text{ kg}$$

**Step 3: Calculate Carbon Black Mass**
$$\\text{Mass of Carbon Black} = m_{\\text{batch}} \\times \\frac{\\text{phr}_{\\text{black}}}{\\text{Total phr}} = 132.16 \\times \\frac{60.0}{180.0} = 132.16 \\times 0.3333 = 44.053 \\text{ kg}$$

*Reproduced Result*: $V_{\\text{compound}} = 112.0\\text{ L}$, $m_{\\text{batch}} = 132.16\\text{ kg}$, Carbon Black Mass = $44.05\\text{ kg}$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Raw Natural Rubber Mastication (60s)"] --> B["Add Zinc Oxide & Stearic Acid"]
    B --> C["Add Carbon Black (Split 1 & 2)"]
    C --> D["Dump Masterbatch at 150°C"]
    D --> E["Cool Masterbatch Sheet"]
    E --> F["Add Sulfur & Accelerators on 2-Roll Mill (<100°C)"]
    F --> G["Final Curative Sheet to Rheometer QA"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the recommended internal mixer chamber fill factor range ($FF$) for efficient shear mixing?**
   - A) $0.20 - 0.40$
   - B) $0.65 - 0.75$
   - C) $0.90 - 1.00$
   - D) $1.20 - 1.50$
   - *Answer*: B. Ensures optimal ram pressure and shear mastication without overloading.

2. **Calculate batch mass for a $100\\text{ L}$ mixer with $FF = 0.72$ and compound specific gravity $1.20\\text{ kg/L}$.**
   - A) $72.0\\text{ kg}$
   - B) $86.4\\text{ kg}$
   - C) $120.0\\text{ kg}$
   - D) $144.0\\text{ kg}$
   - *Answer*: B. $m = 100 \\times 0.72 \\times 1.20 = 86.4\\text{ kg}$.

3. **Why are sulfur and accelerators added in a separate second mixing pass at temperatures below $100^\\circ\\text{C}$?**
   - A) To prevent premature vulcanization (scorch)
   - B) To evaporate carbon black moisture
   - C) To melt zinc oxide
   - D) To reduce compound density
   - *Answer*: A. High temperatures during initial masterbatch mixing would trigger premature scorch.

4. **Which carbon black grade provides higher abrasion resistance for passenger car tyre treads?**
   - A) N660
   - B) N220
   - C) Thermal black N990
   - D) Acetylene black
   - *Answer*: B. Fine particle size N220 provides superior reinforcing abrasion resistance.

5. **What is the meaning of "phr" in rubber compounding terminology?**
   - A) Percentage per hundred rubber
   - B) Parts per hundred rubber (by weight relative to 100 parts total polymer)
   - C) Pressure per hour rating
   - D) Polymers per hundred resin
   - *Answer*: B. Standard formulation ratio based on 100 parts total base polymer.
`
};

// LESSON 7
const lesson7 = {
  slug: "latex-technology-processing-and-applications",
  title: "Latex Technology: Processing and Applications",
  subject_id: SUBJECT_IDS["Rubber Technology"],
  summary: "Natural rubber latex centrifugation, compound maturation, coagulant dipping process parameters, wet leaching, and film thickness control.",
  content: `# Latex Technology: Processing and Applications

> **Subject**: Rubber Technology  
> **Target Level**: Intermediate  
> **Prerequisites**: Natural Rubber vs Synthetic Rubber: Sources and Selection  

---

## 1. Why This Topic Matters
Natural Rubber Latex (NRL) is a colloidal aqueous dispersion of polyisoprene particles ($30\\% - 40\\%$ dry rubber content as harvested). Processing field latex into 60% DRC concentrated latex and dipping thin-walled dip products (medical gloves, condoms, catheters) requires strict control over latex maturation kinetics, coagulant dipping parameters, and wet-leaching to minimize extractable protein allergenicity.

---

## 2. Core Process Engineering Principles

### 2.1 Latex Maturation & Prevulcanization
Compounded latex (latex + sulfur + ZDEC/ZDBC accelerators + ZnO dispersion) must undergo controlled maturation:
- *Maturation Conditions*: Stirring at $25^\\circ\\text{C} - 30^\\circ\\text{C}$ for $24 - 48\\text{ hours}$ (illustrative_processing_range).
- *Maturation Parameters*: Maturation rate depends on temperature, pH ($10.0 - 10.5$), stabilizer system (potassium hydroxide / oleate), compound age, and viscosity buildup.

### 2.2 Coagulant Dipping Physics & Wall Thickness
Dipping ceramic formers into coagulant solution ($\\text{Ca(NO}_3)_2$) destabilizes colloidal particles via ionic charge neutralization:

$$t_{\\text{film}} \\propto \\sqrt{\\text{Dwell Time}}, \\quad t_{\\text{film}} \\propto \\frac{[\\text{Ca}^{2+}]}{v_{\\text{withdrawal}}}$$

Dipping variables: Former preheat temp ($60^\\circ\\text{C} - 70^\\circ\\text{C}$), coagulant concentration ($10\\% - 20\\%$), dwell time ($5 - 15\\text{ s}$), and withdrawal speed ($5 - 15\\text{ mm/s}$ to prevent teardrop runs).

---

## 3. Process Control Specifications

| Parameter | Examination Glove Line | Condom Production Line | Value Status |
|---|---|---|---|
| Latex DRC | $45\\% - 50\\%$ | $52\\% - 55\\%$ | illustrative_processing_range |
| Latex pH | $10.0 - 10.5$ | $10.2 - 10.6$ | illustrative_processing_range |
| Former Preheat Temp | $60^\\circ\\text{C} - 70^\\circ\\text{C}$ | $55^\\circ\\text{C} - 65^\\circ\\text{C}$ | illustrative_processing_range |
| Wet Leaching Water Temp | $60^\\circ\\text{C} - 70^\\circ\\text{C}$ | $60^\\circ\\text{C} - 70^\\circ\\text{C}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Extractable Protein Content (EN 455-3)
1. **Extraction**: Extract $1.0\\text{ g}$ glove sample in $10\\text{ mL}$ phosphate buffered saline for 2 hours at $25^\\circ\\text{C}$.
2. **Assay**: Quantify water-soluble protein concentration using Modified Lowry assay.
3. **Requirement**: Extractable protein $< 50\\text{ }\\mu\\text{g/g}$ (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A medical glove line dips ceramic formers into 60% DRC latex compound.
- Former surface area $A = 0.080\\text{ m}^2$ ($800\\text{ cm}^2$).
- Wet gel thickness deposited $t_{\\text{wet}} = 0.25\\text{ mm} = 0.025\\text{ cm}$.
- Latex compound wet density $\\rho_{\\text{wet}} = 0.96\\text{ g/cm}^3$.
- Total dry rubber content $\\text{DRC} = 55\\%$ ($0.55$).
1. Calculate total wet gel volume deposited per glove in $\\text{cm}^3$.
2. Calculate total wet gel mass per glove in grams.
3. Calculate final dry rubber mass per glove in grams after vulcanization drying.

### Step-by-Step Solution

**Step 1: Calculate Wet Gel Volume**
$$V_{\\text{wet}} = A \\times t_{\\text{wet}} = 800 \\text{ cm}^2 \\times 0.025 \\text{ cm} = 20.0 \\text{ cm}^3$$

**Step 2: Calculate Wet Gel Mass**
$$m_{\\text{wet}} = V_{\\text{wet}} \\times \\rho_{\\text{wet}} = 20.0 \\text{ cm}^3 \\times 0.96 \\text{ g/cm}^3 = 19.20 \\text{ grams}$$

**Step 3: Calculate Dry Glove Mass**
$$m_{\\text{dry}} = m_{\\text{wet}} \\times \\text{DRC} = 19.20 \\text{ g} \\times 0.55 = 10.56 \\text{ grams}$$

*Reproduced Result*: Wet Gel Volume = $20.0\\text{ cm}^3$, Wet Mass = $19.20\\text{ g}$, Dry Glove Mass = $10.56\\text{ g}$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Clean Ceramic Formers"] --> B["Preheat Former (60-70°C)"]
    B --> C["Coagulant Dip (Ca(NO3)2 15%)"]
    C --> D["Latex Dip (55% DRC Matured Compound)"]
    D --> E["Gelling & Wet Leaching (60°C Water Tank)"]
    E --> F["Beading & Vulcanization Oven (120°C, 20 min)"]
    F --> G["Post-Leaching, Stripping & Quality Inspection"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the standard Dry Rubber Content (DRC) of commercial concentrated natural rubber latex?**
   - A) $30\\%$
   - B) $60\\%$
   - C) $85\\%$
   - D) $99\\%$
   - *Answer*: B. Centrifugation concentrates field latex ($30\\%$) to $60\\%$ DRC.

2. **Why is wet leaching ($60^\\circ\\text{C}$ water bath) mandatory in medical glove manufacturing?**
   - A) To increase former speed
   - B) To extract water-soluble proteins and excess compounding chemicals to prevent allergies
   - C) To vulcanize polyisoprene chains
   - D) To add color pigments
   - *Answer*: B. Removes extractable latex proteins responsible for Type I allergic reactions.

3. **Calculate dry glove mass if wet gel volume is $15.0\\text{ cm}^3$, density is $0.95\\text{ g/cm}^3$, and DRC is $50\\%$.**
   - A) $7.125\\text{ g}$
   - B) $14.25\\text{ g}$
   - C) $15.00\\text{ g}$
   - D) $30.00\\text{ g}$
   - *Answer*: A. $m_{\\text{dry}} = 15.0 \\times 0.95 \\times 0.50 = 7.125\\text{ g}$.

4. **What chemical compound is commonly used as a coagulant in latex dipping?**
   - A) Sodium chloride
   - B) Calcium nitrate $\\text{Ca(NO}_3)_2$
   - C) Sulfuric acid
   - D) Titanium dioxide
   - *Answer*: B. Calcium ions effectively destabilize negatively charged latex particles.

5. **How does former withdrawal speed affect dipped film uniformity?**
   - A) Faster withdrawal makes thinner, uniform films
   - B) Too fast withdrawal causes teardrops and uneven wall thickness
   - C) Withdrawal speed has zero physical effect
   - D) Slower withdrawal increases latex pH
   - *Answer*: B. Slow, controlled withdrawal allows excess liquid to drain smoothly without teardrop flaws.
`
};

// LESSON 8
const lesson8 = {
  slug: "rubber-processing-mixing-calendering-and-extrusion",
  title: "Rubber Processing: Mixing, Calendering, and Extrusion",
  subject_id: SUBJECT_IDS["Rubber Technology"],
  summary: "Banbury internal mixing energy integration, calendering roll-nip shear rate modeling, and rubber extrusion die flow.",
  content: `# Rubber Processing: Mixing, Calendering, and Extrusion

> **Subject**: Rubber Technology  
> **Target Level**: Intermediate  
> **Prerequisites**: Natural Rubber vs Synthetic Rubber: Sources and Selection  

---

## 1. Why This Topic Matters
Industrial rubber processing converts raw compounding ingredients into semi-finished components (calendered tyre cord sheets, extruded tread profiles, hoses). Quantitative control over internal mixer specific energy ($\\text{kWh/kg}$) and calender roll-nip shear rate ($\\dot{\\gamma}$) is essential for maintaining melt viscosity stability and preventing thermal scorch.

---

## 2. Core Process Engineering Principles

### 2.1 Internal Mixer Specific Energy Integration
Specific mixing energy $E_{\\text{specific}}$ is calculated by integrating instantaneous motor power $P(t)$ over total mixing cycle time:

$$E_{\\text{specific}} = \\frac{\\int_{0}^{t_{\\text{dump}}} P(t) \\, dt}{m_{\\text{batch}}}$$

When power is measured in $\\text{kW}$, time in seconds ($s$), and batch mass in $\\text{kg}$, the exact conversion to $\\text{kWh/kg}$ is:

$$E_{\\text{specific}} (\\text{kWh/kg}) = \\frac{1}{3600 \\times m_{\\text{batch}}} \\int_{0}^{t_{\\text{dump}}} P(t) \\, dt$$

*Simplified Average Power Approximation*: $E_{\\text{specific}} \\approx \\frac{P_{\\text{avg}} \\times t_{\\text{mix}}}{3600 \\times m_{\\text{batch}}}$.

### 2.2 Calender Roll-Nip Shear Rate Model
For two calender rolls of radii $R$ rotating with surface velocities $U_1$ and $U_2$ separated by a minimum nip gap $h_0$, the peak nominal shear rate $\\dot{\\gamma}$ is estimated by:

$$\\dot{\\gamma} \\approx \\frac{|U_1 - U_2|}{h_0}$$

*Model Assumptions*: (1) Approximately Newtonian fluid behavior, (2) Locally parallel roll surfaces at minimum gap, (3) Constant gap $h_0$, (4) No wall slip at roll surfaces, (5) Negligible pressure-flow contribution for nominal estimate.

---

## 3. Equipment Operating Parameters

| Equipment | Parameter | Operating Range | Value Status |
|---|---|---|---|
| Banbury Mixer | Specific Energy Input | $0.15 - 0.35\\text{ kWh/kg}$ | illustrative_processing_range |
| 4-Roll Calender | Friction Ratio ($U_1 : U_2$) | $1.0 : 1.0 - 1.5 : 1.0$ | illustrative_processing_range |
| Calender | Roll Nip Gap ($h_0$) | $0.3 - 1.5\\text{ mm}$ | illustrative_processing_range |
| Rubber Extruder | Barrel Temperature | $70^\\circ\\text{C} - 100^\\circ\\text{C}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Mooney Viscosity & Scorch (ASTM D1646)
1. **Sample Prep**: Die out $50\\text{ mm}$ disc of unvulcanized rubber compound.
2. **Mooney Test**: Run large rotor ($ML 1+4$) at $100^\\circ\\text{C}$ for 4 minutes.
3. **Scorch Time**: Measure $t_5$ (time for 5 Mooney unit rise above minimum) (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A Banbury internal mixer processes a rubber compound batch of mass $m_{\\text{batch}} = 150.0\\text{ kg}$.
- Average motor power during mixing $P_{\\text{avg}} = 180.0\\text{ kW}$.
- Total mixing cycle time $t_{\\text{mix}} = 240.0\\text{ seconds}$.
- A 4-roll calender coats fabric with roll speeds $U_1 = 15.0\\text{ m/min} = 0.25\\text{ m/s}$ and $U_2 = 12.0\\text{ m/min} = 0.20\\text{ m/s}$ at nip gap $h_0 = 0.50\\text{ mm} = 0.0005\\text{ m}$.

Calculate:
1. The approximate specific mixing energy $E_{\\text{specific}}$ in $\\text{kWh/kg}$.
2. The peak nominal shear rate $\\dot{\\gamma}$ in the calender nip gap.

### Step-by-Step Solution

**Step 1: Calculate Specific Energy $E_{\\text{specific}}$**
$$E_{\\text{specific}} = \\frac{P_{\\text{avg}} \\times t_{\\text{mix}}}{3600 \\times m_{\\text{batch}}} = \\frac{180.0 \\times 240.0}{3600 \\times 150.0} = \\frac{43200}{540000} = 0.080 \\text{ kWh/kg}$$

**Step 2: Calculate Calender Shear Rate $\\dot{\\gamma}$**
$$\\dot{\\gamma} = \\frac{|U_1 - U_2|}{h_0} = \\frac{|0.25 - 0.20|}{0.0005} = \\frac{0.05}{0.0005} = 100.0 \\text{ s}^{-1}$$

*Reproduced Result*: Specific Energy = $0.080\\text{ kWh/kg}$, Calender Shear Rate = $100.0\\text{ s}^{-1}$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Raw Polymer & Fillers Feed"] --> B["Banbury Internal Mixer (Energy 0.08 kWh/kg)"]
    B --> C["Dump Compound to 2-Roll Sheet Mill"]
    C --> D["Feed 4-Roll Calender (Nip Gap 0.5mm, Shear 100 s-1)"]
    D --> E["Textile/Steel Cord Friction Coating"]
    E --> F["Cooling Drums & Batch-Off Stacker"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the correct unit conversion factor when calculating specific energy ($\\text{kWh/kg}$) from power in $\\text{kW}$ and mixing time in seconds?**
   - A) Multiply by 60
   - B) Divide by 3600 $\\times$ batch mass ($\\text{kg}$)
   - C) Divide by 1000
   - D) Multiply by 9.81
   - *Answer*: B. $1\\text{ kWh} = 3600\\text{ kJ} = 3600\\text{ kW}\\cdot\\text{s}$.

2. **Calculate specific mixing energy for a $120\\text{ kg}$ batch mixed at average power $200\\text{ kW}$ for $180\\text{ seconds}$.**
   - A) $0.0833\\text{ kWh/kg}$
   - B) $0.1500\\text{ kWh/kg}$
   - C) $0.2500\\text{ kWh/kg}$
   - D) $1.0000\\text{ kWh/kg}$
   - *Answer*: A. $E = (200 \\times 180) / (3600 \\times 120) = 36000 / 432000 = 0.0833\\text{ kWh/kg}$.

3. **In calendering, what is the nominal shear rate for roll speeds $0.30\\text{ m/s}$ and $0.20\\text{ m/s}$ at nip gap $0.5\\text{ mm}$ ($0.0005\\text{ m}$)?**
   - A) $10\\text{ s}^{-1}$
   - B) $50\\text{ s}^{-1}$
   - C) $200\\text{ s}^{-1}$
   - D) $1000\\text{ s}^{-1}$
   - *Answer*: C. $\\dot{\\gamma} = |0.30 - 0.20| / 0.0005 = 0.10 / 0.0005 = 200\\text{ s}^{-1}$.

4. **What standard test measures unvulcanized rubber scorch safety time ($t_5$)?**
   - A) ASTM D638 Tensile
   - B) ASTM D1646 Mooney Viscometer
   - C) ISO 178 Flexural
   - D) ASTM D2240 Durometer
   - *Answer*: B. Mooney viscometer measures $t_5$ scorch time at $120^\\circ\\text{C}-140^\\circ\\text{C}$.

5. **Which assumption is required for the simplified calender nip shear rate model $\\dot{\\gamma} \\approx |U_1 - U_2| / h_0$?**
   - A) Highly turbulent turbulent flow
   - B) Zero wall slip and locally parallel roll surfaces
   - C) Infinite gap height
   - D) 100% volumetric expansion
   - *Answer*: B. Assumes zero wall slip at roll surfaces.
`
};

module.exports = { lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8 };
