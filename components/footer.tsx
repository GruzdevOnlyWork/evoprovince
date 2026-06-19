"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Icon } from "@/lib/icons"

const LINKS = [
  { href: "/services",    label: "Программы" },
  { href: "/schedule",    label: "Расписание" },
  { href: "/news",        label: "Новости" },
  { href: "/tournaments", label: "Турниры" },
  { href: "/judging",     label: "Судейство" },
]

export function Footer() {
  const year = new Date().getFullYear()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const SOCIALS = [
    { href: "https://vk.com/evoprovince", label: "VK", icon: "vk" as const },
  ]

  return (
    <footer style={{ background: "var(--ink-2)", borderTop: "1px solid var(--line)", position: "relative" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: 16 }}>
              <img src="/logo.png" alt="Эволюция Провинции" height={32} style={{ height: 32, width: "auto", display: "block" }} />
            </Link>
            <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.7, maxWidth: 240 }}>
              Бесплатная секция уличного воркаута. Тренировки и соревнования для всех возрастов.
            </p>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-faint)", textTransform: "uppercase", marginBottom: 16 }}>
              Навигация
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: 14, color: "var(--ds-muted)", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ds-white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ds-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-faint)", textTransform: "uppercase", marginBottom: 16 }}>
              Контакты
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Icon name="pin" size={14} className="shrink-0" style={{ color: "var(--acid)", marginTop: 1 } as React.CSSProperties} />
                <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>ул. 10-й Годовщины Октября, 13А, Буй</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="send" size={14} className="shrink-0" style={{ color: "var(--acid)" } as React.CSSProperties} />
                <a href="tel:+79969303549" style={{ fontSize: 13, color: "var(--ds-muted)", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ds-white)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ds-muted)")}
                >
                  +7 (996) 930-35-49
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="vk" size={14} className="shrink-0" style={{ color: "var(--acid)" } as React.CSSProperties} />
                <a href="https://vk.com/evoprovince" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--ds-muted)", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ds-white)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ds-muted)")}
                >
                  vk.com/evoprovince
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-faint)", textTransform: "uppercase", marginBottom: 16 }}>
              Мы в соцсетях
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--line-2)", color: "var(--ds-muted)",
                    textDecoration: "none", transition: "color .2s, transform .2s, border-color .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--acid)"
                    e.currentTarget.style.borderColor = "var(--acid)"
                    e.currentTarget.style.transform = "scale(1.08)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ds-muted)"
                    e.currentTarget.style.borderColor = "var(--line-2)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  <Icon name={s.icon} size={18} sw={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 40,
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--acid)", color: "var(--on-acid)",
          border: "none", cursor: "pointer",
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0)" : "translateY(12px)",
          transition: "opacity .3s, transform .3s var(--ease)",
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <Icon name="chevL" size={18} sw={2.2} style={{ transform: "rotate(90deg)" } as React.CSSProperties} />
      </button>
    </footer>
  )
}
