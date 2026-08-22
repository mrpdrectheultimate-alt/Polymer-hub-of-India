// scripts/fix_deep_dive_3.js
// Fixes Deep Dive 3 findings:
// 1. Updates missing descriptions for 4 subjects
// 2. Seeds 10 practice questions each for 9 uncovered subjects (90 questions total)

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSubjectDescriptions() {
  console.log('\n📝 Updating missing subject descriptions...');
  const descriptions = {
    'polymer-nanotechnology': 'Nanoscale reinforcement in polymers — carbon nanotubes, graphene, halloysite, and nanoclay nanocomposites with advanced barrier, electrical, and mechanical properties.',
    'bioprocessing-fermentation': 'Industrial biotechnology for biopolymers — bacterial synthesis of PHA, fermentation pathways for lactic acid and 1,3-propanediol, and enzymatic plastic degradation.',
    'robotics-plastics': 'Automation and robotics in polymer manufacturing — sprue pickers, 6-axis articulated robots for parts removal, automated insert moulding, and in-mould labelling (IML) systems.',
    'digital-twins-plastics': 'Industry 4.0 and digital twin technologies in polymer processing — real-time cavity pressure sensing, predictive quality algorithms, and virtual injection moulding machine replication.'
  };

  for (const [slug, desc] of Object.entries(descriptions)) {
    const { error } = await s.from('subjects').update({ description: desc }).eq('slug', slug);
    if (error) console.error(`  ❌ Failed for ${slug}:`, error.message);
    else console.log(`  ✅ Updated description for: ${slug}`);
  }
}

