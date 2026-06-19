import type React from "react"
import type { Metadata } from "next"
import { Anton, Archivo, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
})

const archivo = Archivo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Эволюция провинции Уличный воркаут",
  description: "Тренировки и соревнования на турниках. Индивидуальные и групповые занятия, подготовка к турнирам.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${anton.variable} ${archivo.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="bottom-right" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}
