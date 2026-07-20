interface LogoProps {
  className?: string
  /** Kept for API compat — official mark already includes the tagline. */
  tagline?: boolean
}

/** Official Global Ducan wordmark (blue / green / orange). */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/logo-global-ducan.png"
      alt="Global Ducan — e-commerce globalized"
      className={`h-10 w-auto sm:h-11 ${className}`}
      width={220}
      height={72}
      decoding="async"
    />
  )
}
