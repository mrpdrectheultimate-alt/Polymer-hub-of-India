// scripts/seed_industry_events.mjs
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load ALL_VERIFIED_INDUSTRY_EVENTS
const fileContent = fs.readFileSync('src/lib/industry_events_data.ts', 'utf8');

// Parse events from the TS file
function extractAllEvents() {
  const events = [];
  const regex = /{\r?\n\s*id:\s*'([^']+)',\r?\n\s*title:\s*'([^']+)',\r?\n\s*shortTitle:\s*'([^']+)',\r?\n\s*slug:\s*'([^']+)',\r?\n\s*startDate:\s*'([^']+)',\r?\n\s*endDate:\s*'([^']+)',\r?\n\s*dateDisplay:\s*'([^']+)',\r?\n\s*monthYearBadge:\s*'([^']+)',\r?\n\s*city:\s*'([^']+)',\r?\n\s*state:\s*'([^']+)',\r?\n\s*venue:\s*'([^']+)',\r?\n\s*focus:\s*'([^']+)',\r?\n\s*focusTags:\s*(\[[^\]]+\]),\r?\n\s*organizer:\s*'([^']+)',\r?\n\s*sourceName:\s*'([^']+)',\r?\n\s*sourceUrl:\s*'([^']+)',\r?\n\s*lastVerified:\s*'([^']+)',\r?\n\s*eventType:\s*'([^']+)',\r?\n\s*priorityBadge:\s*'([^']+)',\r?\n\s*isAnchorEvent:\s*(true|false),/g;

  let m;
  while ((m = regex.exec(fileContent)) !== null) {
    events.push({
      id: m[1],
      title: m[2],
      short_title: m[3],
      slug: m[4],
      start_date: m[5],
      end_date: m[6],
      date_display: m[7],
      month_year_badge: m[8],
      city: m[9],
      state: m[10],
      venue: m[11],
      focus: m[12],
      focus_tags: JSON.parse(m[13].replace(/'/g, '"')),
      organizer: m[14],
      source_name: m[15],
      source_url: m[16],
      last_verified: m[17],
      event_type: m[18],
      priority_badge: m[19],
      is_anchor_event: m[20] === 'true',
      is_active: true
    });
  }
  return events;
}

const events = extractAllEvents();
console.log(`Extracted ${events.length} events from industry_events_data.ts`);

// Generate SQL INSERT statements
let sqlInserts = '\n-- Seed all 26 verified industry exhibitions\n';
sqlInserts += 'INSERT INTO public.industry_events (\n';
sqlInserts += '  id, title, short_title, slug, start_date, end_date, date_display, month_year_badge,\n';
sqlInserts += '  city, state, venue, focus, focus_tags, organizer, source_name, source_url,\n';
sqlInserts += '  last_verified, event_type, priority_badge, is_anchor_event, is_active\n';
sqlInserts += ') VALUES\n';

const values = events.map(e => {
  const esc = (s) => "'" + String(s).replace(/'/g, "''") + "'";
  return `  (${esc(e.id)}, ${esc(e.title)}, ${esc(e.short_title)}, ${esc(e.slug)}, ${esc(e.start_date)}, ${esc(e.end_date)}, ${esc(e.date_display)}, ${esc(e.month_year_badge)}, ${esc(e.city)}, ${esc(e.state)}, ${esc(e.venue)}, ${esc(e.focus)}, '${JSON.stringify(e.focus_tags)}'::jsonb, ${esc(e.organizer)}, ${esc(e.source_name)}, ${esc(e.source_url)}, ${esc(e.last_verified)}, ${esc(e.event_type)}, ${esc(e.priority_badge)}, ${e.is_anchor_event}, true)`;
});

sqlInserts += values.join(',\n') + '\n';
sqlInserts += 'ON CONFLICT (slug) DO UPDATE SET\n';
sqlInserts += '  title = EXCLUDED.title,\n';
sqlInserts += '  short_title = EXCLUDED.short_title,\n';
sqlInserts += '  start_date = EXCLUDED.start_date,\n';
sqlInserts += '  end_date = EXCLUDED.end_date,\n';
sqlInserts += '  date_display = EXCLUDED.date_display,\n';
sqlInserts += '  venue = EXCLUDED.venue,\n';
sqlInserts += '  city = EXCLUDED.city,\n';
sqlInserts += '  state = EXCLUDED.state,\n';
sqlInserts += '  focus = EXCLUDED.focus,\n';
sqlInserts += '  focus_tags = EXCLUDED.focus_tags,\n';
sqlInserts += '  organizer = EXCLUDED.organizer,\n';
sqlInserts += '  source_url = EXCLUDED.source_url,\n';
sqlInserts += '  last_verified = EXCLUDED.last_verified,\n';
sqlInserts += '  updated_at = now();\n';

fs.appendFileSync('supabase/migrations/20261111000002_create_and_seed_industry_events.sql', sqlInserts, 'utf8');
console.log('Appended SQL seed statements to migration file.');

// Also try to seed Supabase directly if table exists
async function tryDirectSupabaseSeed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.log('Missing Supabase credentials, skipping direct seed.');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.from('industry_events').upsert(events, { onConflict: 'slug' });
  if (error) {
    console.log('Direct Supabase upsert note:', error.message);
  } else {
    console.log('Direct Supabase seed successful! Synced', events.length, 'records.');
  }
}

tryDirectSupabaseSeed();
