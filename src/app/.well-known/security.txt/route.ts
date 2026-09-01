import { NextResponse } from 'next/server'

export async function GET() {
  const content = [
    'Contact: mailto:security@polymerhubofindia.com',
    'Expires: 2027-09-01T00:00:00.000Z',
    'Preferred-Languages: en, hi',
    'Canonical: https://polymerhubofindia.com/.well-known/security.txt',
    'Policy: https://polymerhubofindia.com/terms',
  ].join('\n') + '\n'

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
