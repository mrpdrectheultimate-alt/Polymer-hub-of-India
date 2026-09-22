// scripts/generate_testing_chapters.mjs

export const TESTING_EXPANDED = {
  ch1: `# Chapter 1: Standard Testing Frameworks (ASTM vs ISO Protocols) & COA Verification

## 1. Executive Overview & Physical Principles
Polymer characterization relies on standardized testing frameworks established by ASTM International (American Society for Testing and Materials) and ISO (International Organization for Standardization) to guarantee material specification compliance across global supply chains.

Testing accuracy requires strict control over test specimen preparation (injection moulding vs machining), conditioning environment (ASTM D618: $23 \\pm 2^\\circ\\text{C}$ and $50 \\pm 10\\% \\text{ RH}$ for 40 hours), strain rate speed, and dimensional tolerances.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Statistical Confidence & Coefficient of Variation (CV%)
$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i, \\quad s = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n-1}}, \\quad \\text{CV}\\% = \\left( \\frac{s}{\\bar{x}} \\right) \\times 100\\%$$

Quality acceptance requires $\\text{CV}\\% < 5.0\\%$ for tensile properties and $\\text{CV}\\% < 8.0\\%$ for notched impact properties.

### B. Comprehensive ASTM vs. ISO Standards Comparison Matrix

| Property Evaluation | ASTM Standard Method | ISO Standard Method | Key Specimen Differences | Strain Speed Differences |
|---|---|---|---|---|
| **Tensile Properties** | ASTM D638 (Type I) | ISO 527 (Type 1A) | ASTM overall length $165\\text{ mm}$ vs ISO $170\\text{ mm}$ | ASTM $50\\text{ mm/min}$ vs ISO $50\\text{ mm/min}$ |
| **Flexural Properties** | ASTM D790 (3-Point) | ISO 178 (3-Point) | ASTM span-to-depth $16:1$ vs ISO $16:1$ | Strain rate $0.01\\text{ mm/mm/min}$ |
| **Notched Izod Impact** | ASTM D256 | ISO 180 / 1A | ASTM notch radius $0.25\\text{ mm}$, struck on notch side | Struck on opposite face |
| **Melt Flow Index** | ASTM D1238 | ISO 1133 | Die diameter $2.095\\text{ mm}$, load $2.16\\text{ kg}$ | Orifice length $8.000\\text{ mm}$ |
| **Ash Content** | ASTM D5630 | ISO 3451 | Pyrolysis furnace temp $600^\\circ\\text{C}$ | Crucible calcination |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A QC laboratory manager in Noida is auditing an incoming shipment Certificate of Analysis (COA) for Polycarbonate resin.
* Tensile Yield Strength Specification: $\\bar{\\sigma}_y = 62.0 \\pm 2.0\\text{ MPa}$ ($60.0 - 64.0\\text{ MPa}$).
* Laboratory tested 5 ASTM D638 Type I dumbbell specimens: $62.4, 61.8, 63.1, 60.9, 62.8\\text{ MPa}$.

**Calculate:**
1. Sample mean strength ($\\bar{x}$).
2. Sample standard deviation ($s$) and coefficient of variation ($\\text{CV}\\%$).
3. State whether the lot PASSES COA acceptance and statistical repeatability limits.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Sample Mean ($\\bar{x}$)
$$\\bar{x} = \\frac{62.4 + 61.8 + 63.1 + 60.9 + 62.8}{5} = \\frac{311.0}{5} = \\mathbf{62.20\\text{ MPa}}$$

#### Step 2: Calculate Variance and Standard Deviation ($s$)
$$\\sum (x_i - \\bar{x})^2 = (0.20)^2 + (-0.40)^2 + (0.90)^2 + (-1.30)^2 + (0.60)^2$$
$$= 0.04 + 0.16 + 0.81 + 1.69 + 0.36 = 3.06\\text{ MPa}^2$$

$$s = \\sqrt{\\frac{3.06}{5 - 1}} = \\sqrt{\\frac{3.06}{4}} = \\sqrt{0.765} = \\mathbf{0.8746\\text{ MPa}}$$

#### Step 3: Calculate Coefficient of Variation (CV%)
$$\\text{CV}\\% = \\left( \\frac{0.8746}{62.20} \\right) \\times 100\\% = \\mathbf{1.406\\%}$$

#### Step 4: Verification Verdict
* Mean $62.20\\text{ MPa}$ falls safely inside the $60.0 - 64.0\\text{ MPa}$ window.
* $\\text{CV}\\% = 1.41\\% < 5.0\\%$ target limit.
* The shipment **PASSES COA verification**!

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 1.1 (Conditioning Moisture Impact on PA66)
**Question:** Why does a Dry-as-Molded (DAM) Polyamide 6,6 specimen exhibit $80\\text{ MPa}$ tensile strength and $5\\%$ elongation, whereas a conditioned specimen ($50\\% \\text{ RH}$) exhibits $55\\text{ MPa}$ tensile strength and $60\\%$ elongation?
**Answer & Rationale:** Water acts as a powerful **plasticizer** in PA66. Absorbed water molecules ($1.5 - 2.5\\text{ wt}\\%$) form hydrogen bonds with amide groups, increasing chain mobility. This drops tensile yield strength and modulus while increasing impact toughness and ductileness.

### ❓ Exercise 1.2 (ASTM vs ISO Impact Value Conversion Error)
**Question:** Can an engineer directly compare ASTM D256 Izod impact ($\text{J/m}$) with ISO 180 impact ($\text{kJ/m}^2$) by dividing by sample thickness?
**Answer & Rationale:** **No.** ASTM D256 strikes the specimen on the notched face side, whereas ISO 180 strikes on the un-notched back face. Clamping force and radius differences prevent direct mathematical conversion; testing must be re-run on ISO specimens.`,

  ch2: `# Chapter 2: Thermal Characterization: DSC, TGA, HDT & Vicat Softening

## 1. Executive Overview & Physical Principles
Thermal characterization techniques determine thermal transitions, thermal stability, degradation kinetics, and heat distortion behavior under load.

1. **Differential Scanning Calorimetry (DSC):** Measures heat flow differential between sample and reference pans as a function of temperature. Identifies Glass Transition ($T_g$), Cold Crystallization ($T_c$), Melting Peak ($T_m$), and enthalpy of fusion ($\\Delta H_m$) to calculate percentage crystallinity ($\\%\ X_c$).
2. **Thermogravimetric Analysis (TGA):** Measures mass loss as a function of temperature to determine thermal decomposition onset ($T_{\\text{onset}}$), plasticizer content, and inorganic filler ash content.
3. **Heat Deflection Temperature (HDT - ASTM D648):** Measures temperature at which a 3-point bend bar deflects $0.25\\text{ mm}$ under outer fiber stress ($0.45\\text{ MPa}$ or $1.80\\text{ MPa}$).

---

## 2. Key Industrial Parameters & Governing Equations

### A. Percentage Crystallinity Formula ($\\% X_c$)
$$\\% X_c = \\frac{\\Delta H_m - \\Delta H_c}{\\Delta H_m^\\circ \\cdot (1 - w_{\\text{filler}})} \\times 100\\%$$

Where:
* $\\Delta H_m$ = Measured melting enthalpy peak area ($\\text{J/g}$).
* $\\Delta H_c$ = Cold crystallization enthalpy peak area ($\\text{J/g}$).
* $\\Delta H_m^\\circ$ = Theoretical enthalpy of $100\\%$ crystalline polymer reference.
* $w_{\\text{filler}}$ = Inorganic filler weight fraction.

### B. Thermal Transition Parameter Matrix

| Polymer Resin Grade | Glass Transition $T_g$ ($^\\circ\\text{C}$) | Melting Temp $T_m$ ($^\\circ\\text{C}$) | 100% Crystalline $\\Delta H_m^\\circ$ ($\\text{J/g}$) | Typical HDT at $1.80\\text{ MPa}$ ($^\\circ\\text{C}$) | Vicat Softening Temp ($^\\circ\\text{C}$) |
|---|---|---|---|---|---|
| **High-Density PE (HDPE)** | $-120^\\circ\\text{C}$ | $135^\\circ\\text{C}$ | $293.0\\text{ J/g}$ | $45 - 55^\\circ\\text{C}$ | $125^\\circ\\text{C}$ |
| **PP Homopolymer** | $-10^\\circ\\text{C}$ | $165^\\circ\\text{C}$ | $207.0\\text{ J/g}$ | $55 - 65^\\circ\\text{C}$ | $152^\\circ\\text{C}$ |
| **Polyamide 6,6 (PA66)** | $65^\\circ\\text{C}$ | $262^\\circ\\text{C}$ | $226.0\\text{ J/g}$ | $75^\\circ\\text{C}$ (Unfilled) / $240^\\circ\\text{C}$ (GF30) | $250^\\circ\\text{C}$ |
| **Polycarbonate (PC)** | $145^\\circ\\text{C}$ | Amorphous ($N/A$) | $N/A$ | $132 - 138^\\circ\\text{C}$ | $145^\\circ\\text{C}$ |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A testing specialist in Vadodara is running a DSC test ($10^\\circ\\text{C/min}$) on a 30% Glass-Filled Polypropylene compound.
* Sample total mass: $m_{\\text{sample}} = 8.50\\text{ mg}$
* Resin matrix weight fraction: $1 - w_{\\text{filler}} = 0.70$
* Measured DSC melt endotherm peak area: $\\Delta H_{\\text{peak}} = 52.5\\text{ J/g}$
* Cold crystallization enthalpy: $\\Delta H_c = 0.0\\text{ J/g}$
* Theoretical $100\\%$ crystalline PP reference: $\\Delta H_m^\\circ = 207.0\\text{ J/g}$.

**Calculate:**
1. The effective polymer matrix melting enthalpy ($\\Delta H_m$).
2. The percentage crystallinity ($\\%\ X_c$) of the PP matrix.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Matrix Melting Enthalpy ($\\Delta H_m$)
Since glass fiber does not melt, measured enthalpy per gram of total compound must be scaled to polymer matrix mass:
$$\\Delta H_m = \\frac{\\Delta H_{\\text{peak}}}{1 - w_{\\text{filler}}} = \\frac{52.5\\text{ J/g}}{0.70} = \\mathbf{75.00\\text{ J/g of polymer}}$$

#### Step 2: Calculate Percentage Crystallinity ($\\% X_c$)
$$\\% X_c = \\frac{\\Delta H_m}{\\Delta H_m^\\circ} \\times 100\\% = \\frac{75.00\\text{ J/g}}{207.0\\text{ J/g}} \\times 100\\% = \\mathbf{36.23\\%}$$

The Polypropylene matrix possesses **$36.23\\%$ crystalline phase**, providing target stiffness and thermal HDT.

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 2.1 (TGA Ash Content Verification - ASTM D5630)
**Question:** A TGA test on a $12.50\\text{ mg}$ PA66 GF sample leaves a clean solid residue of $3.78\\text{ mg}$ after heating to $800^\\circ\\text{C}$ in air. What is the glass fiber weight loading percentage?
**Answer & Rationale:**
$$\\%\\text{Ash} = \\frac{3.78\\text{ mg}}{12.50\\text{ mg}} \\times 100\\% = \\mathbf{30.24\\%}$$
The compound meets the **PA66 + 30% Glass Fiber** formulation spec within $\\pm 0.25\\%$.

### ❓ Exercise 2.2 (Glass Fiber Impact on HDT)
**Question:** Why does adding $30\\%$ glass fiber raise PA66 HDT from $75^\\circ\\text{C}$ to $240^\\circ\\text{C}$, whereas adding $30\\%$ glass fiber to Polycarbonate raises HDT by only $10^\\circ\\text{C}$?
**Answer & Rationale:** PA66 is semi-crystalline; fibers constrain matrix amorphous mobility up to near the melting point ($T_m = 262^\\circ\\text{C}$). Polycarbonate is amorphous; above its $T_g$ ($145^\\circ\\text{C}$), the entire matrix softens regardless of fiber reinforcement.`,

  ch3: `# Chapter 3: Mechanical Testing: Tensile ASTM D638, Flexural D790 & Izod/Charpy Impact ASTM D256

## 1. Executive Overview & Physical Principles
Mechanical testing evaluates structural load-bearing capacity under tension, bending, and dynamic impact stress fields.

1. **Tensile Properties (ASTM D638 / ISO 527):** Pulls dumbbell specimens uniaxially to generate stress-strain curves, defining Young's Modulus ($E$), Yield Strength ($\\sigma_y$), Ultimate Tensile Strength ($\\sigma_u$), and Elongation at Break ($\\varepsilon_b$).
2. **Flexural Properties (ASTM D790 / ISO 178):** Applies 3-point bending to rectangular bars, determining Flexural Modulus ($E_b$) and Flexural Strength ($\\sigma_f$).
3. **Notched Impact Resistance (ASTM D256 Izod / ISO 179 Charpy):** Measures kinetic pendulum energy absorbed per unit notch length ($\\text{J/m}$) or unit area ($\\text{kJ/m}^2$) during high-velocity fracture.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Tensile Stress ($\\sigma$) and Engineering Strain ($\\varepsilon$)
$$\\sigma = \\frac{F}{A_0} = \\frac{F}{w \\cdot t}, \\quad \\varepsilon = \\frac{\\Delta L}{L_0}, \\quad E = \\frac{d\\sigma}{d\\varepsilon} \\quad (\\text{Initial linear slope})$$

### B. Flexural 3-Point Bending Equations (ASTM D790)
$$\\text{Flexural Stress } \\sigma_f = \\frac{3 F L}{2 b d^2}, \\quad \\text{Flexural Modulus } E_b = \\frac{L^3 m}{4 b d^3}$$

Where:
* $L$ = Support span length ($16 \\times d$).
* $b, d$ = Specimen width and depth.
* $m = dF/ds$ = Initial linear slope of force-deflection curve ($\\text{N/mm}$).

### C. Mechanical Property Comparison Matrix

| Polymer Grade | Young's Modulus $E$ ($\\text{GPa}$) | Yield Strength $\\sigma_y$ ($\\text{MPa}$) | Elongation at Break $\\varepsilon_b\\%$ | Flexural Modulus $E_b$ ($\\text{GPa}$) | Notched Izod Impact ($\\text{J/m}$) |
|---|---|---|---|---|---|
| **Polypropylene (Unfilled)** | $1.45$ | $34.0$ | $150\\%$ | $1.50$ | $45$ |
| **Polycarbonate (Rigid)** | $2.30$ | $62.0$ | $110\\%$ | $2.35$ | $650 - 800$ |
| **PA66 + 30% Glass Fiber** | $8.80$ | $175.0$ | $3.5\\%$ | $8.20$ | $110$ |
| **ABS Terpolymer** | $2.10$ | $45.0$ | $25\\%$ | $2.20$ | $220$ |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A mechanical test engineer in Chennai is performing an ASTM D790 3-point flexural test on a PBT engineering plastic bar.
* Specimen width ($b$): $12.70\\text{ mm}$
* Specimen depth ($d$): $3.20\\text{ mm}$
* Support span length ($L = 16 d$): $51.20\\text{ mm}$
* Measured linear slope of force-deflection curve ($m = F/s$): $185.0\\text{ N/mm}$
* Measured maximum force at break ($F_{\\max}$): $142.0\\text{ N}$

**Calculate:**
1. The Flexural Modulus ($E_b$ in $\\text{MPa}$ and $\\text{GPa}$).
2. The Flexural Strength ($\\sigma_f$ in $\\text{MPa}$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Specimen Geometric Terms
$$d^3 = (3.20)^3 = 32.768\\text{ mm}^3, \\quad d^2 = (3.20)^2 = 10.24\\text{ mm}^2$$

$$L^3 = (51.20)^3 = 134,217.73\\text{ mm}^3$$

#### Step 2: Calculate Flexural Modulus ($E_b$)
$$E_b = \\frac{L^3 m}{4 b d^3} = \\frac{134,217.73 \\times 185.0}{4 \\times 12.70 \\times 32.768} = \\frac{24,830,279.7}{1,664.614} = \\mathbf{14,916.5\\text{ MPa}} \\quad (14.92\\text{ GPa})$$

#### Step 3: Calculate Flexural Strength ($\\sigma_f$)
$$\\sigma_f = \\frac{3 F_{\\max} L}{2 b d^2} = \\frac{3 \\times 142.0 \\times 51.20}{2 \\times 12.70 \\times 10.24} = \\frac{21,811.2}{260.096} = \\mathbf{83.86\\text{ MPa}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 3.1 (Notch Radius Sensitivity in Impact Testing)
**Question:** Why does increasing ASTM D256 notch radius from $0.25\\text{ mm}$ to $1.00\\text{ mm}$ increase Polycarbonate impact energy by $400\\%$?
**Answer & Rationale:** Polycarbonate is notch-sensitive. A sharp notch radius ($0.25\\text{ mm}$) creates severe triaxial stress concentration that suppresses matrix shear yielding, forcing brittle fracture. A blunter notch ($1.00\\text{ mm}$) lowers peak stress concentration below the shear yielding threshold, initiating ductile energy absorption.

### ❓ Exercise 3.2 (Crosshead Speed Effect on Tensile Modulus)
**Question:** How does changing tensile test crosshead speed from $5\\text{ mm/min}$ to $500\\text{ mm/min}$ alter measured yield strength?
**Answer & Rationale:** Polymers are viscoelastic. Higher strain rates reduce chain relaxation time available during deformation, causing measured yield strength and modulus to **increase by $15 - 30\\%$**, while elongation at break drops sharply.`,

  ch4: `# Chapter 4: Melt Flow Rate (MFR/MVR) & Capillary Viscometry Analysis

## 1. Executive Overview & Physical Principles
Melt Flow Rate (MFR / MFI - ASTM D1238 / ISO 1133) is the universally adopted standard index for raw material incoming quality control and grade identification in plastic manufacturing plants.

MFR measures the mass of molten polymer (in grams) extruded through a standard cylindrical die ($2.095\\text{ mm}$ diameter, $8.000\\text{ mm}$ length) over 10 minutes at a specified temperature and dead-weight load.

While MFR is an excellent single-point quality check for average molecular weight ($M_w \\propto \\text{MFR}^{-3.4}$), it operates at a very low shear rate ($\\dot{\\gamma} \\approx 1 - 50\\text{ s}^{-1}$). Therefore, MFR **cannot predict high-shear processing behavior** ($10,000\\text{ s}^{-1}$) in injection moulding gates.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Melt Flow Rate (MFR) and Melt Volume-Rate (MVR) Formulas
$$\\text{MFR (g/10min)} = \\frac{600 \\cdot m_{\\text{extrudate}}}{t_{\\text{cut}}}$$

$$\\text{MVR (cm}^3\\text{/10min)} = \\frac{\\text{MFR}}{\\rho_{\\text{melt}}(T)}$$

### B. MFI Test Condition Specifications Matrix

| Polymer Grade | Standard Test Temp ($^circ\\text{C}$) | Test Load ($\\text{kg}$) | Target MFR Range ($\\text{g/10min}$) | Target Application |
|---|---|---|---|---|
| **Polypropylene (Extrusion Pipe)** | $230^\\circ\\text{C}$ | $2.16\\text{ kg}$ | $0.8 - 2.0$ | Pipe extrusion, blow moulding |
| **Polypropylene (Thin-Wall Injection)** | $230^\\circ\\text{C}$ | $2.16\\text{ kg}$ | $35.0 - 70.0$ | Thin-wall food containers |
| **Polyethylene (LDPE Film)** | $190^\\circ\\text{C}$ | $2.16\\text{ kg}$ | $1.5 - 4.0$ | Blown packaging film |
| **Polycarbonate (CD/DVD Grade)** | $300^\\circ\\text{C}$ | $1.20\\text{ kg}$ | $60.0 - 80.0$ | Optical discs, thin lenses |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A QA technician in Daman is measuring the Melt Flow Rate (MFR) of an injection-moulding Polypropylene lot per ASTM D1238 ($230^\\circ\\text{C} / 2.16\\text{ kg}$).
* Extrudate cut interval ($t_{\\text{cut}}$): $30.0\\text{ seconds}$
* Measured mass of extrudate cut ($m_{\\text{extrudate}}$): $1.240\\text{ grams}$
* Measured PP melt density at $230^\\circ\\text{C}$: $\\rho_{\\text{melt}} = 0.738\\text{ g/cm}^3$
* MFI die radius ($R$): $1.0475\\text{ mm} = 0.10475\\text{ cm}$.

**Calculate:**
1. The Melt Flow Rate (MFR) in $\\text{g/10min}$.
2. The Melt Volume-Rate (MVR) in $\\text{cm}^3\\text{/10min}$.
3. The apparent shear rate ($\\dot{\\gamma}_{\\text{app}}$) inside the MFI die orifice.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Melt Flow Rate (MFR)
$$\\text{MFR} = \\frac{600 \\times m_{\\text{extrudate}}}{t_{\\text{cut}}} = \\frac{600 \\times 1.240\\text{ g}}{30.0\\text{ s}} = \\frac{744.0}{30.0} = \\mathbf{24.80\\text{ g/10min}}$$

#### Step 2: Calculate Melt Volume-Rate (MVR)
$$\\text{MVR} = \\frac{\\text{MFR}}{\\rho_{\\text{melt}}} = \\frac{24.80\\text{ g/10min}}{0.738\\text{ g/cm}^3} = \\mathbf{33.60\\text{ cm}^3\\text{/10min}}$$

#### Step 3: Calculate Apparent Shear Rate ($\\dot{\\gamma}_{\\text{app}}$)
Volumetric flow rate $Q$:
$$Q = \\frac{33.60\\text{ cm}^3}{600\\text{ s}} = 0.0560\\text{ cm}^3/\\text{s} = 56.0\\text{ mm}^3/\\text{s}$$

$$\\dot{\\gamma}_{\\text{app}} = \\frac{4 Q}{\\pi R^3} = \\frac{4 \\times 56.0}{\\pi \\times (1.0475)^3} = \\frac{224.0}{3.6105} = \\mathbf{62.04\\text{ s}^{-1}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 4.1 (MFI Thermal Degradation Indicator)
**Question:** A reprocessed Polycarbonate resin has an initial prime MFR of $10.5\\text{ g/10min}$. After 3 re-grind extrusion cycles, MFR measures $38.2\\text{ g/10min}$. What has occurred?
**Answer & Rationale:** The $3.6\\times$ increase in MFR indicates severe **hydrolytic and thermal chain scission**. Polymer chain length ($M_w$) has dropped substantially ($M_w \\propto \\text{MFR}^{-1/3.4}$), reducing impact strength by $>60\\%$.

### ❓ Exercise 4.2 (High-Shear Viscosity Inversion)
**Question:** Polymer Grade A has MFR = $10\\text{ g/10min}$ ($n = 0.8$), while Grade B has MFR = $5\\text{ g/10min}$ ($n = 0.2$). Which grade flows easier inside a high-shear gate ($20,000\\text{ s}^{-1}$)?
**Answer & Rationale:** **Grade B flows easier.** Although Grade B has lower MFR at low shear ($5\\text{ s}^{-1}$), its strong pseudoplastic shear-thinning ($n = 0.2$) causes viscosity to drop far below Grade A at $20,000\\text{ s}^{-1}$.`,

  ch5: `# Chapter 5: Spectroscopic & Chromatographic Analysis: FTIR, GPC/SEC & Polydispersity

## 1. Executive Overview & Physical Principles
Spectroscopic and chromatographic techniques provide molecular structure verification and molecular weight distribution determination.

1. **Fourier Transform Infrared Spectroscopy (FTIR - ATR Mode):** Measures vibrational absorption frequencies of molecular chemical bonds. Pinpoints functional groups ($C=O, N-H, O-H, C-H$) for rapid resin identification and oxidation quantification.
2. **Gel Permeation Chromatography / Size Exclusion Chromatography (GPC/SEC):** Separates polymer molecules by hydrodynamic volume in porous gel column beds. Determines molecular weight averages:
   * **Number-Average MW ($M_n$):** $\\frac{\\sum N_i M_i}{\\sum N_i}$ (governs colligative properties and end-groups).
   * **Weight-Average MW ($M_w$):** $\\frac{\\sum N_i M_i^2}{\\sum N_i M_i}$ (governs melt viscosity $\\eta_0 \\propto M_w^{3.4}$).
   * **Polydispersity Index ($\\text{PDI} = M_w / M_n$):** Quantifies breadth of molecular weight distribution.

---

## 2. Key Industrial Parameters & Governing Equations

### A. FTIR Characteristic Functional Absorption Peaks

| Chemical Functional Group | Wavenumber Range ($\\text{cm}^{-1}$) | Polymer Identification Application |
|---|---|---|
| **Carbonyl Group ($C=O$)** | $1715 - 1735\\text{ cm}^{-1}$ | PET, Polycarbonate, Oxidized PE degradation |
| **Amide Group ($N-H$)** | $3300 - 3400\\text{ cm}^{-1}$ | Polyamide 6, Polyamide 6,6 |
| **Aliphatic $C-H$ Stretch** | $2850 - 2950\\text{ cm}^{-1}$ | Polyethylene, Polypropylene backbones |
| **Aromatic Ring ($C=C$)** | $1500 - 1600\\text{ cm}^{-1}$ | Polystyrene, Polycarbonate, ABS |

### B. GPC Molecular Weight Averages Matrix

| Polymer Synthesis Class | Typical $M_n$ ($\\text{g/mol}$) | Typical $M_w$ ($\\text{g/mol}$) | Polydispersity Index (PDI) | Processing Impact |
|---|---|---|---|---|
| **Anionic Living Polymer** | $50,000$ | $52,500$ | $1.05$ | Zero shear thinning, monodisperse |
| **Metallocene LLDPE** | $38,000$ | $83,600$ | $2.20$ | High toughness, narrow melting peak |
| **Ziegler-Natta HDPE** | $28,000$ | $140,000$ | $5.00$ | Excellent shear thinning & die swell |
| **Free Radical LDPE** | $18,000$ | $198,000$ | $11.00$ | High melt strength, long-chain branching |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
An analytical chemist in Bengaluru processes a GPC chromatogram for an extrusion-grade Pipe Polyethylene resin.
* Number-average molecular weight: $M_n = 32,500\\text{ g/mol}$
* Weight-average molecular weight: $M_w = 156,000\\text{ g/mol}$
* Z-average molecular weight: $M_z = 520,000\\text{ g/mol}$

**Calculate:**
1. The Polydispersity Index ($\\text{PDI} = M_w / M_n$).
2. The $M_z / M_w$ ratio (governing melt elastic memory and die swell).
3. If thermal degradation reduces $M_w$ to $110,000\\text{ g/mol}$, calculate the percentage drop in zero-shear viscosity ($\\eta_0 \\propto M_w^{3.4}$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Polydispersity Index (PDI)
$$\\text{PDI} = \\frac{M_w}{M_n} = \\frac{156,000}{32,500} = \\mathbf{4.800}$$

#### Step 2: Calculate $M_z / M_w$ Ratio
$$\\frac{M_z}{M_w} = \\frac{520,000}{156,000} = \\mathbf{3.333}$$

The high $M_z / M_w$ ratio confirms high melt strength and extrudate die swell control!

#### Step 3: Calculate Percentage Drop in Zero-Shear Viscosity ($\\eta_0$)
$$\\frac{\\eta_{0,\\text{degraded}}}{\\eta_{0,\\text{initial}}} = \\left( \\frac{M_{w,\\text{degraded}}}{M_{w,\\text{initial}}} \\right)^{3.4} = \\left( \\frac{110,000}{156,000} \\right)^{3.4} = (0.7051)^{3.4} = \\mathbf{0.3045}$$

$$\\%\\text{Drop in Viscosity} = (1 - 0.3045) \\times 100\\% = \\mathbf{69.55\\%\\text{ drop}}$$

A $29.5\\%$ drop in $M_w$ causes a **$69.55\\%$ crash in zero-shear viscosity**!

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 5.1 (FTIR Oxidation Index Calculation)
**Question:** How is the Carbonyl Index ($CI$) calculated from FTIR spectra to quantify UV degradation in Polypropylene outdoor furniture?
**Answer & Rationale:**
$$CI = \\frac{A_{1715\\text{ cm}^{-1}}}{A_{2920\\text{ cm}^{-1}}}$$
Where $A_{1715}$ is the carbonyl peak absorbance and $A_{2920}$ is the reference $C-H$ backbone absorbance. Values **$CI > 0.15$** indicate severe embrittlement.

### ❓ Exercise 5.2 (High-Temperature GPC Solvent Requirement)
**Question:** Why must GPC characterization of Polyethylene and Polypropylene be conducted at $160^\\circ\\text{C}$ in 1,2,4-Trichlorobenzene (TCB)?
**Answer & Rationale:** Polyolefins are insoluble in all organic solvents at room temperature due to high crystalline density. Dissolving PE/PP requires heating above $140^\\circ\\text{C}$ in chlorinated aromatic solvent (TCB) with BHT antioxidant to prevent thermal degradation during column separation.`
};

console.log('Testing expanded chapters generated!');
