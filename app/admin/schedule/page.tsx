"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [formData, setFormData] = useState({
    day_of_week: "",
    time_slot: "",
    trainer: "",
    training_type: "",
  })

  const supabase = createClient()

  const fetchSchedule = async () => {
    const { data, error } = await supabase.from("schedule").select("*").order("day_of_week")
    if (error) {
      console.error("[v0] Error fetching schedule:", error)
    } else {
      setSchedule(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      const { error } = await supabase
        .from("schedule")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingItem.id)

      if (error) {
        console.error("[v0] Error updating schedule:", error)
        return
      }
    } else {
      const { error } = await supabase.from("schedule").insert([formData])

      if (error) {
        console.error("[v0] Error creating schedule:", error)
        return
      }
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ day_of_week: "", time_slot: "", trainer: "", training_type: "" })
    fetchSchedule()
  }

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData({
      day_of_week: item.day_of_week,
      time_slot: item.time_slot,
      trainer: item.trainer,
      training_type: item.training_type,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту запись?")) return

    const { error } = await supabase.from("schedule").delete().eq("id", id)
    if (error) {
      console.error("[v0] Error deleting schedule:", error)
      return
    }
    fetchSchedule()
  }

  const openNewDialog = () => {
    setEditingItem(null)
    setFormData({ day_of_week: "", time_slot: "", trainer: "", training_type: "" })
    setIsDialogOpen(true)
  }

  // Group schedule by day
  const scheduleByDay = daysOfWeek.map((day) => ({
    day,
    sessions: schedule.filter((s) => s.day_of_week === day),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Расписание</h1>
          <p className="text-muted-foreground mt-2">Управление тренировочным расписанием</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Добавить запись
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редактировать запись" : "Новая запись"}</DialogTitle>
              <DialogDescription>Заполните данные о тренировке</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>День недели</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(v) => setFormData({ ...formData, day_of_week: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите день" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Input
                  placeholder="10:00 - 12:00"
                  value={formData.time_slot}
                  onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Тренер</Label>
                <Input
                  placeholder="Имя тренера"
                  value={formData.trainer}
                  onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Тип тренировки</Label>
                <Input
                  placeholder="Групповая тренировка"
                  value={formData.training_type}
                  onChange={(e) => setFormData({ ...formData, training_type: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">{editingItem ? "Сохранить" : "Добавить"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <div className="space-y-6">
          {scheduleByDay.map(
            ({ day, sessions }) =>
              sessions.length > 0 && (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle>{day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Время</TableHead>
                          <TableHead>Тип тренировки</TableHead>
                          <TableHead>Тренер</TableHead>
                          <TableHead className="w-[100px]">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">{session.time_slot}</TableCell>
                            <TableCell>{session.training_type}</TableCell>
                            <TableCell>{session.trainer}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(session)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ),
          )}

          {schedule.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Расписание пусто. Добавьте первую запись.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
