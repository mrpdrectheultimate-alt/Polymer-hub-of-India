// src/components/ScreencastPlayer.tsx
'use client';
import { useState, useEffect } from 'react';
import { ScreencastItem } from '@/lib/screencasts';
import { X, Sparkles, Calculator, BookOpen } from 'lucide-react';

interface ScreencastPlayerProps {
  screencast: ScreencastItem;
  onClose: () => void;
}

export function ScreencastPlayer({ screencast, onClose }: ScreencastPlayerProps) {
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, string | number>>({});

  useEffect(() => {
    const initial: Record<string, number> = {};
    screencast.solver.inputs.forEach((input) => {
      initial[input.id] = input.default;
    });
    setInputs(initial);
  }, [screencast]);

  useEffect(() => {
    if (Object.keys(inputs).length > 0) {
      const result = screencast.solver.calculate(inputs);
      setResults(result);
    }
  }, [inputs, screencast]);

  const handleInputChange = (id: string, value: number) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-canvas border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-900 rounded">
                  {screencast.subject}
                </span>
                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-900 rounded flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Screencast &middot; {screencast.duration}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-slate-900">
                {screencast.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-slate-900 rounded-lg hover:bg-slate-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all text-slate-900"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Pane Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Video & Concept Info (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${screencast.youtubeId}?rel=0&autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Walkthrough Concept
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{screencast.description}</p>
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-3">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Governing Formula</div>
                  <div className="font-mono text-xs font-black text-blue-700">{screencast.formula}</div>
                </div>
              </div>
            </div>

            {/* Right: Step-by-Step Solver (5 cols) */}
            <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                  <h3 className="text-sm font-black font-display uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                    <Calculator className="w-4 h-4 text-orange-600" /> Interactive Companion Solver
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 font-bold">Live Calculator</span>
                </div>

                {/* Input Controls */}
                <div className="space-y-3.5">
                  {screencast.solver.inputs.map((input) => {
                    const currentVal = inputs[input.id] ?? input.default;
                    return (
                      <div key={input.id} className="space-y-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                          <span>{input.label}</span>
                          <span className="font-mono text-blue-700 font-black">
                            {currentVal} {input.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={input.min}
                          max={input.max}
                          step={input.step}
                          value={currentVal}
                          onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                          <span>{input.min} {input.unit}</span>
                          <span>{input.max} {input.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="border-t-2 border-slate-900 pt-4 mt-auto">
                <div className="text-[10px] font-mono uppercase font-black tracking-wider text-slate-500 mb-2.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Solved Results
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(results).map(([key, value]) => (
                    <div key={key} className="bg-amber-50 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <p className="text-[9px] font-mono uppercase text-slate-500 font-bold">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-base font-black font-mono text-slate-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
