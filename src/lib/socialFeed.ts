/** Client helper for GET /api/social/feed (server holds Meta/LinkedIn tokens). */

export type LivePlatform = 'Instagram' | 'Facebook' | 'LinkedIn'

export interface LiveSocialPost {
  id: string
  platform: LivePlatform
  kind: string
  title: string
  caption: string
  href: string
  img?: string
  publishedAt?: string
}

export interface SocialFeedResponse {
  posts: LiveSocialPost[]
  sources: { platform: LivePlatform; ok: boolean; detail?: string }[]
  error?: string
}

export async function loadSocialFeed(): Promise<SocialFeedResponse> {
  const res = await fetch('/api/social/feed')
  if (!res.ok) {
    throw new Error(`Social feed HTTP ${res.status}`)
  }
  return (await res.json()) as SocialFeedResponse
}
