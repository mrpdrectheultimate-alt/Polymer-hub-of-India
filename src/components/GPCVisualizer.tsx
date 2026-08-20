// src/components/GPCVisualizer.tsx
'use client';
import { useRef, useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Activity, Info } from 'lucide-react';

interface PolymerFraction {
  id: number;
  mw: number; // g/mol
  size: 'large' | 'medium' | 'small';
  color: string;
  x: number;
  y: number;
  speed: number;
  eluted: boolean;
  eluteTime: number;
}

export function GPCVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sampleType, setSampleType] = useState<'polydisperse' | 'bimodal' | 'monodisperse'>('polydisperse');
  const [flowRate, setFlowRate] = useState<number>(1.0); // mL/min (0.5 - 2.0)
  const [particles, setParticles] = useState<PolymerFraction[]>([]);

  // Calculate Mn, Mw, PDI for current sample
  const sampleStats = {
    polydisperse: { mn: 45000, mw: 112000, pdi: 2.48 },
    bimodal: { mn: 28000, mw: 145000, pdi: 5.18 },
    monodisperse: { mn: 98000, mw: 102000, pdi: 1.04 },
  }[sampleType];

  const resetSample = () => {
    const newParticles: PolymerFraction[] = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      let mw: number;
      let size: 'large' | 'medium' | 'small';
      let color: string;

      if (sampleType === 'monodisperse') {
        mw = 100000 + (Math.random() - 0.5) * 5000;
        size = 'large';
        color = '#38BDF8';
      } else if (sampleType === 'bimodal') {
        const isHigh = Math.random() > 0.5;
        mw = isHigh ? 180000 + Math.random() * 40000 : 25000 + Math.random() * 15000;
        size = isHigh ? 'large' : 'small';
        color = isHigh ? '#38BDF8' : '#F43F5E';
      } else {
        const rand = Math.random();
        if (rand < 0.3) {
          mw = 180000;
          size = 'large';
          color = '#38BDF8';
        } else if (rand < 0.7) {
          mw = 80000;
          size = 'medium';
          color = '#FBBF24';
        } else {
          mw = 20000;
          size = 'small';
          color = '#F43F5E';
        }
      }

      // Large chains move fast (excluded from pores)
      // Small chains move slow (enter all pores)
      const baseSpeed = size === 'large' ? 1.8 : size === 'medium' ? 1.2 : 0.7;

      newParticles.push({
        id: i,
        mw,
        size,
        color,
        x: 40 + Math.random() * 18,
        y: 60 + Math.random() * 20,
        speed: baseSpeed * flowRate,
        eluted: false,
        eluteTime: 0,
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    resetSample();
  }, [sampleType, flowRate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Dark theme background
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, width, height);

      const splitX = width * 0.44;

      // ── LEFT: GPC CHROMATOGRAPHY COLUMN ──
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('POROUS GEL COLUMN (SEC BEADS)', 15, 25);

      const colLeft = 40;
      const colRight = splitX - 30;
      const colTop = 50;
      const colBottom = height - 40;
      const colW = colRight - colLeft;
      const colH = colBottom - colTop;

      // Column Glass Tube
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(colLeft, colTop, colW, colH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.strokeRect(colLeft, colTop, colW, colH);

      // Draw Porous Gel Packing Beads (Stationary Phase)
      ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;

      const beadRows = 10;
      const beadCols = 3;
      for (let r = 0; r < beadRows; r++) {
        for (let c = 0; c < beadCols; c++) {
          const bx = colLeft + 16 + c * (colW / beadCols);
          const by = colTop + 16 + r * (colH / beadRows);
          ctx.beginPath();
          ctx.arc(bx, by, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Internal pore dots
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(bx - 3, by - 2, 2, 0, Math.PI * 2);
          ctx.arc(bx + 3, by + 3, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
        }
      }

      // Detector cell at column bottom exit
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(colLeft + colW / 2 - 10, colBottom, 20, 15);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('RI DETECTOR', colLeft - 10, colBottom + 28);

      // Move and draw polymer particles
      let activeParticles = false;

      particles.forEach((p) => {
        if (!p.eluted) {
          activeParticles = true;
          if (isPlaying) {
            p.y += p.speed;
          }

          // Check if reached detector
          if (p.y >= colBottom) {
            p.eluted = true;
          }
        }

        // Draw particle coil
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rad = p.size === 'large' ? 6 : p.size === 'medium' ? 4 : 2.5;
        ctx.arc(p.x, Math.min(colBottom, p.y), rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // ── RIGHT: LIVE GPC CHROMATOGRAM & CALIBRATION ──
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('RI CHROMATOGRAM (MW vs RETENTION VOL)', splitX + 20, 25);

      const graphLeft = splitX + 50;
      const graphRight = width - 25;
      const graphTop = 50;
      const graphBottom = height - 50;
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

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('RI Signal (dV)', graphLeft - 5, graphTop - 10);
      ctx.fillText('Retention Volume VR (mL)', graphRight - 130, graphBottom + 25);
      ctx.fillText('← High MW (Fast)      Low MW (Slow) →', graphLeft + 20, graphBottom + 38);

      // Draw Theoretical Molecular Weight Distribution Curves
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = 0; x <= graphW; x += 4) {
        const normX = x / graphW;
        let ri = 0;

        if (sampleType === 'monodisperse') {
          // Narrow single gaussian peak
          ri = Math.exp(-Math.pow((normX - 0.35) / 0.06, 2));
        } else if (sampleType === 'bimodal') {
          // Two distinct peaks
          const peak1 = Math.exp(-Math.pow((normX - 0.28) / 0.08, 2));
          const peak2 = 0.8 * Math.exp(-Math.pow((normX - 0.72) / 0.09, 2));
          ri = peak1 + peak2;
        } else {
          // Standard broad polydisperse bell curve
          ri = Math.exp(-Math.pow((normX - 0.45) / 0.18, 2));
        }

        const gy = graphBottom - ri * (graphH * 0.85);
        if (x === 0) ctx.moveTo(graphLeft + x, gy);
        else ctx.lineTo(graphLeft + x, gy);
      }
      ctx.stroke();

      // Peak Annotations
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 10px monospace';
      if (sampleType === 'bimodal') {
        ctx.fillText('High Mw Peak (180k)', graphLeft + graphW * 0.18, graphTop + 20);
        ctx.fillText('Low Mw Oligomer (25k)', graphLeft + graphW * 0.60, graphTop + 45);
      } else {
        ctx.fillText(`Peak Apex (Mp ~ ${Math.round(sampleStats.mw * 0.9 / 1000)} kDa)`, graphLeft + graphW * 0.30, graphTop + 20);
      }

      if (isPlaying && activeParticles) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, particles, sampleType, flowRate, sampleStats]);

  return (
    <div className="space-y-6">
      {/* Simulation Screen */}
      <div className="border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-slate-950">
        <div className="bg-slate-900 p-4 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <h3 className="font-display font-black text-sm uppercase text-white">
              Gel Permeation Chromatography (GPC/SEC) Separation &amp; Peak Elution
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-sky-400 border border-slate-900 text-slate-950 rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:bg-sky-300"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={resetSample}
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-Inject Sample
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

      {/* Control Panel & Molecular Weight Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="border-4 border-slate-900 bg-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h4 className="font-display font-black text-xs uppercase text-slate-900 border-b-2 border-slate-200 pb-2">
            🧪 Sample Injection &amp; Pump Flow Controls
          </h4>

          <div>
            <span className="text-xs font-mono font-bold block mb-2">Select Polymer Sample:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'polydisperse', label: 'Commercial Resin (PDI ~ 2.5)' },
                { id: 'bimodal', label: 'Bimodal Blow Grade' },
                { id: 'monodisperse', label: 'Anionic PS Standard' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSampleType(s.id as 'polydisperse' | 'bimodal' | 'monodisperse')}
                  className={`p-2 text-left rounded-lg border-2 font-mono text-[10px] font-bold transition-all ${
                    sampleType === s.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Eluent Flow Rate:</span>
              <span className="text-sky-700">{flowRate.toFixed(1)} mL/min (THF)</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={flowRate}
              onChange={(e) => setFlowRate(+e.target.value)}
              className="w-full accent-sky-600"
            />
          </div>
        </div>

        {/* Live GPC Quantitative Readout */}
        <div className="border-4 border-slate-900 bg-slate-900 text-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-black text-xs uppercase text-sky-400 border-b border-slate-800 pb-2 mb-3">
              📊 Molecular Weight Distribution Readout
            </h4>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
                <span className="text-[9px] text-slate-400 block uppercase">Number-Avg (Mn)</span>
                <span className="text-base font-black text-emerald-400">{(sampleStats.mn / 1000).toFixed(1)} kDa</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
                <span className="text-[9px] text-slate-400 block uppercase">Weight-Avg (Mw)</span>
                <span className="text-base font-black text-sky-400">{(sampleStats.mw / 1000).toFixed(1)} kDa</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
                <span className="text-[9px] text-slate-400 block uppercase">Polydispersity (PDI)</span>
                <span className="text-base font-black text-amber-400">{sampleStats.pdi}</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-950/40 border border-sky-500/30 p-3 rounded-xl flex items-start gap-2 text-[11px] text-sky-200">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Size Exclusion Principle:</strong> GPC columns are packed with porous crosslinked polystyrene beads. <em>Large chains</em> cannot fit into the internal pores and flow rapidly around the beads (eluting first). <em>Small chains</em> penetrate deep into pores, taking longer to navigate (eluting last).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
