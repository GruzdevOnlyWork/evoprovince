"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Key, User } from "lucide-react"

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Новые пароли не совпадают" })
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Пароль должен содержать минимум 6 символов" })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage({ type: "success", text: "Пароль успешно изменен" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Ошибка при смене пароля" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">Управление учетной записью администратора</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Изменить пароль
            </CardTitle>
            <CardDescription>Обновите пароль для входа в админ-панель</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Новый пароль</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Подтвердите пароль</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {message && (
                <p className={`text-sm ${message.type === "error" ? "text-destructive" : "text-green-600"}`}>
                  {message.text}
                </p>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сменить пароль"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Сессия
            </CardTitle>
            <CardDescription>Управление текущей сессией</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Выход из системы завершит текущую сессию. Для повторного входа потребуется ввести логин и пароль.
            </p>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти из системы
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
