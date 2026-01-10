import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getVKPostsForPage } from "@/lib/vk-api"
import { createClient } from "@/lib/supabase/server"

async function getVKSettings() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("vk_settings").select("*").single()
    return data || { group_id: "evolprov", posts_count: 10 }
  } catch {
    return { group_id: "evolprov", posts_count: 10 }
  }
}

export default async function NewsPage() {
  const settings = await getVKSettings()
  const news = await getVKPostsForPage(settings.group_id, settings.posts_count)

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Новости</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Последние события из жизни нашей спортивной секции
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {news.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <img
                      src={post.image || "/placeholder.svg?height=256&width=400&query=workout news"}
                      alt={post.title}
                      className="w-full h-64 md:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-3/5">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <CardTitle className="text-2xl mb-2 text-balance">{post.title}</CardTitle>
                      <CardDescription className="text-base text-pretty line-clamp-4">{post.text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline">
                        <Link href={post.link} target="_blank" rel="noopener noreferrer">
                          Подробнее
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Новости временно недоступны</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href={`https://vk.com/${settings.group_id}`} target="_blank" rel="noopener noreferrer">
                Все новости в VK
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
