# 🔬 PolymerHub: Scientific Truth & Mathematical Derivations Dossier
**Target Reviewers:** Polymer Chemistry Professors, CIPET Faculty & Accredited Material Scientists  
**Curriculum Scope:** 19 Subjects · 216 Lessons · 11 Virtual Lab Simulators · 5,959 KaTeX Mathematical Expressions  

---

## 1. 🧬 Polymer Chemistry: Chain Growth & Free-Radical Kinetics
**Governing Standard:** Odian, G. *Principles of Polymerization*, 4th Ed. (Wiley); Flory, P. J. *Principles of Polymer Chemistry* (Cornell Univ. Press).

### 1.1 Initiation Rate ($R_i$)
Thermal homolysis of initiator (e.g. AIBN, BPO) with initiator efficiency $f$:
$$I \xrightarrow{k_d} 2 R^\bullet$$
$$R^\bullet + M \xrightarrow{k_i} R-M^\bullet$$
$$\boxed{R_i = 2 f k_d [I]}$$
*Parameter Constraints:* $0.5 \le f \le 0.8$; $k_d \sim 10^{-5} \text{ s}^{-1}$ at $60^\circ\text{C}$ for AIBN.

### 1.2 Propagation Rate ($R_p$)
Continuous head-to-tail monomer addition:
$$P_n^\bullet + M \xrightarrow{k_p} P_{n+1}^\bullet$$
$$\boxed{R_p = k_p [M] [M^\bullet]}$$
Under steady-state assumption ($\frac{d[M^\bullet]}{dt} = 0 \implies R_i = R_t$):
$$[M^\bullet] = \sqrt{\frac{2 f k_d [I]}{2 k_t}} = \sqrt{\frac{f k_d [I]}{k_t}}$$
$$\boxed{R_p = k_p [M] \sqrt{\frac{f k_d [I]}{k_t}}}$$
*Kinetic Order:* 1st order with respect to monomer $[M]$, 0.5 order with respect to initiator $[I]$.

### 1.3 Instantaneous Number-Average Degree of Polymerization ($\bar{X}_n$)
$$\boxed{\bar{X}_n = \frac{R_p}{R_t / 2} = \frac{k_p [M]}{\sqrt{f k_d k_t [I]}}}$$
*(Assuming termination exclusively by radical combination $k_{tc}$)*.

---

## 2. 📈 Step-Growth Condensation: Carothers Equation & Gel Point
**Governing Standard:** Carothers, W. H. (1936); Flory-Stockmayer Gelation Theory.

### 2.1 Linear Bifunctional Condensation ($f_{\text{avg}} = 2$)
Degree of polymerization $\bar{X}_n$ vs fractional conversion $p$:
$$\bar{X}_n = \frac{N_0}{N} = \frac{1}{1 - p}$$
$$\text{Weight-Average: } \bar{X}_w = \frac{1 + p}{1 - p} \implies \text{PDI} = \frac{\bar{X}_w}{\bar{X}_n} = 1 + p \xrightarrow{p \to 1} 2.0$$

### 2.2 Non-Linear Crosslinking Gelation Point ($f_{\text{avg}} > 2$)
$$\bar{X}_n = \frac{2}{2 - p \cdot f_{\text{avg}}}$$
At the critical gel point $p_c$, $\bar{X}_n \to \infty$ and macroscopic network forms:
$$\boxed{p_c = \frac{2}{f_{\text{avg}}}}$$

---

## 3. 🔬 Analytical Characterization: GPC / SEC Size-Exclusion
**Governing Standard:** ASTM D5296 / ISO 13885 (Gel Permeation Chromatography).

### 3.1 Universal Calibration Principle (Benoit Relation)
Hydrodynamic volume $V_h \propto [\eta] \cdot M$:
$$\log([\eta] \cdot M) = f(V_r)$$
Mark-Houwink-Sakurada intrinsic viscosity relationship:
$$[\eta] = K \cdot M^a$$
$$\log(K \cdot M^{1+a}) = -A \cdot V_r + B$$

