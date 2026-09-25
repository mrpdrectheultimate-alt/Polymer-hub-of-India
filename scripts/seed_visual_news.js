import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const photoRegistry = JSON.parse(fs.readFileSync('src/lib/verified_photo_registry.json', 'utf8'))

async function updateVisualNewsData() {
  console.log('🚀 Executing Daily Updates Visual System Photo Data Upgrade...')

  const { data: updates, error } = await supabase
    .from('daily_updates')
    .select('*')

  if (error) {
    console.error('Error fetching daily_updates:', error)
    return
  }

  console.log(`Fetched ${updates.length} daily updates records. Enriching image_url & image_credit...`)
  let updatedCount = 0

  for (let idx = 0; idx < updates.length; idx++) {
    const item = updates[idx]
    const category = item.category || 'Research'

    // Find category photo from registry
    const categoryPhotos = photoRegistry.filter(p => p.category === category)
    const photo = categoryPhotos[idx % categoryPhotos.length] || photoRegistry[idx % photoRegistry.length]

    const updatesPayload = {
      image_url: photo.url,
      image_credit: photo.credit
    }

    const { error: updateErr } = await supabase
      .from('daily_updates')
      .update(updatesPayload)
      .eq('id', item.id)

    if (updateErr) {
      console.error(`Failed to update item ${item.id}:`, updateErr)
    } else {
      console.log(`✅ Updated update "${item.headline.slice(0, 40)}..." -> Photo: ${photo.credit}`)
      updatedCount++
    }
  }

  console.log(`\n🎉 Success! Successfully enriched ${updatedCount}/${updates.length} daily_updates records with category-matched verified photos!`)
}

updateVisualNewsData()
