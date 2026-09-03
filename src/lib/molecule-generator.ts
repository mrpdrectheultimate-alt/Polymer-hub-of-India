// src/lib/molecule-generator.ts

export interface Atom {
  element: 'C' | 'H' | 'O' | 'N' | 'Cl' | 'F' | 'Si' | 'S';
  x: number;
  y: number;
  z: number;
}

export interface Bond {
  start: number;
  end: number;
  type: 'single' | 'double' | 'triple' | 'aromatic';
}

export interface MoleculeData {
  atoms: Atom[];
  bonds: Bond[];
}

// Element properties (CPK Coloring)
const ELEMENTS: Record<string, { color: string; radius: number; label: string }> = {
  C: { color: '#374151', radius: 12, label: 'Carbon (C)' },       // Dark Charcoal Carbon
  H: { color: '#E2E8F0', radius: 7, label: 'Hydrogen (H)' },       // Clean White Hydrogen
  O: { color: '#EF4444', radius: 12, label: 'Oxygen (O)' },        // Vivid Red Oxygen
  N: { color: '#2563EB', radius: 12, label: 'Nitrogen (N)' },      // CPK Royal Blue Nitrogen
  Cl: { color: '#10B981', radius: 16, label: 'Chlorine (Cl)' },   // Forest Green Chlorine
  F: { color: '#06B6D4', radius: 11, label: 'Fluorine (F)' },      // Cyan Fluorine
  Si: { color: '#94A3B8', radius: 13, label: 'Silicon (Si)' },     // Slate Silicon
  S: { color: '#EAB308', radius: 14, label: 'Sulfur (S)' },        // Amber Yellow Sulfur
};

export function getElementColor(element: string): string {
  return ELEMENTS[element]?.color || '#FFFFFF';
}

export function getElementRadius(element: string): number {
  return ELEMENTS[element]?.radius || 10;
}

