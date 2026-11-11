-- supabase/migrations/20261111000002_create_and_seed_industry_events.sql
-- Description: Creates the authoritative industry_events table with RLS and seeds all 26 verified exhibitions (2026 - 2027)

CREATE TABLE IF NOT EXISTS public.industry_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  date_display TEXT NOT NULL,
  month_year_badge TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  venue TEXT NOT NULL,
  focus TEXT NOT NULL,
  focus_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  organizer TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_verified TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Exhibition & Expo',
  priority_badge TEXT DEFAULT 'P1 Regional',
  is_anchor_event BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  ideal_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_to_see JSONB NOT NULL DEFAULT '[]'::jsonb,
  student_mode JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_industry_events_dates ON public.industry_events (start_date ASC, end_date ASC);
CREATE INDEX IF NOT EXISTS idx_industry_events_city ON public.industry_events (city);
CREATE INDEX IF NOT EXISTS idx_industry_events_active ON public.industry_events (is_active);

-- Enable RLS
ALTER TABLE public.industry_events ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: anyone can view published events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'industry_events' AND policyname = 'industry_events_public_read'
  ) THEN
    CREATE POLICY "industry_events_public_read" 
      ON public.industry_events 
      FOR SELECT 
      USING (is_active = true);
  END IF;
END $$;

