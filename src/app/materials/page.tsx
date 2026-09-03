'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  Search, Filter, Lock, ChevronDown, ChevronUp, Database, Sparkles,
  Brain, Compass, AlertTriangle, Layers, Scale, Maximize2, X, ArrowLeft,
  ArrowRight, BookOpen, ExternalLink, CheckCircle2, FlaskConical, Atom,
  Check, Copy, Info
} from 'lucide-react'
import { ThreeDViewer } from '@/components/ThreeDViewer'
import { CommercialGradeComparator } from '@/components/CommercialGradeComparator'
import ClientPortal from '@/components/ClientPortal'
import { POLYMER_3D_KNOWLEDGE, Polymer3DModelDetails } from '@/lib/polymer_3d_knowledge_data'

type LocalModel = {
  id: string
  name: string
  category: string
  description: string
  model_type: string
}

// ─── 100+ Static 3D Model Catalog ─────────────────────────────────────────────
const LOCAL_MODELS: LocalModel[] = [
  // ── MOLECULES (30) ────────────────────────────────────────────────────────
  { id: 'm01', name: 'Polyethylene (PE)',            category: 'Molecule', description: "Linear chain; world's most produced plastic - packaging, bottles, films.",            model_type: 'molecule_polyethylene' },
  { id: 'm02', name: 'Polypropylene (PP)',            category: 'Molecule', description: 'Methyl side-branches; automotive, appliances, raffia bags.',                          model_type: 'molecule_polypropylene' },
  { id: 'm03', name: 'PVC',                          category: 'Molecule', description: 'Chlorine on alternate carbons; pipes, cables, faux-leather.',                         model_type: 'molecule_pvc' },
  { id: 'm04', name: 'Nylon 6,6',                   category: 'Molecule', description: 'Hydrogen-bonding amide links; gears, bearings, textiles.',                            model_type: 'molecule_nylon' },
  { id: 'm05', name: 'Polystyrene (PS)',             category: 'Molecule', description: 'Aromatic phenyl ring pendant; cups, toys, packaging foam.',                          model_type: 'molecule_polystyrene' },
  { id: 'm06', name: 'Polycarbonate (PC)',           category: 'Molecule', description: 'Carbonate linkage with bisphenol-A; optical discs, safety visors.',                  model_type: 'molecule_polycarbonate' },
  { id: 'm07', name: 'PET',                         category: 'Molecule', description: 'Ester linkage + aromatic ring; beverage bottles, polyester fibres.',                  model_type: 'molecule_pet' },
  { id: 'm08', name: 'PTFE (Teflon)',               category: 'Molecule', description: 'Fully fluorinated backbone; non-stick cookware, seals.',                             model_type: 'molecule_ptfe' },
  { id: 'm09', name: 'PEEK',                        category: 'Molecule', description: 'Ether-ketone links with aromatic rings; aerospace-grade polymer.',                    model_type: 'molecule_peek' },
  { id: 'm10', name: 'Polyurethane (PU)',           category: 'Molecule', description: 'Urethane linkage (N-C=O-O); foams, adhesives, coatings.',                            model_type: 'molecule_polyurethane' },
  { id: 'm11', name: 'PLA',                        category: 'Molecule', description: 'Bio-derived lactic-acid ester; compostable cups and 3D-print filament.',              model_type: 'molecule_pla' },
  { id: 'm12', name: 'PHA',                        category: 'Molecule', description: 'Bacterial polyhydroxyalkanoate; marine-degradable packaging.',                         model_type: 'molecule_pha' },
  { id: 'm13', name: 'ABS',                        category: 'Molecule', description: 'Acrylonitrile nitrile group + butadiene + styrene; LEGO, electronics casings.',       model_type: 'molecule_abs' },
  { id: 'm14', name: 'PMMA (Acrylic)',             category: 'Molecule', description: 'Methyl-methacrylate ester; display panels, optical lenses.',                          model_type: 'molecule_pmma' },
  { id: 'm15', name: 'POM (Acetal)',               category: 'Molecule', description: 'Alternating C-O backbone; precision gears and valve seats.',                          model_type: 'molecule_pom' },
  { id: 'm16', name: 'Nylon 6 (PA6)',              category: 'Molecule', description: 'Single amide repeat unit from caprolactam; engineering parts.',                        model_type: 'molecule_pa6' },
  { id: 'm17', name: 'PBT',                        category: 'Molecule', description: 'Butylene-terephthalate ester; electrical connectors, fan blades.',                     model_type: 'molecule_pbt' },
  { id: 'm18', name: 'Polysulfone (PSU)',          category: 'Molecule', description: 'Sulfonyl group (SO2) bridge; medical sterilisable parts.',                            model_type: 'molecule_psu' },
  { id: 'm19', name: 'PEI (Ultem)',               category: 'Molecule', description: 'Imide rings + ether links; aerospace brackets, FDM parts.',                           model_type: 'molecule_pei' },
  { id: 'm20', name: 'LCP',                       category: 'Molecule', description: 'Rigid-rod aromatic backbone; thin-wall connectors, antenna.',                          model_type: 'molecule_lcp' },
  { id: 'm21', name: 'Epoxy Resin',              category: 'Molecule', description: 'Epoxide ring cross-links; structural adhesives, composites.',                           model_type: 'molecule_epoxy' },
  { id: 'm22', name: 'Bakelite (Phenolic)',      category: 'Molecule', description: 'Phenol-formaldehyde network; electrical sockets, brake linings.',                      model_type: 'molecule_bakelite' },
  { id: 'm23', name: 'Silicone (PDMS)',          category: 'Molecule', description: 'Si-O backbone with methyl groups; implants, bakeware, sealants.',                      model_type: 'molecule_silicone' },
  { id: 'm24', name: 'Natural Rubber (NR)',      category: 'Molecule', description: 'Cis-1,4-polyisoprene chain; tyres, gloves, shock mounts.',                             model_type: 'molecule_rubber' },
  { id: 'm25', name: 'SBR',                     category: 'Molecule', description: 'Styrene-butadiene copolymer; truck tyres, shoe soles.',                                 model_type: 'molecule_sbr' },
  { id: 'm26', name: 'EPDM',                    category: 'Molecule', description: 'Ethylene-propylene-diene; roofing membranes, door seals.',                              model_type: 'molecule_epdm' },
  { id: 'm27', name: 'NBR (Nitrile)',           category: 'Molecule', description: 'Nitrile group gives oil resistance; fuel hoses, gloves.',                               model_type: 'molecule_nbr' },
  { id: 'm28', name: 'Neoprene',               category: 'Molecule', description: 'Chloroprene backbone; wetsuits, cable jackets.',                                          model_type: 'molecule_neoprene' },
  { id: 'm29', name: 'PVDF',                   category: 'Molecule', description: 'Vinylidene fluoride; piezoelectric films, chemical tubing.',                              model_type: 'molecule_pvdf' },
  { id: 'm30', name: 'PEBA',                   category: 'Molecule', description: 'Polyether-block-amide; running shoe midsoles, medical catheters.',                       model_type: 'molecule_peba' },

  // ── PRODUCTS (35) ─────────────────────────────────────────────────────────
  { id: 'p01', name: 'PET Water Bottle',                category: 'Product', description: 'High-clarity PET blow-moulded drinking bottle - 500 ml format.',                  model_type: 'product_bottle' },
  { id: 'p02', name: 'Automotive Bumper',               category: 'Product', description: 'Impact-modified PP bumper made using gas-assist injection moulding.',               model_type: 'product_bumper' },
  { id: 'p03', name: 'Flexible PP Sheet',               category: 'Product', description: 'Calendered PP sheet for thermoformed packaging and industrial dividers.',           model_type: 'product_sheet' },
  { id: 'p04', name: 'HDPE Milk Crate',                category: 'Product', description: 'Stackable HDPE milk crate - ribbed for rigidity, reusable.',                       model_type: 'product_crate' },
  { id: 'p05', name: 'PVC Pipe',                       category: 'Product', description: 'Schedule-40 uPVC pressure pipe; potable water and drainage systems.',               model_type: 'product_pipe' },
  { id: 'p06', name: 'Nylon Gear',                     category: 'Product', description: 'Injection-moulded PA66 spur gear - 20 deg pressure angle, self-lubricating.',         model_type: 'product_gear' },
  { id: 'p07', name: 'PC Safety Visor',                category: 'Product', description: '3 mm polycarbonate face shield; anti-scratch coated.',                             model_type: 'product_visor' },
  { id: 'p08', name: 'ABS Electronic Housing',         category: 'Product', description: 'Snap-fit ABS enclosure for consumer electronics PCB assembly.',                     model_type: 'product_housing' },
  { id: 'p09', name: 'LDPE Shrink Film',               category: 'Product', description: 'Multi-layer blown LDPE shrink film for beverage multipacks.',                       model_type: 'product_film' },
  { id: 'p10', name: 'PP Woven Bag',                   category: 'Product', description: '50 kg raffia-weave polypropylene bag for fertilisers and grains.',                  model_type: 'product_bag' },
  { id: 'p11', name: 'PTFE Gasket',                    category: 'Product', description: 'Full-face PTFE ring gasket for chemical-process pipe flanges.',                      model_type: 'product_gasket' },
  { id: 'p12', name: 'POM Bearing Cage',               category: 'Product', description: 'Precision acetal bearing retainer; dimensionally stable under load.',               model_type: 'product_bearing' },
  { id: 'p13', name: 'PEEK Aerospace Bracket',         category: 'Product', description: 'Thin-wall PEEK bracket replacing aluminium in avionics bay.',                       model_type: 'product_bracket' },
  { id: 'p14', name: 'PU Foam Seat',                   category: 'Product', description: 'HR cold-cure polyurethane foam - automotive seat cushion 25 kg/m3.',               model_type: 'product_foam' },
  { id: 'p15', name: 'PLA 3D-Print Filament Spool',   category: 'Product', description: '1 kg 1.75 mm PLA filament for FDM desktop printers.',                              model_type: 'product_spool' },
  { id: 'p16', name: 'HDPE Corrugated Pipe',           category: 'Product', description: 'Double-wall corrugated HDPE drain pipe for road sub-base.',                         model_type: 'product_corrugated' },
  { id: 'p17', name: 'PC/ABS Alloy Car Dashboard',    category: 'Product', description: 'Soft-touch IMD instrument panel in PC/ABS blend.',                                  model_type: 'product_dashboard' },
  { id: 'p18', name: 'PP Foam Insulation Panel',       category: 'Product', description: 'Expanded polypropylene (EPP) slab - 30 g/L for thermal packaging.',                model_type: 'product_panel' },
  { id: 'p19', name: 'Nylon Cable Tie',               category: 'Product', description: 'Standard 300 mm PA66 cable tie; tensile 120 N; UL-listed.',                         model_type: 'product_cabletie' },
  { id: 'p20', name: 'PMMA Optical Lens',             category: 'Product', description: 'Precision-moulded PMMA convex lens for LED street lights.',                         model_type: 'product_lens' },
  { id: 'p21', name: 'PVC Electrical Conduit',       category: 'Product', description: '20 mm rigid PVC electrical conduit - IS 9537 Part 3.',                              model_type: 'product_conduit' },
  { id: 'p22', name: 'PP Disposable Syringe',        category: 'Product', description: '5 ml medical-grade PP syringe with latex-free plunger tip.',                         model_type: 'product_syringe' },
  { id: 'p23', name: 'HDPE Jerry Can',               category: 'Product', description: '20-litre blow-moulded HDPE fuel can; UN-certified.',                                 model_type: 'product_jerrycan' },
  { id: 'p24', name: 'ABS Helmet Shell',             category: 'Product', description: 'Single-piece ABS motorcycle helmet outer shell - IS 4151.',                          model_type: 'product_helmet' },
  { id: 'p25', name: 'PET Preform',                 category: 'Product', description: '28 g PET preform for 600 ml water bottle stretch-blow moulding.',                     model_type: 'product_preform' },
  { id: 'p26', name: 'PP Geo-textile Fabric',       category: 'Product', description: 'Non-woven spunbond PP fabric 200 g/m2 for road stabilisation.',                      model_type: 'product_geotextile' },
  { id: 'p27', name: 'LLDPE Silage Film',           category: 'Product', description: '6-layer co-extruded LLDPE stretch film for bale wrapping.',                          model_type: 'product_silagefilm' },
  { id: 'p28', name: 'PSU Medical Tray',            category: 'Product', description: 'Autoclave-stable polysulfone sterilisation tray for surgical instruments.',           model_type: 'product_tray' },
  { id: 'p29', name: 'PEI (Ultem) Duct Fitting',   category: 'Product', description: 'Ultem 1010 duct elbow - rated 180 degC continuous; aircraft interior.',                 model_type: 'product_ductfitting' },
  { id: 'p30', name: 'Silicone Baby Nipple',        category: 'Product', description: 'LSR injection-moulded silicone teat - FDA food-contact grade.',                       model_type: 'product_nipple' },
  { id: 'p31', name: 'NBR O-Ring',                 category: 'Product', description: 'Nitrile 70-Shore O-ring for hydraulic cylinders; ISO 3601.',                          model_type: 'product_oring' },
  { id: 'p32', name: 'EPDM Roofing Sheet',          category: 'Product', description: '1.5 mm EPDM single-ply roof waterproofing membrane.',                                model_type: 'product_roofsheet' },
  { id: 'p33', name: 'Neoprene Wetsuit Panel',     category: 'Product', description: '5 mm closed-cell neoprene for 5/4 fullsuit construction.',                            model_type: 'product_wetsuit' },
  { id: 'p34', name: 'TPU Shoe Sole',              category: 'Product', description: 'Thermoplastic polyurethane outsole - 80 Shore A; abrasion-resistant.',                model_type: 'product_shoesole' },
  { id: 'p35', name: 'PVC Tarpaulin',              category: 'Product', description: '650 g/m2 PVC-coated polyester tarpaulin; UV-stabilised.',                            model_type: 'product_tarpaulin' },

  // ── MACHINES (25) ─────────────────────────────────────────────────────────
  { id: 'mc01', name: 'Single-Screw Extruder',       category: 'Machine', description: 'L/D 25:1 single-screw extruder - 60 mm barrel for compounding.',                   model_type: 'machine_extruder' },
  { id: 'mc02', name: 'Injection Moulding Machine',  category: 'Machine', description: '200-ton hydraulic clamp; 2-platen toggle with servo pump.',                        model_type: 'machine_injection' },
  { id: 'mc03', name: 'Blow Moulding Die Head',      category: 'Machine', description: 'Spider-leg die head for continuous extrusion blow moulding.',                       model_type: 'machine_blowdie' },
  { id: 'mc04', name: 'Twin-Screw Compounder',       category: 'Machine', description: 'Co-rotating twin-screw ZSK-type; 40 mm, L/D 40 for masterbatch.',                model_type: 'machine_twinscrew' },
  { id: 'mc05', name: 'Blown Film Line',             category: 'Machine', description: 'Blown-film tower with 3-layer die; 1000 mm lay-flat width.',                       model_type: 'machine_blownfilm' },
  { id: 'mc06', name: 'Sheet Extrusion Line',        category: 'Machine', description: 'Wide-die sheet extruder with 3-roll polishing stack.',                             model_type: 'machine_sheetline' },
  { id: 'mc07', name: 'Thermoforming Machine',       category: 'Machine', description: 'Roll-fed rotary thermoformer; matched metal tooling; trim-in-place.',             model_type: 'machine_thermoforming' },
  { id: 'mc08', name: 'Calendering Line',            category: 'Machine', description: 'Inverted-L 4-roll calender for PVC rigid/flexible sheet.',                        model_type: 'machine_calender' },
  { id: 'mc09', name: 'Rotational Moulding Oven',   category: 'Machine', description: 'Carousel rotomoulding oven - 3-arm; 3000 L tank capacity.',                        model_type: 'machine_rotomould' },
  { id: 'mc10', name: 'Compression Moulding Press', category: 'Machine', description: '400-ton hydraulic daylight press for rubber mats and BMC parts.',                   model_type: 'machine_press' },
  { id: 'mc11', name: 'Transfer Moulding Machine',  category: 'Machine', description: 'Upward-plunger transfer press for thermoset connector bodies.',                     model_type: 'machine_transfer' },
  { id: 'mc12', name: 'Reaction Injection System',  category: 'Machine', description: 'RIM high-pressure impingement mix head for polyurethane bumpers.',                 model_type: 'machine_rim' },
  { id: 'mc13', name: 'FDM 3D Printer',            category: 'Machine', description: 'Core-XY belt gantry desktop FDM printer - 300 mm3 build volume.',                  model_type: 'machine_fdm' },
  { id: 'mc14', name: 'SLS Powder Bed Printer',    category: 'Machine', description: 'PA12 laser sintering system; 380 x 280 x 320 mm build chamber.',                   model_type: 'machine_sls' },
  { id: 'mc15', name: 'Pipe Extrusion Line',       category: 'Machine', description: '50 mm extruder with vacuum calibration for HDPE water pipe.',                       model_type: 'machine_pipeextrusion' },
  { id: 'mc16', name: 'Profile Extrusion Die',     category: 'Machine', description: 'Custom multi-cavity profile die for uPVC window sections.',                          model_type: 'machine_profiledie' },
  { id: 'mc17', name: 'Hopper Dryer System',       category: 'Machine', description: 'Desiccant-wheel hopper dryer - 200 kg/hr for PET/Nylon.',                          model_type: 'machine_hopperdryer' },
  { id: 'mc18', name: 'Melt Filter / Screen Changer', category: 'Machine', description: 'Continuous slide-plate double-bolt screen changer for recycling lines.',          model_type: 'machine_screenchange' },
  { id: 'mc19', name: 'Gravimetric Dosing System', category: 'Machine', description: '4-component gravimetric feeder for masterbatch and regrind dosing.',                 model_type: 'machine_doser' },
  { id: 'mc20', name: 'Pelletiser',               category: 'Machine', description: 'Strand pelletiser with water bath; 200-600 kg/hr throughput.',                        model_type: 'machine_pelletiser' },
  { id: 'mc21', name: 'Diverter Valve',           category: 'Machine', description: 'Hydraulic 3-way diverter valve; purge-free polymer switching.',                       model_type: 'machine_diverter' },
  { id: 'mc22', name: 'Static Mixer',             category: 'Machine', description: 'SMX static in-line mixer for colour compounding without screw.',                       model_type: 'machine_staticmixer' },
  { id: 'mc23', name: 'Underwater Pelletiser',    category: 'Machine', description: 'Die-face underwater pelletiser for LSR and EVA hot-melt.',                           model_type: 'machine_uwpellet' },
  { id: 'mc24', name: 'Mould Temperature Controller', category: 'Machine', description: 'Oil-type MTC +/-0.5 degC accuracy - up to 200 degC for engineering resins.',           model_type: 'machine_mtc' },
  { id: 'mc25', name: 'Hot Runner Controller',    category: 'Machine', description: '32-zone hot-runner temperature controller for multi-cavity moulds.',                   model_type: 'machine_hotrunner' },

  // ── PROCESSES (10) ────────────────────────────────────────────────────────
  { id: 'pr01', name: 'Injection Moulding Process', category: 'Process', description: 'Melt -> inject -> cool -> eject cycle visualisation for thermoplastics.',             model_type: 'machine_injection' },
  { id: 'pr02', name: 'Blow Moulding Process',      category: 'Process', description: 'Parison extrusion -> mould close -> inflate -> cool -> demould.',                      model_type: 'machine_blowdie' },
  { id: 'pr03', name: 'Thermoforming Process',      category: 'Process', description: 'Sheet heat -> vacuum/pressure form -> trim -> stack.',                                model_type: 'machine_thermoforming' },
  { id: 'pr04', name: 'Extrusion Process',          category: 'Process', description: 'Hopper -> barrel melt -> die shape -> cool -> haul-off -> cut.',                        model_type: 'machine_extruder' },
  { id: 'pr05', name: 'Rotational Moulding Process',category: 'Process', description: 'Load powder -> heat + biaxial rotation -> cool + demould.',                         model_type: 'machine_rotomould' },
  { id: 'pr06', name: 'Compression Moulding',       category: 'Process', description: 'Charge placement -> mould close -> heat+pressure cure -> trim.',                     model_type: 'machine_press' },
  { id: 'pr07', name: 'Reaction Injection (RIM)',   category: 'Process', description: 'Two-component impingement mix -> mould fill -> demould.',                            model_type: 'machine_rim' },
  { id: 'pr08', name: 'Calendering Process',        category: 'Process', description: 'Compounded PVC -> 4-roll calender -> emboss -> wind.',                               model_type: 'machine_calender' },
  { id: 'pr09', name: 'FDM Additive Process',       category: 'Process', description: 'Filament -> melt -> layer-by-layer deposition -> support removal.',                  model_type: 'machine_fdm' },
  { id: 'pr10', name: 'Compounding Process',        category: 'Process', description: 'Polymer + additives -> twin-screw melt-mix -> strand -> pellet.',                    model_type: 'machine_twinscrew' },
]

