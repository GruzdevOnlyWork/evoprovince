import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Medal } from "lucide-react"
import Link from "next/link"

const upcomingTournaments = [
  {
    id: 1,
    title: "Кубок области по воркауту 2025",
    date: "15 января 2025",
    location: "Центральный стадион",
    participants: "До 50 участников",
    image: "/regional-workout-cup-competition-venue.jpg",
    description: "Главное соревнование региона среди любителей и профессионалов воркаута",
    status: "Регистрация открыта",
    statusType: "success",
  },
  {
    id: 2,
    title: "Открытый турнир Эволюция",
    date: "3 февраля 2025",
    location: "Площадка 'Эволюция'",
    participants: "Без ограничений",
    image: "/open-tournament-street-workout-competition.jpg",
    description: "Открытый турнир для всех желающих показать свои навыки",
    status: "Скоро регистрация",
    statusType: "warning",
  },
  {
    id: 3,
    title: "Чемпионат города",
    date: "12 марта 2025",
    location: "Спорткомплекс 'Олимп'",
    participants: "До 30 участников",
    image: "/city-championship-workout-athletes.jpg",
    description: "Городской чемпионат по воркауту среди спортсменов всех категорий",
    status: "Готовится",
    statusType: "default",
  },
]

const pastTournaments = [
  {
    id: 1,
    title: "Осенний марафон 2024",
    date: "20 октября 2024",
    location: "Площадка 'Эволюция'",
    image: "/autumn-marathon-workout-competition-results.jpg",
    winners: [
      { place: 1, name: "Алексей Иванов", team: "Эволюция провинции" },
      { place: 2, name: "Дмитрий Соколов", team: "Городские гимнасты" },
      { place: 3, name: "Михаил Петров", team: "Эволюция провинции" },
    ],
  },
  {
    id: 2,
    title: "Летний кубок 2024",
    date: "15 июля 2024",
    location: "Центральный парк",
    image: "/summer-cup-outdoor-workout-event.jpg",
    winners: [
      { place: 1, name: "Сергей Смирнов", team: "Эволюция провинции" },
      { place: 2, name: "Андрей Козлов", team: "Турник-клуб" },
      { place: 3, name: "Игорь Волков", team: "Стрит-спорт" },
    ],
  },
  {
    id: 3,
    title: "Весенний старт 2024",
    date: "25 апреля 2024",
    location: "Стадион 'Юность'",
    image: "/spring-start-competition-street-workout.jpg",
    winners: [
      { place: 1, name: "Дмитрий Петров", team: "Эволюция провинции" },
      { place: 2, name: "Максим Федоров", team: "Силовые ребята" },
      { place: 3, name: "Владимир Орлов", team: "Городские гимнасты" },
    ],
  },
]

export default function TournamentsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Турниры и соревнования</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Следите за предстоящими турнирами и результатами прошедших соревнований
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
                <TabsTrigger value="past">Архив</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTournaments.map((tournament) => (
                    <Card key={tournament.id} className="flex flex-col">
                      <img
                        src={tournament.image || "/placeholder.svg"}
                        alt={tournament.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                      />
                      <CardHeader>
                        <div className="mb-2">
                          <Badge
                            variant={
                              tournament.statusType === "success"
                                ? "default"
                                : tournament.statusType === "warning"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={tournament.statusType === "success" ? "bg-primary" : ""}
                          >
                            {tournament.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-balance">{tournament.title}</CardTitle>
                        <CardDescription className="text-pretty">{tournament.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{tournament.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{tournament.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{tournament.participants}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href="/contact">Зарегистрироваться</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="space-y-8">
                  {pastTournaments.map((tournament) => (
                    <Card key={tournament.id}>
                      <div className="md:flex">
                        <div className="md:w-2/5">
                          <img
                            src={tournament.image || "/placeholder.svg"}
                            alt={tournament.title}
                            className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                            loading="lazy"
                          />
                        </div>
                        <div className="md:w-3/5">
                          <CardHeader>
                            <CardTitle className="text-2xl text-balance">{tournament.title}</CardTitle>
                            <CardDescription>
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {tournament.date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {tournament.location}
                                </div>
                              </div>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-primary" />
                              Победители:
                            </h4>
                            <div className="space-y-2">
                              {tournament.winners.map((winner) => (
                                <div key={winner.place} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                                    <Medal
                                      className={`h-5 w-5 ${
                                        winner.place === 1
                                          ? "text-yellow-600"
                                          : winner.place === 2
                                            ? "text-gray-400"
                                            : "text-amber-700"
                                      }`}
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="font-medium">{winner.name}</div>
                                    <div className="text-sm text-muted-foreground">{winner.team}</div>
                                  </div>
                                  <div className="text-lg font-bold text-muted-foreground">{winner.place} место</div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
