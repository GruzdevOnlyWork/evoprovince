"use client"

import { useState } from "react"
import { Icon } from "@/lib/icons"

const FAQ_ITEMS = [
  { q: "С какого возраста?", a: "От 7 лет. Есть группы: дети 7–12, подростки 13–17, взрослые 18+" },
  { q: "Нужна подготовка?", a: "Нет, принимаем с нуля. Первое занятие бесплатно" },
  { q: "Где находимся?", a: "г. Саратов, ул. Спортивная, 15. Площадка «Эволюция»" },
  { q: "Сколько стоит?", a: "Групповые от 500 ₽, индивидуальные от 1000 ₽. Подробнее — /services" },
  { q: "Есть детские группы?", a: "Да, 7–12 и 13–17 лет с опытными тренерами" },
  { q: "Занимаетесь зимой?", a: "Да, при морозе до -15°C, при сильном снеге переносим" },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ background: "var(--ink-2)", overflow: "hidden" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", padding: "20px 24px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
              background: "none", border: "none", cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ds-white)" }}>{item.q}</span>
            <span style={{
              color: "var(--acid)", flexShrink: 0,
              transform: open === i ? "rotate(45deg)" : "none",
              transition: "transform .3s var(--ease)",
            }}>
              <Icon name="plus" size={18} sw={2} />
            </span>
          </button>
          <div style={{
            maxHeight: open === i ? 200 : 0,
            overflow: "hidden",
            transition: "max-height .35s var(--ease)",
          }}>
            <p style={{ padding: "0 24px 20px", fontSize: 14, color: "var(--ds-muted)", lineHeight: 1.7 }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