type Material = {
  id: string
  name: string
  family: string
  density: number | null
  melt_temp: string | null
  tensile_strength: string | null
  top_applications: string[] | null
  indian_trade_names: string[] | null
  is_premium: boolean
  molecular_image_url?: string | null
  product_images?: { name: string; url: string }[] | null
  processing_images?: { name: string; url: string }[] | null
}

const STATIC_BASE_MATERIALS: Material[] = [
  { id: 'pp', name: 'Polypropylene (PP)', family: 'Polyolefin', density: 0.905, melt_temp: '160–170°C', tensile_strength: '30–40 MPa', top_applications: ['Automotive Bumpers', 'Woven Sacks (Raffia)', 'Food Packaging', 'Battery Cases'], indian_trade_names: ['Reliance Repol', 'IOCL Propel', 'GAIL G-Polymer', 'Haldia Petrochem'], is_premium: false },
  { id: 'hdpe', name: 'High-Density Polyethylene (HDPE)', family: 'Polyolefin', density: 0.955, melt_temp: '130–135°C', tensile_strength: '25–35 MPa', top_applications: ['Pressure Pipes (PE-100)', 'Blow-moulded Jerry Cans', 'Milk Crates', 'Geomembranes'], indian_trade_names: ['Reliance Relene', 'IOCL Propel HDPE', 'GAIL HDPE', 'OPAL HDPE'], is_premium: false },
  { id: 'ldpe', name: 'Low-Density Polyethylene (LDPE)', family: 'Polyolefin', density: 0.922, melt_temp: '105–115°C', tensile_strength: '10–20 MPa', top_applications: ['General Packaging Film', 'Squeeze Bottles', 'Cable Jacketing', 'Lamination'], indian_trade_names: ['Reliance Relene LDPE', 'IOCL LDPE', 'GAIL LDPE'], is_premium: false },
  { id: 'lldpe', name: 'Linear Low-Density Polyethylene (LLDPE)', family: 'Polyolefin', density: 0.920, melt_temp: '120–125°C', tensile_strength: '15–30 MPa', top_applications: ['Stretch Wrap Film', 'Rotomoulded Water Tanks', 'Silage Wrap', 'Pouch Films'], indian_trade_names: ['Reliance Relene LLDPE', 'IOCL Propel LLDPE', 'GAIL LLDPE', 'OPAL LLDPE'], is_premium: false },
  { id: 'pvc', name: 'Polyvinyl Chloride (PVC)', family: 'Vinyl', density: 1.400, melt_temp: '160–210°C', tensile_strength: '40–60 MPa', top_applications: ['Rigid Conduit & SWR Pipes', 'Window Profiles', 'Wire Insulation', 'Blood Bags'], indian_trade_names: ['Reliance Reon', 'DCW PVC', 'Chemplast Sanmar', 'Finolex'], is_premium: false },
  { id: 'ps', name: 'General Purpose Polystyrene (GPPS)', family: 'Styrenic', density: 1.050, melt_temp: '220–240°C', tensile_strength: '35–50 MPa', top_applications: ['Jewel Cases', 'Petri Dishes', 'Display Frames', 'Disposables'], indian_trade_names: ['Supreme SC206', 'INPEX Polystyrene', 'LG Polymers'], is_premium: false },
  { id: 'hips', name: 'High Impact Polystyrene (HIPS)', family: 'Styrenic', density: 1.040, melt_temp: '200–230°C', tensile_strength: '20–35 MPa', top_applications: ['Refrigerator Liners', 'Toy Casings', 'Thermoformed Trays', 'Advertising Signage'], indian_trade_names: ['Supreme SH731', 'LG Polymers HIPS'], is_premium: false },
  { id: 'abs', name: 'Acrylonitrile Butadiene Styrene (ABS)', family: 'Styrenic', density: 1.050, melt_temp: '220–260°C', tensile_strength: '40–50 MPa', top_applications: ['Automotive Trim', 'Helmet Shells', 'Consumer Electronics Casings', 'LEGO Bricks'], indian_trade_names: ['INEOS Styrolution Absolac', 'Supreme ABS', 'LG Chem ABS'], is_premium: false },
  { id: 'pmma', name: 'Polymethyl Methacrylate (PMMA / Acrylic)', family: 'Engineering Thermoplastic', density: 1.180, melt_temp: '220–250°C', tensile_strength: '60–75 MPa', top_applications: ['Automotive Headlamp Lenses', 'Signage Displays', 'Aircraft Canopies', 'LED Light Guides'], indian_trade_names: ['Röhm Plexiglas', 'Arkema Altuglas', 'Mitsubishi Acrylite'], is_premium: false },
  { id: 'pc', name: 'Polycarbonate (PC)', family: 'Engineering Thermoplastic', density: 1.200, melt_temp: '280–320°C', tensile_strength: '60–70 MPa', top_applications: ['Safety Visors & Helmets', 'Automotive Headlamps', 'Bulletproof Glazing', 'Medical Devices'], indian_trade_names: ['Covestro Makrolon', 'SABIC Lexan', 'Trinseo Calibre'], is_premium: false },
  { id: 'pa6', name: 'Nylon 6 (Polyamide 6)', family: 'Engineering Thermoplastic', density: 1.140, melt_temp: '215–225°C', tensile_strength: '70–85 MPa', top_applications: ['Gears & Bushings', 'Power Tool Casings', 'Automotive Under-the-Hood Parts', 'Monofilaments'], indian_trade_names: ['SRF Tufnyl', 'BASF Ultramid B', 'DOMO Domamid'], is_premium: false },
  { id: 'pa66', name: 'Nylon 6,6 (Polyamide 66)', family: 'Engineering Thermoplastic', density: 1.140, melt_temp: '255–265°C', tensile_strength: '75–90 MPa', top_applications: ['High-load Gears', 'Automotive Radiator End Tanks', 'Cable Ties', 'Airbag Fibres'], indian_trade_names: ['DuPont Zytel', 'BASF Ultramid A', 'SRF Tufnyl 66'], is_premium: false },
  { id: 'pet', name: 'Polyethylene Terephthalate (PET)', family: 'Polyester', density: 1.370, melt_temp: '250–260°C', tensile_strength: '50–70 MPa', top_applications: ['Carbonated Beverage Bottles', 'Polyester Apparel Fibres', 'Biaxially Oriented Film (BOPET)', 'Strapping'], indian_trade_names: ['Reliance Relpet', 'Dhunseri Aspet', 'JBF PET'], is_premium: false },
  { id: 'pbt', name: 'Polybutylene Terephthalate (PBT)', family: 'Polyester', density: 1.310, melt_temp: '220–230°C', tensile_strength: '50–65 MPa', top_applications: ['Automotive Connectors', 'Headlamp Bezels', 'Keyboard Keycaps', 'Appliance Handles'], indian_trade_names: ['SABIC Valox', 'BASF Ultradur', 'Celanese Celanex'], is_premium: false },
  { id: 'pom', name: 'Polyoxymethylene (POM / Acetal)', family: 'Engineering Thermoplastic', density: 1.410, melt_temp: '165–175°C', tensile_strength: '65–75 MPa', top_applications: ['Precision Watch Gears', 'Fuel System Valves', 'Zipper Teeth', 'Conveyor Chains'], indian_trade_names: ['DuPont Delrin', 'Celanese Hostaform', 'Mitsubishi Iupital'], is_premium: false },
  { id: 'ptfe', name: 'Polytetrafluoroethylene (PTFE / Teflon)', family: 'Fluoropolymer', density: 2.160, melt_temp: '327°C', tensile_strength: '20–35 MPa', top_applications: ['Chemical Flange Gaskets', 'Non-stick Coatings', 'Cryogenic Seals', 'Semiconductor Tubing'], indian_trade_names: ['Gujarat Fluorochemicals (Inoflon)', 'Chemours Teflon', 'Daikin Polyflon'], is_premium: true },
  { id: 'pvdf', name: 'Polyvinylidene Fluoride (PVDF)', family: 'Fluoropolymer', density: 1.780, melt_temp: '170–175°C', tensile_strength: '40–55 MPa', top_applications: ['Lithium-ion Battery Binders', 'Chemical Piping', 'Membranes', 'Piezoelectric Sensors'], indian_trade_names: ['Arkema Kynar', 'Solvay Solef', 'GFL Inoflon PVDF'], is_premium: true },
  { id: 'peek', name: 'Polyether Ether Ketone (PEEK)', family: 'Engineering Thermoplastic', density: 1.300, melt_temp: '343°C', tensile_strength: '95–105 MPa', top_applications: ['Aerospace Avionics Brackets', 'Spinal Implants', 'Oil & Gas Valve Plates', 'Semiconductor Wafers'], indian_trade_names: ['Victrex PEEK', 'Solvay KetaSpire', 'Evonik VESTAKEEP'], is_premium: true },
  { id: 'pei', name: 'Polyetherimide (PEI / Ultem)', family: 'Engineering Thermoplastic', density: 1.270, melt_temp: '350–380°C', tensile_strength: '100–110 MPa', top_applications: ['Aircraft Interior Ducting', 'Autoclavable Surgical Tools', 'High-temp Sockets', 'FDM 3D Printing'], indian_trade_names: ['SABIC Ultem'], is_premium: true },
  { id: 'pla', name: 'Polylactic Acid (PLA)', family: 'Bioplastic', density: 1.240, melt_temp: '150–165°C', tensile_strength: '50–65 MPa', top_applications: ['Desktop 3D Printing Filament', 'Compostable Cold Drink Cups', 'Tea Bags', 'Agricultural Mulch Film'], indian_trade_names: ['NatureWorks Ingeo', 'Total Corbion Luminy'], is_premium: false },
]

