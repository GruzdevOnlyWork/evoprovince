"use client"

import Link from "next/link"
import { useReveal } from "@/hooks/use-reveal"
import { Icon } from "@/lib/icons"

const STATS = [
  { label: "лет на улице", value: "12" },
  { label: "воспитанников", value: "640+" },
  { label: "медалей", value: "38" },
  { label: "площадок", value: "5" },
]

export function HeroSection() {
  useReveal()

  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", paddingBottom: "10vh", overflow: "hidden" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(to bottom, rgba(11,11,12,0.35) 0%, rgba(11,11,12,0.7) 60%, rgba(11,11,12,0.95) 100%), url('/street-workout-training-pull-up-bar-athletes.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)" }}>
        {/* Eyebrow */}
        <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <span style={{ width: 24, height: 1, background: "var(--acid)", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
            Уличный воркаут · с 2014 года
          </span>
        </div>

        {/* H1 */}
        <h1 className="reveal" data-d="1" style={{ fontFamily: "var(--font-anton, Anton)", lineHeight: 0.92, marginBottom: 32, letterSpacing: "0.01em" }}>
          <span style={{ display: "block", fontSize: "clamp(72px, 12vw, 160px)", color: "transparent", WebkitTextStroke: "2px var(--ds-white)" }}>ЭВОЛЮЦИЯ</span>
          <span style={{ display: "block", fontSize: "clamp(72px, 12vw, 160px)", color: "var(--ds-white)" }}>ПРОВИНЦИИ</span>
        </h1>

        {/* Buttons — informational only */}
        <div className="reveal" data-d="2" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 64 }}>
          <Link
            href="/services"
            className="btn-acid"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}
          >
            Программы тренировок <Icon name="arrow" size={16} sw={2} />
          </Link>
          <Link
            href="/schedule"
            className="btn-ghost-line"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", color: "var(--ds-white)", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}
          >
            Расписание
          </Link>
        </div>

        {/* Stats */}
        <div className="reveal" data-d="3" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, paddingTop: 32, borderTop: "1px solid var(--line)", maxWidth: 560 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1, color: "var(--acid)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--ds-muted)", marginTop: 4, letterSpacing: "0.03em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
