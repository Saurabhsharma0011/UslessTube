import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Get single video by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = parseInt(params.id)

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 })
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: {
            name: true,
            avatar_url: true
          }
        }
      }
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } }
    })

    // Format response
    const formattedVideo = {
      ...video,
      creator_name: video.user.name || `User${video.user_id}`,
      creator_avatar: video.user.avatar_url,
    }

    return NextResponse.json({ video: formattedVideo })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update video
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = parseInt(params.id)
    const body = await request.json()
    const { userId, title, description, thumbnailUrl, isShort } = body

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 })
    }

    // Verify video exists and belongs to user
    const existingVideo = await prisma.video.findFirst({
      where: { 
        id: videoId,
        user_id: userId
      }
    })

    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 })
    }

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: title || existingVideo.title,
        description: description !== undefined ? description : existingVideo.description,
        thumbnail_url: thumbnailUrl || existingVideo.thumbnail_url,
        is_short: isShort !== undefined ? isShort : existingVideo.is_short,
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

    const formattedVideo = {
      ...updatedVideo,
      creator_name: updatedVideo.user.name || `User${updatedVideo.user_id}`,
      creator_avatar: updatedVideo.user.avatar_url,
    }

    return NextResponse.json({ video: formattedVideo })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// Delete video
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Verify video exists and belongs to user
    const existingVideo = await prisma.video.findFirst({
      where: { 
        id: videoId,
        user_id: parseInt(userId)
      }
    })

    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 })
    }

    await prisma.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
