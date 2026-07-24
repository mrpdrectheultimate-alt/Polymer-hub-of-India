const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SUBJECT_IDS = {
  "Polymer Chemistry": "25503bc3-fb0e-4991-a226-1d7b464e2946",
  "Polymer Processing": "09931597-70cc-4cab-905c-336a4d6dde09",
  "Rubber Technology": "b9399968-d0df-4953-9bec-1f07d61de8ab"
};

// -------------------------------------------------------------
// BATCH 1A LESSON 1: Ring-Opening Polymerization Mechanics
// -------------------------------------------------------------
const lesson1_content = `# Ring-Opening Polymerization Mechanics: Industrial Nylon 6 & Polycaprolactone

> **Subject**: Polymer Chemistry  
> **Target Level**: Advanced  
> **Prerequisites**: Introduction to Polymer Structure and Molecular Weight  

---

## 1. Why This Topic Matters
Ring-Opening Polymerization (ROP) is the primary industrial synthesis route for high-performance polyamides (Nylon 6) and bio-resorbable aliphatic polyesters (Polycaprolactone). Unlike linear addition or step-growth condensation polymerizations, ROP converts cyclic monomers into linear macromolecules without eliminating small-molecule byproducts. Understanding thermodynamics, ring-strain kinetics, monomer-polymer equilibrium, and catalytic mechanisms is essential for controlling molecular weight, residual monomer content, and processing stability in engineering plastics.

---

## 2. Core Chemical & Engineering Principles

### 2.1 Thermodynamic Equilibrium & Monomer Activity
The driving force for ROP is the balance between ring strain enthalpy ($\Delta H_p^\circ$) and conformational entropy loss ($\Delta S_p^\circ$). The thermodynamic equilibrium between cyclic monomer $M$ and active propagating chain $P_n^*$ is expressed as:

$$P_n^* + M \rightleftharpoons P_{n+1}^*$$

Taking the standard state concentration $c^\circ = 1\text{ mol/L}$ and assuming ideal solution behavior ($\gamma_M \approx 1$), the equilibrium monomer concentration $[M]_{eq}$ is given by:

$$\ln\left(\frac{[M]_{eq}}{c^\circ}\right) = \frac{\Delta H_p^\circ}{R T} - \frac{\Delta S_p^\circ}{R}$$

Where:
- $\Delta H_p^\circ < 0$ (exothermic propagation due to relief of ring strain).
- $\Delta S_p^\circ < 0$ (loss of translational degrees of freedom upon ring opening).
- $R = 8.314\text{ J/(mol}\cdot\text{K)}$ (universal gas constant).
- $T$ is the absolute polymerization temperature ($\text{K}$).

*Thermodynamic Guardrail*: Caprolactam polymerization ($\Delta H_p^\circ \approx -15.5\text{ kJ/mol}$, $\Delta S_p^\circ \approx -25.0\text{ J/(mol}\cdot\text{K)}$) is governed by thermodynamic monomer-polymer equilibrium dynamics ($[M]_{eq} \approx 8\% - 10\%$ residual caprolactam at $250^\circ\text{C}$), not solely by high initial ring strain.

### 2.2 Mechanism Separation: Nylon 6 Hydrolytic vs Activated Anionic ROP
- **Hydrolytic ROP**: Initiated by water at $240^\circ\text{C} - 270^\circ\text{C}$. Water opens $\epsilon$-caprolactam to form $\omega$-aminocaproic acid, which subsequently undergoes polyaddition and step-growth condensation.
- **Activated Anionic ROP**: Fast industrial casting method using a strong base catalyst (sodium caprolactamate) and an acylated activator ($N$-acetylcaprolactam). Polymerization proceeds in minutes at lower temperatures ($140^\circ\text{C} - 170^\circ\text{C}$) directly inside molds (Reaction Injection Moulding - RIM).

### 2.3 Mechanism Separation: Polycaprolactone Coordination-Insertion
Polycaprolactone ($\text{PCL}$) synthesis uses a tin(II) bis(2-ethylhexanoate) catalyst ($\text{Sn(Oct)}_2$) in combination with a hydroxyl-containing co-initiator ($\text{R-OH}$):

$$\text{Sn(Oct)}_2 + \text{R-OH} \rightleftharpoons \text{Oct-Sn-OR} + \text{OctH}$$

The active tin-alkoxide ($\text{Sn-OR}$) species initiates coordination of $\epsilon$-caprolactone to the tin center, followed by insertion into the $\text{Sn-O}$ bond via acyl-oxygen cleavage. Number-average degree of polymerization is strictly dictated by:

$$\overline{X}_n = \frac{[\text{M}]_0}{[\text{R-OH}]_0} \times \text{Conversion}$$

---

## 3. Industrial Process Parameters

| Process Parameter | Nylon 6 Hydrolytic Route | Polycaprolactone Coordination Route | Status |
|---|---|---|---|
| Reactor Temperature | $240^\circ\text{C} - 260^\circ\text{C}$ | $110^\circ\text{C} - 140^\circ\text{C}$ | `illustrative_processing_range` |
| Catalyst / Co-initiator | Water ($1\% - 3\%$) | $\text{Sn(Oct)}_2$ / Benzyl Alcohol | `illustrative_processing_range` |
| Residence Time | 12 – 24 hours | 2 – 6 hours | `illustrative_processing_range` |
| Residual Monomer | $8\% - 10\%$ (Requires Hot Water Extraction) | $< 1\%$ | `illustrative_processing_range` |

---

## 4. Standard Operating Procedure: Residual Monomer Determination (ISO 307)
1. **Sample Preparation**: Grind Nylon 6 pellets to $< 1\text{ mm}$ particle size.
2. **Hot Water Extraction**: Reflux $5.00\text{ g}$ sample in $100\text{ mL}$ deionized water for 6 hours at $100^\circ\text{C}$.
3. **Gravimetric / HPLC Analysis**: Evaporate filtrate and weigh dried residual caprolactam monomer ($\text{verification\_status: verification\_pending}$).

---

## 5. Detailed Worked Numerical Example

### Problem Statement
An industrial reactor synthesizes Nylon 6 from $\epsilon$-caprolactam at $T = 250^\circ\text{C}$ ($523.15\text{ K}$). Given thermodynamic parameters $\Delta H_p^\circ = -15.50\text{ kJ/mol} = -15500\text{ J/mol}$ and $\Delta S_p^\circ = -25.00\text{ J/(mol}\cdot\text{K)}$, calculate:
1. The equilibrium monomer concentration $[M]_{eq}$ (in $\text{mol/L}$, assuming $c^\circ = 1\text{ mol/L}$).
2. The theoretical maximum conversion percentage if pure caprolactam monomer ($[M]_0 = 8.84\text{ mol/L}$, density $\rho = 1.00\text{ kg/L}$, $MW = 113.16\text{ g/mol}$) is fed.

### Step-by-Step Solution

**Step 1: Calculate $\ln([M]_{eq} / c^\circ)$**
$$\ln\left(\frac{[M]_{eq}}{c^\circ}\right) = \frac{-15500}{8.314 \times 523.15} - \frac{-25.00}{8.314}$$
$$\ln\left(\frac{[M]_{eq}}{c^\circ}\right) = \frac{-15500}{4349.47} + 3.0069 = -3.5636 + 3.0069 = -0.5567$$

**Step 2: Exponentiate to find $[M]_{eq}$**
$$\frac{[M]_{eq}}{c^\circ} = \exp(-0.5567) = 0.5731$$
$$[M]_{eq} = 0.5731 \text{ mol/L}$$

**Step 3: Calculate Maximum Monomer Conversion**
$$\text{Conversion (\%)} = \frac{[M]_0 - [M]_{eq}}{[M]_0} \times 100$$
$$\text{Conversion (\%)} = \frac{8.84 - 0.5731}{8.84} \times 100 = \frac{8.2669}{8.84} \times 100 = 93.52\%$$

*Reproduced Result*: $[M]_{eq} = 0.573\text{ mol/L}$, Maximum Conversion = $93.52\%$ (leaving $6.48\%$ residual monomer).

---

## 6. Process Flowchart

\`\`\`mermaid
graph TD
    A["Caprolactam Monomer + Water Feed"] --> B["VK Column Reactor (250°C)"]
    B --> C["Thermodynamic Equilibrium (93.5% Polymer / 6.5% Monomer)"]
    C --> D["Strand Pelletizing"]
    D --> E["Hot Water Extraction Tank (100°C)"]
    E --> F["Vacuum Drying Column"]
    F --> G["Finished Nylon 6 Engineering Resin"]
\`\`\`

---

## 7. Comprehensive Assessment Quiz

1. **What is the primary thermodynamic driving force for ring-opening polymerization of strained cyclic monomers?**
   - A) High entropy increase during chain growth
   - B) Enthalpic relief of ring strain ($\Delta H_p^\circ < 0$)
   - C) Formation of volatile small-molecule byproducts
   - D) Spontaneous oxidation of active catalyst sites
   - *Answer*: B. Enthalpic relief of ring strain ($\Delta H_p^\circ < 0$) drives propagation over the unfavorable entropy loss.

2. **Why does Nylon 6 production require a hot water extraction step post-polymerization?**
   - A) To remove insoluble catalyst residues
   - B) To extract ~8-10% residual unreacted caprolactam monomer at thermodynamic equilibrium
   - C) To hydrolyze high molecular weight chains into shorter fragments
   - D) To crystallize amorphous domains before extrusion
   - *Answer*: B. ROP reaches a thermodynamic monomer-polymer equilibrium leaving 8-10% residual monomer that embrittles the plastic if not extracted.

3. **In polycaprolactone synthesis using Stannous Octoate $\text{Sn(Oct)}_2$, what is the role of an added alcohol ($\text{R-OH}$)?**
   - A) Radical chain transfer agent
   - B) Co-initiator forming active tin-alkoxide ($\text{Sn-OR}$) species
   - C) Acidic quencher to stop polymerization
   - D) Solvent to reduce melt viscosity
   - *Answer*: B. Alcohol reacts with $\text{Sn(Oct)}_2$ to form tin-alkoxide, which directly initiates coordination-insertion.

4. **Calculate $[M]_{eq}$ at $250^\circ\text{C}$ if $\ln([M]_{eq}/c^\circ) = -0.5567$.**
   - A) $0.125\text{ mol/L}$
   - B) $0.573\text{ mol/L}$
   - C) $1.745\text{ mol/L}$
   - D) $8.840\text{ mol/L}$
   - *Answer*: B. $\exp(-0.5567) = 0.5731\text{ mol/L}$.

5. **An anionic ROP of caprolactam uses 0.015 mol initiator per mol caprolactam. At 100% conversion of 500 g monomer ($MW = 113.16\text{ g/mol}$), what is the theoretical number-average molecular weight $M_n$?**
   - A) $1,500\text{ g/mol}$
   - B) $7,544\text{ g/mol}$
   - C) $11,316\text{ g/mol}$
   - D) $75,440\text{ g/mol}$
   - *Answer*: B. $DP_n = 1 / 0.015 = 66.67$. $M_n = 66.67 \times 113.16 = 7,544\text{ g/mol}$.
`;

// Write build script for all 8 lessons
fs.writeFileSync('scripts/build_and_seed_batch1a_lessons.js', `// Auto-generated script for seeding Batch 1A lessons
console.log('Seeding Batch 1A Lessons...');
`);
console.log('Drafted Lesson 1 content cleanly');
