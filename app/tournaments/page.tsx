import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Medal } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface Tournament {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants: string | null
  image_url: string | null
  status: string
  status_type: string
  is_past: boolean
}

interface Winner {
  id: string
  tournament_id: string
  place: number
  name: string
  team: string
}

async function getTournaments() {
  const supabase = await createClient()

  const [tournamentsResult, winnersResult] = await Promise.all([
    supabase.from("tournaments").select("*").order("date", { ascending: false }),
    supabase.from("tournament_winners").select("*").order("place"),
  ])

  if (tournamentsResult.error) {
    console.error("[v0] Error fetching tournaments:", tournamentsResult.error)
  }
  if (winnersResult.error) {
    console.error("[v0] Error fetching winners:", winnersResult.error)
  }

  return {
    tournaments: (tournamentsResult.data || []) as Tournament[],
    winners: (winnersResult.data || []) as Winner[],
  }
}

export default async function TournamentsPage() {
  const { tournaments, winners } = await getTournaments()

  const upcomingTournaments = tournaments.filter((t) => !t.is_past)
  const pastTournaments = tournaments.filter((t) => t.is_past)

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
                        src={tournament.image_url || "/placeholder.svg?height=192&width=400&query=workout tournament"}
                        alt={tournament.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                      />
                      <CardHeader>
                        <div className="mb-2">
                          <Badge
                            variant={
                              tournament.status_type === "success"
                                ? "default"
                                : tournament.status_type === "warning"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={tournament.status_type === "success" ? "bg-primary" : ""}
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
                            <span>{new Date(tournament.date).toLocaleDateString("ru-RU")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{tournament.location}</span>
                          </div>
                          {tournament.participants && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{tournament.participants}</span>
                            </div>
                          )}
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

                {upcomingTournaments.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Нет предстоящих турниров. Следите за обновлениями!
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="past">
                <div className="space-y-8">
                  {pastTournaments.map((tournament) => {
                    const tournamentWinners = winners
                      .filter((w) => w.tournament_id === tournament.id)
                      .sort((a, b) => a.place - b.place)

                    return (
                      <Card key={tournament.id}>
                        <div className="md:flex">
                          <div className="md:w-2/5">
                            <img
                              src={
                                tournament.image_url || "/placeholder.svg?height=256&width=400&query=past tournament"
                              }
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
                                    {new Date(tournament.date).toLocaleDateString("ru-RU")}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {tournament.location}
                                  </div>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {tournamentWinners.length > 0 && (
                                <>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-primary" />
                                    Победители:
                                  </h4>
                                  <div className="space-y-2">
                                    {tournamentWinners.map((winner) => (
                                      <div key={winner.id} className="flex items-center gap-3 p-2 rounded bg-muted/50">
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
                                        <div className="text-lg font-bold text-muted-foreground">
                                          {winner.place} место
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {pastTournaments.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">Архив турниров пуст</CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
