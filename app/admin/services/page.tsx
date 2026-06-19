"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Dumbbell, Users, Trophy, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  is_popular: boolean
  sort_order: number
}

const iconOptions = [
  { value: "dumbbell", label: "Гантели", icon: Dumbbell },
  { value: "users",    label: "Группа",  icon: Users },
  { value: "trophy",   label: "Трофей",  icon: Trophy },
  { value: "target",   label: "Цель",    icon: Target },
]

const EMPTY_FORM = { icon: "dumbbell", title: "", description: "", features: "", is_popular: false, sort_order: 0 }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const supabase = createClient()

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order")
    if (error) toast.error("Ошибка загрузки: " + error.message)
    setServices(data || [])
    setIsLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const featuresArray = formData.features.split("\n").map(f => f.trim()).filter(Boolean)
    const payload = {
      icon: formData.icon,
      title: formData.title,
      description: formData.description,
      price: "",
      features: featuresArray,
      is_popular: formData.is_popular,
      sort_order: formData.sort_order,
    }

    const { error } = editingItem
      ? await supabase.from("services").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editingItem.id)
      : await supabase.from("services").insert([payload])

    setSaving(false)
    if (error) { toast.error("Ошибка сохранения: " + error.message); return }

    toast.success(editingItem ? "Услуга обновлена" : "Услуга добавлена")
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData(EMPTY_FORM)
    fetchServices()
  }

  const handleEdit = (item: Service) => {
    setEditingItem(item)
    setFormData({
      icon: item.icon,
      title: item.title,
      description: item.description,
      features: (item.features ?? []).join("\n"),
      is_popular: item.is_popular,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту услугу?")) return
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) { toast.error("Ошибка удаления: " + error.message); return }
    toast.success("Услуга удалена")
    fetchServices()
  }

  const openNewDialog = () => {
    setEditingItem(null)
    setFormData(EMPTY_FORM)
    setIsDialogOpen(true)
  }

  const getIconComponent = (name: string) => iconOptions.find(o => o.value === name)?.icon || Dumbbell

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Программы</h1>
          <p className="text-muted-foreground mt-2">Управление программами тренировок</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) { setEditingItem(null); setFormData(EMPTY_FORM) } }}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} size="lg"><Plus className="mr-2 h-4 w-4" />Добавить программу</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редактировать программу" : "Новая программа"}</DialogTitle>
              <DialogDescription>Заполните информацию о программе</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData(f => ({ ...f, icon: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(opt => {
                        const Ic = opt.icon
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2"><Ic className="h-4 w-4" />{opt.label}</div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Порядок</Label>
                  <Input type="number" value={formData.sort_order} onChange={e => setFormData(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Название</Label>
                <Input placeholder="Групповые тренировки" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea placeholder="Описание программы" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Преимущества (каждое с новой строки)</Label>
                <Textarea placeholder={"Персональная программа\nАнализ техники\nКонсультации"} value={formData.features} onChange={e => setFormData(f => ({ ...f, features: e.target.value }))} rows={4} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_popular} onCheckedChange={v => setFormData(f => ({ ...f, is_popular: v }))} />
                <Label>Популярная программа</Label>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => {
            const Icon = getIconComponent(service.icon)
            return (
              <Card key={service.id} className={service.is_popular ? "border-primary border-2" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {service.title}
                        {service.is_popular && <Badge className="bg-primary">Популярное</Badge>}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                  <ul className="space-y-1">
                    {(service.features ?? []).map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
          {services.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center text-muted-foreground">Программы не добавлены.</CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
