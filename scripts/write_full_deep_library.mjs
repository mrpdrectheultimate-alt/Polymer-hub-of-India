// scripts/write_full_deep_library.mjs — Writes complete, deep, multi-chapter library_data.ts
import fs from 'fs'
import path from 'path'

const makeChapter = (title, summary, sec1, sec2, formula, tableHeaders, tableRows, problem, solution, exQ, exAns) => {
  let tableMd = ''
  if (tableHeaders && tableRows) {
    tableMd = `\n| ${tableHeaders.join(' | ')} |\n|${tableHeaders.map(() => '---').join('|')}|\n`
    tableRows.forEach(row => {
      tableMd += `| ${row.join(' | ')} |\n`
    })
  }

  let formulaMd = formula ? `\n$$\n${formula}\n$$\n` : ''

  return `# ${title}

## 1. Executive Summary & Physical Principles
${summary}

${sec1}

---

## 2. Fundamental Governing Equations & Parameter Matrix
${sec2}
${formulaMd}
${tableMd}
---

## 3. Worked Industrial Numerical Example

### 📐 Problem Statement
${problem}

### 💡 Step-by-Step Mathematical Solution
${solution}

---

## 4. Practical Engineering Exercises & Case Studies

### ❓ Exercise Questions
**Question:** ${exQ}
**Answer & Rationale:** ${exAns}
`
}

