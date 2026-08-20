// src/components/ExtrusionDieSwellVisualizer.tsx
'use client';
import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Activity, Info } from 'lucide-react';

export function ExtrusionDieSwellVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shearRate, setShearRate] = useState<number>(500); // 1/s (100 - 2000)
  const [dieLDRatio, setDieLDRatio] = useState<number>(10); // L/D (1 - 30)
  const [meltTemp, setMeltTemp] = useState<number>(200); // °C (160 - 260)
  const [mwdType, setMwdType] = useState<'narrow' | 'broad'>('broad'); // Molecular weight distribution

  // Swell ratio calculation: B = D_extrudate / D_die
  // High shear rate -> high elastic energy stored -> higher swell
  // Higher L/D -> longer residence time in die -> more relaxation -> lower swell
  // Higher temp -> faster relaxation -> lower swell
  // Broad MWD -> higher elastic memory -> higher swell
  const mwdFactor = mwdType === 'broad' ? 1.3 : 1.0;
  const shearFactor = Math.pow(shearRate / 500, 0.35);
  const ldFactor = Math.exp(-dieLDRatio / 25);
  const tempFactor = Math.exp(-(meltTemp - 180) / 150);

  const swellRatio = +(1.05 + 0.85 * shearFactor * ldFactor * tempFactor * mwdFactor).toFixed(2);
  const recoverableShearStrain = +(2 * Math.sqrt(Math.max(0, Math.pow(swellRatio, 4) - 1))).toFixed(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Coordinates
      const barrelX = 30;
      const dieEntryX = 140;
      const dieExitX = Math.min(320, dieEntryX + dieLDRatio * 7);
      const dieH = 60; // D_die
      const barrelH = 120;
      const centerY = height / 2;

      // 1. Draw Extruder Barrel & Die Wall
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;

      // Top wall
      ctx.beginPath();
      ctx.moveTo(barrelX, centerY - barrelH / 2);
      ctx.lineTo(dieEntryX, centerY - barrelH / 2);
      ctx.lineTo(dieEntryX, centerY - dieH / 2);
      ctx.lineTo(dieExitX, centerY - dieH / 2);
      ctx.stroke();

      // Bottom wall
      ctx.beginPath();
      ctx.moveTo(barrelX, centerY + barrelH / 2);
      ctx.lineTo(dieEntryX, centerY + barrelH / 2);
      ctx.lineTo(dieEntryX, centerY + dieH / 2);
      ctx.lineTo(dieExitX, centerY + dieH / 2);
      ctx.stroke();

      // Labels on die
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('EXTRUDER BARREL', barrelX + 10, centerY - barrelH / 2 - 8);
      ctx.fillText(`DIE (L/D=${dieLDRatio})`, dieEntryX + 10, centerY - dieH / 2 - 8);
      ctx.fillText('FREE EXTRUDATE (SWELL)', dieExitX + 20, centerY - (dieH * swellRatio) / 2 - 12);

      // 2. Draw Polymer Melt Stream
      const extrudateH = dieH * swellRatio;
      const streamEndX = width - 40;

      ctx.beginPath();
      // In barrel
      ctx.moveTo(barrelX, centerY - barrelH / 2 + 3);
      ctx.lineTo(dieEntryX, centerY - barrelH / 2 + 3);
      ctx.lineTo(dieEntryX, centerY - dieH / 2 + 3);
      // In die
      ctx.lineTo(dieExitX, centerY - dieH / 2 + 3);
      // Die swell curve (exponential transition from dieH to extrudateH)
      ctx.bezierCurveTo(
        dieExitX + 30, centerY - dieH / 2,
        dieExitX + 60, centerY - extrudateH / 2,
        dieExitX + 100, centerY - extrudateH / 2
      );
      ctx.lineTo(streamEndX, centerY - extrudateH / 2);
      ctx.lineTo(streamEndX, centerY + extrudateH / 2);
      ctx.lineTo(dieExitX + 100, centerY + extrudateH / 2);
      ctx.bezierCurveTo(
        dieExitX + 60, centerY + extrudateH / 2,
        dieExitX + 30, centerY + dieH / 2,
        dieExitX, centerY + dieH / 2 - 3
      );
      ctx.lineTo(dieEntryX, centerY + dieH / 2 - 3);
      ctx.lineTo(dieEntryX, centerY + barrelH / 2 - 3);
      ctx.lineTo(barrelX, centerY + barrelH / 2 - 3);
      ctx.closePath();

      const meltGrad = ctx.createLinearGradient(barrelX, centerY, streamEndX, centerY);
      meltGrad.addColorStop(0, '#EF4444');
      meltGrad.addColorStop(0.3, '#F59E0B');
      meltGrad.addColorStop(0.7, '#3B82F6');
      meltGrad.addColorStop(1, '#6366F1');
      ctx.fillStyle = meltGrad;
      ctx.fill();

      // 3. Draw Molecular Chains (Stretched in Die -> Relaxed/Coiled in Swell)
      const numChains = 28;
      const speed = isPlaying ? (shearRate / 400) * 1.5 : 0;
      time += speed;

      for (let i = 0; i < numChains; i++) {
        const chainProgress = ((time * 2 + i * 28) % (streamEndX - barrelX)) + barrelX;
        const normalizedY = (i / numChains) - 0.5;

        let currentH: number;
        let chainShape: 'stretched' | 'recoiled' = 'stretched';

        if (chainProgress < dieEntryX) {
          currentH = barrelH * 0.8;
          chainShape = 'recoiled';
        } else if (chainProgress <= dieExitX) {
          currentH = dieH * 0.8;
          chainShape = 'stretched';
        } else {
          const t = Math.min(1, (chainProgress - dieExitX) / 80);
          currentH = (dieH + (extrudateH - dieH) * t) * 0.8;
          chainShape = t > 0.4 ? 'recoiled' : 'stretched';
        }

        const chainY = centerY + normalizedY * currentH;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        if (chainShape === 'stretched') {
          // Elongated along flow direction
          ctx.ellipse(chainProgress, chainY, 14, 3, 0, 0, Math.PI * 2);
        } else {
          // Entropic coil recoil / spherical coil
          ctx.ellipse(chainProgress, chainY, 7, 7, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      // 4. Dimension Markers
      // Die Diameter D_0
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(dieExitX + 5, centerY - dieH / 2);
      ctx.lineTo(dieExitX + 5, centerY + dieH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(`D₀ = ${dieH}mm`, dieExitX + 8, centerY - dieH / 4);

      // Swelled Diameter D
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(dieExitX + 120, centerY - extrudateH / 2);
      ctx.lineTo(dieExitX + 120, centerY + extrudateH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#FDE047';
      ctx.fillText(`D = ${(dieH * swellRatio).toFixed(1)}mm (Swell B=${swellRatio}x)`, dieExitX + 125, centerY - extrudateH / 4);

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, shearRate, dieLDRatio, meltTemp, mwdType, swellRatio]);

  return (
    <div className="space-y-6">
      {/* Simulation Screen */}
      <div className="border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-slate-950">
        <div className="bg-slate-900 p-4 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-black text-sm uppercase text-white">
              Extrusion Die Swell &amp; Entropic Coil Recovery
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-amber-400 border border-slate-900 text-slate-950 rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:bg-amber-300"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Flow'}
            </button>
            <button
              onClick={() => {
                setShearRate(500);
                setDieLDRatio(10);
                setMeltTemp(200);
                setMwdType('broad');
              }}
              className="p-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white"
              title="Reset parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={760}
          height={320}
          className="w-full h-auto block"
        />
      </div>

      {/* Control Sliders & Physics Readout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="border-4 border-slate-900 bg-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h4 className="font-display font-black text-xs uppercase text-slate-900 border-b-2 border-slate-200 pb-2">
            ⚙️ Processing &amp; Die Geometry Sliders
          </h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Shear Rate (γ̇):</span>
              <span className="text-amber-700">{shearRate} s⁻¹</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={shearRate}
              onChange={(e) => setShearRate(+e.target.value)}
              className="w-full accent-amber-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Die Length-to-Diameter (L/D):</span>
              <span className="text-blue-700">{dieLDRatio}:1</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={dieLDRatio}
              onChange={(e) => setDieLDRatio(+e.target.value)}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span>Melt Temperature:</span>
              <span className="text-red-700">{meltTemp}°C</span>
            </div>
            <input
              type="range"
              min={160}
              max={260}
              step={5}
              value={meltTemp}
              onChange={(e) => setMeltTemp(+e.target.value)}
              className="w-full accent-red-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold">MWD Distribution:</span>
            <div className="flex gap-2">
              {(['narrow', 'broad'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMwdType(mode)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 uppercase ${
                    mwdType === mode
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Mathematical Physics Output */}
        <div className="border-4 border-slate-900 bg-slate-900 text-white p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-black text-xs uppercase text-amber-400 border-b border-slate-800 pb-2 mb-3">
              📊 Tanner Elastic Swell Equations
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                <span>Extrudate Swell Ratio (B = D/D₀):</span>
                <span className="text-xl font-black text-amber-400">{swellRatio}x ({((swellRatio - 1) * 100).toFixed(0)}% swell)</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                <span>Recoverable Shear Strain (γᵣ):</span>
                <span className="text-base font-black text-cyan-400">{recoverableShearStrain}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-200">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Physical Principle:</strong> High shear forces inside the die orient polymer chains. Upon exiting the die into air, unconstrained chains snap back into high-entropy random coils (the Barus effect). Increasing die L/D gives chains more time to relax inside the die, reducing swell.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
