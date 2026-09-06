// scripts/seed_digital_library_v3.mjs — Seed Supabase with Digital Library v3 Schema & 4-Class Legal Classification
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

console.log('🚀 Seeding Supabase Digital Library v3 Tables...')

async function seedLibrary() {
  const { ALL_LIBRARY_BOOKS } = await import('../src/lib/library_data.ts')

  console.log(`Found ${ALL_LIBRARY_BOOKS.length} books in library dataset.`)

  for (const book of ALL_LIBRARY_BOOKS) {
    console.log(`\n📚 Processing [${book.legal_class}] ${book.title}...`)

    // 1. Prepare base row matching standard Supabase columns
    const bookRow = {
      id: book.id,
      slug: book.slug,
      title: book.title,
      authors: book.authors,
      cover_url: book.cover_url,
      category: book.category,
      difficulty: book.difficulty,
      focus: book.focus,
      summary: book.summary,
      purchase_url: book.purchase_url || null,
      file_url: book.file_url || null,
      careers: book.careers || [],
      subject_slugs: book.subject_slugs || [],
      toc: book.toc || [],
      chapters: book.legal_class === 'Class A' ? (book.chapters || {}) : {}
    }

    const { error: bookErr } = await supabase
      .from('library_books')
      .upsert(bookRow, { onConflict: 'slug' })

    if (bookErr) {
      console.error(`❌ Failed to upsert book ${book.slug}:`, bookErr.message)
      continue
    }
    console.log(`   ✅ Book upserted successfully: ${book.slug}`)

    // 2. Insert chapters if present (For Class A originals)
    if (book.toc && book.toc.length > 0) {
      for (let i = 0; i < book.toc.length; i++) {
        const item = book.toc[i]
        const chCode = item.id
        const chId = `${book.id}-${chCode}`

        const chRow = {
          id: chId,
          book_id: book.id,
          chapter_number: i + 1,
          chapter_code: chCode,
          slug: chCode,
          title: item.title,
          summary: `Summary of ${item.title}`
        }

        const { error: chErr } = await supabase
          .from('library_chapters')
          .upsert(chRow, { onConflict: 'book_id,chapter_code' })

        if (chErr) {
          // If library_chapters table doesn't exist yet in Supabase schema cache, log info
          console.log(`   ℹ️ Chapter metadata info [${chCode}]:`, chErr.message)
        } else {
          console.log(`   ✅ Chapter upserted: ${chCode}`)
        }
      }
    }
  }

  console.log('\n🎉 Digital Library v3 Database Seeding Complete!')
}

seedLibrary().catch(err => {
  console.error('Fatal seed error:', err)
})
