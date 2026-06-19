"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calc(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export function CountdownTimer({ date }: { date: string }) {
  const [t, setT] = useState<TimeLeft>(calc(date))

  useEffect(() => {
    const id = setInterval(() => setT(calc(date)), 1000)
    return () => clearInterval(id)
  }, [date])

  const items = [
    { v: t.days,    l: "дн" },
    { v: t.hours,   l: "ч" },
    { v: t.minutes, l: "мин" },
    { v: t.seconds, l: "сек" },
  ]

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map(({ v, l }) => (
        <div key={l} style={{ textAlign: "center", minWidth: 48 }}>
          <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 22, fontWeight: 700, color: "var(--acid)", lineHeight: 1 }}>
            {String(v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, color: "var(--ds-faint)", marginTop: 3, letterSpacing: "0.06em" }}>{l}</div>
        </div>
      ))}
    </div>
  )
}
