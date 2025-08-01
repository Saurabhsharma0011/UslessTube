import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { wallet_address: walletAddress }
    })

    if (existingUser) {
      return NextResponse.json({
        user: existingUser,
        isNewUser: false,
      })
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        wallet_address: walletAddress,
      }
    })

    return NextResponse.json({
      user: newUser,
      isNewUser: true,
    })
  } catch (error) {
    console.error("Wallet connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
