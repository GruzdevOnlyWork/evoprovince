import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      is_admin: true,
    },
  })

  if (error) {
    console.error("Error updating user metadata:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    user: {
      id: data.user?.id,
      email: data.user?.email,
      isAdmin: data.user?.user_metadata?.is_admin === true,
    },
  })
}
