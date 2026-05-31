import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScheduleTabs } from "@/components/home/schedule-tabs"
import { createClient } from "@/lib/supabase/server"
import { Icon } from "@/lib/icons"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

async function getSchedule(): Promise<ScheduleItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("schedule").select("*")
  if (error) return []
  return data as ScheduleItem[]
}

export default async function SchedulePage() {
  const schedule = await getSchedule()

  return (
    <>
      <Header />
      <main style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ background: "var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "64px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Расписание
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-anton, Anton)",
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1, letterSpacing: "0.01em",
              color: "var(--ds-white)", marginBottom: 16,
            }}>
              КОГДА ТРЕНИРУЕМСЯ
            </h1>
            <p style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 480, lineHeight: 1.7 }}>
              Выбирайте удобное время. Первое занятие — бесплатно.
            </p>
          </div>
        </div>

        {/* Info bar */}
        <div style={{ borderBottom: "1px solid var(--line)", padding: "16px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="pin" size={14} style={{ color: "var(--acid)" } as React.CSSProperties} />
              <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>
                Площадка «Эволюция» — ул. Спортивная, 15
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="clock" size={14} style={{ color: "var(--acid)" } as React.CSSProperties} />
              <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>Длительность тренировки — 2 часа</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)" }}>
          <ScheduleTabs schedule={schedule} />
        </div>

        {/* Notice */}
        <div style={{ background: "var(--ink-2)", padding: "32px var(--pad-x)", borderTop: "1px solid var(--line)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <Icon name="news" size={16} style={{ color: "var(--acid)", flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
            <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.7 }}>
              Расписание может меняться в зависимости от погоды. При морозе до −15 °C занятия проводятся, при сильном снегопаде — переносятся. Следите за актуальными новостями в нашей группе VK.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
