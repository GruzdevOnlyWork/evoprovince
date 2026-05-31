import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealInit } from "@/components/reveal-init"
import { Icon } from "@/lib/icons"
import { CountdownTimer } from "@/components/countdown-timer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

interface Tournament {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants: string | null
  image_url: string | null
  status: string
  status_type: string
  is_past: boolean
}

interface Winner {
  id: string
  tournament_id: string
  place: number
  name: string
  team: string
}

const MEDAL_COLORS: Record<number, string> = {
  1: "#e8ff3a",
  2: "#c0c0c0",
  3: "#cd7f32",
}

async function getData() {
  const supabase = await createClient()
  const [{ data: t }, { data: w }] = await Promise.all([
    supabase.from("tournaments").select("*").order("date", { ascending: false }),
    supabase.from("tournament_winners").select("*").order("place"),
  ])
  return {
    tournaments: (t ?? []) as Tournament[],
    winners: (w ?? []) as Winner[],
  }
}

export default async function TournamentsPage() {
  const { tournaments, winners } = await getData()

  const upcoming = tournaments.filter((t) => !t.is_past)
  const past = tournaments.filter((t) => t.is_past)

  return (
    <>
      <Header />
      <RevealInit />
      <main style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ background: "var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "64px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Турниры
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-anton, Anton)",
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1, letterSpacing: "0.01em",
              color: "var(--ds-white)", marginBottom: 16,
            }}>
              СОРЕВНОВАНИЯ
            </h1>
            <p style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 480, lineHeight: 1.7 }}>
              Следите за предстоящими турнирами и результатами прошедших соревнований.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)", display: "flex", flexDirection: "column", gap: 80 }}>
          {/* Upcoming */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Предстоящие
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div style={{ background: "var(--ink-2)", padding: "48px 32px", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
                Нет предстоящих турниров. Следите за обновлениями!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2 }}>
                {upcoming.map((t) => (
                  <div key={t.id} className="reveal" style={{ background: "var(--ink-2)", display: "flex", flexDirection: "column" }}>
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.title} style={{ width: "100%", height: 200, objectFit: "cover" }} loading="lazy" />
                    ) : (
                      <div className="ph" style={{ height: 200 }} />
                    )}
                    <div style={{ padding: "24px 24px 28px", flexGrow: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                          padding: "4px 10px", textTransform: "uppercase",
                          background: t.status_type === "success" ? "rgba(74,222,128,0.15)" : "rgba(245,245,240,0.08)",
                          color: t.status_type === "success" ? "var(--acid)" : "var(--ds-muted)",
                          border: `1px solid ${t.status_type === "success" ? "rgba(74,222,128,0.3)" : "var(--line-2)"}`,
                        }}>
                          {t.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--ds-white)", lineHeight: 1.3 }}>{t.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.6 }}>{t.description}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="cal" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                          <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>
                            {new Date(t.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon name="pin" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                          <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{t.location}</span>
                        </div>
                        {t.participants && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name="kid" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                            <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{t.participants}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                        <CountdownTimer date={t.date} />
                      </div>
                      <Link href="/#join" className="btn-acid" style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "12px",
                        fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                        textDecoration: "none",
                      }}>
                        Зарегистрироваться <Icon name="arrow" size={14} sw={2} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <span style={{ width: 20, height: 1, background: "var(--line-2)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ds-faint)", textTransform: "uppercase" }}>
                Архив
              </span>
            </div>

            {past.length === 0 ? (
              <div style={{ background: "var(--ink-2)", padding: "48px 32px", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
                Архив турниров пуст
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {past.map((t) => {
                  const tournamentWinners = winners.filter((w) => w.tournament_id === t.id).sort((a, b) => a.place - b.place)
                  return (
                    <div key={t.id} className="reveal" style={{ background: "var(--ink-2)", overflow: "hidden" }}>
                      {t.image_url ? (
                        <img src={t.image_url} alt={t.title} style={{ width: "100%", height: 220, objectFit: "cover" }} loading="lazy" />
                      ) : (
                        <div className="ph" style={{ height: 220 }} />
                      )}
                      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Icon name="cal" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                              <span style={{ fontSize: 12, color: "var(--ds-faint)" }}>
                                {new Date(t.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Icon name="pin" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                              <span style={{ fontSize: 12, color: "var(--ds-faint)" }}>{t.location}</span>
                            </div>
                          </div>
                          <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--ds-white)", marginBottom: 8 }}>{t.title}</h3>
                        </div>

                        {tournamentWinners.length > 0 && (
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                              <Icon name="medal" size={14} style={{ color: "var(--acid)" } as React.CSSProperties} />
                              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-faint)" }}>
                                Победители
                              </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {tournamentWinners.map((w) => (
                                <div key={w.id} style={{
                                  display: "flex", alignItems: "center", gap: 12,
                                  padding: "10px 14px", background: "var(--ink-4)",
                                }}>
                                  <div style={{
                                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "var(--font-space-mono, monospace)", fontSize: 13, fontWeight: 700,
                                    color: MEDAL_COLORS[w.place] ?? "var(--ds-faint)",
                                    border: `1px solid ${MEDAL_COLORS[w.place] ?? "var(--line)"}`,
                                  }}>
                                    {w.place}
                                  </div>
                                  <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ds-white)" }}>{w.name}</div>
                                    {w.team && <div style={{ fontSize: 11, color: "var(--ds-faint)" }}>{w.team}</div>}
                                  </div>
                                  {w.place <= 3 && (
                                    <Icon name="medal" size={14} style={{ color: MEDAL_COLORS[w.place] } as React.CSSProperties} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
