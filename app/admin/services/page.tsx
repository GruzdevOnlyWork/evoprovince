"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Dumbbell, Users, Trophy, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  is_popular: boolean
  sort_order: number
}

const iconOptions = [
  { value: "dumbbell", label: "Гантели", icon: Dumbbell },
  { value: "users", label: "Группа", icon: Users },
  { value: "trophy", label: "Трофей", icon: Trophy },
  { value: "target", label: "Цель", icon: Target },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    icon: "dumbbell",
    title: "",
    description: "",
    price: "",
    features: "",
    is_popular: false,
    sort_order: 0,
  })

  const supabase = createClient()

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order")
    if (error) {
      console.error("[v0] Error fetching services:", error)
    } else {
      setServices(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const featuresArray = formData.features.split("\n").filter((f) => f.trim())

    if (editingItem) {
      const { error } = await supabase
        .from("services")
        .update({
          icon: formData.icon,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          features: featuresArray,
          is_popular: formData.is_popular,
          sort_order: formData.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingItem.id)

      if (error) {
        console.error("[v0] Error updating service:", error)
        return
      }
    } else {
      const { error } = await supabase.from("services").insert([
        {
          icon: formData.icon,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          features: featuresArray,
          is_popular: formData.is_popular,
          sort_order: formData.sort_order,
        },
      ])

      if (error) {
        console.error("[v0] Error creating service:", error)
        return
      }
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    resetForm()
    fetchServices()
  }

  const resetForm = () => {
    setFormData({
      icon: "dumbbell",
      title: "",
      description: "",
      price: "",
      features: "",
      is_popular: false,
      sort_order: 0,
    })
  }

  const handleEdit = (item: Service) => {
    setEditingItem(item)
    setFormData({
      icon: item.icon,
      title: item.title,
      description: item.description,
      price: item.price,
      features: item.features.join("\n"),
      is_popular: item.is_popular,
      sort_order: item.sort_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту услугу?")) return

    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) {
      console.error("[v0] Error deleting service:", error)
      return
    }
    fetchServices()
  }

  const openNewDialog = () => {
    setEditingItem(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find((o) => o.value === iconName)
    return option?.icon || Dumbbell
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Услуги</h1>
          <p className="text-muted-foreground mt-2">Управление услугами и ценами</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Редактировать услугу" : "Новая услуга"}</DialogTitle>
              <DialogDescription>Заполните информацию об услуге</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Порядок сортировки</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  placeholder="Индивидуальные тренировки"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  placeholder="Описание услуги"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Цена</Label>
                <Input
                  placeholder="от 1000 ₽"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Преимущества (каждое с новой строки)</Label>
                <Textarea
                  placeholder="Персональная программа&#10;Анализ техники&#10;Консультации"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
                <Label>Популярная услуга</Label>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getIconComponent(service.icon)
            return (
              <Card key={service.id} className={service.is_popular ? "border-primary border-2" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {service.title}
                          {service.is_popular && <Badge className="bg-primary">Популярное</Badge>}
                        </CardTitle>
                        <p className="text-2xl font-bold text-primary mt-1">{service.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
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
              <CardContent className="py-12 text-center text-muted-foreground">
                Услуги не добавлены. Создайте первую услугу.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
