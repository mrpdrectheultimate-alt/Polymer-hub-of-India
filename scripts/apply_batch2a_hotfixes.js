const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SUBJECT_IDS = {
  "Polymer Testing": "256350b6-84d6-4ebe-b0ff-e951f00956db",
  "Rubber Technology": "b9399968-d0df-4953-9bec-1f07d61de8ab"
};

const dmaHotfixedContent = `# Dynamic Mechanical Analysis (DMA): Storage Modulus E', Loss Modulus E'' & Tan Delta

> **Subject**: Polymer Testing  
> **Target Level**: Advanced  
> **Prerequisites**: Rheological Testing: Understanding Melt Flow Behavior  

---

## 1. Why This Topic Matters
Dynamic Mechanical Analysis (DMA) is the most sensitive thermal-mechanical characterization technique for measuring the viscoelastic spectrum of polymers across a wide temperature range ($-150^\\circ\\text{C}$ to $+300^\\circ\\text{C}$). By applying a small sinusoidal mechanical strain and measuring the phase-shifted stress response, DMA quantifies elastic energy storage ($E'$), viscous dissipation ($E''$), damping factor ($\\tan\\delta$), secondary relaxations ($\\alpha, \\beta, \\gamma$), and dynamic glass transition temperatures ($T_g$).

---

## 2. Core Chemical & Engineering Principles

### 2.1 Complex Modulus & Viscoelastic Components
When a sinusoidal strain $\\varepsilon(t) = \\varepsilon_0 \\sin(\\omega t)$ is applied within the Linear Viscoelastic Region (LVR), the resulting stress $\\sigma(t)$ lags by phase angle $\\delta$:

$$\\sigma(t) = \\sigma_0 \\sin(\\omega t + \\delta)$$

The dynamic mechanical behavior is expressed via the Complex Modulus $E^*$:

$$E^* = E' + i E'', \\quad |E^*| = \\sqrt{(E')^2 + (E'')^2}$$

Where:
- **Storage Modulus ($E'$)**: In-phase elastic energy storage component ($E' = (\\sigma_0 / \\varepsilon_0) \\cos\\delta$).
- **Loss Modulus ($E''$)**: Out-of-phase viscous energy dissipation component ($E'' = (\\sigma_0 / \\varepsilon_0) \\sin\\delta$).
- **Loss Factor (Tan Delta, $\\tan\\delta$)**: Ratio of viscous dissipation to elastic storage:

$$\\tan\\delta = \\frac{E''}{E'}$$

### 2.2 Glass Transition Criterion & Method Sensitivity
*Analytical Guardrail*: DMA-derived glass-transition temperature is criterion- and frequency-dependent. The $\\tan\\delta$ peak often occurs above the DSC midpoint, while the $E'$ onset may occur lower or closer to it. Differences of several degrees to tens of degrees are possible depending on method and conditions.

Factors governing DMA-derived $T_g$ values include:
1. Criterion selected ($E'$ onset temperature, $E''$ loss modulus peak, or $\\tan\\delta$ peak).
2. Oscillation frequency ($\\omega$, e.g., $0.1\\text{ Hz}$ vs $10\\text{ Hz}$).
3. Heating rate ($^\circ\\text{C/min}$).
4. Applied deformation mode (bending, tension, shear, torsion).
5. Specimen geometry and clamping torque.
6. Processing thermal history and residual stresses.

---

## 3. Testing Operating Parameters

| Parameter | Dual Cantilever Bending | Single Cantilever / Tension | Value Status |
|---|---|---|---|
| Frequency Range | $1.0\\text{ Hz}$ (Standard) | $0.1 - 100\\text{ Hz}$ | illustrative_processing_range |
| Heating Rate | $2.0 - 3.0^\\circ\\text{C/min}$ | $2.0^\\circ\\text{C/min}$ | illustrative_processing_range |
| Applied Strain Amplitude | $0.01\\% - 0.1\\%$ (Inside LVR) | $0.05\\%$ | illustrative_processing_range |
| Temperature Range | $-150^\\circ\\text{C} - +250^\\circ\\text{C}$ | $-100^\\circ\\text{C} - +200^\\circ\\text{C}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: DMA Glass Transition (ASTM E1640)
1. **Specimen Preparation**: Rectangular bar $60 \\times 10 \\times 3.0\\text{ mm}$.
2. **Setup**: Mount in dual cantilever fixture, apply $1.0\\text{ Hz}$ frequency at $0.05\\%$ strain inside LVR.
3. **Temperature Sweep**: Heat at $2.0^\\circ\\text{C/min}$ from $-100^\\circ\\text{C}$ to $+150^\\circ\\text{C}$, record $E'$, $E''$, and $\\tan\\delta$ peak (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A DMA test on an Epoxy structural composite bar at $25^\\circ\\text{C}$ and $1.0\\text{ Hz}$ measures a storage modulus $E' = 2200.0\\text{ MPa}$ and a phase lag angle $\\delta = 4.68^\\circ$.
- $\\tan(4.68^\\circ) = 0.08185$
1. Calculate the Loss Modulus $E''$ in $\\text{MPa}$.
2. Calculate the magnitude of the Complex Modulus $|E^*|$ in $\\text{MPa}$.
3. Verify $\\tan\\delta = E'' / E'$.

### Step-by-Step Solution

**Step 1: Calculate Loss Modulus $E''$**
$$E'' = E' \\times \\tan\\delta = 2200.0 \\text{ MPa} \\times 0.08185 = 180.07 \\text{ MPa}$$

**Step 2: Calculate Complex Modulus $|E^*|$**
$$|E^*| = \\sqrt{(E')^2 + (E'')^2} = \\sqrt{(2200.0)^2 + (180.07)^2} = \\sqrt{4840000 + 32425.2} = 2207.36 \\text{ MPa}$$

**Step 3: Verify $\\tan\\delta$**
$$\\tan\\delta = \\frac{180.07}{2200.0} = 0.08185$$

*Reproduced Result*: Loss Modulus $E'' = 180.07\\text{ MPa}$, Complex Modulus $|E^*| = 2207.36\\text{ MPa}$, $\\tan\\delta = 0.08185$.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Clamp Polymer Bar in DMA Fixture"] --> B["Apply Sinusoidal Strain Amplitude inside LVR (0.05%)"]
    B --> C["Temperature Sweep Ramp (-100°C to +200°C at 2°C/min)"]
    C --> D["Measure Phase Lag Angle delta & Stress Response"]
    D --> E["Plot Storage Modulus E' & Loss Modulus E''"]
    E --> F["Identify Tan Delta Peak / E' Onset -> Dynamic Glass Transition Criteria"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **Which statement accurately describes DMA-derived glass transition temperatures relative to DSC?**
   - A) DMA $T_g$ is always identical to DSC $T_g$
   - B) DMA-derived $T_g$ is criterion- and frequency-dependent; $\\tan\\delta$ peak often occurs above DSC midpoint while $E'$ onset may occur lower or closer to it
   - C) DMA has no frequency sensitivity
   - D) DSC $T_g$ is always $50^\circ\text{C}$ higher than DMA
   - *Answer*: B. Method, criterion, and frequency dictate the observed $T_g$.

2. **Calculate Loss Modulus $E''$ if $E' = 3000\\text{ MPa}$ and $\\tan\\delta = 0.05$.**
   - A) $15\\text{ MPa}$
   - B) $150\\text{ MPa}$
   - C) $300\\text{ MPa}$
   - D) $600\\text{ MPa}$
   - *Answer*: B. $E'' = 3000 \\times 0.05 = 150\\text{ MPa}$.

3. **Which parameter represents in-phase elastic energy storage in DMA?**
   - A) Loss Modulus $E''$
   - B) Storage Modulus $E'$
   - C) Tan Delta $\\tan\\delta$
   - D) Mass loss
   - *Answer*: B. Storage modulus represents reversible elastic energy storage.

4. **What defines the Linear Viscoelastic Region (LVR) in DMA testing?**
   - A) Strain range where modulus is independent of strain amplitude
   - B) Plastic yielding point
   - C) Thermal decomposition temperature
   - D) Glass transition peak
   - *Answer*: A. Inside LVR, stress is directly proportional to strain.

5. **Calculate $|E^*|$ if $E' = 1200\\text{ MPa}$ and $E'' = 500\\text{ MPa}$.**
   - A) $700\\text{ MPa}$
   - B) $1300\\text{ MPa}$
   - C) $1700\\text{ MPa}$
   - D) $2500\\text{ MPa}$
   - *Answer*: B. $|E^*| = \\sqrt{1200^2 + 500^2} = 1300\\text{ MPa}$.
`;

