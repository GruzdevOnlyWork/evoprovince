// VK API integration for fetching posts from VK community

export interface VKPost {
  id: number
  text: string
  date: number
  attachments?: VKAttachment[]
}

export interface VKAttachment {
  type: string
  photo?: {
    sizes: Array<{
      type: string
      url: string
      width: number
      height: number
    }>
  }
}

export interface VKApiResponse {
  response?: {
    count: number
    items: VKPost[]
  }
  error?: {
    error_code: number
    error_msg: string
  }
}

export interface ParsedVKPost {
  id: number
  title: string
  text: string
  date: string
  image: string | null
  link: string
}

// Extract title from post text (first line or first 50 chars)
function extractTitle(text: string): string {
  const firstLine = text.split("\n")[0].trim()
  if (firstLine.length > 50) {
    return firstLine.substring(0, 50) + "..."
  }
  return firstLine || "Новость"
}

// Get the best image size from VK photo attachment
function getBestPhotoUrl(photo: VKAttachment["photo"]): string | null {
  if (!photo?.sizes || photo.sizes.length === 0) return null

  // Prefer 'x', 'y', 'z' sizes for best quality
  const preferredTypes = ["z", "y", "x", "w", "r", "q", "p", "o", "m", "s"]
  for (const type of preferredTypes) {
    const size = photo.sizes.find((s) => s.type === type)
    if (size) return size.url
  }

  // Fallback to the largest available
  const sorted = [...photo.sizes].sort((a, b) => b.width * b.height - a.width * a.height)
  return sorted[0]?.url || null
}

// Fetch posts from VK community wall
export async function fetchVKPosts(groupId = "evolprov", count = 10): Promise<ParsedVKPost[]> {
  const apiToken = process.env.VK_API_TOKEN

  if (!apiToken) {
    console.error("[v0] VK_API_TOKEN is not set")
    return []
  }

  try {
    // VK API requires numeric group ID or short name
    // The owner_id for groups should be negative
    const response = await fetch(
      `https://api.vk.com/method/wall.get?` +
        new URLSearchParams({
          domain: groupId,
          count: count.toString(),
          access_token: apiToken,
          v: "5.199",
        }),
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
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

    if (!data.response?.items) {
      console.error("[v0] VK API returned no items")
      return []
    }

    return data.response.items.map((item) => {
      // Find the first photo attachment
      const photoAttachment = item.attachments?.find((a) => a.type === "photo")
      const imageUrl = photoAttachment ? getBestPhotoUrl(photoAttachment.photo) : null

      return {
        id: item.id,
        title: extractTitle(item.text),
        text: item.text,
        date: new Date(item.date * 1000).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        image: imageUrl,
        link: `https://vk.com/${groupId}?w=wall-${groupId}_${item.id}`,
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching VK posts:", error)
    return []
  }
}

// API route handler for fetching VK posts
export async function getVKPostsForPage(groupId?: string, count?: number): Promise<ParsedVKPost[]> {
  const posts = await fetchVKPosts(groupId, count)

  // If VK API fails or returns empty, return fallback mock data
  if (posts.length === 0) {
    return getMockPosts()
  }

  return posts
}

// Fallback mock data when VK API is unavailable
function getMockPosts(): ParsedVKPost[] {
  return [
    {
      id: 1,
      title: "Открытый турнир по воркауту",
      text: "Приглашаем всех желающих на открытый турнир по воркауту! Соревнования пройдут на главной площадке. Регистрация открыта.",
      date: new Date("2024-12-15").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/street-workout-competition-athletes.jpg",
      link: "https://vk.com/evolprov",
    },
    {
      id: 2,
      title: "Новое расписание тренировок",
      text: "С января вводится новое расписание групповых тренировок. Добавлены вечерние занятия для работающих спортсменов.",
      date: new Date("2024-12-10").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/outdoor-training-schedule-workout.jpg",
      link: "https://vk.com/evolprov",
    },
    {
      id: 3,
      title: "Итоги областного чемпионата",
      text: "Наши спортсмены заняли призовые места на областном чемпионате! Поздравляем победителей и благодарим всех участников.",
      date: new Date("2024-12-05").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/workout-competition-winners-podium.jpg",
      link: "https://vk.com/evolprov",
    },
    {
      id: 4,
      title: "Мастер-класс от чемпиона России",
      text: "В субботу состоится мастер-класс от чемпиона России по воркауту. Не пропустите уникальную возможность поучиться у профессионала!",
      date: new Date("2024-11-28").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/professional-athlete-workout-masterclass.jpg",
      link: "https://vk.com/evolprov",
    },
    {
      id: 5,
      title: "Зимние тренировки: особенности подготовки",
      text: "Рассказываем о том, как правильно тренироваться зимой, какую экипировку выбрать и как избежать травм в холодное время года.",
      date: new Date("2024-11-20").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/winter-outdoor-training-cold-weather-workout.jpg",
      link: "https://vk.com/evolprov",
    },
    {
      id: 6,
      title: "Открыта запись на индивидуальные тренировки",
      text: "Начинается набор на индивидуальные тренировки с профессиональными тренерами. Ограниченное количество мест.",
      date: new Date("2024-11-15").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      image: "/personal-training-one-on-one-coaching-workout.jpg",
      link: "https://vk.com/evolprov",
    },
  ]
}
