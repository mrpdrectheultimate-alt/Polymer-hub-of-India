'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Lock, ChevronDown, ChevronUp, ArrowRight, Database } from 'lucide-react'
import { ThreeDViewer } from '@/components/ThreeDViewer'
import { CommercialGradeComparator } from '@/components/CommercialGradeComparator'

type LocalModel = {
  id: string
  name: string
  category: string
  description: string
  model_type: string
}

// ─── 100+ Static 3D Model Catalog (no DB required) ───────────────────────────
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
  { id: 'p29', name: 'PEI (Ultem) Duct Fitting',   category: 'Product', description: 'Ultem 1010 duct elbow - rated 180  degC continuous; aircraft interior.',                 model_type: 'product_ductfitting' },
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
  { id: 'mc24', name: 'Mould Temperature Controller', category: 'Machine', description: 'Oil-type MTC +/-0.5  degC accuracy - up to 200  degC for engineering resins.',           model_type: 'machine_mtc' },
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

const FAMILIES = ['All', 'Polyolefin', 'Vinyl', 'Styrenic', 'Engineering Thermoplastic', 'Polyester', 'Fluoropolymer', 'Elastomer', 'Bioplastic']

const FAMILY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Polyolefin': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  'Vinyl': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'Styrenic': { bg: '#F5F3FF', text: '#7C3AED', border: '#7C3AED' },
  'Engineering Thermoplastic': { bg: '#EFF6FF', text: '#1D4ED8', border: '#1D4ED8' },
  'Polyester': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'Fluoropolymer': { bg: '#FFF1F2', text: '#E11D48', border: '#E11D48' },
  'Elastomer': { bg: '#FEF2F2', text: '#DC2626', border: '#DC2626' },
  'Bioplastic': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
}

