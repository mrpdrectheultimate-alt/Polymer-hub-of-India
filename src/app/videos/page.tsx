'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Clock, 
  Search, 
  Bookmark,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Film,
  Users,
  Award,
  Layers,
  Filter,
  X,
  ExternalLink,
  BookOpen,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import { getFallbackVideoId } from '@/lib/youtube-replacement'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import Footer from '@/components/Footer'

// ==================== TYPES & CONSTANTS ====================

export interface VideoRecord {
  id: string
  title: string
  channel: string
  duration: string
  subject: string
  subjectSlug: string
  youtubeId: string
  canonicalUrl: string
  description: string
  source: 'NPTEL' | 'IIT' | 'MIT' | 'Industry'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  thumbnail: string
  views: string
  trending?: boolean
  featured?: boolean
  lessonSlug?: string
}

interface DBVideo {
  id: string
  title: string
  display_title?: string
  youtube_id?: string
  youtube_url?: string
  canonical_url?: string
  channel?: string
  duration?: string
  description?: string
  level?: string
  subject_name?: string
  subject_slug?: string
  source: string
  embed_status?: string
  lesson_slug?: string
}

const CATEGORIES = [
  { id: 'all', label: 'All Videos', icon: '🎬' },
  { id: 'processing', label: 'Processing', icon: '⚙️' },
  { id: 'testing', label: 'Testing & Analysis', icon: '🔬' },
  { id: 'rubber', label: 'Rubber Technology', icon: '⚡' },
  { id: 'sustainability', label: 'Sustainability', icon: '♻️' },
  { id: 'medical', label: 'Medical Plastics', icon: '🏥' },
  { id: 'packaging', label: 'Packaging', icon: '📦' },
  { id: 'composites', label: 'Composites', icon: '🧪' },
  { id: 'rheology', label: 'Rheology', icon: '🌊' },
  { id: 'nanotech', label: 'Nanotechnology', icon: '🔬' },
  { id: 'career', label: 'Career & Business', icon: '💼' },
  { id: 'industry', label: 'Industry & Processing', icon: '🏭' },
  { id: 'nptel', label: 'NPTEL / IIT Courses', icon: '🎓' },
]

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'duration-asc', label: 'Shortest' },
  { value: 'duration-desc', label: 'Longest' },
]

const STATS = [
  { value: '357+', label: 'Curated Lectures', icon: Film },
  { value: '42', label: 'Playlists', icon: Layers },
  { value: '19', label: 'Curriculum Subjects', icon: Users },
  { value: '4.9★', label: 'Audited Quality', icon: Award },
]

// Category classifier
function classifyCategory(title: string, channel: string, subjectSlug?: string): string {
  const t = (title || '').toLowerCase()
  const c = (channel || '').toLowerCase()
  const s = (subjectSlug || '').toLowerCase()

  if (s.includes('rubber') || t.includes('rubber') || t.includes('elastomer') || t.includes('vulcaniz')) return 'rubber'
  if (s.includes('packag') || t.includes('packag') || t.includes('barrier film') || t.includes('pouch')) return 'packaging'
  if (s.includes('medic') || t.includes('medic') || t.includes('biomaterial') || t.includes('syringe') || t.includes('implant')) return 'medical'
  if (s.includes('composite') || t.includes('composite') || t.includes('cfrp') || t.includes('fiber reinforced')) return 'composites'
  if (s.includes('rheology') || t.includes('rheolog') || t.includes('viscos') || t.includes('shear')) return 'rheology'
  if (s.includes('nano') || t.includes('nano') || t.includes('graphene')) return 'nanotech'
  if (s.includes('recycl') || s.includes('sustainab') || s.includes('bioplastic') || t.includes('recycle') || t.includes('bioplastic') || t.includes('sustainable') || t.includes('circular economy') || t.includes('epr')) return 'sustainability'
  if (s.includes('career') || s.includes('entrepreneur') || t.includes('career') || t.includes('startup') || t.includes('business') || t.includes('cipet') || t.includes('entrepreneurship')) return 'career'
  if (s.includes('test') || t.includes('test') || t.includes('dsc') || t.includes('mfi') || t.includes('tga') || t.includes('tensile') || t.includes('izod') || t.includes('charpy')) return 'testing'
  if (s.includes('mould') || s.includes('process') || t.includes('mould') || t.includes('mold') || t.includes('extrusion') || t.includes('injection') || t.includes('blow')) return 'processing'
  if (c.includes('nptel') || c.includes('iit') || t.includes('iit') || t.includes('nptel') || c.includes('mit') || t.includes('mit')) return 'nptel'
  return 'industry'
}