### 3.2 Statistical Molecular Weight Moments
$$\bar{M}_n = \frac{\sum N_i M_i}{\sum N_i} = \frac{\sum h_i}{\sum (h_i / M_i)}$$
$$\bar{M}_w = \frac{\sum N_i M_i^2}{\sum N_i M_i} = \frac{\sum (h_i M_i)}{\sum h_i}$$
$$\bar{M}_z = \frac{\sum N_i M_i^3}{\sum N_i M_i^2} = \frac{\sum (h_i M_i^2)}{\sum (h_i M_i)}$$
$$\boxed{\bar{M}_z > \bar{M}_w > \bar{M}_n \quad (\text{PDI} = \bar{M}_w / \bar{M}_n \ge 1.00)}$$

---

## 4. 🎛️ Viscoelasticity & Constitutive Mechanical Models
**Governing Standard:** ASTM D638 / ISO 527 (Tensile) & Carreau-Yasuda Melt Rheology.

### 4.1 Eyring Activated-Rate Process for Yield Stress
$$\sigma_y(T, \dot{\varepsilon}) = \frac{k_B T}{v^*} \left[ \frac{\Delta H^*}{k_B T} + \ln\left(\frac{2 \dot{\varepsilon}}{\dot{\varepsilon}_0}\right) \right]$$
*Engineering Approximation implemented in Simulator:*
$$\sigma_y(T) \approx \sigma_{y,0} \cdot \exp\left(-\beta (T - T_{\text{ref}})\right) \cdot \left[1 + \alpha \log_{10}\left(\frac{\dot{\varepsilon}}{\dot{\varepsilon}_0}\right)\right]$$

### 4.2 Carreau-Yasuda Pseudoplastic Melt Rheology
$$\frac{\eta(\dot{\gamma}) - \eta_\infty}{\eta_0 - \eta_\infty} = \left[ 1 + (\lambda \dot{\gamma})^a \right]^{\frac{n - 1}{a}}$$
For polymer melts where $\eta_\infty \ll \eta_0$:
$$\eta(\dot{\gamma}) \approx \eta_0 \left[ 1 + (\lambda \dot{\gamma})^a \right]^{\frac{n - 1}{a}}$$
*Parameters:* $n \approx 0.25 - 0.45$ (Shear-thinning index), $\lambda$ (Relaxation time constant $\sim 0.05 - 1.0 \text{ s}$).

---

## 5. 🛠️ Injection Moulding & Tooling Heat Transfer
**Governing Standard:** ASTM D3641 / Rosato *Plastics Processing Data Handbook*.

### 5.1 Clamping Tonnage Formula
$$F_{\text{clamp}} = \frac{A_{\text{projected}} \times N_{\text{cavities}} \times P_{\text{cavity}}}{1000} \times S_f$$
*Typical Cavity Pressures:* 300–600 bar for commodity polyolefins; 700–1200 bar for high-viscosity engineering thermoplastics (PC, PEEK). Safety factor $S_f = 1.10 - 1.25$.

### 5.2 Fourier 1D Transient Mold Cooling Time ($t_c$)
$$t_c = \frac{h^2}{\pi^2 \alpha} \ln\left[ \frac{8}{\pi^2} \left( \frac{T_{\text{melt}} - T_{\text{mold}}}{T_{\text{eject}} - T_{\text{mold}}} \right) \right]$$
Where:
- $h$: Maximum part wall thickness $(\text{mm})$
- $\alpha$: Polymer thermal diffusivity $(\text{mm}^2/\text{s}) = \frac{k}{\rho \cdot c_p}$
- $T_{\text{melt}}, T_{\text{mold}}, T_{\text{eject}}$: Melt, mold, and safe heat deflection ejection temperatures $(^\circ\text{C})$.

---

## 6. 📝 Peer-Review Sign-Off Sheet
| Category | Primary Standard | Model Form | Status for Review |
| :--- | :--- | :--- | :--- |
| **Kinetics** | Odian / Flory | Steady-State Rate Laws | Pending Academic Endorsement |
| **Gelation** | Carothers / Flory | Non-Linear Asymptote | Mathematically Exact |
| **GPC/SEC** | ASTM D5296 | Log MW vs Retention Volume | Analytically Standard |
| **Rheology** | ISO 11443 | Carreau-Yasuda Power Law | Constitutive Approximation |
| **Moulding** | ASTM D3641 | 1D Fourier Solidification | Industrial Standard |
