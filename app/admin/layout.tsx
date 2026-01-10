import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminTopNav } from "@/components/admin/top-nav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const isAdmin = user.user_metadata?.is_admin === true
  if (!isAdmin) {
    redirect("/admin/unauthorized")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav user={user} />
      <main className="container max-w-7xl mx-auto py-8 px-4">{children}</main>
    </div>
  )
}
