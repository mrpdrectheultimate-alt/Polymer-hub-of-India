// src/lib/product-generator.ts

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

export interface ProductData {
  points: Point3D[];
  connections: Connection[];
}

export function generateCylinder(
  points: Point3D[],
  connections: Connection[],
  yStart: number,
  yEnd: number,
  radius: number,
  segments: number,
  color: string,
  width: number = 1
) {
  const steps = 5;
  for (let s = 0; s <= steps; s++) {
    const y = yStart + (s / steps) * (yEnd - yStart);
    const ringOffset = points.length;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push({ x, y, z, color, radius: 1.5 });

      // Connect ring
      connections.push({
        from: ringOffset + i,
        to: ringOffset + ((i + 1) % segments),
        color,
        width,
      });

      // Connect longitudinal lines
      if (s > 0) {
        connections.push({
          from: ringOffset + i - segments,
          to: ringOffset + i,
          color: 'rgba(255, 255, 255, 0.15)',
          width: 0.5,
        });
      }
    }
  }
}

export function generateTorus(
  points: Point3D[],
  connections: Connection[],
  majorRadius: number,
  minorRadius: number,
  rSegments: number,
  tSegments: number,
  color: string
) {
  for (let r = 0; r < rSegments; r++) {
    const rAngle = (r / rSegments) * Math.PI * 2;
    const ringOffset = points.length;

    for (let t = 0; t < tSegments; t++) {
      const tAngle = (t / tSegments) * Math.PI * 2;
      const x = (majorRadius + minorRadius * Math.cos(tAngle)) * Math.cos(rAngle);
      const z = (majorRadius + minorRadius * Math.cos(tAngle)) * Math.sin(rAngle);
      const y = minorRadius * Math.sin(tAngle);

      points.push({ x, y, z, color, radius: 1.5 });

      // Connect minor ring
      connections.push({
        from: ringOffset + t,
        to: ringOffset + ((t + 1) % tSegments),
        color,
        width: 1,
      });

      // Connect major ring
      if (r > 0) {
        connections.push({
          from: ringOffset + t - tSegments,
          to: ringOffset + t,
          color: 'rgba(255, 255, 255, 0.15)',
          width: 1,
        });
      }
    }
  }
  // Connect last ring to first
  const firstRingOffset = 0;
  const lastRingOffset = points.length - tSegments;
  for (let t = 0; t < tSegments; t++) {
    connections.push({
      from: lastRingOffset + t,
      to: firstRingOffset + t,
      color: 'rgba(255, 255, 255, 0.15)',
      width: 1,
    });
  }
}

