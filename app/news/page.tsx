import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealInit } from "@/components/reveal-init"
import { Icon } from "@/lib/icons"
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
      <RevealInit />
      <main style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ background: "var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "64px var(--pad-x)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 20, height: 1, background: "var(--acid)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--acid)", textTransform: "uppercase" }}>
                Новости
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-anton, Anton)",
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1, letterSpacing: "0.01em",
              color: "var(--ds-white)", marginBottom: 16,
            }}>
              ПОСЛЕДНИЕ СОБЫТИЯ
            </h1>
            <p style={{ fontSize: 14, color: "var(--ds-muted)", maxWidth: 480, lineHeight: 1.7 }}>
              Из жизни нашей спортивной секции. Посты из официальной группы ВКонтакте.
            </p>
          </div>
        </div>

        {/* Posts */}
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x)" }}>
          {news.length === 0 ? (
            <div style={{ padding: "64px 0", textAlign: "center", color: "var(--ds-muted)", fontSize: 14 }}>
              Новости временно недоступны
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {news.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover"
                  style={{
                    textDecoration: "none", display: "grid",
                    gridTemplateColumns: "300px 1fr",
                    overflow: "hidden",
                    background: "var(--ink-2)",
                  }}
                >
                  {post.image ? (
                    <div style={{ position: "relative" }}>
                      <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 220, display: "block" }} loading="lazy" />
                      {post.isVideo && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="ph" style={{ minHeight: 220, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {post.isVideo && (
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "1px solid var(--acid)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--acid)"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ds-faint)" }}>
                        <Icon name="vk" size={12} sw={1.4} /> VK
                      </span>
                      <span style={{ fontSize: 11, color: "var(--ds-faint)" }}>{post.date}</span>
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ds-white)", lineHeight: 1.3 }}>{post.title}</h2>
                    <p style={{ fontSize: 13, color: "var(--ds-muted)", lineHeight: 1.7, flexGrow: 1 }}>
                      {post.text.slice(0, 300)}{post.text.length > 300 ? "…" : ""}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--acid)", marginTop: "auto" }}>
                      Читать в VK <Icon name="arrowUR" size={12} sw={2} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* VK link */}
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <a
              href={`https://vk.com/${settings.group_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-line"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px",
                color: "var(--ds-white)", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
              }}
            >
              <Icon name="vk" size={16} sw={1.6} />
              Все новости ВКонтакте
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
