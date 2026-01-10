import { NextResponse } from "next/server"
import { fetchVKPosts } from "@/lib/vk-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get("group") || "evolprov"
  const count = Number.parseInt(searchParams.get("count") || "5")

  const hasToken = !!process.env.VK_API_TOKEN
  const tokenPreview = hasToken ? `${process.env.VK_API_TOKEN?.substring(0, 10)}...` : "NOT SET"

  console.log("[v0] VK API Test - Token present:", hasToken)
  console.log("[v0] VK API Test - Group:", groupId)

  try {
    const posts = await fetchVKPosts(groupId, count)

    return NextResponse.json({
      success: true,
      tokenPresent: hasToken,
      tokenPreview,
      groupId,
      postsCount: posts.length,
      posts: posts.slice(0, 3), // Return first 3 for testing
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        tokenPresent: hasToken,
        tokenPreview,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
