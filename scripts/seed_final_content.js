// scripts/seed_final_content.js
// Seeds the remaining content-hungry pages:
//   1. forum_questions  (0 → 15 seeded Q&A threads)
//   2. career_listings  (5 → 20 job listings)
//   3. patents          (5 → 15 Indian polymer patents)
//   4. mentorship_profiles (6 → 15 mentors)

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getAdminId() {
  const { data } = await s.from('profiles').select('id').limit(1);
  return data?.[0]?.id;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. FORUM QUESTIONS
// forum_questions: id, user_id, subject_id, lesson_id, title, body, tags,
//                 upvotes, answer_count, is_resolved, is_pinned
// ─────────────────────────────────────────────────────────────────────────────
async function seedForumQuestions(adminId) {
  console.log('\n💬 Seeding forum_questions...');
  await s.from('forum_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const questions = [
    {
      user_id: adminId, subject_id: null, title: 'What is the difference between MFI and MFR in polymer testing?',
      body: 'I keep seeing both "Melt Flow Index (MFI)" and "Melt Flow Rate (MFR)" used interchangeably in datasheets and textbooks. Are they the same thing? Which standard governs each and which load conditions are used for PP vs PE vs PA? Our lab uses both ASTM D1238 and ISO 1133 and I want to understand when to use which.',
      tags: ['polymer-testing', 'MFI', 'MFR', 'ASTM', 'ISO'], upvotes: 24, answer_count: 3, is_resolved: true, is_pinned: true,
    },
    {
      user_id: adminId, subject_id: null, title: 'How to calculate gate size for a thin-wall PP packaging part?',
      body: 'I am designing a 0.8 mm wall thickness PP yoghurt cup lid (projected area ~180 cm2, volume ~12 cc) and am struggling to size the edge gate correctly. How do I balance fill speed, gate freeze time, and avoiding jetting? Our machine is a 130-ton with 35 mm screw. Any formula or rule of thumb would help.',
      tags: ['mould-design', 'gate-design', 'injection-moulding', 'thin-wall'], upvotes: 18, answer_count: 2, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'What causes sink marks in thick PP ribs and how to fix them?',
      body: 'We are getting sink marks on the visible A-surface directly opposite thick reinforcing ribs on a PP automotive trim piece. Rib thickness is currently 0.7x wall, rib height is 20mm. We have tried increasing pack pressure and extending pack time but the sink marks are still visible after painting. What else can we do without changing the tool?',
      tags: ['injection-moulding', 'sink-marks', 'defects', 'PP'], upvotes: 31, answer_count: 4, is_resolved: true, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'GATE 2025 Polymer Paper — Topic weightage and preparation strategy',
      body: 'I am appearing for GATE 2025 in XE-F (Polymer Science & Engineering) and want to understand the topic-wise mark distribution based on previous years. From what I have seen, Polymer Chemistry gets the most questions. Should I prioritize Mechanical Properties and Testing equally? Also which reference books do most toppers recommend — Odian or Billmeyer?',
      tags: ['GATE', 'exam-prep', 'polymer-science'], upvotes: 47, answer_count: 6, is_resolved: true, is_pinned: true,
    },
    {
      user_id: adminId, subject_id: null, title: 'Can PLA be used for food-contact applications in India — what certifications are needed?',
      body: 'We want to use PLA for single-use cutlery and food trays for a cloud kitchen startup. I know PLA is compostable but I am confused about food-contact safety. Does PLA need FSSAI approval in India? What about migration testing? Our manufacturer says their PLA is FDA-compliant but does that apply to the Indian market? We need to be ready for FSSAI inspection.',
      tags: ['PLA', 'bioplastics', 'food-contact', 'FSSAI', 'regulation'], upvotes: 29, answer_count: 3, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'Nylon 6 vs Nylon 66 — which should I choose for an automotive under-hood bracket?',
      body: 'We are selecting material for an engine bay bracket that needs to survive continuous 120C with peak excursions to 150C. It will be 30% glass-fibre reinforced. HDT (at 1.82 MPa) needs to be above 200C. The bracket has living hinges so some fatigue resistance is needed. Is PA6-GF30 sufficient or should I pay the premium for PA66-GF30? What about heat-stabilized grades?',
      tags: ['PA6', 'PA66', 'nylon', 'automotive', 'material-selection'], upvotes: 22, answer_count: 2, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'How does a Ziegler-Natta catalyst produce isotactic polypropylene?',
      body: 'I understand that Ziegler-Natta catalysts produce stereospecific polymers but I am struggling to visualize the actual mechanism. How does the TiCl4/MgCl2 surface with AlEt3 cocatalyst actually force the propylene monomer to insert in a controlled orientation? And what internal donors (phthalate, succinate, diether) do — do they improve selectivity or productivity? Looking for a clear explanation for my GATE preparation.',
      tags: ['polymer-chemistry', 'Ziegler-Natta', 'polypropylene', 'stereochemistry', 'GATE'], upvotes: 38, answer_count: 4, is_resolved: true, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'Best practices for drying PET before injection moulding — temperature and time?',
      body: 'We are moulding PET preforms for 600 ml water bottles. Our material supplier says dry at 160C for 4 hours but our operator says 150C for 6 hours is safer. We have been getting haze and splay in some runs which I suspect is moisture-related. What moisture content (ppm) do we need to target before moulding? We have a desiccant hopper dryer with -40C dewpoint.',
      tags: ['PET', 'drying', 'injection-moulding', 'moisture', 'preform'], upvotes: 15, answer_count: 2, is_resolved: true, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'What is the difference between LDPE, LLDPE, and HDPE — when to use which?',
      body: 'I am a first year polymer engineering student and I am confused by the PE family. I know they are all polyethylene but the properties and applications seem very different. Can someone explain the structural differences (branching, density, crystallinity) and give practical examples of when each type is preferred? For example, why do carry bags use LDPE but water pipes use HDPE?',
      tags: ['polyolefin', 'LDPE', 'LLDPE', 'HDPE', 'beginner'], upvotes: 52, answer_count: 5, is_resolved: true, is_pinned: true,
    },
    {
      user_id: adminId, subject_id: null, title: 'How to interpret a GPC (SEC) chromatogram — Mn, Mw, and PDI explained',
      body: 'We ran GPC on our LDPE sample and got a chromatogram with Mn = 45,000, Mw = 180,000. I understand these are average molecular weights but I do not know how to interpret what PDI of 4.0 means for our application (blown film). Is this PDI good or bad for film processing? How does PDI relate to MFI? What would a narrow PDI sample look like on the chromatogram?',
      tags: ['GPC', 'molecular-weight', 'PDI', 'polymer-testing', 'film'], upvotes: 19, answer_count: 2, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'Which recycling process is better for PET — mechanical or chemical (glycolysis)?',
      body: 'We run a PET collection and recycling business in Hyderabad. Currently we do mechanical recycling (wash → grind → extrude → pelletize). But we are getting inquiries from brand owners wanting food-grade rPET which needs bottle-to-bottle quality. I have heard glycolysis can upgrade the quality. What is the actual difference in output quality, capital investment, and operating cost between mechanical and glycolysis routes? Is glycolysis viable at 5 TPD scale?',
      tags: ['recycling', 'PET', 'rPET', 'glycolysis', 'mechanical-recycling'], upvotes: 27, answer_count: 3, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'How to set up a cooling time calculation for a thick-walled PC lens?',
      body: 'I am moulding a 6 mm wall thickness PC optical lens for an automotive headlamp. My current cycle time is 95 seconds and cooling is 70 seconds. The mould is water-cooled at 80C. I want to reduce cycle time — can I lower mould temperature? I am worried about residual stress and birefringence in the lens if I cool too fast. Is there a formula to calculate minimum safe cooling time for PC? What is the role of Ejection Temperature?',
      tags: ['polycarbonate', 'cooling-time', 'cycle-time', 'optical', 'lens'], upvotes: 16, answer_count: 1, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'Can someone explain the cure curve from MDR rheometer for a rubber compound?',
      body: 'I am a rubber technologist trainee and just ran my first MDR test on an NR compound. I got MH = 18.2 dNm, ML = 2.4 dNm, T10 = 3.2 min, T90 = 12.5 min at 160C. My supervisor told me the T90 is too high for our compression moulding press. What does each value mean practically and how do I adjust the compound formulation to bring T90 down to under 8 minutes without causing scorch issues?',
      tags: ['rubber', 'MDR', 'vulcanization', 'cure-curve', 'NR'], upvotes: 34, answer_count: 3, is_resolved: true, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'How to start a plastics recycling startup in India — licences and approvals needed?',
      body: 'I want to start a small PET bottle washing and recycling plant in Pune with capacity 500 kg per day. I am a third year polymer engineering student and want to start this after graduation. What licences do I need (CPCB, state PCB, GST, etc.)? Do I need to register as an EPR PRO? What is the minimum capital required? Are there any government grants or MSME schemes for recycling startups?',
      tags: ['entrepreneurship', 'recycling', 'startup', 'India', 'CPCB'], upvotes: 43, answer_count: 5, is_resolved: false, is_pinned: false,
    },
    {
      user_id: adminId, subject_id: null, title: 'Warpage in glass-filled PA66 automotive connector — root cause and fix?',
      body: 'We are producing a PA66-GF35 electrical connector (complex geometry, 45 x 30 x 12 mm) for automotive use and getting 0.4 mm warpage on the mating face that causes seal leakage. We are moulding at 290C melt, 90C mould. Gate is a 1.2 mm pinpoint in the centre. Two symmetric cooling circuits. Moldflow shows fibre orientation anisotropy as the culprit. What are my options? Can I fix this with process changes alone or do I need to redesign the gate?',
      tags: ['warpage', 'PA66', 'glass-fibre', 'Moldflow', 'connector'], upvotes: 21, answer_count: 2, is_resolved: false, is_pinned: false,
    },
  ];

  const { data, error } = await s.from('forum_questions').insert(questions).select('id, title');
  if (error) { console.error('  ❌ Error:', error.message); return 0; }
  console.log(`  ✅ Inserted ${data.length} forum questions`);
  return data.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CAREER LISTINGS (5 → 20)
// career_listings: id, title, company, location, type, salary, description,
//                  application_url, subject_slug, created_at
// ─────────────────────────────────────────────────────────────────────────────
async function seedCareerListings() {
  console.log('\n💼 Seeding career_listings (expansion)...');
  const existing = await s.from('career_listings').select('title');
  const existingTitles = new Set((existing.data ?? []).map(c => c.title));

  const listings = [
    { title: 'Senior Polymer Process Engineer', company: 'Reliance Industries Ltd.', location: 'Jamnagar, Gujarat', type: 'full-time', salary: '₹18–28 LPA', description: 'Lead process optimization for HDPE and PP production lines at the Jamnagar complex. Responsibilities include SPC implementation, capacity debottlenecking, and coordination with R&D for new grade development. Requires 5+ years in polyolefin processing, BE/BTech Polymer/Chemical Engineering.', application_url: 'https://ril.com/careers', subject_slug: 'polymer-processing' },
    { title: 'Product Development Engineer — Automotive Plastics', company: 'Motherson Sumi Systems', location: 'Noida, Uttar Pradesh', type: 'full-time', salary: '₹10–16 LPA', description: 'Develop and validate new polymer compounds and grades for interior and exterior automotive applications. Work with OEM material approval processes (Ford WSS, GM GMW, VW TL226). Knowledge of PP, ABS, PC/ABS, TPO required. CAMPUS database experience preferred.', application_url: 'https://motherson.com/careers', subject_slug: 'polymer-chemistry' },
    { title: 'Mould Design Engineer — CAD/CAM Specialist', company: 'Hikal Ltd.', location: 'Pune, Maharashtra', type: 'full-time', salary: '₹8–14 LPA', description: 'Design injection moulds for pharmaceutical and chemical industry components. Proficiency in Solidworks or CATIA V5 required. Knowledge of hot runner systems, side actions, and DFM principles. Conduct Moldflow simulations for gate location and cooling circuit design. 3+ years experience preferred.', application_url: null, subject_slug: 'mould-design' },
    { title: 'Rubber Technologist — Tyre Compounding', company: 'Apollo Tyres Ltd.', location: 'Vadodara, Gujarat', type: 'full-time', salary: '₹8–13 LPA', description: 'Develop and optimize rubber compound formulations for tyre tread, sidewall, and inner liner applications. Conduct Mooney viscosity, MDR, and DIN abrasion testing. Knowledge of silica-TESPT wet grip compounds preferred. 2+ years in rubber compounding required.', application_url: 'https://apollotyres.com/careers', subject_slug: 'rubber-technology' },
    { title: 'Quality Control Engineer — Polymer Testing Lab', company: 'CIPET: Institute of Petrochemicals Technology', location: 'Chennai, Tamil Nadu', type: 'full-time', salary: '₹5–8 LPA', description: 'Conduct mechanical, thermal (DSC, TGA, HDT), and rheological testing on polymer samples for industry clients. Operate universal testing machine, impact tester, and melt flow indexer. NABL lab accreditation audit support. BE Polymer Engineering required.', application_url: 'https://cipet.gov.in/careers', subject_slug: 'polymer-testing' },
    { title: 'R&D Scientist — Sustainable Packaging Materials', company: 'Huhtamaki India', location: 'Mumbai, Maharashtra', type: 'full-time', salary: '₹12–20 LPA', description: 'Lead development of compostable and recyclable flexible packaging solutions. Experience with PLA, PBAT, bio-PE film processing required. Life Cycle Assessment (LCA) knowledge preferred. MSc/MTech Polymer/Materials Science, 3+ years industry R&D experience.', application_url: 'https://huhtamaki.com/careers', subject_slug: 'sustainable-plastics' },
    { title: 'Blown Film Process Technician', company: 'Supreme Industries', location: 'Gadegaon, Maharashtra', type: 'full-time', salary: '₹3.5–5 LPA', description: 'Operate and troubleshoot 3-layer blown film lines producing LDPE/LLDPE packaging films. Set process parameters, manage film gauge control, conduct thickness and dart impact testing. ITI/Diploma in Plastics Technology required, 2+ years blown film experience.', application_url: 'https://supremeindustries.co.in/careers', subject_slug: 'polymer-processing' },
    { title: 'Application Development Intern — Engineering Plastics', company: 'BASF India', location: 'Mumbai, Maharashtra', type: 'internship', salary: '₹25,000/month stipend', description: '6-month internship supporting application development of Ultramid (Nylon), Ultradur (PBT), and Ultraform (POM) grades for Indian automotive and electronics customers. Assist with customer sample processing, testing, and technical report writing. BE/BTech final year students eligible.', application_url: 'https://basf.com/india/careers', subject_slug: 'polymer-chemistry' },
    { title: 'Medical Plastics Quality Assurance Officer', company: 'Poly Medicure Ltd.', location: 'Faridabad, Haryana', type: 'full-time', salary: '₹6–10 LPA', description: 'Ensure quality compliance of injection-moulded medical plastic components (IV sets, syringes, catheter components) to ISO 13485 and ISO 10993 standards. Conduct incoming material inspection, in-process quality checks, and final product validation. Knowledge of medical grade PP, PC, TPE required.', application_url: 'https://polymedicure.com/careers', subject_slug: 'medical-plastics' },
    { title: 'Extrusion Process Engineer — PVC Pipes', company: 'Astral Pipes', location: 'Ahmedabad, Gujarat', type: 'full-time', salary: '₹7–12 LPA', description: 'Manage uPVC and CPVC pipe extrusion lines (IS 4985, IS 15778). Optimize compound formulations (stabiliser, lubricant, impact modifier loading), screw geometry, and die design for dimensional accuracy. Coordinate with PVC compound suppliers for stabiliser system selection. 3+ years uPVC pipe extrusion experience.', application_url: 'https://astralpipes.com/careers', subject_slug: 'polymer-processing' },
    { title: 'Polymer Composites Research Associate', company: 'IIT Bombay — DESE', location: 'Mumbai, Maharashtra', type: 'contract', salary: '₹35,000–50,000/month', description: 'Work on SERB-funded project on halloysite nanotube-reinforced polymer nanocomposites. Responsibilities: twin-screw compounding, SEM/TEM characterization, mechanical property evaluation. MSc/MTech Materials/Polymer required. Contract initially 1 year, extendable.', application_url: 'https://dese.iitb.ac.in', subject_slug: 'polymer-composites' },
    { title: 'Plastic Recycling Plant Manager', company: 'Ganesha Ecosphere Ltd.', location: 'Kanpur, Uttar Pradesh', type: 'full-time', salary: '₹10–16 LPA', description: 'Manage a 30-tonne/day PET bottle washing and rPET pelletizing plant. Oversee collection logistics, input quality control, process optimization, and product quality (IV, colour, contamination levels). CPCB EPR compliance reporting. 5+ years polymer processing or recycling plant management.', application_url: 'https://ganeshaecosphere.com/careers', subject_slug: 'recycling-technology' },
    { title: 'Technical Sales Engineer — Masterbatch', company: 'Cabot Specialty Fluids India', location: 'Mumbai (Pan-India travel)', type: 'full-time', salary: '₹8–14 LPA + incentives', description: 'Develop and manage technical sales of carbon black masterbatches for PE pipe, film, and moulding customers. Provide technical support on loading levels, dispersion quality, and UV stability. BS/BTech Polymer + 2 years sales or application development experience. Fluency in English + Hindi/Gujarati preferred.', application_url: null, subject_slug: 'polymer-additives' },
    { title: 'Polymer Rheology Lab Scientist', company: 'Lanxess India', location: 'Thane, Maharashtra', type: 'full-time', salary: '₹9–14 LPA', description: 'Conduct capillary rheometry, rotational rheometry, and extensional flow characterization of rubber and engineering polymer compounds. Build viscosity-temperature-shear rate databases. Collaborate with global R&D for rubber processing aid development. MSc Physical Chemistry or MTech Polymer Science preferred.', application_url: 'https://lanxess.com/careers', subject_slug: 'polymer-rheology' },
    { title: 'Injection Moulding Machine Operator — Fresher', company: 'Finolex Industries', location: 'Pune, Maharashtra', type: 'full-time', salary: '₹2.5–3.5 LPA', description: 'Entry-level machine operator role for PVC electrical fittings injection moulding. Operate 50-300 ton machines, perform first article inspection, maintain cycle time logs. Diploma in Plastics/Mechanical required. Freshers welcome — structured 6-month training programme included.', application_url: 'https://finolex.com/careers', subject_slug: 'polymer-processing' },
  ].filter(c => !existingTitles.has(c.title));

  if (listings.length === 0) { console.log('  ✅ No new listings needed'); return 0; }
  const { data, error } = await s.from('career_listings').insert(listings).select('id, title');
  if (error) { console.error('  ❌ Error:', error.message); return 0; }
  console.log(`  ✅ Inserted ${data.length} career listings (total now ~${data.length + (existing.data?.length ?? 0)})`);
  return data.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATENTS (5 → 15)
// patents: id, patent_number, title, inventors, assignee, filing_date,
//          publication_date, status, abstract, claims[], jurisdiction, subject_slug
// ─────────────────────────────────────────────────────────────────────────────
async function seedPatents() {
  console.log('\n🔏 Seeding patents (expansion)...');
  const existing = await s.from('patents').select('patent_number');
  const existingNos = new Set((existing.data ?? []).map(p => p.patent_number));

  const patents = [
    { patent_number: 'IN202021012345', title: 'Enzymatic Depolymerization of PET Using Engineered IsPETase Variants at Ambient Temperature', inventors: 'Sharma, R.K.; Krishnamurthy, S.; Patel, A.', assignee: 'Indian Institute of Technology Bombay', filing_date: '2020-03-15', publication_date: '2021-09-03', status: 'granted', abstract: 'A method for enzymatic depolymerization of polyethylene terephthalate (PET) using engineered variants of IsPETase enzyme produced from Ideonella sakaiensis, achieving >90% monomer recovery at 30-40 degrees C within 24 hours, suitable for bottle-grade PET recycling.', claims: ['Engineered IsPETase variant with W159H and S238F substitutions', 'Process at pH 7.0-8.0, 30-40C', 'Application to post-consumer PET bottles and films', 'Monomer recovery (TPA + EG) by filtration and crystallization'], jurisdiction: 'India', subject_slug: 'recycling-technology' },
    { patent_number: 'IN202111034567', title: 'Halloysite Nanotube Surface Modification for Polymer Nanocomposite Applications', inventors: 'Gupta, M.; Singh, P.; Rao, K.V.', assignee: 'National Chemical Laboratory, Pune', filing_date: '2021-05-20', publication_date: '2022-11-15', status: 'published', abstract: 'A method for surface modification of halloysite nanotubes (HNT) using 3-aminopropyltriethoxysilane (APTES) and subsequent compatibilization with PA6 matrix to achieve 45% improvement in tensile strength and 60% improvement in barrier properties compared to unfilled PA6.', claims: ['APTES functionalization of HNT lumen and surface', 'Melt compounding at 240C with PA6', 'Nanocomposite with 3-5 wt% HNT loading', 'Application to food packaging multilayer films'], jurisdiction: 'India', subject_slug: 'polymer-composites' },
    { patent_number: 'US10987654B2', title: 'Self-Healing Epoxy Coating System with Microencapsulated DCPD Healing Agent', inventors: 'White, S.R.; Sottos, N.R.; Moore, J.S.', assignee: 'University of Illinois Board of Trustees', filing_date: '2018-06-12', publication_date: '2020-04-21', status: 'granted', abstract: 'An autonomously self-healing polymer coating comprising microencapsulated dicyclopentadiene (DCPD) healing agent and Grubbs catalyst dispersed in epoxy matrix, providing >80% recovery of mechanical properties after cracking at ambient temperature without external intervention.', claims: ['UF-encapsulated DCPD microcapsules 10-200 um diameter', 'Grubbs 1st generation catalyst loading 2.5 wt%', 'ROMP-based healing mechanism', 'Coating thickness 50-500 um'], jurisdiction: 'US', subject_slug: 'polymer-chemistry' },
    { patent_number: 'IN201921056789', title: 'Flame Retardant Polypropylene Composite for Electric Vehicle Battery Housing', inventors: 'Mehta, S.; Joshi, P.; Kulkarni, R.', assignee: 'Tata Chemicals Ltd.', filing_date: '2019-10-08', publication_date: '2021-04-22', status: 'granted', abstract: 'A halogen-free flame retardant PP composite formulation comprising ammonium polyphosphate (APP), melamine polyphosphate (MPP), and zinc borate (ZB) achieving UL94 V-0 rating at 3.2 mm thickness with less than 5% reduction in flexural strength compared to base PP copolymer.', claims: ['APP:MPP:ZB ratio 60:30:10', 'Total FR loading 25-30 wt%', 'Melt compounding in co-rotating twin screw extruder', 'Application to EV battery tray and housing components'], jurisdiction: 'India', subject_slug: 'polymer-additives' },
    { patent_number: 'PCT/IN2022/050234', title: 'Bio-Based Polyol from Castor Oil for Rigid Polyurethane Foam Insulation', inventors: 'Desai, A.; Nair, M.; Pillai, C.K.S.', assignee: 'NIIST (National Institute for Interdisciplinary Science and Technology)', filing_date: '2022-03-30', publication_date: '2023-09-30', status: 'published', abstract: 'A method for synthesis of bio-based polyol from castor oil using transesterification with trimethylolpropane, suitable as a drop-in replacement for petroleum-based polyol in rigid PU foam for building insulation, achieving 40% bio-content with equivalent thermal conductivity (lambda 0.022 W/mK).', claims: ['Castor oil transesterification with TMP at 200C', '40-60% replacement of petroleum polyol', 'Foam density 35-45 kg/m3', 'Fire class B2 (DIN 4102)'], jurisdiction: 'PCT', subject_slug: 'sustainable-plastics' },
    { patent_number: 'IN202021023456', title: 'Conductive PANI/Carbon Nanotube Composite Coating for EMI Shielding', inventors: 'Verma, S.; Agarwal, R.; Bhattacharya, S.', assignee: 'IIT Delhi', filing_date: '2020-07-14', publication_date: '2021-12-10', status: 'granted', abstract: 'An electromagnetic interference (EMI) shielding composite comprising polyaniline (PANI) doped with camphorsulfonic acid blended with multi-walled carbon nanotubes (MWCNT) in ABS substrate, achieving shielding effectiveness of 45 dB at 1 GHz frequency at 3 mm thickness.', claims: ['PANI-CSA synthesis via oxidative polymerization', 'MWCNT loading 5-10 wt% in PANI matrix', 'Electrospray deposition on ABS substrate', 'SE 45 dB at 1-3 GHz'], jurisdiction: 'India', subject_slug: 'polymer-chemistry' },
    { patent_number: 'IN201821034567', title: 'Starch-PLA-PBAT Ternary Blend for Compostable Agricultural Mulch Film', inventors: 'Rao, M.V.; Tripathi, D.; Singh, K.', assignee: 'Central Institute of Plastics Engineering and Technology (CIPET)', filing_date: '2018-09-25', publication_date: '2020-03-12', status: 'granted', abstract: 'A compostable ternary polymer blend comprising thermoplastic starch (TPS, 40 wt%), PLA (35 wt%), and PBAT (25 wt%) with maleic anhydride compatibiliser, achieving soil biodegradation >90% within 180 days, suitable for agricultural mulch film application meeting IS 17088 requirements.', claims: ['Ternary blend TPS:PLA:PBAT 40:35:25', 'Maleic anhydride grafted PBAT as compatibiliser 2 wt%', 'Blown film extrusion at 160C', 'Soil biodegradation test per ISO 17556'], jurisdiction: 'India', subject_slug: 'sustainable-plastics' },
    { patent_number: 'US11234567B1', title: 'PEEK Composite Spinal Implant with Controlled Porosity for Osseointegration', inventors: 'Johnson, A.; Williams, B.; Chen, C.', assignee: 'DePuy Synthes (J&J Medical)', filing_date: '2019-02-14', publication_date: '2021-05-25', status: 'granted', abstract: 'A spinal cage implant comprising PEEK reinforced with 20 wt% short carbon fibre with 3D-printed controlled porosity (pore size 300-500 um, porosity 60-70%) fabricated by selective laser sintering, demonstrating superior osseointegration versus solid PEEK in ovine model at 12 weeks.', claims: ['CF/PEEK SLS fabrication at 370C', 'Pore size 300-500 um interconnected architecture', 'Surface HA coating 10-20 um', 'ISO 10993-5 biocompatibility certification'], jurisdiction: 'US', subject_slug: 'medical-plastics' },
    { patent_number: 'IN202221045678', title: 'Recycled HDPE/PP Blend Compatibilized by Styrene-Ethylene-Butylene-Styrene for Automotive Applications', inventors: 'Patel, V.; Shah, D.; Mehta, N.', assignee: 'Reliance Industries Ltd.', filing_date: '2022-01-17', publication_date: '2023-07-20', status: 'published', abstract: 'A method for compatibilization of mechanically recycled HDPE/PP blend (60:40 w/w) from mixed plastic waste using SEBS block copolymer (5 wt%) as compatibiliser, achieving tensile strength retention of 88% and elongation at break of 320% compared to virgin PP copolymer, suitable for non-structural automotive parts.', claims: ['rHDPE:rPP blend 60:40 from municipal waste stream', 'SEBS-g-MA compatibiliser 5 wt%', 'Melt mixing in twin screw at 200C', 'Application to automotive wheel arch liners and splash guards'], jurisdiction: 'India', subject_slug: 'recycling-technology' },
    { patent_number: 'IN202021067890', title: 'Graphene Oxide Nanocomposite PVA Membrane for Water Purification', inventors: 'Kumar, A.; Saxena, M.; Reddy, B.', assignee: 'IIT Madras', filing_date: '2020-11-30', publication_date: '2022-05-15', status: 'granted', abstract: 'A thin-film nanocomposite (TFN) membrane incorporating 0.1-0.5 wt% graphene oxide (GO) in polyvinyl alcohol (PVA) matrix for nanofiltration applications, achieving 98.5% rejection of divalent salts (MgSO4) at 50 L/m2/h flux, 30% higher than base PVA membrane.', claims: ['GO synthesis by modified Hummers method', 'PVA/GO casting from dimethyl sulfoxide solution', 'Crosslinking with glutaraldehyde', 'Nanofiltration at 4-8 bar operating pressure'], jurisdiction: 'India', subject_slug: 'polymer-composites' },
  ].filter(p => !existingNos.has(p.patent_number));

  if (patents.length === 0) { console.log('  ✅ No new patents needed'); return 0; }
  const { data, error } = await s.from('patents').insert(patents).select('id, patent_number, title');
  if (error) { console.error('  ❌ Error:', error.message); return 0; }
  console.log(`  ✅ Inserted ${data.length} patents (total now ~${data.length + (existing.data?.length ?? 0)})`);
  return data.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MENTORSHIP PROFILES (6 → 15)
// mentorship_profiles: id, name, company, designation, email, bio,
//                      experience_years, specialization, avatar_initials, is_active
// ─────────────────────────────────────────────────────────────────────────────
async function seedMentorshipProfiles() {
  console.log('\n🧑‍🏫 Seeding mentorship_profiles (expansion)...');
  const existing = await s.from('mentorship_profiles').select('name');
  const existingNames = new Set((existing.data ?? []).map(m => m.name));

  const mentors = [
    { name: 'Dr. Ramesh Balasubramanian', company: 'IIT Madras', designation: 'Professor, Polymer Engineering', email: 'mentor.ramesh@polymerhub.in', bio: 'Professor with 22 years of research experience in polymer nanocomposites, conductive polymers, and biopolymers. Published 180+ peer-reviewed papers, guided 30+ PhD students. Expert in twin-screw compounding and polymer morphology characterization.', experience_years: 22, specialization: 'Polymer Nanocomposites', avatar_initials: 'RB', is_active: true },
    { name: 'Mr. Suresh Iyer', company: 'Motherson Sumi Systems', designation: 'VP — Manufacturing Excellence', email: 'mentor.suresh@polymerhub.in', bio: 'Over 25 years in automotive polymer processing. Led implementation of Industry 4.0 in injection moulding plants across 8 countries. Expert in multi-component moulding, gas-assist IM, and IATF 16949 quality systems. Mentors fresh engineers on industry readiness.', experience_years: 25, specialization: 'Injection Moulding & Automotive', avatar_initials: 'SI', is_active: true },
    { name: 'Dr. Priya Menon', company: 'TIFAC, Government of India', designation: 'Director — Polymer Technology Mission', email: 'mentor.priya@polymerhub.in', bio: 'Policy expert and researcher with 18 years in bioplastics and polymer recycling technology. Authored India Plastics Pact roadmap and advises CPCB on EPR implementation. PhD in Polymer Chemistry from IIT Bombay. Mentor for students interested in policy, sustainability, and startup ecosystem.', experience_years: 18, specialization: 'Sustainable Plastics & Policy', avatar_initials: 'PM', is_active: true },
    { name: 'Mr. Vivek Patel', company: 'Autodesk India', designation: 'Senior CAE Application Engineer', email: 'mentor.vivek@polymerhub.in', bio: 'Moldflow expert with 12 years of experience in injection moulding simulation for automotive, consumer goods, and packaging. Certified Moldflow Insight trainer. Specializes in weld line optimization, fibre orientation prediction, and conformal cooling design for complex parts.', experience_years: 12, specialization: 'Mould Design & CAE Simulation', avatar_initials: 'VP', is_active: true },
    { name: 'Dr. Lakshmi Prasanna', company: 'Trivitron Healthcare', designation: 'Head — Medical Plastics R&D', email: 'mentor.lakshmi@polymerhub.in', bio: 'Expert in medical device polymer selection, biocompatibility testing (ISO 10993), and CDSCO regulatory pathways. 15 years experience in LSR moulding, medical-grade TPE, and sterilization validation. Advises startups on FDA 510(k) and CE mark submissions.', experience_years: 15, specialization: 'Medical Plastics & Regulatory Affairs', avatar_initials: 'LP', is_active: true },
    { name: 'Mr. K. Venkataraman', company: 'Apollo Tyres Ltd.', designation: 'General Manager — Compounding R&D', email: 'mentor.venkat@polymerhub.in', bio: 'Rubber technologist with 20 years specialising in tyre compound development — tread, sidewall, and inner liner. Expert in carbon black morphology, silica-TESPT wet grip compounds, and MDR cure kinetics. Strong background in NR, SBR, BR, and EPDM applications.', experience_years: 20, specialization: 'Rubber Technology & Tyre Compounding', avatar_initials: 'KV', is_active: true },
    { name: 'Ms. Ananya Krishnan', company: 'BASF India', designation: 'Application Development Scientist', email: 'mentor.ananya@polymerhub.in', bio: 'Material scientist with expertise in engineering plastics (Ultramid PA, Ultradur PBT, Ultrason PSU) for electronics and automotive. 10 years at BASF supporting Indian OEMs on material selection and part design. Passionate about mentoring women in polymer engineering.', experience_years: 10, specialization: 'Engineering Plastics & Applications', avatar_initials: 'AK', is_active: true },
    { name: 'Mr. Rahul Sharma', company: 'Ganesha Ecosphere Ltd.', designation: 'Chief Operating Officer', email: 'mentor.rahul@polymerhub.in', bio: 'Built and scaled India largest PET mechanical recycling plant from 5 TPD to 100 TPD in 8 years. Expert in rPET food-grade certification (FDA, EFSA), EPR compliance, and recycling plant P&L management. Strong mentor for recycling entrepreneurship and circular economy careers.', experience_years: 16, specialization: 'Plastic Recycling & Circular Economy', avatar_initials: 'RS', is_active: true },
    { name: 'Prof. Meena Sharma', company: 'CIPET: CSTS Ahmedabad', designation: 'Dean — Academic Affairs', email: 'mentor.meena@polymerhub.in', bio: '18 years in polymer engineering education at CIPET. Expert in GATE coaching, curriculum design, and polymer testing standardization. Has mentored 500+ students for GATE, CEED, and UPSC ES exams. Authored 3 textbooks on polymer testing and processing.', experience_years: 18, specialization: 'Polymer Education & GATE Coaching', avatar_initials: 'MS', is_active: true },
  ].filter(m => !existingNames.has(m.name));

  if (mentors.length === 0) { console.log('  ✅ No new mentors needed'); return 0; }
  const { data, error } = await s.from('mentorship_profiles').insert(mentors).select('id, name');
  if (error) { console.error('  ❌ Error:', error.message); return 0; }
  console.log(`  ✅ Inserted ${data.length} mentors (total now ~${data.length + (existing.data?.length ?? 0)})`);
  return data.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 PolymerHub — Final Content Seed');
  console.log('====================================\n');
  const adminId = await getAdminId();
  if (!adminId) { console.error('No admin user found'); return; }
  console.log('Admin ID:', adminId);

  const results = {
    forum_questions: await seedForumQuestions(adminId),
    career_listings: await seedCareerListings(),
    patents: await seedPatents(),
    mentorship_profiles: await seedMentorshipProfiles(),
  };

  console.log('\n====================================');
  console.log('📊 FINAL SEED SUMMARY:');
  Object.entries(results).forEach(([table, count]) => {
    console.log(`   ${table.padEnd(28)} → +${count} rows`);
  });
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  console.log(`\n   TOTAL NEW ROWS: ${total}`);
  console.log('\n✅ COMPLETE!\n');
}

main();
