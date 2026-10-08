// src/lib/map/map-data.ts — Master Site Map & Learning Guide Structural Data
import { HomepageMapCard, GateSection, GoalOption, SubjectMapItem, FirstWeekStep } from '@/types/map'

export const HOMEPAGE_MAP_CARDS: HomepageMapCard[] = [
  {
    id: 'gate-prep',
    icon: 'GraduationCap',
    title: 'Prepare for GATE 2026',
    subtitle: 'Mapped to XE-F Syllabus',
    description: '9 official sections · 216 curriculum lessons · Timed mock tests · Formula revision cheat sheet.',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    primaryCta: {
      label: 'Start GATE Preparation →',
      link: '/gate-mock'
    },
    secondaryLinks: [
      { label: 'GATE XE-F Mock Arena', link: '/gate-mock', badge: '30 Qs · 60m' },
      { label: 'GATE Formula Cheat Sheet', link: '/formulas/sheet', badge: 'Print PDF' },
      { label: 'Practice MCQs by Topic', link: '/practice', badge: '1,500+ MCQs' },
      { label: 'Syllabus Section Map', link: '/start#gate-sections', badge: '9 Sections' }
    ]
  },
  {
    id: 'learn-subject',
    icon: 'BookOpen',
    title: 'Learn a Subject',
    subtitle: '19 Subjects · 216 Lessons',
    description: 'Structured university theory · 3D polymer molecular models · Solved shop-floor examples · AI tutor.',
    color: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    primaryCta: {
      label: 'Explore All 19 Subjects →',
      link: '/subjects'
    },
    secondaryLinks: [
      { label: 'Polymer Chemistry (Start Here)', link: '/subjects', badge: '15 Lessons' },
      { label: 'Polymer Processing & Extrusion', link: '/subjects', badge: '20 Lessons' },
      { label: 'Reference Reading Room', link: '/library', badge: '50 Textbooks' },
      { label: 'AI Polymer Copilot', link: '/ai-tutor', badge: 'RAG AI' }
    ]
  },
  {
    id: 'use-tools',
    icon: 'Wrench',
    title: 'Use Engineering Tools',
    subtitle: 'Calculators · Solvers · Specs',
    description: '280+ formulas · 12 live calculators · Rosato defect troubleshooter · 35+ ASTM polymer specs.',
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    borderColor: '#FEF08A',
    primaryCta: {
      label: 'Open Engineering Tools →',
      link: '/formulas'
    },
    secondaryLinks: [
      { label: 'Master Formula Library', link: '/formulas', badge: '280+ Solvers' },
      { label: 'Injection & Cooling Calculators', link: '/calculators', badge: '12 Solvers' },
      { label: 'Defect Troubleshooter', link: '/troubleshooter', badge: 'Rosato Guide' },
      { label: 'Property Comparator', link: '/comparator', badge: '35+ Resins' }
    ]
  },
  {
    id: 'ask-connect',
    icon: 'MessageCircle',
    title: 'Ask & Connect',
    subtitle: 'AI Tutor · Forum · Careers',
    description: 'Instant AI problem solving · CIPET & student Q&A forum · 6 specialized polymer career tracks.',
    color: '#15803D',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    primaryCta: {
      label: 'Get Guidance & Connect →',
      link: '/ai-tutor'
    },
    secondaryLinks: [
      { label: 'Ask Polymer AI Copilot', link: '/ai-tutor', badge: 'Instant AI' },
      { label: 'Student Q&A Forum', link: '/forum', badge: 'Community' },
      { label: 'SPE Career Pathways', link: '/careers', badge: '₹4–40 LPA' },
      { label: 'Student Projects Showcase', link: '/projects', badge: 'Portfolios' }
    ]
  }
]

