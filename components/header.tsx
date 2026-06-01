"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Icon } from "@/lib/icons"

const NAV = [
  { href: "/services",    label: "Программы" },
  { href: "/schedule",    label: "Расписание" },
  { href: "/news",        label: "Новости" },
  { href: "/tournaments", label: "Турниры" },
  { href: "/#faq",        label: "FAQ" },
  { href: "/judging",     label: "Судейство", accent: true },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: scrolled ? "rgba(11,11,12,0.95)" : "rgba(11,11,12,0.4)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "background .3s var(--ease), border-color .3s var(--ease)",
      }}
    >
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="Эволюция Провинции" height={32} style={{ height: 32, width: "auto", display: "block" }} />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
          {NAV.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href !== "/#faq")
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13, fontWeight: 500, letterSpacing: "0.03em",
                  color: link.accent ? "var(--acid)" : active ? "var(--ds-white)" : "var(--ds-muted)",
                  textDecoration: active ? "underline" : "none",
                  textDecorationColor: "var(--acid)",
                  textUnderlineOffset: 4,
                  transition: "color .2s",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "var(--ds-white)", cursor: "pointer", padding: 4 }}
          aria-label="Меню"
        >
          <Icon name={open ? "close" : "burger"} size={22} sw={1.8} />
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ overflow: "hidden", maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, transition: "max-height .35s var(--ease), opacity .25s var(--ease)", background: "var(--ink-2)", borderTop: open ? "1px solid var(--line)" : "none" }}>
        <nav style={{ display: "flex", flexDirection: "column", padding: "16px var(--pad-x)" }}>
          {NAV.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ padding: "12px 0", fontSize: 15, fontWeight: 500, color: link.accent ? "var(--acid)" : active ? "var(--ds-white)" : "var(--ds-muted)", textDecoration: "none", borderBottom: "1px solid var(--line)" }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
