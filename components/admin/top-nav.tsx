"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/schedule", label: "Расписание" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/tournaments", label: "Турниры" },
  { href: "/admin/vk-settings", label: "VK Новости" },
]

export function AdminTopNav({ user }: { user: SupabaseUser }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const result = await signOut()
    if (result?.success && result?.redirectTo) {
      router.push(result.redirectTo)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Back to site + Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>На сайт</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <Link href="/admin" className="text-lg font-semibold">
            Админ-панель
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Аккаунт</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile nav dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="sm">
              Меню
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="cursor-pointer">
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
