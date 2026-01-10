import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// VK API integration - fetch posts from VK community
async function getVKNews() {
  try {
    // Note: In production, you would use VK API with access token
    // For now, returning mock data that matches VK post structure
    const mockNews = [
      {
        id: 1,
        title: "Открытый турнир по воркауту",
        text: "Приглашаем всех желающих на открытый турнир по воркауту! Соревнования пройдут на главной площадке. Регистрация открыта.",
        date: new Date("2024-12-15").toLocaleDateString("ru-RU"),
        image: "/street-workout-competition-athletes.jpg",
        link: "https://vk.com/evolprov",
      },
      {
        id: 2,
        title: "Новое расписание тренировок",
        text: "С января вводится новое расписание групповых тренировок. Добавлены вечерние занятия для работающих спортсменов.",
        date: new Date("2024-12-10").toLocaleDateString("ru-RU"),
        image: "/outdoor-training-schedule-workout.jpg",
        link: "https://vk.com/evolprov",
      },
      {
        id: 3,
        title: "Итоги областного чемпионата",
        text: "Наши спортсмены заняли призовые места на областном чемпионате! Поздравляем победителей и благодарим всех участников.",
        date: new Date("2024-12-05").toLocaleDateString("ru-RU"),
        image: "/workout-competition-winners-podium.jpg",
        link: "https://vk.com/evolprov",
      },
      {
        id: 4,
        title: "Мастер-класс от чемпиона России",
        text: "В субботу состоится мастер-класс от чемпиона России по воркауту. Не пропустите уникальную возможность поучиться у профессионала!",
        date: new Date("2024-11-28").toLocaleDateString("ru-RU"),
        image: "/professional-athlete-workout-masterclass.jpg",
        link: "https://vk.com/evolprov",
      },
      {
        id: 5,
        title: "Зимние тренировки: особенности подготовки",
        text: "Рассказываем о том, как правильно тренироваться зимой, какую экипировку выбрать и как избежать травм в холодное время года.",
        date: new Date("2024-11-20").toLocaleDateString("ru-RU"),
        image: "/winter-outdoor-training-cold-weather-workout.jpg",
        link: "https://vk.com/evolprov",
      },
      {
        id: 6,
        title: "Открыта запись на индивидуальные тренировки",
        text: "Начинается набор на индивидуальные тренировки с профессиональными тренерами. Ограниченное количество мест.",
        date: new Date("2024-11-15").toLocaleDateString("ru-RU"),
        image: "/personal-training-one-on-one-coaching-workout.jpg",
        link: "https://vk.com/evolprov",
      },
    ]
    return mockNews
  } catch (error) {
    console.error("Error fetching VK news:", error)
    return []
  }
}

export default async function NewsPage() {
  const news = await getVKNews()

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Новости</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Последние события из жизни нашей спортивной секции
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {news.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-64 md:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-3/5">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <CardTitle className="text-2xl mb-2 text-balance">{post.title}</CardTitle>
                      <CardDescription className="text-base text-pretty">{post.text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline">
                        <Link href={post.link} target="_blank" rel="noopener noreferrer">
                          Подробнее
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="https://vk.com/evolprov" target="_blank" rel="noopener noreferrer">
                Все новости в VK
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
