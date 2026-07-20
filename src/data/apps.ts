/** Official mobile app store links for Global Ducan. */
export const appStores = {
  ios: {
    label: 'App Store',
    href: 'https://apps.apple.com/us/app/global-ducan/id6754620719',
    platform: 'iOS',
  },
  android: {
    label: 'Google Play',
    href: 'https://play.google.com/store/apps/details?id=com.globalducan.ducan',
    platform: 'Android',
  },
  /** Landing page that lists both stores — used for the desktop QR. */
  landing: 'https://globalducan.com/apps',
} as const

/** Chrome extension — update when the Web Store listing URL is final. */
export const chromeExtension = {
  label: 'Add to Chrome',
  href: 'https://chromewebstore.google.com/',
} as const

export function qrCodeUrl(data: string, size = 160) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`
}

