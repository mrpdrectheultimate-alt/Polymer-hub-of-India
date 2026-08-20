// src/components/ShearThinningVisualizer.tsx
'use client';
import { useRef, useEffect, useState } from 'react';

export function ShearThinningVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const srRef = useRef(10);
  const tempRef = useRef(200);
  const mwRef = useRef(100);
  const [shearRate, setShearRate] = useState(10);
  const [temperature, setTemperature] = useState(200);
  const [molecularWeight, setMolecularWeight] = useState(100);
  const [viscosity, setViscosity] = useState(0);
  const [region, setRegion] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Graph (left) ---
      const gx = 40, gy = 50, gw = 240, gh = 220;
      ctx.fillStyle = '#111827';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy+gh); ctx.lineTo(gx+gw, gy+gh); ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '9px monospace';
      ctx.textAlign = 'center'; ctx.fillText('log Shear Rate (1/s)', gx + gw/2, gy+gh+20);
      ctx.save(); ctx.translate(gx-28, gy+gh/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('log Viscosity (Pa\xB7s)', 0, 0); ctx.restore();
      ctx.textAlign = 'left';

      const zeroShear = (mwRef.current * 2.5) * (260 / Math.max(tempRef.current, 100));
      const critShear = Math.max(0.1, 100 - mwRef.current * 0.3);

      ctx.beginPath();
      const pts = 80;
      for (let i = 0; i <= pts; i++) {
        const logSR = (i / pts) * 5;
        const sr = Math.pow(10, logSR);
        const visc = sr < critShear ? zeroShear : zeroShear * Math.pow(critShear / sr, 0.78);
        const x = gx + 10 + (logSR / 5) * (gw - 20);
        const y = gy + gh - 10 - (Math.min(visc, zeroShear * 1.2) / (zeroShear * 1.2)) * (gh - 20);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#F97316'; ctx.lineWidth = 2.5; ctx.stroke();

      // Current point
      const curSR = srRef.current;
      const curVisc = curSR < critShear ? zeroShear : zeroShear * Math.pow(critShear / curSR, 0.78);
      const logCur = Math.log10(Math.max(curSR, 0.1));
      const cx = gx + 10 + (logCur / 5) * (gw - 20);
      const cy = gy + gh - 10 - (Math.min(curVisc, zeroShear*1.2) / (zeroShear*1.2)) * (gh - 20);
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI*2);
      ctx.fillStyle = '#FBBF24'; ctx.fill();
      ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke();

      setViscosity(Math.round(curVisc));
      const r = curSR < critShear * 0.5 ? 'Newtonian Plateau' : curSR < critShear * 3 ? 'Transition Zone' : 'Power-Law (Shear-Thinning)';
      setRegion(r);

      // --- Chain visualization (right) ---
      const chainX = 310, chainY = 50, chainW = 260, chainH = 220;
      ctx.fillStyle = '#111827';
      ctx.fillRect(chainX, chainY, chainW, chainH);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
      ctx.strokeRect(chainX, chainY, chainW, chainH);

      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(curSR < critShear ? 'Entangled coils (low shear)' : 'Aligned chains (high shear)', chainX + chainW/2, chainY + chainH + 18);
      ctx.textAlign = 'left';

      const alignment = Math.min(1, curSR / (critShear * 4));
      const numChains = 10;
      for (let i = 0; i < numChains; i++) {
        const baseY = chainY + 20 + i * (chainH - 40) / numChains;
        ctx.beginPath();
        const segs = 8;
        for (let j = 0; j <= segs; j++) {
          const xp = chainX + 15 + (j / segs) * (chainW - 30);
          const yp = baseY + (1 - alignment) * 18 * Math.sin(j * 1.4 + i * 0.7 + Date.now() * 0.001);
          if (j === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        ctx.strokeStyle = 'rgba(29,78,216,' + (0.3 + 0.7 * alignment) + ')';
        ctx.lineWidth = 2; ctx.stroke();
      }

      // Stats
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px monospace';
      ctx.fillText('Shear Rate: ' + srRef.current + ' 1/s', 40, 310);
      ctx.fillText('Viscosity:  ' + Math.round(curVisc) + ' Pa\xB7s', 40, 328);
      ctx.fillText('Temp: ' + tempRef.current + '\u00b0C    MW: ' + mwRef.current + ' kDa', 40, 346);
      ctx.fillStyle = curSR < critShear ? '#22C55E' : '#F97316';
      ctx.fillText(r, 40, 366);

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-xl font-black font-display uppercase mb-1">📊 Shear Thinning Visualizer</h2>
      <p className="text-xs text-slate-500 mb-4">Slide the shear rate to watch polymer chains align and viscosity drop. The left graph shows the flow curve; right shows chain orientation.</p>
      <canvas ref={canvasRef} width={600} height={390} className="w-full border-2 border-slate-900 rounded-xl bg-slate-950" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div>
          <label className="text-xs font-bold block mb-1">Shear Rate: {shearRate} 1/s</label>
          <input type="range" min={0.1} max={1000} step={0.5} value={shearRate} onChange={e => { const v = Number(e.target.value); setShearRate(v); srRef.current = v; }} className="w-full accent-orange-600" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5"><span>0.1 (slow)</span><span>1000 (fast)</span></div>
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Temperature: {temperature}&#176;C</label>
          <input type="range" min={100} max={320} value={temperature} onChange={e => { const v = Number(e.target.value); setTemperature(v); tempRef.current = v; }} className="w-full accent-red-500" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5"><span>100&#176;C</span><span>320&#176;C</span></div>
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Mol. Weight: {molecularWeight} kDa</label>
          <input type="range" min={20} max={500} value={molecularWeight} onChange={e => { const v = Number(e.target.value); setMolecularWeight(v); mwRef.current = v; }} className="w-full accent-blue-600" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5"><span>20 kDa</span><span>500 kDa</span></div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex-1 border-2 border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
          <div className="font-mono text-lg font-black text-orange-600">{viscosity} Pa&#xB7;s</div>
          <div className="text-[9px] font-mono text-slate-500 uppercase">Viscosity</div>
        </div>
        <div className="flex-1 border-2 border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
          <div className="font-mono text-sm font-black text-blue-700">{region}</div>
          <div className="text-[9px] font-mono text-slate-500 uppercase">Flow Region</div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
        <p className="text-xs text-slate-600 leading-relaxed"><strong>How it works:</strong> At low shear rates polymers show Newtonian behavior (constant viscosity). As shear rate increases, entangled chains align in the flow direction and disentangle — dramatically lowering viscosity. Higher MW and lower temperature raise the zero-shear viscosity plateau.</p>
      </div>
    </div>
  );
}