// ── BOOK 1: RHEOLOGY ────────────────────────────────────────────────────────
const RHEOLOGY_CHAPTERS = {
  ch1: makeChapter(
    "Chapter 1: Why Rheology Matters to Every Polymer Engineer",
    "Rheology is the fundamental study of the deformation and flow of complex fluids under shear and extensional stress fields. For polymer processing engineers, mould designers, and plant managers, melt rheology is the single critical discipline governing cavity fill pressure, shear dissipation heating, extrudate die swell, and cycle time optimization.",
    "Unlike low-molecular-weight Newtonian liquids (such as water or organic solvents), molten polymers consist of long entangling macromolecular chains. Their flow response is intrinsically non-linear and viscoelastic:\n* **Viscous Response:** Irreversible viscous dissipation of thermal energy during shear flow.\n* **Elastic Response:** Reversible storage of elastic strain energy within stretched molecular coils.",
    "Melt viscosity (\\\\eta) dictates hydraulic pump pressure required to drive molten resin through screws, manifold channels, hot runners, and complex mould cavities. High shear in gate orifices generates localized thermal energy (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}), risking degradation in sensitive resins like PVC, POM, and PEEK.",
    "B = \\\\frac{D_e}{D_0} = 1 + \\\\left( \\\\frac{\\\\tau_w}{G} \\\\right)^2",
    ["Manufacturing Process", "Typical Shear Rate Range (s^-1)", "Governing Rheological Property", "Shop-Floor Impact"],
    [
      ["Compression Moulding", "1 - 10", "Zero-shear viscosity (eta_0)", "Sag resistance, core positioning"],
      ["Profile Extrusion / Pipe", "100 - 1,000", "Power-law index (n), Die swell (B)", "Dimensional sizing, surface finish"],
      ["Injection Moulding Cavity", "1,000 - 100,000", "High-shear apparent viscosity", "Gate freeze-off, cavity fill pressure"],
      ["Blow Moulding Parison", "10 - 100", "Melt strength, Extensional viscosity", "Parison sag, wall uniform thickness"]
    ],
    "An extrusion engineer in Daman is processing a high-density polyethylene (HDPE) pipe with a die orifice diameter $D_0 = 50.0\\text{ mm}$. Measured extrudate pipe diameter $D_e = 57.5\\text{ mm}$. Extruder volumetric flow rate $Q = 120\\text{ cm}^3/\\text{s}$. Die land length $L = 100\\text{ mm}$.\n\nCalculate:\n1. The extrudate die swell ratio ($B$).\n2. The apparent wall shear rate ($\\dot{\\gamma}_{\\text{app}}$) inside the circular die.",
    "#### Step 1: Calculate Extrudate Die Swell Ratio ($B$)\n$$B = \\frac{D_e}{D_0} = \\frac{57.5\\text{ mm}}{50.0\\text{ mm}} = \\mathbf{1.15} \\quad (15\\% \\text{ swell})$$\n\n#### Step 2: Calculate Apparent Wall Shear Rate ($\\dot{\\gamma}_{\\text{app}}$)\n$$\\dot{\\gamma}_{\\text{app}} = \\frac{4 Q}{\\pi R_0^3} = \\frac{4 \\times 120}{\\pi \\times (2.5)^3} = \\frac{480}{49.087} = \\mathbf{9.78\\text{ s}^{-1}}$$",
    "Why does increasing injection speed sometimes *decrease* cavity filling pressure in thin-wall injection moulding?",
    "Increasing injection speed elevates shear rate (\\\\dot{\\\\gamma}). Because engineering polymers are strongly pseudoplastic (shear thinning, $n < 1$), viscosity drops non-linearly (\\\\eta \\\\propto \\\\dot{\\\\gamma}^{n-1}). Additionally, localized shear heating (\\\\dot{Q} = \\\\tau \\\\cdot \\\\dot{\\\\gamma}) raises melt temperature at gate interfaces, further reducing viscosity and lowering required fill pressure."
  ),
  ch2: makeChapter(
    "Chapter 2: Newtonian vs. Non-Newtonian Flow Kinetics",
    "In a simple Newtonian fluid undergoing steady laminar shear, shear stress (\\\\tau) varies linearly with shear rate (\\\\dot{\\\\gamma}): \\\\tau = \\\\eta \\\\cdot \\\\dot{\\\\gamma}. Polymer melts are non-Newtonian fluids. Their apparent viscosity (\\\\eta = \\\\tau / \\\\dot{\\\\gamma}) decreases dramatically as shear rate increases—a physical phenomenon termed **pseudoplasticity (shear thinning)**.",
    "At rest (\\\\dot{\\\\gamma} \\\\to 0), long macromolecular chains form an entangled, isotropic coil network resisting deformation with zero-shear viscosity \\\\eta_0. Under high shear flow:\n1. Imposed hydrodynamic forces exceed Brownian thermal randomization.\n2. Inter-chain entanglements uncoil and slip.\n3. Molecular chains align parallel to streamlines, reducing internal friction and dropping viscosity by up to 3 orders of magnitude.",
    "Ostwald-de Waele Power Law Kinetics:",
    "\\\\tau = K \\\\cdot \\\\dot{\\\\gamma}^n \\\\implies \\\\eta(\\\\dot{\\\\gamma}) = K \\\\cdot \\\\dot{\\\\gamma}^{n-1}",
    ["Polymer Grade", "Zero-Shear Viscosity eta_0 (Pa*s)", "Flow Index n", "Processing Shear Rate (s^-1)", "Apparent Viscosity eta (Pa*s)"],
    [
      ["PP Homopolymer (MFI 12)", "1,200", "0.32", "5,000", "45"],
      ["HDPE (Film Grade)", "8,500", "0.38", "1,200", "120"],
      ["PC (Moulding Grade)", "2,400", "0.68", "8,000", "180"],
      ["PA66 (Unfilled)", "350", "0.82", "10,000", "28"]
    ],
    "A laboratory technician measures shear stress for a polyolefin melt at $210^\\circ\\text{C}$ on a capillary rheometer:\n* At shear rate $\\dot{\\gamma}_1 = 100\\text{ s}^{-1}$, shear stress $\\tau_1 = 45,000\\text{ Pa}$.\n* At shear rate $\\dot{\\gamma}_2 = 1,000\\text{ s}^{-1}$, shear stress $\\tau_2 = 120,000\\text{ Pa}$.\n\nCalculate:\n1. The apparent viscosity at both shear rates.\n2. The power-law flow behavior index ($n$).",
    "#### Step 1: Calculate Apparent Viscosities\n$$\\eta_1 = \\frac{45,000}{100} = \\mathbf{450\\text{ Pa}\\cdot\\text{s}} \\quad , \\quad \\eta_2 = \\frac{120,000}{1,000} = \\mathbf{120\\text{ Pa}\\cdot\\text{s}}$$\n\n#### Step 2: Compute Flow Behavior Index ($n$)\n$$n = \\frac{\\ln(120,000 / 45,000)}{\\ln(1,000 / 100)} = \\frac{\\ln(2.6667)}{\\ln(10)} = \\frac{0.9808}{2.3026} = \\mathbf{0.426}$$",
    "Why is a single Melt Flow Index (MFI) value insufficient to predict cavity fill performance in high-speed injection moulding?",
    "MFI measures single-point flow under low shear rates (\\\\dot{\\\\gamma} \\\\approx 1 - 10\\\\text{ s}^{-1}). Injection moulding gates experience shear rates exceeding $10,000\\\\text{ s}^{-1}$. Because two resins with identical MFI can have different power-law indices ($n$), their viscosities diverge at processing shear rates."
  ),
  ch3: makeChapter(
    "Chapter 3: Mathematical Constitutive Models (Power Law & Carreau-Yasuda)",
    "To model non-Newtonian fluid dynamics inside injection moulding simulation tools (Moldflow, Moldex3D) and finite element dies, empirical viscosity functions must bridge low-shear zero-viscosity plateaus and high-shear pseudoplastic power-law regimes.",
    "The Carreau-Yasuda 5-parameter model captures zero-shear viscosity (\\\\eta_0), infinite-shear limit (\\\\eta_\\\\infty), characteristic relaxation time (\\\\lambda), and high-shear slope ($n$). This model prevents numerical singularities during low-shear stagnation in mold cavities.",
    "\\\\eta(\\\\dot{\\\\gamma}) = \\\\eta_\\\\infty + (\\\\eta_0 - \\\\eta_\\\\infty) \\\\left[ 1 + (\\\\lambda \\\\dot{\\\\gamma})^a \\\\right]^{\\\\frac{n-1}{a}}",
    ["Model Parameter", "Physical Significance", "Typical Range (PP/HDPE)", "Engineering Impact"],
    [
      ["eta_0", "Zero-shear plateau viscosity", "500 - 15,000 Pa*s", "Sag resistance, core deflection"],
      ["lambda", "Relaxation spectrum time", "0.01 - 0.50 s", "Elastic strain recovery"],
      ["n", "High-shear power law index", "0.25 - 0.45", "Pseudoplastic thinning slope"],
      ["a", "Transition curvature parameter", "1.5 - 2.0", "Knee region sharpness"]
    ],
    "An engineer is evaluating Carreau model parameters for an optical PC resin ($\\eta_0 = 3000\\text{ Pa}\\cdot\\text{s}$, $\\lambda = 0.05\\text{ s}$, $n = 0.40$, $a = 2.0$).\nCalculate the apparent viscosity ($\\eta$) at a cavity gate shear rate $\\dot{\\gamma} = 2,000\\text{ s}^{-1}$ assuming $\\eta_\\infty \\ll \\eta_0$.",
    "#### Step-by-Step Solution\n$$\\lambda \\dot{\\gamma} = 0.05 \\times 2000 = 100$$\n$$\\eta = 3000 \\times (1 + 100^2)^{-0.30} = 3000 \\times (10001)^{-0.30} = 3000 \\times 0.0631 = \\mathbf{189.3\\text{ Pa}\\cdot\\text{s}}$$",
    "Why does the Ostwald-de Waele Power Law fail at low shear rates near zero (\\\\dot{\\\\gamma} \\\\to 0)?",
    "As $\\dot{\\gamma} \\to 0$, $\\eta = K \\dot{\\gamma}^{n-1}$ predicts infinite viscosity for $n < 1$. Physical polymer melts exhibit a finite zero-shear plateau ($\\eta_0$). The Carreau-Yasuda model correctly caps low-shear viscosity at $\\eta_0$."
  ),
  ch4: makeChapter(
    "Chapter 4: Capillary Rheometry & Bagley / Rabinowitsch Corrections",
    "Capillary rheometry measures melt viscosity at high shear rates ($100 - 10,000\\text{ s}^{-1}$) typical of extrusion dies and injection runner channels. Polymer melt is forced through a tungsten carbide capillary die of radius $R$ and length $L$.",
    "Entrance extensional convergence creates extra pressure loss (\\\\Delta P_e). Non-Newtonian shear profiles alter velocity gradients near die walls, requiring mathematical corrections to derive true viscosity curves.",
    "\\\\tau_w = \\\\frac{\\\\Delta P - \\\\Delta P_e}{2 (L/R)} \\\\quad , \\\\quad \\\\dot{\\\\gamma}_w = \\\\dot{\\\\gamma}_{\\\\text{app}} \\\\left[ \\\\frac{3n + 1}{4n} \\\\right]",
    ["Parameter", "Uncorrected Value", "Corrected Value", "Correction Method"],
    [
      ["Wall Shear Stress", "0.210 MPa", "0.180 MPa", "Bagley Linear Extrapolation"],
      ["Wall Shear Rate", "1,200 s^-1", "1,757 s^-1", "Weissenberg-Rabinowitsch"]
    ],
    "A quality laboratory tests an LLDPE resin on a capillary rheometer using dies with $L/R = 10, 20, 30$ ($n = 0.38$) at $\\dot{\\gamma}_{\\text{app}} = 1000\\text{ s}^{-1}$.\nMeasured total pressure drops: $\\Delta P_{10} = 4.2\\text{ MPa}$, $\\Delta P_{20} = 7.8\\text{ MPa}$, $\\Delta P_{30} = 11.4\\text{ MPa}$.\n\nCalculate:\n1. Entrance pressure loss ($\\Delta P_e$) from linear Bagley extrapolation.\n2. True wall shear stress ($\\tau_w$) at $L/R = 30$.\n3. True wall shear rate ($\\dot{\\gamma}_w$) applying the Rabinowitsch correction.",
    "#### Step 1: Linear Bagley Extrapolation\n$$\\frac{d(\\Delta P)}{d(L/R)} = \\frac{11.4 - 4.2}{30 - 10} = 0.36\\text{ MPa per L/R unit}$$\n$$\\Delta P_e = 4.2 - (10 \\times 0.36) = \\mathbf{0.60\\text{ MPa}}$$\n\n#### Step 2: Calculate True Wall Shear Stress ($\\tau_w$)\n$$\\tau_w = \\frac{11.4 - 0.60}{2 \\times 30} = \\frac{10.8}{60} = \\mathbf{0.180\\text{ MPa}}$$\n\n#### Step 3: Compute True Wall Shear Rate ($\\dot{\\gamma}_w$)\n$$\\dot{\\gamma}_w = 1000 \\times \\left[ \\frac{3(0.38) + 1}{4(0.38)} \\right] = 1000 \\times \\left[ \\frac{2.14}{1.52} \\right] = \\mathbf{1,407.9\\text{ s}^{-1}}$$",
    "How is entrance pressure loss (\\\\Delta P_e) determined experimentally using Bagley plots?",
    "Measure total pressure drop ($\\Delta P$) across three dies with identical radius $R$ but different lengths ($L/R = 10, 20, 30$). Plot $\\Delta P$ vs. $L/R$. Extrapolating the linear trendline back to zero length ($L/R = 0$) gives the y-intercept value equal to $\\Delta P_e$."
  ),
  ch5: makeChapter(
    "Chapter 5: Extrudate Die Swell & Flow Instabilities",
    "When polymer melt exits a die into free space, stored elastic strain causes lateral expansion known as **die swell** ($B = D_e / D_0$). At high wall shear stresses (\\\\tau_w), flow instabilities manifest.",
    "Sharkskin surface tearing occurs when wall shear stress \\\\tau_w > 0.14\\\\text{ MPa}. Gross melt fracture occurs when critical shear stress \\\\tau_w > 0.40\\\\text{ MPa}. Dosing $500\\\\text{ ppm}$ fluoropolymer Polymer Processing Aids (PPA) coats tungsten carbide die walls with a low-energy layer, promoting wall slip and eliminating surface defects.",
    "B = \\\\frac{D_e}{D_0} = 1 + \\\\left( \\\\frac{\\\\tau_w}{G} \\\\right)^2",
    ["Instability Type", "Threshold Stress", "Visual Appearance", "Shop-Floor Remedy"],
    [
      ["Sharkskin", "> 0.14 MPa", "Matte surface ridges", "Add 500 ppm PPA"],
      ["Stick-Slip", "> 0.30 MPa", "Periodic rough bands", "Raise die wall temp"],
      ["Gross Fracture", "> 0.40 MPa", "Helical melt distortion", "Increase die gap size"]
    ],
    "An LLDPE film line operating at $\\tau_w = 0.19\\text{ MPa}$ exhibits severe surface haze.\nDosing $500\\text{ ppm}$ fluoropolymer PPA coats the die wall, inducing wall slip and lowering shear stress to $\\tau_w = 0.11\\text{ MPa}$.",
    "Since $0.11\\text{ MPa} < 0.14\\text{ MPa}$ critical threshold, sharkskin surface tearing is completely eliminated and film transparency is restored.",
    "How do fluoropolymer PPAs eliminate sharkskin surface tearing?",
    "Fluoropolymer PPAs coat tungsten carbide die walls with a low-surface-energy layer, promoting wall slip, reducing wall shear stress below the critical threshold ($0.14\\text{ MPa}$) without increasing melt temperature."
  ),
  ch6: makeChapter(
    "Chapter 6: Oscillatory Shear Rheometry & Viscoelastic Moduli",
    "Using parallel plate geometry ($25\\text{ mm}$ diameter), rotational rheometers measure linear viscoelastic properties under small amplitude oscillatory shear (SAOS).",
    "Storage Modulus (G') measures stored elastic energy. Loss Modulus (G'') measures dissipated viscous heat. Damping factor \\\\tan \\\\delta = G'' / G'. The frequency where G' = G'' defines the crossover frequency (\\\\omega_c).",
    "G^*(\\\\omega) = G'(\\omega) + i G''(\\omega) \\\\quad , \\\\quad \\\\tan \\\\delta = \\\\frac{G''}{G'}",
    ["Viscoelastic Parameter", "Symbol", "Physical Meaning", "Processing Relevance"],
    [
      ["Storage Modulus", "G'", "Elastic energy storage", "Melt elasticity, sag"],
      ["Loss Modulus", "G''", "Viscous energy loss", "Dissipation heating"],
      ["Damping Factor", "tan delta", "Viscous to elastic ratio", "Bubble stability"],
      ["Crossover Frequency", "omega_c", "Relaxation time inverse", "MWD fingerprint"]
    ],
    "A SAOS frequency sweep test on PP homopolymer at $200^\\circ\\text{C}$ reveals crossover frequency $G' = G'' = 12,000\\text{ Pa}$ occurs at $\\omega_c = 25.0\\text{ rad/s}$.",
    "Characteristic relaxation spectrum time $\\lambda = 1 / \\omega_c = 1 / 25.0 = \\mathbf{0.040\\text{ seconds}}$.",
    "How does Molecular Weight Distribution (MWD) affect crossover frequency?",
    "Broad MWD resins contain high MW chains that relax slowly, shifting crossover frequency ($\\omega_c$) lower and increasing crossover modulus ($G_c$). Narrow MWD resins display sharp transitions at higher frequencies."
  ),
  ch7: makeChapter(
    "Chapter 7: Industrial Shop-Floor Rheology Implementation",
    "Applying shear-thinning indices to balance multi-cavity hot runners and optimize blown film extrusion processing.",
    "Rheological optimization ensures equal shear-rate distribution across multi-cavity manifolds, eliminating weight variance and flash. Zero-shear viscosity dictates blown film parison sag resistance.",
    "\\\\Delta P_{\\\\text{runner}} = 2 K \\\\left(\\\\frac{1+3n}{4n}\\\\right)^n \\\\left(\\\\frac{4 Q}{\\\\pi R^3}\\\\right)^n \\\\frac{L}{R}",
    ["Application", "Target Rheological Property", "Optimal Parameter Range"],
    [
      ["Hot Runner Balance", "High shear thinning", "n < 0.35"],
      ["Blown Film", "High zero-shear viscosity", "eta_0 > 10,000 Pa*s"],
      ["Thin-Wall Injection", "Low high-shear viscosity", "eta (10^4 s^-1) < 30 Pa*s"]
    ],
    "An 8-cavity hot runner mould exhibits a $6\\%$ weight variance between inner and outer cavities.\nApplying shear-rate equalized runner branching balances shear-thinning viscosity ($\\eta \\propto \\dot{\\gamma}^{n-1}$).",
    "Re-balancing branch diameters using $R_2 = R_1 (Q_2/Q_1)^{n/(3n+1)}$ equalizes pressure drop across all 8 cavities, reducing part weight variance to $< 0.4\\%$.",
    "Why does shear-induced melt imbalance occur in geometrically balanced runners?",
    "As melt flows through cold runners, high shear near walls heats outer melt layers, creating non-uniform viscosity profiles across inner vs outer sub-runner branches."
  )
}

console.log('Building full library_data.ts template...')
