import fs from 'fs'

let content = fs.readFileSync('src/lib/library_data.ts', 'utf8')

const covers = {
  'fundamentals-polymer-engineering-kumar-free': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
  'elements-polymer-science-rudin-free': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80',
  'polymer-science-gowariker-free': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80',
  'fundamentals-plastics-mould-design-nayak-free': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
  'epa-recycling-manual': 'https://images.unsplash.com/photo-1532996127008-05dedf1cf8d3?w=600&q=80',
  'nasa-composites-standard': 'https://images.unsplash.com/photo-1517976487541-11c50587d60a?w=800&auto=format&fit=crop&q=80',
  'introduction-to-polymers-young-lovell': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
  'principles-polymerization-odian': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80',
  'textbook-polymer-science-billmeyer': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
  'rosato': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
  'allen-baker': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
  'kutz': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  'bhatnagar-polymer-chemistry': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
  'polymer-extrusion-rauwendaal': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
  'injection-molding-handbook-rosato': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
}

for (const [slug, coverUrl] of Object.entries(covers)) {
  const target = `slug: '${slug}',`
  if (content.includes(target)) {
    content = content.replace(target, `${target}\n    cover_url: '${coverUrl}',`)
  }
}

fs.writeFileSync('src/lib/library_data.ts', content, 'utf8')
console.log('Cover URLs added successfully!')
