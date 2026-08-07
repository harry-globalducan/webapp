import { fetchSocialFeed } from '../../server/social/fetchFeed'

export const config = { runtime: 'edge' }

/**
 * GET /api/social/feed — live Facebook / Instagram (/ LinkedIn) posts.
 * Tokens stay in server env (META_*, LINKEDIN_*) — never VITE_*.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    })
  }

  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const result = await fetchSocialFeed(6)
    return Response.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=900',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return Response.json(
      {
        posts: [],
        sources: [],
        error: e instanceof Error ? e.message : 'Could not load social feed',
      },
      {
        status: 200,
        headers: { 'Cache-Control': 's-maxage=60', 'Access-Control-Allow-Origin': '*' },
      },
    )
  }
}