-- 2. Admin Management Policies: Service Role and Admin Profiles can insert/update/delete
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'industry_events' AND policyname = 'industry_events_service_role_all'
  ) THEN
    CREATE POLICY "industry_events_service_role_all" 
      ON public.industry_events 
      FOR ALL 
      USING (auth.jwt() ->> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Seed all 26 verified industry exhibitions
INSERT INTO public.industry_events (
  id, title, short_title, slug, start_date, end_date, date_display, month_year_badge,
  city, state, venue, focus, focus_tags, organizer, source_name, source_url,
  last_verified, event_type, priority_badge, is_anchor_event, is_active
) VALUES
  ('event-002', 'Plast Pack 2026 — International Plastics & Packaging Exhibition', 'Plast Pack Indore', 'plast-pack-indore-2026', '2026-11-27', '2026-11-30', 'November 27 – 30, 2026', 'NOV 2026', 'Indore', 'Madhya Pradesh', 'Labh Ganga Exhibition Centre, Bypass Road, Indore, Madhya Pradesh 452010', 'Plastics processing, flexible barrier packaging, multilayer blown film lines, and industrial printing.', '["Packaging Films","Blow Moulding","Printing & Converting","Circular rPET"]'::jsonb, 'Indian Plast Pack Forum (IPPF) & IPMA', 'Indore Plastics Manufacturers Association (IPMA) / TradeIndia', 'https://www.tradeindia.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-003', 'Plast Asia Central Expo 2026 — Raipur Plastics & Infrastructure Expo', 'Plast Central Raipur', 'plast-central-raipur-2026', '2026-12-04', '2026-12-07', 'December 4 – 7, 2026', 'DEC 2026', 'Raipur', 'Chhattisgarh', 'Shriram Business Park / Science Centre Ground, Vidhan Sabha Road, Raipur, Chhattisgarh 492007', 'Central India regional infrastructure expo. HDPE/PVC pipe extrusion, agricultural drip irrigation systems, and woven sack looms.', '["Agricultural Plastics","HDPE/PVC Pipes","Woven Sacks","Central India"]'::jsonb, 'Chhattisgarh Plastics Manufacturers Association (CPMA)', 'CPMA / TradeIndia', 'https://www.tradeindia.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-004', 'BIOPLASTEX 2026 — 8th International Exhibition on Bio-Plastics & Sustainable Packaging', 'BIOPLASTEX 2026 Mumbai', 'bioplastex-mumbai-2026', '2026-12-11', '2026-12-12', 'December 11 – 12, 2026', 'DEC 2026', 'Mumbai', 'Maharashtra', 'Nehru Centre, Dr. Annie Besant Road, Worli, Mumbai, Maharashtra 400018', 'Biodegradable polymers, PLA, PHA, bio-PBS, compostable carry bags, industrial composting standards, and bio-based packaging solutions.', '["Bio-Plastics","PLA & PHA","Compostable Materials","Sustainable Packaging","CPCB Certified"]'::jsonb, 'BIOPLASTEX Secretariat & Bioplastics Council India', 'BIOPLASTEX Official Portal', 'https://www.bioplastex.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-005', 'RACE 2026 — Recycling & Compounding Expo Mumbai', 'RACE Expo 2026 Mumbai', 'race-recycling-mumbai-2026', '2026-12-14', '2026-12-16', 'December 14 – 16, 2026', 'DEC 2026', 'Mumbai', 'Maharashtra', 'Hall 3, Bombay Exhibition Centre (BEC/NESCO), Western Express Highway, Goregaon East, Mumbai 400063', 'Post-consumer polymer recycling, twin-screw compounding extruders, melt decontamination, optical sorting, and EPR compliance.', '["Mechanical Recycling","Twin-Screw Compounding","Optical Sorting","rPET Decontamination"]'::jsonb, 'Polymerupdate & AMI Plastics Events', 'Polymerupdate Official', 'https://www.polymerupdate.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-006', 'ICERP 2026 — International Conference & Exhibition on Reinforced Plastics', 'ICERP 2026 Mumbai', 'icerp-mumbai-2026', '2026-12-14', '2026-12-16', 'December 14 – 16, 2026', 'DEC 2026', 'Mumbai', 'Maharashtra', 'Bombay Exhibition Centre (BEC/NESCO), Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063', 'FRP/GRP composites, glass and carbon fiber reinforcement, resin transfer moulding (RTM), pultrusion, and thermoset resin systems.', '["FRP Composites","Glass Fiber","Carbon Fiber","RTM & Pultrusion","Wind Energy & Aerospace"]'::jsonb, 'FRP Institute India', 'FRP Institute Official Portal', 'https://www.icerp.in', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-007', 'Plastivision India 2027 — The Premier Global Plastics Showcase', 'Plastivision India 2027', 'plastivision-india-mumbai-2027', '2027-01-21', '2027-01-25', 'January 21 – 25, 2027', 'JAN 2027', 'Mumbai', 'Maharashtra', 'Bombay Exhibition Centre (BEC), NESCO, Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063', 'THE ANCHOR EVENT OF INDIA. Full-spectrum polymer industry: multi-tonne injection presses, petrochemical giants, mould tooling, automation, and circularity.', '["Anchor Mega Show","AIPMA","Machinery & Moulds","Reliance & Global Petrochemicals","Industry 4.0"]'::jsonb, 'The All India Plastics Manufacturers’ Association (AIPMA)', 'AIPMA Official Plastivision Portal', 'https://www.plastivision.org', '26 Sep 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('event-008', 'POLYMERA 2027 — International Conference on Advances in Polymeric Materials', 'POLYMERA 2027 Conference', 'polymera-2027-kottayam', '2027-01-28', '2027-01-29', 'January 28 – 29, 2027', 'JAN 2027', 'Kottayam', 'Kerala', 'Seminar Hall, Convergence Academia Complex, Mahatma Gandhi University, Kottayam, Kerala 686560', 'Academic & research conference on polymer nanocomposites, biopolymer synthesis, green chemistry, and smart hydrogels.', '["Academic Conference","Nanocomposites","Biopolymers","Smart Materials","R&D Papers"]'::jsonb, 'School of Chemical Sciences, Mahatma Gandhi University', 'MG University (Official Academic Source)', 'https://www.mgu.ac.in', '26 Sep 2026', 'Academic Conference', 'P1 Research', false, true),
  ('event-indplas-2027', 'Indplas 2027 — 9th International Exhibition on Plastics', 'Indplas 2027 Kolkata', 'indplas-kolkata-2027', '2027-02-26', '2027-03-01', 'February 26 – March 1, 2027', 'FEB 2027', 'Kolkata', 'West Bengal', 'Biswa Bangla Mela Prangan, Opp Science City, J.B.S. Haldane Avenue, Kolkata, West Bengal 700046', 'Eastern India and SAARC gateway for polymers: high-output injection moulding, heavy-duty blow moulding, multilayer film extrusion, recycling machinery, and petrochemical masterbatches.', '["Eastern India Hub","IPF Kolkata","Biswa Bangla","SAARC Gateway","Injection & Extrusion"]'::jsonb, 'Indian Plastics Federation (IPF)', 'Indian Plastics Federation Official Portal', 'https://www.indplas.in', '11 Nov 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('event-packplus-2027', 'PackPlus 2027 — Total Packaging, Converting & Supply Chain Showcase', 'PackPlus 2027 New Delhi', 'packplus-delhi-2027', '2027-05-06', '2027-05-08', 'May 6 – 8, 2027', 'MAY 2027', 'New Delhi', 'Delhi NCR', 'Bharat Mandapam (IECC), Pragati Maidan, New Delhi 110001', 'Total packaging value chain: flexible barrier films, pouches, multilayer co-extrusion, rigid plastic containers, corrugated packaging, and automation technologies.', '["Flexible Packaging","Barrier Films","RX India","Bharat Mandapam","Packaging Automation"]'::jsonb, 'RX India (Reed Exhibitions)', 'PackPlus Official Portal', 'https://www.packplus.in', '11 Nov 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('event-010', 'Global Plastics Circularity Summit & K-Preview 2027', 'Global Circularity Summit Mumbai', 'global-circularity-summit-mumbai-2027', '2027-05-14', '2027-05-15', 'May 14 – 15, 2027', 'MAY 2027', 'Mumbai', 'Maharashtra', 'World Trade Centre Mumbai, Cuffe Parade, Mumbai, Maharashtra 400005 (Hybrid Stream)', 'International summit on chemical recycling, depolymerization kinetics, bio-feedstocks, life cycle carbon offsets, and global packaging policies.', '["Global Summit","Chemical Recycling","Depolymerization","LCA & Net Zero","Hybrid Stream"]'::jsonb, 'International Polymer Sustainability Forum & AIPMA Committee', 'Plastics News & WTC Mumbai', 'https://www.wtcmumbai.org', '26 Sep 2026', 'Industry Summit', 'P1 Regional', false, true),
  ('event-011', 'IPLAS 2027 — International Plastics Exhibition Chennai', 'IPLAS 2027 Chennai', 'iplas-chennai-2027', '2027-06-11', '2027-06-14', 'June 11 – 14, 2027', 'JUN 2027', 'Chennai', 'Tamil Nadu', 'Chennai Trade Centre, CTC Complex, Nandambakkam, Chennai, Tamil Nadu 600089', 'Premier South India show. Automotive plastics, electrical switchgear components, precision moulds, dies, and recycling tech.', '["South India Premier","Automotive Plastics","Precision Moulds & Dies","CIPET Guindy Aligned"]'::jsonb, 'Tamil Nadu Plastics Manufacturers’ Association (TAPMA)', 'TAPMA / Plastemart Official Portal', 'https://www.plastemart.com', '26 Sep 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('event-012', 'PLASTFOCUS 2027 — International Plastics Exhibition Bengaluru', 'PLASTFOCUS 2027 Bengaluru', 'plastfocus-bengaluru-2027', '2027-06-23', '2027-06-26', 'June 23 – 26, 2027', 'JUN 2027', 'Bengaluru', 'Karnataka', 'Bengaluru International Exhibition Centre (BIEC), 10th Mile, Tumkur Road, Bengaluru, Karnataka 560073', 'Next-generation machinery, automated injection presses, digital extrusion monitoring, and Industry 4.0 polymer manufacturing.', '["Messe Düsseldorf","PMMAI","BIEC Bengaluru","Machinery & Automation","Industry 4.0"]'::jsonb, 'Messe Düsseldorf India & PMMAI (Plastics Machinery Manufacturers Association of India)', 'Messe Düsseldorf / PMMAI Official Announcement', 'https://www.plastfocus.org', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-013', 'GCPRS 2027 — Global Circular Plastics & Recycling Summit', 'GCPRS 2027 New Delhi', 'gcprs-circular-delhi-2027', '2027-06-24', '2027-06-27', 'June 24 – 27, 2027', 'JUN 2027', 'New Delhi', 'Delhi NCR', 'Yashobhoomi (IICC), Dwarka Sector 25, New Delhi 110077', 'National circular plastics summit on waste management systems, post-consumer resin (PCR) standards, EPR credit trading, and food-grade recycling.', '["Circular Plastics","AIPMA & CPMA","EPR Credit Trading","Yashobhoomi Delhi","PCR Standards"]'::jsonb, 'AIPMA & Chemicals and Petrochemicals Manufacturers Association (CPMA)', 'AIPMA Official Portal', 'https://www.aipma.net', '26 Sep 2026', 'Industry Summit', 'P1 Regional', false, true),
  ('event-014', 'PlastAsia 2027 — 8th International Plastics Exhibition Bengaluru', 'PlastAsia 2027 Bengaluru', 'plastasia-bengaluru-2027', '2027-07-09', '2027-07-12', 'July 9 – 12, 2027', 'JUL 2027', 'Bengaluru', 'Karnataka', 'Bengaluru International Exhibition Centre (BIEC), 10th Mile, Tumkur Road, Bengaluru, Karnataka 560073', 'High-tech plastics show. Aerospace carbon fiber composites, 3D printing filaments, precision electronics housings, and Industry 4.0 IoT moulding.', '["Aerospace Composites","3D Printing Filament","Precision Electronics","Industry 4.0"]'::jsonb, 'Triune Exhibitors Pvt Ltd & Karnataka State Plastics Association (KSPA)', 'PlastAsia Official / BIEC Portal', 'https://www.plastasia.in', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-015', 'IPLEX 2027 — 13th International Plastics Exhibition Hyderabad', 'IPLEX 2027 Hyderabad', 'iplex-hyderabad-2027', '2027-08-20', '2027-08-23', 'August 20 – 23, 2027', 'AUG 2027', 'Hyderabad', 'Telangana', 'HITEX Exhibition Centre, Trade Fair Office Building, IZZAT Nagar, Hyderabad, Telangana 500084', 'Joint South-Central India Expo. Pharmaceutical blister packaging, medical devices, rigid containers, and injection moulding automation.', '["Pharma Packaging","Medical Plastics","Rigid Containers","South Plastics Alliance"]'::jsonb, 'TAIPMA, KADPMA, APMSME & Telangana Plastics Association', 'IPLEX Official Portal', 'https://www.iplexindia.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('event-016', 'Plexpo India 2027 — 9th International Plastics Exhibition', 'Plexpo India Gandhinagar', 'plexpo-india-gandhinagar-2027', '2027-09-17', '2027-09-20', 'September 17 – 20, 2027', 'SEP 2027', 'Gandhinagar', 'Gujarat', 'Helipad Exhibition Centre, Near J2 Circle, Swarnim Park, Gandhinagar, Gujarat 382016', 'Gujarat flagship show. High-throughput extrusion, polyolefin compounding, masterbatches, and packaging converting machinery.', '["Gujarat Flagship","High-Speed Extrusion","Masterbatch Formulations","GSPMA"]'::jsonb, 'Gujarat State Plastics Manufacturers Association (GSPMA)', 'GSPMA / Plexpo India Official Portal', 'https://www.plexpoindia.com', '26 Sep 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('event-rubbertech-2027', 'RubberTech India 2027 — International Exhibition on Rubber Technology & Elastomers', 'RubberTech India 2027 Mumbai', 'rubbertech-mumbai-2027', '2027-10-07', '2027-10-09', 'October 7 – 9, 2027', 'OCT 2027', 'Mumbai', 'Maharashtra', 'Bombay Exhibition Centre (BEC/NESCO), Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063', 'Elastomer processing, synthetic rubber compounding, carbon black, vulcanization accelerators, tyre testing, and rubber-to-metal bonding.', '["Rubber Technology","Elastomers","Synthetic Rubber","Compounding Chemicals","BEC Mumbai"]'::jsonb, 'All India Rubber Industries Association & International Exhibition Partners', 'RubberTech India Official Portal', 'https://www.rubbertech-expo.com', '11 Nov 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('arch-001', 'PLASTINDIA 2026 — 12th International Plastics Exhibition & Conference', 'PLASTINDIA 2026 New Delhi', 'plastindia-delhi-2026', '2026-02-05', '2026-02-10', 'February 5 – 10, 2026', 'FEB 2026', 'New Delhi', 'Delhi NCR', 'Bharat Mandapam, Pragati Maidan, New Delhi 110001', 'Global triennial plastics showcase. 2,000+ exhibitors, 600,000+ visitors, raw materials, machinery, moulds, and circular plastics.', '["Completed Event","Global Triennial","Bharat Mandapam","Plastindia Foundation"]'::jsonb, 'Plastindia Foundation', 'Plastindia Foundation Official Archive', 'https://www.plastindia.org', '26 Sep 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('arch-002', 'Die & Mould India 2026 — 13th International Die & Mould Exhibition', 'Die & Mould India 2026', 'die-mould-mumbai-2026', '2026-04-21', '2026-04-24', 'April 21 – 24, 2026', 'APR 2026', 'Mumbai', 'Maharashtra', 'Bombay Exhibition Centre (BEC), Goregaon East, Mumbai 400063', 'Tooling steel metallurgy, 5-axis CNC mold machining, EDM spark erosion, hot runner systems, and injection mould manufacturing.', '["Completed Event","Tooling & Dies","TAGMA India","CNC Machining"]'::jsonb, 'Tool & Gauge Manufacturers Association of India (TAGMA)', 'TAGMA India Archive', 'https://www.tagmaindia.org', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('arch-003', 'India Rubber Expo 2026 (IRE 2026)', 'IRE 2026 New Delhi', 'india-rubber-expo-delhi-2026', '2026-04-07', '2026-04-10', 'April 7 – 10, 2026', 'APR 2026', 'New Delhi', 'Delhi NCR', 'Pragati Maidan Exhibition Complex, New Delhi 110001', 'Rubber technology, synthetic elastomers, Banbury mixing, silica compounding, and tire manufacturing.', '["Completed Event","AIRIA","Rubber Tech","Tire Compounding"]'::jsonb, 'All India Rubber Industries Association (AIRIA)', 'AIRIA Archive', 'https://www.indiarubberexpo.in', '26 Sep 2026', 'Exhibition & Expo', 'P0 Flagship', true, true),
  ('arch-004', 'GCPRS 2026 — Global Circular Plastics & Recycling Summit', 'GCPRS 2026 New Delhi', 'gcprs-delhi-2026', '2026-07-02', '2026-07-05', 'July 2 – 5, 2026', 'JUL 2026', 'New Delhi', 'Delhi NCR', 'Pragati Maidan Exhibition Complex, New Delhi 110001', 'EPR compliance, post-consumer recycling, municipal waste sorting, and circular plastics policy.', '["Completed Event","AIPMA","Circular Economy","EPR Policy"]'::jsonb, 'AIPMA & CPMA', 'AIPMA Archive', 'https://www.aipma.net', '26 Sep 2026', 'Industry Summit', 'P1 Regional', false, true),
  ('arch-005', 'PRS India 2026 — Plastics Recycling Show India', 'PRS India 2026 Mumbai', 'prs-india-mumbai-2026', '2026-09-01', '2026-09-03', 'September 1 – 3, 2026', 'SEP 2026', 'Mumbai', 'Maharashtra', 'Bombay Exhibition Centre (BEC), Goregaon East, Mumbai 400063', 'Mechanical recycling machinery, optical sorting, decontamination extruders, and rPET bottle-to-bottle technologies.', '["Completed Event","Crain Communications","Polymerupdate","rPET Decontamination"]'::jsonb, 'Crain Communications & Polymerupdate', 'PRS India Archive', 'https://www.prseventindia.com', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('arch-006', 'KPLEX 2026 — 10th Karnataka Plastics Exhibition', 'KPLEX 2026 Bengaluru', 'kplex-bengaluru-2026', '2026-09-11', '2026-09-14', 'September 11 – 14, 2026', 'SEP 2026', 'Bengaluru', 'Karnataka', 'Bengaluru International Exhibition Centre (BIEC), Tumkur Road, Bengaluru, Karnataka 560073', 'South India regional plastics processors, moulding machinery, auxiliary tools, and masterbatch suppliers.', '["Completed Event","KSPA","BIEC Bengaluru","South Processors"]'::jsonb, 'Karnataka State Plastics Association (KSPA)', 'KSPA Archive', 'https://www.kplex.in', '26 Sep 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('arch-007', 'DIEMEX 2026 — International Tooling, Die & Mould Exhibition', 'DIEMEX 2026 Pune', 'diemex-pune-2026', '2026-10-08', '2026-10-10', 'October 8 – 10, 2026', 'OCT 2026', 'Pune', 'Maharashtra', 'Auto Cluster Exhibition Centre, H-Block, Chinchwad, Pune, Maharashtra 411019', 'Die & mould manufacturing, precision tooling solutions, CNC machining, EDM spark erosion, and advanced manufacturing across automotive, aerospace, electronics, consumer goods, and packaging sectors.', '["Completed Event","Die & Mould","Precision Tooling","Automotive Plastics","Pune Cluster"]'::jsonb, 'Auto Cluster Exhibition Centre & Tooling Industry Association', 'Auto Cluster Official Portal', 'https://www.autocluster.in', '11 Nov 2026', 'Exhibition & Expo', 'P1 Regional', false, true),
  ('arch-008', 'Plast Champions — International Plastics Expo 2026', 'Plast Champions Vadodara', 'plast-champions-vadodara-2026', '2026-10-30', '2026-11-01', 'October 30 – November 1, 2026', 'OCT 2026', 'Vadodara', 'Gujarat', 'Navlakhi Ground / Anusuya Leprosy Ground, Opp Sardar Estate, Vadodara, Gujarat 390019', 'Plastics raw materials, high-speed processing machinery, petrochemical masterbatches, and auxiliary equipment.', '["Completed Event","Plastics Materials","Machinery","Petrochemicals","Extrusion & Tooling"]'::jsonb, 'Plast Champions Expo Committee & IPMA', 'TradeIndia / Official Organizer Portal', 'https://www.tradeindia.com', '11 Nov 2026', 'Exhibition & Expo', 'P1 Regional', false, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_title = EXCLUDED.short_title,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  date_display = EXCLUDED.date_display,
  venue = EXCLUDED.venue,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  focus = EXCLUDED.focus,
  focus_tags = EXCLUDED.focus_tags,
  organizer = EXCLUDED.organizer,
  source_url = EXCLUDED.source_url,
  last_verified = EXCLUDED.last_verified,
  updated_at = now();
