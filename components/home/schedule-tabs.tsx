"use client"

import { useState } from "react"
import Link from "next/link"
import { Icon } from "@/lib/icons"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

const DAYS_ORDER = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
const TABS = [
  { id: "all",       label: "Все" },
  { id: "kids",      label: "Дети 7–17" },
  { id: "adult",     label: "Взрослые" },
  { id: "team",      label: "Сборная" },
]

function guessTab(type: string): string {
  const t = type.toLowerCase()
  if (t.includes("дет") || t.includes("подрост") || t.includes("юни")) return "kids"
  if (t.includes("сборн") || t.includes("проф")) return "team"
  return "adult"
}

export function ScheduleTabs({ schedule }: { schedule: ScheduleItem[] }) {
  const [active, setActive] = useState("all")

  const filtered = active === "all" ? schedule : schedule.filter((s) => guessTab(s.training_type) === active)

  const byDay = DAYS_ORDER
    .map((day) => ({ day, sessions: filtered.filter((s) => s.day_of_week === day) }))
    .filter((d) => d.sessions.length > 0)

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: "8px 18px", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.04em", border: "1px solid",
              cursor: "pointer", transition: "all .2s",
              background: active === tab.id ? "var(--acid)" : "transparent",
              color: active === tab.id ? "var(--on-acid)" : "var(--ds-muted)",
              borderColor: active === tab.id ? "var(--acid)" : "var(--line-2)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {byDay.length === 0 && (
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
          Расписание временно недоступно
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {byDay.map(({ day, sessions }) => (
          <div key={day} style={{ background: "var(--ink-2)", overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="cal" size={14} style={{ color: "var(--acid)" } as React.CSSProperties} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ds-white)" }}>
                {day}
              </span>
            </div>
            {sessions.map((s) => (
              <div key={s.id} style={{
                display: "grid", gridTemplateColumns: "120px 1fr auto",
                padding: "14px 20px", gap: 12, alignItems: "center",
                borderBottom: "1px solid var(--line)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="clock" size={13} style={{ color: "var(--ds-faint)" } as React.CSSProperties} />
                  <span style={{ fontSize: 13, fontFamily: "var(--font-space-mono, monospace)", color: "var(--ds-white)" }}>
                    {s.time_slot}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: "var(--ds-muted)" }}>{s.training_type}</span>
                <span style={{ fontSize: 12, color: "var(--ds-faint)" }}>{s.trainer}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link href="/schedule" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 600, color: "var(--acid)",
          textDecoration: "none", letterSpacing: "0.04em",
        }}>
          Полное расписание <Icon name="arrow" size={14} sw={2} />
        </Link>
      </div>
    </div>
  )
}
