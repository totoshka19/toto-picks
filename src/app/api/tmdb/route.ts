import { type NextRequest, NextResponse } from 'next/server'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Allowlist of TMDB path prefixes — prevents SSRF to arbitrary URLs.
// Any endpoint not starting with one of these is rejected with 403.
const ALLOWED_PREFIXES = [
  '/trending/',
  '/movie/',
  '/tv/',
  '/search/',
  '/discover/',
  '/genre/',
  '/configuration/',
  '/person/',
]

/**
 * GET /api/tmdb
 *
 * Thin proxy that injects the server-only TMDB_API_KEY before forwarding
 * the request to api.themoviedb.org. The key is never sent to the browser.
 *
 * Query params:
 *   _endpoint — TMDB path, e.g. "/movie/popular"   (reserved, stripped before forwarding)
 *   …rest     — forwarded as-is to TMDB (language, page, sort_by, …)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get('_endpoint')

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing _endpoint param' }, { status: 400 })
  }

  if (!ALLOWED_PREFIXES.some((prefix) => endpoint.startsWith(prefix))) {
    return NextResponse.json({ error: 'Forbidden endpoint' }, { status: 403 })
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  // Build TMDB URL — inject key, forward all other params unchanged
  const tmdbParams = new URLSearchParams({ api_key: apiKey })
  searchParams.forEach((value, key) => {
    if (key !== '_endpoint') tmdbParams.set(key, value)
  })

  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${tmdbParams}`, {
      next: { revalidate: 3600 }, // Data Cache — same TTL as direct server calls
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB error: ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        // Allow browsers / CDN to cache the response for 1 h,
        // serve stale for up to 24 h while revalidating in background
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach TMDB' }, { status: 502 })
  }
}
