"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Criterion { id: string; name: string; max_score: number; color: string; sort_order: number }
interface Tier { id: string; code: string; label: string; pts: number; sort_order: number }
interface Element { id: string; name: string; tier_code: string; element_type: string; sort_order: number }
interface Deduction { id: string; name: string; pts: number; sort_order: number }
interface Rank { id: string; min_score: number; name: string; color: string; sort_order: number }

export default function AdminJudgingPage() {
  const [criteria, setCriteria]     = useState<Criterion[]>([])
  const [tiers, setTiers]           = useState<Tier[]>([])
  const [elements, setElements]     = useState<Element[]>([])
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [ranks, setRanks]           = useState<Rank[]>([])
  const [loading, setLoading]       = useState(true)
  const [dbError, setDbError]       = useState<string | null>(null)

  const getClient = () => {
    try { return createClient() } catch { return null }
  }

  const fetchAll = async () => {
    setLoading(true)
    setDbError(null)
    const supabase = getClient()
    if (!supabase) {
      setDbError("Supabase не настроен. Проверьте переменные окружения.")
      setLoading(false)
      return
    }
    try {
      const [c, t, e, d, r] = await Promise.all([
        supabase.from("judging_criteria").select("*").order("sort_order"),
        supabase.from("judging_tiers").select("*").order("sort_order"),
        supabase.from("judging_elements").select("*").order("element_type").order("sort_order"),
        supabase.from("judging_deductions").select("*").order("sort_order"),
        supabase.from("judging_ranks").select("*").order("sort_order"),
      ])
      if (c.error || t.error || e.error || d.error || r.error) {
        const err = c.error || t.error || e.error || d.error || r.error
        if (err?.code === "42P01" || err?.message?.includes("does not exist")) {
          setDbError("Таблицы судейства не найдены. Выполните скрипт scripts/004_judging_tables.sql в Supabase Dashboard.")
        } else {
          setDbError(err?.message ?? "Ошибка загрузки данных")
        }
        setLoading(false)
        return
      }
      setCriteria(c.data || [])
      setTiers(t.data || [])
      setElements(e.data || [])
      setDeductions(d.data || [])
      setRanks(r.data || [])
    } catch (err) {
      setDbError(err instanceof Error ? err.message : "Неизвестная ошибка")
    }
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const del = async (table: string, id: string) => {
    if (!confirm("Удалить запись?")) return
    const supabase = getClient()
    if (!supabase) { toast.error("Нет подключения к БД"); return }
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) { toast.error("Ошибка удаления: " + error.message); return }
    toast.success("Запись удалена")
    fetchAll()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Система судейства</h1>
        <p className="text-muted-foreground">Редактирование критериев, тиров, элементов, сбавок и рангов</p>
      </div>

      {dbError && (
        <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
          <p className="text-sm font-medium text-destructive mb-1">Ошибка загрузки</p>
          <p className="text-sm text-muted-foreground">{dbError}</p>
          {dbError.includes("скрипт") && (
            <p className="text-xs text-muted-foreground mt-2">
              Путь к файлу: <code className="bg-muted px-1 rounded">scripts/004_judging_tables.sql</code>
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : dbError ? null : (
        <Tabs defaultValue="criteria">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="criteria">Критерии</TabsTrigger>
            <TabsTrigger value="tiers">Тиры</TabsTrigger>
            <TabsTrigger value="elements">Элементы</TabsTrigger>
            <TabsTrigger value="deductions">Сбавки</TabsTrigger>
            <TabsTrigger value="ranks">Ранги</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria">
            <CriteriaTab criteria={criteria} onSave={fetchAll} onDelete={(id) => del("judging_criteria", id)} getClient={getClient} />
          </TabsContent>

          <TabsContent value="tiers">
            <TiersTab tiers={tiers} onSave={fetchAll} onDelete={(id) => del("judging_tiers", id)} getClient={getClient} />
          </TabsContent>

          <TabsContent value="elements">
            <ElementsTab elements={elements} tiers={tiers} onSave={fetchAll} onDelete={(id) => del("judging_elements", id)} getClient={getClient} />
          </TabsContent>

          <TabsContent value="deductions">
            <DeductionsTab deductions={deductions} onSave={fetchAll} onDelete={(id) => del("judging_deductions", id)} getClient={getClient} />
          </TabsContent>

          <TabsContent value="ranks">
            <RanksTab ranks={ranks} onSave={fetchAll} onDelete={(id) => del("judging_ranks", id)} getClient={getClient} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function CriteriaTab({ criteria, onSave, onDelete, getClient }: {
  criteria: Criterion[]; onSave: () => void; onDelete: (id: string) => void; getClient: () => ReturnType<typeof createClient> | null
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Criterion | null>(null)
  const [form, setForm] = useState({ name: "", max_score: "10", color: "#4ade80", sort_order: "0" })

  const openNew = () => { setEditing(null); setForm({ name: "", max_score: "10", color: "#4ade80", sort_order: String(criteria.length + 1) }); setOpen(true) }
  const openEdit = (c: Criterion) => { setEditing(c); setForm({ name: c.name, max_score: String(c.max_score), color: c.color, sort_order: String(c.sort_order) }); setOpen(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const db = getClient(); if (!db) { toast.error("Нет подключения к БД"); return }
    const data = { name: form.name, max_score: parseFloat(form.max_score), color: form.color, sort_order: parseInt(form.sort_order) }
    const { error } = editing
      ? await db.from("judging_criteria").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editing.id)
      : await db.from("judging_criteria").insert([data])
    if (error) { toast.error("Ошибка: " + error.message); return }
    toast.success("Сохранено")
    setOpen(false); onSave()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Добавить критерий</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Редактировать" : "Новый критерий"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2"><Label>Название</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Макс. баллов</Label><Input type="number" step="0.5" value={form.max_score} onChange={e => setForm(f => ({...f, max_score: e.target.value}))} required /></div>
                <div className="space-y-2"><Label>Порядок</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))} /></div>
              </div>
              <div className="space-y-2"><Label>Цвет (HEX)</Label><div className="flex gap-2"><input type="color" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="w-10 h-10 border rounded cursor-pointer" /><Input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} /></div></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {criteria.map(c => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <div><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">Макс: {c.max_score} | №{c.sort_order}</p></div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TiersTab({ tiers, onSave, onDelete, getClient }: {
  tiers: Tier[]; onSave: () => void; onDelete: (id: string) => void; getClient: () => ReturnType<typeof createClient> | null
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tier | null>(null)
  const [form, setForm] = useState({ code: "", label: "", pts: "1.0", sort_order: "0" })

  const openNew = () => { setEditing(null); setForm({ code: "", label: "", pts: "1.0", sort_order: String(tiers.length + 1) }); setOpen(true) }
  const openEdit = (t: Tier) => { setEditing(t); setForm({ code: t.code, label: t.label, pts: String(t.pts), sort_order: String(t.sort_order) }); setOpen(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const db = getClient(); if (!db) { toast.error("Нет подключения к БД"); return }
    const data = { code: form.code, label: form.label, pts: parseFloat(form.pts), sort_order: parseInt(form.sort_order) }
    const { error } = editing
      ? await db.from("judging_tiers").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editing.id)
      : await db.from("judging_tiers").insert([data])
    if (error) { toast.error("Ошибка: " + error.message); return }
    toast.success("Сохранено")
    setOpen(false); onSave()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Добавить тир</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Редактировать тир" : "Новый тир"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Код (A-E)</Label><Input value={form.code} maxLength={2} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} required /></div>
                <div className="space-y-2"><Label>Название</Label><Input value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Баллов</Label><Input type="number" step="0.5" value={form.pts} onChange={e => setForm(f => ({...f, pts: e.target.value}))} required /></div>
                <div className="space-y-2"><Label>Порядок</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))} /></div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {tiers.map(t => (
          <Card key={t.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div><span className="text-2xl font-bold text-primary mr-2">{t.code}</span><span className="font-medium">{t.label}</span><p className="text-sm text-muted-foreground">+{t.pts} балла</p></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ElementsTab({ elements, tiers, onSave, onDelete, getClient }: {
  elements: Element[]; tiers: Tier[]; onSave: () => void; onDelete: (id: string) => void; getClient: () => ReturnType<typeof createClient> | null
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Element | null>(null)
  const [form, setForm] = useState({ name: "", tier_code: "A", element_type: "static", sort_order: "0" })

  const openNew = () => { setEditing(null); setForm({ name: "", tier_code: tiers[0]?.code || "A", element_type: "static", sort_order: "0" }); setOpen(true) }
  const openEdit = (el: Element) => { setEditing(el); setForm({ name: el.name, tier_code: el.tier_code, element_type: el.element_type, sort_order: String(el.sort_order) }); setOpen(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const db = getClient(); if (!db) { toast.error("Нет подключения к БД"); return }
    const data = { name: form.name, tier_code: form.tier_code, element_type: form.element_type, sort_order: parseInt(form.sort_order) }
    const { error } = editing
      ? await db.from("judging_elements").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editing.id)
      : await db.from("judging_elements").insert([data])
    if (error) { toast.error("Ошибка: " + error.message); return }
    toast.success("Сохранено")
    setOpen(false); onSave()
  }

  const statics  = elements.filter(e => e.element_type === "static")
  const dynamics = elements.filter(e => e.element_type === "dynamic")

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Добавить элемент</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Редактировать элемент" : "Новый элемент"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2"><Label>Название</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Тир</Label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background text-sm" value={form.tier_code} onChange={e => setForm(f => ({...f, tier_code: e.target.value}))}>
                    {tiers.map(t => <option key={t.code} value={t.code}>{t.code} — {t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background text-sm" value={form.element_type} onChange={e => setForm(f => ({...f, element_type: e.target.value}))}>
                    <option value="static">Статика</option>
                    <option value="dynamic">Динамика</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Порядок</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))} /></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Статика ({statics.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {statics.map(el => (
              <div key={el.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                <div><span className="text-sm font-medium">{el.name}</span><span className="ml-2 text-xs text-muted-foreground">Тир {el.tier_code}</span></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(el)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(el.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Динамика ({dynamics.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {dynamics.map(el => (
              <div key={el.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                <div><span className="text-sm font-medium">{el.name}</span><span className="ml-2 text-xs text-muted-foreground">Тир {el.tier_code}</span></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(el)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(el.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DeductionsTab({ deductions, onSave, onDelete, getClient }: {
  deductions: Deduction[]; onSave: () => void; onDelete: (id: string) => void; getClient: () => ReturnType<typeof createClient> | null
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Deduction | null>(null)
  const [form, setForm] = useState({ name: "", pts: "1.0", sort_order: "0" })

  const openNew = () => { setEditing(null); setForm({ name: "", pts: "1.0", sort_order: String(deductions.length + 1) }); setOpen(true) }
  const openEdit = (d: Deduction) => { setEditing(d); setForm({ name: d.name, pts: String(d.pts), sort_order: String(d.sort_order) }); setOpen(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const db = getClient(); if (!db) { toast.error("Нет подключения к БД"); return }
    const data = { name: form.name, pts: parseFloat(form.pts), sort_order: parseInt(form.sort_order) }
    const { error } = editing
      ? await db.from("judging_deductions").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editing.id)
      : await db.from("judging_deductions").insert([data])
    if (error) { toast.error("Ошибка: " + error.message); return }
    toast.success("Сохранено")
    setOpen(false); onSave()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Добавить сбавку</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Редактировать сбавку" : "Новая сбавка"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2"><Label>Описание</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Штраф (баллов)</Label><Input type="number" step="0.5" value={form.pts} onChange={e => setForm(f => ({...f, pts: e.target.value}))} required /></div>
                <div className="space-y-2"><Label>Порядок</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))} /></div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {deductions.map(d => (
          <Card key={d.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div><p className="font-medium">{d.name}</p><p className="text-sm text-red-500">-{d.pts} балла</p></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RanksTab({ ranks, onSave, onDelete, getClient }: {
  ranks: Rank[]; onSave: () => void; onDelete: (id: string) => void; getClient: () => ReturnType<typeof createClient> | null
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Rank | null>(null)
  const [form, setForm] = useState({ name: "", min_score: "0", color: "#888888", sort_order: "0" })

  const openNew = () => { setEditing(null); setForm({ name: "", min_score: "0", color: "#888888", sort_order: String(ranks.length + 1) }); setOpen(true) }
  const openEdit = (r: Rank) => { setEditing(r); setForm({ name: r.name, min_score: String(r.min_score), color: r.color, sort_order: String(r.sort_order) }); setOpen(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const db = getClient(); if (!db) { toast.error("Нет подключения к БД"); return }
    const data = { name: form.name, min_score: parseInt(form.min_score), color: form.color, sort_order: parseInt(form.sort_order) }
    const { error } = editing
      ? await db.from("judging_ranks").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editing.id)
      : await db.from("judging_ranks").insert([data])
    if (error) { toast.error("Ошибка: " + error.message); return }
    toast.success("Сохранено")
    setOpen(false); onSave()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Добавить ранг</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Редактировать ранг" : "Новый ранг"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2"><Label>Название</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Мин. баллов</Label><Input type="number" value={form.min_score} onChange={e => setForm(f => ({...f, min_score: e.target.value}))} required /></div>
                <div className="space-y-2"><Label>Порядок</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))} /></div>
              </div>
              <div className="space-y-2"><Label>Цвет</Label><div className="flex gap-2"><input type="color" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className="w-10 h-10 border rounded cursor-pointer" /><Input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} /></div></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {ranks.map(r => (
          <Card key={r.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: r.color }} />
                <div><p className="font-bold" style={{ color: r.color }}>{r.name}</p><p className="text-sm text-muted-foreground">от {r.min_score} баллов</p></div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
