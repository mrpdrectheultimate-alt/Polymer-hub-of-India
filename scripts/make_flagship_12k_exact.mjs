// scripts/make_flagship_12k_exact.mjs
import fs from 'fs';

function buildDetailedSectionsForDefectMastery(chNumber, title, coreTopic, workedExample1, workedExample2, workedExample3, exercise1, exercise2, exercise3, exercise4) {
  return `# Chapter ${chNumber}: ${title}

## 1. Executive Overview & Advanced Physical Principles
${coreTopic}

Polymer processing engineers in industrial manufacturing centers across India (such as Daman, Chakan, Guindy, Hazira, Vadodara, Manali, Noida, Hosur, Sanand, and Nashik) frequently encounter complex transient flow and thermal phenomena. Resolving structural and surface defects requires a deep understanding of fluid dynamics, transient non-isothermal thermal conduction, non-Newtonian melt rheology, and viscoelastic relaxation kinetics.

During injection molding, molten polymer at elevated temperature ($190 - 320^\\circ\\text{C}$) enters a cold mold cavity ($30 - 110^\\circ\\text{C}$) under extreme velocity and pressure gradients. Viscous shear heating occurs localized at gate orifices where shear rates exceed $\\dot{\\gamma} > 30,000\\text{ s}^{-1}$. Simultaneously, a solid frozen layer ($\\delta$) forms instantaneously on cold cavity walls, reducing effective flow channel height and causing non-linear pressure drop spikes.

Understanding the interaction between volumetric thermal shrinkage ($\\Delta V$), anisotropic fiber orientation ($\\Delta S$), residual thermal stresses ($\\sigma_{\\text{thermal}}$), and macromolecular chain interdiffusion kinetics is essential for achieving zero-defect production at $99.8\\%$ operational efficiency.

---

## 2. Key Industrial Parameters & Governing Mathematical Equations

### A. Non-Isothermal Transient Conduction & Boundary Layer Growth
$$\\frac{\\partial T}{\\partial t} = \\alpha \\cdot \\frac{\\partial^2 T}{\\partial x^2} \\quad \\text{where } \\alpha = \\frac{k}{\\rho \\cdot c_p}$$

$$\\delta(t) = 2 \\cdot \\sqrt{\\alpha \\cdot t}$$

### B. Pressure Drop in Circular & Rectangular Flow Channels
For circular runners:
$$\\Delta P_{\\text{circular}} = \\frac{2 k L}{R} \\cdot \\left( \\frac{4 Q}{\\pi R^3} \\cdot \\frac{3n+1}{4n} \\right)^n$$

For thin slit rectangular cavity channels of thickness $h$ and width $W$:
$$\\Delta P_{\\text{slit}} = \\frac{2 k L}{h} \\cdot \\left( \\frac{6 Q}{W h^2} \\cdot \\frac{2n+1}{3n} \\right)^n$$

### C. Comprehensive Process Parameter Matrix

| Parameter / Material Grade | PP Homopolymer | PA66 + 30% Glass Fiber | Polycarbonate (PC) | ABS Terpolymer | POM Copolymer | PBT GF30 | PEEK 450G |
|---|---|---|---|---|---|---|---|
| **Melt Temperature ($^\\circ\\text{C}$)** | $210 - 240$ | $285 - 305$ | $280 - 310$ | $220 - 250$ | $190 - 215$ | $250 - 275$ | $370 - 400$ |
| **Mold Temperature ($^\\circ\\text{C}$)** | $30 - 50$ | $80 - 110$ | $85 - 115$ | $50 - 75$ | $60 - 90$ | $70 - 100$ | $160 - 190$ |
| **Volumetric Shrinkage ($\\Delta V\\%$)** | $1.8 - 2.4\\%$ | $0.6 - 1.0\\%$ | $0.5 - 0.7\\%$ | $0.4 - 0.7\\%$ | $1.9 - 2.3\\%$ | $0.5 - 0.9\\%$ | $1.0 - 1.4\\%$ |
| **Parallel Shrinkage ($S_{\\parallel}\\%$)** | $1.50\\%$ | $0.25\\%$ | $0.55\\%$ | $0.50\\%$ | $1.80\\%$ | $0.30\\%$ | $1.10\\%$ |
| **Transverse Shrinkage ($S_{\\perp}\\%$)** | $1.65\\%$ | $0.90\\%$ | $0.60\\%$ | $0.55\\%$ | $2.00\\%$ | $1.10\\%$ | $1.30\\%$ |
| **Thermal Diffusivity ($\\text{m}^2/\\text{s}$)** | $8.50 \\times 10^{-8}$ | $6.80 \\times 10^{-8}$ | $1.12 \\times 10^{-7}$ | $9.20 \\times 10^{-8}$ | $7.40 \\times 10^{-8}$ | $7.10 \\times 10^{-8}$ | $1.35 \\times 10^{-7}$ |
| **Max Safe Vent Depth ($\\text{mm}$)** | $0.020$ | $0.012$ | $0.035$ | $0.030$ | $0.015$ | $0.015$ | $0.010$ |

---

## 3. Worked Industrial Numerical Examples

### 📐 Problem Statement 1
${workedExample1.problem}

### 💡 Step-by-Step Mathematical Solution 1
${workedExample1.solution}

---

### 📐 Problem Statement 2
${workedExample2.problem}

### 💡 Step-by-Step Mathematical Solution 2
${workedExample2.solution}

---

### 📐 Problem Statement 3
${workedExample3.problem}

### 💡 Step-by-Step Mathematical Solution 3
${workedExample3.solution}

---

## 4. Practical Engineering Exercises & Troubleshooting Protocols

### ❓ Exercise ${chNumber}.1
**Question:** ${exercise1.q}
**Answer & Rationale:** ${exercise1.a}

### ❓ Exercise ${chNumber}.2
**Question:** ${exercise2.q}
**Answer & Rationale:** ${exercise2.a}

### ❓ Exercise ${chNumber}.3
**Question:** ${exercise3.q}
**Answer & Rationale:** ${exercise3.a}

### ❓ Exercise ${chNumber}.4
**Question:** ${exercise4.q}
**Answer & Rationale:** ${exercise4.a}

---

## 5. Shop-Floor Case Studies & Root-Cause Elimination Protocols

### 🏢 Industrial Case Study: High-Precision Molding Audit in Daman & Chakan
Manufacturing automotive structural housings and electronic enclosures requires a systematic diagnostic methodology to eliminate scrap rates:

#### A. Diagnostic Baseline Audit
1. **Cavity Pressure Integral Monitoring:** Utilizing piezoelectric transducers placed behind ejector pins at gate and end-of-fill positions to record the pressure-time integral ($\\int P dt$). A variance exceeding $\\pm 3.5\\%$ signals runner imbalance or check ring slip.
2. **Thermal Imaging & Water Flow Checks:** Calibrating water flow rotameters to confirm turbulent flow ($Re > 4,000$) in all cooling circuits. Laminar water flow ($Re < 2,100$) reduces heat transfer coefficients by $70\\%$, causing hot spots and warpage.
3. **Viscous Dissipation Monitoring:** Tracking hydraulic pressure during injection velocity profiling to ensure localized shear heating at the gate does not exceed $+15^\\circ\\text{C}$ melt temperature rise.

#### B. Systematic Quality Control Protocol
* **Melt Homogeneity:** Set screw back pressure to $50 - 100\\text{ bar}$ plastic to ensure consistent melt density and expel entrained gases.
* **Gate Seal Optimization:** Run a gate freeze-off study by weighing parts at decreasing hold time intervals until part mass reaches a constant plateau. Set hold time to gate freeze time $+ 0.5\\text{ s}$.
* **Vent Maintenance Routine:** Ultrasonic cleaning of mold parting line vents every 24 hours prevents gas compression burn marks and flash.
`;
}

console.log('Builder module ready');
