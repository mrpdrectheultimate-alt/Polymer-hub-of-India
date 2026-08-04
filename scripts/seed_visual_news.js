require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const NEWS_DATA = [
  {
    headline: "Reliance Industries Rolls Out High-Performance PP H100L Grade for EV Battery Pack Housings",
    summary: "New polypropylene grade H100L offers enhanced flame retardancy and high stiffness, facilitating automotive lightweighting in Indian electric vehicles.",
    full_body: "Reliance Industries (RIL) has announced the commercial launch of Repol PP H100L, a specialized polypropylene grade designed for injection moulding EV battery housings. The material features compliance with UL 94 V-0 flame retardancy while retaining impact toughness and high flexural modulus.",
    source_name: "Reliance Industries",
    source_url: "https://www.ril.com",
    image_url: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=600&q=80",
    image_credit: "Photo by Chad Kirchoff on Unsplash",
    category: "Market",
    region: "India",
    related_lesson_slug: "injection-moulding-process-parameters-and-defects",
    related_subject_slug: "polymer-processing",
    is_featured: true,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "MIT Team Synthesizes Graphene-Reinforced Thermosets Exhibiting 40% Increase in Tensile Strength",
    summary: "Researchers use a novel dispersion protocol to embed functionalized graphene into epoxy networks, showing potential for high-load aerospace composites.",
    full_body: "A research team at MIT has successfully developed a process for dispersing graphene nanoplatelets within epoxy systems. The resulting composites demonstrate an increase in mechanical stiffness and tensile strength, bypassing standard aggregation limitations.",
    source_name: "MIT News",
    source_url: "https://news.mit.edu",
    image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80",
    image_credit: "Photo by Hans Reniers on Unsplash",
    category: "Research",
    region: "Global",
    related_lesson_slug: "carbon-fibre-reinforced-polymers-cfrp-aerospace-to-automotive",
    related_subject_slug: "polymer-composites",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "Carbios Advances Enzymatic PET Depolymerization with 10-Tonne Industrial Scale Pilot Facility",
    summary: "Chemical recycling milestone achieved as biological PETase enzymes break down post-consumer bottles into pure monomer building blocks.",
    full_body: "Carbios reports success in their scaling trial of enzymatic recycling in France. The pilot successfully processed 10 tonnes of mixed PET waste back into ethylene glycol and terephthalic acid with yields matching virgin-grade polymerization specifications.",
    source_name: "Sustainable Plastics",
    source_url: "https://www.sustainableplastics.com",
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
    image_credit: "Photo by Alfonso Navarro on Unsplash",
    category: "Recycling",
    region: "Global",
    related_lesson_slug: "enzymatic-and-biological-recycling-the-frontier-technology",
    related_subject_slug: "recycling-technology",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "CIPET Opens Testing Laboratories Supporting BIS IS 13360 Standard Certification in Chennai",
    summary: "New facility assists Indian plastic compounders with certified tensile, impact, and dynamic mechanical analysis (DMA) compliance testing.",
    full_body: "CIPET Chennai has inaugurated its upgraded plastics testing facility. The laboratory provides accredited reports under BIS IS 13360, helping domestic compounders achieve regulatory validation for export and government procurement projects.",
    source_name: "CIPET Chennai",
    source_url: "https://www.cipet.gov.in",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    image_credit: "Photo by Science in HD on Unsplash",
    category: "India",
    region: "India",
    related_lesson_slug: "tensile-and-flexural-testing-measuring-mechanical-strength",
    related_subject_slug: "polymer-testing",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "BIS Issues Stricter Quality Control Amendment for HDPE Pipes Utilized in Jal Jeevan Infrastructure",
    summary: "Amended IS 4984 regulations mandate continuous pressure testing and melt flow index (MFI) consistency audits for rural pipe networks.",
    full_body: "The Bureau of Indian Standards (BIS) has introduced a mandatory amendment to IS 4984 governing high-density polyethylene (HDPE) pressure piping. The revision enforces regular batch validation to eliminate degradation issues on the ground.",
    source_name: "Bureau of Indian Standards",
    source_url: "https://www.bis.gov.in",
    image_url: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&q=80",
    image_credit: "Photo by Ryan Searle on Unsplash",
    category: "Policy",
    region: "India",
    related_lesson_slug: "melt-flow-index-mfi-measurement-significance-and-indian-standards",
    related_subject_slug: "polymer-testing",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "IIT Bombay Formulates Silica-Carbon Black Elastomer Filler System Reducing Tyre Rolling Resistance",
    summary: "Hybrid compound matches global green tyre parameters while lowering dependency on imported structural silica additives.",
    full_body: "Researchers at IIT Bombay have published a study on a new hybrid silica-carbon black filler system. The compound shows a 12% drop in tyre rolling resistance without compromising wet grip properties, facilitating domestic EV tyre manufacturing.",
    source_name: "IIT Bombay Research",
    source_url: "https://www.iitb.ac.in",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    image_credit: "Photo by Robert Laursoo on Unsplash",
    category: "Research",
    region: "India",
    related_lesson_slug: "rubber-compounding-fillers-carbon-black-and-additives",
    related_subject_slug: "rubber-technology",
    is_featured: true,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "NatureWorks Initiates 200,000 Tonne PLA Biopolymer Expansion in Thailand Production Hub",
    summary: "Asia-Pacific set to become major bioplastics manufacturing center as NatureWorks adds lactic acid fermentation capacity.",
    full_body: "NatureWorks has broken ground on its new Ingeo PLA biopolymers plant in Thailand. The site will utilize local sugarcane starch feeds, supplying compostable food packaging grades to Asian markets from 2026.",
    source_name: "PlasticsToday",
    source_url: "https://www.plasticstoday.com",
    image_url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&q=80",
    image_credit: "Photo by David Clode on Unsplash",
    category: "Bioplastics",
    region: "Global",
    related_lesson_slug: "polylactic-acid-pla-synthesis-properties-and-commercial-reality",
    related_subject_slug: "sustainable-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "EU Mandatory Recycled Plastic Target Set to Require 30% rPET Content in Beverage Bottles",
    summary: "Indian exporters prepare for strict compliance audits as EU Packaging and Packaging Waste Regulations approach execution deadlines.",
    full_body: "The European Union has finalized the timeline for mandatory recycled content audits. From 2025, beverage containers sold in EU countries must integrate at least 30% post-consumer recycled plastic, restructuring export supply chains.",
    source_name: "Plastics News Europe",
    source_url: "https://www.plasticsnews.com",
    image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80",
    image_credit: "Photo by Jonathan Chng on Unsplash",
    category: "Sustainability",
    region: "Global",
    related_lesson_slug: "extended-producer-responsibility-epr-and-regulatory-frameworks",
    related_subject_slug: "recycling-technology",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "ISRO Chandrayaan-4 Structures to Integrate Carbon Fibre Composites Mapped for Cryogenic Launch Loads",
    summary: "Tata Advanced Materials secures contract to manufacture high-modulus CFRP panels for the upcoming lunar module design.",
    full_body: "ISRO has partnered with Tata Advanced Materials to produce structural components for Chandrayaan-4. The module utilizes autoclave-cured carbon-epoxy sandwich structures to endure severe vibrations and cryogenic temperature extremes.",
    source_name: "The Hindu BusinessLine",
    source_url: "https://www.thehindubusinessline.com",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    image_credit: "Photo by NASA on Unsplash",
    category: "Innovation",
    region: "India",
    related_lesson_slug: "carbon-fibre-reinforced-polymers-cfrp-aerospace-to-automotive",
    related_subject_slug: "polymer-composites",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "Supreme Industries Registers 14% Pipe Volume Growth Driven by Indian Rural Irrigation Network Bids",
    summary: "PVC and HDPE pipeline manufacturer increases compound throughput to satisfy municipal drinking water network deliveries.",
    full_body: "Supreme Industries reports strong quarterly performance, led by demand in agricultural water management. The firm announces additional compounding line installations at their Maharashtra and Madhya Pradesh processing hubs.",
    source_name: "Business Standard",
    source_url: "https://www.business-standard.com",
    image_url: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&q=80",
    image_credit: "Photo by Bruno Kelzer on Unsplash",
    category: "India",
    region: "India",
    related_lesson_slug: "the-plastics-entrepreneurship-landscape-in-india-why-your-degree-is-the-moat",
    related_subject_slug: "entrepreneurship-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "BASF Launches ChemCycling Chemical Pyrolysis Program for High-Purity Automotive Polymers",
    summary: "BASF utilizes pyrolysis oil derived from mixed plastic waste to manufacture virgin-grade engineering polymers for car safety structures.",
    full_body: "BASF has expanded its ChemCycling program, processing post-consumer plastic waste via pyrolysis to create high-purity monomer streams. These are re-introduced at the start of polymerization reactors, bypassing sorting limitations.",
    source_name: "BASF Global Press",
    source_url: "https://www.basf.com",
    image_url: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&q=80",
    image_credit: "Photo by Terry Vlisidis on Unsplash",
    category: "Recycling",
    region: "Global",
    related_lesson_slug: "chemical-recycling-pyrolysis-depolymerization-and-solvolysis",
    related_subject_slug: "recycling-technology",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "Indian Government Announces Phase-Out Plan for Non-Compostable Mulch Films in Agricultural Sectors",
    summary: "Ministry enforces guidelines promoting PBAT and PLA-based biodegradable agricultural barrier structures across state farms.",
    full_body: "The Ministry of Agriculture has outlined a phased reduction program for traditional thin LDPE mulch films. Compounding standards are being updated to subsidize biodegradable alternatives that decay naturally under microbial action.",
    source_name: "Press Information Bureau India",
    source_url: "https://pib.gov.in",
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
    image_credit: "Photo by Sandeep Kr on Unsplash",
    category: "Policy",
    region: "India",
    related_lesson_slug: "controlled-composting-biodegradation-by-co2-respirometry",
    related_subject_slug: "sustainable-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "Evonik Expands PEBA Elastomer Production for Precision Athletic Wear and Medical Device Tubing",
    summary: "New polyether block amide copolymer expansion supports high-elasticity athletic and biocompatible medical component markets.",
    full_body: "Evonik announces capacity expansion of its PEBA copolymer lines. The material offers high chemical resistance, bio-compatibility, and outstanding low-temperature flexibility, matching clinical device requirements.",
    source_name: "Medical Plastics News",
    source_url: "https://www.medicalplasticsnews.com",
    image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80",
    image_credit: "Photo by National Cancer Institute on Unsplash",
    category: "Innovation",
    region: "Global",
    related_lesson_slug: "key-medical-grade-polymers-properties-applications-and-selection",
    related_subject_slug: "medical-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "Plastiblends India Targets Biodegradable Additives Market with Specialized Starch-PLA Masterbatches",
    summary: "Indian masterbatch pioneer launches concentrates to assist plastic processors in upgrading standard film lines.",
    full_body: "Plastiblends India has launched a new family of masterbatches designed for PLA and PBAT formulations. The additives maintain pigment dispersion consistency while meeting compostability standards under IS/ISO 17088.",
    source_name: "Plastiblends Investor Portal",
    source_url: "https://www.plastiblends.com",
    image_url: "https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80",
    image_credit: "Photo by Marc Newberry on Unsplash",
    category: "Sustainability",
    region: "India",
    related_lesson_slug: "bioplastics-synthesis-compostability-and-standards",
    related_subject_slug: "sustainable-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  },
  {
    headline: "DuPont Extends ISO 10993 Compliance Certification Testing Matrix for Implantable PEEK Copolymers",
    summary: "Clinical updates provide complete cytotoxicity and systemic toxicity validation data for long-term orthopaedic implants.",
    full_body: "DuPont has completed the ISO 10993 series biocompatibility certification for its high-performance polyetheretherketone (PEEK) compounds. The research provides data on tissue integration, making it ideal for orthopaedic implant designers.",
    source_name: "Polymer Materials Today",
    source_url: "https://www.materialstoday.com",
    image_url: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&q=80",
    image_credit: "Photo by Jesse Orrico on Unsplash",
    category: "Research",
    region: "Global",
    related_lesson_slug: "implantable-polymers-and-biodegradable-medical-devices",
    related_subject_slug: "medical-plastics",
    is_featured: false,
    editorial_status: "published",
    publish_date: new Date().toISOString().split('T')[0]
  }
];

async function seedVisualNews() {
  console.log('=== SEEDING 15 VISUAL NEWS & INTELLIGENCE ENTRIES ===');

  // Let's delete all existing daily updates first to ensure a clean 15 visual updates set
  const { error: deleteError } = await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Failed to clean daily_updates table:', deleteError.message);
  }

  let count = 0;
  for (const item of NEWS_DATA) {
    const { error } = await supabase.from('daily_updates').insert(item);
    if (error) {
      console.error(`  Failed to insert "${item.headline}":`, error.message);
    } else {
      console.log(`  Seeded news item: "${item.headline}"`);
      count++;
    }
  }

  console.log(`\n✅ Seeding complete. ${count} visual news items inserted.`);
}

seedVisualNews();
