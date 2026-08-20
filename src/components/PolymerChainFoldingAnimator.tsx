// src/components/PolymerChainFoldingAnimator.tsx
'use client';
import { useRef, useEffect, useState } from 'react';

interface Segment { baseX: number; baseY: number; foldProgress: number; }

export function PolymerChainFoldingAnimator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segRef = useRef<Segment[]>([]);
  const rateRef = useRef(50);
  const runRef = useRef(true);
  const crystallRef = useRef(0);
  const [coolingRate, setCoolingRate] = useState(50);
  const [crystallinity, setCrystallinity] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const segs: Segment[] = [];
    for (let i = 0; i < 32; i++) {
      segs.push({ baseX: 20 + i * 17, baseY: 200 + Math.sin(i * 0.7) * 30 + Math.random() * 20 - 10, foldProgress: 0 });
    }
    segRef.current = segs;
  }, []);

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

      const segs = segRef.current;
      const cryst = crystallRef.current;

      // Draw lamellar region
      if (cryst > 10) {
        ctx.fillStyle = 'rgba(34,197,94,0.07)';
        ctx.fillRect(20, 140, canvas.width - 40, 80);
        ctx.strokeStyle = 'rgba(34,197,94,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 140, canvas.width - 40, 80);
        ctx.fillStyle = 'rgba(34,197,94,0.4)';
        ctx.font = '9px monospace';
        ctx.fillText('CRYSTALLINE LAMELLA', 24, 155);
      }

      // Draw chain segments
      segs.forEach((seg, i) => {
        const fp = seg.foldProgress;
        const amorphX = seg.baseX;
        const amorphY = seg.baseY;
        const crystY = 160 + Math.sin(i * 0.5) * 10;
        const x = amorphX;
        const y = amorphY + fp * (crystY - amorphY);
        const color = fp < 0.5 ? 'rgba(124,58,237,' + (0.4 + fp * 0.6) + ')' : 'rgba(34,197,94,' + fp + ')';
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
        if (i < segs.length - 1) {
          const nx = segs[i+1].baseX;
          const nfp = segs[i+1].foldProgress;
          const ny = segs[i+1].baseY + nfp * (160 + Math.sin((i+1) * 0.5) * 10 - segs[i+1].baseY);
          ctx.beginPath(); ctx.moveTo(x+4, y); ctx.lineTo(nx-4, ny);
          ctx.strokeStyle = fp < 0.5 ? 'rgba(124,58,237,0.25)' : 'rgba(34,197,94,0.35)';
          ctx.lineWidth = 1.5; ctx.stroke();
        }
      });

      // Update
      if (runRef.current) {
        const delta = (rateRef.current / 100) * 0.008;
        segs.forEach(s => { s.foldProgress = Math.min(1, s.foldProgress + delta); });
        crystallRef.current = Math.min(100, crystallRef.current + delta * 40);
        setCrystallinity(Math.round(crystallRef.current));
      }

      ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.font = '12px monospace';
      ctx.fillText('Crystallinity: ' + Math.round(crystallRef.current) + '%', 12, 20);
      ctx.fillText('Cooling Rate: ' + rateRef.current + String.fromCharCode(176) + 'C/min', 12, 40);
      const state = crystallRef.current < 30 ? 'Amorphous — random coils' : crystallRef.current < 70 ? 'Partially crystalline' : 'Highly crystalline lamellae';
      ctx.fillStyle = crystallRef.current > 60 ? '#22C55E' : '#F97316';
      ctx.fillText(state, 12, 60);

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const reset = () => {
    segRef.current.forEach(s => { s.foldProgress = 0; });
    crystallRef.current = 0;
    setCrystallinity(0);
  };

  return (
    <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-xl font-black font-display uppercase mb-1">🧬 Polymer Chain Folding Animator</h2>
      <p className="text-xs text-slate-500 mb-4">Watch polymer chains fold from amorphous random coils into ordered crystalline lamellae. Slow cooling = higher crystallinity.</p>
      <canvas ref={canvasRef} width={600} height={300} className="w-full border-2 border-slate-900 rounded-xl bg-slate-950" />
      <div className="flex items-center gap-6 mt-5 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold block mb-1">Cooling Rate: {coolingRate}&#176;C/min</label>
          <input type="range" min={5} max={200} value={coolingRate} onChange={e => { const v = Number(e.target.value); setCoolingRate(v); rateRef.current = v; }} className="w-full accent-violet-600" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5"><span>5&#176;C/min (slow, high cryst.)</span><span>200&#176;C/min (fast, amorphous)</span></div>
        </div>
        <div className="flex gap-2 items-end">
          <button onClick={() => { runRef.current = !runRef.current; setIsRunning(v => !v); }} className="px-4 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">{isRunning ? '⏸ Pause' : '▶ Play'}</button>
          <button onClick={reset} className="px-4 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">↺ Reset</button>
        </div>
        <div className="border-2 border-slate-900 rounded-xl px-4 py-2 text-center min-w-[90px]">
          <div className="font-mono text-2xl font-black text-green-600">{crystallinity}%</div>
          <div className="text-[9px] font-mono text-slate-500 uppercase">Crystallinity</div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
        <p className="text-xs text-slate-600 leading-relaxed"><strong>How it works:</strong> Slow cooling allows polymer chains time to arrange into folded lamellar structures. Fast cooling locks chains into amorphous configurations. Higher crystallinity increases modulus, yield strength, and Tg but reduces impact toughness.</p>
      </div>
    </div>
  );
}
