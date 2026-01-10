import Link from "next/link"
import { Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Эволюция провинции</h3>
            <p className="text-sm opacity-90 text-pretty">
              Спортивная секция воркаута. Тренировки и соревнования на турниках для спортсменов всех уровней.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/news" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Новости
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Расписание
                </Link>
              </li>
              <li>
                <Link href="/services" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Турниры
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-90 hover:opacity-100 hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:+79123456789"
                  className="opacity-90 hover:opacity-100 hover:text-primary transition-colors"
                >
                  +7 (912) 345-67-89
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:info@evolprov.ru"
                  className="opacity-90 hover:opacity-100 hover:text-primary transition-colors"
                >
                  info@evolprov.ru
                </a>
              </li>
              <li className="opacity-90 text-pretty">г. Саратов, ул. Спортивная, 15</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
            <div className="flex gap-3">
              <Link
                href="https://vk.com/evolprov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="VK"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.79c-.18.56-.97 1.19-1.96 1.19-.66 0-1.25-.34-2.02-1.18-.46-.49-.84-.9-1.24-.9-.11 0-.26.03-.44.11-.47.2-.73.74-.73 1.55 0 .72-.24.98-1.12.98-1.78 0-3.69-.94-5.28-2.76C4.12 13.66 3 10.85 3 9.17c0-.79.17-1.17 1.09-1.17.92 0 1.28.33 1.64 1.23.74 1.82 1.98 3.42 2.5 3.42.19 0 .29-.09.29-.56v-2.2c-.07-1.17-.69-1.27-.69-1.69 0-.23.19-.45.5-.45h2.43c.39 0 .54.22.54.67v3c0 .39.17.54.28.54.19 0 .38-.15.75-.52 1.13-1.27 1.94-3.23 1.94-3.23.1-.23.33-.45.75-.45h1.73c.52 0 .64.27.52.67-.22.93-2.14 3.73-2.14 3.73-.16.25-.22.37 0 .66.16.21.69.68 1.05 1.09.65.75 1.15 1.38 1.29 1.82.13.44-.08.66-.58.66z" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com/evolprov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com/@evolprov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {currentYear} Эволюция провинции. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
