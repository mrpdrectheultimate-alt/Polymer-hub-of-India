import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  const videoIdParam = request.nextUrl.searchParams.get('id')

  const targetUrl = url || (videoIdParam ? `https://www.youtube.com/watch?v=${videoIdParam}` : null)

  if (!targetUrl) {
    return NextResponse.json({ error: 'No video URL or ID provided' }, { status: 400 })
  }

  try {
    const ytId = extractYouTubeId(targetUrl)
    if (ytId) {
      // Validate via YouTube oEmbed
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`, {
        method: 'GET',
        headers: { 'User-Agent': 'PolymerHub-HealthChecker/3.0' }
      })
      const isAvailable = response.ok
      return NextResponse.json({
        available: isAvailable,
        videoId: ytId,
        source: 'youtube',
        status: isAvailable ? 200 : response.status
      })
    }

    const vimeoId = extractVimeoId(targetUrl)
    if (vimeoId) {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`, {
        method: 'GET',
        headers: { 'User-Agent': 'PolymerHub-HealthChecker/3.0' }
      })
      return NextResponse.json({
        available: response.ok,
        videoId: vimeoId,
        source: 'vimeo',
        status: response.status
      })
    }

    // Direct / archive video check
    if (targetUrl.startsWith('http')) {
      const headRes = await fetch(targetUrl, { method: 'HEAD' })
      return NextResponse.json({
        available: headRes.ok,
        source: 'direct',
        status: headRes.status
      })
    }

    return NextResponse.json({ available: false, error: 'Unsupported video source' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ available: false, error: String(error) }, { status: 500 })
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
    /(?:youtube\.com\/v\/)([^?&]+)/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  return null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/)
  return match ? match[1] : null
}
