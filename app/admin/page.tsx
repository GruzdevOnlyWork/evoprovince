import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Briefcase, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  const [scheduleResult, servicesResult, tournamentsResult] = await Promise.all([
    supabase.from("schedule").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("tournaments").select("id", { count: "exact", head: true }),
  ])

  return {
    scheduleCount: scheduleResult.count || 0,
    servicesCount: servicesResult.count || 0,
    tournamentsCount: tournamentsResult.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: "Записей в расписании",
      value: stats.scheduleCount,
      icon: Calendar,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Активных услуг",
      value: stats.servicesCount,
      icon: Briefcase,
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Всего турниров",
      value: stats.tournamentsCount,
      icon: Trophy,
      change: "Стабильно",
      changeType: "neutral" as const,
    },
  ]

  const quickActions = [
    {
      title: "Расписание",
      description: "Управление тренировочным расписанием",
      href: "/admin/schedule",
      icon: Calendar,
    },
    {
      title: "Услуги",
      description: "Редактирование услуг и цен",
      href: "/admin/services",
      icon: Briefcase,
    },
    {
      title: "Турниры",
      description: "Организация соревнований",
      href: "/admin/tournaments",
      icon: Trophy,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Обзор</h1>
        <p className="text-muted-foreground mt-2">Управление контентом и настройками сайта</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p
                  className={cn(
                    "text-xs mt-1",
                    stat.changeType === "positive" && "text-green-600",
                    stat.changeType === "neutral" && "text-muted-foreground",
                  )}
                >
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Недавняя активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span>Обновлено расписание на неделю</span>
              <span className="text-xs">2 часа назад</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>Добавлена новая услуга</span>
              <span className="text-xs">5 часов назад</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Опубликован турнир</span>
              <span className="text-xs">1 день назад</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