function MaterialRow({ material, expanded, onToggle }: {
  material: Material
  expanded: boolean
  onToggle: () => void
}) {
  const fc = FAMILY_COLORS[material.family] ?? { bg: '#F8FAFC', text: '#0A0A0A', border: '#0A0A0A' }

  if (material.is_premium) {
    return (
      <div className="bg-amber-50 border-2 border-ink p-4 flex items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(26,28,32,1)]">
        <div className="flex items-center gap-3 min-w-0">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-display font-black text-ink/40 text-base line-through mr-2">{material.name}</span>
            <span className="text-[9px] font-mono font-black bg-amber-200 text-amber-800 border border-amber-300 px-2 py-0.5 uppercase tracking-wider">Premium Grade</span>
          </div>
        </div>
        <Link href="/pricing" className="font-mono text-[10px] font-black border-2 border-ink bg-yellow-bright text-ink px-3 py-1.5 uppercase hover:bg-ink hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex-shrink-0">
          Unlock specs
        </Link>
      </div>
    )
  }

  return (
    <div
      className="bg-white border-2 border-ink transition-all shadow-[2px_2px_0px_0px_rgba(26,28,32,1)]"
      style={{ transform: expanded ? 'translate(-2px, -2px)' : 'none', boxShadow: expanded ? '4px 4px 0px 0px #1A1C20' : '2px 2px 0px 0px #1A1C20' }}
    >
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {material.molecular_image_url && (
            <div className="w-14 h-14 relative flex-shrink-0 bg-slate-50 border-2 border-ink rounded overflow-hidden p-1">
              <Image
                src={material.molecular_image_url}
                alt={material.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h3 className="font-display font-black text-ink text-lg leading-tight">{material.name}</h3>
              <span
                className="text-[9px] font-mono font-black border px-2 py-0.5 uppercase tracking-wider"
                style={{ backgroundColor: fc.bg, color: fc.text, borderColor: fc.border }}
              >
                {material.family}
              </span>
            </div>
            {/* Quick specs row */}
            <div className="flex flex-wrap gap-4 text-[10px] text-ink/50 font-mono font-bold uppercase">
              {material.density && <span>⚖️ Density: {material.density} g/cm3</span>}
              {material.melt_temp && <span>🔥 Tm: {material.melt_temp}</span>}
              {material.tensile_strength && <span>💪 Tensile: {material.tensile_strength}</span>}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 border-2 border-ink p-1 bg-white">
          {expanded ? <ChevronUp className="w-4 h-4 text-ink" /> : <ChevronDown className="w-4 h-4 text-ink" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t-4 border-ink p-5 bg-slate-50/50 space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Properties */}
            <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Spec Constants"}</p>
              <div className="space-y-2">
                {([
                  ['Density', material.density ? `${material.density} g/cm3` : '-'],
                  ['Melt Temp', material.melt_temp ?? '-'],
                  ['Tensile Strength', material.tensile_strength ?? '-'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-xs text-ink/60 font-bold">{label}</span>
                    <span className="text-xs font-mono font-black text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Applications"}</p>
              <div className="space-y-1.5">
                {(material.top_applications ?? []).map((app) => (
                  <div key={app} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-none bg-ink mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-ink/80 font-bold">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indian trade names */}
            <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Indian Trade Brands"}</p>
              <div className="flex flex-wrap gap-1.5">
                {(material.indian_trade_names ?? []).map((tradeName) => (
                  <span
                    key={tradeName}
                    className="text-xs px-2.5 py-1 border-2 border-ink font-mono font-black uppercase tracking-wider"
                    style={{ backgroundColor: fc.bg, color: fc.text, borderColor: fc.border }}
                  >
                    {tradeName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product & Processing Visual Galleries */}
          {((material.product_images && material.product_images.length > 0) || 
            (material.processing_images && material.processing_images.length > 0)) && (
            <div className="border-2 border-ink p-5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-6">
              {material.product_images && material.product_images.length > 0 && (
                <div>
                  <h4 className="font-display font-black text-ink text-xs uppercase tracking-wider mb-3">
                    📸 Typical Polymer Products
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {material.product_images.map((img, idx) => (
                      <div key={idx} className="aspect-square relative bg-slate-50 border-2 border-ink rounded-lg overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-ink/75 text-white text-[9px] font-mono p-1 text-center font-bold">
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {material.processing_images && material.processing_images.length > 0 && (
                <div>
                  <h4 className="font-display font-black text-ink text-xs uppercase tracking-wider mb-3">
                    🏭 Manufacturing &amp; Processing
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {material.processing_images.map((img, idx) => (
                      <div key={idx} className="aspect-square relative bg-slate-50 border-2 border-ink rounded-lg overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-ink/75 text-white text-[9px] font-mono p-1 text-center font-bold">
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [viewMode, setViewMode] = useState<'table' | '3d' | 'commercial'>('table')
  const [modelSearch, setModelSearch] = useState('')
  const [modelCategory, setModelCategory] = useState('All')

  // All 100+ 3D models come from LOCAL_MODELS - no DB fetch needed
  const filteredModels = LOCAL_MODELS.filter((m) => {
    const matchSearch = modelSearch.trim() === '' ||
      m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(modelSearch.toLowerCase())
    const matchCat = modelCategory === 'All' || m.category === modelCategory
    return matchSearch && matchCat
  })

  useEffect(() => {
    async function fetchMaterials() {
      const supabase = createClient()
      setLoading(true)
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('name')
      setMaterials(data ?? [])
      setLoading(false)
    }
    fetchMaterials()
  }, [])

  const filtered = materials.filter((m) => {
    const matchSearch =
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.family.toLowerCase().includes(search.toLowerCase()) ||
      (m.indian_trade_names ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFamily = selectedFamily === 'All' || m.family === selectedFamily
    return matchSearch && matchFamily
  })

  return (
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-2 border-ink flex items-center justify-center">
                <Database className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Materials
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                DATABASE
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              POLYMER MATERIALS<br />
              <span className="italic">SPECIFICATIONS AND BRANDS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Properties, applications, and Indian trade names for {materials.length}+ polymers. The only database built for Indian PPE students.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter tools */}
      <div className="sticky top-16 z-30 bg-canvas/95 backdrop-blur border-b-4 border-ink py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, family, or trade name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border-2 border-ink placeholder:text-ink/40 font-bold focus:outline-none"
            />
          </div>
          <div className="relative flex-shrink-0">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink pointer-events-none" />
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="pl-10 pr-8 py-2.5 border-2 border-ink text-xs font-bold text-ink focus:outline-none bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              {FAMILIES.map((f) => (
                <option key={f} value={f}>{f === 'All' ? 'All Families' : f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* View Mode Toggle */}
        <div className="flex gap-3 mb-6 border-b-4 border-ink pb-4">
          <button
            onClick={() => setViewMode('table')}
            className={`font-display text-xs font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all shadow-hard-xs ${
              viewMode === 'table'
                ? 'bg-ink text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-ink hover:bg-slate-50'
            }`}
          >
            📊 Specs Database Table
          </button>
          <button
            onClick={() => setViewMode('commercial')}
            className={`font-display text-xs font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all shadow-hard-xs ${
              viewMode === 'commercial'
                ? 'bg-blue text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-ink hover:bg-slate-50'
            }`}
          >
            🏭 Commercial Grades (CAMPUS TDS)
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`font-display text-xs font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all shadow-hard-xs ${
              viewMode === '3d'
                ? 'bg-ink text-yellow-bright shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-ink hover:bg-slate-50'
            }`}
          >
            🧊 3D Molecule & Product Models
          </button>
        </div>

        {/* Specs specific tabs and counts */}
        {viewMode === 'table' && (
          <>
            {/* Family tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FAMILIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFamily(f)}
                  className={`font-mono text-[9px] font-black px-3.5 py-1.5 border-2 border-ink whitespace-nowrap uppercase tracking-wider transition-all ${
                    selectedFamily === f
                      ? 'bg-yellow-bright text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-ink/60 hover:text-ink'
                  }`}
                >
                  {f === 'All' ? `All (${materials.length})` : f}
                </button>
              ))}
            </div>

            {/* Count details */}
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-4">
              Showing {filtered.length} of {materials.length} polymers
              {search && ` matching "${search}"`}
            </p>
          </>
        )}

        {viewMode === '3d' && (
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink" />
                <input
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Search models..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border-2 border-ink placeholder:text-ink/40 font-bold focus:outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All','Molecule','Product','Machine','Process'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModelCategory(cat)}
                    className={`font-mono text-[9px] font-black px-3 py-1.5 border-2 border-ink whitespace-nowrap uppercase tracking-wider transition-all ${
                      modelCategory === cat
                        ? 'bg-ink text-yellow-bright'
                        : 'bg-white text-ink/60 hover:text-ink'
                    }`}
                  >
                    {cat === 'All' ? `All (${LOCAL_MODELS.length})` : `${cat} (${LOCAL_MODELS.filter(m=>m.category===cat).length})`}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest">
              Showing {filteredModels.length} of {LOCAL_MODELS.length} interactive 3D structures · Drag to rotate · Scroll to zoom
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-2 border-ink p-5 bg-white shadow-[2px_2px_0px_0px_rgba(26,28,32,1)] animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-48 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-64" />
              </div>
            ))}
          </div>
        )}

        {/* Materials List */}
        {!loading && viewMode === 'table' && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="border-2 border-ink p-12 text-center shadow-hard bg-white">
                <Database className="w-10 h-10 mx-auto mb-4 text-ink/40" />
                <div className="font-display text-2xl font-black text-ink mb-2">No polymers matched</div>
                <p className="text-ink/60 max-w-sm mx-auto font-mono text-xs">
                  Try another keyword or change your family filter settings.
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
        )}

        {/* 3D view mode list - 100+ local models, no DB required */}
        {viewMode === '3d' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.length === 0 ? (
              <div className="col-span-3 border-2 border-ink p-12 text-center bg-white">
                <p className="font-display font-black text-ink text-xl mb-2">No models matched</p>
                <p className="font-mono text-xs text-ink/60">Try a different search term or category filter.</p>
              </div>
            ) : filteredModels.map((model) => {
              const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
                Molecule: { bg: '#EFF6FF', text: '#1D4ED8', border: '#1D4ED8' },
                Product:  { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
                Machine:  { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
                Process:  { bg: '#F5F3FF', text: '#7C3AED', border: '#7C3AED' },
              }
              const cs = CATEGORY_STYLES[model.category] ?? { bg: '#F8FAFC', text: '#0A0A0A', border: '#0A0A0A' }
              return (
                <div key={model.id} className="bg-white border-2 border-ink p-5 shadow-[2px_2px_0px_0px_rgba(26,28,32,1)] flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_rgba(26,28,32,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[9px] font-black border px-2 py-0.5 uppercase tracking-wider"
                        style={{ backgroundColor: cs.bg, color: cs.text, borderColor: cs.border }}
                      >
                        {model.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-black text-ink text-sm uppercase leading-tight">{model.name}</h3>
                      <p className="font-mono text-[9px] text-ink/60 mt-1 leading-normal">{model.description}</p>
                    </div>
                  </div>
                  <div>
                    <ThreeDViewer modelType={model.model_type} name={model.name} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {viewMode === 'commercial' && (
          <div className="pt-2">
            <CommercialGradeComparator />
          </div>
        )}

        {/* Premium Upgrade alert */}
        <div className="mt-10 border-2 border-ink p-6 shadow-hard" style={{ backgroundColor: '#FEFCE8', boxShadow: '2px 2px 0px 0px #EA580C' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-orange flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-black text-ink text-lg uppercase tracking-tight mb-1">
                  Unlock Chemical Resistance and Processing Data
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed font-bold">
                  Premium membership includes complete chemical resistance tables, processing parameters, and trade details for specialized materials (PTFE, PEEK, elastomers, biopolymers).
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="cn-btn-orange text-center text-xs py-3 px-6 flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              Unlock Premium <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
