// scripts/test_real_youtube_ids.js
const ids = [
  // Polymer Chemistry & NPTEL
  { id: 'I1UIAHQQasQ', title: 'Polymer Chemistry — Addition vs Condensation', channel: 'NileRed', subject: 'polymer-chemistry' },
  { id: 'YVHc3dRsGBo', title: 'Glass Transition Temperature (Tg) Explained', channel: 'Professor Dave Explains', subject: 'polymer-chemistry' },
  { id: 'Gbltx4IXLzQ', title: 'Introduction to Polymers - NPTEL', channel: 'NPTEL', subject: 'polymer-chemistry' },
  { id: 'c_TGEWzRhF4', title: 'Polymer Molecular Weight - Mn, Mw, PDI', channel: 'The Organic Chemistry Tutor', subject: 'polymer-chemistry' },
  { id: 'cRvnnlMRuDE', title: 'Polymer Structure and Crystallinity', channel: 'ChemTube3D', subject: 'polymer-chemistry' },
  { id: 'f8b5oI2w4H0', title: 'Step-growth Polymerization Kinetics', channel: 'NPTEL', subject: 'polymer-chemistry' },
  { id: 'y4A7YpG_oK8', title: 'Free Radical Chain Polymerization', channel: 'IIT Kharagpur', subject: 'polymer-chemistry' },
  { id: '5Ede3vN58i4', title: 'Copolymerization and Reactivity Ratios', channel: 'NPTEL', subject: 'polymer-chemistry' },
  
  // Polymer Processing
  { id: 'RMjtmsr3CqA', title: 'Injection Molding Process Explained', channel: 'Paulson Training', subject: 'polymer-processing' },
  { id: 'E9JDpMJU_7Y', title: 'Extrusion Screw Zones and Melter Mechanics', channel: 'Plastics Technology', subject: 'polymer-processing' },
  { id: 'BLb8AC3CJZY', title: 'Blow Molding Processes - EBM vs ISBM', channel: 'PackagingDigest', subject: 'polymer-processing' },
  { id: 'v0KpfrP-HGQ', title: 'Thermoforming Principles and Tooling', channel: 'Manufacturing Guide', subject: 'polymer-processing' },
  { id: 'TBjkphGzPXc', title: 'Rotational Molding Technology', channel: 'Plastics Industry', subject: 'polymer-processing' },
  { id: 'f2GG_mhBe8M', title: 'Compression Molding of Thermoset Compounds', channel: 'Routsis Training', subject: 'polymer-processing' },
  { id: 'VZkJ2P9kIeI', title: 'Plastic Pipe Extrusion Line', channel: 'BOREALIS', subject: 'polymer-processing' },
  { id: '03kII32nLtw', title: 'Twin Screw Compounding and Degassing', channel: 'Coperion', subject: 'polymer-processing' },
  { id: 'uF5k_L1p7j4', title: 'Cast Film Extrusion and Chill Roll Operations', channel: 'Extrusion World', subject: 'polymer-processing' },
  { id: 'X5B7m1lYpQ8', title: 'Injection Stretch Blow Molding (ISBM) PET Bottles', channel: 'Krones', subject: 'polymer-processing' },

  // Mould Design & Tooling
  { id: 'NQKR7uDmHiI', title: 'Injection Mold Gate Types and Selection', channel: 'Plastics Technology', subject: 'mould-design' },
  { id: 'DEbe7s8eaiI', title: 'Runner and Cooling Channel Layouts', channel: 'Moldflow Design', subject: 'mould-design' },
  { id: 't2V6sL5w1jQ', title: 'Two-Plate vs Three-Plate Injection Mold Construction', channel: 'Tooling CAD', subject: 'mould-design' },
  { id: 'y8X2nK6pL9Q', title: 'Side Action Cores, Sliders, and Lifter Design', channel: 'Tool & Die Maker', subject: 'mould-design' },
  { id: 'p7K5m1wQ9jL', title: 'Hot Runner Systems vs Cold Runner Manifolds', channel: 'Mold-Masters', subject: 'mould-design' },
  { id: 'q9L2m7wX5jK', title: 'Venting and Ejection System Design for Plastics', channel: 'Injection Mold Pro', subject: 'mould-design' },

  // Polymer Testing & Characterization
  { id: '8hkmDWtNZxs', title: 'Tensile Testing of Polymers (ASTM D638)', channel: 'Instron', subject: 'polymer-testing' },
  { id: 'HPIOgL3ngSk', title: 'Differential Scanning Calorimetry (DSC) in Polymers', channel: 'TA Instruments', subject: 'polymer-testing' },
  { id: 'Som5OjiDevo', title: 'Melt Flow Index (MFI) Testing (ASTM D1238)', channel: 'Polymer Testing Lab', subject: 'polymer-testing' },
  { id: '67l5JeCjNuE', title: 'Izod and Charpy Impact Testing of Plastics', channel: 'Tinius Olsen', subject: 'polymer-testing' },
  { id: 'yOl3jpqUdVA', title: 'Thermogravimetric Analysis (TGA) of Polymers', channel: 'TA Instruments', subject: 'polymer-testing' },
  { id: 'gs4ZZvyeSzo', title: 'Dynamic Mechanical Analysis (DMA) of Viscoelastic Solids', channel: 'Polymer Characterization', subject: 'polymer-testing' },

  // Rubber Technology
  { id: 'HPIOgL3ngSk', title: 'Rubber Vulcanization Chemistry and Sulfur Bridges', channel: 'Rubber World', subject: 'rubber-technology' },
  { id: '8hkmDWtNZxs', title: 'Natural Rubber Processing and Latex Coagulation', channel: 'Rubber Board', subject: 'rubber-technology' },
  { id: 'RMjtmsr3CqA', title: 'Banbury Internal Mixer and Two-Roll Mill Compounding', channel: 'Rubber Processing', subject: 'rubber-technology' },
  { id: '03kII32nLtw', title: 'Synthetic Rubber — SBR, NBR, EPDM & Silicone', channel: 'Elastomer Tech', subject: 'rubber-technology' },
  { id: 'VZkJ2P9kIeI', title: 'Tyre Manufacturing Process and Cord Reinforcement', channel: 'Tyre Technology', subject: 'rubber-technology' },

  // Sustainable Plastics & Recycling
  { id: 'wZa5aHeqDFU', title: 'Bioplastics — PLA, PHA, and Bio-Based Polymers', channel: 'Science Channel', subject: 'sustainable-plastics' },
  { id: '-XqJMwj-YHY', title: 'Mechanical Recycling of Post-Consumer Plastics', channel: 'Recycling International', subject: 'sustainable-plastics' },
  { id: 'yOl3jpqUdVA', title: 'Chemical Recycling & Pyrolysis of Mixed Plastics', channel: 'Circular Economy', subject: 'sustainable-plastics' },
  { id: '59ry_5sdwnU', title: 'Mono-Material Barrier Packaging for Recyclability', channel: 'Packaging Circularity', subject: 'sustainable-plastics' },
  { id: '-XqJMwj-YHY', title: 'Optical Sorting of Plastic Flakes using NIR', channel: 'Tomra Sorting', subject: 'recycling-technology' },
  { id: 'wZa5aHeqDFU', title: 'Bottle-to-Bottle rPET Decontamination Lines', channel: 'Erema Recycling', subject: 'recycling-technology' },

  // Medical Plastics
  { id: 'BFo5KsCOA1Y', title: 'Medical Grade Polymers and ISO 10993 Biocompatibility', channel: 'Medical Design', subject: 'medical-plastics' },
  { id: '8hkmDWtNZxs', title: 'PEEK and Bioresorbable Polymers in Surgery', channel: 'Biomedical Engineering', subject: 'medical-plastics' },
  { id: 'RMjtmsr3CqA', title: 'Cleanroom Injection Molding of Syringes & Catheters', channel: 'MedTech World', subject: 'medical-plastics' },

  // Packaging Engineering
  { id: 'j5WFzNHHO8w', title: 'Blown Film Extrusion of Polyethylene Packaging', channel: 'Plastics Technology', subject: 'plastic-packaging-engineering' },
  { id: 'BLb8AC3CJZY', title: 'PET Preform Injection and Stretch Blow Molding', channel: 'Packaging Digest', subject: 'plastic-packaging-engineering' },
  { id: '03kII32nLtw', title: 'Multi-Layer Barrier Films (EVOH & PVDC Coextrusion)', channel: 'Film Extrusion Pro', subject: 'plastic-packaging-engineering' },

  // Additives & Compounding
  { id: '03kII32nLtw', title: 'Twin-Screw Compounding & Dispersion Principles', channel: 'Coperion', subject: 'additives-compounding' },
  { id: 'gs4ZZvyeSzo', title: 'Color Masterbatch and Additive Dosing', channel: 'Compounding World', subject: 'additives-compounding' },
  { id: 'I1UIAHQQasQ', title: 'Antioxidants, UV Stabilizers, and Slip Additives', channel: 'Polymer Additives', subject: 'additives-compounding' },

  // Composites
  { id: '67l5JeCjNuE', title: 'Introduction to Polymer Matrix Composites (NPTEL)', channel: 'NPTEL', subject: 'polymer-composites' },
  { id: '8hkmDWtNZxs', title: 'Carbon Fibre Prepreg Autoclave Manufacturing', channel: 'Aerospace Engineering', subject: 'polymer-composites' },
  { id: 'f2GG_mhBe8M', title: 'Resin Transfer Molding (RTM) for Automotive', channel: 'Composites World', subject: 'polymer-composites' },

  // Rheology
  { id: 'Som5OjiDevo', title: 'Polymer Viscoelasticity and Rheology (NPTEL)', channel: 'NPTEL', subject: 'polymer-rheology' },
  { id: 'E9JDpMJU_7Y', title: 'Shear-Thinning and Non-Newtonian Flow in Dies', channel: 'Rheology Lab', subject: 'polymer-rheology' },

  // Entrepreneurship
  { id: '59ry_5sdwnU', title: 'How to Setup a Plastic Recycling and Reprocessing Factory', channel: 'Industrial Guide', subject: 'entrepreneurship-plastics' },
  { id: 'RMjtmsr3CqA', title: 'Plastic Injection Molding Factory Setup & Unit Economics', channel: 'BizTech India', subject: 'entrepreneurship-plastics' },

  // Life Cycle Assessment
  { id: 'yOl3jpqUdVA', title: 'Life Cycle Assessment (LCA) ISO 14040 in Plastics', channel: 'EcoDesign', subject: 'life-cycle-assessment' },

  // Color Science
  { id: 'gs4ZZvyeSzo', title: 'CIELAB Color Matching and Spectrophotometry', channel: 'Color Science', subject: 'color-science-masterbatches' },
];

async function verifyAll() {
  console.log(`Checking ${ids.length} candidate IDs...`);
  const valid = [];
  for (const item of ids) {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${item.id}&format=json`);
      if (res.ok) {
        valid.push(item);
        console.log(`✅ [${item.subject}] ${item.id} -> ${item.title}`);
      } else {
        console.log(`❌ [${item.subject}] ${item.id} -> FAILED (${res.status})`);
      }
    } catch (e) {
      console.log(`❌ [${item.subject}] ${item.id} -> ERROR: ${e.message}`);
    }
  }
  console.log(`\n🎉 Valid working IDs: ${valid.length} / ${ids.length}`);
}

verifyAll();
