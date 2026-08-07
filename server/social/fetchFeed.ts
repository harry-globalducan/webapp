/**
 * Server-only social feed fetcher (Meta Graph + optional LinkedIn).
 * Never import this from client React code — tokens live in process.env.
 */

export type SocialPlatform = 'Instagram' | 'Facebook' | 'LinkedIn'

export interface LiveSocialPost {
  id: string
  platform: SocialPlatform
  kind: 'Reel' | 'Post' | 'Video' | 'Image' | 'Carousel' | 'Update'
  title: string
  caption: string
  href: string
  img?: string
  publishedAt?: string
}

export interface SocialFeedResult {
  posts: LiveSocialPost[]
  sources: { platform: SocialPlatform; ok: boolean; detail?: string }[]
}

const GRAPH_VERSION = process.env.META_GRAPH_VERSION?.trim() || 'v21.0'
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`

function truncate(text: string, max = 140): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function firstLine(text: string): string {
  const line = text.split('\n').map((s) => s.trim()).find(Boolean) ?? ''
  return truncate(line || 'New post', 80)
}

async function graphGet<T>(path: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${GRAPH}${path.startsWith('/') ? path : `/${path}`}`)
  url.searchParams.set('access_token', token)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString())
  const body = (await res.json()) as T & { error?: { message?: string } }
  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `Graph API ${res.status}`)
  }
  return body
}

type FbPost = {
  id: string
  message?: string
  story?: string
  full_picture?: string
  permalink_url?: string
  created_time?: string
  status_type?: string
}

type IgMedia = {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp?: string
}

function mapFacebook(p: FbPost): LiveSocialPost | null {
  const caption = (p.message || p.story || '').trim()
  if (!caption && !p.full_picture) return null
  const kind: LiveSocialPost['kind'] =
    p.status_type === 'added_video' ? 'Video' : p.full_picture ? 'Image' : 'Post'
  return {
    id: `fb:${p.id}`,
    platform: 'Facebook',
    kind,
    title: firstLine(caption || 'Facebook post'),
    caption: truncate(caption || 'View on Facebook'),
    href: p.permalink_url || `https://www.facebook.com/${p.id}`,
    img: p.full_picture,
    publishedAt: p.created_time,
  }
}

function mapInstagram(m: IgMedia): LiveSocialPost | null {
  const caption = (m.caption || '').trim()
  const type = (m.media_type || '').toUpperCase()
  const kind: LiveSocialPost['kind'] =
    type === 'VIDEO' || type === 'REELS'
      ? 'Reel'
      : type === 'CAROUSEL_ALBUM'
        ? 'Carousel'
        : type === 'IMAGE'
          ? 'Image'
          : 'Post'
  const img = m.thumbnail_url || m.media_url
  if (!caption && !img) return null
  return {
    id: `ig:${m.id}`,
    platform: 'Instagram',
    kind,
    title: firstLine(caption || 'Instagram post'),
    caption: truncate(caption || 'View on Instagram'),
    href: m.permalink || 'https://www.instagram.com/globalducan/',
    img,
    publishedAt: m.timestamp,
  }
}

async function fetchFacebook(token: string, pageId: string, limit: number): Promise<LiveSocialPost[]> {
  const data = await graphGet<{ data?: FbPost[] }>(`/${pageId}/posts`, token, {
    fields: 'id,message,story,full_picture,permalink_url,created_time,status_type',
    limit: String(limit),
  })
  return (data.data ?? []).map(mapFacebook).filter((p): p is LiveSocialPost => Boolean(p))
}

async function resolveIgUserId(token: string, pageId: string): Promise<string> {
  const fromEnv = process.env.META_IG_USER_ID?.trim()
  if (fromEnv) return fromEnv
  const page = await graphGet<{ instagram_business_account?: { id?: string } }>(`/${pageId}`, token, {
    fields: 'instagram_business_account',
  })
  const id = page.instagram_business_account?.id
  if (!id) throw new Error('No Instagram Business account linked to this Facebook Page.')
  return id
}

