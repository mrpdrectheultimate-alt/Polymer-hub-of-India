// src/components/SPECareerExplorer.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SPE_TRACKS } from '@/lib/spe_tracks';
import { 
  Briefcase, 
  Award, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  Sparkles 
} from 'lucide-react';

export function SPECareerExplorer() {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(SPE_TRACKS[0].id);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'standards' | 'interview' | 'recruiters'>('curriculum');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const track = SPE_TRACKS.find((t) => t.id === selectedTrackId) || SPE_TRACKS[0];

  const toggleItem = (title: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const completedCount = track.mappedCurriculum.filter((item) => completedItems[item.title]).length;
  const progressPercent = Math.round((completedCount / track.mappedCurriculum.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-950 border-4 border-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[9px] font-black uppercase px-2.5 py-0.5 bg-yellow-400 text-slate-950 border border-slate-900 rounded font-bold flex items-center gap-1">
              <Award className="w-3 h-3" /> SPE Professional Pathways
            </span>
            <span className="font-mono text-[9px] text-amber-300 font-bold uppercase">
              Curriculum-to-Career Alignment
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
            🎓 SPE Industry Career Track Mapping
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aligned with the <strong>Society of Plastics Engineers (SPE)</strong> professional divisions. Master specific PolymerHub lessons, interactive simulations, and problem solvers to qualify for high-paying industry roles.
          </p>
        </div>
      </div>

      {/* 4 Track Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPE_TRACKS.map((t) => {
          const isSelected = t.id === selectedTrackId;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`text-left p-4 rounded-xl border-4 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                  : 'border-slate-300 bg-white hover:border-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]'
              }`}
              style={{ backgroundColor: isSelected ? t.bg : '#FFFFFF' }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded border"
                    style={{ color: t.color, borderColor: t.borderColor, backgroundColor: '#FFFFFF' }}
                  >
                    {t.demandRating} Demand
                  </span>
                  {isSelected && <Sparkles className="w-4 h-4" style={{ color: t.color }} />}
                </div>
                <h3 className="font-display font-black text-sm uppercase text-slate-900 leading-snug">
                  {t.title}
                </h3>
                <p className="font-mono text-[10px] text-slate-600 line-clamp-2">
                  {t.tagline}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between font-mono text-[10px] font-bold text-slate-700">
                <span>{t.salaryIndia}</span>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Track View Panel */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Track Title & Meta Header */}
        <div className="p-6 sm:p-8 border-b-4 border-slate-900" style={{ backgroundColor: track.bg }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-600 block">
                {track.speDivision}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase text-slate-900">
                {track.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {track.summary}
              </p>
            </div>
            {/* Compensation & Readiness Stats */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 flex-shrink-0 min-w-[220px]">
              <div className="font-mono text-[9px] font-bold uppercase text-slate-500">Compensation Benchmark</div>
              <div className="font-display font-black text-lg text-emerald-700">{track.salaryIndia}</div>
              <div className="font-mono text-[10px] text-slate-600">{track.salaryGlobal}</div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                  <span>Track Readiness:</span>
                  <span style={{ color: track.color }}>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-400">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%`, backgroundColor: track.color }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b-2 border-slate-200 bg-slate-50 px-6 flex gap-3 overflow-x-auto">
          {[
            { id: 'curriculum', label: '📚 Mapped Curriculum & Solvers' },
            { id: 'standards', label: '📐 Standards & Tools' },
            { id: 'interview', label: '🎯 Interview Questions' },
            { id: 'recruiters', label: '🏢 Top Employers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'curriculum' | 'standards' | 'interview' | 'recruiters')}
              className={`py-3.5 px-3 font-mono text-xs font-black uppercase tracking-wider border-b-4 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: CURRICULUM & SOLVERS */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-black text-base uppercase text-slate-900">
                    Required Learning Modules & Solvers
                  </h4>
                  <p className="text-xs text-slate-600 font-mono">
                    Check off completed items to calculate your qualification score.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 border border-slate-300 rounded">
                  {completedCount} of {track.mappedCurriculum.length} Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {track.mappedCurriculum.map((item, idx) => {
                  const isChecked = !!completedItems[item.title];
                  return (
                    <div
                      key={idx}
                      className={`p-4 border-2 rounded-xl transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-slate-900 bg-white hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleItem(item.title)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Mark complete"
                        >
                          <CheckCircle2
                            className={`w-5 h-5 ${isChecked ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`}
                          />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[9px] font-black uppercase px-2 py-0.2 bg-slate-100 border border-slate-300 rounded text-slate-800">
                              {item.badge}
                            </span>
                            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">
                              {item.type}
                            </span>
                          </div>
                          <Link
                            href={item.url}
                            className="font-display font-black text-xs text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STANDARDS & TOOLS */}
          {activeTab === 'standards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-slate-900 rounded-xl p-5 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h4 className="font-display font-black text-sm uppercase text-slate-900">
                    Essential ASTM & ISO Standards
                  </h4>
                </div>
                <ul className="space-y-2">
                  {track.essentialStandards.map((std, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-mono text-slate-800">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-slate-900 rounded-xl p-5 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h4 className="font-display font-black text-sm uppercase text-slate-900">
                    Industry Machines & Software Tools
                  </h4>
                </div>
                <ul className="space-y-2">
                  {track.keyTools.map((tool, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-mono text-slate-800">
                      <span className="text-blue-600 font-bold">⚙</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW QUESTIONS */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <h4 className="font-display font-black text-sm uppercase text-slate-900 mb-2">
                High-Yield Technical Interview Questions
              </h4>
              {track.sampleInterviewQuestions.map((q, idx) => (
                <div key={idx} className="border-2 border-slate-900 rounded-xl p-5 bg-yellow-50/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="font-display font-bold text-xs text-slate-900">
                      {q.question}
                    </p>
                  </div>
                  <div className="pl-6 pt-1 border-t border-amber-200">
                    <p className="font-mono text-[11px] text-slate-700 leading-relaxed">
                      <strong className="text-amber-900 font-bold">Key Concept Answer:</strong> {q.keyConcept}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RECRUITERS */}
          {activeTab === 'recruiters' && (
            <div className="space-y-4">
              <h4 className="font-display font-black text-sm uppercase text-slate-900">
                Top Hiring Organizations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {track.topRecruiters.map((company, i) => (
                  <div
                    key={i}
                    className="p-4 border-2 border-slate-900 rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3"
                  >
                    <Building2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="font-display font-black text-xs text-slate-900 uppercase">
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
