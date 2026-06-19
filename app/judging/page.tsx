"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import { JUDGE_DATA } from "@/lib/judging-data"
import { useReveal } from "@/hooks/use-reveal"
import { createClient } from "@/lib/supabase/client"

interface Criterion { id: string; name: string; max_score: number; color: string; sort_order: number }
interface Tier { id: string; code: string; label: string; pts: number; sort_order: number }
interface JElement { id: string; name: string; tier_code: string; element_type: string; sort_order: number }
interface Deduction { id: string; name: string; pts: number; sort_order: number }
interface Rank { id: string; min_score: number; name: string; color: string; sort_order: number }

const TIER_COLORS_FALLBACK: Record<string, string> = {
  A: "#4ade80", B: "#5ad1ff", C: "#9b8cff", D: "#ff6a3d", E: "#ff7a96",
}

function TierBadge({ code, color }: { code: string; color?: string }) {
  const c = color ?? TIER_COLORS_FALLBACK[code] ?? "#888"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, fontSize: 12, fontWeight: 700,
      background: `${c}22`, color: c, border: `1px solid ${c}55`,
      fontFamily: "var(--font-space-mono, monospace)",
    }}>{code}</span>
  )
}

const STATIC_CRITERIA: Criterion[] = JUDGE_DATA.criteria.map((x, i) => ({ id: x.id, name: x.name, max_score: x.max, color: x.color, sort_order: i }))
const STATIC_TIERS: Tier[] = JUDGE_DATA.tiers.map((x, i) => ({ id: x.id, code: x.id, label: x.label, pts: x.pts, sort_order: i }))
const STATIC_ELEMENTS: JElement[] = [
  ...JUDGE_DATA.statics.map((x, i) => ({ id: `s${i}`, name: x.name, tier_code: x.tier, element_type: "static", sort_order: i })),
  ...JUDGE_DATA.dynamics.map((x, i) => ({ id: `d${i}`, name: x.name, tier_code: x.tier, element_type: "dynamic", sort_order: i })),
]
const STATIC_DEDUCTIONS: Deduction[] = JUDGE_DATA.deductions.map((x, i) => ({ id: x.id, name: x.name, pts: x.pts, sort_order: i }))
const STATIC_RANKS: Rank[] = JUDGE_DATA.ranks.map((x, i) => ({ id: String(x.min), min_score: x.min, name: x.name, color: x.color, sort_order: i }))

