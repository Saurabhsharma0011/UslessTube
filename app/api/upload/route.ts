import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary, uploadToLocalStorage } from "@/lib/upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'video' or 'image'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Check file size (50MB limit for videos, 10MB for images)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (buffer.length > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${type === 'video' ? '50MB' : '10MB'}` 
      }, { status: 400 })
    }

    let uploadResult

    // Try Cloudinary first, fallback to local storage
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        uploadResult = await uploadToCloudinary(
          buffer, 
          'useless-tube', 
          type as 'video' | 'image'
        )
      } catch (error) {
        console.error('Cloudinary upload failed, falling back to local storage:', error)
        uploadResult = await uploadToLocalStorage(buffer, file.name)
      }
    } else {
      uploadResult = await uploadToLocalStorage(buffer, file.name)
    }

    return NextResponse.json({
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      size: uploadResult.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
} 