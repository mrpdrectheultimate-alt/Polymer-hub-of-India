// scripts/seed_processing_mastery.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CHAPTERS = {
  ch1: [
    '# Chapter 1: Injection Molding Optimization & Clamp Forces',
    '',
    '## 1. Introduction to Injection Molding',
    'Injection molding is the premier manufacturing process for producing high-volume, complex three-dimensional plastic parts. During the process, solid polymer pellets are fed from a hopper, melted inside a heated barrel via friction and heater bands, and then injected at high pressure into a cooled mold cavity. Once the melt solidifies, the mold opens, and the part is ejected.',
    '',
    '## 2. Clamp Force Calculations',
    'A critical design criteria is calculating the clamping force ($F_c$) required to keep the mold halves closed against the high cavity pressure ($P_c$) of the injected polymer. If the clamp force is insufficient, the mold halves will separate slightly, causing the polymer melt to escape, resulting in a defect known as **flash**.',
    '',
    'The standard equation to estimate clamp force is:',
    '$$F_c = P_c \\times A_{proj}$$',
    'Where:',
    '- $F_c$ is the clamping force in Newtons ($N$) or Tonnage ($1 \\text{ ton} \\approx 10 \\text{ kN}$).',
    '- $P_c$ is the average cavity pressure, typically ranging from $30$ to $80$ MPa depending on viscosity.',
    '- $A_{proj}$ is the total projected area of the part (and runners) onto the mold parting line plane.',
    '',
    '## 3. Worked Numerical Example',
    '**Problem:** Calculate the minimum clamping force in metric tons required to mold a rectangular PP plastic tray with dimensions $30$ cm $\\times$ $20$ cm. The average cavity pressure is estimated to be $40$ MPa.',
    '',
    '**Solution:**',
    '1. Calculate the projected area in square meters ($m^2$):',
    '   $$A_{proj} = 0.30 \\text{ m} \\times 0.20 \\text{ m} = 0.06 \\text{ m}^2$$',
    '2. Convert pressure to Pascals ($N/m^2$):',
    '   $$P_c = 40 \\text{ MPa} = 40 \\times 10^6 \\text{ N/m}^2$$',
    '3. Compute clamp force in Newtons:',
    '   $$F_c = P_c \\times A_{proj} = (40 \\times 10^6 \\text{ N/m}^2) \\times 0.06 \\text{ m}^2 = 2,400,000 \\text{ N} = 2,400 \\text{ kN}$$',
    '4. Convert Newtons to Metric Tons ($1 \\text{ Metric Ton} \\approx 9.81 \\text{ kN}$):',
    '   $$\\text{Tonnage} = \\frac{2400 \\text{ kN}}{9.81 \\text{ kN/ton}} \\approx 244.6 \\text{ Tons}$$',
    'Hence, a machine with a clamping capacity of at least $250$ tons must be selected.',
    '',
    '## 4. Indian Industry Context',
    'In production lines such as **Supreme Industries** or **Motherson Sumi**, calculating clamp forces precisely prevents mold wear and saves electrical energy by avoiding oversized machines.'
  ].join('\n'),

  ch2: [
    '# Chapter 2: Single and Twin Screw Extrusion Dynamics',
    '',
    '## 1. Single-Screw Extruder Mechanics',
    'Extrusion is a continuous process used to make profiles, sheets, pipes, and film. The output throughput ($Q$) of a single-screw extruder is a balance between the forward drag flow ($Q_d$) caused by the rotation of the screw against the barrel, and the backward pressure flow ($Q_p$) caused by the restriction of the die head at the exit.',
    '',
    'The overall output equation is:',
    '$$Q = Q_d - Q_p$$',
    'Where:',
    '- Drag flow: $Q_d = \\frac{1}{2} \\pi^2 D^2 N H \\sin\\phi \\cos\\phi$',
    '- Pressure flow: $Q_p = \\frac{\\pi D H^3 \\Delta P \\sin^2\\phi}{12 \\eta L}$',
    '',
    'Here, $D$ is screw diameter, $N$ is rotational speed, $H$ is channel depth, $\\phi$ is helix angle, $\\Delta P$ is pressure drop across the die, $\\eta$ is melt viscosity, and $L$ is screw metering zone length.',
    '',
    '## 2. Worked Numerical Example',
    '**Problem:** Given an extruder with a screw diameter $D = 50$ mm, metering depth $H = 2.5$ mm, screw speed $N = 100$ RPM, and helix angle $\\phi = 17.7^\\circ$. Assuming pressure flow $Q_p$ is negligible, calculate the maximum drag flow output $Q_d$ in cubic centimeters per second ($cm^3/s$).',
    '',
    '**Solution:**',
    '1. Convert dimensions to centimeters ($cm$):',
    '   - $D = 5.0 \\text{ cm}$',
    '   - $H = 0.25 \\text{ cm}$',
    '   - $N = 100 \\text{ RPM} = \\frac{100}{60} \\text{ rev/s} \\approx 1.67 \\text{ rev/s}$',
    '2. Apply the drag flow formula:',
    '   $$Q_d = \\frac{1}{2} \\pi^2 D^2 N H \\sin\\phi \\cos\\phi$$',
    '   $$Q_d = 0.5 \\times 9.87 \\times (5.0)^2 \\times 1.67 \\times 0.25 \\times \\sin(17.7^\\circ) \\times \\cos(17.7^\\circ)$$',
    '   - $\\sin(17.7^\\circ) \\approx 0.304$',
    '   - $\\cos(17.7^\\circ) \\approx 0.953$',
    '   $$Q_d \\approx 0.5 \\times 9.87 \\times 25 \\times 1.67 \\times 0.25 \\times 0.304 \\times 0.953$$',
    '   $$Q_d \\approx 51.5 \\times 0.2897 \\approx 14.9 \\text{ cm}^3/\\text{s}$$',
    'Thus, the drag flow capacity is approximately $14.9$ $cm^3/s$ (or roughly $40$ kg/hr depending on polymer density).',
    '',
    '## 3. Co-Rotating Twin-Screw Extruders',
    'Twin-screw extruders feature two intermeshing screws side-by-side inside a figure-8 barrel. They operate as positive displacement pump zones and are favored for compounding resins with additives because of high shear mixing fields.'
  ].join('\n'),

  ch3: [
    '# Chapter 3: Blow Molding Parison Swell Mechanics',
    '',
    '## 1. Parison Formation and Extrusion Swell',
    'In Extrusion Blow Molding (EBM), a molten polymer tube called a **parison** is extruded downward from an annular die head. Once the parison reaches the target length, a split mold closes around it, pinching the bottom. Compressed air is then injected into the tube, inflating the parison outward to take the shape of the cooled mold cavity.',
    '',
    'As the parison exits the die, it experiences diameter swell ($B_D$) and thickness swell ($B_t$) due to elastic memory recovery of polymer chains:',
    '$$B_D = \\frac{D_{\\text{parison}}}{D_{\\text{die}}}$$',
    '$$B_t = \\frac{t_{\\text{parison}}}{t_{\\text{die}}}$$',
    '',
    '## 2. Worked Numerical Example',
    '**Problem:** An HDPE parison is extruded from a die with an outer diameter $D_{\\text{die}} = 25$ mm. The polymer has an elastic diameter swell ratio $B_D = 1.35$. Calculate the diameter of the inflated parison before mold clamping.',
    '',
    '**Solution:**',
    '1. Apply the swell ratio formula:',
    '   $$D_{\\text{parison}} = B_D \\times D_{\\text{die}}$$',
    '   $$D_{\\text{parison}} = 1.35 \\times 25 \\text{ mm} = 33.75 \\text{ mm}$$',
    'The diameter of the parison is $33.75$ mm, which will easily clear the mouth of the target container mold cavity.',
    '',
    '## 3. Industrial Relevance',
    'Managing parison swell is critical when manufacturing plastic containers (like those made by **CIPET** research centers or commercial blow molders) to prevent wall-thinning defects at bottle corners.'
  ].join('\n'),

  ch4: [
    '# Chapter 4: Thermoforming & Vacuum Draw Ratios',
    '',
    '## 1. Thermoforming Process Principles',
    'Thermoforming involves heating a flat plastic sheet to its softening temperature (above Tg for amorphous, near Tm for semi-crystalline) and then forcing it against a mold contour using vacuum pressure or plug-assist forces.',
    '',
    '## 2. Areal Draw Ratio (ADR)',
    'A key metric is the Areal Draw Ratio (ADR), which helps engineers estimate the average wall thickness ($t_{avg}$) of the finished part from the initial sheet thickness ($t_{initial}$):',
    '$$\\text{ADR} = \\frac{A_{\\text{part}}}{A_{\\text{sheet}}}$$',
    '$$t_{avg} = \\frac{t_{initial}}{\\text{ADR}}$$',
    '',
    '## 3. Worked Numerical Example',
    '**Problem:** A flat PMMA square sheet of area $400 \\text{ cm}^2$ and thickness $3$ mm is thermoformed into a hemispherical bowl with surface area $628 \\text{ cm}^2$. Estimate the average thickness of the thermoformed bowl.',
    '',
    '**Solution:**',
    '1. Calculate the Areal Draw Ratio (ADR):',
    '   $$\\text{ADR} = \\frac{628 \\text{ cm}^2}{400 \\text{ cm}^2} = 1.57$$',
    '2. Compute the average wall thickness:',
    '   $$t_{avg} = \\frac{t_{initial}}{\\text{ADR}} = \\frac{3.0 \\text{ mm}}{1.57} \\approx 1.91 \\text{ mm}$$',
    'Hence, the average final thickness is $1.91$ mm.'
  ].join('\n'),

  ch5: [
    '# Chapter 5: Mold Cooling and Gating Systems',
    '',
    '## 1. Heat Transfer in Injection Molds',
    'More than $70\\%$ of the injection molding cycle is spent cooling the polymer part so it can solidify enough to resist ejection stresses. Effective mold cooling design utilizes turbulent water flow inside internal channels to maximize heat convection.',
    '',
    '## 2. Reynolds Number ($Re$) for Cooling Channels',
    'To guarantee turbulent flow, the Reynolds Number ($Re$) must exceed $4000$ (ideally $Re > 10,000$):',
    '$$Re = \\frac{\\rho \\cdot v \\cdot d}{\\mu}$$',
    'Where $\\rho$ is water density, $v$ is flow velocity, $d$ is cooling channel diameter, and $\\mu$ is dynamic viscosity of water.',
    '',
    '## 3. Worked Numerical Example',
    '**Problem:** Calculate the water flow velocity needed to achieve turbulent flow ($Re = 4000$) in a mold cooling channel of diameter $d = 10$ mm. Assume water density $\\rho = 1000 \\text{ kg/m}^3$ and dynamic viscosity $\\mu = 1.0 \\times 10^{-3} \\text{ Pa}\\cdot\\text{s}$.',
    '',
    '**Solution:**',
    '1. Rearrange the Reynolds formula for velocity ($v$):',
    '   $$v = \\frac{Re \\cdot \\mu}{\\rho \\cdot d}$$',
    '2. Insert values:',
    '   $$v = \\frac{4000 \\times (1.0 \\times 10^{-3} \\text{ Pa}\\cdot\\text{s})}{1000 \\text{ kg/m}^3 \\times 0.01 \\text{ m}}$$',
    '   $$v = \\frac{4.0}{10} = 0.4 \\text{ m/s}$$',
    'Thus, a water speed of at least $0.4$ m/s is required.'
  ].join('\n'),

  ch6: [
    '# Chapter 6: Fault Troubleshooting & Defects Mitigation',
    '',
    '## 1. Weld Lines and Meltdowns',
    'Weld lines (knit lines) occur where two separate flow fronts meet. The mechanical strength at the weld line is significantly lower because polymer chains across the interface do not fully interdiffuse before solidification. To mitigate this, process engineers increase melt temperature or raise packing pressures.',
    '',
    '## 2. Sink Marks',
    'Sink marks are shallow depressions on the outer surface of thick molded sections. They occur because the core cools slower than the frozen skin, causing local volumetric contraction that pulls the skin inward. Minimizing sink marks involves reducing nominal wall thicknesses and designing ribs with a thickness of $50-60\\%$ of the adjoining main wall.'
  ].join('\n'),

  ch7: [
    '# Chapter 7: Circular Economy & Polymer Recycling',
    '',
    '## 1. Mechanical Recycling Steps',
    'Mechanical recycling involves sorting, washing, shredding, and compounding post-consumer plastic waste into pellets. Sorting by polymer class (PET, HDPE, PP, LDPE) is critical because blends of incompatible plastics exhibit poor mechanical performance due to high interfacial tension.',
    '',
    '## 2. Chemical Upcycling',
    'Chemical recycling breaks polymer backbones down to their raw monomers (depolymerization) via pyrolysis or solvolysis. This allows purification and repolymerization into virgin-grade resins, supporting circular packaging moats.'
  ].join('\n'),

  ch8: [
    '# Chapter 8: Rotational Molding & Sintering Kinetics',
    '',
    '## 1. Rotational Molding Principles',
    'Rotational molding (Rotomolding) is a zero-pressure casting process used to manufacture large, hollow plastic parts like water storage tanks. Fine polymer powder is loaded into a mold cavity, which is heated while biaxially rotating (spinning on two axes) inside an oven. The powder melts and coats the inner walls.',
    '',
    '## 2. Sintering Kinetics',
    'Sintering is the fusion of polymer powder particles under heat without application of pressure. Zero-shear viscosity ($\\eta_0$) of the polymer must be low enough to permit fusion, while maintaining melt strength to prevent sagging.'
  ].join('\n'),

  ch9: [
    '# Chapter 9: Safety & Automation in Plastics Plants',
    '',
    '## 1. Automated Part Demolding',
    'Modern plastics manufacturing plants employ high-speed Cartesian or 6-axis robotic arms mounted above injection molding machines. These robots automatically demold parts, clip hot runners, and place components onto conveying lines, improving plant safety.',
    '',
    '## 2. OSHA Safety Standards',
    'Lock-out/tag-out (LOTO) protocols must be strictly followed when maintaining mold systems or extruder screws to prevent crush injuries from clamping units.'
  ].join('\n'),

  ch10: [
    '# Chapter 10: Environmental LCA of Processing Lines',
    '',
    '## 1. Life Cycle Assessment (LCA) Metrics',
    'Every manufacturing line consumes electricity, heating, and cooling water. Conducting a Life Cycle Assessment (LCA) measures the carbon footprint of converting 1 kg of raw polymer resin into finished products.',
    '',
    '## 2. Carbon Footprint Mitigation',
    'Replacing electrical heating bands with electromagnetic induction heating loops reduce energy consumption in extruder barrels by up to $35\\%$, lowering greenhouse gas emissions.'
  ].join('\n')
};

