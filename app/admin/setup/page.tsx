"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react"

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const checkUser = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch("/api/admin/check-user")
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при проверке пользователя" })
    } finally {
      setLoading(false)
    }
  }

  const makeAdmin = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch("/api/admin/make-admin", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Права администратора успешно назначены!" })
        await checkUser()
        setTimeout(() => {
          window.location.href = "/admin"
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.error || "Не удалось назначить права администратора" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при назначении прав администратора" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Настройка прав администратора</CardTitle>
          <CardDescription>Проверьте статус вашего аккаунта и получите права администратора</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button onClick={checkUser} disabled={loading} className="w-full bg-transparent" variant="outline">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                "Проверить статус аккаунта"
              )}
            </Button>

            {userInfo && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Статус авторизации:</p>
                  <p className="text-sm">
                    {userInfo.authenticated ? (
                      <span className="text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Авторизован
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Не авторизован
                      </span>
                    )}
                  </p>
                </div>

                {userInfo.authenticated && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">User ID:</p>
                      <p className="text-sm text-muted-foreground font-mono text-xs">{userInfo.userId}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Статус администратора:</p>
                      <p className="text-sm">
                        {userInfo.isAdmin ? (
                          <span className="text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Администратор
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-2">
                            <XCircle className="h-4 w-4" /> Не администратор
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">User Metadata:</p>
                      <pre className="text-xs bg-background p-2 rounded overflow-auto">
                        {JSON.stringify(userInfo.userMetadata, null, 2)}
                      </pre>
                    </div>

                    {!userInfo.isAdmin && (
                      <Button onClick={makeAdmin} disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                        {loading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Назначение прав...
                          </>
                        ) : (
                          "Назначить права администратора"
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {!userInfo && (
              <Alert>
                <AlertDescription>
                  Нажмите кнопку выше, чтобы проверить статус вашего аккаунта. Если вы не авторизованы, сначала{" "}
                  <a href="/auth/login" className="underline font-medium">
                    войдите в систему
                  </a>
                  .
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
