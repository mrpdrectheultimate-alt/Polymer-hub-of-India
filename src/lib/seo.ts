// src/lib/seo.ts
// Centralized SEO metadata for all pages
// Import and use in page.tsx files

export const BASE_URL = 'https://polymer-hub-six.vercel.app'

export const DEFAULT_METADATA = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PolymerHub — India\'s Plastic Polymer Engineering Knowledge Platform',
    template: '%s | PolymerHub',
  },
  description: 'World-class learning platform for Plastic Polymer Engineering (PPE) B.Tech students in India. 216 lessons, AI Tutor, practice questions, career guidance, and daily industry news.',
  keywords: [
    'plastic polymer engineering',
    'PPE B.Tech India',
    'polymer chemistry lessons',
    'injection moulding defects',
    'polymer processing',
    'CIPET',
    'rubber technology',
    'recycling technology India',
    'polymer engineering career',
    'GATE polymer science',
    'bioplastics PLA PHA',
    'mould design',
    'polymer testing MFI DSC',
    'plastic industry India',
    'PolymerHub',
  ],
  authors: [{ name: 'PolymerHub' }],
  creator: 'PolymerHub',
  publisher: 'PolymerHub',
  openGraph: {
    type: 'website' as const,
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'PolymerHub',
    title: 'PolymerHub — India\'s Plastic Polymer Engineering Platform',
    description: '155 world-class lessons. AI Tutor. Practice Questions. Daily Industry News. Career Guidance. Built for PPE students in India.',
    images: [
      {
        url: `${BASE_URL}/logo-banner.jpg`,
        width: 1035,
        height: 460,
        alt: 'Polymer Hub of India — Knowledge · Innovation · Future',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'PolymerHub — India\'s Plastic Polymer Engineering Platform',
    description: '155 world-class lessons. AI Tutor grounded in your syllabus. Practice MCQs. Daily plastics industry news.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
}

// ── Page-specific metadata generators ─────────────────────────────────────────

export function subjectMetadata(subject: { name: string; description: string; slug: string }) {
  return {
    title: `${subject.name} — Lessons & Study Guide`,
    description: `${subject.description} | complete lessons with AI Tutor support, practice questions, and Indian industry examples. Free for PPE students.`,
    keywords: [
      subject.name.toLowerCase(),
      `${subject.name.toLowerCase()} lessons`,
      `${subject.name.toLowerCase()} B.Tech India`,
      'polymer engineering',
      'PPE students',
    ],
    openGraph: {
      title: `${subject.name} — PolymerHub`,
      description: subject.description,
      url: `${BASE_URL}/subjects/${subject.slug}`,
    },
  }
}

export function lessonMetadata(lesson: {
  title: string
  summary: string
  slug: string
  subjectName: string
}) {
  return {
    title: lesson.title,
    description: `${lesson.summary} | Part of the ${lesson.subjectName} course on PolymerHub — India's polymer engineering education platform.`,
    keywords: [
      lesson.title.toLowerCase(),
      lesson.subjectName.toLowerCase(),
      'polymer engineering lesson',
      'PPE B.Tech',
      'India plastics industry',
    ],
    openGraph: {
      title: `${lesson.title} — PolymerHub`,
      description: lesson.summary,
      url: `${BASE_URL}/lessons/${lesson.slug}`,
      type: 'article' as const,
    },
  }
}

export const PAGE_METADATA = {
  home: {
    title: 'PolymerHub — India\'s Plastic Polymer Engineering Knowledge Platform',
    description: '216 world-class lessons across 19 PPE subjects. AI Tutor grounded in your syllabus. Practice MCQs with explanations. Daily plastics industry news. Career guidance. Free to start.',
  },
  subjects: {
    title: 'All Subjects — Polymer Engineering Curriculum',
    description: 'Complete B.Tech PPE curriculum: Polymer Chemistry, Processing, Mould Design, Testing, Rubber Technology, Recycling, Sustainable Plastics, Composites, Medical Plastics, and Entrepreneurship. 216 lessons total.',
  },
  aiTutor: {
    title: 'AI Tutor — Ask Anything About Polymer Engineering',
    description: 'Gemini-powered AI Tutor grounded in all 216 PolymerHub lessons. Ask about Tg, Tm, MFI, injection moulding, vulcanization, EPR — get answers tied directly to your syllabus.',
  },
  today: {
    title: 'Daily Pulse — Today in the Plastics Industry',
    description: 'Daily plastics industry news, polymer price updates, research highlights, and India-specific policy updates. Stay connected to the sector every day.',
  },
  careers: {
    title: 'Polymer Engineering Careers — 6 Tracks, ₹4–40 LPA',
    description: 'Career paths for PPE graduates: Process Engineer, R&D Engineer, QA/QC, Sustainability Engineer, Medical Device, and Entrepreneurship. Salary bands, GATE prep, and learning roadmap.',
  },
  practice: {
    title: 'Practice MCQs — Polymer Engineering Quiz',
    description: 'Practice MCQ questions across all 15 subjects. GATE-mapped questions with detailed explanations. Test yourself on Polymer Chemistry, Processing, Rubber Technology, and more.',
  },
  history: {
    title: 'History of Plastics — 162 Years That Remade Civilization',
    description: 'From Parkesine (1862) to PETase enzymes — the complete history of plastic polymer engineering and where the industry is heading next.',
  },
  world: {
    title: 'The World of Plastic — 7 Industries That Run on Polymers',
    description: 'Without polymer engineering, modern life stops. Explore how plastics enable packaging, medicine, aerospace, automotive, electronics, textiles, and construction.',
  },
  resources: {
    title: 'Reference Library — 17 Books That Define the Plastics Sector',
    description: 'Curated reference library: Brandrup Polymer Handbook, Rosato Processing Data, Allen & Baker, Mittal Medical Polymers, and 13 more — mapped to your subjects and career tracks.',
  },
  comparator: {
    title: 'Polymer Property Comparator — Compare 12 Materials Side by Side',
    description: 'Compare PP vs HDPE, ABS vs PC, PLA vs PHA — 15 properties each including Tg, Tm, tensile strength, impact resistance, HDT, and MFI. Data from Brandrup Polymer Handbook.',
  },
  troubleshooter: {
    title: 'Defect Troubleshooter — Fix Injection Moulding & Extrusion Defects',
    description: 'Interactive guide to fixing sink marks, warpage, flash, burn marks, short shots, melt fracture, surging, and more. Corrective actions from Rosato and Allen & Baker data handbooks.',
  },
  pricing: {
    title: 'Pricing — PolymerHub Premium',
    description: 'Unlock all 216 lessons, unlimited AI Tutor queries, and premium practice questions. ₹149/month — less than the cost of a single textbook chapter.',
  },
}
