import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Upload video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, videoUrl, thumbnailUrl, duration, isShort } = body

    // Validate required fields
    if (!userId || !title || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newVideo = await prisma.video.create({
      data: {
        user_id: userId,
        title,
        description: description || "",
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        duration: duration || 0,
        is_short: isShort || false,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar_url: true
          }
        }
      }
    })

    // Format response to match expected structure
    const formattedVideo = {
      ...newVideo,
      creator_name: newVideo.user.name || `User${newVideo.user_id}`,
      creator_avatar: newVideo.user.avatar_url,
    }

    return NextResponse.json({ video: formattedVideo })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// Get videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isShort = searchParams.get("isShort")

    let whereClause: any = {}

    if (userId) {
      whereClause.user_id = parseInt(userId)
    }

    if (isShort === "true") {
      whereClause.is_short = true
    } else if (isShort === "false") {
      whereClause.is_short = false
    }

    const videos = await prisma.video.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            avatar_url: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Format videos to match expected structure
    const formattedVideos = videos.map(video => ({
      ...video,
      creator_name: video.user.name || `User${video.user_id}`,
      creator_avatar: video.user.avatar_url,
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error("Get videos error:", error)
    return NextResponse.json({ videos: [] })
  }
}