async function seedMissingPracticeQuestions() {
  console.log('\n🎯 Seeding practice questions for 9 subjects...');

  const { data: subjects } = await s.from('subjects').select('id, slug, name');
  const subMap = Object.fromEntries(subjects.map(s => [s.slug, s.id]));

  const newQuestions = [
    // 1. Additives & Compounding
    {
      subject_slug: 'additives-compounding',
      topic: 'Antioxidants & Thermal Stabilizers',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'Which of the following primary antioxidants functions as a free radical scavenger by donating hydrogen from a sterically hindered phenolic group?',
      options: [
        'A) Phosphites (e.g., Irgafos 168)',
        'B) Sterically Hindered Phenols (e.g., Irganox 1010)',
        'C) Thiosynergists (e.g., DSTDP)',
        'D) Carbon Black'
      ],
      correct_answer: 'B',
      explanation: 'Primary antioxidants such as Irganox 1010 are sterically hindered phenols that interrupt the auto-oxidation chain reaction by donating hydrogen radicals to peroxy radicals (ROO•).'
    },
    {
      subject_slug: 'additives-compounding',
      topic: 'Flame Retardants',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 2,
      question: 'In halogen-free flame retardant (HFFR) systems for polyolefins, what is the primary mechanism of action of Ammonium Polyphosphate (APP)?',
      options: [
        'A) Gas-phase radical trapping by halogen release',
        'B) Intumescent char formation acting as a physical thermal & oxygen barrier',
        'C) Endothermic decomposition releasing cooling water vapor',
        'D) UV light reflection'
      ],
      correct_answer: 'B',
      explanation: 'Ammonium Polyphosphate (APP) acts as an acid source in intumescent flame retardant formulations. Under heat, it dehydrates the carbon source to generate a multi-cellular expanded char layer on the polymer surface.'
    },
    {
      subject_slug: 'additives-compounding',
      topic: 'Twin-Screw Extrusion',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'In a co-rotating twin-screw compounding extruder, what is the primary function of kneading blocks with a 90° stagger angle?',
      options: [
        'A) Maximum forward conveying with minimal shear',
        'B) Pure dispersive and distributive mixing with zero net conveying capability',
        'C) Venting volatile degradation gases out through vacuum ports',
        'D) High-pressure pumping toward the strand die'
      ],
      correct_answer: 'B',
      explanation: 'A 90° stagger angle in kneading blocks provides balanced shear and high residence time distribution without contributing net forward or reverse axial conveying.'
    },
    {
      subject_slug: 'additives-compounding',
      topic: 'Plasticizers',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'How do plasticizers primarily reduce the Glass Transition Temperature (Tg) of rigid PVC?',
      options: [
        'A) By chemically crosslinking the PVC backbone',
        'B) By intercalating between polymer chains to increase free volume and reduce interchain dipole-dipole attractions',
        'C) By initiating free-radical chain scission in the PVC matrix',
        'D) By forming crystalline spherulites that exclude amorphous PVC'
      ],
      correct_answer: 'B',
      explanation: 'Plasticizers shield the chlorine-carbon dipoles along PVC chains, increasing fractional free volume and chain segmental mobility, which dramatically depresses Tg from ~80°C down to sub-zero temperatures.'
    },
    {
      subject_slug: 'additives-compounding',
      topic: 'Light Stabilizers',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'What is the regenerative catalytic mechanism through which Hindered Amine Light Stabilizers (HALS) protect polypropylene from photo-oxidation?',
      options: [
        'A) The Denisov Cycle involving nitroxyl radicals (•NO-R)',
        'B) Norrish Type I photocleavage',
        'C) Michaelis-Menten kinetics',
        'D) Friedel-Crafts alkylation'
      ],
      correct_answer: 'A',
      explanation: 'HALS undergo cyclical regeneration via the Denisov Cycle: amine is oxidized to a stable nitroxyl radical (•NO-R), which traps alkyl radicals (R•), forming aminoethers that subsequently react with peroxy radicals to regenerate the nitroxyl radical.'
    },

    // 2. Plastic Packaging Engineering
    {
      subject_slug: 'plastic-packaging-engineering',
      topic: 'Barrier Properties',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'Which polymer is celebrated as one of the highest oxygen barrier materials in multilayer food packaging films?',
      options: [
        'A) Low Density Polyethylene (LDPE)',
        'B) Ethylene Vinyl Alcohol (EVOH)',
        'C) Polystyrene (PS)',
        'D) Polypropylene (PP)'
      ],
      correct_answer: 'B',
      explanation: 'EVOH copolymers provide exceptional gas and oxygen barrier properties under dry conditions due to high intermolecular hydrogen bonding between hydroxyl (-OH) groups.'
    },
    {
      subject_slug: 'plastic-packaging-engineering',
      topic: 'Permeability & Fickian Diffusion',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 2,
      question: 'The gas permeability coefficient (P) through a polymeric packaging film is defined as the product of which two fundamental parameters?',
      options: [
        'A) Diffusion coefficient (D) and Solubility coefficient (S)',
        'B) Tensile modulus (E) and Film thickness (l)',
        'C) Melt flow rate (MFR) and Density (ρ)',
        'D) Surface tension (γ) and Contact angle (θ)'
      ],
      correct_answer: 'A',
      explanation: 'According to steady-state permeation theory (Fick\'s and Henry\'s laws), Permeability P = D × S, where D is diffusivity (rate of transport) and S is solubility (thermodynamic partition coefficient).'
    },
    {
      subject_slug: 'plastic-packaging-engineering',
      topic: 'Heat Sealing & Hot Tack',
      difficulty: 'medium',
      is_gate_relevant: false,
      marks: 1,
      question: 'In form-fill-seal (FFS) packaging operations, what property measures the seal strength while the seal interface is still in a molten or semi-molten state?',
      options: [
        'A) Ultimate Tensile Strength',
        'B) Hot Tack Strength',
        'C) Dart Impact Resistance',
        'D) Elmendorf Tear Strength'
      ],
      correct_answer: 'B',
      explanation: 'Hot tack is the ability of a heat seal to withstand mechanical stress/weight before it has cooled and fully crystallized.'
    },
    {
      subject_slug: 'plastic-packaging-engineering',
      topic: 'Modified Atmosphere Packaging (MAP)',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'Which gas is predominantly used in Modified Atmosphere Packaging (MAP) to inhibit aerobic bacterial and mold growth in fresh food products?',
      options: [
        'A) Pure Oxygen (O2)',
        'B) Carbon Dioxide (CO2)',
        'C) Argon (Ar)',
        'D) Hydrogen (H2)'
      ],
      correct_answer: 'B',
      explanation: 'CO2 dissolves in moisture at the food surface to form carbonic acid, lowering local pH and altering microbial cell membrane permeability, which inhibits aerobic spoilage microorganisms.'
    },
    {
      subject_slug: 'plastic-packaging-engineering',
      topic: 'Multilayer Co-extrusion',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'In a 5-layer co-extruded barrier film structure of PE / Tie / EVOH / Tie / PE, what is the chemical nature of the Tie layer commonly used to bond non-polar PE with polar EVOH?',
      options: [
        'A) Polytetrafluoroethylene (PTFE)',
        'B) Maleic anhydride grafted Polyethylene (MA-g-PE)',
        'C) High Molecular Weight Polystyrene',
        'D) Polyvinylidene chloride (PVDC)'
      ],
      correct_answer: 'B',
      explanation: 'Maleic anhydride-grafted PE (MA-g-PE) provides dual compatibility: the PE backbone co-crystallizes with the PE outer layer, while anhydride rings react with hydroxyl groups of EVOH to form covalent ester bonds.'
    },

    // 3. Life Cycle Assessment (LCA)
    {
      subject_slug: 'life-cycle-assessment',
      topic: 'ISO Standards & Methodology',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'Which ISO standard defines the principles and framework for conducting Life Cycle Assessment (LCA)?',
      options: [
        'A) ISO 9001',
        'B) ISO 14040',
        'C) ISO 13485',
        'D) ISO 17025'
      ],
      correct_answer: 'B',
      explanation: 'ISO 14040:2006 (along with ISO 14044) provides the international guidelines, methodology, and framework for performing LCA studies.'
    },
    {
      subject_slug: 'life-cycle-assessment',
      topic: 'System Boundaries',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'An LCA study assessing a polymer product from monomer raw material extraction up to the factory gate before distribution is known as:',
      options: [
        'A) Cradle-to-Grave',
        'B) Cradle-to-Gate',
        'C) Gate-to-Grave',
        'D) Cradle-to-Cradle'
      ],
      correct_answer: 'B',
      explanation: 'Cradle-to-gate covers all upstream environmental impacts from resource extraction through raw material synthesis and manufacture up to the plant gate.'
    },
    {
      subject_slug: 'life-cycle-assessment',
      topic: 'Functional Unit',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'Why is establishing a clearly defined "Functional Unit" critical when comparing the environmental footprint of PET vs Glass bottles in an LCA?',
      options: [
        'A) To fix the monetary market value of the products',
        'B) To provide a standardized reference unit of service delivered (e.g. delivering 1000 Liters of beverage)',
        'C) To bypass the impact assessment phase',
        'D) To ensure both materials have identical weight'
      ],
      correct_answer: 'B',
      explanation: 'The functional unit provides a normalized reference basis so that alternative systems performing the identical service can be fairly compared.'
    },
    {
      subject_slug: 'life-cycle-assessment',
      topic: 'Global Warming Potential (GWP)',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'In Life Cycle Impact Assessment, what is the reference compound against which Global Warming Potential (GWP 100-year) is calculated with a factor of 1.0?',
      options: [
        'A) Methane (CH4)',
        'B) Carbon Dioxide (CO2)',
        'C) Nitrous Oxide (N2O)',
        'D) Sulfur Hexafluoride (SF6)'
      ],
      correct_answer: 'B',
      explanation: 'GWP expresses greenhouse gas emissions in terms of equivalent masses of CO2 (kg CO2-eq).'
    },
    {
      subject_slug: 'life-cycle-assessment',
      topic: 'End-of-Life Allocation',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'Under the Circular Footprint Formula (CFF) in EU PEF guidelines, how are environmental credits for recycled polymer content allocated between virgin producers and end-of-life recyclers?',
      options: [
        'A) 100% credit always assigned to the waste producer',
        'B) By using a market factor \'A\' that balances supply and demand for recycled materials',
        'C) By ignoring open-loop recycling completely',
        'D) By assuming infinite recycling loops with zero energy consumption'
      ],
      correct_answer: 'B',
      explanation: 'The CFF introduces a allocation factor A (typically 0.2 to 0.8) reflecting the market reality of whether recycling is constrained by scrap supply or recycled material demand.'
    },

    // 4. Color Science & Masterbatches
    {
      subject_slug: 'color-science-masterbatches',
      topic: 'CIE L*a*b* Color Space',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'In the standard CIE L*a*b* color coordinate system used for plastic colorimetry, what do negative values along the b* axis represent?',
      options: [
        'A) Redness',
        'B) Blueness',
        'C) Yellowness',
        'D) Darkness / Low Lightness'
      ],
      correct_answer: 'B',
      explanation: 'In CIE L*a*b*, L* measures Lightness (0=Black, 100=White), a* goes from -Green to +Red, and b* goes from -Blue to +Yellow.'
    },
    {
      subject_slug: 'color-science-masterbatches',
      topic: 'Color Difference Equation',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 2,
      question: 'What is the formula used to calculate total color difference (ΔE*) between a plastic color standard and a production sample in CIE 1976?',
      options: [
        'A) ΔE* = ΔL* + Δa* + Δb*',
        'B) ΔE* = √[ (ΔL*)² + (Δa*)² + (Δb*)² ]',
        'C) ΔE* = (ΔL* × Δa*) / Δb*',
        'D) ΔE* = ΔL* - (Δa* + Δb*)'
      ],
      correct_answer: 'B',
      explanation: 'CIE ΔE* represents Euclidean geometric distance in three-dimensional L*a*b* color space: ΔE* = √[(ΔL*)² + (Δa*)² + (Δb*)²].'
    },
    {
      subject_slug: 'color-science-masterbatches',
      topic: 'Metamerism',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'What phenomenon occurs when two plastic color plaques match perfectly under daylight (D65) but show an obvious color discrepancy under incandescent store lighting (Illuminant A)?',
      options: [
        'A) Photochromism',
        'B) Metamerism',
        'C) Fluorescence',
        'D) Splay'
      ],
      correct_answer: 'B',
      explanation: 'Metamerism is the phenomenon where two specimens have different spectral reflectance curves but produce identical color sensations under one specific illuminant and differ under others.'
    },
    {
      subject_slug: 'color-science-masterbatches',
      topic: 'Pigments vs Dyes',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'Why are organic and inorganic pigments preferred over soluble dyes for coloring semicrystalline thermoplastics like HDPE and Polypropylene?',
      options: [
        'A) Dyes are completely insoluble in all liquids',
        'B) Dyes tend to migrate, bleed, and sublime out of semicrystalline matrices due to lack of specific chemical bonding',
        'C) Pigments reduce tensile strength by 90%',
        'D) Dyes have higher thermal stability up to 400°C'
      ],
      correct_answer: 'B',
      explanation: 'Soluble dyes easily migrate (bleed/plate-out) to the surface of non-polar polyolefins. Particulate insoluble pigments, when properly dispersed, remain locked in place.'
    },
    {
      subject_slug: 'color-science-masterbatches',
      topic: 'Carrier Resin Selection',
      difficulty: 'hard',
      is_gate_relevant: false,
      marks: 2,
      question: 'When manufacturing a universal masterbatch intended for engineering polymers like PC and ABS, why must the carrier resin have a higher Melt Flow Rate (MFR) than the base moulding polymer?',
      options: [
        'A) To accelerate screw wear inside the barrel',
        'B) To melt rapidly and disperse pigment particles evenly before the base polymer achieves full shear homogenization',
        'C) To increase the cycle time of the moulding cycle',
        'D) To lower the flash point of the masterbatch'
      ],
      correct_answer: 'B',
      explanation: 'A higher MFR (lower viscosity) carrier resin melts early during plastification, distributing the concentrated pigment/additive package homogeneously into the host matrix without localized streaks.'
    },

    // 5. Polymer Rheology
    {
      subject_slug: 'polymer-rheology',
      topic: 'Non-Newtonian Flow & Shear Thinning',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'Most polymer melts exhibit pseudoplastic behavior during high-speed injection moulding. How does melt viscosity change as shear rate increases?',
      options: [
        'A) Viscosity increases linearly (Shear Thickening / Dilatant)',
        'B) Viscosity remains strictly constant (Newtonian)',
        'C) Viscosity decreases significantly (Shear Thinning)',
        'D) Viscosity drops instantaneously to zero'
      ],
      correct_answer: 'C',
      explanation: 'Under increasing shear rate, entangled random coil polymer chains untangle, stretch, and align parallel to the flow streamlines, decreasing flow resistance and viscosity (shear thinning).'
    },
    {
      subject_slug: 'polymer-rheology',
      topic: 'Power Law Model',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 2,
      question: 'In the Ostwald-de Waele Power Law equation τ = K(γ̇)ⁿ, what is the value of the flow behavior index \'n\' for a pseudoplastic (shear-thinning) polymer melt?',
      options: [
        'A) n > 1',
        'B) n = 1',
        'C) n < 1',
        'D) n = 0'
      ],
      correct_answer: 'C',
      explanation: 'For pseudoplastic (shear-thinning) fluids, 0 < n < 1. When n = 1, the fluid is Newtonian. When n > 1, the fluid is dilatant (shear thickening).'
    },
    {
      subject_slug: 'polymer-rheology',
      topic: 'Extrudate Swell (Die Swell)',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'Die swell (Barus effect) in polymer extrusion occurs primarily because of which fundamental polymer characteristic?',
      options: [
        'A) Elastic recovery of oriented and stretched polymer chains upon exiting the die constraint',
        'B) Rapid thermal expansion upon cooling',
        'C) Chemical crosslinking in atmospheric air',
        'D) High vapor pressure of volatile additives'
      ],
      correct_answer: 'A',
      explanation: 'Die swell is a direct manifestation of viscoelasticity: polymer chains are extended and oriented under shear in the die, and upon exiting the wall constraint, stored elastic energy causes radial recoil and expansion.'
    },
    {
      subject_slug: 'polymer-rheology',
      topic: 'WLF Equation & Time-Temperature Superposition',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'The Williams-Landel-Ferry (WLF) equation is valid for predicting the temperature dependence of polymer melt viscosity in which temperature range?',
      options: [
        'A) Between Absolute Zero and Tg',
        'B) From Tg up to approximately Tg + 100°C',
        'C) Above Tg + 150°C where Arrhenius equation takes over',
        'D) Only at the crystalline melting temperature Tm'
      ],
      correct_answer: 'B',
      explanation: 'The WLF equation accurately models fractional free volume expansion from Tg up to roughly Tg + 100°C. Above Tg + 100°C, the temperature dependence transitions to Arrhenius-type behavior.'
    },
    {
      subject_slug: 'polymer-rheology',
      topic: 'Dynamic Mechanical Analysis (DMA)',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'In oscillatory shear rheology, what does the Loss Factor tan(δ) represent?',
      options: [
        'A) Storage Modulus G\' divided by Loss Modulus G\'\'',
        'B) The ratio of viscous energy dissipated to elastic energy stored (G\'\' / G\')',
        'C) Zero-shear viscosity times molecular weight',
        'D) Total shear stress divided by shear strain rate'
      ],
      correct_answer: 'B',
      explanation: 'The loss factor tan(δ) = G\'\' / G\' is the damping factor, representing the relative dissipation of energy through viscous flow compared to energy stored elastically during cyclic deformation.'
    },

    // 6. Polymer Nanotechnology
    {
      subject_slug: 'polymer-nanotechnology',
      topic: 'Carbon Nanotubes (CNTs)',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'What is the percolation threshold in conductive polymer nanocomposites?',
      options: [
        'A) The temperature at which nanofillers decompose',
        'B) The critical volume fraction of conductive filler where a continuous conductive network forms, causing electrical conductivity to surge by orders of magnitude',
        'C) The maximum possible filler loading before melt fracture',
        'D) The speed of ultrasonic dispersion'
      ],
      correct_answer: 'B',
      explanation: 'The percolation threshold is the critical filler loading where individual nanoparticles touch or come close enough (quantum tunnelling) to form an interconnected conductive pathway throughout the insulating polymer matrix.'
    },
    {
      subject_slug: 'polymer-nanotechnology',
      topic: 'Layered Silicates & Nanoclays',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 2,
      question: 'In polymer-montmorillonite nanoclay composites, which state of dispersion provides the maximum enhancement in gas barrier and mechanical modulus?',
      options: [
        'A) Phase-separated micro-composite (immiscible agglomerates)',
        'B) Intercalated morphology',
        'C) Fully Exfoliated (delaminated) morphology',
        'D) Sintered aggregates'
      ],
      correct_answer: 'C',
      explanation: 'In an exfoliated morphology, individual ~1 nm thick silicate platelet sheets are completely delaminated and uniformly dispersed throughout the continuous polymer matrix, maximizing aspect ratio and creating a tortuous diffusion path.'
    },
    {
      subject_slug: 'polymer-nanotechnology',
      topic: 'Graphene Nanoplatelets',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'Why does adding 1–2 wt% graphene nanoplatelets drastically reduce the gas permeability of polymer films?',
      options: [
        'A) Graphene dissolves completely in the polymer',
        'B) High aspect ratio 2D sheets create a highly tortuous diffusion pathway that gas molecules must navigate around',
        'C) Graphene reacts chemically with permeating oxygen gas',
        'D) Graphene converts the polymer from crystalline to amorphous'
      ],
      correct_answer: 'B',
      explanation: 'According to Nielsen\'s tortuosity model, impenetrable 2D platelets force diffusing permeant molecules to take an elongated, winding path through the thickness of the film.'
    },
    {
      subject_slug: 'polymer-nanotechnology',
      topic: 'Halloysite Nanotubes (HNTs)',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'What unique geometrical structure distinguishes Halloysite Nanotubes (HNTs) from flat montmorillonite clays?',
      options: [
        'A) Spherical hollow buckyball geometry',
        'B) Naturally occurring hollow tubular aluminosilicate geometry with different chemistries on inner and outer surfaces',
        'C) Single-atom carbon planar ring structure',
        'D) Solid cubic crystal structure'
      ],
      correct_answer: 'B',
      explanation: 'Halloysite is a natural clay that curls into cylindrical hollow tubes (10-15 nm lumen, 1-2 μm length) with an outer silica surface and inner alumina lumen, allowing selective chemical functionalization.'
    },
    {
      subject_slug: 'polymer-nanotechnology',
      topic: 'Electrospinning',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'In electrospinning of polymer nanofibers, what is the conical fluid droplet formed at the spinneret tip under high electrostatic voltage called?',
      options: [
        'A) Hagen-Poiseuille meniscus',
        'B) Taylor Cone',
        'C) Rayleigh Instability jet',
        'D) Marangoni vortex'
      ],
      correct_answer: 'B',
      explanation: 'When electrostatic repulsive forces overcome the surface tension of a pendant polymer solution droplet, it deforms into a conical geometry known as a Taylor Cone before ejecting a continuous fine nanofiber jet.'
    },

    // 7. Bioprocessing & Fermentation
    {
      subject_slug: 'bioprocessing-fermentation',
      topic: 'Polyhydroxyalkanoates (PHA)',
      difficulty: 'easy',
      is_gate_relevant: true,
      marks: 1,
      question: 'How do bacteria like Cupriavidus necator synthesize Polyhydroxybutyrate (PHB) in industrial bioprocesses?',
      options: [
        'A) As an extracellular enzyme for digesting plastic waste',
        'B) As an intracellular energy and carbon storage inclusion body under nutrient limitation (e.g. nitrogen/phosphorus starvation) with excess carbon',
        'C) As part of the bacterial peptidoglycan cell wall',
        'D) By photolytic oxidation of chlorophyll'
      ],
      correct_answer: 'B',
      explanation: 'PHAs are accumulated inside bacterial cytoplasm as intracellular carbon and energy reserve granules when an essential nutrient (like N, P, or O2) is limited in the presence of an abundant carbon substrate.'
    },
    {
      subject_slug: 'bioprocessing-fermentation',
      topic: 'Lactic Acid Fermentation',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'Which microbial pathway is primarily used in industrial fermentation of glucose/sucrose to produce pure L-lactic acid for PLA synthesis?',
      options: [
        'A) Homolactic fermentation by Lactobacillus or Bacillus species',
        'B) Heterolactic fermentation producing ethanol and acetic acid',
        'C) Methanogenic anaerobic digestion',
        'D) Alcoholic yeast fermentation'
      ],
      correct_answer: 'A',
      explanation: 'Homolactic fermentation yields >90% L-lactic acid with minimal by-products, ensuring high optical purity (L-enantiomer) essential for producing high-melting semi-crystalline PLLA.'
    },
    {
      subject_slug: 'bioprocessing-fermentation',
      topic: 'Bio-based Monomers',
      difficulty: 'medium',
      is_gate_relevant: true,
      marks: 1,
      question: 'Bio-based 1,3-Propanediol (Bio-PDO), fermented from industrial corn sugar using engineered E. coli, is used to polymerize which commercial polyester?',
      options: [
        'A) Polyethylene Terephthalate (PET)',
        'B) Polytrimethylene Terephthalate (PTT / Sorona®)',
        'C) Polyvinyl Chloride (PVC)',
        'D) Polycarbonate (PC)'
      ],
      correct_answer: 'B',
      explanation: 'Polytrimethylene Terephthalate (PTT) is polymerized from purified terephthalic acid (PTA) and bio-based 1,3-propanediol (Bio-PDO).'
    },
    {
      subject_slug: 'bioprocessing-fermentation',
      topic: 'Enzymatic Recycling',
      difficulty: 'hard',
      is_gate_relevant: true,
      marks: 2,
      question: 'The engineered enzyme LCC (Leaf-Branch Compost Cutinase) and IsPETase depolymerize post-consumer PET bottles into which original constituent monomers?',
      options: [
        'A) Ethylene and Benzene',
        'B) Terephthalic Acid (TPA) and Ethylene Glycol (EG)',
        'C) Lactic acid and Glycolic acid',
        'D) Adipic acid and Hexamethylenediamine'
      ],
      correct_answer: 'B',
      explanation: 'PETase cutinases catalyze the complete hydrolysis of PET ester linkages, yielding pure Terephthalic Acid (TPA) and Ethylene Glycol (EG) monomers that can be repolymerized into virgin-quality food-grade PET.'
    },
    {
      subject_slug: 'bioprocessing-fermentation',
      topic: 'Downstream Recovery',
      difficulty: 'hard',
      is_gate_relevant: false,
      marks: 2,
      question: 'What is a major downstream processing bottleneck in recovering intracellular PHA biopolymers from bacterial biomass at industrial scale?',
      options: [
        'A) PHA decomposes instantly upon exposure to air',
        'B) Cell lysis and solvent extraction require large volumes of halogenated solvents or costly enzymatic digestion of non-PHA cell mass',
        'C) PHA cannot be filtered or centrifuged',
        'D) PHA is toxic to all living organisms'
      ],
      correct_answer: 'B',
      explanation: 'Because PHA is accumulated intracellularly, harvesting requires breaking open the bacterial cell wall (lysis) and separating the polymer from proteins, lipids, and nucleic acids, which drives up production costs.'
    },

    // 8. Robotics in Plastics Manufacturing
    {
      subject_slug: 'robotics-plastics',
      topic: 'Automation Types',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'In standard injection moulding automation, what is the primary role of a pneumatic 3-axis sprue picker robot?',
      options: [
        'A) To plasticize resin in the hopper',
        'B) To grip, cut, and extract the cold runner/sprue from the open mould during each cycle and drop it into a beside-the-press granulator',
        'C) To mill the steel mould cavities',
        'D) To cool the mould with chilled water'
      ],
      correct_answer: 'B',
      explanation: 'Pneumatic sprue pickers rapidly enter the mould space upon clamp opening to strip the cold runner system, enabling continuous unattended cycle operation.'
    },
    {
      subject_slug: 'robotics-plastics',
      topic: 'In-Mould Labelling (IML)',
      difficulty: 'medium',
      is_gate_relevant: false,
      marks: 1,
      question: 'How do side-entry high-speed IML (In-Mould Labelling) robots hold the pre-printed polypropylene label securely against the core/cavity wall before resin injection?',
      options: [
        'A) Using liquid cyanoacrylate adhesive',
        'B) Using high-voltage electrostatic charging or vacuum suction ports in the mould cavity',
        'C) By mechanical clamping pins in the cosmetic part area',
        'D) Using magnetic attraction'
      ],
      correct_answer: 'B',
      explanation: 'IML robotic end-of-arm tooling electrostatically charges the PP label; when placed inside the grounded steel cavity, Coulombic attraction pins the label flush against the steel surface without adhesives.'
    },
    {
      subject_slug: 'robotics-plastics',
      topic: 'End-of-Arm Tooling (EOAT)',
      difficulty: 'medium',
      is_gate_relevant: false,
      marks: 1,
      question: 'What type of gripping mechanism is standard on EOAT for removing optical-grade or high-gloss cosmetic automotive interior parts without scratch marks?',
      options: [
        'A) Serrated steel mechanical jaws',
        'B) Silicone or polyurethane vacuum suction cups (Bernoulli grippers)',
        'C) Magnetic chucks',
        'D) Hydraulic clamping vices'
      ],
      correct_answer: 'B',
      explanation: 'Soft non-marking vacuum suction cups distribute grasping pressure gently, ensuring Class-A cosmetic surfaces remain defect and scratch-free.'
    },
    {
      subject_slug: 'robotics-plastics',
      topic: 'Safety Standards & Interlocks',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'Which standardized electrical interface protocol is globally used to connect an injection moulding machine (IMM) with an automated parts removal robot?',
      options: [
        'A) USB 3.0',
        'B) Euromap 67 / SPI Robot Interface',
        'C) HDMI 2.1',
        'D) Bluetooth 5.0'
      ],
      correct_answer: 'B',
      explanation: 'Euromap 67 (and predecessor Euromap 12 / ANSI SPI) defines the standard electrical safety interlock protocol ensuring the mould does not close while the robot arm is inside the clamping area.'
    },
    {
      subject_slug: 'robotics-plastics',
      topic: 'Automated Insert Moulding',
      difficulty: 'hard',
      is_gate_relevant: false,
      marks: 2,
      question: 'In automated insert moulding of electrical connectors with brass pins, what sensory system is commonly integrated with the robot to ensure all metal inserts are present and correctly oriented before clamp closure?',
      options: [
        'A) Machine Vision Inspection Systems (Industrial 2D/3D Cameras)',
        'B) Pyrometer',
        'C) Thermocouple',
        'D) Melt Flow Indexer'
      ],
      correct_answer: 'A',
      explanation: 'High-speed industrial machine vision cameras inspect and verify the presence, depth, and orientation of each metal insert within milliseconds before triggering mould close, preventing costly tool crashes.'
    },

    // 9. Digital Twins in Polymer Manufacturing
    {
      subject_slug: 'digital-twins-plastics',
      topic: 'Cavity Pressure Sensing',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'Why is in-cavity piezoelectric pressure sensing considered the gold standard for real-time quality prediction in injection moulding Digital Twins?',
      options: [
        'A) It measures barrel heating electricity usage',
        'B) Cavity pressure is the direct fingerprint of melt viscosity, fill velocity, packing efficacy, and part weight inside the cavity',
        'C) It eliminates the need for any mould cooling',
        'D) It reduces the hydraulic pump power to zero'
      ],
      correct_answer: 'B',
      explanation: 'Unlike hydraulic machine signals which include machine mechanical losses, cavity pressure sensors measure exactly what the polymer melt experiences inside the cavity during filling, packing, and holding.'
    },
    {
      subject_slug: 'digital-twins-plastics',
      topic: 'Predictive Quality Algorithms',
      difficulty: 'medium',
      is_gate_relevant: false,
      marks: 2,
      question: 'In an injection moulding Digital Twin, how does a machine learning model detect batch-to-batch polymer raw material viscosity variations in real time?',
      options: [
        'A) By continuously calculating the integral of cavity pressure during the filling phase (pressure-time integral / viscosity index)',
        'B) By measuring the ambient humidity of the factory floor',
        'C) By measuring screw motor sound frequency',
        'D) By reading operator input shift logs'
      ],
      correct_answer: 'A',
      explanation: 'The viscosity index (integral of cavity pressure over the filling time) directly correlates with instantaneous melt viscosity. If a new resin batch has lower MFR, the pressure integral rises, prompting the controller to adapt injection speed.'
    },
    {
      subject_slug: 'digital-twins-plastics',
      topic: 'CAE Co-simulation',
      difficulty: 'medium',
      is_gate_relevant: false,
      marks: 1,
      question: 'How does a Digital Twin differ from a conventional static Moldflow or CAD simulation?',
      options: [
        'A) A Digital Twin is a static 2D drawing',
        'B) A Digital Twin maintains a continuous, live, bi-directional data connection with the physical machine, updating its virtual state in real-time',
        'C) Digital Twins only run on mainframe supercomputers without sensor data',
        'D) Digital Twins cannot predict warpage'
      ],
      correct_answer: 'B',
      explanation: 'A Digital Twin is a living digital replica that syncs with real-time sensor streams from the physical asset, allowing real-time parameter self-correction, predictive maintenance, and closed-loop optimization.'
    },
    {
      subject_slug: 'digital-twins-plastics',
      topic: 'OPC UA Architecture',
      difficulty: 'easy',
      is_gate_relevant: false,
      marks: 1,
      question: 'Which open industrial communication standard (defined by Euromap 77) enables seamless data exchange between injection moulding machines and Digital Twin cloud platforms?',
      options: [
        'A) OPC UA (Open Platform Communications Unified Architecture)',
        'B) RS-232 Dialup',
        'C) CAN-bus 1.0',
        'D) Zigbee'
      ],
      correct_answer: 'A',
      explanation: 'Euromap 77 specifies the standardized information model based on OPC UA for connecting injection moulding machines to MES and Digital Twin edge/cloud architectures.'
    },
    {
      subject_slug: 'digital-twins-plastics',
      topic: 'Predictive Maintenance',
      difficulty: 'hard',
      is_gate_relevant: false,
      marks: 2,
      question: 'In smart extrusion lines, a Digital Twin analyzes screw drive vibration spectra and motor torque fluctuations to predict what failure mode before catastrophic breakdown?',
      options: [
        'A) Screw flight and barrel liner abrasive wear or un-melted solid particle agglomerations',
        'B) Electrical power grid frequency changes',
        'C) Pellet color degradation',
        'D) Water chiller pump pipe scaling'
      ],
      correct_answer: 'A',
      explanation: 'Vibrational spectral analysis and torque harmonic anomalies indicate mechanical rubbing or solid-bed lockup between screw flights and barrel walls, alerting maintenance teams before catastrophic screw seizure.'
    }
  ];

  // Map subject_id onto each question
  const rowsToInsert = newQuestions.map((q, idx) => ({
    subject_id: subMap[q.subject_slug],
    lesson_id: null,
    question: q.question,
    type: 'mcq',
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    marks: q.marks,
    difficulty: q.difficulty,
    topic: q.topic,
    is_gate_relevant: q.is_gate_relevant,
    order_index: idx,
    is_active: true
  }));

  const { data, error } = await s.from('practice_questions').insert(rowsToInsert).select('id, subject_id');
  if (error) {
    console.error('  ❌ Error inserting practice questions:', error.message);
    return 0;
  }
  console.log(`  ✅ Successfully inserted ${data.length} new practice questions!`);
  return data.length;
}

async function main() {
  console.log('\n====================================');
  console.log('🛠️ FIXING DEEP DIVE 3 FINDINGS');
  console.log('====================================');

  await updateSubjectDescriptions();
  await seedMissingPracticeQuestions();

  console.log('\n✅ ALL DEEP DIVE 3 FIXES COMPLETE!\n');
}

main().catch(console.error);
