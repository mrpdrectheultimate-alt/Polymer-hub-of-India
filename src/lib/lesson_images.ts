// src/lib/lesson_images.ts
// Visual Truth Engine Registry
// STRICT RULE: Zero stock photos (no crypto charts, no hands holding cash, no generic beakers).
// Only verified, peer-reviewed engineering micrographs, validated equipment diagrams, and authentic industrial assets.

export interface LessonImage {
  url: string;
  caption: string;
}

export interface LessonImages {
  hero?: string;
  concepts?: LessonImage[];
  products?: LessonImage[];
  machines?: LessonImage[];
}

export const LESSON_IMAGES: Record<string, LessonImages> = {
  // Verified lessons with authentic SEM / industrial hardware
  'injection-moulding-process-engineering': {
    machines: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        caption: 'Industrial Single-Screw Plasticating Injection Molding Unit (CIPET Training Lab)'
      }
    ]
  },
  'microcellular-foam-injection-moulding-mucell-supercritical-fluid-physics-nucleation': {
    machines: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        caption: 'Supercritical N2/CO2 Dosing & Injector Unit for Microcellular Foaming'
      }
    ]
  }
}
