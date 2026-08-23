'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft,
  Factory, 
  Zap,
  Shield,
  Settings,
  AlertCircle,
  Building2,
  Sparkles,
  Brain,
  Compass,
  ArrowRight
} from 'lucide-react'

type TabId = 'overview' | 'materials' | 'processes' | 'standards' | 'troubleshooting' | 'curriculum' | 'careers'

// Complete comprehensive 7-Industry Dataset
const INDUSTRY_DATA: Record<string, {
  id: string
  title: string
  icon: string
  color: string
  bgColor: string
  stats: {
    marketSize: string
    growth: string
    employment: string
    units: string
  }
  overview: {
    description: string
    impact: string
    indianContext: string
  }
  technicalDeepDive: {
    materials: Array<{
      name: string
      properties: string
      applications: string
      indianPlayers: string
    }>
    processes: Array<{
      name: string
      description: string
      keyParameters: string
    }>
    standards: string[]
    troubleshooting: Array<{
      problem: string
      causes: string
      solutions: string
    }>
  }
  curriculum: {
    modules: Array<{
      name: string
      lessons: number
      topics: string[]
      slug: string
    }>
    careers: Array<{
      role: string
      salary: string
      demand: string
    }>
  }
  companies: Array<{
    name: string
    location: string
    specialization: string
  }>
}> = {
  packaging: {
    id: 'packaging',
    title: 'Packaging & Barrier Tech',
    icon: '📦',
    color: '#15803D',
    bgColor: '#F0FDF4',
    stats: {
      marketSize: '₹4.2 Lakh Crore',
      growth: '12.5% CAGR',
      employment: '2.5M+ Workforce',
      units: '15,000+ Units'
    },
    overview: {
      description: 'The Packaging & Barrier Technology sector is the critical supply line of modern civilization. Without polymer barrier films and aseptic containers, the global food and medical distribution network would spoil within 72 hours.',
      impact: 'Polymer barrier films prevent over 40% of post-harvest food waste globally. Modern multi-layer co-extrusion technology creates microscopic barrier skins (EVOH, PVDC) thinner than a human hair that block 99.9% of atmospheric oxygen and moisture.',
      indianContext: "India's packaging sector is expanding at 12.5% annually driven by FMCG, pharmaceutical exports, and e-commerce delivery networks. Hubs in Gujarat (Halol, Vapi), Maharashtra (Pune), and Noida lead global manufacturing."
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'PET (Polyethylene Terephthalate)',
          properties: 'High optical clarity (>90%), tensile strength 60–80 MPa, excellent CO2/O2 retention, IV 0.80–0.84 dL/g for carbonated soft drinks.',
          applications: 'CSD bottles, aseptic juice containers, thermoformed blister trays, biaxially oriented BOPET films.',
          indianPlayers: 'Reliance Industries (Relpet), Uflex, Manjushree Technopack, Pearl Polymers'
        },
        {
          name: 'EVOH (Ethylene Vinyl Alcohol)',
          properties: 'Ultra-low Oxygen Transmission Rate (<0.1 cc/m²·day), superior aroma and flavour retention, co-extrudable barrier core layer.',
          applications: 'Multi-layer barrier milk pouches, ketchup squeeze bottles, aseptic pharmaceutical blister packs.',
          indianPlayers: 'Kuraray (import supply), Uflex, Huhtamaki India'
        },
        {
          name: 'BOPP (Biaxially Oriented Polypropylene)',
          properties: 'Moisture barrier (<5 g/m²·day), high tensile modulus in MD/TD directions, excellent heat-sealability with terpolymer skins.',
          applications: 'Snack food packaging, confectionery wrap, self-adhesive labels, tobacco overwraps.',
          indianPlayers: 'Cosmo Films, Jindal Poly Films, Max Speciality Films'
        },
        {
          name: 'Metallocene LLDPE (mLLDPE)',
          properties: 'Exceptional puncture resistance, dart drop impact >600g, low seal initiation temperature (SIT ~90°C), hot tack strength.',
          applications: 'Heavy duty shipping sacks, e-commerce courier bags, high-speed form-fill-seal (FFS) liquid pouches.',
          indianPlayers: 'Reliance Industries, GAIL, IOCL (Panipat)'
        }
      ],
      processes: [
        {
          name: '7-Layer Blown Film Co-extrusion',
          description: 'Simultaneous extrusion of 7 polymer layers (PE/Tie/EVOH/Tie/PA/Tie/PE) through an annular spiral mandrel die to create hermetic barrier films.',
          keyParameters: 'Blow-up ratio (BUR 2.5–3.5), frost line height (FLH), melt temperature profile (180–230°C), layer thickness distribution.'
        },
        {
          name: 'Two-Stage Injection Stretch Blow Moulding (ISBM)',
          description: 'Moulding amorphous PET preforms in high-cavitation moulds (up to 128 cavities), followed by infrared reheating and stretch-blowing with a stretch rod and 40 bar air.',
          keyParameters: 'Preform reheat temperature (98–105°C), stretch rod velocity (1.5 m/s), pre-blow pressure (6–10 bar), final blow pressure (35–40 bar).'
        },
        {
          name: 'Tandem Extrusion Lamination',
          description: 'Coating molten LDPE/tie-layer resin directly onto aluminium foil, paperboard, or woven fabric to create composite multi-layer structures.',
          keyParameters: 'Extrusion melt temperature (300–320°C for adhesion), air gap distance, chill roll temperature (15–20°C), corona treatment level.'
        }
      ],
      standards: [
        'IS 14535:2013 — Recycled Plastics for Manufacturing Packaging Products',
        'IS 15495:2020 — Printing Inks for Food Packaging — Code of Practice',
        'ASTM D882 — Tensile Properties of Thin Plastic Sheeting',
        'ASTM F1249 — Water Vapour Transmission Rate (WVTR) Through Plastic Film',
        'ASTM D3985 — Oxygen Gas Transmission Rate (OTR) Through Plastic Film'
      ],
      troubleshooting: [
        {
          problem: 'Haze or Opaque Preforms in PET Injection',
          causes: 'Inadequate resin drying (moisture > 0.005%), degradation in hot runner, or barrel melt temperature too low causing unmelts.',
          solutions: 'Dry PET desiccant air at 165–170°C for 4–6 hrs with dew point < −40°C. Clean hot runner nozzle tips and adjust barrel zone 1–4 profile.'
        },
        {
          problem: 'Delamination in Multi-layer Co-extruded Film',
          causes: 'Maleic anhydride grafted polyolefin tie-layer degradation, melt temperature mismatch between adjacent resins, or contaminated resin.',
          solutions: 'Ensure tie layer melt temperature exceeds 200°C for proper anhydride functional group bonding with EVOH/polyamide layers.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Plastic Packaging Engineering', lessons: 16, topics: ['Barrier Technology', 'ISBM Tooling', 'Sustainable Flexible Packaging'], slug: 'plastic-packaging-engineering' },
        { name: 'Polymer Processing', lessons: 14, topics: ['Blown Film Extrusion', 'Co-extrusion Dies', 'Thermoforming'], slug: 'polymer-processing' },
        { name: 'Polymer Testing', lessons: 10, topics: ['OTR & WVTR Testing', 'Dart Drop Impact', 'Seal Integrity'], slug: 'polymer-testing' }
      ],
      careers: [
        { role: 'Packaging Development Engineer', salary: '₹6–16 LPA', demand: 'Very High' },
        { role: 'Barrier Materials Scientist', salary: '₹8–22 LPA', demand: 'High' },
        { role: 'Blow Moulding Process Specialist', salary: '₹5–14 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Uflex Limited', location: 'Noida, Uttar Pradesh', specialization: 'Aseptic Liquid Packaging, Holographic & High-Barrier BOPET Films' },
      { name: 'Manjushree Technopack', location: 'Bengaluru, Karnataka', specialization: 'Rigid PET Bottles, Dispensing Systems, PCR Preforms' },
      { name: 'Cosmo Films', location: 'Aurangabad & Vadodara', specialization: 'Specialty BOPP Thermal Lamination & Barrier Barrier Films' },
      { name: 'Huhtamaki India', location: 'Mumbai, Maharashtra', specialization: 'Flexible Packaging Laminates, Retort Pouches, Tube Laminates' }
    ]
  },

  medicine: {
    id: 'medicine',
    title: 'Medical & Healthcare Devices',
    icon: '🩺',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    stats: {
      marketSize: '₹1.1 Lakh Crore',
      growth: '15.2% CAGR',
      employment: '850K+ Workforce',
      units: '3,200+ Cleanroom Facilities'
    },
    overview: {
      description: 'Medical-grade polymers and implantable biomaterials represent the highest purity tier of plastics engineering. From auto-disable syringes and hemodialysis hollow fibers to PEEK spinal cages and heart valves, polymers make sterile healthcare possible.',
      impact: 'Single-use sterile polymer disposables eliminated over 90% of cross-contamination infections in hospitals. Implantable polymers such as UHMWPE and medical-grade PEEK provide bone-mimicking elasticity that lasts 25+ years inside the human body.',
      indianContext: 'India is known as the pharmacy and medical disposable hub of the global South. Faridabad, Surat, Ahmedabad, and Chennai host massive ISO Class 7 cleanrooms producing billions of syringes, IV sets, and catheter tubes.'
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'Medical-grade PEEK (Polyether Ether Ketone)',
          properties: 'Elastic modulus (3.6 GPa) closely matching cortical bone, radiolucent for X-ray visibility, withstands 1000+ steam autoclave cycles.',
          applications: 'Spinal fusion cages, craniomaxillofacial implants, dental abutments, orthopedic suture anchors.',
          indianPlayers: 'Invibio / Solvay supply, Poly Medicure, Sharma Orthopedic'
        },
        {
          name: 'Medical Radiation-Stable Polypropylene (PP)',
          properties: 'Controlled rheology, gamma radiation / E-beam sterilizable without yellowing or embrittlement, ultra-low extractables.',
          applications: 'Auto-disable syringes, centrifuge tubes, diagnostic assay cassettes, IV cannula bodies.',
          indianPlayers: 'Reliance Industries (Repol Medical Grades), Hindustan Syringes (HMD)'
        },
        {
          name: 'Ultra-High Molecular Weight Polyethylene (UHMWPE)',
          properties: 'Molecular weight 3.5–6.0 × 10⁶ g/mol, extreme abrasion resistance, lowest coefficient of friction among polymers, biocompatible.',
          applications: 'Acetabular cups in total hip arthroplasty, tibial knee inserts, surgical suture thread.',
          indianPlayers: 'Orthopedic implant manufacturers in Rajkot & Ahmedabad'
        },
        {
          name: 'Liquid Silicone Rubber (LSR)',
          properties: 'Elongation 400–700%, platinum-cured for zero peroxide by-products, biologically inert, withstands −50°C to +200°C.',
          applications: 'Respiratory masks, catheter balloons, heart valve gaskets, peristaltic pump tubing.',
          indianPlayers: 'Momentive India, Poly Medicure, Wacker Silicone India'
        }
      ],
      processes: [
        {
          name: 'Cleanroom Precision Micro-Injection Moulding',
          description: 'Moulding sub-milligram components in ISO Class 7/8 cleanrooms using all-electric injection machines with servo-driven micro-plungers.',
          keyParameters: 'Shot weight consistency (±0.001g), cavity pressure monitoring, tool temperature control, HEPA laminar airflow.'
        },
        {
          name: 'Medical Extrusion & Multi-Lumen Tubing',
          description: 'Continuous extrusion of polyurethane or Pebax micro-catheters containing 2 to 6 independent internal lumens for surgical fluids and guide wires.',
          keyParameters: 'Vacuum tank sizing calibration, laser OD/ID diameter gauge (±0.005mm), melt filtration 20 microns.'
        },
        {
          name: 'Ethylene Oxide (EtO) & Gamma Sterilization Validation',
          description: 'Subjecting sealed medical blisters to EtO gas or Cobalt-60 gamma rays (25 kGy) while verifying polymer chain integrity and residual gas aeration.',
          keyParameters: 'EtO concentration (600 mg/L), chamber humidity (50–60% RH), degassing aeration time (48–72 hrs).'
        }
      ],
      standards: [
        'ISO 10993 (Parts 1 to 20) — Biological Evaluation of Medical Devices',
        'USP Class VI — Plastic Biological Reactivity Tests in vivo',
        'ISO 13485:2016 — Quality Management Systems for Medical Devices',
        'ASTM F2026 — Standard Specification for Polyetheretherketone (PEEK) for Surgical Implants',
        'IS 1065:2018 — Hypodermic Syringes for Single Use'
      ],
      troubleshooting: [
        {
          problem: 'Embrittlement & Yellowing of PP Syringes after Gamma Sterilization',
          causes: 'Free radical formation and oxidative chain scission initiated by high-energy gamma photons in standard non-radiation-stabilized PP resin.',
          solutions: 'Switch to medical-grade PP formulated with hindered amine light stabilizers (HALS) and specialty clarifying antioxidants designed for 25–50 kGy doses.'
        },
        {
          problem: 'Dimensional Variation in Multi-Lumen Catheter Tubing',
          causes: 'Melt temperature fluctuations in crosshead die, surging in single screw extruder, or unstable vacuum tank water level.',
          solutions: 'Install a precision gear melt pump between barrel and crosshead die; calibrate closed-loop laser micrometers with puller speed feedback.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Medical Plastics & Biomaterials', lessons: 12, topics: ['ISO 10993 Biocompatibility', 'Implantable PEEK', 'LSR Tooling'], slug: 'medical-plastics' },
        { name: 'Polymer Testing', lessons: 10, topics: ['USP Class VI Extraction', 'Tensile Modulus', 'Sterilization Resistance'], slug: 'polymer-testing' },
        { name: 'Mould Design', lessons: 10, topics: ['Cleanroom Tooling', 'Hot Runner Balance', 'Micro-Cavity Machining'], slug: 'mould-design' }
      ],
      careers: [
        { role: 'Medical Device Polymer Engineer', salary: '₹7–18 LPA', demand: 'Very High' },
        { role: 'Biomaterials Regulatory Auditor', salary: '₹8–20 LPA', demand: 'High' },
        { role: 'Cleanroom Process Specialist', salary: '₹5–13 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Hindustan Syringes & Medical Devices (HMD)', location: 'Faridabad, Haryana', specialization: 'DispoVan Syringes, Blood Collection Tubes, IV Cannulas (2.5B+ units/yr)' },
      { name: 'Poly Medicure Limited (Polymed)', location: 'Faridabad & Jaipur', specialization: 'Vascular Access, Infusion Therapy, Hemodialysis Dialyzers' },
      { name: 'Biorad Medisys', location: 'Pune & Bengaluru', specialization: 'Orthopedic Implants, PEEK Spinal Implants, Surgical Sutures' },
      { name: 'Sutures India (Healthium Medtech)', location: 'Bengaluru, Karnataka', specialization: 'Bioabsorbable Sutures, Hernia Mesh, Wound Closure' }
    ]
  },

  aerospace: {
    id: 'aerospace',
    title: 'Aerospace, Defense & Rockets',
    icon: '🚀',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    stats: {
      marketSize: '₹85,000 Crore',
      growth: '18.4% CAGR',
      employment: '320K+ High-Tech Jobs',
      units: '850+ Composite Labs'
    },
    overview: {
      description: 'Aerospace and defense represents the apex of structural polymer technology. Carbon Fiber Reinforced Polymers (CFRP), ceramic matrix composites, and high-temperature polyimides make satellite launch vehicles, fighter jets, and UAVs possible.',
      impact: 'Every 1 kilogram shaved from launch vehicle structural mass translates directly into higher satellite payload capacity in geostationary orbit. Modern fighter aircraft (like IAF Tejas Mk1A) exceed 45% composite structure by surface area.',
      indianContext: 'ISRO (VSSC Thiruvananthapuram) and DRDO (ASL Hyderabad) pioneered solid rocket motor filament winding in India. Private aerospace defense manufacturers in Hyderabad and Bengaluru now produce global aircraft fuselage panels.'
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'High-Modulus Carbon Fiber Epoxy Prepreg',
          properties: 'Tensile modulus 230–390 GPa, tensile strength 3500–5000 MPa, autoclave cure at 120–180°C under 7 bar pressure.',
          applications: 'Aircraft wing skins, rocket motor casings, satellite optical bench reflectors, UAV airframes.',
          indianPlayers: 'Tata Advanced Materials, Godrej Aerospace, ISRO VSSC, DRDO DMRL'
        },
        {
          name: 'Bismaleimide (BMI) & Polyimide Resins',
          properties: 'Glass transition temperature (Tg > 300°C), continuous service at 230°C, zero flammable smoke emission (FAA compliant).',
          applications: 'Supersonic missile radomes, aero-engine nacelles, jet engine bypass ducts.',
          indianPlayers: 'DRDO ASL Hyderabad, Hindustan Aeronautics (HAL)'
        },
        {
          name: 'Aramid Fiber (Kevlar / Twaron) Composites',
          properties: 'High energy absorption, ballistic resistance, low density (1.44 g/cm³), excellent impact dampening.',
          applications: 'Bulletproof armor plates, helicopter cockpit armor, fragment containment rings.',
          indianPlayers: 'MKU Limited (Kanpur), SMPP Pvt Ltd (Delhi)'
        },
        {
          name: 'Cyanate Ester Resins',
          properties: 'Ultra-low moisture absorption (<0.5%), low outgassing in vacuum (CVCM < 0.01%), high dielectric transparency.',
          applications: 'Satellite antenna reflectors, phased-array radar fairings, space solar array substrates.',
          indianPlayers: 'ISRO Satellite Centre (URSC Bengaluru)'
        }
      ],
      processes: [
        {
          name: 'CNC Robotic Filament Winding',
          description: 'Helical and hoop winding of continuous carbon or aramid fiber tows impregnated with epoxy resin over a rotating mandrel to form rocket motor cases.',
          keyParameters: 'Tow tension control (10–30 N), winding angle precision (±0.1°), resin viscosity (500–1000 cP at 40°C), infrared B-stage gelation.'
        },
        {
          name: 'Autoclave Curing Process',
          description: 'Consolidation of vacuum-bagged prepreg plies under combined temperature (180°C) and inert nitrogen pressure (7 bar) to achieve void volume fraction < 1%.',
          keyParameters: 'Dwell heating rates (1–3°C/min), vacuum level (<5 mbar), hydrostatic autoclave pressure (6–7 bar), cool-down rate.'
        },
        {
          name: 'Resin Transfer Moulding (RTM)',
          description: 'Injecting premixed low-viscosity thermoset resin into a rigid closed mold containing dry 3D-woven preforms under vacuum assistance.',
          keyParameters: 'Resin injection pressure (2–6 bar), mold preheat temperature (80–120°C), resin viscosity at injection (<100 mPa·s).'
        }
      ],
      standards: [
        'ASTM D3039 — Tensile Properties of Polymer Matrix Composite Materials',
        'ASTM D7136 — Damage Resistance of a Fiber-Reinforced Polymer Matrix Composite to a Drop-Weight Impact',
        'MIL-HDBK-17 — Composite Materials Handbook (FAA/DoD Guidelines)',
        'NASA-STD-6016 — Standard Materials and Processes Requirements for Spacecraft',
        'ISRO-PAS-104 — Quality and Process Specifications for Solid Rocket Motor Cases'
      ],
      troubleshooting: [
        {
          problem: 'Interlaminar Voids and Porosity in Autoclave Cured CFRP',
          causes: 'Incomplete vacuum debulking between ply layups, moisture in prepreg material, or premature resin gelation before full autoclave pressure application.',
          solutions: 'Perform intermediate vacuum debulks every 3–4 plies for 15 mins. Ensure prepreg out-time tracking and apply full 7 bar pressure before resin reach minimum viscosity.'
        },
        {
          problem: 'Micro-Cracking after Cryogenic Thermal Cycling in Spacecraft Composites',
          causes: 'Mismatch in Coefficient of Thermal Expansion (CTE) between matrix resin and carbon fibers during cycling between −150°C and +120°C.',
          solutions: 'Incorporate core-shell rubber nanoparticles or multi-walled carbon nanotubes into cyanate ester matrix to increase fracture toughness (GIC).'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Polymer Composites', lessons: 12, topics: ['Autoclave Mechanics', 'Filament Winding', 'Micro-mechanics'], slug: 'polymer-composites' },
        { name: 'Polymer Chemistry', lessons: 12, topics: ['Epoxy Crosslinking', 'Cyanate Esters', 'Polyimides'], slug: 'polymer-chemistry' },
        { name: 'Polymer Testing', lessons: 10, topics: ['Ultrasonic NDT C-Scan', 'DMA Glass Transition', 'Interlaminar Shear'], slug: 'polymer-testing' }
      ],
      careers: [
        { role: 'Aerospace Composite Structural Engineer', salary: '₹8–24 LPA', demand: 'Very High' },
        { role: 'Defense Materials Scientist', salary: '₹9–26 LPA', demand: 'High' },
        { role: 'NDT & Quality Assurance Manager', salary: '₹6–16 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Tata Advanced Materials Limited (TAML)', location: 'Bengaluru, Karnataka', specialization: 'Aerospace Structural Panels, Boeing & Airbus Composite Shipsets' },
      { name: 'Godrej Aerospace', location: 'Mumbai, Maharashtra', specialization: 'ISRO PSLV/GSLV Rocket Motor Casings, Satellite Assemblies' },
      { name: 'MKU Limited', location: 'Kanpur, Uttar Pradesh', specialization: 'Advanced Ballistic Armor, Helmets, Night-Vision Composite Shells' },
      { name: 'Dynamatic Technologies', location: 'Bengaluru, Karnataka', specialization: 'Bell Helicopter Major Airframe Assemblies, Sukhoi Wing Flaps' }
    ]
  },

  automotive: {
    id: 'automotive',
    title: 'Automotive & Electric Mobility',
    icon: '🚗',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    stats: {
      marketSize: '₹3.8 Lakh Crore',
      growth: '14.0% CAGR',
      employment: '3.1M+ Workforce',
      units: '22,000+ Component Suppliers'
    },
    overview: {
      description: 'Polymers are the key to vehicle lightweighting, fuel economy, and EV range optimization. Over 15% of a modern passenger car weight consists of engineered plastics that replace heavy metals without sacrificing passenger safety.',
      impact: 'Replacing 100 kg of steel with engineering polymers reduces CO2 emissions by up to 20 grams per kilometer. In Electric Vehicles, flame-retardant thermoplastics insulate high-voltage batteries and mitigate thermal runaway hazards.',
      indianContext: 'India is the worlds 3rd largest automobile market. Mega clusters in Pune-Chakan, Chennai-Sriperumbudur, and Gurugram-Manesar consume millions of tons of polypropylene, polyamide, and PC/ABS alloys annually.'
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'Impact-Modified Polypropylene Copolymer (PP-EPDM)',
          properties: 'High Melt Flow Index (MFI 15–30), Izod impact >400 J/m at −30°C, low thermal expansion coefficient with 15–20% talc filling.',
          applications: 'Front and rear bumper fascias, door cladding, instrument panel substrates, pillar trims.',
          indianPlayers: 'Reliance Industries (Repol), Supreme Industries, Motherson Sumi, Kingfa India'
        },
        {
          name: 'Polyamide 6,6 (30–50% Glass Fiber Reinforced PA66-GF)',
          properties: 'Tensile strength 175–220 MPa, Heat Deflection Temperature (HDT > 250°C), resistance to hot engine oil, glycol, and brake fluid.',
          applications: 'Engine intake manifolds, radiator end tanks, EV thermal management coolant valves, rocker covers.',
          indianPlayers: 'BASF India, DuPont India (Celanese), SRF Limited, DSM India'
        },
        {
          name: 'Polycarbonate / ABS Alloy (PC/ABS)',
          properties: 'Superb dimensional stability, high ductility at low temperatures, heat resistance (HDT 110–125°C), high surface gloss for electroplating.',
          applications: 'Automotive instrument clusters, interior center consoles, illuminated door handles, HUD housing.',
          indianPlayers: 'INEOS Styrolution India, SABIC India, Covestro India'
        },
        {
          name: 'UL94 V-0 Flame Retardant PBT / Polycarbonate',
          properties: 'Glow Wire Flammability Index 960°C, zero halogen flame retardancy, tracking resistance (CTI > 600V).',
          applications: 'EV high-voltage connectors, battery module enclosures, onboard charger housings, busbar covers.',
          indianPlayers: 'SABIC India (Valox), Lanxess India, Polyplastics India'
        }
      ],
      processes: [
        {
          name: 'Large-Tonnage Automotive Injection Moulding',
          description: 'High-speed injection of bumper fascias and dashboards on 2500–4000 ton clamping force machines using sequential valve gate hot runner systems.',
          keyParameters: 'Clamp tonnage calculation (0.35–0.5 ton/cm²), valve gate open/close timing, cooling water flow rate (Reynolds > 10,000).'
        },
        {
          name: 'Gas-Assist Injection Moulding (GAIM)',
          description: 'Injecting high-pressure nitrogen gas (100–300 bar) into the core of molten resin to core out thick sections and eliminate sink marks in door handles and grab bars.',
          keyParameters: 'Resin shot volume (65–85%), gas delay time, gas injection pressure profile, venting cycle.'
        },
        {
          name: 'In-Mould Decoration & Grain Texturing (IMD)',
          description: 'Integrating textured decorative films or real-stitch soft skin foils directly inside the mould cavity prior to plastic melt injection.',
          keyParameters: 'Electrostatic foil pinning, melt front speed control, gate location to prevent foil wash-off.'
        }
      ],
      standards: [
        'AIS-004 / IS 14644 — Automotive Safety Standards for Bumper & Interior Trim',
        'ISO 26262 — Road Vehicles — Functional Safety in Electronics & EV Plastics',
        'UL 94 — Flammability Standards for EV Battery Enclosure Materials',
        'ASTM D638 / ISO 527 — Tensile Testing of Automotive Structural Plastics',
        'FMVSS 302 — Flammability of Interior Materials for Motor Vehicles'
      ],
      troubleshooting: [
        {
          problem: 'Warpage & Dimensional Distortion in Long Automotive Trim Panels',
          causes: 'Differential mould cooling between core and cavity sides, anisotropic shrinkage caused by glass fiber orientation in flow direction.',
          solutions: 'Balance water cooling temperatures (keep differential < 5°C), reposition gates to align fibers uniformly, or switch to low-shrinkage mineral-filled PP.'
        },
        {
          problem: 'Weld Line Weakness on Safety Airbag Housing Modules',
          causes: 'Cold melt front meeting opposite flow streams with low holding pressure and inadequate local venting.',
          solutions: 'Increase mould wall temperature by 15°C, apply sequential hot runner valve timing to eliminate weld lines, or add vacuum cavity venting.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Mould Design', lessons: 10, topics: ['Automotive Tooling', 'Hot Runner Valve Gates', 'Cooling Layouts'], slug: 'mould-design' },
        { name: 'Polymer Processing', lessons: 14, topics: ['Gas-Assist Injection', 'Cycle Time Optimization', 'Clamping Forces'], slug: 'polymer-processing' },
        { name: 'Polymer Testing', lessons: 10, topics: ['Charpy Impact Testing', 'HDT & Flammability', 'Accelerated Weathering'], slug: 'polymer-testing' }
      ],
      careers: [
        { role: 'Automotive Plastics CAE Specialist', salary: '₹7–20 LPA', demand: 'Very High' },
        { role: 'EV Battery Materials Engineer', salary: '₹8–24 LPA', demand: 'Explosive' },
        { role: 'Tooling & Mould Design Manager', salary: '₹6–18 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Motherson Sumi Systems (SAMIL)', location: 'Noida, Pune, Chennai', specialization: 'Exterior Bumpers, Cockpit Modules, Rear-View Vision Systems (Global Tier 1)' },
      { name: 'Supreme Industries Limited', location: 'Mumbai & Khopoli, Maharashtra', specialization: 'Automotive Injection Moulded Trim, Heavy-Duty Crates, Pallets' },
      { name: 'Varroc Engineering', location: 'Aurangabad & Pune, Maharashtra', specialization: 'Automotive LED Exterior Lighting, Polymer Reflectors, Powertrain Components' },
      { name: 'Lumax Auto Technologies', location: 'Gurugram & Pune', specialization: 'Integrated Plastic Fuel Tanks, Shift Towers, Air Intake Systems' }
    ]
  },

  electronics: {
    id: 'electronics',
    title: 'Electronics & Semiconductor Tech',
    icon: '⚡',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    stats: {
      marketSize: '₹2.9 Lakh Crore',
      growth: '16.8% CAGR',
      employment: '1.8M+ Workforce',
      units: '8,400+ Electronic Units'
    },
    overview: {
      description: 'Without dielectric polymers, semiconductor chips cannot be packaged, connected, or protected. Epoxy moulding compounds, polyimides, liquid crystal polymers (LCP), and fluoropolymers form the silent molecular backbone of the digital age.',
      impact: 'Ultra-pure epoxy transfer moulding protects silicon chips measuring nanometers from moisture, mechanical stress, and short circuits for 10+ years. High-frequency 5G mmWave antennas rely entirely on low dielectric loss polymers (Dk < 3.0).',
      indianContext: "India's electronics manufacturing ecosystem is booming under the PLI scheme. Smartphone assembly corridors in Sriperumbudur and Noida, alongside emerging semiconductor packaging (ATMP) fabs in Gujarat, rely on high-purity polymer supply chains."
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'Epoxy Moulding Compound (EMC)',
          properties: 'Fused silica filler loading >85%, low CTE (8–12 ppm/°C) matched to silicon, high thermal conductivity, low ionic impurities (Cl⁻ < 5 ppm).',
          applications: 'Integrated circuit (IC) encapsulation, BGA chip packaging, power module potting.',
          indianPlayers: 'Sumitomo / Henkel supply, ATMP units in Sanand & Dholera'
        },
        {
          name: 'Liquid Crystal Polymer (LCP)',
          properties: 'Dielectric constant (Dk 2.9–3.2), dissipation factor (Df < 0.002 at 10 GHz), extreme flow for 0.1 mm thin-wall connectors.',
          applications: '5G smartphone antenna substrates, micro-coaxial connectors, camera module housings.',
          indianPlayers: 'Celanese / Polyplastics supply, Molex India, Amphenol India'
        },
        {
          name: 'Flexible Polyimide Films (Kapton type)',
          properties: 'Thermal stability (−269°C to +400°C), dielectric strength >200 kV/mm, extreme fold flexibility (>100,000 cycles).',
          applications: 'Flexible Printed Circuits (FPC), foldable display substrates, traction motor insulation.',
          indianPlayers: 'DuPont India supply, AT&S India, Shogini Technoarts'
        },
        {
          name: 'Polyphenylene Sulfide (PPS)',
          properties: 'Melting point 280°C, continuous service at 220°C, inherently flame retardant (UL94 V-0 without additives), resistance to solder reflow (260°C).',
          applications: 'SMT electrical connectors, optical fiber ferrules, IGBT power inverter frames.',
          indianPlayers: 'DIC India, Solvay India, Toray India'
        }
      ],
      processes: [
        {
          name: 'Semiconductor Transfer Moulding',
          description: 'Transferring pre-heated solid EMC pellets under high pressure into multi-cavity leadframe moulds encapsulating delicate silicon wire bonds (25 micron gold/copper wires).',
          keyParameters: 'Transfer ram velocity (0.5–2.0 mm/s), mold temperature (175–185°C), wire sweep inspection (<3%).'
        },
        {
          name: 'SMT High-Temperature Solder Reflow Resistance',
          description: 'Ensuring engineering thermoplastics survive lead-free surface mount reflow ovens reaching 260°C peak temperatures without blistering or dimensional deformation.',
          keyParameters: 'Moisture sensitivity level (MSL 1 to 3), peak temperature dwell time (30–60s), thermal expansion match.'
        },
        {
          name: 'Thin-Wall Precision Micro-Connector Moulding',
          description: 'High-speed injection moulding of 0.2 mm pitch micro-pitch connectors using ultra-high flow LCP resins on all-electric machines.',
          keyParameters: 'Injection speed (>300 mm/s), tool vacuum assist, optical cavity laser sensor verification.'
        }
      ],
      standards: [
        'IPC-TM-650 — Test Methods for Printed Boards & Electronic Substrates',
        'JEDEC J-STD-020 — Moisture/Reflow Sensitivity Classification for Non-Hermetic Solid State Surface Mount Devices',
        'RoHS (Directive 2011/65/EU) — Restriction of Hazardous Substances (Lead, Cadmium, PBDE)',
        'ASTM D150 — AC Loss Characteristics and Permittivity (Dielectric Constant) of Solid Electrical Insulation',
        'IEC 60664 — Insulation Coordination for Equipment within Low-Voltage Systems'
      ],
      troubleshooting: [
        {
          problem: 'Popcorning Blistering during 260°C Solder Reflow',
          causes: 'Moisture absorbed inside the plastic IC package vaporizing explosively into steam at 260°C solder temperatures.',
          solutions: 'Bake electronic components at 125°C for 24 hours before reflow; switch to low moisture absorption EMC with silica coupling agents.'
        },
        {
          problem: 'Wire Sweep Distortion in Semiconductor Leadframes',
          causes: 'Melt viscosity of EMC too high, transfer ram speed excessive, or unbalanced mold cavity gate filling.',
          solutions: 'Preheat EMC pellets using RF preheaters to lower initial melt viscosity; reduce transfer velocity profile during gate entry.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Polymer Chemistry', lessons: 12, topics: ['Epoxy Formulations', 'Dielectric Properties', 'Polyimides'], slug: 'polymer-chemistry' },
        { name: 'Polymer Testing', lessons: 10, topics: ['Dielectric Strength', 'DMA CTE Measurement', 'UL94 V-0 Testing'], slug: 'polymer-testing' },
        { name: 'Mould Design', lessons: 10, topics: ['Transfer Moulding Tools', 'Micro-Cavity Machining', 'Leadframe Clamping'], slug: 'mould-design' }
      ],
      careers: [
        { role: 'Electronic Packaging Materials Engineer', salary: '₹8–22 LPA', demand: 'Very High' },
        { role: 'Semiconductor ATMP Process Specialist', salary: '₹10–28 LPA', demand: 'Explosive' },
        { role: 'High-Frequency Dielectrics Scientist', salary: '₹9–25 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Molex India Limited', location: 'Bengaluru, Karnataka', specialization: 'Micro-pitch Electronic Connectors, Fiber Optics, 5G Interconnects' },
      { name: 'Amphenol Interconnect India', location: 'Pune, Maharashtra', specialization: 'Mil-Aero Connectors, Automotive High-Voltage Busbars, Sensors' },
      { name: 'Kaynes Technology', location: 'Mysuru & Manesar', specialization: 'Electronic Manufacturing Services (EMS), Smart Meter Moulding' },
      { name: 'Shogini Technoarts', location: 'Pune, Maharashtra', specialization: 'High-Reliability Rigid & Flex Polyimide Printed Circuit Boards' }
    ]
  },

  textiles: {
    id: 'textiles',
    title: 'Technical Textiles & Apparel',
    icon: '🧵',
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    stats: {
      marketSize: '₹2.1 Lakh Crore',
      growth: '11.8% CAGR',
      employment: '4.5M+ Workforce',
      units: '18,500+ Spun & Woven Mills'
    },
    overview: {
      description: 'Over 65% of all fibers produced globally are synthetic polymers. From everyday activewear polyester and nylon microfibers to heavy-duty geotextiles that stabilize national highways, synthetic polymers dominate modern textiles.',
      impact: 'Synthetic fibers prevent deforestation and immense water depletion compared to traditional natural crops. Engineered hollow-filament polyester provides superior thermal insulation for high-altitude defense clothing in the Himalayas.',
      indianContext: 'India is the worlds second-largest producer of synthetic textiles. Surat (Gujarat), Tirupur (Tamil Nadu), Bhilwara (Rajasthan), and Panipat (Haryana) host massive melt-spinning towers and non-woven lines.'
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'Polyethylene Terephthalate (Polyester / PET Fiber)',
          properties: 'Tenacity 4.5–7.5 g/denier, moisture regain <0.4%, wrinkle recovery, high resistance to UV and biological degradation.',
          applications: 'Apparel activewear, tyre cord fabric, seatbelt webbing, non-woven geotextiles.',
          indianPlayers: 'Reliance Industries (Recron), Indorama Synthetics, Filatex India, SRF Limited'
        },
        {
          name: 'Nylon 6 and Nylon 6,6 Industrial Yarn',
          properties: 'Extreme elongation recovery (98% at 5% stretch), abrasion resistance, high energy absorption, melting point 260°C.',
          applications: 'Automotive tyre cord fabrics, parachute canopy cloth, mountaineering ropes, industrial fishing nets.',
          indianPlayers: 'SRF Limited (Chennai), Century Enka (Pune), Gujarat State Fertilizers (GSFC)'
        },
        {
          name: 'Polypropylene Spunbond & Meltblown (PP Non-woven)',
          properties: 'Hydrophobic, low density (0.90 g/cm³), micro-fiber diameter (1–5 microns in meltblown) providing electrostatic virus filtration.',
          applications: 'N95 surgical mask filters, hygiene diaper liners, civil engineering roadbed geotextile membranes.',
          indianPlayers: 'Welspun India, Global Nonwovens (Nashik), Supreme Nonwoven'
        },
        {
          name: 'Polyurethane Elastomer (Spandex / Elastane)',
          properties: 'Elastic recovery 99% after 500% elongation, segmented block copolymer structure (hard urethane + soft polyether blocks).',
          applications: 'Stretch activewear, compression surgical stockings, sportswear fabrics.',
          indianPlayers: 'Indorama Spandex, Century Enka, international imports'
        }
      ],
      processes: [
        {
          name: 'High-Speed Melt Spinning & Drawing',
          description: 'Extruding molten polymer through micro-hole spinneret plates (100–1000 holes of 0.2 mm) into quenching air chimneys, followed by high-speed Godet draw-roll winding at 4000–6000 m/min.',
          keyParameters: 'Spinning pack pressure (150–250 bar), quench air velocity (0.3–0.5 m/s at 20°C), draw ratio (2.5–3.5x), spin finish oil emulsion.'
        },
        {
          name: 'Spunmelt (SMS) Non-Woven Production',
          description: 'Continuous integration of Spunbond (strength layers) and Meltblown (microfiber filtration layers) in a single high-speed inline calender bonding line.',
          keyParameters: 'Meltblown air knife temperature (280°C), thermal calender bonding roll temperature (140–160°C), fabric GSM.'
        },
        {
          name: 'Circular Weft Knitting & Dyeing',
          description: 'Knitting micro-denier synthetic yarns with elastane cores into multi-directional stretch fabrics on high-speed circular knitting machines.',
          keyParameters: 'Yarn tension (2–4 cN), machine RPM (25–35), high-pressure jet dyeing at 130°C for polyester.'
        }
      ],
      standards: [
        'IS 16391:2015 — Geotextiles — Requirements for Sub-Grade Stabilization in Pavements',
        'IS 9473:2002 — Respiratory Protective Devices — Filtering Half Masks',
        'ASTM D2256 — Standard Test Method for Tensile Properties of Yarns by the Single-Strand Method',
        'ASTM D4632 — Grab Breaking Load and Elongation of Geotextiles',
        'OEKO-TEX Standard 100 — Harmful Substances Testing in Synthetic Textiles'
      ],
      troubleshooting: [
        {
          problem: 'Filament Breakage in High-Speed Melt Spinning (Doffers & Fuzz Balls)',
          causes: 'Gels or unmelted polymer particles blocking spinneret capillary holes, moisture in PET chips causing hydrolytic degradation.',
          solutions: 'Dry PET chips to moisture < 0.003% (30 ppm); install continuous polymer melt filter packs (20-micron rating) before spinnerets.'
        },
        {
          problem: 'Uneven Dyeing & Barre Marks in Polyester Knitted Fabric',
          causes: 'Variation in draw ratio or thermal history during POY texturizing resulting in variable yarn crystalline orientation.',
          solutions: 'Verify texturizing heater plate temperature uniformity (±1°C); maintain consistent yarn feed tension during POY draw-texturizing.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Rubber Technology', lessons: 12, topics: ['Elastomers', 'Latex Spinning', 'Vulcanization'], slug: 'rubber-technology' },
        { name: 'Polymer Processing', lessons: 14, topics: ['Melt Spinning', 'Non-Woven SMS Lines', 'Extrusion Rheology'], slug: 'polymer-processing' },
        { name: 'Polymer Testing', lessons: 10, topics: ['Yarn Tenacity', 'Bursting Strength', 'Hydrostatic Head'], slug: 'polymer-testing' }
      ],
      careers: [
        { role: 'Technical Textiles R&D Engineer', salary: '₹6–16 LPA', demand: 'High' },
        { role: 'Melt Spinning Process Specialist', salary: '₹5–14 LPA', demand: 'Very High' },
        { role: 'Geotextiles Civil Consultant', salary: '₹7–18 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Reliance Industries Limited (Recron)', location: 'Hazira, Patalganga, Silvassa', specialization: 'World’s Largest Integrated Polyester Producer (Fibers, POY, FDY)' },
      { name: 'SRF Limited', location: 'Chennai, Tamil Nadu', specialization: 'High-Tenacity Nylon 6 Tyre Cord Fabric, Coated Technical Fabrics' },
      { name: 'Welspun Living Limited', location: 'Anjar, Gujarat', specialization: 'Spunlace & Spunbond Non-woven Technical Fabrics, Advanced Hygiene' },
      { name: 'Rubfila International Limited', location: 'Palakkad, Kerala', specialization: 'Latex Rubber Thread, Core-Spun Elastic Yarns (Export to 30+ Countries)' }
    ]
  },

  construction: {
    id: 'construction',
    title: 'Infrastructure & Construction',
    icon: '🏗️',
    color: '#15803D',
    bgColor: '#F0FDF4',
    stats: {
      marketSize: '₹3.5 Lakh Crore',
      growth: '13.2% CAGR',
      employment: '2.8M+ Workforce',
      units: '16,000+ Extrusion Units'
    },
    overview: {
      description: 'Modern civil infrastructure relies on non-corrosive, durable polymer piping, roofing, insulation, and window systems. High-Density Polyethylene (HDPE), CPVC, and uPVC transport water and power for over 50 years without rusting.',
      impact: 'Plastic piping saves millions of liters of clean drinking water previously lost to metallic rust and pipe bursts. Underground gas networks in city gas distribution (CGD) projects across India use yellow MDPE pipes exclusively.',
      indianContext: 'The Jal Jeevan Mission, Smart Cities Mission, and City Gas Distribution have created unprecedented demand for HDPE, CPVC, and DWC corrugated pipes across every state in India.'
    },
    technicalDeepDive: {
      materials: [
        {
          name: 'High-Density Polyethylene PE-100 (HDPE)',
          properties: 'Minimum Required Strength (MRS 10.0 MPa at 50 years), Slow Crack Growth (SCG > 500 hrs), high impact resistance.',
          applications: 'Potable water pipelines, submarine sewer outfalls, industrial effluent lines, mining slurry piping.',
          indianPlayers: 'Reliance (Relene PE100), GAIL, Astral Pipes, Supreme Industries, Jain Irrigation'
        },
        {
          name: 'Chlorinated Polyvinyl Chloride (CPVC)',
          properties: 'Chlorine content 67%, Heat Deflection Temperature (HDT 100–110°C), fire rating (UL94 V-0), high hydrostatic design stress.',
          applications: 'Hot and cold domestic water plumbing, industrial chemical piping, fire sprinkler systems.',
          indianPlayers: 'Astral Pipes, Lubrizol India (FlowGuard), Prince Pipes, Finolex'
        },
        {
          name: 'Rigid Unplasticized PVC (uPVC)',
          properties: 'Tensile modulus >3000 MPa, excellent dimensional stability, multi-chamber thermal insulation (U-value < 1.4 W/m²K).',
          applications: 'Energy-efficient window profiles, rainwater drainage pipes, underground electrical conduits.',
          indianPlayers: 'Fenesta (DCM Shriram), Finolex Industries, Supreme Industries, Apar Industries'
        },
        {
          name: 'EPDM & TPO Roofing Membranes',
          properties: 'Elongation >300%, multi-decade UV and ozone resistance, ponding water resistance, reflective solar index (SRI > 100).',
          applications: 'Waterproofing flat roofs, tunnel liners, artificial irrigation reservoirs, geomembranes.',
          indianPlayers: 'Supreme Industries, STP Limited, Pidilite Industries'
        }
      ],
      processes: [
        {
          name: 'Large-Diameter Pipe Vacuum Extrusion',
          description: 'Continuous extrusion of PE-100 pipes up to 2500 mm diameter using helical spiral groove extruders and multi-chamber vacuum calibration cooling tanks.',
          keyParameters: 'Melt temperature (190–210°C), vacuum level (−0.3 to −0.6 bar), cooling spray nozzle layout, ultrasonic wall-thickness tracking.'
        },
        {
          name: 'Multi-Chamber uPVC Profile Extrusion',
          description: 'Twin-screw conical extrusion of rigid PVC dry-blend through complex multi-cavity profile dies with air calibration tools for window frames.',
          keyParameters: 'Screw oil cooling (140–160°C), die lip heater balance (190–205°C), dry vacuum calibrator water cooling.'
        },
        {
          name: 'Butt-Fusion & Electrofusion Welding',
          description: 'Heating square pipe ends against a PTFE-coated heating plate (220°C) and joining under precise hydraulic fusion pressure to create permanent leak-proof joints.',
          keyParameters: 'Interfacial pressure (0.15 N/mm²), heat soak time, bead-up height verification, cooling time under pressure.'
        }
      ],
      standards: [
        'IS 4984:2016 — High Density Polyethylene Pipes for Water Supply — Specification',
        'IS 15778:2007 — Chlorinated Polyvinyl Chloride (CPVC) Pipes for Potable Hot and Cold Water',
        'IS 4985:2021 — Unplasticized PVC Pipes for Potable Water Supplies',
        'ISO 4427 — Polyethylene (PE) Piping Systems for Water Supply',
        'ASTM F714 — Standard Specification for Polyethylene (PE) Plastic Pipe Based on Outside Diameter'
      ],
      troubleshooting: [
        {
          problem: 'Ovality and Sagging in Extra-Large Diameter HDPE Pipes (>800 mm)',
          causes: 'Gravity sagging of heavy molten PE wall before the inner layer freezes in the water cooling tank.',
          solutions: 'Employ internal pipe cooling (IPC) systems, lower melt temperature by 10°C, and use low-sag PE-100 resins with bimodal molecular weight distributions.'
        },
        {
          problem: 'Brittleness & Impact Cracking in uPVC Window Profiles',
          causes: 'Inadequate acrylic impact modifier (AIM) dosage, over-chlorinated PVC dry blend, or excessive shear heating during twin-screw extrusion.',
          solutions: 'Ensure 5–6 phr acrylic impact modifier dosage; calibrate screw oil cooling to maintain melt temperature below 200°C.'
        }
      ]
    },
    curriculum: {
      modules: [
        { name: 'Polymer Testing', lessons: 10, topics: ['Hydrostatic Burst Pressure', 'Carbon Black Dispersion', 'Melt Flow Rate'], slug: 'polymer-testing' },
        { name: 'Polymer Processing', lessons: 14, topics: ['Pipe Extrusion Tooling', 'Twin-Screw Compounding', 'Calibration Tanks'], slug: 'polymer-processing' },
        { name: 'Plastic Packaging Engineering', lessons: 16, topics: ['Geomembranes', 'HDPE Water Tanks', 'Rotomoulding'], slug: 'plastic-packaging-engineering' }
      ],
      careers: [
        { role: 'Infrastructure Piping Specialist', salary: '₹6–16 LPA', demand: 'Very High' },
        { role: 'Extrusion Production Plant Manager', salary: '₹7–20 LPA', demand: 'High' },
        { role: 'Pipeline QA/QC Inspector', salary: '₹5–14 LPA', demand: 'High' }
      ]
    },
    companies: [
      { name: 'Astral Limited', location: 'Ahmedabad, Gujarat', specialization: 'CPVC Plumbing Systems, HDPE Jal Jeevan Pipes, Underground Drainage' },
      { name: 'Supreme Industries Limited', location: 'Mumbai & Jalgaon, Maharashtra', specialization: 'Piping Products, Industrial Moulded Products, Protective Packaging' },
      { name: 'Finolex Industries Limited', location: 'Pune & Ratnagiri, Maharashtra', specialization: 'Agricultural PVC-U Pipes, Resin Manufacturing, Fittings' },
      { name: 'Prince Pipes and Fittings', location: 'Mumbai, Maharashtra', specialization: 'CPVC, UPVC, HDPE Piping Systems, Storage Tanks' }
    ]
  }
}

