import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Briefcase, Trophy, Settings, Tv2, Scale } from "lucide-react"

const SECTIONS = [
  { href: "/admin/schedule",    label: "Расписание",    desc: "Управление тренировочным расписанием", icon: Calendar },
  { href: "/admin/services",    label: "Программы",     desc: "Редактирование программ тренировок",  icon: Briefcase },
  { href: "/admin/tournaments", label: "Турниры",       desc: "Управление турнирами и победителями", icon: Trophy },
  { href: "/admin/judging",     label: "Судейство",     desc: "Критерии, тиры, элементы и сбавки",  icon: Scale },
  { href: "/admin/vk-settings", label: "VK Новости",    desc: "Настройка источника новостей ВКонтакте", icon: Tv2 },
  { href: "/admin/settings",    label: "Настройки",     desc: "Общие настройки сайта", icon: Settings },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Эволюция Провинции — административная часть</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="block no-underline">
            <Card className="h-full transition-colors hover:border-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: "rgba(74,222,128,0.12)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--acid)" }} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          Перейдите на сайт чтобы увидеть изменения: <Link href="/" className="text-primary hover:underline">Открыть сайт →</Link>
        </p>
      </div>
    </div>
  )
}