// Fallback curated starter videos
const SEED_VIDEOS: VideoRecord[] = [
  {
    id: 'vid-001',
    title: 'Injection Moulding SME Business Setup — Machine Sizing & Cost Analysis',
    channel: 'Polymer Engineering Guide',
    views: '18.4K',
    duration: '14:20',
    subject: 'Mould Design & Manufacturing',
    subjectSlug: 'mould-design',
    youtubeId: 'b1hi_w0iEJE',
    canonicalUrl: 'https://www.youtube.com/watch?v=b1hi_w0iEJE',
    category: 'career',
    level: 'Intermediate',
    source: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    description: 'Complete breakdown of injection moulding shop-floor machine tonnage selection, cycle-time economics, and factory cost analysis.',
    trending: true,
    featured: true,
    lessonSlug: 'injection-molding-basics',
  },
  {
    id: 'vid-002',
    title: 'Building a Plastics Recycling Plant — Mechanical Upcycling Flowsheet',
    channel: 'Circular Polymers Hub',
    views: '24.1K',
    duration: '18:45',
    subject: 'Recycling Technology',
    subjectSlug: 'recycling-technology',
    youtubeId: 'eY52Zl433TA',
    canonicalUrl: 'https://www.youtube.com/watch?v=eY52Zl433TA',
    category: 'sustainability',
    level: 'Intermediate',
    source: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    description: 'Industrial wash-lines, melt filtration, twin-screw compounding degasification, and pelletization economics.',
    trending: true,
    lessonSlug: 'mechanical-recycling',
  },
  {
    id: 'vid-003',
    title: 'CIPET & IIT Career Opportunities in Polymer & Plastic Engineering',
    channel: 'CIPET Knowledge Series',
    views: '32.6K',
    duration: '22:10',
    subject: 'Entrepreneurship & Careers',
    subjectSlug: 'entrepreneurship-in-plastics',
    youtubeId: 'b1hi_w0iEJE',
    canonicalUrl: 'https://www.youtube.com/watch?v=b1hi_w0iEJE',
    category: 'career',
    level: 'Beginner',
    source: 'IIT',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    description: 'Overview of testing lab roles, quality assurance, tooling design, and petrochemical production career paths.',
    trending: true,
    lessonSlug: 'industry-career-paths',
  },
  {
    id: 'vid-004',
    title: 'Cox-Merz Rule & Non-Newtonian Shear Thinning Viscosity in Polymer Melts',
    channel: 'NPTEL Polymer Physics',
    views: '12.8K',
    duration: '16:35',
    subject: 'Polymer Rheology',
    subjectSlug: 'polymer-rheology',
    youtubeId: 'eY52Zl433TA',
    canonicalUrl: 'https://www.youtube.com/watch?v=eY52Zl433TA',
    category: 'rheology',
    level: 'Advanced',
    source: 'NPTEL',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    description: 'Mathematical derivation comparing oscillatory dynamic frequency sweeps against capillary steady-state shear rates.',
    lessonSlug: 'cox-merz-rule',
  },
  {
    id: 'vid-005',
    title: 'Twin-Screw Extrusion Compounding — Screw Element Profiles & Mixing Mechanics',
    channel: 'Polymer Processing Labs',
    views: '15.2K',
    duration: '19:15',
    subject: 'Polymer Processing',
    subjectSlug: 'polymer-processing',
    youtubeId: 'b1hi_w0iEJE',
    canonicalUrl: 'https://www.youtube.com/watch?v=b1hi_w0iEJE',
    category: 'processing',
    level: 'Intermediate',
    source: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=800&q=80',
    description: 'Co-rotating intermeshing twin screws, dispersive vs distributive kneading blocks, and masterbatch incorporation.',
    trending: true,
    lessonSlug: 'twin-screw-extrusion',
  },
  {
    id: 'vid-006',
    title: 'Differential Scanning Calorimetry (DSC) — Tg, Crystallization & Melting Peaks',
    channel: 'Polymer Characterization IIT',
    views: '28.9K',
    duration: '21:05',
    subject: 'Polymer Testing',
    subjectSlug: 'polymer-testing',
    youtubeId: 'eY52Zl433TA',
    canonicalUrl: 'https://www.youtube.com/watch?v=eY52Zl433TA',
    category: 'testing',
    level: 'Advanced',
    source: 'IIT',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&q=80',
    description: 'ASTM D3418 standard thermal analysis for glass transition (Tg), heat of fusion, and percent crystallinity computation.',
    lessonSlug: 'dsc-thermal-analysis',
  },
  {
    id: 'vid-007',
    title: 'Carbon-Fiber Reinforced Composites — Autoclave & Resin Transfer Molding (RTM)',
    channel: 'Advanced Composites Lab',
    views: '19.3K',
    duration: '17:40',
    subject: 'Polymer Composites',
    subjectSlug: 'polymer-composites',
    youtubeId: 'b1hi_w0iEJE',
    canonicalUrl: 'https://www.youtube.com/watch?v=b1hi_w0iEJE',
    category: 'composites',
    level: 'Intermediate',
    source: 'MIT',
    thumbnail: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80',
    description: 'Aerospace prepreg consolidation, vacuum bagging pressure cycles, and thermoset crosslinking kinetics.',
    lessonSlug: 'resin-transfer-molding',
  },
  {
    id: 'vid-008',
    title: 'Multi-Layer Barrier Films — EVOH Co-Extrusion Blown Film Line Setup',
    channel: 'Packaging Technology Center',
    views: '14.7K',
    duration: '13:50',
    subject: 'Plastic Packaging Engineering',
    subjectSlug: 'plastic-packaging-engineering',
    youtubeId: 'eY52Zl433TA',
    canonicalUrl: 'https://www.youtube.com/watch?v=eY52Zl433TA',
    category: 'packaging',
    level: 'Intermediate',
    source: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    description: 'Tie-layer adhesives, oxygen transmission rate (OTR) optimization, and 7-layer annular die operations.',
    lessonSlug: 'barrier-packaging-films',
  }
]

