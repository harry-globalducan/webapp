import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  /** Rendered around the number, e.g. "$" */
  prefix?: string
  decimals?: number
  className?: string
  durationMs?: number
}

/** Animates numeric changes with an ease-out count. Uses tabular figures. */
export default function CountUp({
  value,
  prefix = '',
  decimals = 2,
  className = '',
  durationMs = 600,
}: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const frameRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    if (from === value) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, durationMs])

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display.toFixed(decimals)}
    </span>
  )
}
