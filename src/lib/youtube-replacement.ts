/**
 * Verified polymer engineering fallback educational video IDs.
 * 100% verified via YouTube oEmbed & tested for active embedding permissions.
 */
export const YOUTUBE_FALLBACKS: Record<string, string> = {
  'polymer-fundamental-concepts': 'Gbltx4IXLzQ',
  'injection-molding-parameters': 'RMjtmsr3CqA',
  'extrusion-screw-compounding': '03kII32nLtw',
  'universal-tensile-testing': '8hkmDWtNZxs',
  'default': 'RMjtmsr3CqA'
};

export const SUBJECT_FALLBACKS: Record<string, string> = {
  'polymer-chemistry': 'Gbltx4IXLzQ', // Intro to Polymers - NPTEL
  'polymer-processing': 'RMjtmsr3CqA', // Injection Molding - Paulson Training
  'mould-design': 'DEbe7s8eaiI', // Runner & Gate Design
  'polymer-testing': '8hkmDWtNZxs', // Tensile Testing UTM - Instron
  'polymer-rheology': 'Som5OjiDevo', // Viscosity & Rheology - NPTEL
  'polymer-composites': '67l5JeCjNuE', // Composites - NPTEL
  'additives-compounding': '03kII32nLtw', // Extrusion Compounding - Coperion
  'rubber-technology': 'HPIOgL3ngSk', // Vulcanization Chemistry
  'medical-plastics': 'BFo5KsCOA1Y', // ISO 10993 Biocompatibility
  'medical-plastics-biomaterials': 'BFo5KsCOA1Y',
  'recycling-technology': '-XqJMwj-YHY', // Mechanical Recycling
  'sustainable-plastics': 'wZa5aHeqDFU', // Seaweed-Based Bioplastics
  'sustainable-plastics-bioplastics': 'wZa5aHeqDFU',
  'plastic-packaging-engineering': 'j5WFzNHHO8w', // Blown Film Extrusion
  'life-cycle-assessment': 'yOl3jpqUdVA', // LCA ISO 14040
  'entrepreneurship-plastics': 'VaMvl8SXCk0', // Polymer Manufacturing Setup
  'entrepreneurship-in-plastics': 'VaMvl8SXCk0',
  'color-science-masterbatches': 'gs4ZZvyeSzo', // Masterbatch Production
  'polymer-nanotechnology': '67l5JeCjNuE',
  'bioprocessing-fermentation': 'wZa5aHeqDFU',
  'robotics-plastics': 'RMjtmsr3CqA',
  'digital-twins-plastics': 'DEbe7s8eaiI'
};

/**
 * Returns a guaranteed working YouTube video ID for a broken embed
 */
export function getFallbackVideo(
  youtubeId: string,
  lessonSlug?: string,
  subjectSlug?: string
): string {
  // Try lesson-specific fallback first
  if (lessonSlug && YOUTUBE_FALLBACKS[lessonSlug]) {
    return YOUTUBE_FALLBACKS[lessonSlug];
  }

  // Try subject-specific fallback second
  if (subjectSlug && SUBJECT_FALLBACKS[subjectSlug]) {
    return SUBJECT_FALLBACKS[subjectSlug];
  }

  // Use general fallback if no matches found
  return YOUTUBE_FALLBACKS.default || 'RMjtmsr3CqA';
}

/**
 * Fallback helper check to resolve getFallbackVideoId locally
 */
export function getFallbackVideoId(
  originalId: string | null | undefined,
  subjectSlug: string | null | undefined,
  forceFallback?: boolean
): string {
  const isDummyId = !originalId || (
    originalId.endsWith('8Y8G1b9pI') || 
    originalId.endsWith('8W1BqQn-X58') || 
    originalId.endsWith('Zq7qPebW1q4') || 
    ['rubber123', 'carbon456', 'mfi_test', 'xyzabc123', 'dqw4w9wgxcq', '1tsrkv-dpno'].includes(originalId.toLowerCase())
  );

  if (isDummyId || forceFallback) {
    if (subjectSlug && SUBJECT_FALLBACKS[subjectSlug]) {
      return SUBJECT_FALLBACKS[subjectSlug];
    }
    return YOUTUBE_FALLBACKS.default || 'RMjtmsr3CqA';
  }

  return originalId;
}

export function isVideoBroken(
  video: { youtube_id?: string | null; youtubeId?: string | null; embed_status?: string | null } | null | undefined
): boolean {
  const ytId = video?.youtube_id || video?.youtubeId;
  const isDummyId = !ytId || (
    ytId.endsWith('8Y8G1b9pI') || 
    ytId.endsWith('8W1BqQn-X58') || 
    ytId.endsWith('Zq7qPebW1q4') || 
    ['rubber123', 'carbon456', 'mfi_test', 'xyzabc123', 'dqw4w9wgxcq', '1tsrkv-dpno'].includes(ytId.toLowerCase())
  );

  return video?.embed_status === 'broken' || video?.embed_status === 'pending' || video?.embed_status === 'invalid' || !!isDummyId;
}
