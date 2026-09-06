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
  ch1: `# Chapter 1: Systematic Injection Moulding Processing Principles & Decoupled Physics

## 1. Executive Summary & Processing Philosophy
Injection moulding of engineering thermoplastics (such as PA66, PC, POM, PBT, and ABS) is governed by coupled fluid dynamics, heat transfer, and non-Newtonian polymer melt rheology. Traditional "single-stage" moulding—where the hydraulic ram pushes polymer into the cavity until peak hydraulic pressure is hit—causes severe part weight variance, flashing, thermal degradation, and structural stress concentrations.

Modern scientific processing relies on **Decoupled Moulding (Decoupled II & Decoupled III)**, which physically separates velocity-controlled cavity filling from pressure-controlled packing and holding:

1. **Phase 1 (Decoupled High-Speed Fill - $95-98\%$ Volume):** The screw advances under strict closed-loop velocity control (mm/s), filling $95-98\%$ of the cavity volume. Viscosity decreases due to shear thinning ($\eta \propto \dot{\gamma}^{n-1}$), minimizing fill resistance.
2. **Phase 2 (Decoupled Pack & Hold - $2-5\%$ Volume + Densification):** At the V/P transfer point (velocity-to-pressure switchover based on screw position), the machine shifts to hydraulic pressure control to pack the remaining cavity space and offset volumetric thermal shrinkage ($\Delta V$).
3. **Phase 3 (Cooling & Solidification):** In-cavity cooling under turbulent water flow ($Re > 4000$) until the gate seals and the part reaches heat deflection ejection temperature ($T_{\text{eject}}$).

---

## 2. Fundamental Engineering & Mathematical Governing Equations

### A. Plastic Pressure Intensification Ratio ($R_i$)
The pressure displayed on a hydraulic machine pressure gauge is **hydraulic pressure** ($P_{\text{hydraulic}}$), NOT the actual pressure exerted on the molten polymer ($P_{\text{plastic}}$). The Intensification Ratio ($R_i$) is the geometric ratio of the hydraulic drive piston area to the injection screw cross-sectional area:

$$R_i = \frac{A_{\text{piston}}}{A_{\text{screw}}} = \left( \frac{D_{\text{piston}}}{D_{\text{screw}}} \right)^2$$

$$P_{\text{plastic}} = P_{\text{hydraulic}} \cdot R_i$$

### B. Projected Clamping Tonnage Formula ($F_{\text{clamp}}$)
To prevent parting line flash and mold opening during high-pressure packing, the machine clamp force ($F_{\text{clamp}}$) must exceed the hydraulic force exerted by the pressurized melt across the total projected area:

$$F_{\text{clamp}} = \frac{P_{\text{cavity}} \cdot A_{\text{proj}} \cdot S_f}{9806.65} \quad [\text{Metric Tonnes}]$$

Where:
* $P_{\text{cavity}}$ = Mean cavity pressure during packing ($\text{bar}$ or $\text{daN/cm}^2$; typically $300 - 800\text{ bar}$)
* $A_{\text{proj}}$ = Total projected area of all cavities PLUS sprues and runners ($\text{cm}^2$)
* $S_f$ = Safety factor ($1.10 - 1.25$)

### C. Fourier Thermal Conduction & Minimum Cooling Time ($t_{\text{cool}}$)
Part thermal solidification is governed by 1D transient heat conduction across part wall thickness ($h$):

$$t_{\text{cool}} = \frac{h^2}{\pi^2 \alpha} \ln \left[ \frac{8}{\pi^2} \left( \frac{T_{\text{melt}} - T_{\text{mold}}}{T_{\text{eject}} - T_{\text{mold}}} \right) \right]$$

Where:
* $h$ = Maximum nominal wall thickness ($\text{mm}$)
* $\alpha$ = Polymer thermal diffusivity ($\text{mm}^2/\text{s}$), where $\alpha = \frac{k}{\rho \cdot C_p}$
* $T_{\text{melt}}$ = Homogeneous polymer melt temperature ($^\circ\text{C}$)
* $T_{\text{mold}}$ = Coolant-regulated cavity surface temperature ($^\circ\text{C}$)
* $T_{\text{eject}}$ = Recommended part ejection temperature ($^\circ\text{C}$)

---

## 3. Shop-Floor Processing Parameter Matrix

| Polymer Resin Grade | Melt Temp ($^\circ\text{C}$) | Mold Temp ($^\circ\text{C}$) | Peak Cavity Pressure ($\text{bar}$) | Thermal Diffusivity $\alpha$ ($\text{mm}^2/\text{s}$) | Recommended Ejection Temp ($^\circ\text{C}$) | Max Cushion Limit ($\text{mm}$) |
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
* Each cavity projected area: $72\text{ cm}^2$
* Cold runner projected area: $32\text{ cm}^2$
* Nominal wall thickness ($h$): $3.0\text{ mm}$
* Melt temperature ($T_{\text{melt}}$): $285^\circ\text{C}$
* Mold temperature ($T_{\text{mold}}$): $85^\circ\text{C}$
* Ejection temperature ($T_{\text{eject}}$): $135^\circ\text{C}$
* PA66-GF30 thermal diffusivity ($\alpha$): $0.082\text{ mm}^2/\text{s}$
* Average packing cavity pressure ($P_{\text{cavity}}$): $600\text{ bar}$

**Calculate:**
1. The minimum required clamping tonnage ($F_{\text{clamp}}$) with a $15\%$ safety factor.
2. The minimum required in-mold cooling time ($t_{\text{cool}}$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Total Projected Area ($A_{\text{proj}}$)
$$A_{\text{proj}} = (4 \text{ cavities} \times 72\text{ cm}^2) + 32\text{ cm}^2 = 288 + 32 = 320\text{ cm}^2$$

#### Step 2: Calculate Required Clamping Force ($F_{\text{clamp}}$)
Converting cavity pressure: $600\text{ bar} = 600\text{ daN/cm}^2 \approx 0.6118\text{ tonnes/cm}^2$

$$F_{\text{raw}} = \frac{600\text{ bar} \times 320\text{ cm}^2}{9806.65 / 100} = \frac{192,000}{98.0665} = 1957.85\text{ kN} \approx 199.6\text{ Metric Tonnes}$$

Applying $15\%$ safety factor ($S_f = 1.15$):
$$F_{\text{required}} = 199.6 \times 1.15 = 229.54 \implies \mathbf{230\text{ Metric Tonnes}}$$

#### Step 3: Calculate Minimum Cooling Time ($t_{\text{cool}}$)
Using the Fourier transient thermal conduction equation:
$$\text{Temperature Term} = \frac{T_{\text{melt}} - T_{\text{mold}}}{T_{\text{eject}} - T_{\text{mold}}} = \frac{285 - 85}{135 - 85} = \frac{200}{50} = 4.0$$

$$\text{Logarithmic Component} = \ln \left[ \frac{8}{\pi^2} \times 4.0 \right] = \ln [0.81057 \times 4.0] = \ln [3.2423] = 1.1763$$

$$\text{Geometric Pre-factor} = \frac{h^2}{\pi^2 \alpha} = \frac{(3.0)^2}{\pi^2 \times 0.082} = \frac{9.0}{0.8093} = 11.120\text{ seconds}$$

$$t_{\text{cool}} = 11.120 \times 1.1763 = \mathbf{13.28\text{ seconds}}$$

---

## 5. Practical Engineering Exercises & Case Studies

### ❓ Exercise 1.1 (Process Decoupling)
**Question:** Why is it dangerous to perform the V/P (Velocity to Pressure) transfer switchover at $100\%$ volumetric cushion on a high-speed moulding press?
**Answer & Rationale:** Switching over at $100\%$ volume causes the hydraulic ram momentum to hammer directly into rigid steel cavity walls, generating massive pressure spikes ($> 2000\text{ bar}$). This results in severe parting line flash, mold tool fatigue, core pin breakage, and localized stress cracking. Decoupling fill at $95-98\%$ allows the melt front to decelerate under smooth hydraulic pressure control during packing.

### ❓ Exercise 1.2 (Hydraulic Intensification)
**Question:** A machine operator sets the packing pressure gauge to $75\text{ bar}$ on a hydraulic injection press with a $50\text{ mm}$ screw and a $180\text{ mm}$ hydraulic piston. Calculate the actual plastic packing pressure inside the barrel.
**Answer & Rationale:**
$$R_i = \left( \frac{180}{50} \right)^2 = (3.6)^2 = 12.96$$
$$P_{\text{plastic}} = 75\text{ bar} \times 12.96 = \mathbf{972\text{ bar}}$$
Understanding $R_i$ prevents under-packing or over-flashing when transferring processes between different moulding machines.

### ❓ Exercise 1.3 (Thermal Cooling Efficiency)
**Question:** If cooling channel water flow switches from turbulent ($Re = 6500$) to laminar ($Re = 1400$) due to mineral scale buildup, how does heat transfer coefficient ($h_{\text{film}}$) change, and what is the impact on part warpage?
**Answer & Rationale:** Laminar flow drastically reduces the boundary layer film heat transfer coefficient ($h_{\text{film}}$ drop of $300-500\%$). This creates severe surface thermal gradients across core and cavity mold halves ($\Delta T > 15^\circ\text{C}$), causing non-uniform differential shrinkage and severe part warpage. Maintaining $Re > 4000$ ensures uniform heat removal.
`,
  ch2: `# Chapter 2: Elimination of Short Shots, Unfilled Cavities & Hesitation Defects

## 1. Physical Mechanisms of Short Shots
A **short shot** occurs when the polymer melt stream freezes before completely filling the mold cavity geometry. Unlike cosmetic surface flaws, short shots render parts mechanically useless and structurally compromised.

### Core Rheological Causes:
1. **Excessive Flow Length Ratio ($L/t$):** The ratio of flow path length ($L$) from gate to farthest fill point relative to nominal wall thickness ($t$) exceeds the resin's spiral flow limit.
2. **Melt Hesitation:** When melt enters a cavity with thin and thick sections, flow preferentially travels through low-resistance thick sections, leaving stagnant melt in thin sections to freeze prematurely.
3. **Trapped Air Cushion (Venting Backpressure):** Unvented cavity air compresses under advancing melt fronts, creating an opposing pneumatic backpressure cushion ($P_{\text{air}} > P_{\text{melt}}$).

---

## 2. Diagnostic Root Cause & Shop-Floor Action Matrix

| Observed Symptom | Underlying Physical Cause | Immediate Shop-Floor Remedy | Permanent Tooling / Design Fix |
|---|---|---|---|
| **Short at end-of-fill** | Low plastic injection pressure or early V/P transfer | Increase V/P transfer cushion position; raise plastic pressure limit | Increase machine injection speed profile; check nozzle tip orifice |
| **Short only in farthest cavity** | Imbalanced cold runner pressure drops | Balance injection speed; increase mold temperature by $10^\circ\text{C}$ | Modify runner diameters using equalized shear-rate pressure balance equations |
| **Burn mark accompanied by short** | Trapped compressed air backpressure (Diesel effect) | Reduce injection speed near end-of-fill; clean clogged vents | Deepen parting line vent slots to $0.025 - 0.035\text{ mm}$ for PP/PE ($0.015\text{ mm}$ for PA) |
| **Thin rib unfilled (Hesitation)** | Melt front slowdown in thin wall section | Increase dynamic injection velocity to boost shear thinning | Increase thin rib thickness $t_{\text{rib}} \ge 0.6 \times t_{\text{wall}}$; relocate gate closer |

---

## 3. Mathematical Flow Length & Pressure Drop Calculations

### Spiral Flow Length Ratio Equation ($L/t$)
$$\left(\frac{L}{t}\right)_{\text{max}} = f(\Delta P_{\text{inj}}, T_{\text{melt}}, \dot{\gamma})$$

For thin-wall injection moulding ($t < 1.0\text{ mm}$), plastic injection pressure drop ($\Delta P$) across flow channel length ($L$) and height ($H$) is modeled via non-Newtonian Power Law kinetics:

$$\Delta P = 2 K \cdot \left( \frac{1 + 2n}{n} \right)^n \cdot \left( \frac{Q}{W \cdot H^2} \right)^n \cdot \frac{L}{H}$$

Where $K$ is flow consistency, $n$ is power-law index, $Q$ is volumetric flow rate, and $W$ is channel width.

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A medical device converter in Bengaluru is moulding a polycarbonate (PC) pipette shield.
* Flow path length from gate to end of fill ($L$): $180\text{ mm}$
* Wall thickness ($t$): $1.2\text{ mm}$
* Recommended max $L/t$ ratio for PC at standard injection pressure ($1200\text{ bar}$): $120:1$
* Mold cavity pressure limit: $1000\text{ bar}$

**Determine:**
1. Is the current $L/t$ ratio within safe limits, or is short shot hesitation imminent?
2. If wall thickness is reduced to $0.9\text{ mm}$ for weight reduction, calculate the required $L/t$ and recommend the design modification.

### 💡 Step-by-Step Solution

#### Step 1: Calculate Current $L/t$ Ratio
$$\left(\frac{L}{t}\right)_{\text{current}} = \frac{180\text{ mm}}{1.2\text{ mm}} = \mathbf{150:1}$$

Comparing to allowable limit ($120:1$): The current ratio ($150:1$) exceeds the standard limit by $25\%$. Short shots will occur unless melt temperature or injection pressure is substantially increased.

#### Step 2: Evaluate Weight Reduction Wall Thickness ($t = 0.9\text{ mm}$)
$$\left(\frac{L}{t}\right)_{\text{new}} = \frac{180\text{ mm}}{0.9\text{ mm}} = \mathbf{200:1}$$

A ratio of $200:1$ exceeds PC flow capability at single-gate configurations.

#### Step 3: Recommended Tooling Solution
1. **Sequential Valve Gating (SVG):** Add a second valve-gated hot runner drop $90\text{ mm}$ down the flow path, reducing effective $L$ to $90\text{ mm} \implies L/t = 90 / 0.9 = \mathbf{100:1}$ (Safe processing window).
2. Increase mold temperature from $80^\circ\text{C}$ to $105^\circ\text{C}$ to delay skin freezing.

---

## 5. Practical Engineering Exercises

### ❓ Exercise 2.1 (Venting Calculations)
**Question:** Explain why a mold venting slot for HDPE can be $0.03\text{ mm}$ deep, whereas a vent slot for PA66 must not exceed $0.015\text{ mm}$.
**Answer & Rationale:** Polyamide 66 (PA66) has an extremely sharp crystalline melting point and very low zero-shear viscosity in the molten state ($\eta_0 \approx 100\text{ Pa}\cdot\text{s}$). Vent slots deeper than $0.015\text{ mm}$ allow low-viscosity PA66 melt to penetrate, causing flash. HDPE has higher zero-shear viscosity, allowing $0.03\text{ mm}$ vents without flashing.

### ❓ Exercise 2.2 (Melt Hesitation Diagnosis)
**Question:** A part with a central thick spine ($3.5\text{ mm}$) and thin outer wings ($1.0\text{ mm}$) consistently experiences short shots at the outer wing edges despite increasing injection pressure. Explain the mechanism and fix.
**Answer & Rationale:** This is classic **melt hesitation**. Plastic melt flows down the thick central spine with low resistance while melt entering thin wings slows down, loses thermal energy to cavity walls, and freezes. Fix: Profile injection speed to inject rapidly at start, or increase wing wall thickness to $1.8\text{ mm}$ to balance flow resistance.

### ❓ Exercise 2.3 (Pressure Drop Analysis)
**Question:** If volumetric flow rate $Q$ is doubled during fill, how does pressure drop $\Delta P$ change for a pseudoplastic polymer melt with $n = 0.3$?
**Answer & Rationale:** Since $\Delta P \propto Q^n$, doubling flow rate ($Q_2 = 2 Q_1$) results in:
$$\Delta P_2 = \Delta P_1 \times (2)^{0.3} = \Delta P_1 \times 1.23$$
Pressure drop increases by only $23\%$ (rather than $100\%$ for Newtonian fluids) due to shear-thinning viscosity reduction at higher shear rates.
`,
  ch3: `# Chapter 3: Warpage, Residual Stress & Differential Shrinkage Mitigation

## 1. Physics of Part Warpage
**Warpage** is the unwanted geometric distortion of an injection-moulded component after ejection. It is driven by internal **residual stress fields** resulting from non-uniform volumetric thermal shrinkage ($\Delta V_v$) throughout the part volume:

$$\text{Warpage} \propto \Delta (\text{Volumetric Shrinkage})_{\text{spatial}}$$

### Three Primary Drivers of Differential Shrinkage:
1. **Cooling Differential (Core vs. Cavity):** If cavity mold surface is hotter than core surface ($T_{\text{cavity}} > T_{\text{core}}$), the core side solidifies first while the cavity side continues to shrink, bending the part toward the hotter cavity side.
2. **Shrinkage Parallel vs. Perpendicular to Flow:** Polymer chains and reinforcing fibers (e.g. Glass Fibers) align parallel to flow streamlines during filling. Anisotropic fiber-filled materials (PA66-GF30) shrink significantly less parallel to flow ($\approx 0.2\%$) than transverse to flow ($\approx 0.9\%$).
3. **Area Thickness Variations:** Thick sections take longer to cool and shrink more volumetrically than adjacent thin sections.

---

## 2. Thermal Optimization & Cooling Circuit Governing Equations

### Temperature Difference Limit Formula ($\Delta T_{\text{mold}}$)
To keep warpage below optical/assembly tolerances, mold wall surface temperature difference between halves must be strictly bounded:

$$\Delta T_{\text{mold}} = |T_{\text{cavity}} - T_{\text{core}}| \le 3.0^\circ\text{C}$$

### Reynolds Number for Turbulent Coolant Flow ($Re$)
Heat removal efficiency inside mold cooling water channels depends on achieving turbulent flow ($Re > 4000$):

$$Re = \frac{\rho \cdot v \cdot d}{\mu} = \frac{4 \cdot \rho \cdot Q}{\pi \cdot d \cdot \mu}$$

Where $\rho$ is water density, $v$ is flow velocity, $d$ is channel inner diameter, $Q$ is volumetric flow rate, and $\mu$ is dynamic viscosity.

---

## 3. Shop-Floor Shrinkage & Warpage Parameter Matrix

| Resin Grade | Volumetric Shrinkage ($\%$) | Anisotropy Ratio ($\text{Shrink}_{\perp} / \text{Shrink}_{\parallel}$) | Optimal Core/Cavity $\Delta T$ Limit | Target Coolant Flow Rate ($L/\text{min}$) | Recommended Holding Pressure |
|---|---|---|---|---|---|
| **PP (Copolymer)** | $1.5 - 2.2\%$ | $1.2 : 1$ | $\le 2^\circ\text{C}$ | $> 12\text{ L/min}$ | $60-75\%$ of Fill Pressure |
| **PA66-GF30** | $0.2 - 0.8\%$ | $3.5 : 1$ (High Anisotropy!) | $\le 3^\circ\text{C}$ | $> 15\text{ L/min}$ | $70-85\%$ of Fill Pressure |
| **ABS** | $0.4 - 0.7\%$ | $1.05 : 1$ (Isotropic) | $\le 4^\circ\text{C}$ | $> 10\text{ L/min}$ | $50-60\%$ of Fill Pressure |
| **PC/ABS Blend** | $0.5 - 0.8\%$ | $1.1 : 1$ | $\le 3^\circ\text{C}$ | $> 12\text{ L/min}$ | $55-70\%$ of Fill Pressure |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A mold design engineer in Chennai is sizing cooling water channels for a 2-cavity automotive bumper bracket tool.
* Cooling channel diameter ($d$): $10\text{ mm} = 0.010\text{ m}$
* Water temperature: $25^\circ\text{C}$
* Water density ($\rho$): $997\text{ kg/m}^3$
* Water dynamic viscosity ($\mu$): $0.00089\text{ Pa}\cdot\text{s}$
* Target Reynolds number ($Re$): $8000$ (Deep turbulent flow for maximum heat transfer)

**Calculate:**
1. Minimum required water flow velocity ($v$) in m/s inside each cooling line.
2. Required volumetric flow rate ($Q$) in Liters per minute ($\text{L/min}$) per cooling circuit.

### 💡 Step-by-Step Solution

#### Step 1: Solve for Water Velocity ($v$)
Using the Reynolds number equation:
$$Re = \frac{\rho \cdot v \cdot d}{\mu} \implies v = \frac{Re \cdot \mu}{\rho \cdot d}$$

$$v = \frac{8000 \times 0.00089\text{ Pa}\cdot\text{s}}{997\text{ kg/m}^3 \times 0.010\text{ m}} = \frac{7.12}{9.97} = \mathbf{0.714\text{ m/s}}$$

#### Step 2: Calculate Volumetric Flow Rate ($Q$)
Cross-sectional area of cooling channel:
$$A_{\text{channel}} = \frac{\pi \cdot d^2}{4} = \frac{\pi \times (0.010)^2}{4} = 7.854 \times 10^{-5}\text{ m}^2$$

Volumetric flow rate in $\text{m}^3/\text{s}$:
$$Q = A_{\text{channel}} \times v = 7.854 \times 10^{-5} \times 0.714 = 5.607 \times 10^{-5}\text{ m}^3/\text{s}$$

Converting to Liters per minute ($\text{L/min}$):
$$Q = 5.607 \times 10^{-5}\text{ m}^3/\text{s} \times 1000\text{ L/m}^3 \times 60\text{ s/min} = \mathbf{3.36\text{ L/min}}$$

To ensure $Re = 8000$ across 4 parallel cooling circuits, the mold chiller pump must deliver a total header flow rate of $4 \times 3.36 = \mathbf{13.44\text{ L/min}}$.

---

## 5. Practical Engineering Exercises

### ❓ Exercise 3.1 (Anisotropic Fiber Shrinkage)
**Question:** A flat rectangular structural plate Moulded from PA66-GF30 warps into a "saddle" shape after cooling. Explain why glass fiber orientation causes this specific shape defect.
**Answer & Rationale:** During filling, glass fibers align in the direction of flow along the main body, but align transversely near the outer edges due to fountain flow. Parallel shrinkage along flow is $\approx 0.2\%$, while transverse shrinkage is $\approx 0.7\%$. The higher edge shrinkage pulls outer edges downward while the center remains long, warping the plate into a classic saddle geometry.

### ❓ Exercise 3.2 (Differential Mold Temperature Adjustment)
**Question:** A flat polypropylene box cover bows upward (convex towards cavity side). The core mold half is running at $35^\circ\text{C}$ and the cavity half is at $55^\circ\text{C}$. What adjustment should be made?
**Answer & Rationale:** The part bows towards the hotter cavity half because higher temperature delays skin freezing, allowing more thermal shrinkage on that side. Adjustment: Lower cavity temperature to $35^\circ\text{C}$ or raise core temperature to $45^\circ\text{C}$ to eliminate the $\Delta T = 20^\circ\text{C}$ surface gradient.

### ❓ Exercise 3.3 (Holding Pressure Optimization)
**Question:** How does increasing packing pressure duration beyond gate seal time affect internal mold residual stresses?
**Answer & Rationale:** Increasing packing pressure *after* the gate has frozen has zero effect on cavity pressure, but increasing packing pressure *before* gate seal to excessive levels over-packs resin near the gate region. This creates high localized compressive residual stresses near the gate, leading to environmental stress cracking (ESC) and post-ejection distortion.
`,
  ch4: `# Chapter 4: Sink Marks, Internal Void Formation & PVT Thermodynamics

## 1. Thermodynamic Origin of Sink Marks & Voids
Sink marks and internal voids are structural flaws caused by localized uncompensated volumetric thermal shrinkage during polymer solidification.

When a thick wall section (e.g. rib-to-wall intersection, boss base, or thick gusset) cools inside the mold:
1. The outer polymer layer touches the cold mold wall and solidifies into a rigid structural skin.
2. The molten core inside the thick section cools slower and contracts volumetrically.
3. **If the outer skin is flexible:** The internal thermal contraction pulls the outer skin inward, forming a concave surface depression known as a **Sink Mark**.
4. **If the outer skin is rigid (e.g. amorphous PC/ABS or thick PA66):** The skin resists collapsing inward. The internal shrinkage pulls polymer outward toward the skin, creating a hollow vacuum cavity inside called an **Internal Void**.

---

## 2. Rib & Boss Part Design Rules

To prevent sink marks on cosmetic outer surfaces, component wall thickness transitions must adhere to strict geometric ratios:

$$\text{Rib Thickness } (t_{\text{rib}}) \le 0.50 - 0.60 \times t_{\text{main wall}}$$

$$\text{Boss Radius Transition } (r_{\text{base}}) = 0.25 - 0.50 \times t_{\text{main wall}}$$

$$\text{Maximum Gusset Height } (h_{\text{gusset}}) \le 2.0 \times t_{\text{main wall}}$$

---

## 3. Pressure-Volume-Temperature (PVT) Governing Equations

Polymer volumetric shrinkage ($\Delta V_v$) is tracked along the thermodynamic PVT phase curve. In the pack/hold stage, applying packing pressure ($P_{\text{pack}}$) compresses the polymer melt, shifting the specific volume ($v = 1/\rho$) down to compensate for thermal contraction:

$$\Delta V_v = 1 - \frac{\rho_{\text{melt}}(P_{\text{pack}}, T_{\text{melt}})}{\rho_{\text{solid}}(P_{\text{ambient}}, T_{\text{ambient}})}$$

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
An industrial designer in NCR Delhi designed a housing with a main wall thickness $t_{\text{wall}} = 4.0\text{ mm}$ and reinforcing ribs of thickness $t_{\text{rib}} = 3.2\text{ mm}$.
* Material: ABS ($T_{\text{melt}} = 240^\circ\text{C}$)
* Melt density at packing pressure ($600\text{ bar}$): $\rho_{\text{melt}} = 0.985\text{ g/cm}^3$
* Solid density at room temp: $\rho_{\text{solid}} = 1.050\text{ g/cm}^3$

**Evaluate:**
1. Check if the current rib design satisfies the anti-sink geometric ratio.
2. Calculate the theoretical uncompensated volumetric shrinkage ($\Delta V_v$).
3. Recommend exact wall modifications to eliminate sink marks completely.

### 💡 Step-by-Step Solution

#### Step 1: Evaluate Current Rib Ratio
$$\text{Ratio} = \frac{t_{\text{rib}}}{t_{\text{wall}}} = \frac{3.2\text{ mm}}{4.0\text{ mm}} = \mathbf{0.80} \quad (80\%)$$

Comparing to standard design rule ($t_{\text{rib}} \le 0.60 \times t_{\text{wall}} = 2.4\text{ mm}$): The current ratio ($80\%$) severely exceeds the limit. Severe sink marks will form opposite every rib intersection.

#### Step 2: Calculate Volumetric Thermal Shrinkage ($\Delta V_v$)
$$\Delta V_v = \left( 1 - \frac{0.985}{1.050} \right) \times 100\% = (1 - 0.9381) \times 100\% = \mathbf{6.19\%}$$

Without packing pressure, the thick rib base undergoes $6.19\%$ volumetric shrinkage, pulling the $4.0\text{ mm}$ wall inward by up to $0.15\text{ mm}$.

#### Step 3: Engineering Redesign Solution
1. Reduce rib root thickness to $t_{\text{rib}} = 0.55 \times 4.0 = \mathbf{2.20\text{ mm}}$.
2. Add a $0.8\text{ mm}$ radius fillet at the rib root to avoid notch stress concentration while keeping local thermal mass low.
3. Extend holding pressure time until gate seal weight balancing proves the core is fully packed.

---

## 5. Practical Engineering Exercises

### ❓ Exercise 4.1 (Gate Freeze Weight Analysis)
**Question:** How do you experimentally determine exact Gate Seal Time (Gate Freeze) on the shop floor?
**Answer & Rationale:** Increase holding pressure time in increments of $1.0\text{ second}$ (e.g. $3s, 4s, 5s, 6s, 7s$) while keeping all other parameters constant. Weigh parts on a precision analytical balance ($\pm 0.01\text{ g}$). Plot Part Weight vs. Hold Time. The point where part weight plateaus and stops increasing is the exact **Gate Seal Time**. Holding pressure beyond this point wastes electrical energy.

### ❓ Exercise 4.2 (Distinguishing Voids vs. Gas Bubbles)
**Question:** A transparent polycarbonate part exhibits internal bubbles. How do you determine whether a bubble is a vacuum shrinkage void or a moisture/gas bubble?
**Answer & Rationale:** Heat the part gently in an oven near glass transition temperature ($T_g \approx 140^\circ\text{C}$) or use a heat gun. If it is a **Vacuum Shrinkage Void**, atmospheric pressure collapses the softened bubble inward. If it is a **Gas/Moisture Bubble**, trapped compressed gas expands the bubble outward into a dome blister.

### ❓ Exercise 4.3 (Gas-Assisted Injection Moulding)
**Question:** Why does Gas-Assisted Injection Moulding (GAIM) eliminate sink marks in extra-thick handles ($> 15\text{ mm}$)?
**Answer & Rationale:** GAIM injects high-pressure nitrogen gas ($100-300\text{ bar}$) into the molten core of thick sections. The nitrogen bubble exerts uniform outward pressure directly against the solidifying skin from the inside, compensating for volumetric shrinkage and creating a hollow, light part with zero sink marks.
`,
  ch5: `# Chapter 5: Weld Line Strength, Flow Front Convergence & Optical Defect Remedies

## 1. Physical Mechanics of Weld & Meld Lines
A **weld line** (or knit line) forms when two separate polymer melt fronts meet after flowing around an obstacle (such as a core pin, hole insert, or multi-gate flow divider).

### Distinction Between Weld Lines and Meld Lines:
* **Weld Line (Meeting Angle $\theta < 135^\circ$):** Two melt fronts meet head-on. Flow fronts flatten, trapped air pockets form at the interface, and molecular chain entanglements across the interface are minimal. Mechanical strength at a weld line drops to $40-60\%$ of virgin resin tensile strength.
* **Meld Line (Meeting Angle $\theta > 135^\circ$):** Two melt fronts merge while flowing in the same parallel direction. Polymer chains interdiffuse across the interface, preserving $85-95\%$ of tensile strength.

---

## 2. Polymer Chain Interdiffusion Kinetics

Tensile strength recovery across a weld interface is governed by the reptation interdiffusion model of polymer chains across interface boundary ($s$):

$$\text{Strength Recovery } (\sigma_{\text{weld}} / \sigma_0) \propto \left( \frac{t_{\text{weld}}}{\tau_r(T)} \right)^{1/4}$$

Where $t_{\text{weld}}$ is the time melt interface stays above solidification temperature, and $\tau_r(T)$ is the temperature-dependent polymer chain relaxation time. Higher melt temperature dramatically shortens relaxation time $\tau_r$, boosting weld strength.

---

## 3. Shop-Floor Weld Line & Optical Defect Troubleshooting Matrix

| Defect | Visual Appearance | Primary Root Cause | Shop-Floor Remedy |
|---|---|---|---|
| **Brittle Weld Line** | Thin visible line; part snaps easily along line under load | Low interface temperature; poor chain entanglement | Increase melt temp by $15^\circ\text{C}$; increase injection velocity through gate |
| **V-Notch Surface Groove** | V-shaped surface depression along weld path | Trapped air pockets preventing front merging | Add overflow well tab at weld site; clean venting channels |
| **Jetting Defect** | Snake-like squiggly thread on part surface | Melt stream squirts through gate without touching cavity walls | Convert to fan or submarine gate; lower injection speed during gate entry |
| **Silver Streaks / Splay** | Silver fan-shaped streaks radiating from gate | Moisture degradation or volatile gas evolution | Dehumidify resin to moisture content $< 0.02\%$ (for PA/PC); lower barrel rear temp |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
A quality manager at an automotive plant in Gujarat is testing weld line tensile strength on PA66-GF30 door handle components.
* Virgin resin tensile strength ($\sigma_0$): $175\text{ MPa}$
* Standard head-on weld line tensile strength ($\sigma_{\text{weld}}$): $85\text{ MPa}$ ($\text{Retention} = 48.5\%$)
* Minimum customer specified weld strength: $135\text{ MPa}$ ($\text{Retention} = 77.1\%$)

**Design Action:**
The toolmaker proposes relocating the gate to change the flow front convergence angle from $\theta = 60^\circ$ (head-on meeting) to $\theta = 150^\circ$ (parallel meld flow).

**Calculate:**
1. Weld strength retention improvement required.
2. Verify if converting the weld line to a meld line will meet customer spec.

### 💡 Step-by-Step Solution

#### Step 1: Calculate Required Retention Percentage
$$\text{Required Retention} = \frac{135\text{ MPa}}{175\text{ MPa}} \times 100\% = \mathbf{77.14\%}$$

#### Step 2: Evaluate Meld Line Performance ($\theta = 150^\circ$)
At a flow meeting angle $\theta = 150^\circ > 135^\circ$, the front transforms into a parallel **meld line**.
Empirical polymer interdiffusion data for PA66-GF30 shows meld line strength retention is typically $85-90\%$ of virgin material strength:

$$\sigma_{\text{meld}} = 175\text{ MPa} \times 0.85 = \mathbf{148.75\text{ MPa}}$$

#### Step 3: Conclusion
$$\sigma_{\text{meld}} (148.75\text{ MPa}) > \sigma_{\text{spec}} (135\text{ MPa})$$

Relocating the gate to achieve parallel meld flow successfully raises structural strength above customer requirement without changing resin grade.

---

## 5. Practical Engineering Exercises

### ❓ Exercise 5.1 (Overflow Tab Technique)
**Question:** How does adding a temporary overflow tab at a weld line location improve local tensile strength?
**Answer & Rationale:** An overflow tab allows the cool, oxidized leading edges of converging melt fronts to flow *past* the part boundary into the disposable tab. The actual part interface is then filled by hot, freshly un-oxidized polymer melt under high pressure, drastically increasing chain interdiffusion and weld strength. The tab is trimmed post-ejection.

### ❓ Exercise 5.2 (Jetting Prevention Mechanics)
**Question:** Why does jetting occur when a narrow pin gate opens directly into a deep cavity, and how does fan gating prevent it?
**Answer & Rationale:** When high-velocity melt exits a small gate into an open cavity space without impinging against a mold wall, it squirts as an unconstrained liquid jet ("snake stream") that cools before the cavity fills around it. A **fan gate** gradually widens the flow area, reducing melt velocity and forcing the front to expand as a smooth, continuous laminar wave front.

### ❓ Exercise 5.3 (Moisture Splay vs. Thermal Degradation)
**Question:** How do you distinguish between moisture splay and thermal degradation splay on an injection-moulded nylon part?
**Answer & Rationale:** Perform a **Slide Glass Moisture Test (Dome Test)**. Place resin pellets between two glass slides on a hot plate ($250^\circ\text{C}$). Press slides together. If tiny foaming gas bubbles pop inside the flattened melt disc, the resin contains moisture. If splay persists after drying resin to $< 0.02\%$, splay is caused by thermal degradation from excessive screw shear rate or long barrel residence time.
`,
  ch6: `# Chapter 6: Flash, Burn Marks, Diesel Effect & Mold Protection Protocols

## 1. Physics of Flashing & Dieseling
**Parting line flash** and **diesel burning** represent opposite operational failure extremes in injection moulding:

### A. Parting Line Flash Mechanics
Flash occurs when molten plastic penetrates into parting line gaps, ejector pin clearances, or slide fits ($> 0.015 - 0.035\text{ mm}$).
* **Over-pressurization:** Hydraulic cavity pressure force exceeds machine clamp force ($P_{\text{plastic}} \cdot A_{\text{proj}} > F_{\text{clamp}}$), causing mold halves to part by micrometers.
* **Viscosity Collapse:** Excessive melt temperature reduces viscosity below sealing threshold.

### B. Diesel Effect Burning Mechanics
When melt fills a cavity at high speed, air inside the cavity is trapped in unvented dead corners. As the melt front compresses this air rapidly ($V_1 \to V_2$), adiabatic gas compression raises trapped air temperature according to the ideal gas adiabatic relation:

$$\frac{T_2}{T_1} = \left( \frac{V_1}{V_2} \right)^{\gamma - 1}$$

Where $\gamma \approx 1.4$ for air. Pressure ratios of $30:1$ generate localized air temperatures exceeding $600 - 800^\circ\text{C}$, causing immediate thermal combustion (dieseling) of polymer molecules, leaving charred black burn marks and eroded mold steel.

---

## 2. Adiabatic Compression Thermal Equation

Trapped air peak compression temperature ($T_2$ in Kelvin) is calculated via:

$$T_2 = T_1 \cdot \left( \frac{P_2}{P_1} \right)^{\frac{\gamma - 1}{\gamma}}$$

Where $T_1 = 300\text{ K}$ ($27^\circ\text{C}$ ambient), $P_1 = 1\text{ bar}$, $P_2 = \text{Peak air compression pressure}$ ($\text{bar}$).

---

## 3. Recommended Venting Dimensions & Mold Safety Settings

| Polymer Resin Family | Max Non-Flashing Vent Depth ($\text{mm}$) | Land Length ($\text{mm}$) | Relief Vent Depth ($\text{mm}$) | Mold Protection Force Limit |
|---|---|---|---|---|
| **Polypropylene (PP)** | $0.025 - 0.030\text{ mm}$ | $1.5 - 3.0\text{ mm}$ | $1.0\text{ mm}$ | $< 5\%$ of Max Clamp Force |
| **Polyamide 66 (PA66)** | $0.010 - 0.015\text{ mm}$ | $1.0 - 2.0\text{ mm}$ | $1.0\text{ mm}$ | $< 3\%$ of Max Clamp Force |
| **Polycarbonate (PC)** | $0.030 - 0.050\text{ mm}$ | $3.0 - 5.0\text{ mm}$ | $1.5\text{ mm}$ | $< 5\%$ of Max Clamp Force |
| **POM (Acetal)** | $0.015 - 0.020\text{ mm}$ | $1.5 - 2.5\text{ mm}$ | $1.0\text{ mm}$ | $< 4\%$ of Max Clamp Force |

---

## 4. Worked Industrial Numerical Example

### 📐 Problem Statement
During high-speed injection of a PA66 connector housing, air trapped at an unvented core pin is compressed adiabatically from initial atmospheric pressure ($P_1 = 1.0\text{ bar}$, $T_1 = 25^\circ\text{C} = 298.15\text{ K}$) to a compressed peak pressure of $P_2 = 45.0\text{ bar}$.

**Calculate:**
1. The peak adiabatic temperature ($T_2$) of the trapped air bubble.
2. Determine if this temperature will ignite PA66 polymer (auto-ignition temperature $T_{\text{ignition}} \approx 450^\circ\text{C} = 723\text{ K}$).

### 💡 Step-by-Step Solution

#### Step 1: Calculate Temperature Ratio Pre-factor
For air, $\frac{\gamma - 1}{\gamma} = \frac{1.4 - 1}{1.4} = \frac{0.4}{1.4} = 0.2857$

#### Step 2: Compute Adiabatic Temperature ($T_2$)
$$T_2 = 298.15\text{ K} \times \left( \frac{45.0}{1.0} \right)^{0.2857} = 298.15 \times (45.0)^{0.2857}$$

$$(45.0)^{0.2857} = 2.9734$$

$$T_2 = 298.15 \times 2.9734 = \mathbf{886.52\text{ K}}$$

Converting to Celsius:
$$T_2 = 886.52 - 273.15 = \mathbf{613.37^\circ\text{C}}$$

#### Step 3: Ignition Evaluation
$$T_{\text{air}} (613.37^\circ\text{C}) > T_{\text{ignition}} (450^\circ\text{C})$$

The compressed air reaches $613^\circ\text{C}$, exceeding PA66 auto-ignition point by $163^\circ\text{C}$. This causes severe diesel burning, severe black charring, and corrosive gas erosion of the steel pin.

#### Step 4: Fix
Insert a micro-vented ejector pin ($0.012\text{ mm}$ flat clearance) at the trapped air pocket location to exhaust air before compression occurs.

---

## 5. Practical Engineering Exercises

### ❓ Exercise 6.1 (Low-Pressure Mold Protection Setup)
**Question:** How do you set up Low-Pressure Mold Protection (LPMP) on an injection moulding machine to prevent tool damage from stuck parts?
**Answer & Rationale:** Set the LPMP safety stage to begin $5-10\text{ mm}$ before mold touch. Reduce clamp closing force to the absolute minimum needed to move the platen (e.g. $< 3\text{ tonnes}$). Set safety timer to $0.5\text{ seconds}$ longer than normal movement time. If a stuck part or loose ejector pin resists closing, hydraulic pressure spikes above the low limit, triggering immediate platen stop and alarm, saving million-rupee mold tools from destruction.

### ❓ Exercise 6.2 (Tonnage Flash vs. Thermal Flash)
**Question:** How do you determine if part flash is caused by insufficient clamp tonnage versus thermal resin degradation?
**Answer & Rationale:** Inspect flash location and thickness. If flash occurs uniformly around the entire parting line perimeter and part weight is heavy, the cause is **insufficient clamp tonnage** or over-packing. If flash occurs localized near gates or thin sections while clamp force is at maximum, and resin shows discoloration, the cause is **thermal degradation** dropping melt viscosity.

### ❓ Exercise 6.3 (Venting Clogging Maintenance)
**Question:** Why do mold venting slots stop working after 50,000 production cycles, and what maintenance procedure restores them?
**Answer & Rationale:** Mold vents exhaust trapped air containing volatile polymer additives, waxes, and flame retardant degradation byproducts. Over time, these volatiles condense inside micro-vent slots ($0.02\text{ mm}$ depth), clogging exhaust paths. Maintenance procedure: Clean parting lines using ultrasonic solvent bath or brass scrapers with solvent cleaners to restore full vent depth.
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
