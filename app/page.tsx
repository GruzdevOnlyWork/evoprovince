import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Dumbbell, Users, Trophy, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-16">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/street-workout-training-pull-up-bar-athletes.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="container mx-auto px-4 z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">Эволюция провинции</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 text-balance">
                Тренировки и соревнования на турниках
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto text-pretty">
                Развивайся вместе с нами. Преодолевай границы. Становись сильнее каждый день.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/services">
                    Начать тренировки
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="/schedule">Расписание</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-balance">Почему выбирают нас</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Индивидуальные тренировки</h3>
                <p className="text-muted-foreground text-pretty">Персональный подход к каждому спортсмену</p>
              </Card>

              <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Групповые занятия</h3>
                <p className="text-muted-foreground text-pretty">Тренировки в команде единомышленников</p>
              </Card>

              <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Подготовка к турнирам</h3>
                <p className="text-muted-foreground text-pretty">Профессиональная подготовка к соревнованиям</p>
              </Card>

              <Card className="p-6 text-center border-2 hover:border-primary transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Гибкое расписание</h3>
                <p className="text-muted-foreground text-pretty">Удобное время для тренировок</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Готов начать свою эволюцию?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-pretty opacity-90">
              Присоединяйся к нашей команде и достигай новых высот вместе с нами
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link href="/contact">
                Связаться с нами
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
