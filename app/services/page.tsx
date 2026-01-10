import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, Dumbbell, Users, Trophy, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  is_popular: boolean
  sort_order: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  users: Users,
  trophy: Trophy,
  target: Target,
}

async function getServices() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("services").select("*").order("sort_order")

  if (error) {
    console.error("[v0] Error fetching services:", error)
    return []
  }

  return data as Service[]
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Наши услуги</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Выберите подходящий формат тренировок для достижения ваших спортивных целей
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Dumbbell
              return (
                <Card
                  key={service.id}
                  className={`relative ${service.is_popular ? "border-primary border-2 shadow-lg" : ""}`}
                >
                  {service.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">Популярное</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base mt-2 text-pretty">{service.description}</CardDescription>
                    <div className="text-3xl font-bold text-primary mt-4">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant={service.is_popular ? "default" : "outline"}>
                      <Link href="/contact">Записаться</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {services.length === 0 && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center text-muted-foreground">
                Информация об услугах временно недоступна
              </CardContent>
            </Card>
          )}

          <div className="max-w-6xl mx-auto mt-16">
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Абонементы и скидки</h3>
                <p className="text-lg mb-6 text-pretty">
                  Приобретайте абонементы на месяц и экономьте до 30%. Для студентов и многодетных семей действуют
                  специальные условия.
                </p>
                <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                  <Link href="/contact">Узнать подробнее</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
