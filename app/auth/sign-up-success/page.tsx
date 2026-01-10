import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Проверьте почту</CardTitle>
            <CardDescription>Мы отправили ссылку для подтверждения на вашу почту</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              После подтверждения email вы сможете войти в админ-панель
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Перейти к входу</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
