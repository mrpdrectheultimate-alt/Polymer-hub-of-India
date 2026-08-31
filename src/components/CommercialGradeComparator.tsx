// src/components/CommercialGradeComparator.tsx
'use client';
import { useState } from 'react';
import { COMMERCIAL_GRADES, CommercialGrade } from '@/lib/commercial_grades';
import { Scale, Check, Plus, Trash2, AlertTriangle } from 'lucide-react';

export function CommercialGradeComparator() {
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([
    'reliance-repol-h110ma',
    'iocl-propel-1110mas',
  ]);
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [filterProducer, setFilterProducer] = useState<string>('all');

  const families = Array.from(new Set(COMMERCIAL_GRADES.map((g) => g.polymerFamily)));
  const producers = Array.from(new Set(COMMERCIAL_GRADES.map((g) => g.producer)));

  const filteredGradesList = COMMERCIAL_GRADES.filter((g) => {
    const matchFam = filterFamily === 'all' || g.polymerFamily === filterFamily;
    const matchProd = filterProducer === 'all' || g.producer === filterProducer;
    return matchFam && matchProd;
  });

  const selectedGrades = selectedGradeIds
    .map((id) => COMMERCIAL_GRADES.find((g) => g.id === id))
    .filter((g): g is CommercialGrade => Boolean(g));

  const addGrade = (id: string) => {
    if (selectedGradeIds.length < 3 && !selectedGradeIds.includes(id)) {
      setSelectedGradeIds([...selectedGradeIds, id]);
    }
  };

  const removeGrade = (id: string) => {
    if (selectedGradeIds.length > 1) {
      setSelectedGradeIds(selectedGradeIds.filter((gid) => gid !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header card */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#0F2042] to-[#0A1128] border-2 border-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 bg-blue-500/20 text-[#38BDF8] border border-blue-400/30 rounded">
              Commercial Grade Technical Datasheet (TDS) Model
            </span>
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">16 Standard Properties per Grade</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
            Commercial Resin Grade Comparator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Directly compare technical datasheets (TDS) of commercial polymer grades from major resin manufacturers (Reliance, IOCL, GAIL, Covestro, SABIC, BASF, DuPont, etc.).
          </p>
        </div>
      </div>

      {/* Mandatory Technical & Legal TDS Disclaimer */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-xs font-mono flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
            ⚠️ Technical Datasheet (TDS) Guidance &amp; Verification Notice:
          </span>
          <p className="text-[11px] text-amber-900/90 leading-relaxed font-sans font-normal">
            Property values, regulatory compliances (FDA 21 CFR 177.1520, IS 10910), and test standards are synthesized from published manufacturer technical literature. Always verify critical design tolerances against the resin producer&apos;s latest published lot-specific Certificate of Analysis (CoA) or official published TDS before final tooling and commercial manufacturing.
          </p>
        </div>
      </div>

      {/* Grade Selector & Filters Bar */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span className="font-display font-black text-sm uppercase text-slate-900">
              Select Grades to Compare (Max 3)
            </span>
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value)}
              className="border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 text-slate-900"
            >
              <option value="all">All Polymer Families</option>
              {families.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={filterProducer}
              onChange={(e) => setFilterProducer(e.target.value)}
              className="border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 text-slate-900"
            >
              <option value="all">All Producers</option>
              {producers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Add Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
          {filteredGradesList.map((grade) => {
            const isSelected = selectedGradeIds.includes(grade.id);
            return (
              <button
                key={grade.id}
                onClick={() => (isSelected ? removeGrade(grade.id) : addGrade(grade.id))}
                className={`border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{grade.producer.split(' ')[0]} {grade.tradeName} {grade.gradeCode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Datasheet Comparison Table */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-slate-900 bg-slate-900 text-white">
                <th className="p-4 w-1/4 font-display font-black text-xs uppercase tracking-wider">
                  Property & Specification (ISO / ASTM)
                </th>
                {selectedGrades.map((grade) => (
                  <th key={grade.id} className="p-4 border-l-2 border-slate-800 relative">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[9px] text-blue-400 font-bold uppercase block">
                          {grade.producer}
                        </span>
                        <div className="font-display font-black text-sm uppercase">
                          {grade.tradeName} <span className="text-yellow-400">{grade.gradeCode}</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                          {grade.polymerType} &middot; {grade.processMethod}
                        </span>
                      </div>
                      {selectedGrades.length > 1 && (
                        <button
                          onClick={() => removeGrade(grade.id)}
                          className="text-slate-400 hover:text-red-400 p-1"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200 font-mono text-xs text-slate-800">
              {/* ── TDS SOURCE CITATION ROW ── */}
              <tr className="bg-slate-100">
                <td className="p-3 font-bold text-slate-700 bg-slate-200/80">📚 TDS Literature Source</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-bold text-[#2563EB] text-[11px]">
                    {g.producer} &middot; Published Technical Datasheet (TDS)
                  </td>
                ))}
              </tr>

              {/* ── FLOW PROPERTIES ── */}
              <tr className="bg-blue-50/70">
                <td colSpan={selectedGrades.length + 1} className="p-2.5 font-bold uppercase text-[10px] text-blue-900 tracking-wider">
                  🌊 Rheological & Flow Properties
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">MFI / Melt Flow Rate</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-black text-blue-700 tabular-nums">
                    {g.mfi} g/10 min <span className="text-[9px] font-normal text-slate-500 block">({g.mfiCondition})</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Density</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.density} g/cm³
                  </td>
                ))}
              </tr>

              {/* ── MECHANICAL PROPERTIES ── */}
              <tr className="bg-orange-50/70">
                <td colSpan={selectedGrades.length + 1} className="p-2.5 font-bold uppercase text-[10px] text-orange-900 tracking-wider">
                  💪 Mechanical & Strength Properties
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Tensile Strength (Yield)</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-black text-slate-900">
                    {g.tensileStrength} MPa
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Flexural Modulus (Stiffness)</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-black text-indigo-700">
                    {g.flexuralModulus} MPa
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Izod Impact Strength</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-black text-emerald-700">
                    {g.izodImpact} J/m
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Elongation at Break</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.elongationAtBreak}%
                  </td>
                ))}
              </tr>

              {/* ── THERMAL PROPERTIES ── */}
              <tr className="bg-purple-50/70">
                <td colSpan={selectedGrades.length + 1} className="p-2.5 font-bold uppercase text-[10px] text-purple-900 tracking-wider">
                  🔥 Thermal Properties & Deflection
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Heat Deflection Temp (HDT 0.45 MPa)</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200 font-bold text-red-700">
                    {g.hdt}°C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Vicat Softening Point (B50)</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.vicatSoftening}°C
                  </td>
                ))}
              </tr>

              {/* ── PROCESSING GUIDELINES ── */}
              <tr className="bg-slate-100">
                <td colSpan={selectedGrades.length + 1} className="p-2.5 font-bold uppercase text-[10px] text-slate-900 tracking-wider">
                  ⚙️ Processing Machine Guidelines
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Melt Temperature Range</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.meltTempRange[0]}–{g.meltTempRange[1]}°C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Mold Temperature Range</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.moldTempRange[0]}–{g.moldTempRange[1]}°C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Linear Mold Shrinkage</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.shrinkage[0]}–{g.shrinkage[1]}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Pre-Drying Required?</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    {g.dryingRecommended ? (
                      <span className="text-amber-700 font-bold">
                        Yes &middot; <span className="text-[10px] font-normal">{g.dryingCondition}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">No (Not hygroscopic)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* ── APPLICATIONS & COMPLIANCE ── */}
              <tr className="bg-slate-100">
                <td colSpan={selectedGrades.length + 1} className="p-2.5 font-bold uppercase text-[10px] text-slate-900 tracking-wider">
                  🏭 Target Applications & Certifications
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Target Applications</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                      {g.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-700 bg-slate-50">Regulatory & Compliance</td>
                {selectedGrades.map((g) => (
                  <td key={g.id} className="p-3 border-l-2 border-slate-200">
                    <div className="flex gap-1 flex-wrap">
                      {g.certifications.map((c, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-[9px] font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
