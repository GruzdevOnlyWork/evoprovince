import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface ScheduleItem {
  id: string
  day_of_week: string
  time_slot: string
  trainer: string
  training_type: string
}

const daysOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

async function getSchedule() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("schedule").select("*")

  if (error) {
    console.error("[v0] Error fetching schedule:", error)
    return []
  }

  return data as ScheduleItem[]
}

export default async function SchedulePage() {
  const schedule = await getSchedule()

  // Group by day and sort
  const scheduleByDay = daysOrder
    .map((day) => ({
      day,
      sessions: schedule.filter((s) => s.day_of_week === day),
    }))
    .filter((d) => d.sessions.length > 0)

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Расписание тренировок</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Выбирайте удобное время и присоединяйтесь к тренировкам
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <Card>
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>
                      <strong>Место:</strong> Спортивная площадка "Эволюция"
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>
                      <strong>Длительность:</strong> 2 часа
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto grid gap-6">
            {scheduleByDay.map((daySchedule) => (
              <Card key={daySchedule.day}>
                <CardHeader>
                  <CardTitle className="text-2xl">{daySchedule.day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Время</TableHead>
                          <TableHead>Тип тренировки</TableHead>
                          <TableHead>Тренер</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {daySchedule.sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {session.time_slot}
                              </div>
                            </TableCell>
                            <TableCell>{session.training_type}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {session.trainer}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}

            {scheduleByDay.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Расписание временно недоступно
                </CardContent>
              </Card>
            )}
          </div>

          <div className="max-w-6xl mx-auto mt-12">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <p className="text-center text-lg">
                  <strong>Обратите внимание:</strong> Расписание может меняться в зависимости от погодных условий.
                  Следите за обновлениями в нашей группе VK.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