export default function IndustryDetailPage({ params }: { params: { industry: string } }) {
  const industry = INDUSTRY_DATA[params.industry.toLowerCase()]
  const [selectedTab, setSelectedTab] = useState<'overview' | 'materials' | 'processes' | 'standards' | 'troubleshooting' | 'curriculum' | 'careers'>('overview')

  if (!industry) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── Top Breadcrumb Nav ── */}
      <div className="bg-[#0A1628] border-b border-slate-800 text-slate-300 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/world"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to World Atlas
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">World Atlas</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-bold">{industry.title}</span>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <span className="text-xl">{industry.icon}</span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Core Industrial Pillar &middot; Engineering Deep Dive
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            {industry.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Engineering Breakdown
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Comprehensive material formulations, high-throughput manufacturing processes, ASTM/ISO specifications, and Indian petrochemical benchmarks.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl mx-auto">
            <div className="bg-white/10 border border-white/15 p-3.5 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{industry.stats.marketSize}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Market Size</span>
            </div>
            <div className="bg-white/10 border border-white/15 p-3.5 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">{industry.stats.growth}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Growth Rate</span>
            </div>
            <div className="bg-white/10 border border-white/15 p-3.5 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">{industry.stats.employment}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Employment</span>
            </div>
            <div className="bg-white/10 border border-white/15 p-3.5 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">{industry.stats.units}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Processing Units</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-2 shadow-xl flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📖 Sector Overview' },
            { id: 'materials', label: '🧪 Materials & Specs' },
            { id: 'processes', label: '⚙️ Manufacturing Processes' },
            { id: 'standards', label: '📋 Standards & Tests' },
            { id: 'troubleshooting', label: '🔧 Troubleshooting' },
            { id: 'curriculum', label: '📚 Curriculum Modules' },
            { id: 'careers', label: '💼 Career Opportunities' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as TabId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT BODY ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {selectedTab === 'overview' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Foundational Role</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Why This Sector Matters</h2>
              <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-normal">
                {industry.overview.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-800 uppercase">
                  <Zap className="w-4 h-4 text-blue-600" /> Real-World Global Impact
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {industry.overview.impact}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-800 uppercase">
                  <Factory className="w-4 h-4 text-amber-600" /> 🇮🇳 Indian Industrial Benchmark
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {industry.overview.indianContext}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATERIALS */}
        {selectedTab === 'materials' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Polymer Chemistry &amp; Formulations</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Key Materials &amp; Specifications</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {industry.technicalDeepDive.materials.map((mat) => (
                <div 
                  key={mat.name}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-slate-50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-display font-black text-base text-slate-900">{mat.name}</h3>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1.5 font-medium">
                    <p><strong className="font-mono text-slate-900">Key Properties:</strong> {mat.properties}</p>
                    <p><strong className="font-mono text-slate-900">Typical Applications:</strong> {mat.applications}</p>
                    <p><strong className="font-mono text-blue-700">Indian Manufacturers / Suppliers:</strong> {mat.indianPlayers}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROCESSES */}
        {selectedTab === 'processes' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Shop Floor Operations</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Manufacturing Processes</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {industry.technicalDeepDive.processes.map((proc) => (
                <div 
                  key={proc.name}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-slate-50 hover:bg-white transition-all space-y-3"
                >
                  <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    {proc.name}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {proc.description}
                  </p>
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs font-medium text-slate-800">
                    <strong className="font-mono text-blue-800 uppercase text-[10px] block mb-0.5">Critical Machine Parameters:</strong>
                    {proc.keyParameters}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STANDARDS */}
        {selectedTab === 'standards' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Quality Assurance &amp; Compliance</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Industry Standards &amp; Certifications</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {industry.technicalDeepDive.standards.map((std) => (
                <div key={std} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{std}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TROUBLESHOOTING */}
        {selectedTab === 'troubleshooting' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Defect Diagnostic Engine</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Common Processing Defects &amp; Solutions</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {industry.technicalDeepDive.troubleshooting.map((item) => (
                <div key={item.problem} className="p-5 border-2 border-red-200 bg-red-50/20 rounded-xl space-y-3">
                  <h3 className="font-display font-black text-sm text-red-700 flex items-center gap-2 uppercase">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Defect: {item.problem}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-700 font-medium">
                    <p><strong className="font-mono text-slate-900">Root Causes:</strong> {item.causes}</p>
                    <p className="text-emerald-700 font-bold"><strong className="font-mono text-emerald-900">Handbook Solution:</strong> {item.solutions}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/troubleshooter"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 hover:text-blue-800 uppercase"
              >
                Open Full 12-Defect Diagnostic Engine &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* TAB 6: CURRICULUM */}
        {selectedTab === 'curriculum' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Curriculum Alignment</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Mapped PolymerHub Learning Modules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {industry.curriculum.modules.map((mod) => (
                <div key={mod.name} className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                      {mod.lessons} Lessons
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 mt-2">{mod.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mod.topics.map(t => (
                        <span key={t} className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/subjects/${mod.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 hover:text-blue-800 uppercase pt-2 border-t border-slate-200"
                  >
                    Start Subject <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CAREERS */}
        {selectedTab === 'careers' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Talent &amp; Compensation</span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Career Paths in {industry.title}</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {industry.curriculum.careers.map((car) => (
                <div key={car.role} className="p-4 border-2 border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-4 bg-slate-50">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">{car.role}</h3>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">Average Compensation: {car.salary}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-mono font-bold rounded-full border border-amber-300 uppercase">
                    {car.demand} Demand
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 hover:text-blue-800 uppercase"
              >
                Go to Industry &amp; Career Hub &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* ── Leading Indian Companies Roster ── */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-display font-black text-xl text-slate-900 uppercase">Leading Indian Companies &amp; Plants</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {industry.companies.map(comp => (
              <div key={comp.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-display font-bold text-sm text-slate-900">{comp.name}</h4>
                <p className="text-[10px] font-mono text-slate-500">{comp.location}</p>
                <p className="text-xs text-slate-700 font-medium pt-1 border-t border-slate-200/60 leading-normal">{comp.specialization}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM AI INDUSTRY SPECIALIST CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Industry Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Wondering how {industry.title} actually operates on the shop floor? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Industry Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Ask our RAG-grounded AI Tutor about resin formulations, cycle times, mould flow, and plant capital expenditure for {industry.title}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/ai-tutor?prompt=Explain%20the%20detailed%20manufacturing%20process%20and%20resin%20specifications%20for%20${encodeURIComponent(industry.title)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Industry Specialist &rarr;
            </Link>

            <Link
              href="/materials"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Materials Database
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
