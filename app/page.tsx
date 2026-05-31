import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealInit } from "@/components/reveal-init"
import { HeroSection } from "@/components/home/hero"
import { ScheduleTabs } from "@/components/home/schedule-tabs"
import { FaqSection } from "@/components/home/faq"
import { createClient } from "@/lib/supabase/server"
import { getVKPostsForPage, type ParsedVKPost } from "@/lib/vk-api"
import { Icon } from "@/lib/icons"
import Link from "next/link"

const TICKER_TEXT = "Подтягивания · Брусья · Выход силой · Флаг · Горизонт · Планш · ВФК · Дисциплина"

async function getData() {
  const supabase = await createClient()
  const [{ data: services }, { data: schedule }, posts] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("schedule").select("*"),
    getVKPostsForPage(),
  ])
  return {
    services: (services ?? []) as Service[],
    schedule: (schedule ?? []) as ScheduleItem[],
    posts: posts.slice(0, 6) as ParsedVKPost[],
  }
}

interface Service {
  id: string; icon: string; title: string; description: string
  price: string; features: string[]; is_popular: boolean; sort_order: number
}
interface ScheduleItem {
  id: string; day_of_week: string; time_slot: string; trainer: string; training_type: string
}

const ICON_MAP: Record<string, "dumbbell" | "kid" | "medal" | "flame" | "heart" | "layers"> = {
  dumbbell: "dumbbell", users: "kid", trophy: "medal", target: "flame", heart: "heart", layers: "layers",
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-anton, Anton)",
      fontSize: "clamp(36px, 5vw, 64px)",
      lineHeight: 1,
      color: "var(--ds-white)",
      marginBottom: 48,
      letterSpacing: "0.01em",
    }}>
      {children}
    </h2>
  )
}

