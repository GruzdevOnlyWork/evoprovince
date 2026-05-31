"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Icon } from "@/lib/icons"
import { JUDGE_DATA } from "@/lib/judging-data"
import { useReveal } from "@/hooks/use-reveal"

const TIER_COLORS: Record<string, string> = {
  A: "#4ade80", B: "#5ad1ff", C: "#9b8cff", D: "#ff6a3d", E: "#ff7a96",
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, fontSize: 12, fontWeight: 700,
      background: `${TIER_COLORS[tier]}22`,
      color: TIER_COLORS[tier],
      border: `1px solid ${TIER_COLORS[tier]}55`,
      fontFamily: "var(--font-space-mono, monospace)",
    }}>
      {tier}
    </span>
  )
}

export default function JudgingPage() {
  useReveal()

  const total = JUDGE_DATA.criteria.reduce((s, c) => s + c.max, 0)

  const initScores = Object.fromEntries(JUDGE_DATA.criteria.map((c) => [c.id, 0]))
  const initDeds = Object.fromEntries(JUDGE_DATA.deductions.map((d) => [d.id, 0]))

  const [name, setName] = useState("")
  const [scores, setScores] = useState<Record<string, number>>(initScores)
  const [deds, setDeds] = useState<Record<string, number>>(initDeds)

  const base = (Object.values(scores) as number[]).reduce((s: number, v: number) => s + v, 0)
  const ded = (JUDGE_DATA.deductions as Array<{ id: string; name: string; pts: number }>).reduce(
    (s: number, d) => s + d.pts * (deds[d.id] ?? 0),
    0,
  )
  const result = Math.max(0, base - ded)

  const rank = JUDGE_DATA.ranks.find((r) => result >= r.min) ?? JUDGE_DATA.ranks[JUDGE_DATA.ranks.length - 1]

  const reset = () => {
    setName("")
    setScores(initScores)
    setDeds(initDeds)
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: "var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "48px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Воркаут · Фристайл
              </span>
            </div>
            <h1 className="reveal" data-d="1" style={{
              fontFamily: "var(--font-anton, Anton)",
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1, letterSpacing: "0.01em",
              color: "var(--ds-white)", marginBottom: 16,
            }}>
              СИСТЕМА ОЦЕНИВАНИЯ
            </h1>
            <p className="reveal" data-d="2" style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 520 }}>
              Фристайл 60–90 сек · 3–5 судей · Максимум {total} баллов
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)", display: "flex", flexDirection: "column", gap: 80 }}>
          {/* Criteria */}
          <section>
            <h2 className="reveal" style={{
              fontFamily: "var(--font-anton, Anton)", fontSize: 32, letterSpacing: "0.02em",
              marginBottom: 24, color: "var(--ds-white)",
            }}>
              КРИТЕРИИ
            </h2>
            <div className="reveal" data-d="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
              {JUDGE_DATA.criteria.map((c) => (
                <div key={c.id} style={{ background: "var(--ink-2)", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-white)" }}>{c.name}</span>
                    <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 13, color: c.color }}>{c.max}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--line)", borderRadius: 0, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.max / total) * 100}%`, background: c.color }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--ds-faint)" }}>
                    {Math.round((c.max / total) * 100)}% от итога
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tiers */}
          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, letterSpacing: "0.02em", marginBottom: 24, color: "var(--ds-white)" }}>
              ТИРЫ ЭЛЕМЕНТОВ
            </h2>
            <div className="reveal" data-d="1" style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 32 }}>
              {JUDGE_DATA.tiers.map((t) => (
                <div key={t.id} style={{
                  background: "var(--ink-2)", padding: "16px 24px",
                  display: "flex", alignItems: "center", gap: 12, minWidth: 140,
                }}>
                  <TierBadge tier={t.id} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ds-white)" }}>{t.label}</div>
                    <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 12, color: TIER_COLORS[t.id] }}>
                      +{t.pts.toFixed(1)} балла
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Elements tables */}
            <div className="reveal" data-d="2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {/* Statics */}
              <div style={{ background: "var(--ink-2)", overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="bars" size={14} style={{ color: "var(--acid)" } as React.CSSProperties} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-white)" }}>
                    Статика
                  </span>
                </div>
                {JUDGE_DATA.statics.map((el, i) => (
                  <div key={i} style={{
                    padding: "12px 20px", borderBottom: "1px solid var(--line)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  }}>
                    <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{el.name}</span>
                    <TierBadge tier={el.tier} />
                  </div>
                ))}
              </div>
              {/* Dynamics */}
              <div style={{ background: "var(--ink-2)", overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="flame" size={14} style={{ color: "#ff6a3d" } as React.CSSProperties} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-white)" }}>
                    Динамика
                  </span>
                </div>
                {JUDGE_DATA.dynamics.map((el, i) => (
                  <div key={i} style={{
                    padding: "12px 20px", borderBottom: "1px solid var(--line)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  }}>
                    <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{el.name}</span>
                    <TierBadge tier={el.tier} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Deductions */}
          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, letterSpacing: "0.02em", marginBottom: 24, color: "var(--ds-white)" }}>
              СБАВКИ
            </h2>
            <div className="reveal" data-d="1" style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {JUDGE_DATA.deductions.map((d) => (
                <div key={d.id} style={{
                  background: "var(--ink-2)", padding: "16px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 24, minWidth: 240, flex: 1,
                }}>
                  <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{d.name}</span>
                  <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 14, color: "#ff4444", fontWeight: 700 }}>
                    -{d.pts.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Scorecard */}
          <section>
            <h2 className="reveal" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, letterSpacing: "0.02em", marginBottom: 24, color: "var(--ds-white)" }}>
              СУДЕЙСКАЯ КАРТОЧКА
            </h2>
            <div className="reveal" data-d="1" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 2, alignItems: "start" }}>
              {/* Controls */}
              <div style={{ background: "var(--ink-2)", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Athlete name */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", display: "block", marginBottom: 8 }}>
                    Имя спортсмена
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите имя..."
                    style={{
                      width: "100%", padding: "12px 16px",
                      background: "var(--ink-4)", border: "1px solid var(--line-2)",
                      color: "var(--ds-white)", fontSize: 14, outline: "none",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--acid)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--line-2)")}
                  />
                </div>

                {/* Criteria sliders */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {JUDGE_DATA.criteria.map((c) => (
                    <div key={c.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{c.name}</span>
                        <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 13, color: c.color, fontWeight: 700 }}>
                          {scores[c.id]} / {c.max}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0} max={c.max} step={0.5}
                        value={scores[c.id]}
                        onChange={(e) => setScores((s) => ({ ...s, [c.id]: parseFloat(e.target.value) }))}
                        style={{ width: "100%", accentColor: c.color, cursor: "pointer" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Deductions */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 12 }}>
                    Сбавки
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {JUDGE_DATA.deductions.map((d) => (
                      <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 13, color: "var(--ds-muted)", flexGrow: 1 }}>{d.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => setDeds((prev) => ({ ...prev, [d.id]: Math.max(0, (prev[d.id] ?? 0) - 1) }))}
                            style={{ width: 28, height: 28, background: "var(--ink-4)", border: "1px solid var(--line-2)", color: "var(--ds-white)", cursor: "pointer", fontSize: 16 }}
                          >−</button>
                          <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 14, color: "#ff4444", minWidth: 24, textAlign: "center" }}>
                            {deds[d.id] ?? 0}
                          </span>
                          <button
                            onClick={() => setDeds((prev) => ({ ...prev, [d.id]: (prev[d.id] ?? 0) + 1 }))}
                            style={{ width: 28, height: 28, background: "var(--ink-4)", border: "1px solid var(--line-2)", color: "var(--ds-white)", cursor: "pointer", fontSize: 16 }}
                          >+</button>
                        </div>
                        <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: 12, color: "#ff4444", minWidth: 40, textAlign: "right" }}>
                          -{(d.pts * (deds[d.id] ?? 0)).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={reset}
                  style={{
                    padding: "12px 20px", border: "1px solid var(--line-2)",
                    background: "transparent", color: "var(--ds-muted)",
                    fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
                    cursor: "pointer", transition: "color .2s, border-color .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ds-white)"
                    e.currentTarget.style.borderColor = "var(--ds-white)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ds-muted)"
                    e.currentTarget.style.borderColor = "var(--line-2)"
                  }}
                >
                  Сбросить
                </button>
              </div>

              {/* Result panel */}
              <div style={{ background: "var(--ink-2)", padding: 32, position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 24 }}>
                {name && (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-muted)", borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>
                    {name}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>
                    Базовая оценка
                  </div>
                  <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 48, color: "var(--ds-white)", lineHeight: 1 }}>
                    {base.toFixed(1)}
                  </div>
                </div>
                {ded > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>
                      Сбавки
                    </div>
                    <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, color: "#ff4444", lineHeight: 1 }}>
                      -{ded.toFixed(1)}
                    </div>
                  </div>
                )}
                <div style={{ borderTop: "2px solid var(--line-2)", paddingTop: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)", marginBottom: 8 }}>
                    Итог
                  </div>
                  <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 64, lineHeight: 1, color: "var(--acid)" }}>
                    {result.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ds-faint)", marginTop: 4 }}>из {total}</div>
                </div>
                <div style={{
                  padding: "12px 16px",
                  background: `${rank.color}18`,
                  border: `1px solid ${rank.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-anton, Anton)", fontSize: 20,
                    letterSpacing: "0.08em", color: rank.color,
                  }}>
                    {rank.name}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
