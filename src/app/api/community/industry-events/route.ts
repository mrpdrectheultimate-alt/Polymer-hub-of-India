import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import {
  ALL_VERIFIED_INDUSTRY_EVENTS,
  IndustryEvent,
  partitionIndustryEvents,
  computeEventStatus
} from '@/lib/industry_events_data'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/admin'

const CUSTOM_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'industry_events_custom.json')

interface CustomStore {
  last_synced: string
  overrides: Record<string, Partial<IndustryEvent>>
  custom_events: IndustryEvent[]
  deleted_ids?: string[]
}

function readCustomStore(): CustomStore {
  try {
    if (fs.existsSync(CUSTOM_FILE_PATH)) {
      const data = fs.readFileSync(CUSTOM_FILE_PATH, 'utf8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('Error reading custom industry events store:', err)
  }
  return { last_synced: new Date().toISOString(), overrides: {}, custom_events: [], deleted_ids: [] }
}

function writeCustomStore(store: CustomStore): void {
  try {
    store.last_synced = new Date().toISOString()
    fs.writeFileSync(CUSTOM_FILE_PATH, JSON.stringify(store, null, 2), 'utf8')
  } catch (err) {
    console.error('Error writing custom industry events store:', err)
  }
}

// Helper to get merged events list
function getMergedEvents(): IndustryEvent[] {
  const store = readCustomStore()
  const deletedSet = new Set(store.deleted_ids || [])

  // Start with built-in master registry
  const merged: IndustryEvent[] = ALL_VERIFIED_INDUSTRY_EVENTS
    .filter(ev => !deletedSet.has(ev.id) && !deletedSet.has(ev.slug))
    .map(ev => {
      const override = store.overrides[ev.id] || store.overrides[ev.slug]
      if (override) {
        return { ...ev, ...override }
      }
      return ev
    })

  // Append custom admin-added events
  for (const cev of store.custom_events) {
    if (!deletedSet.has(cev.id) && !deletedSet.has(cev.slug)) {
      const override = store.overrides[cev.id] || store.overrides[cev.slug]
      merged.push(override ? { ...cev, ...override } : cev)
    }
  }

  return merged
}

// GET /api/community/industry-events — Retrieve all industry exhibitions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const asOfParam = searchParams.get('asOf')
    const asOfDate = asOfParam ? new Date(asOfParam) : new Date()

    const allEvents = getMergedEvents()
    const { live, upcoming, concluded } = partitionIndustryEvents(allEvents, asOfDate)

    return NextResponse.json({
      success: true,
      events: allEvents,
      partitioned: {
        upcoming,
        concluded,
        live
      },
      stats: {
        total: allEvents.length,
        upcoming: upcoming.length,
        concluded: concluded.length,
        live: live.length
      },
      source: 'authoritative_registry',
      asOfDate: asOfDate.toISOString().slice(0, 10)
    })
  } catch (err) {
    console.error('Failed to get industry events:', err)
    return NextResponse.json({ error: 'Failed to retrieve industry events' }, { status: 500 })
  }
}

// POST /api/community/industry-events — Add new exhibition (Admin authorized)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = isUserAdmin(user, profile)
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Administrative clearance required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      shortTitle,
      startDate,
      endDate,
      dateDisplay,
      city,
      state,
      venue,
      focus,
      focusTags,
      organizer,
      sourceName,
      sourceUrl,
      eventType = 'Exhibition & Expo',
      priorityBadge = 'P1 Regional',
      isAnchorEvent = false,
      idealFor = [],
      whatToSee = [],
      studentMode = {}
    } = body

    if (!title || !startDate || !endDate || !city || !venue) {
      return NextResponse.json(
        { error: 'Missing required event fields: title, startDate, endDate, city, venue' },
        { status: 400 }
      )
    }

    const generatedSlug = (shortTitle || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const newEvent: IndustryEvent = {
      id: `custom-event-${Date.now()}`,
      title,
      shortTitle: shortTitle || title,
      slug: generatedSlug,
      startDate,
      endDate,
      dateDisplay: dateDisplay || `${startDate} to ${endDate}`,
      monthYearBadge: new Date(startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
      city,
      state: state || 'India',
      venue,
      focus: focus || 'Plastics & polymer engineering showcase',
      focusTags: Array.isArray(focusTags) && focusTags.length ? focusTags : ['Polymer Exhibition'],
      organizer: organizer || 'Industry Organizing Committee',
      sourceName: sourceName || 'Official Organizer Press Release',
      sourceUrl: sourceUrl || 'https://polymerhubofindia.com',
      lastVerified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      eventType,
      priorityBadge,
      isAnchorEvent,
      idealFor: Array.isArray(idealFor) && idealFor.length ? idealFor : ['Polymer Engineers & Industry Delegates'],
      whatToSee: Array.isArray(whatToSee) && whatToSee.length ? whatToSee : [
        { step: '01', title: 'Exhibition Highlights', desc: focus || 'Key industry exhibits' }
      ],
      studentMode: {
        advice: studentMode.advice || 'Attend with professional CV and student credentials.',
        keyPavilions: Array.isArray(studentMode.keyPavilions) ? studentMode.keyPavilions : ['Main Machinery & Materials Hall'],
        networkingTip: studentMode.networkingTip || 'Engage directly with stall engineers on product specifications.'
      }
    }

    const store = readCustomStore()
    store.custom_events.push(newEvent)
    writeCustomStore(store)

    return NextResponse.json({
      success: true,
      message: 'New exhibition successfully published',
      event: newEvent
    })
  } catch (err) {
    console.error('Failed to create industry event:', err)
    return NextResponse.json({ error: 'Failed to create industry event' }, { status: 500 })
  }
}

// PATCH /api/community/industry-events — Update dates, venue, or fields of an exhibition
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = isUserAdmin(user, profile)
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Administrative clearance required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, slug, updates } = body

    const targetKey = id || slug
    if (!targetKey || !updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Event id/slug and updates object are required' }, { status: 400 })
    }

    const store = readCustomStore()
    store.overrides[targetKey] = {
      ...(store.overrides[targetKey] || {}),
      ...updates,
      lastVerified: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    // If dates changed, update monthYearBadge if not explicitly supplied
    if (updates.startDate && !updates.monthYearBadge) {
      store.overrides[targetKey].monthYearBadge = new Date(updates.startDate)
        .toLocaleString('en-US', { month: 'short', year: 'numeric' })
        .toUpperCase()
    }

    writeCustomStore(store)

    const allEvents = getMergedEvents()
    const updated = allEvents.find(e => e.id === targetKey || e.slug === targetKey)

    return NextResponse.json({
      success: true,
      message: 'Exhibition details updated successfully',
      event: updated
    })
  } catch (err) {
    console.error('Failed to update industry event:', err)
    return NextResponse.json({ error: 'Failed to update industry event' }, { status: 500 })
  }
}

// DELETE /api/community/industry-events — Archive/Delete an exhibition
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = isUserAdmin(user, profile)
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Administrative clearance required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event id is required' }, { status: 400 })
    }

    const store = readCustomStore()
    store.deleted_ids = Array.from(new Set([...(store.deleted_ids || []), id]))
    writeCustomStore(store)

    return NextResponse.json({
      success: true,
      message: 'Event removed from active feed',
      deletedId: id
    })
  } catch (err) {
    console.error('Failed to delete industry event:', err)
    return NextResponse.json({ error: 'Failed to delete industry event' }, { status: 500 })
  }
}