async function fetchInstagram(token: string, pageId: string, limit: number): Promise<LiveSocialPost[]> {
  const igId = await resolveIgUserId(token, pageId)
  const data = await graphGet<{ data?: IgMedia[] }>(`/${igId}/media`, token, {
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
    limit: String(limit),
  })
  return (data.data ?? []).map(mapInstagram).filter((p): p is LiveSocialPost => Boolean(p))
}

/** LinkedIn org posts — requires Marketing Developer Platform approval. */
async function fetchLinkedIn(limit: number): Promise<LiveSocialPost[]> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN?.trim()
  const orgId = process.env.LINKEDIN_ORG_ID?.trim()
  if (!token || !orgId) {
    throw new Error('LINKEDIN_ACCESS_TOKEN / LINKEDIN_ORG_ID not set')
  }
  const author = encodeURIComponent(`urn:li:organization:${orgId}`)
  const url = `https://api.linkedin.com/rest/posts?author=${author}&q=author&count=${limit}&sortBy=LAST_MODIFIED`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'LinkedIn-Version': process.env.LINKEDIN_API_VERSION?.trim() || '202405',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })
  const body = (await res.json()) as {
    elements?: Array<{
      id?: string
      commentary?: string
      createdAt?: number
    }>
    message?: string
  }
  if (!res.ok) throw new Error(body.message || `LinkedIn API ${res.status}`)

  return (body.elements ?? []).map((el) => {
    const caption = (el.commentary || '').trim()
    return {
      id: `li:${el.id ?? caption.slice(0, 24)}`,
      platform: 'LinkedIn' as const,
      kind: 'Update' as const,
      title: firstLine(caption || 'LinkedIn update'),
      caption: truncate(caption || 'View on LinkedIn'),
      href: 'https://www.linkedin.com/company/global-ducan/',
      publishedAt: el.createdAt ? new Date(el.createdAt).toISOString() : undefined,
    }
  })
}

/**
 * Pull recent posts. Missing credentials soft-fail per platform so the page
 * can still show whatever sources are configured.
 */
export async function fetchSocialFeed(limitPerPlatform = 6): Promise<SocialFeedResult> {
  const token = process.env.META_PAGE_ACCESS_TOKEN?.trim()
  const pageId = process.env.META_PAGE_ID?.trim()
  const sources: SocialFeedResult['sources'] = []
  const batches: LiveSocialPost[][] = []

  if (!token || !pageId) {
    sources.push({
      platform: 'Facebook',
      ok: false,
      detail: 'Set META_PAGE_ACCESS_TOKEN and META_PAGE_ID',
    })
    sources.push({
      platform: 'Instagram',
      ok: false,
      detail: 'Requires the same Meta Page token + linked IG Business account',
    })
  } else {
    try {
      const fb = await fetchFacebook(token, pageId, limitPerPlatform)
      batches.push(fb)
      sources.push({ platform: 'Facebook', ok: true, detail: `${fb.length} posts` })
    } catch (e) {
      sources.push({
        platform: 'Facebook',
        ok: false,
        detail: e instanceof Error ? e.message : 'Facebook fetch failed',
      })
    }
    try {
      const ig = await fetchInstagram(token, pageId, limitPerPlatform)
      batches.push(ig)
      sources.push({ platform: 'Instagram', ok: true, detail: `${ig.length} posts` })
    } catch (e) {
      sources.push({
        platform: 'Instagram',
        ok: false,
        detail: e instanceof Error ? e.message : 'Instagram fetch failed',
      })
    }
  }

  try {
    const li = await fetchLinkedIn(limitPerPlatform)
    batches.push(li)
    sources.push({ platform: 'LinkedIn', ok: true, detail: `${li.length} posts` })
  } catch (e) {
    sources.push({
      platform: 'LinkedIn',
      ok: false,
      detail: e instanceof Error ? e.message : 'LinkedIn fetch failed',
    })
  }

  const posts = batches
    .flat()
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, limitPerPlatform * 3)

  return { posts, sources }
}
