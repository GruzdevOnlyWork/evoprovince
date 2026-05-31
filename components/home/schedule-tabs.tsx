"use client"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

const DAYS_ORDER = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

export function ScheduleTabs({ schedule }: { schedule: ScheduleItem[] }) {
  const rows = DAYS_ORDER.map((day) => ({
    day,
    item: schedule.find((s) => s.day_of_week === day) ?? null,
  }))

  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 2 }}>
      {rows.map(({ day, item }) => (
        <div
          key={day}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            background: "var(--ink-3)",
            borderLeft: item ? "3px solid var(--acid)" : "3px solid var(--line-2)",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: item ? "var(--ds-white)" : "var(--ds-faint)" }}>
            {day}
          </span>
          <span style={{
            fontFamily: "var(--font-space-mono, monospace)",
            fontSize: 13, fontWeight: 700,
            color: item ? "var(--acid)" : "var(--ds-faint)",
          }}>
            {item ? item.time_slot : "Выходной"}
          </span>
        </div>
      ))}
    </div>
  )
}
