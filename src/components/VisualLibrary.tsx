// src/components/VisualLibrary.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { visualAssets, VisualAsset } from '@/lib/visual_assets';
import { Search, X, Layers, Image as ImageIcon, FileText, ChevronRight, HelpCircle, BarChart3 } from 'lucide-react';

export function VisualLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selected, setSelected] = useState<VisualAsset | null>(null);

  // Get unique list of subjects for filters
  const subjectsList = useMemo(() => {
    const subjects = new Set<string>();
    visualAssets.forEach(asset => subjects.add(asset.subject));
    return ['all', ...Array.from(subjects)];
  }, []);

  const filteredAssets = useMemo(() => {
    return visualAssets.filter((asset) => {
      const matchesSearch = 
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = selectedSubject === 'all' || asset.subject === selectedSubject;
      const matchesType = filterType === 'all' || asset.type === filterType;
      
      return matchesSearch && matchesSubject && matchesType;
    });
  }, [searchTerm, selectedSubject, filterType]);

  const typeIcons = {
    diagram: <Layers className="w-3.5 h-3.5" />,
    photo: <ImageIcon className="w-3.5 h-3.5" />,
    graph: <BarChart3 className="w-3.5 h-3.5" />,
    animation: <FileText className="w-3.5 h-3.5" /> // standard video/gif indicator
  };

  const typeLabels = {
    diagram: '📐 Diagram',
    photo: '📷 Photo',
    graph: '📊 Graph',
    animation: '🎬 Animation'
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search visual assets by topic, chapter, or keyword..."
            className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm bg-slate-50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Subject Filters */}
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-2">
            Filter by Subject
          </span>
          <div className="flex flex-wrap gap-2">
            {subjectsList.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>
        </div>

        {/* Media Type Filters */}
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-2">
            Filter by Resource Type
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              All Types
            </button>
            {Object.keys(typeLabels).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  filterType === type
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {typeIcons[type as keyof typeof typeIcons]}
                <span>{typeLabels[type as keyof typeof typeLabels]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
        <span>Showing {filteredAssets.length} of {visualAssets.length} engineering graphics</span>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No visuals found</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            We couldn&apos;t find any diagrams or graphs matching your current filter set. Try resetting your search query or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            let typeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            if (asset.type === 'diagram') typeColor = 'bg-blue-50 text-blue-700 border-blue-200';
            if (asset.type === 'photo') typeColor = 'bg-purple-50 text-purple-700 border-purple-200';
            if (asset.type === 'graph') typeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={asset.id}
                onClick={() => setSelected(asset)}
                className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group hover:-translate-y-0.5"
              >
                {/* Image Wrapper */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden border-b-2 border-slate-200">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className={`absolute top-3 right-3 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded border shadow-sm ${typeColor}`}>
                    {asset.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">
                      {asset.subject}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {asset.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Ch: {asset.chapter}</span>
                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open Viewer <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-slate-900 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-600">
                  {selected.subject} &middot; {selected.chapter}
                </span>
                <h3 className="text-2xl font-black text-slate-800 leading-tight mt-1">
                  {selected.title}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close overlay"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* High-res Image display */}
            <div className="bg-slate-950 border-y border-slate-200 relative aspect-video flex items-center justify-center">
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Details and Actions */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-black tracking-widest text-slate-400">
                  Scientific Concept & Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selected.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Topic Context</span>
                  <span className="text-xs font-black text-slate-800">{selected.topic}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Asset Type</span>
                  <span className="text-xs font-black text-slate-800 capitalize">{selected.type}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Attribution</span>
                  <span className="text-xs font-black text-slate-800">{selected.source}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Chapter Context</span>
                  <span className="text-xs font-black text-slate-800">{selected.chapter}</span>
                </div>
              </div>

              {/* Direct Lesson Router Link */}
              {selected.relatedLessonSlug && (
                <div className="flex justify-end pt-2">
                  <Link
                    href={`/lessons/${selected.relatedLessonSlug}`}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-5 py-3 rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    Study Related Lesson <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