export const GATE_SECTIONS: GateSection[] = [
  {
    id: 'gate-sec-1',
    number: 1,
    title: 'Chemistry of High Polymers',
    subjects: ['Polymer Chemistry', 'Additives & Compounding'],
    totalLessons: 27,
    relevanceStars: 5,
    link: '/subjects',
    description: 'Polymerization kinetics, step-growth Carothers, free radical addition, Mayo-Lewis copolymerization, Ziegler-Natta catalysis.'
  },
  {
    id: 'gate-sec-2',
    number: 2,
    title: 'Polymer Characterization',
    subjects: ['Polymer Testing & Characterization', 'Polymer Rheology'],
    totalLessons: 21,
    relevanceStars: 5,
    link: '/subjects',
    description: 'Molecular weight averages (Mn, Mw, Mz), GPC, DSC thermal crystallization Xc, TGA degradation, DMA viscoelasticity.'
  },
  {
    id: 'gate-sec-3',
    number: 3,
    title: 'Synthesis & Properties',
    subjects: ['Polymer Chemistry', 'Polymer Composites'],
    totalLessons: 27,
    relevanceStars: 4,
    link: '/subjects',
    description: 'Thermoplastics (PE, PP, PVC, PS, PET, PA, PC), thermosets (Epoxy, PF), elastomers, structure-property relationships.'
  },
  {
    id: 'gate-sec-4',
    number: 4,
    title: 'Blends & Polymer Composites',
    subjects: ['Polymer Composites & Fiber Engineering', 'Polymer Nanotechnology'],
    totalLessons: 20,
    relevanceStars: 4,
    link: '/subjects',
    description: 'Flory-Huggins thermodynamic miscibility, Rule of Mixtures (Voigt/Reuss), Halpin-Tsai model, carbon/glass fiber volume fraction.'
  },
  {
    id: 'gate-sec-5',
    number: 5,
    title: 'Polymer Technology & Compounding',
    subjects: ['Rubber & Elastomer Technology', 'Sustainable Plastics'],
    totalLessons: 24,
    relevanceStars: 4,
    link: '/subjects',
    description: 'Sulfur vulcanization, Flory-Rehner crosslink density, carbon black reinforcement, antioxidant photostabilization.'
  },
  {
    id: 'gate-sec-6',
    number: 6,
    title: 'Polymer Rheology & Flow Mechanics',
    subjects: ['Polymer Rheology & Melt Flow Mechanics'],
    totalLessons: 11,
    relevanceStars: 5,
    link: '/subjects',
    description: 'Pseudoplastic shear thinning, Power-Law model, Carreau-Yasuda, Bagley entrance correction, Rabinowitsch shear rate, WLF equation.'
  },
  {
    id: 'gate-sec-7',
    number: 7,
    title: 'Polymer Processing Machinery',
    subjects: ['Polymer Processing', 'Mould & Die Design'],
    totalLessons: 32,
    relevanceStars: 5,
    link: '/subjects',
    description: 'Injection molding cycle dynamics, press clamping tonnage, extruder single-screw throughput, blow molding parison control.'
  },
  {
    id: 'gate-sec-8',
    number: 8,
    title: 'Polymer Testing & Quality Control',
    subjects: ['Polymer Testing & Characterization'],
    totalLessons: 10,
    relevanceStars: 4,
    link: '/subjects',
    description: 'ASTM D638 tensile stress-strain, ASTM D256 Izod impact, ASTM D1238 Melt Flow Index (MFI), Shore hardness, HDT & Vicat.'
  },
  {
    id: 'gate-sec-9',
    number: 9,
    title: 'Recycling & Circular Economy',
    subjects: ['Advanced Recycling & Waste Processing', 'Life Cycle Assessment (LCA)'],
    totalLessons: 18,
    relevanceStars: 3,
    link: '/subjects',
    description: 'Mechanical wash lines, chemical pyrolysis depolymerization, CPCB EPR plastic credit guidelines, ISO 14040 LCA GWP carbon footprint.'
  }
]

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'goal-gate',
    goalText: 'Prepare for GATE 2026 XE-F Exam',
    iconName: 'GraduationCap',
    primaryDestination: { name: 'GATE XE-F Mock Arena', link: '/gate-mock' },
    secondaryDestination: { name: 'GATE Formula Sheet', link: '/formulas/sheet' }
  },
  {
    id: 'goal-subject',
    goalText: 'Learn Polymer Science Theory Systematically',
    iconName: 'BookOpen',
    primaryDestination: { name: 'All 19 Subjects', link: '/subjects' },
    secondaryDestination: { name: 'Reading Room Books', link: '/library' }
  },
  {
    id: 'goal-formula',
    goalText: 'Find Equations & Calculate Values',
    iconName: 'Calculator',
    primaryDestination: { name: 'Master Formula Library', link: '/formulas' },
    secondaryDestination: { name: 'Engineering Calculators', link: '/calculators' }
  },
  {
    id: 'goal-defect',
    goalText: 'Troubleshoot Molding Defects on Shop-Floor',
    iconName: 'Wrench',
    primaryDestination: { name: 'Defect Troubleshooter', link: '/troubleshooter' },
    secondaryDestination: { name: 'Process Calculators', link: '/calculators' }
  },
  {
    id: 'goal-market',
    goalText: 'Track Today’s Resin Spot Prices & EPR Rates',
    iconName: 'Flame',
    primaryDestination: { name: 'Today in Plastics', link: '/today' },
    secondaryDestination: { name: 'EPR Credit Guide', link: '/today' }
  },
  {
    id: 'goal-compare',
    goalText: 'Compare Polymer Material Properties',
    iconName: 'Scale',
    primaryDestination: { name: 'Property Comparator', link: '/comparator' },
    secondaryDestination: { name: '3D Materials Lab', link: '/materials' }
  },
  {
    id: 'goal-factory',
    goalText: 'Plan a Plastics Recycling or Extrusion Factory',
    iconName: 'Building2',
    primaryDestination: { name: 'Plastics Entrepreneurship', link: '/subjects' },
    secondaryDestination: { name: 'BEP Financial Formula', link: '/formulas' }
  }
]

