// scripts/build_full_library_data.mjs
import fs from 'fs'

const ch = (title, summary, sec1, sec2, formula, table, example, exercise) => {
  return `# ${title}

## 1. Executive Summary & Physical Principles
${summary}

${sec1}

---

## 2. Fundamental Governing Equations & Parameter Matrix
${sec2}

${formula ? `$$\n${formula}\n$$\n` : ''}

${table || ''}

---

## 3. Worked Industrial Numerical Example

${example}

---

## 4. Practical Engineering Exercises & Case Studies

${exercise}
`
}

// Generate full library_data.ts
const RHEOLOGY = {
  ch1: ch(
    "Chapter 1: Why Rheology Matters to Every Polymer Engineer",
    "Rheology is the fundamental study of the deformation and flow of complex fluids under shear and extensional stress fields. For polymer processing engineers, mould designers, and plant managers, melt rheology is the single critical discipline governing cavity fill pressure, shear dissipation heating, extrudate die swell, and cycle time optimization.",
    "Unlike low-molecular-weight Newtonian liquids (such as water or organic solvents), molten polymers consist of long entangling macromolecular chains. Their flow response is intrinsically non-linear and viscoelastic:\n* **Viscous Response:** Irreversible viscous dissipation of thermal energy during shear flow.\n* **Elastic Response:** Reversible storage of elastic strain energy within stretched molecular coils.",
    "Melt viscosity (\\\\eta) dictates hydraulic pump pressure required to drive molten resin through screws, manifold channels, hot runners, and complex mould cavities. High shear in gate orifices generates localized thermal energy (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}), risking degradation in sensitive resins like PVC, POM, and PEEK.",
    "B = \\\\frac{D_e}{D_0} = 1 + \\\\left( \\\\frac{\\\\tau_w}{G} \\\\right)^2",
    "| Process | Shear Rate (s^-1) | Property | Shop-Floor Impact |\n|---|---|---|---|\n| Compression | 1 - 10 | Zero-shear viscosity | Sag resistance |\n| Extrusion | 100 - 1,000 | Power-law index | Die swell |\n| Injection | 1,000 - 100,000 | Apparent viscosity | Fill pressure |\n| Blow Moulding | 10 - 100 | Melt strength | Parison sag |",
    "### 📐 Problem Statement\nAn extrusion engineer in Daman is processing an HDPE pipe die ($D_0 = 50.0\\text{ mm}$, $Q = 120\\text{ cm}^3/\\text{s}$). Measured extrudate diameter $D_e = 57.5\\text{ mm}$.\n\n### 💡 Step-by-Step Solution\n1. Die Swell Ratio $B = 57.5 / 50.0 = \\mathbf{1.15} \\quad (15\\% \\text{ swell})$.\n2. Apparent Shear Rate $\\dot{\\gamma}_{\\text{app}} = \\frac{4 Q}{\\pi R^3} = \\frac{4 \\times 120}{\\pi \\times (2.5)^3} = \\mathbf{9.78\\text{ s}^{-1}}$.",
    "### ❓ Exercise 1.1\n**Question:** Why does increasing injection speed sometimes *decrease* fill pressure?\n**Answer & Rationale:** Polymers are shear thinning ($n < 1$). Higher shear rate (\\\\dot{\\\\gamma}) drops apparent viscosity (\\\\eta \\\\propto \\\\dot{\\\\gamma}^{n-1}), while shear heating (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}) further lowers viscosity."
  ),
  ch2: ch(
    "Chapter 2: Newtonian vs. Non-Newtonian Flow Kinetics",
    "In a Newtonian liquid, shear stress (\\\\tau) varies linearly with shear rate (\\\\dot{\\gamma}): \\\\tau = \\\\eta \\\\cdot \\\\dot{\\\\gamma}. Polymer melts are non-Newtonian pseudoplastic fluids whose apparent viscosity decreases dramatically under shear.",
    "At rest (\\\\dot{\\\\gamma} \\\\to 0), macromolecular chains form an entangled coil network resisting motion with zero-shear viscosity \\\\eta_0. Under high shear, entanglements slip and uncoil, aligning parallel to streamlines and dropping viscosity by up to 3 orders of magnitude.",
    "Ostwald-de Waele Power Law Kinetics:",
    "\\\\tau = K \\\\cdot \\\\dot{\\\\gamma}^n \\\\implies \\\\eta(\\\\dot{\\\\gamma}) = K \\\\cdot \\\\dot{\\\\gamma}^{n-1}",
    "| Resin | \\\\eta_0 (Pa*s) | Flow Index n | Shear Rate (s^-1) | \\\\eta (Pa*s) |\n|---|---|---|---|---|\n| PP Homopolymer | 1,200 | 0.32 | 5,000 | 45 |\n| HDPE Film | 8,500 | 0.38 | 1,200 | 120 |\n| PC Moulding | 2,400 | 0.68 | 8,000 | 180 |\n| PA66 Unfilled | 350 | 0.82 | 10,000 | 28 |",
    "### 📐 Problem Statement\nCapillary rheometer test at $210^\\circ\\text{C}$:\n* $\\dot{\\gamma}_1 = 100\\text{ s}^{-1} \\implies \\tau_1 = 45,000\\text{ Pa} \\implies \\eta_1 = 450\\text{ Pa}\\cdot\\text{s}$.\n* $\\dot{\\gamma}_2 = 1,000\\text{ s}^{-1} \\implies \\tau_2 = 120,000\\text{ Pa} \\implies \\eta_2 = 120\\text{ Pa}\\cdot\\text{s}$.\n\n### 💡 Step-by-Step Solution\nFlow behavior index $n = \\frac{\\ln(120,000 / 45,000)}{\\ln(1,000 / 100)} = \\frac{0.9808}{2.3026} = \\mathbf{0.426}$.",
    "### ❓ Exercise 2.1\n**Question:** Why is single MFI insufficient for high-speed injection moulding?\n**Answer & Rationale:** MFI measures single-point flow at low shear ($\\dot{\\gamma} \\approx 10\\text{ s}^{-1}$). Injection gates exceed $10,000\\text{ s}^{-1}$. Resins with equal MFI can have different power-law indices $n$, diverging at processing shear rates."
  ),
  ch3: ch(
    "Chapter 3: Mathematical Constitutive Models (Power Law & Carreau-Yasuda)",
    "To simulate polymer processing inside CAE tools (Moldflow, Moldex3D), constitutive viscosity models must accurately represent low-shear zero-viscosity plateaus and high-shear pseudoplastic regions.",
    "The Carreau-Yasuda 5-parameter model accounts for zero-shear viscosity (\\\\eta_0), infinite-shear limit (\\\\eta_\\\\infty), transition relaxation time (\\\\lambda), and high-shear slope (n).",
    "\\\\eta(\\\\dot{\\\\gamma}) = \\\\eta_\\\\infty + (\\\\eta_0 - \\\\eta_\\\\infty) \\\\left[ 1 + (\\\\lambda \\\\dot{\\\\gamma})^a \\\\right]^{\\\\frac{n-1}{a}}",
    "| Model Parameter | Physical Significance | Typical Range (PP/HDPE) |\n|---|---|---|\n| \\\\eta_0 | Zero-shear plateau viscosity | 500 - 15,000 Pa*s |\n| \\\\lambda | Relaxation spectrum time | 0.01 - 0.50 s |\n| n | High-shear power law index | 0.25 - 0.45 |\n| a | Transition curvature parameter | 1.5 - 2.0 |",
    "### 📐 Problem Statement\nCarreau model parameters for PC ($\\eta_0 = 3000\\text{ Pa}\\cdot\\text{s}$, $\\lambda = 0.05\\text{ s}$, $n = 0.40$, $a = 2.0$).\nCalculate apparent viscosity at gate shear rate $\\dot{\\gamma} = 2,000\\text{ s}^{-1}$.\n\n### 💡 Step-by-Step Solution\n$$\\lambda \\dot{\\gamma} = 0.05 \\times 2000 = 100$$\n$$\\eta = 3000 \\times (1 + 100^2)^{-0.30} = 3000 \\times (10001)^{-0.30} = \\mathbf{189.3\\text{ Pa}\\cdot\\text{s}}$$",
    "### ❓ Exercise 3.1\n**Question:** Why does the Power Law model fail near zero shear rate?\n**Answer & Rationale:** As $\\dot{\\gamma} \\to 0$, Power Law $\\eta = K \\dot{\\gamma}^{n-1}$ predicts infinite viscosity for $n < 1$. Polymer melts exhibit a finite zero-shear plateau ($\\eta_0$). Carreau-Yasuda bounds low-shear viscosity correctly."
  ),
  ch4: ch(
    "Chapter 4: Capillary Rheometry & Bagley / Rabinowitsch Corrections",
    "Capillary rheometry measures melt viscosity at high shear rates ($100 - 10,000\\text{ s}^{-1}$) typical of extrusion dies and injection runner channels. Polymer melt is forced through a tungsten carbide capillary die of radius $R$ and length $L$.",
    "Entrance extensional convergence creates extra pressure loss (\\\\Delta P_e). Non-Newtonian shear profiles alter velocity gradients near die walls.",
    "\\\\tau_w = \\\\frac{\\\\Delta P - \\\\Delta P_e}{2 (L/R)} \\\\quad , \\\\quad \\\\dot{\\\\gamma}_w = \\\\dot{\\\\gamma}_{\\\\text{app}} \\\\left[ \\\\frac{3n + 1}{4n} \\\\right]",
    "| Parameter | Uncorrected Value | Corrected Value | Correction Method |\n|---|---|---|---|\n| Wall Shear Stress | 0.210 MPa | 0.180 MPa | Bagley Linear Extrapolation |\n| Wall Shear Rate | 1,200 s^-1 | 1,757 s^-1 | Weissenberg-Rabinowitsch |",
    "### 📐 Problem Statement\nRheometer dies ($L/R = 10, 20, 30$, $n = 0.38$) at $\\dot{\\gamma}_{\\text{app}} = 1000\\text{ s}^{-1}$ produce $\\Delta P_{10} = 4.2\\text{ MPa}$, $\\Delta P_{20} = 7.8\\text{ MPa}$, $\\Delta P_{30} = 11.4\\text{ MPa}$.\n\n### 💡 Step-by-Step Solution\n1. Bagley intercept $\\Delta P_e = 4.2 - (10 \\times 0.36) = \\mathbf{0.60\\text{ MPa}}$.\n2. True Wall Stress $\\tau_w = \\frac{11.4 - 0.60}{60} = \\mathbf{0.180\\text{ MPa}}$.\n3. True Wall Shear Rate $\\dot{\\gamma}_w = 1000 \\times \\left[\\frac{3(0.38)+1}{4(0.38)}\\right] = \\mathbf{1,407.9\\text{ s}^{-1}}$.",
    "### ❓ Exercise 4.1\n**Question:** How does Bagley plot yield extensional viscosity?\n**Answer & Rationale:** Entrance pressure loss ($\\Delta P_e$) measures extensional energy dissipated in converging flow, yielding extensional viscosity $\\eta_e = \\Delta P_e / \\dot{\\epsilon}$."
  ),
  ch5: ch(
    "Chapter 5: Extrudate Die Swell & Flow Instabilities",
    "Die swell ($B = D_e / D_0$) arises from recovery of elastic shear strain accumulated during capillary entry. At high wall shear stress (\\\\tau_w), flow instabilities manifest as surface sharkskin tearing or gross melt fracture.",
    "Sharkskin surface tearing occurs when wall shear stress \\\\tau_w > 0.14\\\\text{ MPa}. Gross melt fracture occurs when \\\\tau_w > 0.40\\\\text{ MPa}.",
    "B = \\\\frac{D_e}{D_0} = 1 + \\\\left( \\\\frac{\\\\tau_w}{G} \\\\right)^2",
    "| Instability Type | Threshold Stress | Visual Appearance | Shop-Floor Remedy |\n|---|---|---|---|\n| Sharkskin | > 0.14 MPa | Matte surface ridges | Add 500 ppm PPA |\n| Stick-Slip | > 0.30 MPa | Periodic rough bands | Raise die wall temp |\n| Gross Fracture | > 0.40 MPa | Helical melt distortion | Increase die gap size |",
    "### 📐 Problem Statement\nAn LLDPE film line operating at $\\tau_w = 0.19\\text{ MPa}$ exhibits severe surface haze.\nDosing $500\\text{ ppm}$ fluoropolymer PPA coats the die wall, inducing wall slip and lowering shear stress to $\\tau_w = 0.11\\text{ MPa}$.\n\n### 💡 Step-by-Step Solution\nSince $0.11\\text{ MPa} < 0.14\\text{ MPa}$ critical threshold, sharkskin surface tearing is completely eliminated and film transparency is restored.",
    "### ❓ Exercise 5.1\n**Question:** How do fluoropolymer PPAs eliminate sharkskin?\n**Answer & Rationale:** Fluoropolymer PPAs coat tungsten carbide die walls with a low-surface-energy layer, promoting wall slip, reducing wall shear stress below critical threshold ($0.14\\text{ MPa}$)."
  ),
  ch6: ch(
    "Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli",
    "Rotational rheometers measure linear viscoelastic properties under small amplitude oscillatory shear (SAOS) using parallel plate geometry.",
    "Storage Modulus (G') measures stored elastic energy. Loss Modulus (G'') measures dissipated viscous heat. Damping factor \\\\tan \\\\delta = G'' / G'.",
    "G^*(\\\\omega) = G'(\\omega) + i G''(\\omega) \\\\quad , \\\\quad \\\\tan \\\\delta = \\\\frac{G''}{G'}",
    "| Viscoelastic Parameter | Symbol | Physical Meaning | Processing Relevance |\n|---|---|---|---|\n| Storage Modulus | G' | Elastic energy storage | Melt elasticity, sag |\n| Loss Modulus | G'' | Viscous energy loss | Dissipation heating |\n| Damping Factor | tan delta | Viscous to elastic ratio | Bubble stability |\n| Crossover Frequency | omega_c | Relaxation time inverse | MWD fingerprint |",
    "### 📐 Problem Statement\nSAOS frequency sweep test on PP homopolymer at $200^\\circ\\text{C}$:\nCrossover frequency where $G' = G'' = 12,000\\text{ Pa}$ occurs at $\\omega_c = 25.0\\text{ rad/s}$.\n\n### 💡 Step-by-Step Solution\nCharacteristic relaxation spectrum time $\\lambda = 1 / \\omega_c = 1 / 25.0 = \\mathbf{0.040\\text{ seconds}}$.",
    "### ❓ Exercise 6.1\n**Question:** How does Molecular Weight Distribution (MWD) affect crossover frequency?\n**Answer & Rationale:** Broad MWD resins contain high MW chains that relax slowly, shifting crossover frequency ($\\omega_c$) lower. Narrow MWD resins display sharp transitions at higher frequencies."
  ),
  ch7: ch(
    "Chapter 7: Industrial Shop-Floor Rheology Implementation",
    "Applying shear-thinning indices to balance multi-cavity hot runners and optimize blown film extrusion processing.",
    "Rheological optimization ensures equal shear-rate distribution across multi-cavity manifolds, eliminating weight variance and flash.",
    "\\\\Delta P_{\\\\text{runner}} = 2 K \\\\left(\\\\frac{1+3n}{4n}\\\\right)^n \\\\left(\\\\frac{4 Q}{\\\\pi R^3}\\\\right)^n \\\\frac{L}{R}",
    "| Application | Target Rheological Property | Optimal Parameter Range |\n|---|---|---|\n| Hot Runner Balance | High shear thinning | n < 0.35 |\n| Blown Film | High zero-shear viscosity | eta_0 > 10,000 Pa*s |\n| Thin-Wall Injection | Low high-shear viscosity | eta (10^4 s^-1) < 30 Pa*s |",
    "### 📐 Problem Statement\nAn 8-cavity hot runner mould exhibits a $6\\%$ weight variance between inner and outer cavities.\nApplying shear-rate equalized runner branching balances shear-thinning viscosity ($\\eta \\propto \\dot{\\gamma}^{n-1}$).\n\n### 💡 Step-by-Step Solution\nRe-balancing branch diameters using $R_2 = R_1 (Q_2/Q_1)^{n/(3n+1)}$ equalizes pressure drop across all 8 cavities, reducing part weight variance to $< 0.4\\%$.",
    "### ❓ Exercise 7.1\n**Question:** Why does shear-induced melt imbalance occur in geometrically balanced runners?\n**Answer & Rationale:** As melt flows through cold runners, high shear near walls heats outer melt layers, creating non-uniform viscosity profiles across inner vs outer sub-runner branches."
  )
}

console.log('RHEOLOGY dictionary generated with full depth.')
