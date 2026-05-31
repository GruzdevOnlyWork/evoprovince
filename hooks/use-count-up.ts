"use client"

import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1100
          const startTime = performance.now()

          const tick = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setCount(Math.round(eased * target))
            if (p < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return { count, ref }
}
