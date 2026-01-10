import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    userId: user.id,
    email: user.email,
    userMetadata: user.user_metadata,
    isAdmin: user.user_metadata?.is_admin === true,
  })
}
