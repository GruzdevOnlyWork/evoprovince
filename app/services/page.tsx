import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealInit } from "@/components/reveal-init"
import { Icon } from "@/lib/icons"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  is_popular: boolean
  sort_order: number
}

const ICON_MAP: Record<string, "dumbbell" | "kid" | "medal" | "flame" | "heart" | "layers"> = {
  dumbbell: "dumbbell", users: "kid", trophy: "medal", target: "flame", heart: "heart", layers: "layers",
}

async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("services").select("*").order("sort_order")
  if (error) return []
  return data as Service[]
}

export default async function ServicesPage() {
  const services = await getServices()
  const featured = services.find((s) => s.is_popular) ?? services[0]
  const others = services.filter((s) => s.id !== featured?.id)

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
                Программы
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-anton, Anton)",
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1, letterSpacing: "0.01em",
              color: "var(--ds-white)", marginBottom: 16,
            }}>
              ПРОГРАММЫ ТРЕНИРОВОК
            </h1>
            <p style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 480, lineHeight: 1.7 }}>
              Подберите формат под ваш уровень и цели. Первое занятие всегда бесплатно.
            </p>
          </div>
        </div>

        {/* Programs bento */}
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)" }}>
          {services.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
              {/* Featured */}
              {featured && (
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{
                    background: "var(--ink-2)", padding: 40, height: "100%",
                    borderLeft: "3px solid var(--acid)",
                    display: "flex", flexDirection: "column", gap: 20,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, background: "rgba(74,222,128,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--acid)",
                      }}>
                        <Icon name={ICON_MAP[featured.icon] ?? "dumbbell"} size={22} sw={1.6} />
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                        color: "var(--on-acid)", background: "var(--acid)",
                        padding: "4px 12px", textTransform: "uppercase",
                      }}>
                        Популярное
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ds-faint)", letterSpacing: "0.1em", marginBottom: 8 }}>01</div>
                      <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--ds-white)", marginBottom: 10 }}>{featured.title}</h2>
                      <p style={{ fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.7 }}>{featured.description}</p>
                    </div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0 }}>
                      {featured.features?.map((f: string, i: number) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ds-muted)" }}>
                          <Icon name="check" size={14} sw={2} style={{ color: "var(--acid)", flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "auto" }}>
                      <a href="https://vk.com/evoprovince" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--acid)", textDecoration: "none" }}>
                        <Icon name="vk" size={14} sw={1.6} /> Группа ВКонтакте
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Others */}
              {others.map((s, i) => (
                <div key={s.id}>
                  <div className="card-hover" style={{
                    background: "var(--ink-2)", padding: 28, height: "100%",
                    display: "flex", flexDirection: "column", gap: 14,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ds-faint)", letterSpacing: "0.1em" }}>
                      0{i + 2}
                    </div>
                    <div style={{
                      width: 38, height: 38, background: "var(--ink-4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--ds-muted)",
                    }}>
                      <Icon name={ICON_MAP[s.icon] ?? "dumbbell"} size={18} sw={1.6} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--ds-white)", marginBottom: 6 }}>{s.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.6 }}>{s.description}</p>
                    </div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 6, listStyle: "none", padding: 0, flexGrow: 1 }}>
                      {s.features?.map((f: string, fi: number) => (
                        <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "var(--ds-faint)" }}>
                          <Icon name="check" size={12} sw={2} style={{ color: "var(--acid)", flexShrink: 0, marginTop: 1 } as React.CSSProperties} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "auto" }}>
                      <a href="https://vk.com/evoprovince" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--acid)", textDecoration: "none" }}>
                        <Icon name="vk" size={12} sw={1.4} style={{ marginRight: 4 } as React.CSSProperties} />vk.com/evoprovince
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "64px 0", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
              Информация об услугах временно недоступна
            </div>
          )}

          {/* Free section banner */}
          <div style={{ marginTop: 2, background: "rgba(74,222,128,0.08)", padding: "40px 40px", borderLeft: "3px solid var(--acid)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--ds-white)", marginBottom: 8 }}>
                  Все тренировки — бесплатно
                </h3>
                <p style={{ fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.7, maxWidth: 560 }}>
                  Секция «Эволюция Провинции» работает на некоммерческой основе. Приходи на первую тренировку и начинай заниматься уже сегодня.
                </p>
              </div>
              <a href="https://vk.com/evoprovince" target="_blank" rel="noopener noreferrer" className="btn-ghost-line" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", color: "var(--ds-white)", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                <Icon name="vk" size={14} sw={1.6} /> Группа ВКонтакте
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
