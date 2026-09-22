// scripts/generate_chemistry_chapters.mjs

export const CHEMISTRY_EXPANDED = {
  ch2: `# Chapter 2: Free Radical & Controlled Radical Polymerization (RAFT, ATRP, NMP Kinetics)

## 1. Executive Overview & Physical Principles
Free Radical Polymerization (FRP) is the predominant industrial route for synthesizing commodity polymers such as Low-Density Polyethylene (LDPE), Polyvinyl Chloride (PVC), Polystyrene (PS), and Poly(methyl methacrylate) (PMMA).

FRP proceeds through three distinct elementary kinetic steps:
1. **Initiation:** Homolytic cleavage of initiator molecules (AIBN, Benzoyl Peroxide) generating free radicals ($I^\\bullet$), followed by addition to monomer ($M$).
2. **Propagation:** Rapid sequential addition of monomer molecules to propagating chain radicals ($P_n^\\bullet + M \\xrightarrow{k_p} P_{n+1}^\\bullet$).
3. **Termination:** Bimolecular destruction of active radical centers via combination ($P_n^\\bullet + P_m^\\bullet \\xrightarrow{k_{tc}} P_{n+m}$) or disproportionation ($P_n^\\bullet + P_m^\\bullet \\xrightarrow{k_{td}} P_n^{=} + P_m$).

Because bimolecular termination occurs rapidly, conventional FRP yields broad molecular weight distributions ($\\text{PDI} = 2.0 - 5.0$).

To achieve living characteristics and narrow distributions ($\\text{PDI} < 1.10$), **Controlled / Living Radical Polymerization (CLRP)** techniques (ATRP, RAFT, NMP) establish a dynamic equilibrium between active propagating radicals ($P_n^\\bullet$) and dormant species ($P_n-X$).

---

## 2. Key Industrial Parameters & Governing Equations

### A. Steady-State Free Radical Rate Equation ($R_p$)
Applying the Steady-State Approximation ($R_i = R_t$):

$$R_p = k_p \\cdot [M] \\cdot \\sqrt{\\frac{f \\cdot k_d \\cdot [I]}{k_t}}$$

### B. Kinetic Chain Length ($\\nu$) and Polydispersity
$$\\nu = \\frac{R_p}{R_i} = \\frac{k_p \\cdot [M]}{2 \\cdot \\sqrt{f \\cdot k_d \\cdot k_t \\cdot [I]}}$$

* For termination by combination: $\\bar{X}_n = 2 \\nu, \\quad \\text{PDI} = 1.50$.
* For termination by disproportionation: $\\bar{X}_n = \\nu, \\quad \\text{PDI} = 2.00$.

### C. CLRP Mechanism Comparison Matrix

| CLRP Technique | Key Control Reagent | Dormant Species Structure | Transition Metal Catalyst Required? | Block Copolymer Synthesis Ability |
|---|---|---|---|---|
| **ATRP** (Atom Transfer) | Alkyl halide ($R-X$) | Polymer-Halide ($P_n-X$) | Yes ($\text{Cu}^\text{I} / \text{Ligand}$) | Exceptional for Methacrylates, Styrene |
| **RAFT** (Reversible Addition) | Thiocarbonylthio compound | Dithioester adduct ($P_n-S-CS-R$) | No (Standard initiator) | Compatible with widest monomer range |
| **NMP** (Nitroxide Mediated) | TEMPO / BlocBuilder | Nitroxide adduct ($P_n-O-NR_2$) | No | Best for Styrene & Acrylates |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A chemical synthesis engineer in Vadodara is manufacturing Poly(methyl methacrylate) (PMMA) via free radical solution polymerization in toluene at $60^\\circ\\text{C}$ using Azobisisobutyronitrile (AIBN) initiator.
* Initial monomer concentration ($[M]$): $2.00\\text{ mol/L}$
* Initial initiator concentration ($[I]$): $0.020\\text{ mol/L}$
* Initiator decomposition constant ($k_d$): $8.50 \\times 10^{-6}\\text{ s}^{-1}$
* Initiator efficiency ($f$): $0.60$
* Propagation rate constant ($k_p$): $367.0\\text{ L/mol}\\cdot\\text{s}$
* Total termination rate constant ($k_t$): $9.30 \\times 10^6\\text{ L/mol}\\cdot\\text{s}$

**Calculate:**
1. The radical initiation rate ($R_i$).
2. The overall steady-state rate of polymerization ($R_p$).
3. The kinetic chain length ($\\nu$) and theoretical number-average molecular weight ($M_n$) assuming termination strictly by combination ($M_{\\text{MMA}} = 100.12\\text{ g/mol}$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Radical Initiation Rate ($R_i$)
$$R_i = 2 \\cdot f \\cdot k_d \\cdot [I] = 2 \\times 0.60 \\times (8.50 \\times 10^{-6}\\text{ s}^{-1}) \\times (0.020\\text{ mol/L})$$
$$R_i = 1.20 \\times 1.70 \\times 10^{-7} = \\mathbf{2.04 \\times 10^{-7}\\text{ mol/L}\\cdot\\text{s}}$$

#### Step 2: Calculate Overall Polymerization Rate ($R_p$)
$$R_p = k_p \\cdot [M] \\cdot \\sqrt{\\frac{R_i}{2 k_t}} = 367.0 \\times 2.00 \\times \\sqrt{\\frac{2.04 \\times 10^{-7}}{2 \\times 9.30 \\times 10^6}}$$

$$\\sqrt{\\frac{2.04 \\times 10^{-7}}{1.86 \\times 10^7}} = \\sqrt{1.09677 \\times 10^{-14}} = 1.04727 \\times 10^{-7}\\text{ mol/L}$$

$$R_p = 734.0 \\times (1.04727 \\times 10^{-7}) = \\mathbf{7.687 \\times 10^{-5}\\text{ mol/L}\\cdot\\text{s}}$$

#### Step 3: Calculate Kinetic Chain Length ($\\nu$) and $M_n$
$$\\nu = \\frac{R_p}{R_i} = \\frac{7.687 \\times 10^{-5}}{2.04 \\times 10^{-7}} = \\mathbf{376.81\\text{ monomer units}}$$

For combination termination:
$$\\bar{X}_n = 2 \\nu = 2 \\times 376.81 = \\mathbf{753.62}$$

$$M_n = \\bar{X}_n \\cdot M_{\\text{MMA}} = 753.62 \\times 100.12\\text{ g/mol} = \\mathbf{75,452\\text{ g/mol}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 2.1 (Trommsdorff / Gel Effect Mechanics)
**Question:** During bulk polymerization of Methyl Methacrylate, polymerization rate ($R_p$) accelerates uncontrollably at $40\\%$ conversion. What causes this "Gel Effect"?
**Answer & Rationale:** Rising solution viscosity restricts long polymer chain mobility, drastically decreasing bimolecular termination rate $k_t$ (by up to 3 orders of magnitude). However, small monomer molecules continue diffusing freely to active centers ($k_p$ remains constant). Since $R_p \\propto 1 / \\sqrt{k_t}$, polymerization rate surges, generating exotherms and potential reactor runaway.

### ❓ Exercise 2.2 (ATRP Copper Catalyst Removal)
**Question:** Why must residual copper catalyst ($\text{Cu}^\text{I}/\text{Cu}^\text{II}$) be removed from synthesized ATRP polymers prior to commercial processing?
**Answer & Rationale:** Residual copper acts as a pro-oxidant catalyst, promoting rapid thermal discoloration, degradation, and electrical conductivity loss. Industrial purification passes polymer solution through alumina or silica gel beds to drop copper levels below **$5\\text{ ppm}$**.`,

  ch3: `# Chapter 3: Copolymerization Reactivity Ratios, Mayo-Lewis Equation & Q-e Scheme

## 1. Executive Overview & Physical Principles
Copolymerization involves the simultaneous polymerization of two or more chemically distinct monomers ($M_1, M_2$) to synthesize materials with tailored property balances unreachable in homopolymers (such as Styrene-Acrylonitrile SAN, ABS, Ethylene-Vinyl Acetate EVA, and Nitrile Rubber NBR).

The instantaneous chemical composition of a growing copolymer chain ($F_1$) depends on the monomer feed composition ratio ($f_1, f_2$) and the **monomer reactivity ratios ($r_1, r_2$)**:

$$r_1 = \\frac{k_{11}}{k_{12}}, \\quad r_2 = \\frac{k_{22}}{k_{21}}$$

* $k_{11}$: Rate constant for radical $P_1^\\bullet$ adding monomer $M_1$ (homo-propagation).
* $k_{12}$: Rate constant for radical $P_1^\\bullet$ adding monomer $M_2$ (cross-propagation).

---

## 2. Key Industrial Parameters & Governing Equations

### A. Mayo-Lewis Instantaneous Copolymerization Equation
$$F_1 = \\frac{r_1 f_1^2 + f_1 f_2}{r_1 f_1^2 + 2 f_1 f_2 + r_2 f_2^2}$$

### B. Azeotropic Copolymer Feed Composition ($f_{1,ae}$)
When $r_1 < 1$ and $r_2 < 1$, an azeotropic feed point exists where copolymer composition equals monomer feed composition ($F_1 = f_1$), preventing composition drift during batch polymerization:

$$f_{1,ae} = \\frac{1 - r_2}{2 - r_1 - r_2}$$

### C. Industrial Copolymer Reactivity Ratio Matrix

| Monomer Pair ($M_1 / M_2$) | $r_1$ | $r_2$ | Product $r_1 r_2$ | Copolymerization Microstructure Type |
|---|---|---|---|---|
| **Styrene / Methyl Methacrylate** | $0.52$ | $0.46$ | $0.239$ | Random / Ideal Copolymer |
| **Styrene / Acrylonitrile (SAN)** | $0.41$ | $0.04$ | $0.016$ | Strongly Alternating Tendency |
| **Styrene / Maleic Anhydride** | $0.01$ | $0.00$ | $0.000$ | Perfectly Alternating ($1:1$) |
| **Ethylene / Vinyl Acetate (EVA)** | $0.97$ | $1.02$ | $0.989$ | Ideal Random Distribution |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A chemical process supervisor in Hazira is running a batch reactor synthesizing Styrene-Acrylonitrile (SAN) resin ($M_1 = \\text{Styrene}, M_2 = \\text{Acrylonitrile}$).
* Measured reactivity ratios: $r_1 = 0.41, \\quad r_2 = 0.04$.

**Calculate:**
1. The azeotropic monomer feed mole fraction ($f_{1,ae}$) required to eliminate composition drift.
2. The instantaneous mole fraction of styrene ($F_1$) incorporated into the copolymer if the reactor is fed with monomer mixture $f_1 = 0.70$ ($70\\text{ mol}\\%$ styrene).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Azeotropic Feed Fraction ($f_{1,ae}$)
$$f_{1,ae} = \\frac{1 - r_2}{2 - r_1 - r_2} = \\frac{1 - 0.04}{2 - 0.41 - 0.04} = \\frac{0.96}{1.55} = \\mathbf{0.61935} \\quad (61.94\\text{ mol}\\%\\text{ Styrene})$$

Operating at $61.94\\text{ mol}\\%$ styrene feed guarantees **zero composition drift** throughout the reaction batch!

#### Step 2: Calculate Instantaneous $F_1$ for $f_1 = 0.70$ ($f_2 = 0.30$)
$$f_1^2 = (0.70)^2 = 0.49, \\quad f_2^2 = (0.30)^2 = 0.09, \\quad f_1 f_2 = 0.70 \\times 0.30 = 0.21$$

Numerator:
$$\\text{Num} = r_1 f_1^2 + f_1 f_2 = (0.41 \\times 0.49) + 0.21 = 0.2009 + 0.2100 = 0.4109$$

Denominator:
$$\\text{Den} = r_1 f_1^2 + 2 f_1 f_2 + r_2 f_2^2 = 0.2009 + 2(0.2100) + (0.04 \\times 0.09)$$
$$\\text{Den} = 0.2009 + 0.4200 + 0.0036 = 0.6245$$

$$F_1 = \\frac{0.4109}{0.6245} = \\mathbf{0.65797} \\quad (65.80\\text{ mol}\\%\\text{ Styrene in copolymer})$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 3.1 (Composition Drift Prevention in Batch Reactors)
**Question:** Why does batch copolymerization of Styrene ($f_1 = 0.90$) and Acrylonitrile ($f_2 = 0.10$) produce opaque, hazy polymer beads with poor impact strength?
**Answer & Rationale:** Operating away from the azeotropic composition ($f_{1,ae} = 0.62$) causes severe **composition drift**. Acrylonitrile reacts faster initially, depleting $M_2$. Later polymer chains become rich in styrene. The resulting blend of incompatible chains causes phase separation and optical haze.

### ❓ Exercise 3.2 (Alfrey-Price Q-e Scheme Prediction)
**Question:** How do resonance parameter $Q$ and polar parameter $e$ predict reactivity ratios $r_1$ and $r_2$?
**Answer & Rationale:**
$$r_1 = \\frac{Q_1}{Q_2} \\exp[-e_1(e_1 - e_2)], \\quad r_2 = \\frac{Q_2}{Q_1} \\exp[-e_2(e_2 - e_1)]$$
Monomers with large differences in polar parameters ($e_1 > 0$ electron withdrawing vs $e_2 < 0$ electron donating) exhibit strong alternating cross-propagation ($r_1 r_2 \\to 0$).`,

  ch4: `# Chapter 4: Ziegler-Natta & Metallocene Coordination Polymerization Kinetics

## 1. Executive Overview & Physical Principles
Coordination polymerization accounts for over $150\\text{ Million Metric Tonnes}$ of annual global polyolefin production (HDPE, LLDPE, Isotactic PP).

Unlike free radical polymerization, coordination polymerization occurs at transition metal active centers via insertion of monomer double bonds into metal-carbon bonds (Cossee-Arlman Mechanism):

1. **Heterogeneous Ziegler-Natta Catalysts ($\text{TiCl}_4 / \text{MgCl}_2 / \text{AlEt}_3$):** Contain multiple active Ti site geometries on crystal surfaces, producing polymers with broad MWD ($\\text{PDI} = 4.0 - 8.0$) and moderate tacticity.
2. **Homogeneous Metallocene Catalysts ($Cp_2 \text{ZrCl}_2 / \text{MAO}$):** Single-site organometallic catalysts providing precise control over stereoregularity (isotactic vs syndiotactic PP), narrow MWD ($\\text{PDI} = 2.0 - 2.5$), and uniform comonomer incorporation in LLDPE.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Polymerization Rate Equation ($R_p$)
$$R_p = k_p \\cdot [C^*] \\cdot [M]$$

Where:
* $[C^*]$ = Active transition metal site concentration ($\\text{mol/L}$).
* $[M]$ = Dissolved monomer concentration in solvent or liquid phase ($\\text{mol/L}$).

### B. Polypropylene Tacticity Index ($\\% [mm]$)
Isotactic PP stereoregularity measured via $^{13}\\text{C-NMR}$ triad analysis:

$$\\% [mm] = \\frac{\\text{Isotactic Triads } [mm]}{\\text{Total Triads } ([mm] + [mr] + [rr])} \\times 100\\% > 95\\%$$

### C. Olefin Catalyst Generation Comparison Matrix

| Catalyst Generation | Active Metal Center | Co-catalyst Required | Productivity ($\\text{kg PP / g Ti}$) | Polymer Tacticity Index | MWD (PDI) |
|---|---|---|---|---|---|
| **1st Gen Z-N ($\text{TiCl}_3$)** | $\\text{Ti}^{3+}$ surface | $\\text{AlEt}_2\\text{Cl}$ | $1.5 - 3.0$ | $88 - 92\\%$ (De-ashing required) | $6.0 - 10.0$ |
| **4th Gen Z-N ($\text{TiCl}_4/\text{MgCl}_2$)** | $\\text{Ti}^{4+}$ on $\\text{MgCl}_2$ | $\\text{AlEt}_3$ + Internal donor | $40.0 - 80.0$ | $97 - 99\\%$ (Spherical morphology) | $4.5 - 6.5$ |
| **Metallocene (Single-Site)** | $\\text{Zr}^{4+} / \\text{Hf}^{4+}$ | MAO (Methylaluminoxane) | $100.0 - 300.0$ | $>99.5\\%$ (Tailored iso/syndio) | $2.0 - 2.3$ |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
An olefin polymerization plant engineer in Panipat is operating a 4th-generation Ziegler-Natta loop reactor producing isotactic Polypropylene at $70^\\circ\\text{C}$.
* Reactor slurry volume ($V_{\\text{reactor}}$): $45.0\\text{ m}^3 = 45,000\\text{ Liters}$
* Active titanium concentration in reactor ($[C^*]$): $1.20 \\times 10^{-4}\\text{ mol Ti / L}$
* Dissolved propylene monomer concentration ($[M]$): $0.55\\text{ mol/L}$
* Propagation rate constant ($k_p$): $7,500\\text{ L/mol}\\cdot\\text{s}$
* Titanium molar mass: $47.867\\text{ g/mol}$

**Calculate:**
1. The volumetric rate of polymerization ($R_p$ in $\\text{mol/L}\\cdot\\text{s}$).
2. The total mass output rate of Polypropylene ($\\dot{m}_{PP}$ in $\\text{kg/hr}$).
3. The catalyst productivity in $\\text{kg PP / g Ti}$.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Polymerization Rate ($R_p$)
$$R_p = k_p \\cdot [C^*] \\cdot [M] = 7,500 \\times (1.20 \\times 10^{-4}) \\times 0.55$$
$$R_p = 0.900 \\times 0.55 = \\mathbf{0.495\\text{ mol/L}\\cdot\\text{s}}$$

#### Step 2: Calculate Hourly Polymer Output ($\\dot{m}_{PP}$)
Total moles produced per second in $45,000\\text{ L}$ reactor:
$$\\dot{N} = 0.495\\text{ mol/L}\\cdot\\text{s} \\times 45,000\\text{ L} = 22,275\\text{ mol/s}$$

Mass output rate:
$$\\dot{m}_{PP} = 22,275\\text{ mol/s} \\times 0.04208\\text{ kg/mol (PP monomer)} \\times 3,600\\text{ s/hr}$$
$$\\dot{m}_{PP} = 937.33 \\times 3,600 = \\mathbf{3,374,388\\text{ kg/hr}} \\quad (3,374.4\\text{ Tonnes/hr output})$$

#### Step 3: Calculate Catalyst Productivity per Gram Titanium
Ti concentration: $1.20 \\times 10^{-4}\\text{ mol/L} \\times 47.867\\text{ g/mol} = 0.005744\\text{ g Ti / L}$.
Total Ti in reactor: $0.005744 \\times 45,000 = 258.48\\text{ g Ti}$.

Average residence time $\\tau = 1.0\\text{ hour}$:
$$\\text{Productivity} = \\frac{3,374,388\\text{ kg PP}}{258.48\\text{ g Ti}} = \\mathbf{13,054.7\\text{ kg PP / g Ti}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 4.1 (Hydrogen Chain Transfer MFI Control)
**Question:** How does adding trace hydrogen ($H_2$) to a Ziegler-Natta Polypropylene reactor control Melt Flow Index without deactivating the catalyst?
**Answer & Rationale:** Hydrogen undergoes reversible dissociative chain transfer ($\text{Ti}-P_n + H_2 \\to \\text{Ti}-H + P_n-H$). This terminates the growing chain at target length without destroying the active $\\text{Ti}-H$ site, which immediately re-initiates a new polymer chain.

### ❓ Exercise 4.2 (Role of Methylaluminoxane MAO in Metallocenes)
**Question:** Why does Metallocene catalyst $Cp_2\\text{ZrCl}_2$ require massive excess of MAO ($[\\text{Al}]/[\\text{Zr}] = 1000 : 1$) for high activity?
**Answer & Rationale:** MAO performs two functions: it alkylates $Cp_2\\text{ZrCl}_2$ by replacing chlorine atoms with methyl groups, and then abstracts a methyl anion to form the coordinatively unsaturated, highly active cationic catalyst complex $[Cp_2\\text{Zr-CH}_3]^+ [\\text{MAO-Cl}]^-$.`,

  ch5: `# Chapter 5: Ring-Opening Polymerization & Biodegradable Polymers (PLA, PCL & PHA Synthesis)

## 1. Executive Overview & Physical Principles
Environmental sustainability and microplastic regulations have driven intense industrial development of bio-based and biodegradable polyesters, led by Polylactic Acid (PLA), Polycaprolactone (PCL), Polyglycolic Acid (PGA), and Polyhydroxyalkanoates (PHA).

Direct polycondensation of lactic acid yields low-molecular-weight brittle oligomers due to water equilibrium constraints. High-molecular-weight commercial PLA ($M_n > 100,000\\text{ g/mol}$) is synthesized via catalytic **Ring-Opening Polymerization (ROP)** of cyclic lactide dimers using Stannous Octoate ($\\text{Sn(Oct)}_2$) catalyst and alcohol initiators.

The thermodynamic driving force for ROP is the enthalpy relief of cyclic ring strain:

$$\\Delta G_{\\text{rop}} = \\Delta H_{\\text{ring strain}} - T \\cdot \\Delta S_{\\text{rop}} < 0$$

---

## 2. Key Industrial Parameters & Governing Equations

### A. Number-Average Polymerization Degree in ROP ($\\bar{X}_n$)
Assuming living coordination-insertion mechanism:

$$\\bar{X}_n = \\frac{[M]_0 - [M]_t}{[I]_0} \\cdot n_{\\text{ester}} = \\frac{[M]_0 \\cdot p}{[I]_0}$$

Where:
* $[M]_0, [I]_0$ = Initial monomer and initiator molar concentrations.
* $p$ = Fractional monomer conversion.

### B. Biodegradable Polyester Property Matrix

| Polymer Resin Class | Synthesis Route | Glass Temp $T_g$ ($^\\circ\\text{C}$) | Melting Temp $T_m$ ($^\\circ\\text{C}$) | Degradation Mechanism | Typical Industrial Applications |
|---|---|---|---|---|---|
| **Poly(L-lactic acid) PLLA** | ROP of L-Lactide | $60^\\circ\\text{C}$ | $175^\\circ\\text{C}$ | Hydrolytic ester cleavage | Thermoformed cups, 3D printing filament |
| **Polycaprolactone (PCL)** | ROP of $\\epsilon$-Caprolactone | $-60^\\circ\\text{C}$ | $60^\\circ\\text{C}$ | Enzymatic & hydrolytic | Biomedical implants, polyurethane modifier |
| **Poly(hydroxybutyrate) PHB** | Bacterial fermentation | $5^\\circ\\text{C}$ | $180^\\circ\\text{C}$ | Microbial enzymatic digest | Marine biodegradable packaging |
| **Stereocomplex PLA (PLLA+PDLA)** | 1:1 enantiomer blend | $65^\\circ\\text{C}$ | $230^\\circ\\text{C}$ | High heat hydrolytic | Durable engineering components |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A biopolymer synthesis team in Mysore is manufacturing Polylactic Acid (PLA) via ROP of L-lactide in a bulk melt reactor at $180^\\circ\\text{C}$ using Stannous Octoate catalyst and Lauryl Alcohol initiator.
* Initial L-Lactide monomer concentration ($[M]_0$): $4.50\\text{ mol/L}$
* Initial Lauryl Alcohol initiator concentration ($[I]_0$): $0.015\\text{ mol/L}$
* L-Lactide monomer molar mass ($M_{\\text{lactide}}$): $144.13\\text{ g/mol}$
* Measured monomer conversion after 2 hours ($p$): $96.0\\%$ ($0.960$)

**Calculate:**
1. The theoretical number-average degree of polymerization ($\\bar{X}_n$).
2. The theoretical number-average molecular weight ($M_n$) of the resulting PLA resin.
3. If initiator concentration is reduced to $[I]_0 = 0.005\\text{ mol/L}$, calculate the new theoretical $M_n$.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Degree of Polymerization ($\\bar{X}_n$)
$$\\bar{X}_n = \\frac{[M]_0 \\cdot p}{[I]_0} = \\frac{4.50\\text{ mol/L} \\times 0.960}{0.015\\text{ mol/L}} = \\frac{4.320}{0.015} = \\mathbf{288.0\\text{ lactide units}}$$

#### Step 2: Calculate Number-Average Molecular Weight ($M_n$)
Each L-lactide cyclic dimer contributes 2 lactic acid repeat units ($M_{\\text{unit}} = 72.06\\text{ g/mol}$):
$$M_n = \\bar{X}_n \\cdot M_{\\text{lactide}} + M_{\\text{initiator}} = (288.0 \\times 144.13\\text{ g/mol}) + 186.33\\text{ g/mol}$$
$$M_n = 41,509.44 + 186.33 = \\mathbf{41,695.8\\text{ g/mol}}$$

#### Step 3: Calculate New $M_n$ for Lower Initiator Concentration ($0.005\\text{ mol/L}$)
$$\\bar{X}_{n,\\text{new}} = \\frac{4.320}{0.005} = \\mathbf{864.0\\text{ lactide units}}$$

$$M_{n,\\text{new}} = (864.0 \\times 144.13) + 186.33 = 124,528.3 + 186.3 = \\mathbf{124,714.6\\text{ g/mol}}$$

Reducing initiator concentration by $3\\times$ increases molecular weight to commercial high-strength grade ($M_n > 120,000\\text{ g/mol}$)!

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 5.1 (Industrial Composting Degradation Protocol)
**Question:** Why does standard PLA bottle packaging remain unchanged in seawater ($20^\\circ\\text{C}$) for months, but degrades completely within 45 days in an industrial composting facility?
**Answer & Rationale:** PLA hydrolytic degradation requires temperatures exceeding its glass transition temperature ($T_g = 60^\\circ\\text{C}$). Industrial composting operates at **$58 - 65^\\circ\\text{C}$ and $90\\% \\text{ RH}$**, accelerating water absorption and ester cleavage. At $20^\\circ\\text{C}$ ambient seawater, water diffusion is extremely slow.

### ❓ Exercise 5.2 (Stereocomplex PLA Thermal Resistance Boost)
**Question:** Poly(L-lactic acid) (PLLA) deforms at $55^\\circ\\text{C}$ under load. How does blending equal parts PLLA and PDLA raise heat resistance to $>200^\\circ\\text{C}$?
**Answer & Rationale:** 1:1 blends of left-handed (PLLA) and right-handed (PDLA) enantiomers form interlocking **stereocomplex crystals**. Stereocomplex crystallites have a melting point $T_m = 230^\\circ\\text{C}$ ($50^\\circ\\text{C}$ higher than pure PLLA), boosting Heat Deflection Temperature to $>200^\\circ\\text{C}$.`
};

console.log('Chemistry expanded chapters generated!');
