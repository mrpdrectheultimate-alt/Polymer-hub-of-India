// src/lib/book_images.ts

export interface ImageAsset {
  url: string;
  caption: string;
}

export interface BookVisuals {
  cover: string;
  chapters: Record<string, ImageAsset[]>;
}

export const BOOK_IMAGES: Record<string, BookVisuals> = {
  'complete-guide-polymer-rheology': {
    cover: '/images/books/rheology-guide/cover.jpg',
    chapters: {
      'ch1': [
        { url: '/images/books/rheology-guide/chapter-1/newtonian-flow.png', caption: 'Figure 1: Newtonian flow behavior' },
        { url: '/images/books/rheology-guide/chapter-1/shear-thinning.png', caption: 'Figure 2: Shear-thinning behavior' },
      ],
      'ch2': [
        { url: '/images/books/rheology-guide/chapter-2/power-law-curve.png', caption: 'Figure 3: Power law model' },
        { url: '/images/books/rheology-guide/chapter-2/carreau-yasuda.png', caption: 'Figure 4: Carreau-Yasuda model' },
      ],
      'ch3': [
        { url: '/images/books/rheology-guide/chapter-3/capillary-rheometer.png', caption: 'Figure 5: Capillary rheometer schematic' },
        { url: '/images/books/rheology-guide/chapter-3/bagley-correction.png', caption: 'Figure 6: Bagley correction' },
      ],
      'ch4': [
        { url: '/images/books/rheology-guide/chapter-4/die-swell.png', caption: 'Figure 7: Die swell phenomenon' },
        { url: '/images/books/rheology-guide/chapter-4/melt-fracture.png', caption: 'Figure 8: Melt fracture' },
      ],
      'ch5': [
        { url: '/images/books/rheology-guide/chapter-5/rotational-rheometer.png', caption: 'Figure 9: Rotational rheometer' },
      ],
      'ch6': [
        { url: '/images/books/rheology-guide/chapter-6/industrial-rheology.png', caption: 'Figure 10: Industrial rheology applications' },
      ],
      'ch7': [
        { url: '/images/books/rheology-guide/chapter-7/rheology-standards.png', caption: 'Figure 11: Rheology testing standards' },
      ],
    },
  },
  'compounding-additives-handbook': {
    cover: '/images/books/compounding-handbook/cover.jpg',
    chapters: {
      'ch1': [
        { url: '/images/books/compounding-handbook/chapter-1/twin-screw-extruder.png', caption: 'Figure 1: Twin-screw extruder' },
      ],
      'ch2': [
        { url: '/images/books/compounding-handbook/chapter-2/screw-configurations.png', caption: 'Figure 2: Screw configurations' },
      ],
      'ch3': [
        { url: '/images/books/compounding-handbook/chapter-3/masterbatch-production.png', caption: 'Figure 3: Masterbatch production' },
        { url: '/images/books/compounding-handbook/chapter-3/let-down-ratio.png', caption: 'Figure 4: Let-down ratio concept' },
      ],
      'ch4': [
        { url: '/images/books/compounding-handbook/chapter-4/uv-stabilizers.png', caption: 'Figure 5: UV stabilizer mechanism' },
      ],
      'ch5': [
        { url: '/images/books/compounding-handbook/chapter-6/flame-retardants.png', caption: 'Figure 6: Flame retardant mechanisms' },
      ],
      'ch6': [
        { url: '/images/books/compounding-handbook/chapter-6/impact-modifiers.png', caption: 'Figure 7: Core-shell impact modifier' },
      ],
      'ch7': [
        { url: '/images/books/compounding-handbook/chapter-7/fillers.png', caption: 'Figure 8: Filler types' },
      ],
      'ch8': [
        { url: '/images/books/compounding-handbook/chapter-8/pigments.png', caption: 'Figure 9: Color pigments' },
      ],
      'ch9': [
        { url: '/images/books/compounding-handbook/chapter-9/quality-control.png', caption: 'Figure 10: Quality control in compounding' },
      ],
      'ch10': [
        { url: '/images/books/compounding-handbook/chapter-10/sustainable-compounding.png', caption: 'Figure 11: Sustainable compounding' },
      ],
    },
  },
  'polymer-testing-characterization-guide': {
    cover: '/images/books/testing-guide/cover.jpg',
    chapters: {
      'ch1': [
        { url: '/images/books/testing-guide/chapter-1/tensile-test-specimen.png', caption: 'Figure 1: Tensile test specimen (ASTM D638)' },
        { url: '/images/books/testing-guide/chapter-1/stress-strain-curve.png', caption: 'Figure 2: Typical stress-strain curve' },
      ],
      'ch2': [
        { url: '/images/books/testing-guide/chapter-2/izod-impact-test.png', caption: 'Figure 3: Izod impact test setup' },
        { url: '/images/books/testing-guide/chapter-2/charpy-impact-test.png', caption: 'Figure 4: Charpy impact test setup' },
        { url: '/images/books/testing-guide/chapter-2/fracture-types.png', caption: 'Figure 5: Fracture types' },
      ],
      'ch3': [
        { url: '/images/books/testing-guide/chapter-3/flexural-test.png', caption: 'Figure 6: Flexural test setup' },
        { url: '/images/books/testing-guide/chapter-3/load-deflection-curve.png', caption: 'Figure 7: Load-deflection curve' },
      ],
      'ch4': [
        { url: '/images/books/testing-guide/chapter-4/hardness-testing.png', caption: 'Figure 8: Shore hardness testing' },
      ],
      'ch5': [
        { url: '/images/books/testing-guide/chapter-5/dsc-thermogram.png', caption: 'Figure 9: DSC thermogram' },
        { url: '/images/books/testing-guide/chapter-5/tga-curve.png', caption: 'Figure 10: TGA decomposition curve' },
      ],
      'ch6': [
        { url: '/images/books/testing-guide/chapter-6/mfi-tester.png', caption: 'Figure 11: MFI tester' },
      ],
      'ch7': [
        { url: '/images/books/testing-guide/chapter-7/rheology-testing.png', caption: 'Figure 12: Rheology testing' },
      ],
      'ch8': [
        { url: '/images/books/testing-guide/chapter-8/ftir-spectrum.png', caption: 'Figure 13: FTIR spectrum' },
        { url: '/images/books/testing-guide/chapter-8/nmr-spectrum.png', caption: 'Figure 14: NMR spectrum' },
      ],
      'ch9': [
        { url: '/images/books/testing-guide/chapter-9/standards.png', caption: 'Figure 15: Standards and accreditation' },
      ],
    },
  },
};
