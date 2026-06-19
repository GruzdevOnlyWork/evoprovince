import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealInit } from "@/components/reveal-init"
import { ScheduleTabs } from "@/components/home/schedule-tabs"
import { createClient } from "@/lib/supabase/server"

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
      <RevealInit />
      <main style={{ paddingTop: 80 }}>
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
            <p style={{ fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.7 }}>
              Площадка открыта для всех желающих.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)" }}>
          <ScheduleTabs schedule={schedule} />
        </div>
      </main>
      <Footer />
    </>
  )
}