export default async function HomePage() {
  const { services, schedule, posts } = await getData()

  const featured = services.find((s) => s.is_popular) ?? services[0]
  const others = services.filter((s) => s.id !== featured?.id)

  return (
    <>
      <Header />
      <RevealInit />
      <main>
        {/* 1. HERO */}
        <HeroSection />

        {/* 2. TICKER */}
        <div style={{
          background: "var(--acid)", color: "var(--on-acid)",
          padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap",
        }}>
          <div style={{
            display: "inline-flex", gap: 0,
            animation: "ticker 18s linear infinite",
          }}>
            {[0, 1].map((n) => (
              <span key={n} style={{
                display: "inline-block",
                paddingRight: 64,
                fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {TICKER_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* 3. PROGRAMS */}
        <section style={{ padding: "100px var(--pad-x)", maxWidth: "var(--maxw)", margin: "0 auto" }} id="programs">
          <div className="reveal">
            <SectionLabel>Программы</SectionLabel>
            <SectionTitle>ЧЕМУ МЫ УЧИМ</SectionTitle>
          </div>

          {services.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
              {/* Featured */}
              {featured && (
                <div className="reveal" style={{ gridColumn: "span 2" }}>
                  <div style={{
                    background: "var(--ink-2)", padding: 36, height: "100%",
                    borderLeft: "3px solid var(--acid)",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, background: "rgba(74,222,128,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--acid)",
                      }}>
                        <Icon name={ICON_MAP[featured.icon] ?? "dumbbell"} size={20} sw={1.6} />
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                        color: "var(--on-acid)", background: "var(--acid)",
                        padding: "4px 10px", textTransform: "uppercase",
                      }}>
                        Популярное
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ds-faint)", letterSpacing: "0.1em", marginBottom: 8 }}>
                        01
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--ds-white)", marginBottom: 8 }}>{featured.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.6 }}>{featured.description}</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {featured.features?.slice(0, 3).map((f: string, i: number) => (
                        <span key={i} style={{
                          fontSize: 11, padding: "4px 10px", border: "1px solid var(--line-2)",
                          color: "var(--ds-faint)", letterSpacing: "0.05em",
                        }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Others */}
              {others.map((s, i) => (
                <div key={s.id} className="reveal" data-d={String(((i % 3) + 1) as 1 | 2 | 3)}>
                  <div className="card-hover" style={{
                    background: "var(--ink-2)", padding: 28, height: "100%",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ds-faint)", letterSpacing: "0.1em" }}>
                      0{i + 2}
                    </div>
                    <div style={{
                      width: 36, height: 36, background: "var(--ink-4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--ds-muted)",
                    }}>
                      <Icon name={ICON_MAP[s.icon] ?? "dumbbell"} size={18} sw={1.6} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ds-white)" }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.6, flexGrow: 1 }}>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
              Программы временно недоступны
            </div>
          )}

          <div style={{ marginTop: 32, textAlign: "right" }}>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 600, color: "var(--acid)", textDecoration: "none", letterSpacing: "0.04em",
            }}>
              Все программы <Icon name="arrow" size={14} sw={2} />
            </Link>
          </div>
        </section>

        {/* 4. SCHEDULE */}
        <section style={{ background: "var(--ink-2)", padding: "100px var(--pad-x)" }} id="schedule">
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div className="reveal">
              <SectionLabel>Расписание</SectionLabel>
              <SectionTitle>КОГДА ТРЕНИРУЕМСЯ</SectionTitle>
            </div>
            <ScheduleTabs schedule={schedule} />
          </div>
        </section>

        {/* 5. VIDEO GALLERY */}
        <section style={{ padding: "100px var(--pad-x)", maxWidth: "var(--maxw)", margin: "0 auto" }} id="videos">
          <div className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <SectionLabel>Видео</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1, letterSpacing: "0.01em" }}>
                СМОТРИ НАС В ДЕЛЕ
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 2 }}>
            {[
              "https://yandex.ru/video/touch/preview/13459166230666584690",
              "https://yandex.ru/video/touch/preview/8002640497761513438",
              "https://yandex.ru/video/touch/preview/2627569204809627738",
              "https://yandex.ru/video/touch/preview/7745751746423077013",
              "https://yandex.ru/video/touch/preview/1933980522527066938",
            ].map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="reveal card-hover" data-d={String(((i % 3) + 1) as 1 | 2 | 3)} style={{ textDecoration: "none", display: "block", background: "var(--ink-2)" }}>
                <div className="ph" style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "2px solid var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--acid)"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 12, color: "var(--ds-muted)" }}>Видео #{i + 1}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "var(--acid)" }}>
                    Смотреть <Icon name="arrowUR" size={10} sw={2} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 6. NEWS */}
        {posts.length > 0 && (
          <section style={{ padding: "100px var(--pad-x)", maxWidth: "var(--maxw)", margin: "0 auto" }} id="news">
            <div className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div>
                <SectionLabel>Новости</SectionLabel>
                <h2 style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1, letterSpacing: "0.01em" }}>
                  ПОСЛЕДНИЕ ПОСТЫ
                </h2>
              </div>
              <Link href="/news" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, color: "var(--acid)", textDecoration: "none",
              }}>
                Все новости <Icon name="arrow" size={14} sw={2} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2 }}>
              {posts.map((post, i) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal"
                  data-d={String(((i % 3) + 1) as 1 | 2 | 3)}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="card-hover" style={{ background: "var(--ink-2)", height: "100%", display: "flex", flexDirection: "column" }}>
                    {post.image ? (
                      <img src={post.image} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} loading="lazy" />
                    ) : (
                      <div className="ph" style={{ height: 200 }} />
                    )}
                    <div style={{ padding: "20px 20px 24px", flexGrow: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--ds-faint)" }}>
                          <Icon name="vk" size={12} sw={1.4} /> VK
                        </span>
                        <span style={{ fontSize: 11, color: "var(--ds-faint)" }}>{post.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.65, flexGrow: 1 }}>
                        {post.text.slice(0, 160)}{post.text.length > 160 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 6. FAQ */}
        <section style={{ background: "var(--ink-2)", padding: "100px var(--pad-x)" }} id="faq">
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div className="reveal">
              <SectionLabel>Вопросы</SectionLabel>
              <SectionTitle>ЧАСТО<br />СПРАШИВАЮТ</SectionTitle>
            </div>
            <div className="reveal" data-d="1">
              <FaqSection />
            </div>
          </div>
        </section>

        {/* 7. CONTACTS INFO */}
        <section style={{ background: "var(--ink-2)", padding: "80px var(--pad-x)" }} id="contacts">
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div className="reveal">
              <SectionLabel>Контакты</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1, color: "var(--ds-white)", marginBottom: 12 }}>
                НАЙДИ НАС
              </h2>
              <p style={{ fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.7, maxWidth: 400 }}>
                Саратовская обл., Новоузенск. Приходи на открытую тренировку расписание на сайте.
              </p>
            </div>
            <div className="reveal" data-d="1" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://vk.com/evoprovince" target="_blank" rel="noopener noreferrer" className="btn-ghost-line" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", color: "var(--ds-white)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none" }}>
                <Icon name="vk" size={16} sw={1.6} /> Группа ВКонтакте
              </a>
              <Link href="/schedule" className="btn-ghost-line" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", color: "var(--ds-white)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none" }}>
                <Icon name="cal" size={16} sw={1.6} /> Расписание
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
