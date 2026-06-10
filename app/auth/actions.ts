"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const repeatPassword = formData.get("repeatPassword") as string

  if (!email || !password || !repeatPassword) {
    return { error: "Все поля обязательны для заполнения" }
  }

  if (password !== repeatPassword) {
    return { error: "Пароли не совпадают" }
  }

  if (password.length < 6) {
    return { error: "Пароль должен быть не менее 6 символов" }
  }

  const supabase = await createClient()

  const headersList = await headers()
  const origin =
    headersList.get("origin") || headersList.get("referer")?.split("/").slice(0, 3).join("/") || "http://localhost:3000"

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/admin`,
      data: {
        is_admin: true,
      },
    },
  })

  if (error) {
    console.log("Sign up error:", error)
    return { error: error.message }
  }

  if (data.user) {
    console.log("User created successfully:", data.user.id)
    revalidatePath("/", "layout")
    return { success: true, redirectTo: "/auth/sign-up-success" }
  }

  return { error: "Не удалось создать пользователя" }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email и пароль обязательны" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("Sign in error:", error)
    return { error: error.message }
  }

  console.log("User signed in successfully")
  revalidatePath("/", "layout")
  return { success: true, redirectTo: "/admin" }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log("Sign out error:", error)
    return { error: error.message }
  }

  console.log("User signed out successfully")
  revalidatePath("/", "layout")
  return { success: true, redirectTo: "/" }
}
