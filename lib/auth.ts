export interface User {
  id: number
  wallet_address: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: number
  user_id: number
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  views: number
  likes: number
  is_short: boolean
  created_at: string
  updated_at: string
  creator_name?: string
  creator_avatar?: string
}

export const connectWallet = async (walletAddress: string): Promise<{ user: User; isNewUser: boolean }> => {
  const response = await fetch("/api/auth/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    throw new Error("Failed to connect wallet")
  }

  return response.json()
}

export const updateProfile = async (walletAddress: string, name: string, avatarUrl?: string): Promise<User> => {
  const response = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, name, avatarUrl }),
  })

  if (!response.ok) {
    throw new Error("Failed to update profile")
  }

  const data = await response.json()
  return data.user
}

export const uploadVideo = async (videoData: {
  userId: number
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  isShort?: boolean
}): Promise<Video> => {
  const response = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(videoData),
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const data = await response.json()
  return data.video
}

export const getUserVideos = async (userId: number): Promise<Video[]> => {
  try {
    const response = await fetch(`/api/videos?userId=${userId}`)
    const data = await response.json()
    return data.videos || []
  } catch (error) {
    return []
  }
}

export const getVideos = async (isShort = false): Promise<Video[]> => {
  try {
    const response = await fetch(`/api/videos?isShort=${isShort}`)
    const data = await response.json()
    return data.videos || []
  } catch (error) {
    return []
  }
}

export const deleteVideo = async (videoId: number, userId: number): Promise<void> => {
  const response = await fetch(`/api/videos/${videoId}?userId=${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete video")
  }
}
