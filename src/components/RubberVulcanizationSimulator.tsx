// src/components/RubberVulcanizationSimulator.tsx
'use client';
import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Flame, Info } from 'lucide-react';

export function RubberVulcanizationSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sulfurPhr, setSulfurPhr] = useState<number>(2.5); // phr (0.5 - 5.0)
  const [temp, setTemp] = useState<number>(150); // °C (130 - 180)
  const [accType, setAccType] = useState<'semi-ev' | 'conventional' | 'ev'>('conventional');
  const [cureTimeMin, setCureTimeMin] = useState<number>(12); // minutes (0 - 30)

  // MDR Rheometer Parameters
  // ML: Min torque (viscosity of unvulcanized compound)
  // MH: Max torque (elastic modulus at plateau)
  // ts2: Scorch safety time (min)
  // t90: Optimum cure time (min)
  const ML = 1.8; // dN.m
  const MH = +(ML + sulfurPhr * 6.5 * (accType === 'ev' ? 1.2 : 1.0)).toFixed(1);
  const ts2 = +(Math.max(0.8, (220 - temp) * 0.08 * (accType === 'conventional' ? 1.0 : 0.65))).toFixed(1);
  const t90 = +(ts2 + (200 - temp) * 0.18 / (sulfurPhr * 0.4)).toFixed(1);

  // Cross-link density calculation as a function of time
  let cureFraction = 0;
  if (cureTimeMin > ts2) {
    cureFraction = Math.min(1.0, (cureTimeMin - ts2) / Math.max(0.1, t90 - ts2));
  }
  // Reversion if overcured above 160°C and conventional sulfur
  if (cureTimeMin > t90 * 1.4 && temp > 160 && accType === 'conventional') {
    const overTime = cureTimeMin - t90 * 1.4;
    cureFraction = Math.max(0.6, cureFraction - overTime * 0.03);
  }

  const currentTorque = +(ML + (MH - ML) * cureFraction).toFixed(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, width, height);

      // Split canvas: Left = Molecular Network, Right = MDR Cure Curve
      const splitX = width * 0.52;

      // Divider line
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 10);
      ctx.lineTo(splitX, height - 10);
      ctx.stroke();

      // ── LEFT: MOLECULAR NETWORK ANIMATION ──
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('POLYISOPRENE CHAINS & SULFUR BRIDGES (-Sₓ-)', 20, 25);

      const numChains = 6;
      const chainYSpacing = (height - 70) / numChains;
      frame += isPlaying ? 0.03 : 0;

      // Draw Rubber Backbone Chains
      for (let i = 0; i < numChains; i++) {
        const baseY = 55 + i * chainYSpacing;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();

        for (let x = 20; x < splitX - 20; x += 5) {
          const wave = Math.sin(x * 0.04 + frame + i * 1.5) * (12 * (1.1 - cureFraction * 0.8));
          if (x === 20) ctx.moveTo(x, baseY + wave);
          else ctx.lineTo(x, baseY + wave);
        }
        ctx.stroke();
      }

      // Draw Sulfur Cross-links (-S-S- Bridges)
      const numBridges = Math.floor(cureFraction * 22);
      ctx.strokeStyle = '#FACC15'; // Yellow for sulfur
      ctx.fillStyle = '#FACC15';
      ctx.lineWidth = 2.5;

      for (let b = 0; b < numBridges; b++) {
        const chainA = (b * 2) % (numChains - 1);
        const chainB = chainA + 1;
        const xPos = 40 + ((b * 37) % (splitX - 80));

        const y1 = 55 + chainA * chainYSpacing + Math.sin(xPos * 0.04 + frame + chainA * 1.5) * (12 * (1.1 - cureFraction * 0.8));
        const y2 = 55 + chainB * chainYSpacing + Math.sin(xPos * 0.04 + frame + chainB * 1.5) * (12 * (1.1 - cureFraction * 0.8));

        ctx.beginPath();
        ctx.moveTo(xPos, y1);
        ctx.lineTo(xPos, y2);
        ctx.stroke();

        // Sulfur atoms (beads) along the bridge
        ctx.beginPath();
        ctx.arc(xPos, (y1 + y2) / 2 - 4, 3, 0, Math.PI * 2);
        ctx.arc(xPos, (y1 + y2) / 2 + 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // State label
      ctx.fillStyle = cureFraction > 0.85 ? '#34D399' : cureFraction > 0.2 ? '#FBBF24' : '#F87171';
      ctx.font = 'bold 12px monospace';
      const stateText = cureFraction > 0.85
        ? 'ELASTIC NETWORK (CURED RUBBER)'
        : cureFraction > 0.1
        ? 'CROSSLINKING IN PROGRESS...'
        : 'UNVULCANIZED RAW GUM (VISCOUS)';
      ctx.fillText(stateText, 20, height - 20);

      // ── RIGHT: MOVING DIE RHEOMETER (MDR) CURE CURVE ──
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('MDR CURE CURVE (TORQUE vs TIME)', splitX + 20, 25);

      const graphLeft = splitX + 45;
      const graphRight = width - 25;
      const graphTop = 50;
      const graphBottom = height - 40;
      const graphW = graphRight - graphLeft;
      const graphH = graphBottom - graphTop;

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphLeft, graphTop);
      ctx.lineTo(graphLeft, graphBottom);
      ctx.lineTo(graphRight, graphBottom);
      ctx.stroke();

      // Axis labels
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Torque (dN·m)', graphLeft - 5, graphTop - 10);
      ctx.fillText('Time (min)', graphRight - 55, graphBottom + 25);

      // Plot Theoretical Cure Curve
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const maxTimeGraph = 30;
      const maxTorqueGraph = 40;

      for (let t = 0; t <= maxTimeGraph; t += 0.5) {
        let f = 0;
        if (t > ts2) f = Math.min(1.0, (t - ts2) / Math.max(0.1, t90 - ts2));
        if (t > t90 * 1.4 && temp > 160 && accType === 'conventional') {
          f = Math.max(0.6, f - (t - t90 * 1.4) * 0.03);
        }
        const torq = ML + (MH - ML) * f;

        const gx = graphLeft + (t / maxTimeGraph) * graphW;
        const gy = graphBottom - (torq / maxTorqueGraph) * graphH;

        if (t === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // Current Time Needle
      const currentGx = graphLeft + (cureTimeMin / maxTimeGraph) * graphW;
      const currentGy = graphBottom - (currentTorque / maxTorqueGraph) * graphH;

      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(currentGx, graphTop);
      ctx.lineTo(currentGx, graphBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Needle point dot
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(currentGx, currentGy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Critical Points Annotation (ML, ts2, t90, MH)
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '9px monospace';
      ctx.fillText(`M_L: ${ML}`, graphLeft + 5, graphBottom - (ML / maxTorqueGraph) * graphH - 6);
      ctx.fillText(`M_H: ${MH}`, graphRight - 55, graphBottom - (MH / maxTorqueGraph) * graphH - 6);
      ctx.fillText(`ts2: ${ts2}m`, graphLeft + (ts2 / maxTimeGraph) * graphW - 10, graphBottom + 12);
      ctx.fillText(`t90: ${t90}m`, graphLeft + (t90 / maxTimeGraph) * graphW - 10, graphBottom + 12);

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, sulfurPhr, temp, accType, cureTimeMin, cureFraction, currentTorque, ML, MH, ts2, t90]);

  return (
    <div className="space-y-6">
      {/* Simulation Screen */}
      <div className="border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-slate-950">
        <div className="bg-slate-900 p-4 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-black text-sm uppercase text-white">
              Sulfur Vulcanization Kinetics &amp; MDR Rheometer Curve
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-amber-400 border border-slate-900 text-slate-950 rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:bg-amber-300"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Animate'}
            </button>
            <button
              onClick={() => {
                setSulfurPhr(2.5);
                setTemp(150);
                setAccType('conventional');
                setCureTimeMin(12);
              }}
              className="p-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white"
              title="Reset formulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={780}
          height={330}
          className="w-full h-auto block"
        />
      </div>

      {/* Control Sliders & Rheology Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="border-4 border-slate-900 bg-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h4 className="font-display font-black text-xs uppercase text-slate-900 border-b-2 border-slate-200 pb-2">
            🧪 Vulcanization Formulation &amp; Thermal Sliders
          </h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Sulfur Loading:</span>
              <span className="text-yellow-700">{sulfurPhr} phr</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={sulfurPhr}
              onChange={(e) => setSulfurPhr(+e.target.value)}
              className="w-full accent-yellow-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Cure Temperature:</span>
              <span className="text-red-700">{temp}°C</span>
            </div>
            <input
              type="range"
              min={130}
              max={180}
              step={2}
              value={temp}
              onChange={(e) => setTemp(+e.target.value)}
              className="w-full accent-red-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Vulcanization Time in Mold:</span>
              <span className="text-indigo-700">{cureTimeMin} min</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={cureTimeMin}
              onChange={(e) => setCureTimeMin(+e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold">Cure System:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'conventional', label: 'Conventional' },
                { id: 'semi-ev', label: 'Semi-EV' },
                { id: 'ev', label: 'EV (High Mod)' },
              ].map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => setAccType(sys.id as 'semi-ev' | 'conventional' | 'ev')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border-2 uppercase ${
                    accType === sys.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {sys.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Rheometer Kinetics Readout */}
        <div className="border-4 border-slate-900 bg-slate-900 text-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-black text-xs uppercase text-amber-400 border-b border-slate-800 pb-2 mb-3">
              📈 ASTM D5289 MDR Rheometer Parameters
            </h4>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Scorch Time (ts2):</span>
                <span className="text-base font-black text-amber-400">{ts2} min</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Optimum Cure (t90):</span>
                <span className="text-base font-black text-emerald-400">{t90} min</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Min Torque (ML):</span>
                <span className="text-base font-black text-cyan-400">{ML} dN·m</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Max Torque (MH):</span>
                <span className="text-base font-black text-pink-400">{MH} dN·m</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-200">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Physical Principle:</strong> Sulfur reacts with allylic hydrogens forming polysulfidic (-Sₓ-) bridges between polyisoprene chains, raising shear modulus (Torque MH). Higher temperatures speed up curing exponentially (Arrhenius kinetics) but increase reversion risk in conventional systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
