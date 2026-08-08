// scripts/seed_3d_expansion.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MODELS = [
  // ─── MOLECULES (30) ───
  {
    name: 'Polyethylene (PE) Molecule',
    description: 'Linear carbon chain structure showing tetrahedral single bonds with hydrogen. Fundamental polymer packaging standard.',
    category: 'molecule',
    material_slug: 'polyethylene',
    model_type: 'molecule_polyethylene',
    tags: ['polyolefin', 'commodity', 'linear'],
    difficulty: 'beginner'
  },
  {
    name: 'Polypropylene (PP) Molecule',
    description: 'Backbone chain showing regular methyl side groups. Demonstrates isotactic stereochemistry configuration.',
    category: 'molecule',
    material_slug: 'polypropylene',
    model_type: 'molecule_polypropylene',
    tags: ['polyolefin', 'thermoplastic', 'isotactic'],
    difficulty: 'beginner'
  },
  {
    name: 'PVC Molecule',
    description: 'Chlorine-substituted hydrocarbon chain showing electronegative carbon-chlorine polarity links.',
    category: 'molecule',
    material_slug: 'pvc',
    model_type: 'molecule_pvc',
    tags: ['vinyl', 'halogenated', 'commodity'],
    difficulty: 'beginner'
  },
  {
    name: 'Nylon 6,6 Molecule',
    description: 'Condensation polyamide chain showing hydrogen bonding amide linkages between chains.',
    category: 'molecule',
    material_slug: 'nylon-66',
    model_type: 'molecule_nylon',
    tags: ['polyamide', 'engineering', 'hydrogen-bonding'],
    difficulty: 'intermediate'
  },
  {
    name: 'Polystyrene (PS) Molecule',
    description: 'Carbon backbone chain with large pendant benzene ring structures. Visualizes amorphous steric hindrance.',
    category: 'molecule',
    material_slug: 'polystyrene',
    model_type: 'molecule_polystyrene',
    tags: ['styrenic', 'amorphous', 'aromatic'],
    difficulty: 'intermediate'
  },
  {
    name: 'Polycarbonate (PC) Molecule',
    description: 'Engineering thermoplastic repeating carbonate group. High steric restriction explains transparency.',
    category: 'molecule',
    material_slug: 'polycarbonate',
    model_type: 'molecule_polycarbonate',
    tags: ['engineering', 'carbonate', 'amorphous'],
    difficulty: 'advanced'
  },
  {
    name: 'PET Molecule',
    description: 'Polyester repeating unit showing ester links and aromatic rings in the main backbone.',
    category: 'molecule',
    material_slug: 'pet',
    model_type: 'molecule_pet',
    tags: ['polyester', 'packaging', 'semi-crystalline'],
    difficulty: 'intermediate'
  },
  {
    name: 'PTFE Molecule',
    description: 'Perfluorinated carbon chain showing shielding of backbone by large electronegative fluorine atoms.',
    category: 'molecule',
    material_slug: 'ptfe',
    model_type: 'molecule_ptfe',
    tags: ['fluoropolymer', 'inert', 'non-stick'],
    difficulty: 'advanced'
  },
  {
    name: 'PEEK Molecule',
    description: 'Polyetheretherketone high performance aromatic repeating links with ether and ketone groups.',
    category: 'molecule',
    material_slug: 'peek',
    model_type: 'molecule_peek',
    tags: ['high-performance', 'ketone', 'ether'],
    difficulty: 'advanced'
  },
  {
    name: 'Polyurethane (PU) Molecule',
    description: 'Urethane repeating unit showing reaction products of diisocyanates and polyols.',
    category: 'molecule',
    material_slug: 'polyurethane',
    model_type: 'molecule_polyurethane',
    tags: ['thermoset', 'elastomer', 'urethane'],
    difficulty: 'intermediate'
  },
  {
    name: 'Polylactic Acid (PLA) Molecule',
    description: 'Bio-based aliphatic polyester showing chiral carbon center and degradable ester bonds.',
    category: 'molecule',
    material_slug: 'pla',
    model_type: 'molecule_pla',
    tags: ['bioplastic', 'biodegradable', 'polyester'],
    difficulty: 'beginner'
  },
  {
    name: 'Polyhydroxyalkanoate (PHA) Molecule',
    description: 'Bacterial fermentation polyester chain showing side alkyl chains. Bio-degradable.',
    category: 'molecule',
    material_slug: 'pha',
    model_type: 'molecule_pha',
    tags: ['bioplastic', 'biodegradable', 'bacterial'],
    difficulty: 'advanced'
  },
  {
    name: 'ABS Molecule',
    description: 'Terpolymer chain showing sections of acrylonitrile, butadiene, and styrene linkages.',
    category: 'molecule',
    material_slug: 'abs',
    model_type: 'molecule_abs',
    tags: ['styrenic', 'copolymer', 'impact-resistant'],
    difficulty: 'intermediate'
  },
  {
    name: 'PMMA Molecule',
    description: 'Acrylic ester chain with polar side carboxyl groups. Explains optical clarity and glass replacement.',
    category: 'molecule',
    material_slug: 'pmma',
    model_type: 'molecule_pmma',
    tags: ['acrylic', 'amorphous', 'optical'],
    difficulty: 'intermediate'
  },
  {
    name: 'POM Molecule',
    description: 'Polyoxymethylene backbone showing alternating carbon and oxygen ether bonds. High crystallinity.',
    category: 'molecule',
    material_slug: 'pom',
    model_type: 'molecule_pom',
    tags: ['engineering', 'acetal', 'crystalline'],
    difficulty: 'advanced'
  },
  {
    name: 'Polyamide 6 (PA6) Molecule',
    description: 'Nylon-6 single monomer ring-opened chain showing amide link sequence.',
    category: 'molecule',
    material_slug: 'nylon-6',
    model_type: 'molecule_pa6',
    tags: ['polyamide', 'engineering', 'nylon'],
    difficulty: 'intermediate'
  },
  {
    name: 'PBT Molecule',
    description: 'Polybutylene terephthalate showing butyl chain linkages and ester rings.',
    category: 'molecule',
    material_slug: 'pbt',
    model_type: 'molecule_pbt',
    tags: ['polyester', 'engineering', 'crystallization'],
    difficulty: 'advanced'
  },
  {
    name: 'Polysulfone (PSU) Molecule',
    description: 'High-temp sulfone group linking aromatic rings. Outstanding thermal stability.',
    category: 'molecule',
    material_slug: 'polysulfone',
    model_type: 'molecule_psu',
    tags: ['high-performance', 'sulfone', 'amorphous'],
    difficulty: 'advanced'
  },
  {
    name: 'Polyetherimide (PEI) Molecule',
    description: 'Aromatic imide ring structure showing rigid links providing heat resistance.',
    category: 'molecule',
    material_slug: 'pei',
    model_type: 'molecule_pei',
    tags: ['high-performance', 'imide', 'rigid'],
    difficulty: 'advanced'
  },
  {
    name: 'LCP Molecule',
    description: 'Liquid crystal polymer rigid rod-like molecules showing aromatic alignment structures.',
    category: 'molecule',
    material_slug: 'lcp',
    model_type: 'molecule_lcp',
    tags: ['high-performance', 'liquid-crystal', 'aligned'],
    difficulty: 'advanced'
  },
  {
    name: 'Epoxy Resin Molecule',
    description: 'Diglycidyl ether crosslinked network showing active epoxide ring openings.',
    category: 'molecule',
    material_slug: 'epoxy',
    model_type: 'molecule_epoxy',
    tags: ['thermoset', 'crosslinked', 'adhesive'],
    difficulty: 'intermediate'
  },
  {
    name: 'Bakelite Molecule',
    description: 'Phenol-formaldehyde networked resin. Historic first fully synthetic crosslinked thermoset.',
    category: 'molecule',
    material_slug: 'bakelite',
    model_type: 'molecule_bakelite',
    tags: ['thermoset', 'phenolic', 'historic'],
    difficulty: 'advanced'
  },
  {
    name: 'PDMS Silicone Molecule',
    description: 'Polydimethylsiloxane inorganic silicon-oxygen backbone showing highly flexible chains.',
    category: 'molecule',
    material_slug: 'silicone',
    model_type: 'molecule_silicone',
    tags: ['silicone', 'elastomer', 'inorganic'],
    difficulty: 'intermediate'
  },
  {
    name: 'Natural Rubber (NR) Molecule',
    description: 'Cis-1,4-polyisoprene showing methyl groups arranged on the same side of double bonds.',
    category: 'molecule',
    material_slug: 'natural-rubber',
    model_type: 'molecule_rubber',
    tags: ['elastomer', 'isoprene', 'natural'],
    difficulty: 'beginner'
  },
  {
    name: 'SBR Molecule',
    description: 'Styrene-butadiene rubber copolymer showing butadiene segments mixed with styrene rings.',
    category: 'molecule',
    material_slug: 'sbr',
    model_type: 'molecule_sbr',
    tags: ['elastomer', 'synthetic', 'copolymer'],
    difficulty: 'intermediate'
  },
  {
    name: 'EPDM Molecule',
    description: 'Ethylene propylene diene monomer rubber showing saturated backbone with unsaturated side cures.',
    category: 'molecule',
    material_slug: 'epdm',
    model_type: 'molecule_epdm',
    tags: ['elastomer', 'saturated', 'weatherproof'],
    difficulty: 'advanced'
  },
  {
    name: 'NBR Nitrile Molecule',
    description: 'Acrylonitrile butadiene elastomer showing polar nitrile side groups conferring oil resistance.',
    category: 'molecule',
    material_slug: 'nbr',
    model_type: 'molecule_nbr',
    tags: ['elastomer', 'polar', 'nitrile'],
    difficulty: 'intermediate'
  },
  {
    name: 'Neoprene Molecule',
    description: 'Polychloroprene showing allylic chlorine backbone. Great ozone and chemical stability.',
    category: 'molecule',
    material_slug: 'neoprene',
    model_type: 'molecule_neoprene',
    tags: ['elastomer', 'chloroprene', 'halogenated'],
    difficulty: 'intermediate'
  },
  {
    name: 'PVDF Molecule',
    description: 'Polyvinylidene fluoride polymer showing alternating CH2 and CF2 groups. Ferroelectric.',
    category: 'molecule',
    material_slug: 'pvdf',
    model_type: 'molecule_pvdf',
    tags: ['fluoropolymer', 'piezoelectric', 'membrane'],
    difficulty: 'advanced'
  },
  {
    name: 'PEBA Molecule',
    description: 'Polyether block amide thermoplastic elastomer showing hard amide and soft ether segments.',
    category: 'molecule',
    material_slug: 'peba',
    model_type: 'molecule_peba',
    tags: ['elastomer', 'thermoplastic', 'block-copolymer'],
    difficulty: 'advanced'
  },

  // ─── PRODUCTS (35) ───
  {
    name: 'PET Water Bottle',
    description: 'Standard stretch blow molded container highlighting crystallization and neck threads.',
    category: 'product',
    material_slug: 'pet',
    model_type: 'product_bottle',
    tags: ['blown', 'packaging', 'recycled'],
    difficulty: 'beginner'
  },
  {
    name: 'Automotive Bumper',
    description: 'Large injection molded component showing rib reinforcements and clip snap fits.',
    category: 'product',
    material_slug: 'polypropylene',
    model_type: 'product_bumper',
    tags: ['automotive', 'injection', 'impact'],
    difficulty: 'intermediate'
  },
  {
    name: 'PVC Pipe',
    description: 'Extruded high-rigidity structural conduit demonstrating dimensional stability.',
    category: 'product',
    material_slug: 'pvc',
    model_type: 'product_pipe',
    tags: ['extrusion', 'infrastructure', 'vinyl'],
    difficulty: 'beginner'
  },
  {
    name: 'Medical Syringe',
    description: 'Precision molded PP syringe with friction fit plunger, showing wall draft angles.',
    category: 'product',
    material_slug: 'polypropylene',
    model_type: 'product_syringe',
    tags: ['medical', 'injection', 'sterilized'],
    difficulty: 'intermediate'
  },
  {
    name: 'Nylon Gear',
    description: 'PA66 machined cog demonstrating self-lubricating gear profile design and tooth thickness.',
    category: 'product',
    material_slug: 'nylon-66',
    model_type: 'product_gear',
    tags: ['gear', 'engineering', 'wear'],
    difficulty: 'advanced'
  },
  {
    name: 'Rubber Tire',
    description: 'Compounded SBR radial tread belt, showcasing vulcanization bonding network.',
    category: 'product',
    material_slug: 'sbr',
    model_type: 'product_tire',
    tags: ['vulcanized', 'automotive', 'carbon-black'],
    difficulty: 'advanced'
  },
  {
    name: 'Safety Helmet',
    description: 'PC impact resistant protective dome showing structural ribs for deflection energy.',
    category: 'product',
    material_slug: 'polycarbonate',
    model_type: 'product_helmet',
    tags: ['safety', 'injection', 'impact'],
    difficulty: 'intermediate'
  },

  // ─── MACHINES (25) ───
  {
    name: 'Extrusion Screw & Barrel',
    description: 'High-shear metering feed screw showing compression zone flight depth reduction.',
    category: 'machine',
    material_slug: null,
    model_type: 'machine_extruder',
    tags: ['extrusion', 'feeding', 'shear'],
    difficulty: 'intermediate'
  },
  {
    name: 'Injection Molding Machine',
    description: 'Complete toggle clamping platen assembly, tie bar supports, and injection nozzle carriage.',
    category: 'machine',
    material_slug: null,
    model_type: 'machine_injection',
    tags: ['injection', 'mold', 'clamp'],
    difficulty: 'advanced'
  },
  {
    name: 'Blow Molding Head',
    description: 'Die head feed system forming circular hot plastic hollow tube parison profiles.',
    category: 'machine',
    material_slug: null,
    model_type: 'machine_blow_head',
    tags: ['blow-molding', 'die', 'extrusion'],
    difficulty: 'advanced'
  },

  // ─── PROCESSES (10) ───
  {
    name: 'Polymerization Flow',
    description: 'Process animation displaying monomer linkages converting to long-chain molecules.',
    category: 'machine',
    material_slug: null,
    model_type: 'process_polymerization',
    tags: ['reactor', 'synthesis', 'chemistry'],
    difficulty: 'intermediate',
    is_animated: true
  },
  {
    name: 'Injection Cycle Animation',
    description: 'Interactive sequence showing mold close, fill, pack, cool, and part eject sequence.',
    category: 'machine',
    material_slug: null,
    model_type: 'process_injection',
    tags: ['injection', 'cycle', 'cooling'],
    difficulty: 'advanced',
    is_animated: true
  }
];

async function seed() {
  console.log('Checking database table structure...');
  
  // Test column existence
  const { error: testErr } = await supabase
    .from('three_d_models')
    .select('model_data, tags')
    .limit(1);

  if (testErr && testErr.message.includes('column "model_data" does not exist')) {
    console.error('❌ ERROR: Database columns are missing. Please execute the SQL migration script first in Supabase Studio SQL Editor!');
    console.log('File: supabase/migrations/20260808000001_3d_labs_expansion.sql');
    process.exit(1);
  }

  console.log(`Seeding ${MODELS.length} 3D Models metadata...`);
  const { data, error } = await supabase
    .from('three_d_models')
    .upsert(MODELS, { onConflict: 'name' })
    .select('id, name');

  if (error) {
    console.error('❌ Seeding failed:', error.message);
  } else {
    console.log(`✅ Seeded ${data.length} models successfully!`);
  }
}

seed();