// 30 Molecule Presets
export const MOLECULE_PRESETS: Record<string, MoleculeData> = {
  polyethylene: {
    atoms: [
      { element: 'C', x: -100, y: -15, z: 0 },
      { element: 'H', x: -100, y: 15, z: -25 },
      { element: 'H', x: -100, y: 15, z: 25 },
      { element: 'C', x: -60, y: 15, z: 0 },
      { element: 'H', x: -60, y: -15, z: -25 },
      { element: 'H', x: -60, y: -15, z: 25 },
      { element: 'C', x: -20, y: -15, z: 0 },
      { element: 'H', x: -20, y: 15, z: -25 },
      { element: 'H', x: -20, y: 15, z: 25 },
      { element: 'C', x: 20, y: 15, z: 0 },
      { element: 'H', x: 20, y: -15, z: -25 },
      { element: 'H', x: 20, y: -15, z: 25 },
      { element: 'C', x: 60, y: -15, z: 0 },
      { element: 'H', x: 60, y: 15, z: -25 },
      { element: 'H', x: 60, y: 15, z: 25 },
      { element: 'C', x: 100, y: 15, z: 0 },
      { element: 'H', x: 100, y: -15, z: -25 },
      { element: 'H', x: 100, y: -15, z: 25 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' }, { start: 0, end: 2, type: 'single' },
      { start: 0, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' }, { start: 3, end: 5, type: 'single' },
      { start: 3, end: 6, type: 'single' },
      { start: 6, end: 7, type: 'single' }, { start: 6, end: 8, type: 'single' },
      { start: 6, end: 9, type: 'single' },
      { start: 9, end: 10, type: 'single' }, { start: 9, end: 11, type: 'single' },
      { start: 9, end: 12, type: 'single' },
      { start: 12, end: 13, type: 'single' }, { start: 12, end: 14, type: 'single' },
      { start: 12, end: 15, type: 'single' },
      { start: 15, end: 16, type: 'single' }, { start: 15, end: 17, type: 'single' },
    ],
  },
  polypropylene: {
    atoms: [
      { element: 'C', x: -80, y: -15, z: 0 },
      { element: 'H', x: -80, y: 15, z: -20 },
      { element: 'H', x: -80, y: 15, z: 20 },
      { element: 'C', x: -30, y: 15, z: 0 },
      { element: 'H', x: -30, y: -10, z: -20 },
      // Methyl Carbon
      { element: 'C', x: -30, y: 55, z: 20 },
      { element: 'H', x: -45, y: 75, z: 35 },
      { element: 'H', x: -15, y: 75, z: 35 },
      { element: 'H', x: -30, y: 55, z: 50 },
      // Backbone continuation
      { element: 'C', x: 20, y: -15, z: 0 },
      { element: 'H', x: 20, y: 15, z: -20 },
      { element: 'H', x: 20, y: 15, z: 20 },
      { element: 'C', x: 70, y: 15, z: 0 },
      { element: 'H', x: 70, y: -10, z: -20 },
      // Methyl 2
      { element: 'C', x: 70, y: 55, z: 20 },
      { element: 'H', x: 55, y: 75, z: 35 },
      { element: 'H', x: 85, y: 75, z: 35 },
      { element: 'H', x: 70, y: 55, z: 50 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' }, { start: 0, end: 2, type: 'single' },
      { start: 0, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' },
      { start: 3, end: 5, type: 'single' },
      { start: 5, end: 6, type: 'single' }, { start: 5, end: 7, type: 'single' }, { start: 5, end: 8, type: 'single' },
      { start: 3, end: 9, type: 'single' },
      { start: 9, end: 10, type: 'single' }, { start: 9, end: 11, type: 'single' },
      { start: 9, end: 12, type: 'single' },
      { start: 12, end: 13, type: 'single' },
      { start: 12, end: 14, type: 'single' },
      { start: 14, end: 15, type: 'single' }, { start: 14, end: 16, type: 'single' }, { start: 14, end: 17, type: 'single' },
    ],
  },
  pvc: {
    atoms: [
      { element: 'C', x: -80, y: -15, z: 0 },
      { element: 'H', x: -80, y: 15, z: -20 },
      { element: 'H', x: -80, y: 15, z: 20 },
      { element: 'C', x: -30, y: 15, z: 0 },
      { element: 'H', x: -30, y: -10, z: -20 },
      { element: 'Cl', x: -30, y: 50, z: 25 },
      { element: 'C', x: 20, y: -15, z: 0 },
      { element: 'H', x: 20, y: 15, z: -20 },
      { element: 'H', x: 20, y: 15, z: 20 },
      { element: 'C', x: 70, y: 15, z: 0 },
      { element: 'H', x: 70, y: -10, z: -20 },
      { element: 'Cl', x: 70, y: 50, z: 25 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' }, { start: 0, end: 2, type: 'single' },
      { start: 0, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' },
      { start: 3, end: 5, type: 'single' },
      { start: 3, end: 6, type: 'single' },
      { start: 6, end: 7, type: 'single' }, { start: 6, end: 8, type: 'single' },
      { start: 6, end: 9, type: 'single' },
      { start: 9, end: 10, type: 'single' },
      { start: 9, end: 11, type: 'single' },
    ],
  },
  nylon: {
    atoms: [
      { element: 'C', x: -100, y: -15, z: 0 },
      { element: 'H', x: -100, y: 15, z: 15 },
      { element: 'C', x: -60, y: 15, z: 0 },
      { element: 'H', x: -60, y: 45, z: 15 },
      { element: 'N', x: -20, y: -15, z: 0 },
      { element: 'H', x: -20, y: -45, z: 0 },
      { element: 'C', x: 20, y: 15, z: 0 },
      { element: 'O', x: 20, y: 45, z: 0 },
      { element: 'C', x: 60, y: -15, z: 0 },
      { element: 'H', x: 60, y: -45, z: 15 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 0, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 2, end: 4, type: 'single' },
      { start: 4, end: 5, type: 'single' },
      { start: 4, end: 6, type: 'single' },
      { start: 6, end: 7, type: 'double' },
      { start: 6, end: 8, type: 'single' },
      { start: 8, end: 9, type: 'single' },
    ],
  },
  polystyrene: {
    atoms: [
      { element: 'C', x: -60, y: -20, z: 0 },
      { element: 'C', x: -20, y: -10, z: 0 },
      { element: 'C', x: 20, y: -20, z: 0 },
      { element: 'C', x: 60, y: -10, z: 0 },
      // Benzene ring
      { element: 'C', x: -20, y: 30, z: 0 },
      { element: 'C', x: -40, y: 50, z: 20 },
      { element: 'C', x: -40, y: 80, z: 20 },
      { element: 'C', x: -20, y: 100, z: 0 },
      { element: 'C', x: 0, y: 80, z: -20 },
      { element: 'C', x: 0, y: 50, z: -20 },
      // Hydrogens
      { element: 'H', x: -60, y: -45, z: 10 },
      { element: 'H', x: -20, y: -35, z: -15 },
      { element: 'H', x: 20, y: -45, z: 10 },
      { element: 'H', x: 60, y: -35, z: -15 },
      { element: 'H', x: -55, y: 40, z: 35 },
      { element: 'H', x: -55, y: 90, z: 35 },
      { element: 'H', x: -20, y: 125, z: 0 },
      { element: 'H', x: 15, y: 90, z: -35 },
      { element: 'H', x: 15, y: 40, z: -35 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 1, end: 4, type: 'single' },
      { start: 4, end: 5, type: 'double' },
      { start: 5, end: 6, type: 'single' },
      { start: 6, end: 7, type: 'double' },
      { start: 7, end: 8, type: 'single' },
      { start: 8, end: 9, type: 'double' },
      { start: 9, end: 4, type: 'single' },
      { start: 0, end: 10, type: 'single' },
      { start: 1, end: 11, type: 'single' },
      { start: 2, end: 12, type: 'single' },
      { start: 3, end: 13, type: 'single' },
      { start: 5, end: 14, type: 'single' },
      { start: 6, end: 15, type: 'single' },
      { start: 7, end: 16, type: 'single' },
      { start: 8, end: 17, type: 'single' },
      { start: 9, end: 18, type: 'single' },
    ],
  },
  polycarbonate: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'O', x: -50, y: 0, z: 0 },
      { element: 'C', x: -20, y: 0, z: 0 },
      { element: 'O', x: -20, y: -30, z: 0 },
      { element: 'O', x: 10, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'double' },
      { start: 2, end: 4, type: 'single' },
      { start: 4, end: 5, type: 'single' },
    ],
  },
  pet: {
    atoms: [
      { element: 'C', x: -90, y: 20, z: 0 },
      { element: 'C', x: -90, y: -20, z: 0 },
      { element: 'O', x: -55, y: -25, z: 0 },
      { element: 'C', x: -25, y: 0, z: 0 },
      { element: 'O', x: -25, y: 30, z: 0 },
      { element: 'C', x: 10, y: -10, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'double' },
      { start: 3, end: 5, type: 'single' },
    ],
  },
  ptfe: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'F', x: -60, y: 30, z: 15 },
      { element: 'F', x: -60, y: -30, z: -15 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'F', x: 0, y: 30, z: -15 },
      { element: 'F', x: 0, y: -30, z: 15 },
      { element: 'C', x: 60, y: 0, z: 0 },
      { element: 'F', x: 60, y: 30, z: 15 },
      { element: 'F', x: 60, y: -30, z: -15 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' }, { start: 0, end: 2, type: 'single' },
      { start: 0, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' }, { start: 3, end: 5, type: 'single' },
      { start: 3, end: 6, type: 'single' },
      { start: 6, end: 7, type: 'single' }, { start: 6, end: 8, type: 'single' },
    ],
  },
  peek: {
    atoms: [
      { element: 'O', x: -80, y: 0, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
      { element: 'O', x: 40, y: -30, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'double' },
    ],
  },
  polyurethane: {
    atoms: [
      { element: 'N', x: -80, y: 0, z: 0 },
      { element: 'H', x: -80, y: 30, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'O', x: -40, y: -30, z: 0 },
      { element: 'O', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 0, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'double' },
      { start: 2, end: 4, type: 'single' },
      { start: 4, end: 5, type: 'single' },
    ],
  },
  pla: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'O', x: -30, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'O', x: 0, y: -30, z: 0 },
      { element: 'C', x: 40, y: 20, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'double' },
      { start: 2, end: 4, type: 'single' },
    ],
  },
  pha: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: -20, y: 15, z: 0 },
      { element: 'O', x: 10, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
      { element: 'O', x: 40, y: -30, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'double' },
    ],
  },
  abs: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: -20, y: 0, z: 0 },
      { element: 'N', x: 20, y: 0, z: 0 },
      { element: 'C', x: 60, y: 20, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'triple' },
      { start: 1, end: 3, type: 'single' },
    ],
  },
  pmma: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'C', x: 0, y: -30, z: 0 },
      { element: 'O', x: 30, y: 0, z: 0 },
      { element: 'C', x: 60, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'double' },
      { start: 1, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' },
    ],
  },
  pom: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'O', x: -40, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'O', x: 40, y: 0, z: 0 },
      { element: 'C', x: 80, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'single' },
    ],
  },
  pa6: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'N', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
      { element: 'O', x: 40, y: -30, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'double' },
    ],
  },
  pbt: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'O', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
      { element: 'O', x: 40, y: -30, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 3, end: 4, type: 'double' },
    ],
  },
  psu: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'S', x: -40, y: 0, z: 0 },
      { element: 'O', x: -40, y: 30, z: 0 },
      { element: 'O', x: -40, y: -30, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'double' },
      { start: 1, end: 3, type: 'double' },
      { start: 1, end: 4, type: 'single' },
    ],
  },
  pei: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'N', x: -40, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'O', x: 0, y: -30, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'double' },
    ],
  },
  lcp: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'double' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'double' },
    ],
  },
  epoxy: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: 0, y: 20, z: 0 },
      { element: 'O', x: -30, y: 35, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 0, end: 2, type: 'single' },
      { start: 1, end: 2, type: 'single' },
    ],
  },
  bakelite: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'O', x: -30, y: 0, z: 0 },
      { element: 'C', x: 20, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
    ],
  },
  silicone: {
    atoms: [
      { element: 'Si', x: -80, y: 0, z: 0 },
      { element: 'O', x: -40, y: 0, z: 0 },
      { element: 'Si', x: 0, y: 0, z: 0 },
      { element: 'C', x: 0, y: 30, z: 15 },
      { element: 'C', x: 0, y: -30, z: -15 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
      { start: 2, end: 3, type: 'single' },
      { start: 2, end: 4, type: 'single' },
    ],
  },
  rubber: {
    atoms: [
      { element: 'C', x: -80, y: 0, z: 0 },
      { element: 'C', x: -40, y: 0, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
      { element: 'C', x: 40, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'double' },
      { start: 2, end: 3, type: 'single' },
    ],
  },
  sbr: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: -20, y: 0, z: 0 },
      { element: 'C', x: 20, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'double' },
    ],
  },
  epdm: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: -20, y: 0, z: 0 },
      { element: 'C', x: 20, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
    ],
  },
  nbr: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'C', x: -20, y: 0, z: 0 },
      { element: 'N', x: 20, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'triple' },
    ],
  },
  neoprene: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'Cl', x: -60, y: 30, z: 0 },
      { element: 'C', x: 0, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 0, end: 2, type: 'double' },
    ],
  },
  pvdf: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'F', x: -60, y: 30, z: 15 },
      { element: 'F', x: -60, y: -30, z: -15 },
      { element: 'C', x: 0, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 0, end: 2, type: 'single' },
      { start: 0, end: 3, type: 'single' },
    ],
  },
  peba: {
    atoms: [
      { element: 'C', x: -60, y: 0, z: 0 },
      { element: 'O', x: -20, y: 0, z: 0 },
      { element: 'N', x: 20, y: 0, z: 0 },
    ],
    bonds: [
      { start: 0, end: 1, type: 'single' },
      { start: 1, end: 2, type: 'single' },
    ],
  },
};