export function getProductData(name: string): ProductData {
  const points: Point3D[] = [];
  const connections: Connection[] = [];
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normalized.includes('bottle')) {
    // Water Bottle (Cylinder stack with shoulder)
    const segments = 12;
    const rings = [
      { y: -70, r: 8, color: '#3B82F6' },
      { y: -60, r: 8, color: '#3B82F6' },
      { y: -59, r: 12, color: '#60A5FA' },
      { y: -45, r: 10, color: '#60A5FA' },
      { y: -25, r: 22, color: '#60A5FA' },
      { y: 0, r: 25, color: '#60A5FA' },
      { y: 35, r: 25, color: '#60A5FA' },
      { y: 55, r: 22, color: '#60A5FA' },
      { y: 60, r: 16, color: '#3B82F6' },
    ];
    rings.forEach((ring, rIdx) => {
      const ptOffset = points.length;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push({
          x: Math.cos(angle) * ring.r,
          y: ring.y,
          z: Math.sin(angle) * ring.r,
          color: ring.color,
          radius: 2,
        });
        connections.push({
          from: ptOffset + i,
          to: ptOffset + ((i + 1) % segments),
          color: ring.color,
          width: 1,
        });
        if (rIdx > 0) {
          connections.push({
            from: ptOffset + i - segments,
            to: ptOffset + i,
            color: 'rgba(96, 165, 250, 0.3)',
            width: 1,
          });
        }
      }
    });
  } else if (normalized.includes('bumper')) {
    // Bumper curve
    const widthSteps = 12;
    const heightSteps = 4;
    for (let h = 0; h < heightSteps; h++) {
      const ptOffset = points.length;
      const y = -15 + (h / (heightSteps - 1)) * 30;
      for (let w = 0; w < widthSteps; w++) {
        const angle = (w / (widthSteps - 1)) * Math.PI;
        points.push({
          x: Math.cos(angle) * 80,
          y,
          z: -Math.sin(angle) * 35,
          color: '#EF4444',
          radius: 2,
        });
        if (w > 0) {
          connections.push({
            from: ptOffset + w - 1,
            to: ptOffset + w,
            color: '#EF4444',
            width: 1.5,
          });
        }
        if (h > 0) {
          connections.push({
            from: ptOffset + w - widthSteps,
            to: ptOffset + w,
            color: 'rgba(239, 68, 68, 0.4)',
            width: 1,
          });
        }
      }
    }
  } else if (normalized.includes('pipe') || normalized.includes('tubing') || normalized.includes('hose')) {
    // Hollow Pipe (Double-layered cylinder)
    generateCylinder(points, connections, -80, 80, 24, 12, '#3B82F6', 1.5);
    generateCylinder(points, connections, -80, 80, 20, 12, '#1E3A8A', 1);
  } else if (normalized.includes('syringe')) {
    // Syringe
    generateCylinder(points, connections, -60, 40, 12, 10, '#94A3B8', 1); // Barrel
    generateCylinder(points, connections, -85, -60, 4, 8, '#3B82F6', 1.5); // Plunger shaft
    generateCylinder(points, connections, 40, 75, 1.5, 6, '#475569', 1.5); // Needle
  } else if (normalized.includes('gear') || normalized.includes('cogwheel')) {
    // Gear with teeth
    const segments = 24;
    const innerR = 18;
    const outerR = 25;
    const width = 10;
    const color = '#64748B';

    for (let side = -1; side <= 1; side += 2) {
      const y = side * width;
      const ptOffset = points.length;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = i % 2 === 0 ? outerR : innerR;
        points.push({
          x: Math.cos(angle) * r,
          y,
          z: Math.sin(angle) * r,
          color,
          radius: 2,
        });

        // Ring connection
        connections.push({
          from: ptOffset + i,
          to: ptOffset + ((i + 1) % segments),
          color,
          width: 1.5,
        });
      }
      if (side === 1) {
        // Connect sides
        for (let i = 0; i < segments; i++) {
          connections.push({
            from: ptOffset - segments + i,
            to: ptOffset + i,
            color: 'rgba(100, 116, 139, 0.4)',
            width: 1,
          });
        }
      }
    }
  } else if (normalized.includes('helmet') || normalized.includes('eyeglass') || normalized.includes('lens')) {
    // Hemisphere dome (safety helmet)
    const rings = 6;
    const sectors = 12;
    const r = 40;
    for (let lat = 0; lat < rings; lat++) {
      const phi = (lat / (rings - 1)) * (Math.PI / 2);
      const ringOffset = points.length;
      for (let lon = 0; lon < sectors; lon++) {
        const theta = (lon / sectors) * Math.PI * 2;
        points.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: -r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.sin(theta),
          color: '#FBBF24',
          radius: 1.5,
        });
        connections.push({
          from: ringOffset + lon,
          to: ringOffset + ((lon + 1) % sectors),
          color: '#FBBF24',
          width: 1,
        });
        if (lat > 0) {
          connections.push({
            from: ringOffset + lon - sectors,
            to: ringOffset + lon,
            color: 'rgba(251, 191, 36, 0.4)',
            width: 1,
          });
        }
      }
    }
  } else if (normalized.includes('tire') || normalized.includes('gasket')) {
    // Torus (Rubber Tire)
    generateTorus(points, connections, 35, 12, 16, 8, '#334155');
  } else {
    // Generic Box or Cylinder representation for basic items (packaging films, pallets, etc.)
    const segments = 12;
    generateCylinder(points, connections, -50, 50, 18, segments, '#10B981', 1);
  }

  return { points, connections };
}
