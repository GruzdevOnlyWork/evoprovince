// VK API integration for fetching posts from VK community

export interface VKPost {
  id: number
  owner_id: number
  text: string
  date: number
  attachments?: VKAttachment[]
}

export interface VKAttachment {
  type: string
  photo?: {
    sizes: Array<{ type: string; url: string; width: number; height: number }>
  }
  video?: {
    image?: Array<{ url: string; width: number; height: number }>
    first_frame?: Array<{ url: string; width: number; height: number }>
    thumb?: { url: string }
  }
  doc?: {
    preview?: { photo?: { sizes: Array<{ src: string; width: number }> } }
  }
}

export interface VKApiResponse {
  response?: { count: number; items: VKPost[] }
  error?: { error_code: number; error_msg: string }
}

export interface ParsedVKPost {
  id: number
  title: string
  text: string
  date: string
  image: string | null
  isVideo: boolean
  link: string
}

function extractTitle(text: string): string {
  const firstLine = text.split("\n")[0].trim()
  if (firstLine.length > 50) return firstLine.substring(0, 50) + "..."
  return firstLine || "Новость"
}

function getBestPhotoUrl(photo: VKAttachment["photo"]): string | null {
  if (!photo?.sizes?.length) return null
  const preferredTypes = ["z", "y", "x", "w", "r", "q", "p", "o", "m", "s"]
  for (const type of preferredTypes) {
    const size = photo.sizes.find((s) => s.type === type)
    if (size) return size.url
  }
  const sorted = [...photo.sizes].sort((a, b) => b.width * b.height - a.width * a.height)
  return sorted[0]?.url || null
}

function getVideoThumb(video: VKAttachment["video"]): string | null {
  if (!video) return null
  // Try image array (largest first)
  if (video.image?.length) {
    const sorted = [...video.image].sort((a, b) => b.width * b.height - a.width * a.height)
    return sorted[0]?.url || null
  }
  // Try first_frame
  if (video.first_frame?.length) {
    const sorted = [...video.first_frame].sort((a, b) => b.width * b.height - a.width * a.height)
    return sorted[0]?.url || null
  }
  if (video.thumb?.url) return video.thumb.url
  return null
}

function getBestImage(attachments: VKAttachment[] = []): { url: string | null; isVideo: boolean } {
  // Prefer photo attachment
  const photo = attachments.find((a) => a.type === "photo")
  if (photo?.photo) return { url: getBestPhotoUrl(photo.photo), isVideo: false }

  // Fall back to video thumbnail
  const video = attachments.find((a) => a.type === "video")
  if (video?.video) return { url: getVideoThumb(video.video), isVideo: true }

  // Doc preview
  const doc = attachments.find((a) => a.type === "doc")
  if (doc?.doc?.preview?.photo?.sizes?.length) {
    const sorted = [...doc.doc.preview.photo.sizes].sort((a, b) => b.width - a.width)
    return { url: sorted[0].src, isVideo: false }
  }

  return { url: null, isVideo: false }
}

export async function fetchVKPosts(groupId = "evoprovince", count = 10): Promise<ParsedVKPost[]> {
  const apiToken = process.env.VK_API_TOKEN
  if (!apiToken) {
    console.error("[v0] VK_API_TOKEN is not set")
    return []
  }

  try {
    const response = await fetch(
      `https://api.vk.com/method/wall.get?` +
        new URLSearchParams({ domain: groupId, count: count.toString(), access_token: apiToken, v: "5.199" }),
      { next: { revalidate: 300 } },
    )

    if (!response.ok) {
      console.error("[v0] VK API request failed:", response.status)
      return []
    }

    const data: VKApiResponse = await response.json()
    if (data.error) {
      console.error("[v0] VK API error:", data.error.error_msg)
      return []
    }
    if (!data.response?.items) return []

    return data.response.items.map((item) => {
      const { url: imageUrl, isVideo } = getBestImage(item.attachments)
      return {
        id: item.id,
        title: extractTitle(item.text),
        text: item.text,
        date: new Date(item.date * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
        image: imageUrl,
        isVideo,
        // owner_id is negative for groups (e.g. -12345), gives URL: /wall-12345_456
        link: item.owner_id
          ? `https://vk.com/wall${item.owner_id}_${item.id}`
          : `https://vk.com/${groupId}`,
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching VK posts:", error)
    return []
  }
}

export async function getVKPostsForPage(groupId?: string, count?: number): Promise<ParsedVKPost[]> {
  const posts = await fetchVKPosts(groupId, count)
  if (posts.length === 0) return getMockPosts()
  return posts
}

function getMockPosts(): ParsedVKPost[] {
  return [
    {
      id: 1,
      title: "Открытый турнир по воркауту",
      text: "Приглашаем всех желающих на открытый турнир по воркауту! Соревнования пройдут на главной площадке. Регистрация открыта.",
      date: new Date("2024-12-15").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: false,
      link: "https://vk.com/evoprovince",
    },
    {
      id: 2,
      title: "Новое расписание тренировок",
      text: "С января вводится новое расписание групповых тренировок. Добавлены вечерние занятия для работающих спортсменов.",
      date: new Date("2024-12-10").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: false,
      link: "https://vk.com/evoprovince",
    },
    {
      id: 3,
      title: "Итоги областного чемпионата",
      text: "Наши спортсмены заняли призовые места на областном чемпионате! Поздравляем победителей и благодарим всех участников.",
      date: new Date("2024-12-05").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: false,
      link: "https://vk.com/evoprovince",
    },
    {
      id: 4,
      title: "Мастер-класс от чемпиона России",
      text: "В субботу состоится мастер-класс от чемпиона России по воркауту. Не пропустите уникальную возможность поучиться у профессионала!",
      date: new Date("2024-11-28").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: true,
      link: "https://vk.com/evoprovince",
    },
    {
      id: 5,
      title: "Зимние тренировки: особенности подготовки",
      text: "Рассказываем о том, как правильно тренироваться зимой, какую экипировку выбрать и как избежать травм.",
      date: new Date("2024-11-20").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: false,
      link: "https://vk.com/evoprovince",
    },
    {
      id: 6,
      title: "Открыта запись на индивидуальные тренировки",
      text: "Начинается набор на индивидуальные тренировки с профессиональными тренерами. Ограниченное количество мест.",
      date: new Date("2024-11-15").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: null, isVideo: false,
      link: "https://vk.com/evoprovince",
    },
  ]
}
