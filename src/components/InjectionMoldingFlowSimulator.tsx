// src/components/InjectionMoldingFlowSimulator.tsx
'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

type GatePos = 'top' | 'center' | 'end';

export function InjectionMoldingFlowSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef(0);
  const runRef = useRef(false);
  const gateRef = useRef<GatePos>('center');
  const speedRef = useRef(50);
  const meltTRef = useRef(230);
  const moldTRef = useRef(40);

  const [fillProgress, setFillProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gatePosition, setGatePosition] = useState<GatePos>('center');
  const [meltTemp, setMeltTemp] = useState(230);
  const [moldTemp, setMoldTemp] = useState(40);
  const [injectionSpeed, setInjectionSpeed] = useState(50);

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

      const mx = 80, my = 60, mw = 440, mh = 260;
      const fp = fillRef.current / 100;
      const gate = gateRef.current;

      // Solidified skin layer
      if (fp > 0.1) {
        const skinT = Math.max(2, (moldTRef.current < 60 ? 8 : 4));
        ctx.fillStyle = 'rgba(100,116,139,0.5)';
        ctx.fillRect(mx, my, mw, skinT);
        ctx.fillRect(mx, my + mh - skinT, mw, skinT);
        ctx.fillRect(mx, my, skinT, mh);
        ctx.fillRect(mx + mw - skinT, my, skinT, mh);
      }

      // Melt fill
      let fillGrad: CanvasGradient;
      if (gate === 'top') {
        const fillH = fp * mh;
        fillGrad = ctx.createLinearGradient(mx, my, mx, my + mh);
        fillGrad.addColorStop(0, 'rgba(239,68,68,0.85)');
        fillGrad.addColorStop(1, 'rgba(239,68,68,0.15)');
        ctx.fillStyle = fillGrad;
        ctx.fillRect(mx + 4, my + 4, mw - 8, fillH - 8);
      } else if (gate === 'end') {
        const fillW = fp * mw;
        fillGrad = ctx.createLinearGradient(mx, my, mx + mw, my);
        fillGrad.addColorStop(0, 'rgba(239,68,68,0.85)');
        fillGrad.addColorStop(1, 'rgba(239,68,68,0.15)');
        ctx.fillStyle = fillGrad;
        ctx.fillRect(mx + 4, my + 4, fillW - 8, mh - 8);
      } else {
        // Center gate - radial fill
        const radius = fp * Math.sqrt(mw * mw + mh * mh) * 0.55;
        const gx = mx + mw / 2, gy = my + mh / 2;
        fillGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius);
        fillGrad.addColorStop(0, 'rgba(239,68,68,0.9)');
        fillGrad.addColorStop(0.6, 'rgba(239,68,68,0.6)');
        fillGrad.addColorStop(1, 'rgba(239,68,68,0.1)');
        ctx.save();
        ctx.beginPath(); ctx.rect(mx + 4, my + 4, mw - 8, mh - 8); ctx.clip();
        ctx.beginPath(); ctx.arc(gx, gy, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillGrad; ctx.fill(); ctx.restore();
      }

      // Mold outline
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3;
      ctx.strokeRect(mx, my, mw, mh);

      // Weld line (center gate has lowest weld risk; top/end have high risk)
      const weldRisk = gate === 'center' ? 15 : 65;
      if (fp > 0.5 && gate !== 'center') {
        ctx.strokeStyle = 'rgba(239,68,68,' + Math.min(0.9, (fp - 0.5) * 2) + ')';
        ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        const wx = gate === 'end' ? mx + mw / 2 : mx + mw / 2;
        const wy1 = my + mh * 0.3, wy2 = my + mh * 0.7;
        ctx.beginPath(); ctx.moveTo(wx, wy1); ctx.lineTo(wx, wy2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(239,68,68,0.8)'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText('\u26A0 Weld Line', wx, wy1 - 8);
        ctx.textAlign = 'left';
      }

      // Gate marker
      let gx2 = mx + mw/2, gy2 = my;
      if (gate === 'center') { gx2 = mx + mw/2; gy2 = my + mh/2; }
      else if (gate === 'end') { gx2 = mx; gy2 = my + mh/2; }
      ctx.beginPath(); ctx.arc(gx2, gy2, 9, 0, Math.PI*2);
      ctx.fillStyle = '#FBBF24'; ctx.fill();
      ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center';
      ctx.fillText('G', gx2, gy2 + 3); ctx.textAlign = 'left';

      // Stats
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px monospace';
      ctx.fillText('Fill: ' + Math.round(fillRef.current) + '%', 12, 22);
      ctx.fillText('Melt Temp: ' + meltTRef.current + '\u00b0C', 12, 40);
      ctx.fillText('Mold Temp: ' + moldTRef.current + '\u00b0C', 12, 58);
      ctx.fillText('Speed: ' + speedRef.current + '%', 12, 76);
      const pressureDrop = (fillRef.current / 100) * 55 * (speedRef.current / 50) * (280 / Math.max(meltTRef.current, 150));
      ctx.fillText('Pressure Drop: ' + pressureDrop.toFixed(1) + ' MPa', 12, 94);
      ctx.fillStyle = weldRisk > 40 ? '#F87171' : '#22C55E';
      ctx.fillText('Weld Line Risk: ' + weldRisk + '%', 12, 112);

      if (runRef.current && fillRef.current < 100) {
        fillRef.current += 0.4 * (speedRef.current / 50);
        setFillProgress(Math.round(fillRef.current));
      } else if (fillRef.current >= 100) {
        runRef.current = false;
        setIsRunning(false);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const start = useCallback(() => {
    fillRef.current = 0;
    setFillProgress(0);
    runRef.current = true;
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    runRef.current = false;
    fillRef.current = 0;
    setFillProgress(0);
    setIsRunning(false);
  }, []);

  return (
    <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-xl font-black font-display uppercase mb-1">🏭 Injection Molding Flow Simulator</h2>
      <p className="text-xs text-slate-500 mb-4">Visualize melt front propagation, gate positioning, and weld line risk in injection molding.</p>
      <canvas ref={canvasRef} width={600} height={360} className="w-full border-2 border-slate-900 rounded-xl bg-slate-950" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
        <div>
          <label className="text-xs font-bold block mb-1">Gate Position</label>
          <select className="w-full border-2 border-slate-900 rounded-xl p-2 text-xs font-mono bg-white" value={gatePosition} onChange={e => { const v = e.target.value as GatePos; setGatePosition(v); gateRef.current = v; }}>
            <option value="top">Top Gate</option>
            <option value="center">Center Gate</option>
            <option value="end">End Gate</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Melt Temp: {meltTemp}&#176;C</label>
          <input type="range" min={180} max={320} value={meltTemp} onChange={e => { const v = Number(e.target.value); setMeltTemp(v); meltTRef.current = v; }} className="w-full accent-red-500" />
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Mold Temp: {moldTemp}&#176;C</label>
          <input type="range" min={20} max={120} value={moldTemp} onChange={e => { const v = Number(e.target.value); setMoldTemp(v); moldTRef.current = v; }} className="w-full accent-amber-500" />
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Speed: {injectionSpeed}%</label>
          <input type="range" min={10} max={100} value={injectionSpeed} onChange={e => { const v = Number(e.target.value); setInjectionSpeed(v); speedRef.current = v; }} className="w-full accent-blue-600" />
        </div>
        <div className="flex items-end gap-2 col-span-2 sm:col-span-1">
          <button onClick={start} disabled={isRunning} className="flex-1 px-3 py-2 bg-blue-600 text-white border-2 border-slate-900 rounded-xl font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">&#9654; Start</button>
          <button onClick={reset} className="flex-1 px-3 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">&#8635; Reset</button>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs font-mono text-slate-500 mb-1"><span>Fill Progress</span><span>{fillProgress}%</span></div>
        <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300"><div className="bg-red-500 h-3 rounded-full transition-all duration-100" style={{width: fillProgress + '%'}} /></div>
      </div>
      <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
        <p className="text-xs text-slate-600 leading-relaxed"><strong>How it works:</strong> Gate position determines the flow pattern and where weld lines form. Center gating produces radial fill with minimal weld lines. End/top gating creates linear fill fronts that can merge and form weld lines. Higher melt temp reduces pressure drop; higher injection speed fills faster but increases shear stress.</p>
      </div>
    </div>
  );
}