export function getMoleculeData(name: string): MoleculeData | null {
  // Normalize key lookup
  const normalizedKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (normalizedKey.includes('polyethylene') && !normalizedKey.includes('terephthalate')) return MOLECULE_PRESETS.polyethylene;
  if (normalizedKey.includes('polypropylene')) return MOLECULE_PRESETS.polypropylene;
  if (normalizedKey.includes('pvc') || normalizedKey.includes('vinylchloride')) return MOLECULE_PRESETS.pvc;
  if (normalizedKey.includes('nylon66')) return MOLECULE_PRESETS.nylon;
  if (normalizedKey.includes('polystyrene')) return MOLECULE_PRESETS.polystyrene;
  if (normalizedKey.includes('polycarbonate')) return MOLECULE_PRESETS.polycarbonate;
  if (normalizedKey.includes('terephthalate') || normalizedKey.includes('pet')) return MOLECULE_PRESETS.pet;
  if (normalizedKey.includes('ptfe') || normalizedKey.includes('teflon')) return MOLECULE_PRESETS.ptfe;
  if (normalizedKey.includes('peek') || normalizedKey.includes('etherketone')) return MOLECULE_PRESETS.peek;
  if (normalizedKey.includes('polyurethane')) return MOLECULE_PRESETS.polyurethane;
  if (normalizedKey.includes('pla') || normalizedKey.includes('lactic')) return MOLECULE_PRESETS.pla;
  if (normalizedKey.includes('pha') || normalizedKey.includes('hydroxyalkanoate')) return MOLECULE_PRESETS.pha;
  if (normalizedKey.includes('abs')) return MOLECULE_PRESETS.abs;
  if (normalizedKey.includes('pmma') || normalizedKey.includes('acrylic')) return MOLECULE_PRESETS.pmma;
  if (normalizedKey.includes('pom') || normalizedKey.includes('acetal')) return MOLECULE_PRESETS.pom;
  if (normalizedKey.includes('pa6') || normalizedKey.includes('nylon6')) return MOLECULE_PRESETS.pa6;
  if (normalizedKey.includes('pbt')) return MOLECULE_PRESETS.pbt;
  if (normalizedKey.includes('psu') || normalizedKey.includes('sulfone')) return MOLECULE_PRESETS.psu;
  if (normalizedKey.includes('pei') || normalizedKey.includes('imide')) return MOLECULE_PRESETS.pei;
  if (normalizedKey.includes('lcp') || normalizedKey.includes('liquidcrystal')) return MOLECULE_PRESETS.lcp;
  if (normalizedKey.includes('epoxy')) return MOLECULE_PRESETS.epoxy;
  if (normalizedKey.includes('bakelite') || normalizedKey.includes('phenolic')) return MOLECULE_PRESETS.bakelite;
  if (normalizedKey.includes('silicone') || normalizedKey.includes('pdms')) return MOLECULE_PRESETS.silicone;
  if (normalizedKey.includes('rubber') && !normalizedKey.includes('sbr') && !normalizedKey.includes('nbr')) return MOLECULE_PRESETS.rubber;
  if (normalizedKey.includes('sbr')) return MOLECULE_PRESETS.sbr;
  if (normalizedKey.includes('epdm')) return MOLECULE_PRESETS.epdm;
  if (normalizedKey.includes('nbr') || normalizedKey.includes('nitrile')) return MOLECULE_PRESETS.nbr;
  if (normalizedKey.includes('neoprene') || normalizedKey.includes('chloroprene')) return MOLECULE_PRESETS.neoprene;
  if (normalizedKey.includes('pvdf')) return MOLECULE_PRESETS.pvdf;
  if (normalizedKey.includes('peba') || normalizedKey.includes('blockamide')) return MOLECULE_PRESETS.peba;

  return MOLECULE_PRESETS[normalizedKey] || null;
}
