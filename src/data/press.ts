/** Press coverage + social highlights shown on /news and the footer marquee. */

export type PressKind = 'Article' | 'Video' | 'Reel' | 'Post'

export interface PressItem {
  source: string
  kind: PressKind
  title: string
  href: string
  img: string
  /** Gradient brand tile instead of a photo (e.g. missing thumbnail). */
  branded?: boolean
  /** Optional outlet blurb under the title on the News page. */
  blurb?: string
}

export interface SocialPost {
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'YouTube'
  kind: 'Reel' | 'Post' | 'Video' | 'Update' | 'Image' | 'Carousel'
  title: string
  href: string
  img?: string
  /** Short caption preview */
  caption: string
}

export interface SocialLink {
  label: string
  href: string
  path: string
}

export const pressItems: PressItem[] = [
  {
    source: 'Standard.mv',
    kind: 'Article',
    title: 'Global Ducan brings Indian e-commerce to Maldivian doorsteps',
    href: 'https://standard.mv/global-ducan-brings-indian-e-commerce-to-maldivian-doorsteps/',
    img: '/news/1-standard.jpg',
    blurb: 'How Maldivian shoppers are unlocking Amazon.in, Flipkart and more through proxy shipping.',
  },
  {
    source: 'Maldives Post',
    kind: 'Video',
    title: 'Shop your favourite Indian brands without the hassle',
    href: 'https://www.facebook.com/maldivespost/videos/904808475674841/',
    img: '',
    branded: true,
    blurb: 'National-post partnership spotlight — India to Maldives, door to door.',
  },
  {
    source: 'Bhutan Post',
    kind: 'Video',
    title: 'Shop online with Global Ducan',
    href: 'https://www.facebook.com/bhutanpost11001/videos/643781955130302/',
    img: '/news/3-bhutan.jpg',
    blurb: 'Bhutan Post and Global Ducan on shoppable Indian e-commerce.',
  },
  {
    source: 'Instagram',
    kind: 'Reel',
    title: 'Global Ducan featured on Instagram',
    href: 'https://www.instagram.com/reel/DWodxfPjaZ0/',
    img: '/news/4-instagram.jpg',
    blurb: 'A quick look at shopping India from afar.',
  },
  {
    source: 'Edition.mv',
    kind: 'Article',
    title: "Global Ducan: India's e-commerce marketplace now open to Maldives",
    href: 'https://edition.mv/business/50885',
    img: '/news/5-edition.jpg',
    blurb: 'Business coverage of the Maldives launch and what it means for shoppers.',
  },
  {
    source: 'Maldives Post',
    kind: 'Post',
    title: 'India is now just a click away with Global Ducan',
    href: 'https://www.facebook.com/maldivespost/posts/1339380111548370/',
    img: '/news/6-maldivespost-a.jpg',
    blurb: 'Partner announcement — browse, consolidate, deliver.',
  },
  {
    source: 'Maldives Post',
    kind: 'Post',
    title: 'Shop from the biggest e-commerce platforms in India',
    href: 'https://www.facebook.com/maldivespost/posts/1359492606203787/',
    img: '/news/7-maldivespost-b.jpg',
    blurb: 'Amazon.in, Myntra, Nykaa and more — one overseas cart.',
  },
  {
    source: 'Mauritius Post',
    kind: 'Video',
    title: 'Shop India with Global Ducan — delivered by Mauritius Post',
    href: 'https://www.facebook.com/share/r/14j38PsdGuZ/',
    img: '/news/8-share.jpg',
    blurb: 'Mauritius Post x Global Ducan for last-mile delivery.',
  },
]

/** Curated social highlights shown on /news. */
export const socialPosts: SocialPost[] = [
  {
    platform: 'Instagram',
    kind: 'Reel',
    title: 'Featured reel',
    href: 'https://www.instagram.com/reel/DWodxfPjaZ0/',
    img: '/news/4-instagram.jpg',
    caption: 'Indian e-commerce, delivered to your door — swipe up with @globalducan.',
  },
  {
    platform: 'Facebook',
    kind: 'Video',
    title: 'Maldives Post partnership',
    href: 'https://www.facebook.com/maldivespost/videos/904808475674841/',
    img: '/news/2-maldives.jpg',
    caption: 'Shop your favourite Indian brands without the hassle — with Maldives Post.',
  },
  {
    platform: 'Facebook',
    kind: 'Post',
    title: 'India is a click away',
    href: 'https://www.facebook.com/maldivespost/posts/1339380111548370/',
    img: '/news/6-maldivespost-a.jpg',
    caption: 'Browse Amazon.in, Flipkart and more — consolidate and ship with Ducan.',
  },
  {
    platform: 'Facebook',
    kind: 'Video',
    title: 'Mauritius Post delivery',
    href: 'https://www.facebook.com/share/r/14j38PsdGuZ/',
    img: '/news/8-share.jpg',
    caption: 'From Indian warehouses to Mauritius doorsteps.',
  },
  {
    platform: 'Facebook',
    kind: 'Video',
    title: 'Bhutan Post spotlight',
    href: 'https://www.facebook.com/bhutanpost11001/videos/643781955130302/',
    img: '/news/3-bhutan.jpg',
    caption: 'Shop online from India with Global Ducan + Bhutan Post.',
  },
  {
    platform: 'YouTube',
    kind: 'Update',
    title: 'Watch on YouTube',
    href: 'https://www.youtube.com/@GlobalDucan',
    caption: 'Tutorials, launches and partner stories on @GlobalDucan.',
  },
]

export const socialLinks: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/globalducan/',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.6.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.4 1.4.5 2.6.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.5 2.6-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.4-2.6.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.6-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.4-1.4-.5-2.6-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.5-2.6.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.4 2.6-.5 1.2-.1 1.6-.1 4.8-.1Zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8Zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm5.6-3.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/globalducan/',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/global-ducan/',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@GlobalDucan',
    path: 'M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 7.6.3 7.6.3s4.6 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8ZM9.7 15.1V8.6l6.2 3.3-6.2 3.2Z',
  },
]
