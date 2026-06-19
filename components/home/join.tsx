"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Icon } from "@/lib/icons"

interface Service {
  id: string
  title: string
}

export function JoinSection({ services }: { services: Service[] }) {
  const [form, setForm] = useState({ name: "", phone: "", program: "" })
  const [sending, setSending] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    background: "var(--ink-4)", border: "1px solid var(--line-2)",
    color: "var(--ds-white)", fontSize: 14, outline: "none",
    transition: "border-color .2s",
    fontFamily: "inherit",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error("Заполните имя и телефон")
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 600))
    setSending(false)
    toast.success("Записались! Мы свяжемся с вами")
    setForm({ name: "", phone: "", program: "" })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        type="text"
        placeholder="Ваше имя"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--acid)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-2)")}
      />
      <input
        type="tel"
        placeholder="+7 (___) ___-__-__"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--acid)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-2)")}
      />
      <select
        value={form.program}
        onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
        style={{ ...inputStyle, appearance: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--acid)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-2)")}
      >
        <option value="">Выберите программу</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={sending}
        style={{
          padding: "14px 28px", background: "var(--acid)", color: "var(--on-acid)",
          fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          border: "none", cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.7 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "background .2s, opacity .2s",
        }}
        onMouseEnter={(e) => !sending && (e.currentTarget.style.background = "var(--acid-deep)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--acid)")}
      >
        {sending ? "Отправляем..." : "Записаться на тренировку"}
        {!sending && <Icon name="arrow" size={16} sw={2} />}
      </button>
    </form>
  )
}
