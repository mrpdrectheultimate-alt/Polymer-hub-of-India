// scripts/test_rheology_expansion.mjs

export const RHEOLOGY_EXPANDED = {
  ch4: `# Chapter 4: Capillary Rheometry, Bagley Correction & Mooney-Rabinowitsch Shear Rate Corrections

## 1. Executive Overview & Physical Principles
Capillary rheometry is the definitive laboratory technique for measuring polymer melt flow behavior across high shear rates ($100 - 10,000\\text{ s}^{-1}$) typical of industrial extrusion dies and injection moulding gates. molten polymer is forced through a narrow cylindrical die of known diameter ($D$) and length ($L$) under controlled piston velocities.

However, raw capillary differential pressure measurements ($\Delta P_{\\text{raw}}$) suffer from two significant hydrodynamic errors:
1. **Entrance and Exit Pressure Losses (Bagley Effect):** Viscoelastic melt acceleration into the converging die inlet stores elastic strain energy and generates large extensional pressure drops ($\Delta P_{\\text{ent}}$).
2. **Non-Newtonian Velocity Profile Flattening (Rabinowitsch Effect):** Shear thinning causes the parabolic velocity profile of Newtonian fluids to flatten, making the true wall shear rate ($\\dot{\\gamma}_w$) significantly higher than the apparent wall shear rate ($\\dot{\\gamma}_{\\text{app}}$).

---

## 2. Key Industrial Parameters & Governing Equations

### A. Bagley Pressure Correction Equation
$$\\Delta P_{\\text{measured}} = \\Delta P_{\\text{capillary}} + \\Delta P_{\\text{end}} = 2 \\tau_w \\left( \\frac{L}{R} \\right) + \\Delta P_{\\text{end}}$$

Plotting $\\Delta P_{\\text{measured}}$ versus capillary length-to-radius ratio ($L/R$) at constant shear rate yields a straight line. The intercept on the pressure axis gives $\\Delta P_{\\text{end}}$, and the slope yields true wall shear stress ($\\tau_w$):

$$\\tau_w = \\frac{\\Delta P_{\\text{measured}} - \\Delta P_{\\text{end}}}{2 (L/R)}$$

### B. Mooney-Weissenberg-Rabinowitsch (MWR) Shear Rate Correction
$$\\dot{\\gamma}_w = \\dot{\\gamma}_{\\text{app}} \\left[ \\frac{3n + 1}{4n} \\right] = \\frac{4 Q}{\\pi R^3} \\left[ \\frac{3n + 1}{4n} \\right]$$

Where:
* $n = \\frac{d \\ln \\tau_w}{d \\ln \\dot{\\gamma}_{\\text{app}}}$ is the local Power-Law shear-thinning index.

### C. Industrial Capillary Parameter Matrix

| Polymer Resin Grade | Power-Law Index $n$ | Bagley End Correction $e = \\Delta P_{\\text{end}} / (2 \\tau_w)$ | Apparent Shear Rate ($\\text{s}^{-1}$) | MWR Correction Multiplier $\\frac{3n+1}{4n}$ | True Wall Shear Rate $\\dot{\\gamma}_w$ ($\\text{s}^{-1}$) |
|---|---|---|---|---|---|
| **LDPE (High Branching)** | $0.32$ | $12.5 - 18.0$ | $1,000$ | $1.531$ | $1,531$ |
| **HDPE (Linear High MW)** | $0.42$ | $4.0 - 7.5$ | $1,000$ | $1.345$ | $1,345$ |
| **PP Homopolymer** | $0.38$ | $5.5 - 9.0$ | $1,000$ | $1.408$ | $1,408$ |
| **Polycarbonate (PC)** | $0.72$ | $1.5 - 3.0$ | $1,000$ | $1.097$ | $1,097$ |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A quality laboratory in Manali, Chennai is evaluating an extrusion-grade LLDPE pipe resin using a twin-bore capillary rheometer.
* Capillary Die 1: Diameter $D = 1.0\\text{ mm}$, Length $L_1 = 10.0\\text{ mm}$ ($L_1/R = 20.0$)
* Capillary Die 2: Diameter $D = 1.0\\text{ mm}$, Length $L_2 = 30.0\\text{ mm}$ ($L_2/R = 60.0$)
* At volumetric flow rate $Q = 15.71\\text{ mm}^3/\\text{s}$ (apparent shear rate $\\dot{\\gamma}_{\\text{app}} = 200\\text{ s}^{-1}$):
  * Measured Pressure Die 1 ($\\Delta P_1$): $80.0\\text{ bar} = 8.0 \\times 10^6\\text{ Pa}$
  * Measured Pressure Die 2 ($\\Delta P_2$): $200.0\\text{ bar} = 20.0 \\times 10^6\\text{ Pa}$
* Local Power-Law index slope measured: $n = 0.40$

**Calculate:**
1. True wall shear stress ($\\tau_w$).
2. Entrance pressure drop ($\\Delta P_{\\text{end}}$).
3. True Rabinowitsch-corrected wall shear rate ($\\dot{\\gamma}_w$).
4. True melt apparent viscosity ($\\eta_{\\text{true}} = \\tau_w / \\dot{\\gamma}_w$).

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate True Wall Shear Stress ($\\tau_w$) and $\\Delta P_{\\text{end}}$
Using two capillary lengths at constant shear rate:
$$\\frac{\\Delta P_2 - \\Delta P_1}{2 (L_2/R - L_1/R)} = \\tau_w$$

$$\\tau_w = \\frac{(20.0 - 8.0) \\times 10^6\\text{ Pa}}{2 \\times (60.0 - 20.0)} = \\frac{12.0 \\times 10^6}{80.0} = \\mathbf{150,000\\text{ Pa}} \\quad (0.150\\text{ MPa})$$

Extrapolating back to $L/R = 0$:
$$\\Delta P_{\\text{end}} = \\Delta P_1 - 2 \\tau_w (L_1/R) = 8.0 \\times 10^6 - 2 (1.5 \\times 10^5)(20.0) = 8.0 \\times 10^6 - 6.0 \\times 10^6 = \\mathbf{2.0 \\times 10^6\\text{ Pa}} \\quad (20.0\\text{ bar})$$

#### Step 2: Calculate True Rabinowitsch Wall Shear Rate ($\\dot{\\gamma}_w$)
$$\\dot{\\gamma}_w = \\dot{\\gamma}_{\\text{app}} \\left[ \\frac{3(0.40) + 1}{4(0.40)} \\right] = 200 \\left[ \\frac{2.20}{1.60} \\right] = 200 \\times 1.375 = \\mathbf{275.0\\text{ s}^{-1}}$$

#### Step 3: Calculate True Viscosity ($\\eta_{\\text{true}}$)
$$\\eta_{\\text{true}} = \\frac{\\tau_w}{\\dot{\\gamma}_w} = \\frac{150,000\\text{ Pa}}{275.0\\text{ s}^{-1}} = \\mathbf{545.45\\text{ Pa}\\cdot\\text{s}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 4.1 (Bagley End Correction Significance)
**Question:** What percentage error occurs in apparent viscosity calculation if an engineer ignores the Bagley end correction for a short capillary die ($L/D = 5$)?
**Answer & Rationale:** For a die with $L/R = 10$, $\\Delta P_{\\text{raw}} = 2 \\tau_w (10) + \\Delta P_{\\text{end}}$. If $\\Delta P_{\\text{end}}$ is $33\\%$ of $\\Delta P_{\\text{raw}}$, uncorrected shear stress $\\tau_{\\text{uncorrected}} = \\Delta P_{\\text{raw}} / 20 = 1.5 \\tau_w$. Ignoring Bagley end correction overestimates true viscosity by **$50\\%$**, leading to severe undersizing of extruder motor torque requirements.

### ❓ Exercise 4.2 (Extrudate Melt Fracture / Sharkskin Onset)
**Question:** During high-rate capillary extrusion, wall shear stress exceeds $\\tau_w > 0.14\\text{ MPa}$. What visual defect appears on the extrudate?
**Answer & Rationale:** Exceeding critical shear stress ($\\tau_c \\approx 0.10 - 0.14\\text{ MPa}$) initiates surface melt fracture (sharkskin) due to intense tensile stress concentrations at the die exit exit-lip parting line, causing periodic acceleration and elastic recoil of the outer skin layer.`,

  ch5: `# Chapter 5: Rotational Rheometry, Oscillatory Shear & Viscoelastic Master Curves

## 1. Executive Overview & Physical Principles
Rotational rheometry operating in Small Amplitude Oscillatory Shear (SAOS) mode provides comprehensive characterization of polymer viscoelasticity without destroying molecular chain entanglements. A sinusoidal shear strain $\\gamma(t) = \\gamma_0 \\sin(\\omega t)$ is applied between parallel plates or cone-and-plate geometries, generating a sinusoidal shear stress response shifted by phase angle $\\delta$:

$$\\tau(t) = \\sigma_0 \\sin(\\omega t + \\delta) = \\sigma_0 \\cos\\delta \\sin(\\omega t) + \\sigma_0 \\sin\\delta \\cos(\\omega t)$$

Viscoelastic materials decompose into two dynamic orthogonal components:
* **Storage Modulus ($G'$):** Elastic energy stored reversibly per cycle ($G' = \\frac{\\sigma_0}{\\gamma_0} \\cos\\delta$).
* **Loss Modulus ($G''$):** Energy dissipated irreversibly as heat per cycle ($G'' = \\frac{\\sigma_0}{\\gamma_0} \\sin\\delta$).
* **Loss Factor ($\\tan\\delta = G'' / G'$):** Ratio of viscous dissipation to elastic storage.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Cox-Merz Empirical Rule
For unfilled homogeneous polymer melts, dynamic complex viscosity ($\\eta^*$) at angular frequency $\\omega$ equals steady-shear apparent viscosity ($\\eta$) at equivalent shear rate $\\dot{\\gamma} = \\omega$:

$$\\eta^*(\\omega) = \\frac{\\sqrt{(G')^2 + (G'')^2}}{\\omega} = \\left. \\eta(\\dot{\\gamma}) \\right|_{\\dot{\\gamma} = \\omega}$$

### B. Time-Temperature Superposition (TTS) & Williams-Landel-Ferry (WLF) Equation
Horizontal shift factor $a_T$ relates relaxation times at temperature $T$ to reference temperature $T_r$:

$$\\log a_T = \\frac{-C_1 (T - T_r)}{C_2 + (T - T_r)}$$

### C. Viscoelastic Moduli Parameter Matrix

| Polymer Microstructure | Crossover Frequency $\\omega_c$ ($G' = G''$) ($\\text{rad/s}$) | Crossover Modulus $G_c$ ($\\text{kPa}$) | Zero-Shear Viscosity $\\eta_0$ ($\\text{kPa}\\cdot\\text{s}$) | Terminal Slope $G'$ (Low $\\omega$) | Shop-Floor Processing Behavior |
|---|---|---|---|---|---|
| **Broad MWD Polypropylene** | $1.2$ | $15.4$ | $42.0$ | $G' \\propto \\omega^{1.2}$ | High shear thinning, low melt sag |
| **Narrow MWD Polypropylene** | $45.0$ | $38.2$ | $8.5$ | $G' \\propto \\omega^{1.9}$ | Low shear thinning, high melt sag |
| **Long-Chain Branched LDPE** | $0.15$ | $8.2$ | $120.0$ | $G' \\propto \\omega^{0.8}$ | Exceptional melt strength & film stability |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A polymer characterization specialist in Pune is testing a grade of injection-moulding Polypropylene at $T = 200^\\circ\\text{C}$ on a $25\\text{ mm}$ parallel plate rotational rheometer.
From a frequency sweep test ($0.01 - 100\\text{ rad/s}$):
* Crossover point ($G' = G''$): $\\omega_c = 10.0\\text{ rad/s}$ with modulus $G_c = 25.0\\text{ kPa} = 25,000\\text{ Pa}$.
* At low frequency $\\omega = 0.1\\text{ rad/s}$: Measured $G' = 250\\text{ Pa}$, $G'' = 2,500\\text{ Pa}$.

**Calculate:**
1. The characteristic Maxwell polymer relaxation time ($\\tau_r = 1 / \\omega_c$).
2. The loss factor ($\\tan\\delta$) at $\\omega = 0.1\\text{ rad/s}$ and at the crossover point.
3. Complex viscosity ($\\eta^*$) at $\\omega = 0.1\\text{ rad/s}$ using the Cox-Merz rule.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Characteristic Polymer Relaxation Time ($\\tau_r$)
$$\\tau_r = \\frac{1}{\\omega_c} = \\frac{1}{10.0\\text{ rad/s}} = \\mathbf{0.100\\text{ s}} \\quad (100\\text{ ms})$$

#### Step 2: Calculate Loss Factor ($\\tan\\delta$)
At $\\omega = 0.1\\text{ rad/s}$:
$$\\tan\\delta = \\frac{G''}{G'} = \\frac{2,500\\text{ Pa}}{250\\text{ Pa}} = \\mathbf{10.0} \\quad (\\text{Strongly viscous-dominated liquid behavior})$$

At Crossover Point $\\omega_c = 10.0\\text{ rad/s}$:
$$\\tan\\delta = \\frac{G_c}{G_c} = \\mathbf{1.00}$$

#### Step 3: Calculate Complex Viscosity ($\\eta^*$) at $\\omega = 0.1\\text{ rad/s}$
$$|G^*| = \\sqrt{(G')^2 + (G'')^2} = \\sqrt{(250)^2 + (2,500)^2} = \\sqrt{62,500 + 6,250,000} = \\sqrt{6,312,500} = 2,512.47\\text{ Pa}$$

$$\\eta^*(0.1) = \\frac{|G^*|}{\\omega} = \\frac{2,512.47\\text{ Pa}}{0.1\\text{ rad/s}} = \\mathbf{25,124.7\\text{ Pa}\\cdot\\text{s}} \\quad (25.12\\text{ kPa}\\cdot\\text{s})$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 5.1 (Molecular Weight Distribution & Crossover)
**Question:** How does broadening polymer Molecular Weight Distribution (MWD) shift the crossover frequency $\\omega_c$ and modulus $G_c$?
**Answer & Rationale:** Broadening MWD introduces high molecular weight chains with long relaxation times. This causes elastic storage modulus $G'$ to rise at lower frequencies, shifting crossover frequency $\\omega_c$ to **lower values** and lowering $G_c$.

### ❓ Exercise 5.2 (Failure of Cox-Merz Rule)
**Question:** Why does the Cox-Merz rule ($\\eta^*(\\omega) = \\eta(\\dot{\\gamma})$) fail for organoclay-filled nanocomposites or PVC gels?
**Answer & Rationale:** Filled nanocomposites form physical yield stress networks. Oscillatory shear at small strains ($\\gamma_0 < 1\\%$) measures the intact network, whereas steady shear breaks down the physical structural network, causing steady-shear viscosity to fall far below dynamic viscosity.`,

  ch6: `# Chapter 6: Extensional Rheometry, Melt Strength & Parison Sag Dynamics

## 1. Executive Overview & Physical Principles
In processing operations such as film blowing, blow moulding, thermoforming, and fiber spinning, polymer melts undergo **extensional (elongational) flow**, where fluid elements are stretched along streamlines without wall shear contact.

Uniaxial extensional viscosity ($\\eta_E$) is defined as the ratio of extensional tensile stress ($\\sigma_E$) to extensional strain rate ($\\dot{\\varepsilon}$):

$$\\eta_E(\\dot{\\varepsilon}, t) = \\frac{\\sigma_E(t)}{\\dot{\\varepsilon}}$$

For linear unbranched polymer chains (such as LLDPE, HDPE), extensional viscosity follows Trouton's Rule at low strain rates: $\\eta_E = 3 \\eta_0$. However, polymers containing **long-chain branching (LCB)** (such as LDPE or LCB-PP) exhibit **strain hardening**, where $\\eta_E$ shoots up exponentially at high Hencky strains ($\\varepsilon > 2$). Strain hardening provides self-healing melt strength, preventing local thinning or parison sag.

---

## 2. Key Industrial Parameters & Governing Equations

### A. Trouton Ratio ($Tr$)
$$Tr = \\frac{\\eta_E(\\dot{\\varepsilon})}{\\eta(\\dot{\\gamma})} \\quad \\left. \\text{evaluated at } \\dot{\\gamma} = \\sqrt{3} \\dot{\\varepsilon} \\right.$$

* $Tr = 3$: Newtonian & Linear Viscoelastic Limit (Trouton behavior).
* $Tr > 10$: Pronounced Strain Hardening (Long-Chain Branched Polymers).

### B. Parison Sag Governing Balance in Blow Moulding
Parison weight causes gravitational stretch downward during extrusion delay:

$$\\frac{d L_{\\text{parison}}}{dt} = \\frac{\\rho g L^2}{2 \\eta_{E,0}}$$

### C. Industrial Extensional Parameter Matrix

| Polymer Resin Architecture | Long-Chain Branching (LCB) | Strain Hardening Factor $\\chi_E = \\eta_E / (3\\eta_0)$ | Melt Strength Force $F_{\\text{melt}}$ ($\\text{cN}$) | Maximum Drawdown Speed $v_{\\text{break}}$ ($\\text{mm/s}$) | Target Processing Application |
|---|---|---|---|---|---|
| **Autoclave LDPE** | High | $5.5 - 8.0$ | $18.0 - 28.0$ | $250$ | Heavy-duty blown film, extrusion coating |
| **Linear HDPE** | Zero | $1.0 - 1.2$ | $3.5 - 6.0$ | $600$ | High-speed thin film, small bottles |
| **HMS-PP (LCB Modified)** | High | $4.0 - 6.5$ | $22.0 - 35.0$ | $300$ | Structural foam extrusion, thermoforming |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A blow moulding engineer in Sanand, Gujarat is extruding a $1.2\\text{ meter}$ long parison for a $200\\text{ Liter}$ industrial chemical drum using HDPE resin vs LCB-HDPE grade.
* Polymer melt density ($\\rho$): $760\\text{ kg/m}^3 = 7.6 \\times 10^{-4}\\text{ kg/cm}^3$
* Gravitational acceleration ($g$): $9.81\\text{ m/s}^2$
* Linear HDPE zero-shear extensional viscosity ($\\eta_{E,0}$): $1.2 \\times 10^5\\text{ Pa}\\cdot\\text{s}$
* LCB-HDPE zero-shear extensional viscosity ($\\eta_{E,0}$): $4.8 \\times 10^5\\text{ Pa}\\cdot\\text{s}$
* Extrusion time for $1.2\\text{ m}$ parison ($t_{\\text{ext}}$): $8.0\\text{ seconds}$

**Calculate:**
1. The parison gravitational sag rate ($dL/dt$) at $L = 1.2\\text{ m}$ for linear HDPE.
2. Total elongation extension due to sag over $8.0\\text{ seconds}$ for both resins.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Parison Sag Rate for Linear HDPE
$$\\frac{dL}{dt} = \\frac{\\rho g L^2}{2 \\eta_{E,0}} = \\frac{(760\\text{ kg/m}^3) \\times (9.81\\text{ m/s}^2) \\times (1.2\\text{ m})^2}{2 \\times (1.2 \\times 10^5\\text{ Pa}\\cdot\\text{s})}$$

$$\\frac{dL}{dt} = \\frac{7455.6 \\times 1.44}{240,000} = \\frac{10736.06}{240,000} = \\mathbf{0.04473\\text{ m/s}} \\quad (4.47\\text{ cm/s})$$

#### Step 2: Calculate Parison Extension over 8.0 Seconds
Linear HDPE Total Sag Extension:
$$\\Delta L_{\\text{linear}} = (0.04473\\text{ m/s}) \\times 8.0\\text{ s} = \\mathbf{0.3578\\text{ m}} \\quad (35.78\\text{ cm sag, } 29.8\\% \\text{ parison elongation})$$

LCB-HDPE Total Sag Extension (with $4\\times$ higher $\\eta_{E,0}$):
$$\\Delta L_{\\text{LCB}} = \\frac{0.3578\\text{ m}}{4} = \\mathbf{0.0895\\text{ m}} \\quad (8.95\\text{ cm sag, } 7.46\\% \\text{ parison elongation})$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 6.1 (Draw Resonance Instability in Blown Film)
**Question:** During high-speed film blowing of LLDPE, periodic oscillations in bubble diameter and film thickness occur. What causes this "draw resonance"?
**Answer & Rationale:** Linear LLDPE lacks strain hardening. At high drawdown ratios ($v_2 / v_1 > 30$), transient tensile stress fluctuations propagate uncontrollably, causing draw resonance. Blending **$10-15\\%$ LDPE** introduces long-chain branching, conferring strain hardening to stabilize the bubble.

### ❓ Exercise 6.2 (Rheotens Melt Strength Measurement)
**Question:** In a Rheotens extensional test, how do melt strength ($F_{\\max}$) and drawability ($v_{\\break}$) correlate with molecular weight and branching?
**Answer & Rationale:** Increasing molecular weight raises melt strength ($F_{\\max}$) but decreases drawability ($v_{\\break}$). Adding long-chain branching increases **both** melt strength and strain hardening without severe drop in drawdown speed.`,

  ch7: `# Chapter 7: Mold Flow Simulation Calibration & Cross-WLF Viscosity Model

## 1. Executive Overview & Physical Principles
Computer-Aided Engineering (CAE) mold filling software (Autodesk Moldflow, Moldex3D) relies on high-fidelity mathematical viscosity models to solve the Navier-Stokes momentum and thermal energy conservation equations inside complex 3D mold geometries.

The most widely accepted constitutive equation for polymer melt viscosity across wide temperature and pressure ranges is the **7-parameter Cross-WLF Model**:

$$\\eta(T, p, \\dot{\\gamma}) = \\frac{\\eta_0(T, p)}{1 + \\left( \\frac{\\eta_0 \\dot{\\gamma}}{\\tau^*} \\right)^{1-n}}$$

Where $\\eta_0(T, p)$ represents zero-shear viscosity, modeled via the Williams-Landel-Ferry (WLF) thermal shift equation:

$$\\eta_0(T, p) = D_1 \\exp \\left[ - \\frac{A_1 (T - T_k)}{A_2 + (T - T_k)} \\right] \\quad \\text{where } T_k = D_2 + D_3 p$$

---

## 2. Key Industrial Parameters & Governing Equations

### A. Cross-WLF Parameter Descriptions
1. $n$: Power-Law index at high shear rates ($0 < n < 1$).
2. $\\tau^*$: Critical shear stress level marking transition from Newtonian plateau to shear thinning ($\\text{Pa}$).
3. $D_1$: Reference zero-shear viscosity at reference temperature $D_2$ ($\\text{Pa}\\cdot\\text{s}$).
4. $D_2$: Glass transition temperature $T_g$ or reference glass temperature at zero gauge pressure ($\\text{K}$).
5. $D_3$: Pressure dependence coefficient of glass transition temperature ($\\text{K/Pa}$).
6. $A_1, A_2$: WLF thermal shift sensitivity coefficients.

### B. Industrial Cross-WLF Parameter Matrix

| Polymer Grade | $n$ | $\\tau^*$ ($\\text{Pa}$) | $D_1$ ($\\text{Pa}\\cdot\\text{s}$) | $D_2$ ($\\text{K}$) | $D_3$ ($\\text{K/MPa}$) | $A_1$ | $A_2$ ($\\text{K}$) |
|---|---|---|---|---|---|---|---|
| **PA66 (GF30)** | $0.28$ | $124,000$ | $3.5 \\times 10^{11}$ | $338.15$ | $0.00$ | $26.4$ | $51.6$ |
| **Polycarbonate (PC)** | $0.34$ | $185,000$ | $8.2 \\times 10^{12}$ | $418.15$ | $0.28$ | $31.2$ | $52.4$ |
| **ABS Resin** | $0.26$ | $68,000$ | $1.4 \\times 10^{13}$ | $378.15$ | $0.18$ | $28.5$ | $50.2$ |

---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
A CAE simulation engineer in Bengaluru is running a Moldflow analysis for a PA66 GF30 automotive junction box using Cross-WLF parameters:
* $n = 0.28$, $\\tau^* = 124,000\\text{ Pa}$, $D_1 = 3.5 \\times 10^{11}\\text{ Pa}\\cdot\\text{s}$, $D_2 = 338.15\\text{ K}$ ($65^\\circ\\text{C}$), $A_1 = 26.4$, $A_2 = 51.6\\text{ K}$, $D_3 = 0.00$.
* Processing melt temperature: $T = 290^\\circ\\text{C} = 563.15\\text{ K}$.
* Gate shear rate predicted by CAE: $\\dot{\\gamma} = 25,000\\text{ s}^{-1}$.

**Calculate:**
1. Zero-shear viscosity $\\eta_0$ at processing temperature $290^\\circ\\text{C}$.
2. Apparent viscosity $\\eta$ inside the gate orifice at $\\dot{\\gamma} = 25,000\\text{ s}^{-1}$.

### 💡 Step-by-Step Mathematical Solution

#### Step 1: Calculate Zero-Shear Viscosity $\\eta_0$ at $290^\\circ\\text{C}$ ($563.15\\text{ K}$)
$$T - T_k = 563.15 - 338.15 = 225.0\\text{ K}$$

$$\\text{WLF Exponent} = - \\frac{A_1 (T - T_k)}{A_2 + (T - T_k)} = - \\frac{26.4 \\times 225.0}{51.6 + 225.0} = - \\frac{5940.0}{276.6} = -21.475$$

$$\\eta_0(290^\\circ\\text{C}) = D_1 \\exp(-21.475) = (3.5 \\times 10^{11}) \\times (4.715 \\times 10^{-10}) = \\mathbf{165.02\\text{ Pa}\\cdot\\text{s}}$$

#### Step 2: Calculate Apparent Viscosity $\\eta$ at Gate Shear Rate $25,000\\text{ s}^{-1}$
$$\\text{Shear Ratio} = \\frac{\\eta_0 \\dot{\\gamma}}{\\tau^*} = \\frac{165.02 \\times 25,000}{124,000} = \\frac{4,125,500}{124,000} = 33.27$$

$$\\eta = \\frac{\\eta_0}{1 + (33.27)^{1 - 0.28}} = \\frac{165.02}{1 + (33.27)^{0.72}} = \\frac{165.02}{1 + 12.57} = \\frac{165.02}{13.57} = \\mathbf{12.16\\text{ Pa}\\cdot\\text{s}}$$

---

## 4. Practical Engineering Exercises & Troubleshooting

### ❓ Exercise 7.1 (Pressure Dependence $D_3$ Impact)
**Question:** Polycarbonate has $D_3 = 0.28\\text{ K/MPa}$. How does an injection packing pressure of $100\\text{ MPa}$ affect effective $T_g$ ($T_k$) and melt viscosity?
**Answer & Rationale:** $T_k(p) = D_2 + D_3 p = 418.15 + (0.28 \\times 100) = 446.15\\text{ K}$ ($173^\\circ\\text{C}$). High pressure elevates $T_g$ by **$28^\\circ\\text{C}$**, drastically increasing zero-shear viscosity in deep cavity ribs during the packing phase.

### ❓ Exercise 7.2 (Shear Thinning Index Sensitivity)
**Question:** Why does setting power-law index $n = 1.0$ in Cross-WLF cause CAE fill pressure predictions to explode by $400\\%$?
**Answer & Rationale:** Setting $n = 1.0$ turns the model Newtonian, disabling shear thinning. At gate shear rates ($25,000\\text{ s}^{-1}$), viscosity remains at $\\eta_0 = 165\\text{ Pa}\\cdot\\text{s}$ instead of dropping to $12.16\\text{ Pa}\\cdot\\text{s}$, producing catastrophic over-prediction of fill pressure.`
};

console.log('Rheology expanded chapters exported!');
