"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    alert("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Контакты</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Свяжитесь с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                  <CardDescription>Наши контакты и расположение тренировочной площадки</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-muted-foreground">
                        ул. 10-й Годовщины Октября, 13А, Буй
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <a href="tel:+79969303549" className="text-primary hover:underline">
                        +7 (996) 930-35-49
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:info@evolprov.ru" className="text-primary hover:underline">
                        info@evolprov.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Время работы</h3>
                      <p className="text-muted-foreground">
                        Понедельник - Пятница: 10:00 - 21:00
                        <br />
                        Суббота - Воскресенье: 11:00 - 17:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Мы в социальных сетях</CardTitle>
                  <CardDescription>Следите за нашими новостями и обновлениями</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button asChild variant="outline" size="lg">
                    <Link href="https://vk.com/evolprov" target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.79c-.18.56-.97 1.19-1.96 1.19-.66 0-1.25-.34-2.02-1.18-.46-.49-.84-.9-1.24-.9-.11 0-.26.03-.44.11-.47.2-.73.74-.73 1.55 0 .72-.24.98-1.12.98-1.78 0-3.69-.94-5.28-2.76C4.12 13.66 3 10.85 3 9.17c0-.79.17-1.17 1.09-1.17.92 0 1.28.33 1.64 1.23.74 1.82 1.98 3.42 2.5 3.42.19 0 .29-.09.29-.56v-2.2c-.07-1.17-.69-1.27-.69-1.69 0-.23.19-.45.5-.45h2.43c.39 0 .54.22.54.67v3c0 .39.17.54.28.54.19 0 .38-.15.75-.52 1.13-1.27 1.94-3.23 1.94-3.23.16.25-.22.37 0 .66.16.21.69.68 1.05 1.09.65.75 1.15 1.38 1.29 1.82.13.44-.08.66-.58.66z" />
                      </svg>
                      VK
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="https://instagram.com/evolprov" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5 mr-2" />
                      Instagram
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="https://youtube.com/@evolprov" target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-5 w-5 mr-2" />
                      YouTube
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Напишите нам</CardTitle>
                  <CardDescription>Заполните форму и мы свяжемся с вами в ближайшее время</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Имя *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ваше имя"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Телефон
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Сообщение *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Расскажите, чем мы можем вам помочь..."
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Как нас найти</CardTitle>
                <CardDescription>Наша тренировочная площадка на карте</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-96 bg-muted rounded-b-lg overflow-hidden">
                  {/* Yandex Maps iframe - replace with actual coordinates */}
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=46.034266%2C51.533557&z=15&l=map&pt=46.034266,51.533557,pm2rdm"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{ position: "relative" }}
                    title="Карта расположения"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
