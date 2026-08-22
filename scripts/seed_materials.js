// scripts/seed_materials.js — Seeds the `materials` table with 51 polymers across all 8 families
// Column types (from migration 20260725000004):
//   type: 'commodity' | 'engineering' | 'specialty' | 'elastomer' | 'bioplastic'
//   density, tensile_strength, flexural_modulus, melt_temp,
//   heat_deflection_temp, water_absorption, shrinkage  → all NUMERIC
//   top_applications, indian_trade_names → TEXT[]

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: generate a URL-safe slug
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const materials = [
  // ── POLYOLEFIN — type: 'commodity' ────────────────────────────────────────
  {
    name: 'HDPE (High-Density Polyethylene)', family: 'Polyolefin', type: 'commodity',
    density: 0.95, melt_temp: 132, tensile_strength: 27, flexural_modulus: 900,
    heat_deflection_temp: 75, water_absorption: 0.01, shrinkage: 1.5,
    top_applications: ['Water pipes & tanks', 'Milk crates & pallets', 'HDPE geomembranes', 'Blow-moulded jerry cans'],
    indian_trade_names: ['Reliance HDPE', 'GAIL Dhruv', 'HPCL-Mittal Lupolen', 'SCG Chemicals'],
    is_premium: false,
  },
  {
    name: 'LDPE (Low-Density Polyethylene)', family: 'Polyolefin', type: 'commodity',
    density: 0.922, melt_temp: 110, tensile_strength: 14, flexural_modulus: 200,
    heat_deflection_temp: 42, water_absorption: 0.01, shrinkage: 1.5,
    top_applications: ['Carry bags & wraps', 'Squeezable bottles', 'Agricultural mulch films', 'Cable insulation'],
    indian_trade_names: ['Reliance LDPE', 'GAIL Indane', 'Borealis FT5230', 'LyondellBasell'],
    is_premium: false,
  },
  {
    name: 'LLDPE (Linear Low-Density Polyethylene)', family: 'Polyolefin', type: 'commodity',
    density: 0.918, melt_temp: 125, tensile_strength: 20, flexural_modulus: 400,
    heat_deflection_temp: 55, water_absorption: 0.01, shrinkage: 1.6,
    top_applications: ['Stretch wrap films', 'Heavy-duty sacks', 'Silage bale wrap', 'Rotomoulding tanks'],
    indian_trade_names: ['Reliance LLDPE', 'Dow LLDPE', 'Exxon LL-1001', 'Borealis LLDPE'],
    is_premium: false,
  },
  {
    name: 'PP Homopolymer (Polypropylene)', family: 'Polyolefin', type: 'commodity',
    density: 0.905, melt_temp: 163, tensile_strength: 36, flexural_modulus: 1400,
    heat_deflection_temp: 95, water_absorption: 0.02, shrinkage: 1.6,
    top_applications: ['Woven sacks & raffia', 'Automotive trim', 'Caps & closures', 'Medical syringes'],
    indian_trade_names: ['Reliance PP', 'HPCL-Mittal Moplen', 'GAIL Koylene', 'SCG PP1102K3'],
    is_premium: false,
  },
  {
    name: 'PP Copolymer (Impact Modified)', family: 'Polyolefin', type: 'commodity',
    density: 0.90, melt_temp: 160, tensile_strength: 26, flexural_modulus: 900,
    heat_deflection_temp: 75, water_absorption: 0.02, shrinkage: 1.8,
    top_applications: ['Automotive bumpers', 'Appliance housings', 'Storage containers', 'Crates'],
    indian_trade_names: ['Reliance PP CP', 'Formosa PP', 'LyondellBasell Adstif', 'Borealis BC918CF'],
    is_premium: false,
  },
  {
    name: 'UHMWPE (Ultra-High MW Polyethylene)', family: 'Polyolefin', type: 'specialty',
    density: 0.935, melt_temp: 133, tensile_strength: 40, flexural_modulus: 700,
    heat_deflection_temp: 82, water_absorption: 0.01, shrinkage: 2.0,
    top_applications: ['Bulletproof panels (Dyneema)', 'Orthopaedic implants', 'Conveyor liners', 'Cutting boards'],
    indian_trade_names: ['Celanese GUR', 'Ticona Hostalen', 'DSM Dyneema', 'Braskem UHMWPE'],
    is_premium: true,
  },
  {
    name: 'EVA (Ethylene-Vinyl Acetate)', family: 'Polyolefin', type: 'commodity',
    density: 0.94, melt_temp: 85, tensile_strength: 14, flexural_modulus: 30,
    heat_deflection_temp: 40, water_absorption: 0.1, shrinkage: 1.0,
    top_applications: ['Shoe sole foam (midsoles)', 'Hot-melt adhesives', 'Solar panel encapsulant', 'Foam toys'],
    indian_trade_names: ['Braskem EVA', 'Hanwha EVA', 'LG EVA EA28150', 'DuPont Elvax'],
    is_premium: false,
  },
  {
    name: 'mPP (Metallocene Polypropylene)', family: 'Polyolefin', type: 'specialty',
    density: 0.90, melt_temp: 152, tensile_strength: 32, flexural_modulus: 1200,
    heat_deflection_temp: 88, water_absorption: 0.02, shrinkage: 1.5,
    top_applications: ['BOPP film', 'Medical packaging', 'Fibre spinning', 'Soft-touch parts'],
    indian_trade_names: ['ExxonMobil Achieve', 'Total Lumicene', 'LyondellBasell Metocene', 'Borealis Bormod'],
    is_premium: true,
  },

  // ── VINYL — type: 'commodity' / 'specialty' ───────────────────────────────
  {
    name: 'uPVC (Unplasticised PVC)', family: 'Vinyl', type: 'commodity',
    density: 1.42, melt_temp: 170, tensile_strength: 50, flexural_modulus: 2700,
    heat_deflection_temp: 74, water_absorption: 0.04, shrinkage: 0.4,
    top_applications: ['Water supply pipes (IS 4985)', 'Window profiles', 'Electrical conduit', 'Drainage systems'],
    indian_trade_names: ['Finolex uPVC', 'Astral Pipes', 'Prince Pipes', 'Ashirvad Pipes'],
    is_premium: false,
  },
  {
    name: 'Flexible PVC (FPVC)', family: 'Vinyl', type: 'commodity',
    density: 1.20, melt_temp: 165, tensile_strength: 17, flexural_modulus: 20,
    heat_deflection_temp: 55, water_absorption: 0.2, shrinkage: 1.5,
    top_applications: ['Cable & wire insulation', 'Medical tubing & blood bags', 'Artificial leather (rexine)', 'Garden hose'],
    indian_trade_names: ['Reliance FPVC', 'Supreme Industries', 'Kiran Global Chem', 'Aarti Industries'],
    is_premium: false,
  },
  {
    name: 'PVDC (Polyvinylidene Chloride)', family: 'Vinyl', type: 'specialty',
    density: 1.70, melt_temp: 166, tensile_strength: 40, flexural_modulus: 2500,
    heat_deflection_temp: 80, water_absorption: 0.1, shrinkage: 0.5,
    top_applications: ['Food barrier films (Saran wrap)', 'Meat packaging', 'Pharmaceutical blister packs', 'Coatings'],
    indian_trade_names: ['Dow Saran', 'Asahi Kasei Saran', 'Solvay Ixan', 'Billerud Saran'],
    is_premium: true,
  },
  {
    name: 'PVDF (Polyvinylidene Fluoride)', family: 'Vinyl', type: 'specialty',
    density: 1.78, melt_temp: 170, tensile_strength: 46, flexural_modulus: 2000,
    heat_deflection_temp: 95, water_absorption: 0.05, shrinkage: 2.5,
    top_applications: ['Chemical process piping', 'Piezoelectric sensors & films', 'Li-ion battery binders', 'Semiconductor tubing'],
    indian_trade_names: ['Arkema Kynar', 'Solvay Solef', 'Daikin Neoflon', '3M Dyneon THV'],
    is_premium: true,
  },
  {
    name: 'PVA (Polyvinyl Alcohol)', family: 'Vinyl', type: 'specialty',
    density: 1.19, melt_temp: 200, tensile_strength: 55, flexural_modulus: 3500,
    heat_deflection_temp: 80, water_absorption: 9.0, shrinkage: 1.0,
    top_applications: ['Water-soluble packaging', 'Paper coating (surface sizing)', 'Fibre for concrete reinforcement', 'Textile sizing agent'],
    indian_trade_names: ['Kuraray Mowiol', 'Sekisui Selvol', 'Chang Chun Mowicol', 'Nippon PVA'],
    is_premium: false,
  },
  {
    name: 'CPVC (Chlorinated PVC)', family: 'Vinyl', type: 'engineering',
    density: 1.56, melt_temp: 195, tensile_strength: 57, flexural_modulus: 3100,
    heat_deflection_temp: 100, water_absorption: 0.03, shrinkage: 0.3,
    top_applications: ['Hot water plumbing (IS 15778)', 'Industrial acid piping', 'Fire sprinkler systems', 'Chemical tanks'],
    indian_trade_names: ['Lubrizol FlowGuard', 'Finolex CPVC', 'Astral CPVC', 'Prince CPVC'],
    is_premium: false,
  },

  // ── STYRENIC — type: 'commodity' ──────────────────────────────────────────
  {
    name: 'GPPS (General Purpose Polystyrene)', family: 'Styrenic', type: 'commodity',
    density: 1.05, melt_temp: 210, tensile_strength: 42, flexural_modulus: 3200,
    heat_deflection_temp: 80, water_absorption: 0.05, shrinkage: 0.5,
    top_applications: ['CD cases & disposable cutlery', 'Petri dishes & lab ware', 'Yoghurt cups', 'Clear display boxes'],
    indian_trade_names: ['INEOS Styrenics', 'Styrolution GPPS', 'Trinseo Styron', 'SIBUR PS'],
    is_premium: false,
  },
  {
    name: 'HIPS (High-Impact Polystyrene)', family: 'Styrenic', type: 'commodity',
    density: 1.04, melt_temp: 200, tensile_strength: 24, flexural_modulus: 2000,
    heat_deflection_temp: 75, water_absorption: 0.05, shrinkage: 0.6,
    top_applications: ['Refrigerator inner liners', 'Luggage shells', 'Office stationery', 'Toy casings'],
    indian_trade_names: ['Styrolution HIPS', 'LG Chem HIPS', 'INEOS HIPS', 'Trinseo Magnum'],
    is_premium: false,
  },
  {
    name: 'ABS (Acrylonitrile Butadiene Styrene)', family: 'Styrenic', type: 'engineering',
    density: 1.05, melt_temp: 225, tensile_strength: 46, flexural_modulus: 2200,
    heat_deflection_temp: 95, water_absorption: 0.2, shrinkage: 0.6,
    top_applications: ['LEGO bricks', 'Consumer electronics housings', 'Automotive dashboards', 'FDM 3D printing filament'],
    indian_trade_names: ['LOTTE ABS', 'LG Chem Lumax', 'Styrolution Terluran', 'Chimei PA-757'],
    is_premium: false,
  },
  {
    name: 'SAN (Styrene-Acrylonitrile)', family: 'Styrenic', type: 'engineering',
    density: 1.08, melt_temp: 215, tensile_strength: 72, flexural_modulus: 3500,
    heat_deflection_temp: 95, water_absorption: 0.2, shrinkage: 0.5,
    top_applications: ['Transparent food containers', 'Cosmetic bottles & jars', 'Dishwasher-safe tableware', 'Instrument covers'],
    indian_trade_names: ['INEOS Lustran', 'LG Chem Luran', 'Styrolution Luran S', 'Toray AS'],
    is_premium: false,
  },
  {
    name: 'EPS (Expanded Polystyrene)', family: 'Styrenic', type: 'commodity',
    density: 0.02, melt_temp: 215, tensile_strength: 0.15, flexural_modulus: 5,
    heat_deflection_temp: 70, water_absorption: 1.0, shrinkage: 2.0,
    top_applications: ['Packaging foam (thermocol)', 'Cold chain insulation boxes', 'Building insulation boards', 'Helmet liners'],
    indian_trade_names: ['BASF Styropor', 'INEOS Styrenics', 'Supreme EPS', 'Avinash EPS Packaging'],
    is_premium: false,
  },

  // ── ENGINEERING THERMOPLASTIC — type: 'engineering' / 'specialty' ──────────
  {
    name: 'PA 6 (Nylon 6)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.14, melt_temp: 220, tensile_strength: 75, flexural_modulus: 2800,
    heat_deflection_temp: 65, water_absorption: 2.7, shrinkage: 1.3,
    top_applications: ['Automotive engine covers', 'Gears & bearings', 'Textile fibres (hosiery)', 'Cable ties'],
    indian_trade_names: ['Atul Ultramid', 'BASF Ultramid B', 'Lanxess Durethan', 'DSM Akulon'],
    is_premium: false,
  },
  {
    name: 'PA 6,6 (Nylon 6,6)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.14, melt_temp: 260, tensile_strength: 87, flexural_modulus: 3000,
    heat_deflection_temp: 90, water_absorption: 2.5, shrinkage: 1.2,
    top_applications: ['Automotive radiator end-tanks', 'Air intake manifolds', 'High-strength gears', 'Electrical connectors'],
    indian_trade_names: ['DuPont Zytel', 'BASF Ultramid A', 'Ascend Vydyne', 'Solvay Technyl'],
    is_premium: false,
  },
  {
    name: 'PC (Polycarbonate)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.20, melt_temp: 275, tensile_strength: 65, flexural_modulus: 2300,
    heat_deflection_temp: 135, water_absorption: 0.15, shrinkage: 0.6,
    top_applications: ['Safety visors & goggles', 'Headlamp lenses', 'Optical discs (CD/DVD)', 'Riot shields'],
    indian_trade_names: ['Covestro Makrolon', 'SABIC Lexan', 'Teijin Panlite', 'Lotte PC'],
    is_premium: false,
  },
  {
    name: 'POM (Polyoxymethylene / Acetal)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.41, melt_temp: 177, tensile_strength: 65, flexural_modulus: 2600,
    heat_deflection_temp: 110, water_absorption: 0.2, shrinkage: 2.2,
    top_applications: ['Precision gears & rollers', 'Valve seat inserts', 'Aerosol pump actuators', 'Zip sliders'],
    indian_trade_names: ['DuPont Delrin', 'BASF Ultraform', 'Celanese Hostaform', 'Kolon Kepital'],
    is_premium: false,
  },
  {
    name: 'PMMA (Acrylic / Perspex)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.19, melt_temp: 225, tensile_strength: 68, flexural_modulus: 3200,
    heat_deflection_temp: 95, water_absorption: 0.3, shrinkage: 0.5,
    top_applications: ['Display panels & signage', 'LED diffuser sheets', 'Bathroom sanitary ware', 'Optical lenses'],
    indian_trade_names: ['Evonik Plexiglas', 'Rohm Acrylite', 'Mitsubishi Shinkolite', 'Chi Mei CM-211'],
    is_premium: false,
  },
  {
    name: 'PC/ABS Alloy', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.12, melt_temp: 255, tensile_strength: 56, flexural_modulus: 2100,
    heat_deflection_temp: 120, water_absorption: 0.18, shrinkage: 0.6,
    top_applications: ['Automotive interior panels', 'Mobile phone housings', 'Power tool bodies', 'Laptop shells'],
    indian_trade_names: ['Covestro Bayblend', 'SABIC Cycoloy', 'LG Chem Lupoy', 'Lotte Starex'],
    is_premium: false,
  },
  {
    name: 'PEEK (Polyether Ether Ketone)', family: 'Engineering Thermoplastic', type: 'specialty',
    density: 1.32, melt_temp: 350, tensile_strength: 135, flexural_modulus: 4200,
    heat_deflection_temp: 260, water_absorption: 0.5, shrinkage: 1.1,
    top_applications: ['Aerospace brackets replacing aluminium', 'Spinal implants', 'Semiconductor wafer carriers', 'High-temp bearings'],
    indian_trade_names: ['Victrex PEEK', 'Solvay KetaSpire', 'Evonik Vestakeep', 'RTP PEEK Compounds'],
    is_premium: true,
  },
  {
    name: 'PBT (Polybutylene Terephthalate)', family: 'Engineering Thermoplastic', type: 'engineering',
    density: 1.31, melt_temp: 225, tensile_strength: 60, flexural_modulus: 2800,
    heat_deflection_temp: 160, water_absorption: 0.09, shrinkage: 1.8,
    top_applications: ['Electrical connectors', 'Automotive fan blades', 'Hairdryer housings', 'Relay bases'],
    indian_trade_names: ['DuPont Crastin', 'BASF Ultradur', 'Lanxess Pocan', 'Toray Toraycon'],
    is_premium: false,
  },
  {
    name: 'PSU (Polysulfone)', family: 'Engineering Thermoplastic', type: 'specialty',
    density: 1.24, melt_temp: 320, tensile_strength: 70, flexural_modulus: 2700,
    heat_deflection_temp: 174, water_absorption: 0.22, shrinkage: 0.6,
    top_applications: ['Autoclave-sterilisable medical trays', 'Dialysis membranes', 'Hot water pipe fittings', 'Aircraft water systems'],
    indian_trade_names: ['Solvay Udel', 'BASF Ultrason S', 'Ensinger Tecason', 'Quadrant PSU'],
    is_premium: true,
  },
  {
    name: 'PEI (Polyetherimide / Ultem)', family: 'Engineering Thermoplastic', type: 'specialty',
    density: 1.27, melt_temp: 380, tensile_strength: 122, flexural_modulus: 3500,
    heat_deflection_temp: 200, water_absorption: 0.25, shrinkage: 0.6,
    top_applications: ['Aircraft interior duct fittings', 'Autoclave trays (1000 cycles)', 'FDM aerospace prototyping', 'IC burn-in sockets'],
    indian_trade_names: ['SABIC Ultem 1010', 'SABIC Ultem 9085', 'Solvay Torlon (PAI)', 'RTP PEI Compounds'],
    is_premium: true,
  },

  // ── POLYESTER — type: 'commodity' / 'engineering' ─────────────────────────
  {
    name: 'PET (Polyethylene Terephthalate)', family: 'Polyester', type: 'commodity',
    density: 1.38, melt_temp: 257, tensile_strength: 65, flexural_modulus: 3100,
    heat_deflection_temp: 68, water_absorption: 0.2, shrinkage: 1.3,
    top_applications: ['Beverage bottles (SBM)', 'Polyester textile fibre', 'Packaging films (BOPET)', 'PET strapping bands'],
    indian_trade_names: ['Reliance PET', 'India Glycols PET', 'JBF PET', 'Dhunseri PET'],
    is_premium: false,
  },
  {
    name: 'PTT (Polytrimethylene Terephthalate)', family: 'Polyester', type: 'engineering',
    density: 1.33, melt_temp: 228, tensile_strength: 60, flexural_modulus: 2500,
    heat_deflection_temp: 59, water_absorption: 0.22, shrinkage: 1.2,
    top_applications: ['Carpet fibre (DuPont Sorona)', 'Sportswear spandex-type fibre', 'Automotive seat fabric', 'Biobased fiber blends'],
    indian_trade_names: ['DuPont Sorona', 'Shell Corterra', 'Toray ECDP', 'Indo Rama PTT'],
    is_premium: true,
  },
  {
    name: 'PEN (Polyethylene Naphthalate)', family: 'Polyester', type: 'specialty',
    density: 1.36, melt_temp: 267, tensile_strength: 87, flexural_modulus: 4500,
    heat_deflection_temp: 155, water_absorption: 0.35, shrinkage: 1.2,
    top_applications: ['Hot-fill beverage bottles', 'Flexible electronics substrate', 'Industrial magnetic tape', 'High-barrier multilayer films'],
    indian_trade_names: ['Teijin Teonex', 'DuPont PEN', 'Toray PEN Film', 'SKC PEN'],
    is_premium: true,
  },
  {
    name: 'rPET (Recycled Polyethylene Terephthalate)', family: 'Polyester', type: 'commodity',
    density: 1.37, melt_temp: 254, tensile_strength: 55, flexural_modulus: 2800,
    heat_deflection_temp: 65, water_absorption: 0.2, shrinkage: 1.3,
    top_applications: ['Recycled PET bottles (food-contact)', 'rPET fibre (fleece clothing)', 'Automotive trunk liners', 'rPET packaging trays'],
    indian_trade_names: ['Polygenta rPET', 'Welspun rPET Fibre', 'Ganesha Ecosphere rPET', 'RAS rPET Flakes'],
    is_premium: false,
  },

  // ── FLUOROPOLYMER — type: 'specialty' ────────────────────────────────────
  {
    name: 'PTFE (Polytetrafluoroethylene / Teflon)', family: 'Fluoropolymer', type: 'specialty',
    density: 2.20, melt_temp: 327, tensile_strength: 24, flexural_modulus: 680,
    heat_deflection_temp: 260, water_absorption: 0.01, shrinkage: 3.5,
    top_applications: ['Non-stick cookware coating', 'Chemical pipe linings', 'Piston rings & seals', 'Lab gaskets & tubing'],
    indian_trade_names: ['Chemours Teflon', '3M Dyneon PTFE', 'Daikin Polyflon', 'Gujarat Fluorochemicals PTFE'],
    is_premium: false,
  },
  {
    name: 'FEP (Fluorinated Ethylene Propylene)', family: 'Fluoropolymer', type: 'specialty',
    density: 2.15, melt_temp: 265, tensile_strength: 24, flexural_modulus: 650,
    heat_deflection_temp: 204, water_absorption: 0.01, shrinkage: 3.5,
    top_applications: ['High-temp wire insulation', 'Semiconductor tubing', 'Chemical tank liners', 'Laboratory beakers'],
    indian_trade_names: ['Chemours Teflon FEP', 'Daikin Neoflon FEP', '3M Dyneon FEP', 'Saint-Gobain FEP'],
    is_premium: true,
  },
  {
    name: 'PFA (Perfluoroalkoxy Alkane)', family: 'Fluoropolymer', type: 'specialty',
    density: 2.15, melt_temp: 305, tensile_strength: 31, flexural_modulus: 650,
    heat_deflection_temp: 260, water_absorption: 0.01, shrinkage: 3.5,
    top_applications: ['Semiconductor wet-bench piping', 'Ultra-pure chemical handling', 'Analytical instrument tubing', 'Aggressive acid fittings'],
    indian_trade_names: ['Chemours Teflon PFA', 'Daikin Neoflon PFA', 'Solvay Hyflon PFA', 'AGC Fluon PFA'],
    is_premium: true,
  },
  {
    name: 'ETFE (Ethylene Tetrafluoroethylene)', family: 'Fluoropolymer', type: 'specialty',
    density: 1.73, melt_temp: 270, tensile_strength: 47, flexural_modulus: 1500,
    heat_deflection_temp: 104, water_absorption: 0.03, shrinkage: 2.0,
    top_applications: ['Architectural roof membranes (Eden Project)', 'Solar panel film', 'Aeroplane wire coating', 'Chemical tank covers'],
    indian_trade_names: ['Chemours Tefzel ETFE', 'Daikin Neoflon ETFE', 'AGC Fluon ETFE', 'Solvay Halar ECTFE'],
    is_premium: true,
  },

  // ── ELASTOMER — type: 'elastomer' ─────────────────────────────────────────
  {
    name: 'Natural Rubber (NR / Polyisoprene)', family: 'Elastomer', type: 'elastomer',
    density: 0.93, melt_temp: null, tensile_strength: 24, flexural_modulus: 1,
    heat_deflection_temp: null, water_absorption: 0.5, shrinkage: null,
    top_applications: ['Truck & tyre industry', 'Medical gloves & condoms', 'Conveyor belts', 'Anti-vibration mounts'],
    indian_trade_names: ['Kerala RSS Grade', 'Karnataka SMR 20', 'Rubberland CV60', 'RRII NR Graded'],
    is_premium: false,
  },
  {
    name: 'SBR (Styrene-Butadiene Rubber)', family: 'Elastomer', type: 'elastomer',
    density: 0.94, melt_temp: null, tensile_strength: 14, flexural_modulus: 1,
    heat_deflection_temp: null, water_absorption: 0.3, shrinkage: null,
    top_applications: ['Car & truck tyres (largest volume)', 'Shoe soles', 'Floor mats', 'Adhesives & sealants'],
    indian_trade_names: ['Reliance SBR', 'Indian Synthetic Rubber', 'ISCO SBR', 'LANXESS Buna SB'],
    is_premium: false,
  },
  {
    name: 'EPDM (Ethylene Propylene Diene Monomer)', family: 'Elastomer', type: 'elastomer',
    density: 0.86, melt_temp: null, tensile_strength: 13, flexural_modulus: 1,
    heat_deflection_temp: null, water_absorption: 0.2, shrinkage: null,
    top_applications: ['Car door & window seals', 'Single-ply roofing membrane', 'Garden hose', 'Radiator hose'],
    indian_trade_names: ['LANXESS Keltan', 'ExxonMobil Vistalon', 'Lion Elastomers', 'Mitsui EPDM 3072'],
    is_premium: false,
  },
  {
    name: 'NBR (Nitrile Butadiene Rubber)', family: 'Elastomer', type: 'elastomer',
    density: 0.98, melt_temp: null, tensile_strength: 20, flexural_modulus: 3,
    heat_deflection_temp: null, water_absorption: 0.4, shrinkage: null,
    top_applications: ['Oil-resistant O-rings & seals', 'Fuel system hoses', 'Examination gloves', 'Industrial roller coverings'],
    indian_trade_names: ['LANXESS Krynac', 'Zeon Nipol NBR', 'Arlanxeo Perbunan', 'JSR N230S'],
    is_premium: false,
  },
  {
    name: 'Silicone Rubber (VMQ)', family: 'Elastomer', type: 'elastomer',
    density: 1.12, melt_temp: null, tensile_strength: 9, flexural_modulus: 0.5,
    heat_deflection_temp: null, water_absorption: 0.1, shrinkage: null,
    top_applications: ['Baby bottle nipples (LSR)', 'Surgical implants', 'Bakeware (oven-safe to 230 C)', 'Electrical connector boots'],
    indian_trade_names: ['Dow Silastic', 'Wacker Elastosil', 'Shin-Etsu KE Series', 'Momentive RTV Silicone'],
    is_premium: false,
  },
  {
    name: 'Neoprene (CR / Polychloroprene)', family: 'Elastomer', type: 'elastomer',
    density: 1.23, melt_temp: null, tensile_strength: 20, flexural_modulus: 2,
    heat_deflection_temp: null, water_absorption: 0.2, shrinkage: null,
    top_applications: ['Wetsuits & drysuits', 'Electrical cable jackets', 'Hose linings', 'Flexible bellows'],
    indian_trade_names: ['DuPont Neoprene', 'Denka Denkaprene', 'Tosoh Skyprene', 'Lanxess Baypren'],
    is_premium: false,
  },
  {
    name: 'TPU (Thermoplastic Polyurethane)', family: 'Elastomer', type: 'engineering',
    density: 1.15, melt_temp: 205, tensile_strength: 40, flexural_modulus: 50,
    heat_deflection_temp: 55, water_absorption: 0.7, shrinkage: 1.2,
    top_applications: ['Running shoe outsoles', 'Flexible hoses & belts', 'Screen protector films', 'TPU 3D printing filament'],
    indian_trade_names: ['Covestro Desmopan', 'BASF Elastollan', 'Lubrizol Estane', 'Huntsman Irogran'],
    is_premium: false,
  },

  // ── BIOPLASTIC — type: 'bioplastic' ──────────────────────────────────────
  {
    name: 'PLA (Polylactic Acid)', family: 'Bioplastic', type: 'bioplastic',
    density: 1.24, melt_temp: 157, tensile_strength: 56, flexural_modulus: 3500,
    heat_deflection_temp: 55, water_absorption: 0.5, shrinkage: 0.4,
    top_applications: ['FDM 3D printing filament', 'Compostable cups & cutlery', 'Bio-based packaging films', 'Medical sutures & implants'],
    indian_trade_names: ['NatureWorks Ingeo', 'Total Corbion Luminy', 'Futerro PLA', 'Esun PLA Filament'],
    is_premium: false,
  },
  {
    name: 'PHA (Polyhydroxyalkanoate)', family: 'Bioplastic', type: 'bioplastic',
    density: 1.20, melt_temp: 168, tensile_strength: 32, flexural_modulus: 2500,
    heat_deflection_temp: 90, water_absorption: 0.5, shrinkage: 1.5,
    top_applications: ['Marine-degradable packaging', 'Medical sutures (bioresorbable)', 'Single-use foodservice items', 'Biopesticide encapsulant'],
    indian_trade_names: ['Danimer Nodax PHA', 'CJ BIO PHA', 'Newlight AirCarbon PHA', 'TerraVerdae PHA'],
    is_premium: true,
  },
  {
    name: 'TPS (Thermoplastic Starch)', family: 'Bioplastic', type: 'bioplastic',
    density: 1.25, melt_temp: 152, tensile_strength: 12, flexural_modulus: 600,
    heat_deflection_temp: 45, water_absorption: 10.0, shrinkage: 1.0,
    top_applications: ['Compostable loose-fill packaging', 'Agricultural mulch film blends', 'Shopping bags (blended)', 'Seed coating capsules'],
    indian_trade_names: ['Novamont Mater-Bi', 'Plantic TPS', 'Biotec Bioplast', 'Vegeplast TPS'],
    is_premium: false,
  },
  {
    name: 'PBAT (Polybutylene Adipate Terephthalate)', family: 'Bioplastic', type: 'bioplastic',
    density: 1.26, melt_temp: 115, tensile_strength: 6, flexural_modulus: 80,
    heat_deflection_temp: 40, water_absorption: 0.5, shrinkage: 1.5,
    top_applications: ['Compostable bags (EN 13432)', 'Mulch film (biodegrades in soil)', 'Coating for paper cups', 'PBAT/PLA blends'],
    indian_trade_names: ['BASF Ecoflex', 'Xinfu PBAT', 'Kingfa PBAT', 'SKBiotek PBAT'],
    is_premium: false,
  },
  {
    name: 'Bio-PE (Sugarcane Polyethylene)', family: 'Bioplastic', type: 'bioplastic',
    density: 0.95, melt_temp: 132, tensile_strength: 26, flexural_modulus: 900,
    heat_deflection_temp: 75, water_absorption: 0.01, shrinkage: 1.5,
    top_applications: ['Green HDPE bottles (same as fossil PE)', 'Sustainable packaging films', 'Toy manufacturing (LEGO)', 'Bio-attributed compound grades'],
    indian_trade_names: ["Braskem I'm Green Bio-PE", 'IndianOil Bio-PE (pilot)', 'Neste RE HDPE', 'Sabic Trucircle BioPE'],
    is_premium: false,
  },
  {
    name: 'Bio-PP (Bio-based Polypropylene)', family: 'Bioplastic', type: 'bioplastic',
    density: 0.905, melt_temp: 163, tensile_strength: 34, flexural_modulus: 1300,
    heat_deflection_temp: 92, water_absorption: 0.02, shrinkage: 1.6,
    top_applications: ['Bio-attributed automotive parts', 'Sustainable packaging caps', 'Bio-PP fibre & raffia', 'Green-label consumer goods'],
    indian_trade_names: ['Braskem Bio-PP (pilot)', 'Total Corbion Bio-PP', 'LyondellBasell CirculenRenew', 'Borealis Bornewables'],
    is_premium: true,
  },
];

// Add slug to each row
const rows = materials.map(m => ({ ...m, slug: slugify(m.name) }));

async function seed() {
  console.log(`\n🌱 Seeding ${rows.length} polymer materials into Supabase...\n`);

  // Clear existing rows
  await supabase.from('materials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('🗑️  Cleared existing rows\n');

  const { data, error } = await supabase
    .from('materials')
    .insert(rows)
    .select('id, name, family, type');

  if (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.details) console.error('   Details:', error.details);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data.length} materials successfully!\n`);

  // Summary by family
  const byFamily = {};
  data.forEach(m => { byFamily[m.family] = (byFamily[m.family] || 0) + 1; });
  console.log('📊 Breakdown by Family:');
  Object.entries(byFamily).sort().forEach(([family, count]) => {
    console.log(`   ${String(family).padEnd(35)} → ${count} polymers`);
  });
  console.log(`\n   TOTAL: ${data.length} polymers seeded into Supabase ✅`);
}

seed();
