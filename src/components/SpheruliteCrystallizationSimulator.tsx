// src/components/SpheruliteCrystallizationSimulator.tsx
'use client';
import { useRef, useEffect, useState } from 'react';

interface Nucleus { x: number; y: number; radius: number; active: boolean; }

export function SpheruliteCrystallizationSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nucleiRef = useRef<Nucleus[]>([]);
  const tempRef = useRef(120);
  const runningRef = useRef(true);
  const [temperature, setTemperature] = useState(120);
  const [isRunning, setIsRunning] = useState(true);
  const [, setNucleiCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath(); ctx.moveTo(i * 40, 0); ctx.lineTo(i * 40, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 40); ctx.lineTo(canvas.width, i * 40); ctx.stroke();
      }
      nucleiRef.current.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, 'rgba(255,255,255,0.5)');
        grad.addColorStop(0.3, 'rgba(74,222,128,0.5)');
        grad.addColorStop(0.7, 'rgba(74,222,128,0.15)');
        grad.addColorStop(1, 'rgba(74,222,128,0)');
        ctx.beginPath(); ctx.arc(n.x, n.y, Math.max(n.radius, 1), 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(n.x - n.radius * 0.7, n.y); ctx.lineTo(n.x + n.radius * 0.7, n.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(n.x, n.y - n.radius * 0.7); ctx.lineTo(n.x, n.y + n.radius * 0.7); ctx.stroke();
        [0.3, 0.5, 0.75].forEach(r => {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.radius * r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
        });
        if (runningRef.current) {
          const growth = tempRef.current > 120 ? 0.8 : 0.35;
          n.radius += growth * 0.22;
        }
      });
      const cryst = Math.min(100, nucleiRef.current.length * 9);
      ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.font = '12px monospace';
      ctx.fillText('Crystallinity: ' + cryst + '%', 12, 22);
      ctx.fillText('Nuclei: ' + nucleiRef.current.length, 12, 42);
      ctx.fillText('Temp: ' + tempRef.current + String.fromCharCode(176) + 'C', 12, 62);
      ctx.fillStyle = tempRef.current > 120 ? '#F97316' : '#22C55E';
      ctx.fillText(tempRef.current > 120 ? 'High T: fast growth, few nuclei' : 'Low T: slow growth, many nuclei', 12, 82);
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    nucleiRef.current.push({ x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY, radius: 2, active: true });
    setNucleiCount(nucleiRef.current.length);
  };

  return (
    <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-xl font-black font-display uppercase mb-1">🔬 Spherulite Crystallization Simulator</h2>
      <p className="text-xs text-slate-500 mb-4">Click the canvas to seed nuclei. Adjust temperature to control growth rate and nucleation density.</p>
      <canvas ref={canvasRef} width={600} height={360} className="w-full border-2 border-slate-900 rounded-xl bg-slate-950 cursor-crosshair" onClick={handleCanvasClick} />
      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <label className="text-xs font-bold block mb-1">Temperature ({temperature}&#176;C)</label>
          <input type="range" min={80} max={160} value={temperature} onChange={e => { const v = Number(e.target.value); setTemperature(v); tempRef.current = v; }} className="w-full accent-blue-600" />
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5"><span>80&#176;C (slow)</span><span>160&#176;C (fast)</span></div>
        </div>
        <div className="flex items-end gap-2 justify-end">
          <button onClick={() => { runningRef.current = !runningRef.current; setIsRunning(v => !v); }} className="px-4 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">{isRunning ? '⏸ Pause' : '▶ Play'}</button>
          <button onClick={() => { nucleiRef.current = []; setNucleiCount(0); }} className="px-4 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">🗑 Clear</button>
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
        <p className="text-xs text-slate-600 leading-relaxed"><strong>How it works:</strong> Polymer crystallization begins at nuclei and grows radially outward forming spherulites. Lower temperatures create more nuclei (higher nucleation rate) but slower growth. Higher temperatures produce fewer, larger spherulites. The Maltese cross pattern is characteristic under polarized light.</p>
      </div>
    </div>
  );
}