export default function JudgingPage() {
  useReveal()

  const [criteria, setCriteria]     = useState<Criterion[]>(STATIC_CRITERIA)
  const [tiers, setTiers]           = useState<Tier[]>(STATIC_TIERS)
  const [elements, setElements]     = useState<JElement[]>(STATIC_ELEMENTS)
  const [deductions, setDeductions] = useState<Deduction[]>(STATIC_DEDUCTIONS)
  const [ranks, setRanks]           = useState<Rank[]>(STATIC_RANKS)

  useEffect(() => {
    let cancelled = false
    try {
      const supabase = createClient()
      Promise.all([
        supabase.from("judging_criteria").select("*").order("sort_order"),
        supabase.from("judging_tiers").select("*").order("sort_order"),
        supabase.from("judging_elements").select("*").order("element_type").order("sort_order"),
        supabase.from("judging_deductions").select("*").order("sort_order"),
        supabase.from("judging_ranks").select("*").order("sort_order"),
      ]).then(([c, t, e, d, r]) => {
        if (cancelled) return
        if (c.data?.length) setCriteria(c.data)
        if (t.data?.length) setTiers(t.data)
        if (e.data?.length) setElements(e.data)
        if (d.data?.length) setDeductions(d.data)
        if (r.data?.length) setRanks(r.data)
      }).catch(() => {})
    } catch {
    }
    return () => { cancelled = true }
  }, [])

  const total = criteria.reduce((s, c) => s + c.max_score, 0)
  const tierMap = Object.fromEntries(tiers.map(t => [t.code, t]))

  const [athleteName, setAthleteName] = useState("")
  const [scores, setScores]     = useState<Record<string, number>>({})
  const [deds, setDeds]         = useState<Record<string, number>>({})

  useEffect(() => {
    if (criteria.length) setScores(Object.fromEntries(criteria.map(c => [c.id, 0])))
  }, [criteria.length])
  useEffect(() => {
    if (deductions.length) setDeds(Object.fromEntries(deductions.map(d => [d.id, 0])))
  }, [deductions.length])

  const base   = Object.values(scores).reduce((s: number, v: number) => s + v, 0)
  const dedSum = deductions.reduce((s: number, d) => s + d.pts * (deds[d.id] ?? 0), 0)
  const result = Math.max(0, base - dedSum)
  const rank   = [...ranks].sort((a, b) => b.min_score - a.min_score).find(r => result >= r.min_score) ?? ranks[ranks.length - 1]

  const reset = () => {
    setAthleteName("")
    setCriteria(c => { setScores(Object.fromEntries(c.map(x => [x.id, 0]))); return c })
    setDeductions(d => { setDeds(Object.fromEntries(d.map(x => [x.id, 0]))); return d })
  }

  const statics  = elements.filter(e => e.element_type === "static")
  const dynamics = elements.filter(e => e.element_type === "dynamic")

  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ background: "var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "48px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Воркаут · Фристайл
              </span>
            </div>
            <h1 className="reveal" data-d="1" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, color: "var(--ds-white)", marginBottom: 16 }}>
              СИСТЕМА ОЦЕНИВАНИЯ
            </h1>
            <p className="reveal" data-d="2" style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 520 }}>
              Фристайл 60–90 сек · 3–5 судей · Максимум {total} баллов
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)", display: "flex", flexDirection: "column", gap: 80 }}>

          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, marginBottom: 24, color: "var(--ds-white)" }}>КРИТЕРИИ</h2>
            <div className="reveal" data-d="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
              {criteria.map(c => (
                <div key={c.id} style={{ background: "var(--ink-2)", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-white)" }}>{c.name}</span>
                    <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 13, color: c.color }}>{c.max_score}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--line)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.max_score / total) * 100}%`, background: c.color }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--ds-faint)" }}>{Math.round((c.max_score / total) * 100)}% от итога</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, marginBottom: 24, color: "var(--ds-white)" }}>ТИРЫ ЭЛЕМЕНТОВ</h2>
            <div className="reveal" data-d="1" style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 32 }}>
              {tiers.map(t => (
                <div key={t.id} style={{ background: "var(--ink-2)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, minWidth: 140 }}>
                  <TierBadge code={t.code} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ds-white)" }}>{t.label}</div>
                    <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 12, color: TIER_COLORS_FALLBACK[t.code] ?? "#888" }}>+{t.pts} балла</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reveal" data-d="2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <div style={{ background: "var(--ink-2)", overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="bars" size={14} style={{ color: "var(--acid)" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-white)" }}>Статика</span>
                </div>
                {statics.map(el => (
                  <div key={el.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{el.name}</span>
                    <TierBadge code={el.tier_code} color={tierMap[el.tier_code] ? undefined : TIER_COLORS_FALLBACK[el.tier_code]} />
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--ink-2)", overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="flame" size={14} style={{ color: "#ff6a3d" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-white)" }}>Динамика</span>
                </div>
                {dynamics.map(el => (
                  <div key={el.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{el.name}</span>
                    <TierBadge code={el.tier_code} color={tierMap[el.tier_code] ? undefined : TIER_COLORS_FALLBACK[el.tier_code]} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, marginBottom: 24, color: "var(--ds-white)" }}>СБАВКИ</h2>
            <div className="reveal" data-d="1" style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {deductions.map(d => (
                <div key={d.id} style={{ background: "var(--ink-2)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, minWidth: 240, flex: 1 }}>
                  <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{d.name}</span>
                  <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 14, color: "#ff4444", fontWeight: 700 }}>-{d.pts}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, marginBottom: 24, color: "var(--ds-white)" }}>СУДЕЙСКАЯ КАРТОЧКА</h2>
            <div className="reveal" data-d="1" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 2, alignItems: "start" }}>
              <div style={{ background: "var(--ink-2)", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", display: "block", marginBottom: 8 }}>Имя спортсмена</label>
                  <input type="text" value={athleteName} onChange={e => setAthleteName(e.target.value)} placeholder="Введите имя..." style={{ width: "100%", padding: "12px 16px", background: "var(--ink-4)", border: "1px solid var(--line-2)", color: "var(--ds-white)", fontSize: 14, outline: "none", fontFamily: "inherit" }} onFocus={e => (e.target.style.borderColor = "var(--acid)")} onBlur={e => (e.target.style.borderColor = "var(--line-2)")} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {criteria.map(c => (
                    <div key={c.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{c.name}</span>
                        <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 13, color: c.color, fontWeight: 700 }}>{scores[c.id] ?? 0} / {c.max_score}</span>
                      </div>
                      <input type="range" min={0} max={c.max_score} step={0.5} value={scores[c.id] ?? 0} onChange={e => setScores(s => ({ ...s, [c.id]: parseFloat(e.target.value) }))} style={{ width: "100%", accentColor: c.color, cursor: "pointer" }} />
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 12 }}>Сбавки</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {deductions.map(d => (
                      <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 13, color: "var(--ds-muted)", flexGrow: 1 }}>{d.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => setDeds(p => ({ ...p, [d.id]: Math.max(0, (p[d.id] ?? 0) - 1) }))} style={{ width: 28, height: 28, background: "var(--ink-4)", border: "1px solid var(--line-2)", color: "var(--ds-white)", cursor: "pointer", fontSize: 16 }}>−</button>
                          <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 14, color: "#ff4444", minWidth: 24, textAlign: "center" }}>{deds[d.id] ?? 0}</span>
                          <button onClick={() => setDeds(p => ({ ...p, [d.id]: (p[d.id] ?? 0) + 1 }))} style={{ width: 28, height: 28, background: "var(--ink-4)", border: "1px solid var(--line-2)", color: "var(--ds-white)", cursor: "pointer", fontSize: 16 }}>+</button>
                        </div>
                        <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 12, color: "#ff4444", minWidth: 40, textAlign: "right" }}>-{(d.pts * (deds[d.id] ?? 0)).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={reset} style={{ padding: "12px 20px", border: "1px solid var(--line-2)", background: "transparent", color: "var(--ds-muted)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" }}
                  className="btn-ghost-line">
                  Сбросить
                </button>
              </div>

              <div style={{ background: "var(--ink-2)", padding: 32, position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 24 }}>
                {athleteName && <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-muted)", borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>{athleteName}</div>}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>Базовая оценка</div>
                  <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 48, color: "var(--ds-white)", lineHeight: 1 }}>{base.toFixed(1)}</div>
                </div>
                {dedSum > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>Сбавки</div>
                    <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, color: "#ff4444", lineHeight: 1 }}>-{dedSum.toFixed(1)}</div>
                  </div>
                )}
                <div style={{ borderTop: "2px solid var(--line-2)", paddingTop: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>Итог</div>
                  <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 64, lineHeight: 1, color: "var(--acid)" }}>{result.toFixed(1)}</div>
                  <div style={{ fontSize: 11, color: "var(--ds-faint)", marginTop: 4 }}>из {total}</div>
                </div>
                {rank && (
                  <div style={{ padding: "12px 16px", background: `${rank.color}18`, border: `1px solid ${rank.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 20, letterSpacing: "0.08em", color: rank.color }}>{rank.name}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
