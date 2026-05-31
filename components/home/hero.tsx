"use client"

import Link from "next/link"
import { Icon } from "@/lib/icons"

export function HeroSection() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", paddingBottom: "10vh", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(to bottom, rgba(11,11,12,0.35) 0%, rgba(11,11,12,0.7) 60%, rgba(11,11,12,0.95) 100%), url('/street-workout-training-pull-up-bar-athletes.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)" }}>
        <h1 style={{ fontFamily: "var(--font-anton, Anton)", lineHeight: 0.92, marginBottom: 40, letterSpacing: "0.01em" }}>
          <span style={{ display: "block", fontSize: "clamp(72px, 12vw, 160px)", color: "transparent", WebkitTextStroke: "2px var(--ds-white)" }}>ЭВОЛЮЦИЯ</span>
          <span style={{ display: "block", fontSize: "clamp(72px, 12vw, 160px)", color: "var(--ds-white)" }}>ПРОВИНЦИИ</span>
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/services" className="btn-acid" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Программы тренировок <Icon name="arrow" size={16} sw={2} />
          </Link>
          <Link href="/schedule" className="btn-ghost-line" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", color: "var(--ds-white)", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Расписание
          </Link>
        </div>
      </div>
    </section>
  )
}
