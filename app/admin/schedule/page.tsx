"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
const EMPTY = { day_of_week: "", time_slot: "", trainer: "", training_type: "" }

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [formData, setFormData] = useState(EMPTY)

  const supabase = createClient()

  const fetchSchedule = async () => {
    const { data, error } = await supabase.from("schedule").select("*").order("day_of_week")
    if (error) toast.error("Ошибка загрузки: " + error.message)
    setSchedule(data || [])
    setIsLoading(false)
  }

  useEffect(() => { fetchSchedule() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.day_of_week) { toast.error("Выберите день недели"); return }
    setSaving(true)

    const { error } = editingItem
      ? await supabase.from("schedule").update({ ...formData, updated_at: new Date().toISOString() }).eq("id", editingItem.id)
      : await supabase.from("schedule").insert([formData])

    setSaving(false)
    if (error) { toast.error("Ошибка: " + error.message); return }

    toast.success(editingItem ? "Запись обновлена" : "Запись добавлена")
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData(EMPTY)
    fetchSchedule()
  }

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData({ day_of_week: item.day_of_week, time_slot: item.time_slot, trainer: item.trainer, training_type: item.training_type })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту запись?")) return
    const { error } = await supabase.from("schedule").delete().eq("id", id)
    if (error) { toast.error("Ошибка удаления: " + error.message); return }
    toast.success("Запись удалена")
    fetchSchedule()
  }

  const openNewDialog = () => {
    setEditingItem(null)
    setFormData(EMPTY)
    setIsDialogOpen(true)
  }

  const scheduleByDay = DAYS.map(day => ({ day, sessions: schedule.filter(s => s.day_of_week === day) }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Расписание</h1>
          <p className="text-muted-foreground mt-2">Управление тренировочным расписанием</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={v => { setIsDialogOpen(v); if (!v) { setEditingItem(null); setFormData(EMPTY) } }}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} size="lg"><Plus className="mr-2 h-4 w-4" />Добавить запись</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редактировать запись" : "Новая запись"}</DialogTitle>
              <DialogDescription>Заполните данные о тренировке</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>День недели</Label>
                <Select value={formData.day_of_week} onValueChange={v => setFormData(f => ({ ...f, day_of_week: v }))}>
                  <SelectTrigger><SelectValue placeholder="Выберите день" /></SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Input placeholder="10:00 - 12:00" value={formData.time_slot} onChange={e => setFormData(f => ({ ...f, time_slot: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Тренер</Label>
                <Input placeholder="Имя тренера" value={formData.trainer} onChange={e => setFormData(f => ({ ...f, trainer: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Тип тренировки</Label>
                <Input placeholder="Групповая тренировка" value={formData.training_type} onChange={e => setFormData(f => ({ ...f, training_type: e.target.value }))} required />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                <Button type="submit" disabled={saving}>{saving ? "Сохранение..." : editingItem ? "Сохранить" : "Добавить"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <div className="space-y-6">
          {scheduleByDay.map(({ day, sessions }) => sessions.length > 0 && (
            <Card key={day}>
              <CardHeader><CardTitle>{day}</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Тип тренировки</TableHead>
                      <TableHead>Тренер</TableHead>
                      <TableHead className="w-25">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map(session => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.time_slot}</TableCell>
                        <TableCell>{session.training_type}</TableCell>
                        <TableCell>{session.trainer}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(session)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
          {schedule.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Расписание пусто. Добавьте первую запись.</CardContent></Card>
          )}
        </div>
      )}
    </div>
  )
}
