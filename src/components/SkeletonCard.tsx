// src/components/SkeletonCard.tsx — Shimmering Loading State Skeletons
'use client'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 space-y-4 shadow-sm animate-pulse">
      <div className="w-full h-40 bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
