// src/lib/machine-generator.ts

export interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  label?: string;
}

export interface Connection {
  from: number;
  to: number;
  color?: string;
  width?: number;
}

export interface MachineData {
  points: Point3D[];
  connections: Connection[];
}

export function getMachineData(name: string): MachineData {
  const points: Point3D[] = [];
  const connections: Connection[] = [];
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normalized.includes('extruder') || normalized.includes('screw')) {
    // Extruder screw inside transparent barrel
    const barrelR = 25;
    const length = 180;
    const turns = 12;
    const screwPtsCount = 80;
    const screwR = 15;
    const color = '#F59E0B'; // Screw color (Orange/Yellow)

    // Winding helix thread points
    for (let i = 0; i < screwPtsCount; i++) {
      const t = i / (screwPtsCount - 1);
      const x = -length / 2 + t * length;
      const angle = t * turns * Math.PI * 2;
      points.push({
        x,
        y: Math.cos(angle) * screwR,
        z: Math.sin(angle) * screwR,
        color,
        radius: 2,
      });

      if (i > 0) {
        connections.push({
          from: i - 1,
          to: i,
          color,
          width: 3.5,
        });
      }
    }

    // Outer barrel wire circles
    const ringSpacing = 30;
    const rings = Math.floor(length / ringSpacing) + 1;
    const barrelColor = '#9CA3AF'; // Barrel color
    for (let r = 0; r < rings; r++) {
      const rx = -length / 2 + r * ringSpacing;
      const ringOffset = points.length;
      const segments = 10;
      for (let s = 0; s < segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        points.push({
          x: rx,
          y: Math.cos(angle) * barrelR,
          z: Math.sin(angle) * barrelR,
          color: barrelColor,
          radius: 1.5,
        });
        connections.push({
          from: ringOffset + s,
          to: ringOffset + ((s + 1) % segments),
          color: 'rgba(156, 163, 175, 0.4)',
          width: 1,
        });
      }
    }
  } else if (normalized.includes('injection') || normalized.includes('clamping') || normalized.includes('molding')) {
    // Injection Molding Machine (Hydraulic clamping + Tie bars + Mold)
    const color = '#6B7280'; // Slate Gray
    
    // Four horizontal tie bars
    const xLen = 140;
    const barSpacing = 20;
    const coords = [
      [-barSpacing, -barSpacing],
      [-barSpacing, barSpacing],
      [barSpacing, -barSpacing],
      [barSpacing, barSpacing],
    ];

    coords.forEach(([cy, cz]) => {
      const offset = points.length;
      points.push({ x: -xLen / 2, y: cy, z: cz, color: '#D1D5DB', radius: 2 });
      points.push({ x: xLen / 2, y: cy, z: cz, color: '#D1D5DB', radius: 2 });
      connections.push({ from: offset, to: offset + 1, color: '#D1D5DB', width: 2 });
    });

    // Platens (blocks along the bars)
    const platenX = [-50, -10, 40];
    platenX.forEach((px) => {
      const offset = points.length;
      // Square platen outline
      points.push({ x: px, y: -30, z: -30, color, radius: 2.5 });
      points.push({ x: px, y: -30, z: 30, color, radius: 2.5 });
      points.push({ x: px, y: 30, z: 30, color, radius: 2.5 });
      points.push({ x: px, y: 30, z: -30, color, radius: 2.5 });

      connections.push({ from: offset, to: offset + 1, color, width: 3 });
      connections.push({ from: offset + 1, to: offset + 2, color, width: 3 });
      connections.push({ from: offset + 2, to: offset + 3, color, width: 3 });
      connections.push({ from: offset + 3, to: offset, color, width: 3 });
    });

    // Funnel (Hopper)
    const hopperOffset = points.length;
    points.push({ x: 50, y: -30, z: 0, color: '#EF4444', radius: 2 });
    points.push({ x: 65, y: -50, z: -15, color: '#EF4444', radius: 2 });
    points.push({ x: 65, y: -50, z: 15, color: '#EF4444', radius: 2 });
    points.push({ x: 35, y: -50, z: 15, color: '#EF4444', radius: 2 });
    points.push({ x: 35, y: -50, z: -15, color: '#EF4444', radius: 2 });

    connections.push({ from: hopperOffset, to: hopperOffset + 1, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset, to: hopperOffset + 2, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset, to: hopperOffset + 3, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset, to: hopperOffset + 4, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset + 1, to: hopperOffset + 2, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset + 2, to: hopperOffset + 3, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset + 3, to: hopperOffset + 4, color: '#EF4444', width: 1.5 });
    connections.push({ from: hopperOffset + 4, to: hopperOffset + 1, color: '#EF4444', width: 1.5 });
  } else if (normalized.includes('blow') || normalized.includes('die') || normalized.includes('head')) {
    // Blow Molding Die / Parison
    const color = '#3B82F6';
    // Parison tube hanging down
    const segments = 10;
    const ptOffset = points.length;
    // Circular die head
    for (let s = 0; s < segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      points.push({ x: Math.cos(angle) * 20, y: -40, z: Math.sin(angle) * 20, color: '#475569', radius: 2.5 });
      connections.push({ from: ptOffset + s, to: ptOffset + ((s + 1) % segments), color: '#475569', width: 2 });
    }
    // Extruded hot plastic tube (parison)
    for (let y = -30; y <= 30; y += 15) {
      const ringOffset = points.length;
      for (let s = 0; s < segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        points.push({ x: Math.cos(angle) * 12, y, z: Math.sin(angle) * 12, color, radius: 2 });
        connections.push({ from: ringOffset + s, to: ringOffset + ((s + 1) % segments), color, width: 2 });
        if (y > -30) {
          connections.push({ from: ringOffset + s - segments, to: ringOffset + s, color: 'rgba(59, 130, 246, 0.4)', width: 1 });
        }
      }
    }
  } else {
    // Default schematic box/frame representation for calenders, ovens, drying tanks, etc.
    const color = '#6B7280';
    points.push({ x: -40, y: -40, z: -40, color, radius: 2 });
    points.push({ x: 40, y: -40, z: -40, color, radius: 2 });
    points.push({ x: 40, y: 40, z: -40, color, radius: 2 });
    points.push({ x: -40, y: 40, z: -40, color, radius: 2 });
    points.push({ x: -40, y: -40, z: 40, color, radius: 2 });
    points.push({ x: 40, y: -40, z: 40, color, radius: 2 });
    points.push({ x: 40, y: 40, z: 40, color, radius: 2 });
    points.push({ x: -40, y: 40, z: 40, color, radius: 2 });

    connections.push({ from: 0, to: 1, color }, { from: 1, to: 2, color }, { from: 2, to: 3, color }, { from: 3, to: 0, color });
    connections.push({ from: 4, to: 5, color }, { from: 5, to: 6, color }, { from: 6, to: 7, color }, { from: 7, to: 4, color });
    connections.push({ from: 0, to: 4, color }, { from: 1, to: 5, color }, { from: 2, to: 6, color }, { from: 3, to: 7, color });
  }

  return { points, connections };
}
