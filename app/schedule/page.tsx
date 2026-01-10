import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, User } from "lucide-react"

const scheduleData = [
  {
    day: "Понедельник",
    sessions: [
      { time: "10:00 - 12:00", trainer: "Алексей Иванов", type: "Групповая тренировка" },
      { time: "18:00 - 20:00", trainer: "Дмитрий Петров", type: "Продвинутый уровень" },
    ],
  },
  {
    day: "Вторник",
    sessions: [
      { time: "10:00 - 12:00", trainer: "Сергей Смирнов", type: "Индивидуальные занятия" },
      { time: "19:00 - 21:00", trainer: "Алексей Иванов", type: "Подготовка к турнирам" },
    ],
  },
  {
    day: "Среда",
    sessions: [
      { time: "10:00 - 12:00", trainer: "Дмитрий Петров", type: "Групповая тренировка" },
      { time: "18:00 - 20:00", trainer: "Сергей Смирнов", type: "Начинающие" },
    ],
  },
  {
    day: "Четверг",
    sessions: [
      { time: "10:00 - 12:00", trainer: "Алексей Иванов", type: "Индивидуальные занятия" },
      { time: "19:00 - 21:00", trainer: "Дмитрий Петров", type: "Продвинутый уровень" },
    ],
  },
  {
    day: "Пятница",
    sessions: [
      { time: "10:00 - 12:00", trainer: "Сергей Смирнов", type: "Групповая тренировка" },
      { time: "18:00 - 20:00", trainer: "Алексей Иванов", type: "Все уровни" },
    ],
  },
  {
    day: "Суббота",
    sessions: [
      { time: "11:00 - 13:00", trainer: "Дмитрий Петров", type: "Мастер-класс" },
      { time: "15:00 - 17:00", trainer: "Сергей Смирнов", type: "Открытая тренировка" },
    ],
  },
  {
    day: "Воскресенье",
    sessions: [{ time: "11:00 - 13:00", trainer: "Алексей Иванов", type: "Групповая тренировка" }],
  },
]

export default function SchedulePage() {
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
            {scheduleData.map((daySchedule) => (
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
                        {daySchedule.sessions.map((session, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {session.time}
                              </div>
                            </TableCell>
                            <TableCell>{session.type}</TableCell>
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
