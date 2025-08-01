import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const { walletAddress, name, avatarUrl } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Find and update user
    const updatedUser = await prisma.user.update({
      where: { wallet_address: walletAddress },
      data: {
        name: name || null,
        avatar_url: avatarUrl || null,
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    console.error("Profile update error:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