const silaneHotfixedContent = `# Tyre Compound Design: Silica-Silane Reinforcement, Rolling Resistance & Wet Grip

> **Subject**: Rubber Technology  
> **Target Level**: Advanced  
> **Prerequisites**: Tyre Construction: From Components to Finished Product  

---

## 1. Why This Topic Matters
Modern "green tyre" treads utilize highly dispersible precipitated silica ($\text{SiO}_2$) in combination with bifunctional organosilane coupling agents (e.g. TESPT) to break the traditional Magic Triangle of tyre compounding. Replacing carbon black with silica-silane systems reduces rolling resistance by $20\% - 30\%$ (improving vehicle fuel economy) while simultaneously enhancing wet braking grip. Mastering silanization reaction chemistry, mixing temperature control, and Payne effect strain sweeps is essential for top-tier tyre design.

---

## 2. Core Chemical & Engineering Principles

### 2.1 Empirical TESPT Initial-Dose Estimation
Precipitated silica surfaces contain polar hydrophilic silanol groups ($\\text{Si-OH}$). Bifunctional organosilane (TESPT) couples silanols with non-polar rubber:

$$\\text{Silica-OH} + \\text{EtO-Si} \\xrightarrow{140^\\circ\\text{C}-155^\\circ\\text{C}} \\text{Silica-O-Si} + \\text{EtOH} \\uparrow$$

*Empirical Initial-Dose Formula (Verification Status: Verification Pending)*:
$$\\text{Estimated TESPT Initial Dose (phr)} = \\text{Silica Loading (phr)} \\times \\text{BET Surface Area (m}^2/\\text{g)} \\times 0.0005$$

Where:
- **Silica Loading**: Precipitated silica dosage ($\text{phr}$).
- **BET Surface Area**: Specific surface area of silica ($\text{m}^2/\text{g}$).
- **Empirical Coefficient**: $0.0005\\text{ phr}/(\\text{phr} \\cdot \\text{m}^2/\\text{g})$ (source-specific initial sizing estimate).

*Dosing Variables*: Final optimum silane dosage depends on silane purity, silanol hydroxyl density, target surface coverage, mixing shear efficiency, compound formulation, ethanol byproduct venting, cure system, and dynamic property targets.

### 2.2 Viscoelastic Laboratory Proxies & Tyre Performance Limits
- **Rolling Resistance Proxy**: Loss factor $\\tan\\delta$ near $60^\\circ\\text{C}$ ($10\\text{ Hz}$, $5\\%$ strain).
- **Wet Grip Proxy**: Loss factor $\\tan\\delta$ near $0^\\circ\\text{C}$ ($10\\text{ Hz}$, $0.2\\%$ strain).
- *Performance Guardrail*: Higher or lower $\\tan\\delta$ at selected laboratory temperatures may correlate with tyre behavior under specified test conditions, but does not independently predict complete wet grip, fuel efficiency or road performance.

---

## 3. Formulation & Processing Specifications

| Parameter | High-Performance Green Tyre Tread | Standard Carbon Black Tread | Value Status |
|---|---|---|---|
| s-SBR / BR Ratio | $75 / 25\\text{ phr}$ | $70 / 30\\text{ phr}$ | illustrative_processing_range |
| Silica (BET $175\\text{ m}^2/\\text{g}$) | $80.0\\text{ phr}$ | $0.0\\text{ phr}$ | illustrative_processing_range |
| TESPT Silane Coupling Agent | $6.8\\text{ phr}$ | $0.0\\text{ phr}$ | illustrative_processing_range |
| Silanization Dump Temperature | $145^\\circ\\text{C} - 155^\\circ\\text{C}$ | $155^\\circ\\text{C} - 165^\\circ\\text{C}$ | illustrative_processing_range |

---

## 4. Standard Operating Procedure: Rolling Resistance (AIS 142 / ISO 28580)
1. **Specimen Preparation**: Vulcanize tread slab ($160^\\circ\\text{C}$, $t_{90} + 2\\text{ min}$).
2. **DMA Strain Sweep**: Measure $\\tan\\delta$ at $0^\\circ\\text{C}$ and $60^\\circ\\text{C}$ at $10\\text{ Hz}$.
3. **Requirement**: $\\tan\\delta (60^\\circ\\text{C}) < 0.120$ for Class A laboratory proxy rating (verification_status: verification_pending).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
A green tyre tread formulation calls for $75.0\\text{ phr}$ highly dispersible precipitated silica.
- Silica BET specific surface area $= 175.0\\text{ m}^2/\\text{g}$.
- Empirical coefficient $= 0.0005\\text{ phr}/(\\text{phr} \\cdot \\text{m}^2/\\text{g})$.
1. Calculate the estimated initial TESPT silane dosage in $\\text{phr}$.
2. Calculate the actual mass of TESPT silane required for $100.0\\text{ kg}$ rubber batch.

### Step-by-Step Solution

**Step 1: Calculate Initial Silane Dose in phr**
$$\\text{Silane (phr)} = 75.0 \\times 175.0 \\times 0.0005 = 6.5625 \\text{ phr}$$

**Step 2: Calculate TESPT Mass for 100 kg Rubber Batch**
$$\\text{TESPT Mass (kg)} = 100.0 \\text{ kg} \\times \\frac{6.5625}{100.0} = 6.5625 \\text{ kg}$$

*Reproduced Result*: Estimated Initial TESPT Silane $= 6.5625\\text{ phr} \\implies 6.5625\\text{ kg}$ per $100\\text{ kg}$ polymer.

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Charge s-SBR/BR + Precipitated Silica (75 phr) + TESPT Silane (6.56 phr)"] --> B["Banbury Internal Mixer Silanization Pass (145-155°C)"]
    B --> C["Ethanol Byproduct Evaporation & Surface Silanization"]
    C --> D["Dump Masterbatch -> Cool below 100°C"]
    D --> E["Add Sulfur & Accelerators on 2-Roll Mill"]
    E --> F["Tread Extrusion & Tyre Curing -> Low Tan Delta Proxy at 60°C"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the nature of the silane dosage formula $\\text{Silica} \\times \\text{BET} \\times 0.0005$?**
   - A) Fundamental universal physical law
   - B) Empirical initial-dose sizing estimate requiring formulation optimization
   - C) Thermodynamic equation of state
   - D) Chemical equilibrium constant
   - *Answer*: B. It is an empirical initial-dose estimate based on surface area.

2. **Calculate initial TESPT estimate for $80\\text{ phr}$ silica with BET area $160\\text{ m}^2/\\text{g}$.**
   - A) $4.0\\text{ phr}$
   - B) $6.4\\text{ phr}$
   - C) $8.0\\text{ phr}$
   - D) $12.8\\text{ phr}$
   - *Answer*: B. $\\text{Silane} = 80 \\times 160 \\times 0.0005 = 6.4\\text{ phr}$.

3. **Do laboratory $\\tan\\delta$ measurements at $0^\circ\text{C}$ and $60^\circ\text{C}$ independently predict complete real-world tyre performance?**
   - A) Yes, with 100% mathematical certainty
   - B) No, they are laboratory proxies that correlate under specified test conditions but do not independently predict complete road performance
   - C) They predict vehicle engine horsepower only
   - D) Zero correlation exists
   - *Answer*: B. Laboratory $\\tan\\delta$ values serve as correlation proxies, not direct vehicle performance measurements.

4. **Why must Banbury silanization mixing temperature be strictly controlled between $140^\\circ\\text{C}$ and $155^\\circ\\text{C}$?**
   - A) Below $140^\circ\text{C}$ silanization is incomplete; above $160^\circ\text{C}$ tetrasulfide sulfur cleaves causing premature scorch
   - B) Rubber evaporates above $140^\circ\text{C}$
   - C) Silica turns into liquid water
   - D) To freeze the mixer rotors
   - *Answer*: A. $140^\circ\text{C}-155^\circ\text{C}$ ensures reaction and ethanol removal without premature scorch.

5. **What is the primary volatile byproduct released during silanization?**
   - A) Water vapor
   - B) Ethanol ($\\text{EtOH}$)
   - C) Carbon dioxide
   - D) Methane
   - *Answer*: B. Ethoxy groups on silane react with silanols releasing ethanol gas.
`;

async function applyHotfixes() {
  console.log('=== APPLYING BATCH 2A TECHNICAL HOTFIXES ===');

  const { error: err1 } = await supabase.from('lessons').update({
    content: dmaHotfixedContent
  }).eq('slug', 'dma-dynamic-mechanical-analysis-modulus-and-tan-delta');

  if (err1) console.error('Error updating DMA lesson:', err1);
  else console.log('Successfully applied Hotfix 1 to dma-dynamic-mechanical-analysis-modulus-and-tan-delta');

  const { error: err2 } = await supabase.from('lessons').update({
    content: silaneHotfixedContent
  }).eq('slug', 'tyre-compound-design-silica-silane-reinforcement-and-rolling-resistance');

  if (err2) console.error('Error updating Silane lesson:', err2);
  else console.log('Successfully applied Hotfix 2 to tyre-compound-design-silica-silane-reinforcement-and-rolling-resistance');
}

applyHotfixes();