export const FIRST_WEEK_STEPS: FirstWeekStep[] = [
  {
    day: 1,
    title: 'Take the GATE Diagnostic Quiz',
    action: 'Assess your starting knowledge level across core polymer topics.',
    destination: 'GATE Mock Arena',
    link: '/gate-mock',
    iconName: 'Award'
  },
  {
    day: 2,
    title: 'Start Polymer Chemistry Lesson 1',
    action: 'Master foundation polymerization mechanisms & degree of polymerization.',
    destination: 'Polymer Chemistry Subject',
    link: '/subjects',
    iconName: 'FlaskConical'
  },
  {
    day: 3,
    title: 'Practice 10 Practice MCQs',
    action: 'Test your understanding with instant automated feedback.',
    destination: 'Practice Questions',
    link: '/practice',
    iconName: 'Zap'
  },
  {
    day: 4,
    title: 'Bookmark the Master Formula Sheet',
    action: 'Save key equations for quick exam revision & shop-floor reference.',
    destination: 'Formula Sheet',
    link: '/formulas/sheet',
    iconName: 'FileText'
  },
  {
    day: 5,
    title: 'Explore 7 Industrial Market Sectors',
    action: 'Connect academic theory to automotive, packaging, and medical applications.',
    destination: 'The World of Plastic',
    link: '/world',
    iconName: 'Globe'
  },
  {
    day: 6,
    title: 'Ask Polymer AI a Technical Question',
    action: 'Test the AI Copilot to solve a complex equation or concept.',
    destination: 'Polymer AI Copilot',
    link: '/ai-tutor',
    iconName: 'Brain'
  },
  {
    day: 7,
    title: 'Review Your Learning Streak & XP',
    action: 'Check your overall progress score and climb the global leaderboard.',
    destination: 'Leaderboard & Streaks',
    link: '/leaderboard',
    iconName: 'Trophy'
  }
]
