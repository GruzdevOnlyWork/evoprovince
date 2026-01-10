import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldX } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Доступ запрещен</CardTitle>
            <CardDescription>У вас нет прав администратора для доступа к этой странице</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/admin/setup">Получить права администратора</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">На главную</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">Войти с другим аккаунтом</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
