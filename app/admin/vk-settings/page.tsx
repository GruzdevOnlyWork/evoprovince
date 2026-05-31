"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, RefreshCw, Save } from "lucide-react"
import Link from "next/link"

interface VKSettings {
  id: string
  group_id: string
  posts_count: number
}

export default function AdminVKSettingsPage() {
  const [settings, setSettings] = useState<VKSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    group_id: "evoprovince",
    posts_count: 10,
  })

  const supabase = createClient()

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("vk_settings").select("*").single()
    if (error && error.code !== "PGRST116") {
      toast.error("Ошибка загрузки настроек: " + error.message)
    }
    if (data) {
      setSettings(data)
      setFormData({ group_id: data.group_id, posts_count: data.posts_count })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const { error } = settings
      ? await supabase.from("vk_settings").update({ ...formData, updated_at: new Date().toISOString() }).eq("id", settings.id)
      : await supabase.from("vk_settings").insert([formData])

    setIsSaving(false)
    if (error) { toast.error("Ошибка сохранения: " + error.message); return }
    toast.success("Настройки сохранены")
    fetchSettings()
  }

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройки VK</h1>
        <p className="text-muted-foreground">Настройка интеграции с ВКонтакте для получения новостей</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Параметры группы VK</CardTitle>
            <CardDescription>Укажите идентификатор группы и количество загружаемых постов</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>ID группы VK (короткое имя)</Label>
                <Input
                  placeholder="evolprov"
                  value={formData.group_id}
                  onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Короткое имя группы из URL: vk.com/<strong>evolprov</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label>Количество постов</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.posts_count}
                  onChange={(e) => setFormData({ ...formData, posts_count: Number.parseInt(e.target.value) || 10 })}
                  required
                />
                <p className="text-xs text-muted-foreground">Сколько последних постов загружать (от 1 до 100)</p>
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация</CardTitle>
            <CardDescription>Как работает интеграция с VK</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">API Token</h4>
              <p className="text-sm text-muted-foreground">
                Для работы интеграции необходим токен VK API. Он должен быть добавлен в переменную окружения{" "}
                <code className="bg-muted px-1 rounded">VK_API_TOKEN</code>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Кэширование</h4>
              <p className="text-sm text-muted-foreground">
                Посты кэшируются на 5 минут для оптимизации загрузки страницы
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Fallback данные</h4>
              <p className="text-sm text-muted-foreground">Если VK API недоступен, будут показаны демо-новости</p>
            </div>
            <div className="pt-4 border-t">
              <Button asChild variant="outline">
                <Link href={`https://vk.com/${formData.group_id}`} target="_blank" rel="noopener noreferrer">
                  Открыть группу VK
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