const FAMILIES = ['All', 'Polyolefin', 'Vinyl', 'Styrenic', 'Engineering Thermoplastic', 'Polyester', 'Fluoropolymer', 'Elastomer', 'Bioplastic']

const FAMILY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Polyolefin': { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  'Vinyl': { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' },
  'Styrenic': { bg: '#F5F3FF', text: '#7C3AED', border: '#C4B5FD' },
  'Engineering Thermoplastic': { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
  'Polyester': { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' },
  'Fluoropolymer': { bg: '#FFF1F2', text: '#E11D48', border: '#FDA4AF' },
  'Elastomer': { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
  'Bioplastic': { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
}

// ─── FULL ANALYSIS 3D LEARNING LAB MODAL ───────────────────────────────────────
function FullAnalysis3DModal({
  model,
  onClose,
  onPrev,
  onNext,
}: {
  model: LocalModel
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const details: Polymer3DModelDetails | undefined = POLYMER_3D_KNOWLEDGE[model.id]
  const [subTab, setSubTab] = useState<'3d' | 'cru' | 'reaction'>('3d')
  const [copiedFormula, setCopiedFormula] = useState(false)

  // Keyboard navigation (Esc, Left Arrow, Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  const copyFormula = () => {
    if (details?.formula) {
      navigator.clipboard.writeText(details.formula)
      setCopiedFormula(true)
      setTimeout(() => setCopiedFormula(false), 2000)
    }
  }

  return (
    <ClientPortal>
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden my-auto flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top Header Bar ── */}
          <div className="px-6 py-4 bg-[#0A1628] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-black bg-blue-600 text-white px-3 py-1 rounded-xl uppercase tracking-wider shadow-sm">
                🧬 3D LEARNING LAB
              </span>
              <span className="font-mono text-xs font-bold text-slate-300 hidden sm:inline">
                Model ID: <strong className="text-white">{model.id.toUpperCase()}</strong> &middot; Category: <strong className="text-amber-400">{model.category}</strong>
              </span>
            </div>

            {/* Prev / Next & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Previous Model (Left Arrow)"
              >
                <ArrowLeft size={14} /> <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Next Model (Right Arrow)"
              >
                <span className="hidden sm:inline">Next</span> <ArrowRight size={14} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer ml-2"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Main Two-Column Scrollable Body ── */}
          <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ── LEFT COLUMN: 3D Interactive Stage & View Modes (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Title & IUPAC Header */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                      {model.name}
                    </h2>
                    {details?.formula && (
                      <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        {details.formula}
                        <button onClick={copyFormula} className="hover:text-blue-600 transition-colors" title="Copy formula">
                          {copiedFormula ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </span>
                    )}
                  </div>
                  {details?.iupacName && (
                    <p className="font-mono text-xs font-semibold text-slate-500 mt-1">
                      IUPAC: <span className="text-slate-800">{details.iupacName}</span>
                    </p>
                  )}
                </div>

                {/* Sub-Tabs View Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-mono font-bold">
                  <button
                    onClick={() => setSubTab('3d')}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                      subTab === '3d' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌐 3D Structure
                  </button>
                  <button
                    onClick={() => setSubTab('cru')}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                      subTab === 'cru' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔬 Repeat Unit (CRU)
                  </button>
                  <button
                    onClick={() => setSubTab('reaction')}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                      subTab === 'reaction' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ⚙️ Reaction Mechanism
                  </button>
                </div>
              </div>

              {/* View Tab Contents */}
              {subTab === '3d' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 rounded-3xl p-4 shadow-xl border-2 border-slate-900 relative overflow-hidden">
                    <ThreeDViewer modelType={model.model_type} name={model.name} />
                  </div>

                  {/* Synchronized Strict CPK Atom Legend */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-[11px] font-mono text-slate-700 shadow-2xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Atom size={14} className="text-blue-600" /> CPK Legend:
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#374151] inline-block shadow-2xs" /> C (Carbon)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#E2E8F0] border border-slate-400 inline-block shadow-2xs" /> H (Hydrogen)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow-2xs" /> O (Oxygen)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block shadow-2xs" /> N (Nitrogen)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981] inline-block shadow-2xs" /> Cl (Chlorine)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#06B6D4] inline-block shadow-2xs" /> F (Fluorine)</span>
                    </div>
                  </div>
                </div>
              )}

              {subTab === 'cru' && (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-bold text-lg text-slate-900">Constitutional Repeating Unit (CRU)</h3>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-blue-300 text-center font-mono font-black text-xl text-blue-900 shadow-sm">
                    {details?.cru || model.name}
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-700">
                    <div><strong>Monomer Reactant:</strong> {details?.monomer || 'Standard industrial monomer'}</div>
                    <div><strong>Polymerization Mode:</strong> {details?.polymerizationType || 'Chain-growth / Addition'}</div>
                    <div><strong>Functional Group:</strong> {details?.functionalGroup || 'Hydrocarbon backbone'}</div>
                  </div>
                </div>
              )}

              {subTab === 'reaction' && (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-display font-bold text-lg text-slate-900">How is this Polymer Formed?</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    {details?.howFormed || model.description}
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900">
                    💡 <strong>Curriculum Tip:</strong> For complete step-by-step kinetic equations, Carothers derivations, and catalyst mechanisms, visit the polymer chemistry lecture hub.
                  </div>
                </div>
              )}

              {/* Bottom Interactive Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href={`/ai-tutor?prompt=${encodeURIComponent(details?.aiPrompt || `Explain the chemical synthesis, properties, and applications of ${model.name}`)}`}
                  className="flex-1 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all text-center"
                >
                  <Brain size={15} /> Ask AI Copilot About This
                </Link>

                <Link
                  href={details?.curriculumLessonUrl || '/subjects'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl border border-slate-300 transition-all text-center"
                >
                  <BookOpen size={15} className="text-blue-600" /> View Related Lesson &rarr;
                </Link>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Chemistry & Structure Identity Panel (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* 1. Scientific Identity Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Info size={14} className="text-blue-600" /> Scientific Identity Card
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    CAS: {details?.casNumber || 'Verified'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">IUPAC Name:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{details?.iupacName || model.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Formula:</span>
                    <span className="font-bold text-blue-700">{details?.formula || 'Polymer chain'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Abbreviation:</span>
                    <span className="font-bold text-slate-900">{details?.abbreviation || model.name.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Classification:</span>
                    <span className="font-bold text-slate-900 text-right">{details?.classification?.split(',')[0] || 'Thermoplastic'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Chemistry & Structure Parameters */}
              <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
                <h4 className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <FlaskConical size={14} className="text-emerald-600" /> Polymerization &amp; Structure
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">Constitutional Repeat Unit</span>
                    <div className="font-mono font-bold text-blue-900 bg-blue-50/80 p-2 rounded-xl border border-blue-100 mt-0.5">
                      {details?.cru || model.name}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">Monomer Reactant</span>
                    <div className="font-medium text-slate-800 mt-0.5">
                      {details?.monomer || 'Industrial feed monomer'}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">Polymerization Mechanism</span>
                    <div className="font-medium text-slate-800 mt-0.5">
                      {details?.polymerizationType || 'Addition / Polycondensation'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Physical & Mechanical Telemetry */}
              {details?.density && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Scale size={14} className="text-amber-600" /> Physical &amp; Thermal Telemetry
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Glass Transition (Tg)</span>
                      <strong className="text-slate-900">{details.tg}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Melting Point (Tm)</span>
                      <strong className="text-slate-900">{details.tm}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Specific Density</span>
                      <strong className="text-slate-900">{details.density}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Tensile Strength</span>
                      <strong className="text-slate-900">{details.tensileStrength}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Indian Commercial Brands */}
              {details?.indianBrands && details.indianBrands.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                  <span className="font-mono text-xs font-black uppercase text-slate-900 block">
                    🇮🇳 Indian Commercial Trade Names
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.indianBrands.map(brand => (
                      <span key={brand} className="font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Top Industrial Applications */}
              {details?.topApplications && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-mono text-xs font-black uppercase text-slate-900 block">
                    🏭 Core Engineering Applications
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {details.topApplications.map((app, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </ClientPortal>
  )
}

function MaterialRow({ material, expanded, onToggle }: {
  material: Material
  expanded: boolean
  onToggle: () => void
}) {
  const fc = FAMILY_COLORS[material.family] ?? { bg: '#F8FAFC', text: '#0A0A0A', border: '#CBD5E1' }

  if (material.is_premium) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-all opacity-90">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-800 text-base">{material.name}</span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Specialty High-Performance Resin
              </span>
            </div>
            <p className="font-sans text-xs text-slate-500 mt-0.5">Specialized engineering resin with verified ASTM data</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="font-mono text-[10px] font-bold px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl transition-all shadow-xs flex-shrink-0"
        >
          Unlock Database &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs hover:border-[#2563EB] transition-all overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider"
              style={{ backgroundColor: fc.bg, color: fc.text, borderColor: fc.border }}
            >
              {material.family}
            </span>
            <span className="font-display font-bold text-slate-900 text-base sm:text-lg">{material.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-500 mt-1">
            {material.density && (
              <span>Density: <strong className="text-slate-800">{material.density} g/cm³</strong></span>
            )}
            {material.melt_temp && (
              <span>Tm: <strong className="text-slate-800">{material.melt_temp}</strong></span>
            )}
            {material.tensile_strength && (
              <span>Tensile: <strong className="text-slate-800">{material.tensile_strength}</strong></span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs font-bold text-[#2563EB] hover:underline hidden sm:inline">
            {expanded ? 'Hide Specs' : 'View TDS & Specs'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">🏭 Top Industrial Applications</span>
              <div className="flex flex-wrap gap-1.5">
                {material.top_applications?.map((app) => (
                  <span key={app} className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    {app}
                  </span>
                )) || <span className="text-xs text-slate-400">Applications listed in datasheet</span>}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400 block">🇮🇳 Indian Commercial Trade Names</span>
              <div className="flex flex-wrap gap-1.5">
                {material.indian_trade_names?.map((trade) => (
                  <span key={trade} className="font-mono text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg">
                    {trade}
                  </span>
                )) || <span className="text-xs text-slate-400">Trade names listed in datasheet</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(STATIC_BASE_MATERIALS)
  const [search, setSearch] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'commercial' | '3d'>('3d')

  // 3D Models state
  const [modelSearch, setModelSearch] = useState('')
  const [modelCategory, setModelCategory] = useState<string>('All')
  const [active3DModel, setActive3DModel] = useState<LocalModel | null>(null)

  // Supabase fetch
  useEffect(() => {
    async function loadMaterials() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('materials')
          .select('id, name, family, density, melt_temp, tensile_strength, top_applications, indian_trade_names, is_premium')
          .order('name')
        if (data && data.length > 0 && !error) {
          setMaterials(data)
        }
      } catch {
        // Fallback static
      }
    }
    loadMaterials()
  }, [])

  // Filtered Materials
  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.indian_trade_names && m.indian_trade_names.some((t) => t.toLowerCase().includes(search.toLowerCase())))
      const matchFamily = selectedFamily === 'All' || m.family === selectedFamily
      return matchSearch && matchFamily
    })
  }, [materials, search, selectedFamily])

  // Filtered 3D Models
  const filteredModels = useMemo(() => {
    return LOCAL_MODELS.filter((m) => {
      const matchCategory = modelCategory === 'All' || m.category === modelCategory
      const matchSearch =
        m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.description.toLowerCase().includes(modelSearch.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [modelCategory, modelSearch])

  // Navigation handlers for modal
  const handlePrevModel = useCallback(() => {
    if (!active3DModel) return
    const currentIndex = filteredModels.findIndex(m => m.id === active3DModel.id)
    if (currentIndex > 0) {
      setActive3DModel(filteredModels[currentIndex - 1])
    } else {
      setActive3DModel(filteredModels[filteredModels.length - 1])
    }
  }, [active3DModel, filteredModels])

  const handleNextModel = useCallback(() => {
    if (!active3DModel) return
    const currentIndex = filteredModels.findIndex(m => m.id === active3DModel.id)
    if (currentIndex < filteredModels.length - 1) {
      setActive3DModel(filteredModels[currentIndex + 1])
    } else {
      setActive3DModel(filteredModels[0])
    }
  }, [active3DModel, filteredModels])

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-slate-900 font-sans">
      
      {/* ─── MIDNIGHT NAVY SIGNATURE HERO ─── */}
      <section className="bg-[#0A1628] text-white pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden border-b-2 border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-300 bg-blue-900/40 border border-blue-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> 35+ BASE POLYMERS &middot; 100+ 3D INTERACTIVE MODELS &middot; INDIAN TRADE NAMES
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            POLYMER MATERIALS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400">
              SPECIFICATIONS &amp; BRANDS
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Comprehensive property profiles, ASTM testing standards, interactive 3D crystal structures, and Indian commercial brand equivalents (Reliance, GAIL, Supreme, SRF).
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
              <div className="font-display text-3xl font-black text-white">35+</div>
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold mt-0.5">Polymers Mapped</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
              <div className="font-display text-3xl font-black text-blue-400">100+</div>
              <div className="text-[11px] font-mono text-blue-300 uppercase tracking-wider font-bold mt-0.5">3D Structures</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
              <div className="font-display text-3xl font-black text-purple-400">16</div>
              <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider font-bold mt-0.5">Properties Per Grade</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
              <div className="font-display text-3xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider font-bold mt-0.5">TDS Accuracy Matched</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        {/* ─── VIEW MODE TABS ─── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setViewMode('3d')}
            className={`font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              viewMode === '3d'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3D Interactive Models ({LOCAL_MODELS.length})</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              viewMode === 'table'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Specs Database ({materials.length})</span>
          </button>

          <button
            onClick={() => setViewMode('commercial')}
            className={`font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              viewMode === 'commercial'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Commercial Grades (TDS)</span>
          </button>
        </div>

        {/* ─── 3D MODELS GRID VIEW (3D LEARNING LAB) ─── */}
        {viewMode === '3d' && (
          <div className="space-y-6">
            
            {/* Search & Category Filter Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder="Search 3D molecules, products, machinery, or processes..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border-2 border-slate-200 rounded-xl placeholder:text-slate-400 font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] shadow-xs"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', 'Molecule', 'Product', 'Machine', 'Process'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setModelCategory(cat)}
                      className={`font-mono text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
                        modelCategory === cat
                          ? 'bg-[#2563EB] border-blue-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'All' ? `All (${LOCAL_MODELS.length})` : `${cat} (${LOCAL_MODELS.filter(m => m.category === cat).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synchronized CPK Atom Legend */}
              <div className="p-3.5 bg-white border-2 border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-700 shadow-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Atom size={16} className="text-blue-600" /> Standard CPK Atom Legend:
                </span>
                <div className="flex flex-wrap items-center gap-3.5">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#374151] inline-block shadow-2xs" /> C (Carbon)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#E2E8F0] border border-slate-400 inline-block shadow-2xs" /> H (Hydrogen)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow-2xs" /> O (Oxygen)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block shadow-2xs" /> N (Nitrogen)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981] inline-block shadow-2xs" /> Cl (Chlorine)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#06B6D4] inline-block shadow-2xs" /> F (Fluorine)</span>
                </div>
              </div>
            </div>

            {/* Clean White 3D Grid with Click-to-Expand Signal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.length === 0 ? (
                <div className="col-span-3 border-2 border-slate-200 rounded-3xl p-12 text-center bg-white shadow-xs">
                  <p className="font-display font-bold text-slate-900 text-lg mb-1">No 3D models matched</p>
                  <p className="font-sans text-xs text-slate-500">Try a different keyword or category filter.</p>
                </div>
              ) : filteredModels.map((model) => {
                const details = POLYMER_3D_KNOWLEDGE[model.id]
                const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
                  Molecule: { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD' },
                  Product:  { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
                  Machine:  { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' },
                  Process:  { bg: '#F5F3FF', text: '#7C3AED', border: '#C4B5FD' },
                }
                const cs = CATEGORY_STYLES[model.category] ?? { bg: '#F8FAFC', text: '#0A0A0A', border: '#CBD5E1' }

                return (
                  <div 
                    key={model.id}
                    onClick={() => setActive3DModel(model)}
                    className="group bg-white border-2 border-slate-200 hover:border-blue-600 rounded-3xl p-6 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Category & Formula Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-[10px] font-black border px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-2xs"
                          style={{ backgroundColor: cs.bg, color: cs.text, borderColor: cs.border }}
                        >
                          [{model.category}]
                        </span>
                        {details?.formula && (
                          <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-md">
                            {details.formula}
                          </span>
                        )}
                      </div>

                      {/* Title & IUPAC Name */}
                      <div>
                        <h3 className="font-display font-black text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors flex items-center justify-between">
                          <span>{model.name}</span>
                          <Maximize2 size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        </h3>
                        {details?.iupacName && (
                          <p className="font-mono text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            IUPAC: {details.iupacName}
                          </p>
                        )}
                        <p className="font-sans text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {model.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* 3D Viewer Canvas */}
                    <div className="bg-slate-950 rounded-2xl p-2 shadow-inner border border-slate-900">
                      <ThreeDViewer modelType={model.model_type} name={model.name} />
                    </div>

                    {/* Bottom CTA Bar */}
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Full Analysis &amp; Chemistry &rarr;
                      </span>
                      <span className="text-slate-400 font-medium text-[10px]">
                        Click to Expand
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── SPECS DATABASE VIEW ─── */}
        {viewMode === 'table' && (
          <>
            {/* Family tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {FAMILIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFamily(f)}
                  className={`font-mono text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                    selectedFamily === f
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f === 'All' ? `All (${materials.length})` : f}
                </button>
              ))}
            </div>

            {/* Live Count details */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filtered.length}</strong> of <strong className="text-slate-900">{materials.length}</strong> base polymers
                {search && ` matching "${search}"`}
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE ASTM/ISO SPECIFICATIONS
              </span>
            </div>

            {/* Materials List */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="border-2 border-slate-200 rounded-3xl p-12 text-center bg-white shadow-xs">
                  <Database className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                  <h4 className="font-display text-xl font-bold text-slate-900 mb-1">No polymers matched</h4>
                  <p className="text-slate-500 max-w-sm mx-auto font-sans text-xs">
                    Try searching with generic resin abbreviations like PP, HDPE, PC, or PA66.
                  </p>
                </div>
              ) : (
                filtered.map((material) => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    expanded={expandedId === material.id}
                    onToggle={() => setExpandedId(expandedId === material.id ? null : material.id)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* ─── COMMERCIAL GRADE COMPARATOR VIEW ─── */}
        {viewMode === 'commercial' && (
          <div className="pt-2">
            <CommercialGradeComparator />
          </div>
        )}

      </div>

      {/* ─── FULL ANALYSIS 3D MODAL ─── */}
      {active3DModel && (
        <FullAnalysis3DModal
          model={active3DModel}
          onClose={() => setActive3DModel(null)}
          onPrev={handlePrevModel}
          onNext={handleNextModel}
        />
      )}

      {/* ─── BOTTOM AI MATERIALS SPECIALIST CTA ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-gradient-to-br from-[#0A1628] via-[#0F223D] to-[#0A1628] border-2 border-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest relative z-10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> PolymerHub AI &middot; Materials &amp; Grade Advisor
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white relative z-10">
            Need resin substitution or technical datasheet analysis?
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-light relative z-10">
            Query comparative tensile modulus, moisture absorption kinetics, processing shrinkage differences, or Indian petrochemical supplier trade names.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <Link
              href="/ai-tutor?prompt=Compare%20polycarbonate%20and%20PMMA%20for%20automotive%20headlamp%20lens%20applications%20including%20refractive%20index%20and%20impact%20strength"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-amber-400/20 hover:scale-105 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Materials Specialist &rarr;
            </Link>

            <Link
              href="/comparator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border border-white/20 transition-all"
            >
              <Compass className="w-4 h-4" /> Open Full Comparator
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