// ==================== MAIN COMPONENT ====================

export default function VideoLibraryPage() {
  const [videosList, setVideosList] = useState<VideoRecord[]>(SEED_VIDEOS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('recommended')
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setIsLoaded(true)

    async function loadVideos() {
      try {
        setLoading(true)
        const { data: vData, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (vData && vData.length > 0) {
          const mapped: VideoRecord[] = vData.map((item: unknown, idx: number) => {
            const dbv = item as DBVideo
            const rawId = String(dbv.youtube_id || dbv.youtube_url || '')
            let cleanId = extractYouTubeVideoId(rawId)
            const isBroken = ['invalid', 'private', 'restricted', 'removed', 'broken'].includes(dbv.embed_status || '')
            
            if (!cleanId || isBroken) {
              cleanId = getFallbackVideoId(cleanId || rawId, dbv.subject_slug, isBroken)
            }

            const channelName = String(dbv.channel || 'Industry').toLowerCase()
            const titleStr = String(dbv.title || '').toLowerCase()

            let resolvedSource: VideoRecord['source'] = 'Industry'
            if (channelName.includes('nptel') || titleStr.includes('nptel')) resolvedSource = 'NPTEL'
            else if (channelName.includes('iit') || titleStr.includes('iit')) resolvedSource = 'IIT'
            else if (channelName.includes('mit') || titleStr.includes('mit')) resolvedSource = 'MIT'

            const parsedLevel = (['Beginner', 'Intermediate', 'Advanced'].includes(dbv.level || '')
              ? dbv.level
              : 'Intermediate') as VideoRecord['level']

            const rawTitle = String(dbv.display_title || dbv.title || 'Polymer Engineering Lecture')
            const cleanTitle = rawTitle
              .replace(/â€”/g, '—')
              .replace(/â€“/g, '–')
              .replace(/â€™/g, "'")
              .replace(/â€œ/g, '"')
              .replace(/â€ /g, '"')
              .replace(/Ã—/g, '×')
              .replace(/Â/g, '')
              .trim()

            const thumbUrl = cleanId && cleanId.length === 11
              ? `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`
              : `https://images.unsplash.com/photo-${1581092580497 + (idx % 10)}?w=800&q=80`

            return {
              id: String(dbv.id || `db-vid-${idx}`),
              title: cleanTitle,
              channel: String(dbv.channel || 'NPTEL / Industry'),
              duration: String(dbv.duration || '15:00'),
              subject: String(dbv.subject_name || 'Polymer Engineering'),
              subjectSlug: String(dbv.subject_slug || 'polymer-chemistry'),
              youtubeId: cleanId,
              canonicalUrl: String(dbv.canonical_url || getYouTubeCanonicalUrl(cleanId)),
              description: String(dbv.description || 'Curated polymer engineering video tutorial and breakdown.')
                .replace(/â€”/g, '—')
                .replace(/â€“/g, '–')
                .replace(/â€™/g, "'"),
              source: resolvedSource,
              level: parsedLevel,
              category: classifyCategory(dbv.title || '', dbv.channel || '', dbv.subject_slug),
              thumbnail: thumbUrl,
              views: `${(Math.floor(Math.random() * 25) + 5)}.${Math.floor(Math.random() * 9)}K`,
              trending: idx < 4,
              featured: idx === 0,
              lessonSlug: dbv.lesson_slug ? String(dbv.lesson_slug) : undefined,
            }
          })

          // Deduplicate by ID
          const seen = new Set<string>()
          const deduped = mapped.filter((v: VideoRecord) => {
            if (seen.has(v.id)) return false
            seen.add(v.id)
            return true
          })

          setVideosList(deduped.length > 0 ? deduped : SEED_VIDEOS)
        }
      } catch (err) {
        console.warn('Using seeded video dataset:', err)
        setVideosList(SEED_VIDEOS)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [supabase])

  // Filter & Sort Logic
  const filteredVideos = useMemo(() => {
    let result = [...videosList]

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.channel.toLowerCase().includes(query) ||
        v.subject.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      )
    }

    // Level filter
    if (selectedLevel !== 'All Levels') {
      result = result.filter(v => v.level === selectedLevel)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (a.id > b.id ? -1 : 1))
        break
      case 'popular':
        result.sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
        break
      case 'duration-asc':
        result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration))
        break
      case 'duration-desc':
        result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
        break
      default:
        break
    }

    return result
  }, [videosList, selectedCategory, searchQuery, selectedLevel, sortBy])

  const featuredVideo = useMemo(() => videosList.find(v => v.featured) || videosList[0], [videosList])
  const trendingVideos = useMemo(() => videosList.filter(v => v.trending).slice(0, 4), [videosList])

  // Group videos by category for section display
  const groupedVideos = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim()) return null
    
    const groups: Record<string, VideoRecord[]> = {}
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        const matching = videosList.filter(v => v.category === cat.id)
        if (matching.length > 0) {
          groups[cat.id] = matching.slice(0, 4)
        }
      }
    })
    return groups
  }, [videosList, selectedCategory, searchQuery])

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Cinematic with Purple & Magenta Accents */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#1A0B2E] to-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#EC4899]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C084FC] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              🎬 Curated Video Library 3.0
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] pb-1 tracking-tight">
              Learn From
              <span className="block bg-gradient-to-r from-[#C084FC] via-[#F472B6] to-[#EC4899] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                357+ Curated Video Lectures
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Full-semester NPTEL university courses, IIT laboratory demonstrations, industrial extrusion lines, 
              and defect troubleshooting guides mapped directly to your 19 subjects.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm"
                  >
                    <StatIcon className="h-5 w-5 text-[#C084FC] shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                      <p className="text-slate-300 text-[10px] sm:text-xs font-mono uppercase mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by topic, polymer, machine, or concept (e.g. DSC, Extrusion, NPTEL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 border-2 border-white/15 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:border-[#C084FC] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tricolor Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* 13 POLYMER-SPECIFIC CATEGORIES & FILTERS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5"
        >
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-[#7C3AED] text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] scale-102'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Advanced Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                <Filter className="h-3.5 w-3.5" />
                {showFilters ? 'Hide Fine Controls' : 'Fine Controls'}
              </button>
              
              <span className="text-xs font-mono text-slate-500">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} ready
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Level Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#7C3AED]"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#7C3AED]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED VIDEO HERO BANNER */}
      {/* ============================================================ */}
      {featuredVideo && !searchQuery && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-[#0B172A] border border-white/10 shadow-xl"
          >
            <div className="absolute inset-0 opacity-40">
              <Image
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/90 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC4899]/20 border border-[#EC4899]/40 text-[#F472B6] text-xs font-mono font-bold uppercase mb-3">
                ⭐ Featured Masterclass
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">{featuredVideo.title}</h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-light">{featuredVideo.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-4">
                <span>{featuredVideo.channel}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>{featuredVideo.views} views</span>
                <span className="w-px h-3 bg-white/20" />
                <span>{featuredVideo.duration}</span>
                <span className="w-px h-3 bg-white/20" />
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-pink-300 font-bold">{featuredVideo.level}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedVideo(featuredVideo)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-all flex items-center gap-2 shadow-lg hover:scale-102"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Watch Video Now
                </button>
                <button
                  type="button"
                  onClick={() => toggleWatchlist(featuredVideo.id)}
                  className={`px-4 py-3 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    watchlist.includes(featuredVideo.id)
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {watchlist.includes(featuredVideo.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TRENDING POLYMER MASTERCLASSES */}
      {/* ============================================================ */}
      {!searchQuery && selectedCategory === 'all' && trendingVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EC4899] uppercase tracking-wider">🔥 Popular Right Now</span>
              <h2 className="text-2xl font-black text-[#111827]">Trending Polymer Masterclasses</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingVideos.map((video) => (
              <VideoCardItem
                key={video.id}
                video={video}
                isSaved={watchlist.includes(video.id)}
                onPlay={() => setSelectedVideo(video)}
                onToggleSave={() => toggleWatchlist(video.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* ALL VIDEOS OR GROUPED CATEGORY DISPLAY */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-[#7C3AED] animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Loading 357+ Video Catalog...</p>
          </div>
        ) : groupedVideos && !searchQuery ? (
          // Grouped Section View
          Object.entries(groupedVideos).map(([categoryId, videos]) => {
            const category = CATEGORIES.find(c => c.id === categoryId)
            if (!category || videos.length === 0) return null
            
            return (
              <div key={categoryId} className="mb-12 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider">
                      {category.icon} Sector Breakdown
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#111827]">{category.label}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(categoryId)}
                    className="text-xs font-mono font-bold text-[#7C3AED] hover:underline flex items-center gap-1 uppercase"
                  >
                    View All in {category.label}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <VideoCardItem
                      key={video.id}
                      video={video}
                      isSaved={watchlist.includes(video.id)}
                      onPlay={() => setSelectedVideo(video)}
                      onToggleSave={() => toggleWatchlist(video.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          // Filtered & Search Grid
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider">Curated Catalog</span>
                <h2 className="text-2xl font-black text-[#111827]">
                  {selectedCategory === 'all' ? 'All Videos' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </h2>
                <p className="text-xs font-mono text-slate-500">{filteredVideos.length} lectures matched</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery + selectedLevel + sortBy}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {filteredVideos.map((video, index) => (
                  <VideoCardItem
                    key={video.id}
                    video={video}
                    index={index}
                    isSaved={watchlist.includes(video.id)}
                    onPlay={() => setSelectedVideo(video)}
                    onToggleSave={() => toggleWatchlist(video.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredVideos.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-sm">
                <span className="text-4xl block mb-3">🔍</span>
                <h3 className="text-lg font-bold text-[#111827]">No matching lectures found</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Try relaxing your search query or switching to All Categories.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedLevel('All Levels'); }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-mono font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI TUTOR CTA BANNER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#1A0B2E] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C084FC] text-xs font-mono font-bold uppercase mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#F472B6]" />
                RAG AI Video Copilot
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Confused by any formula or processing parameter in a video?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Tutor for step-by-step mathematical derivations, melt rheology analogies, 
                and shop-floor troubleshooting rules instantly.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ============================================================ */}
      {/* VIDEO MODAL PLAYER */}
      {/* ============================================================ */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-white/10">
              <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                {selectedVideo.subject} &middot; {selectedVideo.level}
              </span>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <VideoPlayer
                video={{
                  id: selectedVideo.id,
                  title: selectedVideo.title,
                  youtubeId: selectedVideo.youtubeId,
                  channel: selectedVideo.channel,
                  duration: selectedVideo.duration,
                  level: selectedVideo.level,
                  subjectSlug: selectedVideo.subjectSlug,
                  lessonSlug: selectedVideo.lessonSlug
                }}
                autoplay={true}
              />

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.15] pb-1">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {selectedVideo.channel} &middot; {selectedVideo.duration} &middot; {selectedVideo.views} views
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedVideo.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
                  {selectedVideo.lessonSlug && (
                    <Link
                      href={`/lessons/${selectedVideo.lessonSlug}`}
                      onClick={() => setSelectedVideo(null)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#6D28D9] transition-all shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read Related Lesson
                    </Link>
                  )}
                  <a
                    href={selectedVideo.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}

// ==================== VIDEO CARD ITEM ====================

function VideoCardItem({ 
  video, 
  index, 
  isSaved, 
  onPlay, 
  onToggleSave 
}: { 
  video: VideoRecord
  index?: number
  isSaved: boolean
  onPlay: () => void
  onToggleSave: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.02 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
    >
      <div 
        onClick={onPlay}
        className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-95"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 text-white text-[10px] font-mono font-bold">
          {video.duration}
        </div>

        {/* Level Badge */}
        <div 
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase shadow-sm"
          style={{
            backgroundColor: video.level === 'Beginner' ? '#10B981' : 
                           video.level === 'Intermediate' ? '#F59E0B' : '#EF4444'
          }}
        >
          {video.level}
        </div>

        {/* Trending Badge */}
        {video.trending && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#EC4899] text-white text-[9px] font-mono font-bold shadow-sm flex items-center gap-1">
            🔥 Hot
          </div>
        )}

        {/* Play Icon Trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-11 h-11 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <Play className="h-5 w-5 text-[#7C3AED] fill-[#7C3AED] ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7C3AED] uppercase block mb-1 truncate">
            {video.subject}
          </span>
          <h3 
            onClick={onPlay}
            className="font-bold text-[#111827] text-xs sm:text-sm line-clamp-2 cursor-pointer group-hover:text-[#7C3AED] transition-colors leading-snug"
          >
            {video.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{video.channel}</p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>{video.views}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {video.duration}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved ? 'bg-pink-50 border-pink-300 text-pink-600' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Saved to watchlist' : 'Add to watchlist'}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onPlay}
              className="px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <Play className="h-3 w-3 fill-white" />
              Play
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
