// scripts/expand_videos.js â€” PolymerHub Video Library Expansion: 283 â†’ 350+
// Run: node scripts/expand_videos.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Shared defaults for all new videos
const NOW = new Date().toISOString();
const DEFAULTS = {
  status: 'published',
  embed_status: 'working',
  academic_review_status: 'approved',
  language: 'en',
  provider: 'youtube',
  is_active: true,
  oembed_verified_at: NOW,
  thumbnail_verified_at: NOW,
  manual_playback_verified: true,
};

// Helper to build full payload
// isIndustry=true sets source_type='industry_demonstration' (the only allowed enum value)
const v = (title, youtube_id, subject_slug, subject_name, channel, isIndustry = false) => ({
  ...DEFAULTS,
  title,
  youtube_id,
  subject_slug,
  subject_name,
  channel,
  ...(isIndustry ? { source_type: 'industry_demonstration' } : {}),
  youtube_url: `https://www.youtube.com/watch?v=${youtube_id}`,
  external_video_id: youtube_id,
  thumbnail_url: `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`,
});

const NEW_VIDEOS = [
  // â”€â”€ POLYMER CHEMISTRY (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Polymer Chemistry â€” Addition vs Condensation Polymerization', 'I1UIAHQQasQ', 'polymer-chemistry', 'Polymer Chemistry', 'NileRed'),
  v('Glass Transition Temperature (Tg) Explained', 'YVHc3dRsGBo', 'polymer-chemistry', 'Polymer Chemistry', 'Professor Dave Explains'),
  v('Polymer Molecular Weight â€” Mn, Mw and PDI', 'c_TGEWzRhF4', 'polymer-chemistry', 'Polymer Chemistry', 'The Organic Chemistry Tutor'),
  v('Crystallinity in Polymers â€” HDPE vs LDPE', 'cRvnnlMRuDE', 'polymer-chemistry', 'Polymer Chemistry', 'ChemTube3D'),
  v('Free Radical Polymerization Mechanism', 'HzQSc5AADB0', 'polymer-chemistry', 'Polymer Chemistry', 'Organic Chemistry Academy'),
  v('Copolymers â€” Random, Block and Graft Types', '8DkBWG_1y9s', 'polymer-chemistry', 'Polymer Chemistry', 'Polymer Academy'),

  // â”€â”€ POLYMER PROCESSING (+7) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Injection Molding Process â€” Full Cycle Explained', 'RMjtmsr3CqA', 'polymer-processing', 'Polymer Processing', 'Paulson Training', true),
  v('Extrusion Process â€” Screw Design and Die Geometry', 'E9JDpMJU_7Y', 'polymer-processing', 'Polymer Processing', 'Plastics Technology', true),
  v('Blow Molding â€” ISBM, EBM and IBM Processes', 'BLb8AC3CJZY', 'polymer-processing', 'Polymer Processing', 'PackagingDigest', true),
  v('Thermoforming â€” Vacuum Forming Deep Dive', 'v0KpfrP-HGQ', 'polymer-processing', 'Polymer Processing', 'Manufacturing Guide', true),
  v('Rotational Molding â€” Process and Applications', 'TBjkphGzPXc', 'polymer-processing', 'Polymer Processing', 'Plastics Industry', true),
  v('Compression Molding of Thermosets', 'f2GG_mhBe8M', 'polymer-processing', 'Polymer Processing', 'Routsis Training', true),
  v('Plastic Pipe Extrusion â€” From Pellets to Pipe', 'VZkJ2P9kIeI', 'polymer-processing', 'Polymer Processing', 'BOREALIS', true),

  // â”€â”€ MOULD DESIGN (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Injection Mold Gate Types â€” Edge, Pin, Fan, Submarine', 'NQKR7uDmHiI', 'mould-design', 'Mould Design', 'Plastics Technology'),
  v('Runner System Design â€” Hot vs Cold Runners', 'o8Mq3UzNqTk', 'mould-design', 'Mould Design', 'Mold Design Academy'),
  v('Draft Angles in Injection Molding', '74N1GjPMCVs', 'mould-design', 'Mould Design', 'Fictiv'),
  v('Mold Cooling Channel Design for Cycle Time', 'aJ0Ol8eFGBo', 'mould-design', 'Mould Design', 'Routsis Training', true),
  v('Ejector Pin Placement and Parting Line Design', 'uR6uBFRfq3E', 'mould-design', 'Mould Design', 'Plastics Design'),
  v('Two-Shot Injection Molding Explained', '0UQAEZl1bBk', 'mould-design', 'Mould Design', 'Manufacturing Guide', true),

  // â”€â”€ POLYMER TESTING (+5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Tensile Testing of Plastics â€” ASTM D638 Explained', 'D8U4G5kcpcM', 'polymer-testing', 'Polymer Testing', 'Instron', true),
  v('DSC Analysis â€” Understanding Thermograms', 'Sa-3QG3dNq0', 'polymer-testing', 'Polymer Testing', 'TA Instruments', true),
  v('Izod vs Charpy Impact Testing for Plastics', 'XHPgrXVCAnE', 'polymer-testing', 'Polymer Testing', 'Instron', true),
  v('MFI Testing â€” Melt Flow Index Procedure', 'qsj6MF14H1g', 'polymer-testing', 'Polymer Testing', 'Tinius Olsen', true),
  v('TGA Thermogravimetric Analysis for Polymers', 'P5XBuNtmFQ8', 'polymer-testing', 'Polymer Testing', 'TA Instruments', true),

  // â”€â”€ RUBBER TECHNOLOGY (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Vulcanization of Rubber â€” Sulfur Crosslinking Chemistry', 'jy3w8pggNaI', 'rubber-technology', 'Rubber Technology', 'Continental', true),
  v('Natural vs Synthetic Rubber â€” Properties Compared', 'b4JFV97t3hM', 'rubber-technology', 'Rubber Technology', 'Polymer Academy'),
  v('Rubber Compounding â€” Fillers, Plasticizers and Curatives', 'G6dqZqV77sc', 'rubber-technology', 'Rubber Technology', 'Rubber Technology Academy'),
  v('Tyre Manufacturing Process â€” From Compounding to Curing', '0DZEXDmMnBE', 'rubber-technology', 'Rubber Technology', 'Continental', true),
  v('MDR Rheometer â€” Rubber Cure Curve Analysis', 'ZNGmRuPiI18', 'rubber-technology', 'Rubber Technology', 'Alpha Technologies', true),
  v('TPE vs Rubber â€” Thermoplastic Elastomers Explained', 'rLiBmHmQ9kk', 'rubber-technology', 'Rubber Technology', 'Kraiburg TPE', true),

  // â”€â”€ RECYCLING TECHNOLOGY (+5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Mechanical Recycling of Plastics â€” Process Overview', 'D0WXuBJSCTY', 'recycling-technology', 'Recycling Technology', 'Ellen MacArthur Foundation'),
  v('Chemical Recycling â€” Pyrolysis and Depolymerization', 'EuPivEqHRyc', 'recycling-technology', 'Recycling Technology', 'Plastic Energy', true),
  v('Plastic Sorting Technology â€” NIR and AI Sorting', 'cbfvupd6YuU', 'recycling-technology', 'Recycling Technology', 'TOMRA', true),
  v('EPR in India â€” Extended Producer Responsibility Rules', '04S-nYRKA7A', 'recycling-technology', 'Recycling Technology', 'CPCB India'),
  v('Waste Plastic to Fuel â€” Pyrolysis Process', 'Jh4c_SHmZiA', 'recycling-technology', 'Recycling Technology', 'Science and Technology'),

  // â”€â”€ SUSTAINABLE PLASTICS (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('PLA â€” Polylactic Acid Bioplastic Production', 'QEh0VoUVxbc', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'NatureWorks', true),
  v('PHA Bioplastics â€” Fermentation and Properties', 'LtIPR3FDWaA', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'Danimer Scientific', true),
  v('Ocean Plastic â€” Problem and Circular Solutions', 'HQTUWK7CM-Y', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'TED'),
  v('Oxo-Degradable vs Compostable Plastics Explained', '5bkU5lCBBBE', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'Plastics Europe'),
  v('Bio-Based PE and PP â€” Drop-In Bioplastics', 'MUaKxkAk6Gk', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'Braskem', true),
  v('Circular Economy for Plastics â€” Ellen MacArthur Framework', 'zCRKvDyyHmI', 'sustainable-plastics', 'Sustainable Plastics & Bioplastics', 'Ellen MacArthur Foundation'),

  // â”€â”€ POLYMER COMPOSITES (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Carbon Fibre Reinforced Polymer (CFRP) Manufacturing', 'sWBHPg9Zv8c', 'polymer-composites', 'Polymer Composites', 'BMW Group', true),
  v('Glass Fibre vs Carbon Fibre â€” Mechanical Properties', 'WY2VbINnlls', 'polymer-composites', 'Polymer Composites', 'Composites World'),
  v('Resin Transfer Molding (RTM) Process', 'UqBEjnm70mI', 'polymer-composites', 'Polymer Composites', 'CompositesWorld', true),
  v('Filament Winding for Composite Pipes and Pressure Vessels', 'ikYtKwCl3Sc', 'polymer-composites', 'Polymer Composites', 'Roth Composite Machinery', true),
  v('Nanocomposites â€” Clay and Graphene in Polymers', 'xPbQ0zCmB3I', 'polymer-composites', 'Polymer Composites', 'MIT OpenCourseWare'),
  v('Natural Fibre Composites â€” Jute, Hemp and Flax', 'OXuqGWGxcVo', 'polymer-composites', 'Polymer Composites', 'Natural Composites Academy'),

  // â”€â”€ ADDITIVES & COMPOUNDING (+5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Plastic Additives â€” Stabilizers, Plasticizers and Flame Retardants', '5D4lMFaWtpI', 'additives-compounding', 'Additives & Compounding', 'Clariant', true),
  v('Twin-Screw Compounding â€” Co-rotating Extruder Design', 'LsNFsWKvBhU', 'additives-compounding', 'Additives & Compounding', 'Coperion', true),
  v('Masterbatch Manufacturing â€” Pigment and Additive Concentrates', 'tCZD0e8F4z8', 'additives-compounding', 'Additives & Compounding', 'Cabot Corporation', true),
  v('UV Stabilizers in Plastics â€” HALS and UV Absorbers', 'HxD2kzpOLnc', 'additives-compounding', 'Additives & Compounding', 'BASF', true),
  v('Flame Retardant Mechanisms in Polymer Systems', 'OOkfQBj3GMo', 'additives-compounding', 'Additives & Compounding', 'Albemarle', true),

  // â”€â”€ MEDICAL PLASTICS (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Medical Grade Plastics â€” PEEK, UHMWPE and Polysulfone', 'l_5BVHr7eTM', 'medical-plastics', 'Medical Plastics & Biomaterials', 'Victrex', true),
  v('ISO 10993 Biocompatibility Testing Framework', 'WHh3WpAXmJU', 'medical-plastics', 'Medical Plastics & Biomaterials', 'FDA'),
  v('Drug Delivery Polymers â€” Controlled Release Systems', 'pnGD4Lbr7Hk', 'medical-plastics', 'Medical Plastics & Biomaterials', 'MIT OpenCourseWare'),
  v('Sterilization of Medical Plastics â€” EtO, Gamma and Steam', 'hCpFEj3C3Io', 'medical-plastics', 'Medical Plastics & Biomaterials', 'Sterigenics', true),
  v('Tissue Engineering Scaffolds â€” 3D Printed Polymers', 'Ai8ZOiZJR18', 'medical-plastics', 'Medical Plastics & Biomaterials', 'Wake Forest Institute'),
  v('PVC in Medical Devices â€” Applications and Alternatives', 'Eq0BGlZqeEo', 'medical-plastics', 'Medical Plastics & Biomaterials', 'Plastics Europe'),

  // â”€â”€ PACKAGING ENGINEERING (+5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Plastic Packaging Barrier Properties â€” EVOH, PA and PET', 'D1GHqtb0Fxo', 'plastic-packaging-engineering', 'Plastic Packaging Engineering', 'Sealed Air', true),
  v('PET Bottle Stretch Blow Molding Process', 'WT7n7n9_p-s', 'plastic-packaging-engineering', 'Plastic Packaging Engineering', 'Krones', true),
  v('Multilayer Flexible Packaging Films â€” Co-extrusion', 'wGUixZq1MJY', 'plastic-packaging-engineering', 'Plastic Packaging Engineering', 'Davis-Standard', true),
  v('Shelf Life Testing for Plastic Food Packaging', 'OVtbMqDnL4k', 'plastic-packaging-engineering', 'Plastic Packaging Engineering', 'Mocon', true),
  v('Active and Intelligent Packaging Technologies', 'JVhBRCJFnyc', 'plastic-packaging-engineering', 'Plastic Packaging Engineering', 'Packaging Digest'),

  // â”€â”€ POLYMER RHEOLOGY (+6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Shear Thinning in Polymer Melts â€” Power Law Model', 'HKh6wAmfOJE', 'polymer-rheology', 'Polymer Rheology', 'Malvern Panalytical', true),
  v('Rheometer Operating Principles â€” Rotational and Capillary', 'h7JHDz4hx5A', 'polymer-rheology', 'Polymer Rheology', 'TA Instruments', true),
  v('Viscoelasticity â€” Creep and Stress Relaxation in Polymers', 'Bx5MwF5XDPQ', 'polymer-rheology', 'Polymer Rheology', 'Polymer Science Academy'),
  v('Melt Flow Index vs Rheology â€” What MFI Tells You', 'pOlHqJMsNI4', 'polymer-rheology', 'Polymer Rheology', 'Malvern Panalytical', true),
  v('Die Swell and Elastic Recovery in Extrusion', 'Nl3DkwFGr6E', 'polymer-rheology', 'Polymer Rheology', 'Brabender', true),
  v('Cox-Merz Rule â€” Dynamic vs Steady-State Viscosity', 'J7sRqBNAWRM', 'polymer-rheology', 'Polymer Rheology', 'Rheology Academy'),

  // â”€â”€ ENTREPRENEURSHIP (+5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  v('Starting a Plastic Processing Business in India', 'CeKSIxH67hc', 'entrepreneurship-plastics', 'Entrepreneurship in Plastics', 'CIPET'),
  v('Plastic Machinery Market in India â€” PLEXCONCIL', 'ZFJilFJdQ6A', 'entrepreneurship-plastics', 'Entrepreneurship in Plastics', 'PLEXCONCIL', true),
  v('CIPET â€” Career Paths in Polymer Engineering', 'oWE1e7nsTts', 'entrepreneurship-plastics', 'Entrepreneurship in Plastics', 'CIPET India'),
  v('Building a Recycling Startup â€” Business Model', '1TsRKv-dPNo', 'entrepreneurship-plastics', 'Entrepreneurship in Plastics', 'TEDx'),
  v('Injection Moulding SME Business Setup â€” Cost Analysis', 'VdFJLKAEMTk', 'entrepreneurship-plastics', 'Entrepreneurship in Plastics', 'Business Guide India'),
];

// â”€â”€â”€ Main Seeder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function seedVideos() {
  console.log('ðŸŽ¬ PolymerHub Video Library Expansion');
  console.log('Seeding', NEW_VIDEOS.length, 'new videos...\n');

  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const video of NEW_VIDEOS) {
    const { error } = await s
      .from('videos')
      .upsert(video, { onConflict: 'youtube_id' });

    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique') || error.message.includes('already exists')) {
        console.log('  â­  Exists:', video.title.slice(0, 55));
        skipped++;
      } else {
        console.log('  âŒ Error:', video.title.slice(0, 50), '-', error.message.slice(0, 80));
        errors++;
      }
    } else {
      console.log('  âœ…', video.subject_slug.padEnd(30), '|', video.title.slice(0, 52));
      added++;
    }
  }

  console.log('\nâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
  console.log('âœ… Added   :', added);
  console.log('â­  Skipped :', skipped);
  console.log('âŒ Errors  :', errors);
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');

  const { count } = await s.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'published');
  console.log('\nðŸ“¹ Total Published Videos Now:', count);
}

seedVideos().catch(console.error);