async function seedMasteryBook() {
  console.log('📖 Seeding "Plastics Processing Mastery" original guide book...');
  
  const bookData = {
    slug: 'plastics-processing-mastery',
    title: 'Plastics Processing Mastery',
    authors: 'PolymerHub Editorial Board',
    cover_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60', // Industrial tooling theme
    category: 'original_guide',
    difficulty: 'Intermediate',
    focus: 'Injection molding optimization, extrusion dynamics, blow molding configurations, thermoforming, and circular economy plastics recycling.',
    summary: 'A comprehensive, calculations-grounded engineering guide covering single-screw throughput equations, injection molding clamp forces, parison swells, and polymer recycling.',
    careers: ['Process Engineer', 'Mould Designer', 'Production Executive'],
    subject_slugs: ['polymer-processing', 'robotics-plastics'],
    toc: [
      { id: 'ch1', title: 'Chapter 1: Injection Molding Optimization & Clamp Forces' },
      { id: 'ch2', title: 'Chapter 2: Single and Twin Screw Extrusion Dynamics' },
      { id: 'ch3', title: 'Chapter 3: Blow Molding Parison Swell Mechanics' },
      { id: 'ch4', title: 'Chapter 4: Thermoforming & Vacuum Draw Ratios' },
      { id: 'ch5', title: 'Chapter 5: Mold Cooling and Gating Systems' },
      { id: 'ch6', title: 'Chapter 6: Fault Troubleshooting & Defects Mitigation' },
      { id: 'ch7', title: 'Chapter 7: Circular Economy & Polymer Recycling' },
      { id: 'ch8', title: 'Chapter 8: Rotational Molding & Sintering Kinetics' },
      { id: 'ch9', title: 'Chapter 9: Safety & Automation in Plastics Plants' },
      { id: 'ch10', title: 'Chapter 10: Environmental LCA of Processing Lines' }
    ],
    chapters: CHAPTERS
  };

  const { data, error } = await supabase
    .from('library_books')
    .upsert(bookData, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('❌ Failed to seed textbook:', error.message);
  } else {
    console.log('✅ Successfully seeded "Plastics Processing Mastery" original guide book!');
    console.log('Book ID:', data[0].id);
  }
}

seedMasteryBook();
