"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, UserIcon, Play, ChevronDown, Upload, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhantomWalletButton } from "@/components/phantom-wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { VerifiedBadge } from "@/components/verified-badge"
import { updateProfile, getVideos } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const preloadedVideos = [
  {
    id: "pre-1",
    title: "Watching Paint Dry for 10 Minutes Straight",
    creator_name: "PaintWatcher2024",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=PW",
    views: 1200000,
    duration: 600,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Paint+Drying",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "The most riveting paint drying experience you'll ever witness.",
    is_short: false,
    likes: 45000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-2",
    title: "Staring at a Blank Wall for 5 Minutes",
    creator_name: "WallStarer",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=WS",
    views: 856000,
    duration: 300,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Blank+Wall",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Just me, staring at a completely blank white wall.",
    is_short: false,
    likes: 32000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-3",
    title: "Official Useless Content Guidelines",
    creator_name: "Useless Official",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=UO",
    views: 8500000,
    duration: 420,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Official+Guidelines",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "The official guide to creating perfectly useless content. Verified by the Useless Team.",
    is_short: false,
    likes: 450000,
    user_id: 999,
    is_verified: false,
  },
  {
    id: "pre-4",
    title: "My Pet Rock's Daily Routine",
    creator_name: "RockOwner",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=RO",
    views: 3400000,
    duration: 765,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Pet+Rock",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Follow my pet rock through its exciting daily activities.",
    is_short: false,
    likes: 125000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-5",
    title: "Explaining Why This Video is Pointless",
    creator_name: "MetaUseless",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=MU",
    views: 4200000,
    duration: 372,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Meta+Video",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A deep philosophical dive into the meaninglessness of this very video.",
    is_short: false,
    likes: 156000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-6",
    title: "Grass Growing in Real Time",
    creator_name: "GrassWatcher",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=GW",
    views: 987000,
    duration: 922,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Growing+Grass",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Unedited footage of grass growing. You can literally watch it grow.",
    is_short: false,
    likes: 43000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-7",
    title: "Reading the Dictionary: Letter A",
    creator_name: "DictionaryReader",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=DR",
    views: 654000,
    duration: 1391,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Dictionary",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "I read every single word that starts with 'A' from the dictionary.",
    is_short: false,
    likes: 28000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-8",
    title: "Watching Water Boil (Full Process)",
    creator_name: "BoilWatcher",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=BW",
    views: 1800000,
    duration: 465,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Boiling+Water",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    description: "From cold water to rolling boil. Every bubble captured in 4K.",
    is_short: false,
    likes: 67000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-9",
    title: "My Ceiling Fan: A 10 Minute Documentary",
    creator_name: "FanEnthusiast",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=FE",
    views: 1100000,
    duration: 600,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Ceiling+Fan",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "An in-depth look at my ceiling fan. It spins. That's about it.",
    is_short: false,
    likes: 52000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-10",
    title: "Sorting My Sock Drawer in Silence",
    creator_name: "SockSorter",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=SS",
    views: 743000,
    duration: 873,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Sock+Drawer",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Watch me organize my socks by color, size, and material.",
    is_short: false,
    likes: 34000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-11",
    title: "Staring Contest with My Cat (I Lost)",
    creator_name: "CatStarer",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=CS",
    views: 2700000,
    duration: 262,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Cat+Staring",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Epic staring contest with my cat. Spoiler: cats are unbeatable.",
    is_short: false,
    likes: 98000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-12",
    title: "Watching Ice Melt in My Freezer",
    creator_name: "IceMelter",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=IM",
    views: 892000,
    duration: 1124,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Melting+Ice",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Time-lapse of ice cubes slowly melting.",
    is_short: false,
    likes: 41000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-13",
    title: "My Morning Routine: Staring at Coffee",
    creator_name: "CoffeeStarer",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=CF",
    views: 1500000,
    duration: 415,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Coffee+Cup",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: "I stare at my coffee cup for 7 minutes before taking the first sip.",
    is_short: false,
    likes: 63000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-14",
    title: "Explaining Why Explaining is Useless",
    creator_name: "ExplainMaster",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=EM",
    views: 3100000,
    duration: 557,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Explaining",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A comprehensive explanation of why explanations are fundamentally pointless.",
    is_short: false,
    likes: 142000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-15",
    title: "Watching My Screen Saver for 20 Minutes",
    creator_name: "ScreenSaverFan",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=SF",
    views: 1900000,
    duration: 1200,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Screen+Saver",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Just me watching the bouncing DVD logo screen saver. Does it hit the corner?",
    is_short: false,
    likes: 87000,
    user_id: 0,
    is_verified: false,
  },
  {
    id: "pre-16",
    title: "Watching my screensaver for life time",
    creator_name: "LifetimeScreenWatcher",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=LSW",
    views: 5600000,
    duration: 3600,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Lifetime+Screensaver",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    description:
      "The ultimate screensaver watching experience. I dedicate my entire lifetime to watching this mesmerizing screensaver. Pure dedication to uselessness at its finest.",
    is_short: false,
    likes: 234000,
    user_id: 0,
    video_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_video_202508011057_nqjtg-CHAwHGXgiWo7vZinMSOPJEGVwSlI76.mp4",
    is_verified: false,
  },
  {
    id: "pre-17",
    title: "Welcome to UselessTube - Official Platform Launch",
    creator_name: "UselessTube Official",
    creator_avatar: "/placeholder.svg?height=40&width=40&text=UTO",
    views: 12500000,
    duration: 180,
    thumbnail_url: "/placeholder.svg?height=180&width=320&text=Official+Launch",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    description:
      "The official launch announcement of UselessTube platform. Your premier destination for useless content!",
    is_short: false,
    likes: 890000,
    user_id: 1000,
    is_verified: true,
  },
]

export default function UselessTube() {
  const [user, setUser] = useState(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [tempProfile, setTempProfile] = useState({ name: "", image: "" })
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const sidebarItems = [
    { name: "Home", href: "/" },
    { name: "Useless Videos", href: "/useless-videos" },
    { name: "Useless Shorts", href: "/shorts" },
    { name: "Upload Video", href: "/upload" },
    { name: "My Videos", href: "/dashboard" },
    { name: "Useless Token", href: "/token" },
    { name: "Useless Roadmap", href: "/roadmap" },
  ]

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("useless-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Load videos
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      // Get user-uploaded videos
      const fetchedVideos = (await getVideos(false)) || []

      // Combine pre-loaded and user videos
      const allVideos = [...preloadedVideos, ...fetchedVideos]

      // Shuffle them together for a mixed feed
      const shuffledVideos = allVideos.sort(() => Math.random() - 0.5)

      setVideos(shuffledVideos)
    } catch (error) {
      console.error("Failed to load videos:", error)
      // Fallback to just pre-loaded videos if loading fails
      setVideos(preloadedVideos)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.videos || [])

      toast({
        title: "Search Complete!",
        description: `Found ${data.videos?.length || 0} useless videos matching "${searchQuery}"`,
      })
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Failed",
        description: "Failed to search videos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleWalletConnected = (connectedUser: any, isNewUser: boolean) => {
    setUser(connectedUser)
    localStorage.setItem("useless-user", JSON.stringify(connectedUser))

    if (isNewUser || !connectedUser.name) {
      setShowProfileSetup(true)
      setTempProfile({
        name: connectedUser.name || "",
        image: connectedUser.avatar_url || "",
      })
    }
  }

  const handleWalletDisconnected = () => {
    setUser(null)
    localStorage.removeItem("useless-user")
    setShowProfileSetup(false)
  }

  const handleSaveProfile = async () => {
    if (!user || !tempProfile.name.trim()) return

    setLoading(true)
    try {
      const updatedUser = await updateProfile(user.wallet_address, tempProfile.name, tempProfile.image)
      setUser(updatedUser)
      localStorage.setItem("useless-user", JSON.stringify(updatedUser))
      setShowProfileSetup(false)

      toast({
        title: "Profile Updated!",
        description: "Your useless profile has been saved.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempProfile((prev) => ({
          ...prev,
          image: e.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const displayVideos = searchResults.length > 0 ? searchResults : videos

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b-4 border-gray-800 dark:border-gray-600 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" style={{ transform: "rotate(0.3deg)" }}>
            <div className="bg-red-600 p-2 rounded-full border-3 border-black dark:border-gray-300 transform -rotate-3">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                style={{
                  fontFamily: "Comic Sans MS, cursive",
                  textShadow: "2px 2px 0px #ef4444",
                }}
              >
                UselessTube
              </h1>
              <p
                className="text-xs text-gray-600 dark:text-gray-400 -mt-1"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                place where things become useless
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8" style={{ transform: "rotate(-0.1deg)" }}>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search something useless..."
                className="w-full pl-4 pr-12 py-3 text-lg border-3 border-gray-800 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 shadow-inner dark:text-gray-100"
                style={{
                  fontFamily: "Comic Sans MS, cursive",
                  borderStyle: "dashed",
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 border-2 border-gray-800 dark:border-gray-600 rounded-full"
                style={{ transform: "rotate(5deg)" }}
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full border-3 border-black dark:border-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center space-x-2">
                  {user && user.name ? (
                    <Avatar className="w-8 h-8 border-2 border-black dark:border-gray-300">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-red-600 text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 bg-white dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg"
                style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
              >
                {!user ? (
                  <div className="p-4">
                    <PhantomWalletButton
                      onWalletConnected={handleWalletConnected}
                      onWalletDisconnected={handleWalletDisconnected}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </div>
                ) : (
                  <>
                    {showProfileSetup ? (
                      <div className="p-4 space-y-4">
                        <h3
                          className="font-bold text-gray-900 dark:text-gray-100 text-center border-b-2 border-gray-300 dark:border-gray-600 pb-2"
                          style={{ borderStyle: "dashed" }}
                        >
                          Setup Your Useless Profile
                        </h3>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Profile Picture
                          </Label>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-16 h-16 border-3 border-gray-800 dark:border-gray-300 transform rotate-3">
                              <AvatarImage src={tempProfile.image || "/placeholder.svg"} alt="Profile" />
                              <AvatarFallback className="bg-red-600 text-white font-bold text-xl">
                                {tempProfile.name.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-upload"
                              />
                              <Label
                                htmlFor="profile-upload"
                                className="inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                style={{ borderStyle: "dashed" }}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Your Useless Name
                          </Label>
                          <Input
                            value={tempProfile.name}
                            onChange={(e) => setTempProfile((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your useless name..."
                            className="border-2 border-gray-600 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700"
                            style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                          />
                        </div>

                        <Button
                          onClick={handleSaveProfile}
                          disabled={!tempProfile.name.trim() || loading}
                          className="w-full bg-red-600 hover:bg-red-700 text-white border-2 border-black dark:border-gray-300 transition-colors"
                          style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : "Save Useless Profile"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="p-4 border-b-2 border-gray-300 dark:border-gray-600"
                          style={{ borderStyle: "dashed" }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 border-2 border-black dark:border-gray-300 transform -rotate-2">
                              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || ""} />
                              <AvatarFallback className="bg-red-600 text-white font-bold">
                                {(user.name || "U").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-gray-900 dark:text-gray-100">
                                  {user.name || "Unnamed User"}
                                </p>
                                <VerifiedBadge
                                  isVerified={
                                    user.name === "UselessTube Official" ||
                                    user.wallet_address === "DBoZreu2...AEYTBKEA"
                                  }
                                />
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                {user.wallet_address?.slice(0, 8)}...{user.wallet_address?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <DropdownMenuItem
                          onClick={() => {
                            setShowProfileSetup(true)
                            setTempProfile({ name: user.name || "", image: user.avatar_url || "" })
                          }}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-800 dark:text-gray-200">Edit Profile</span>
                        </DropdownMenuItem>

                        <Link href="/dashboard">
                          <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <span className="text-gray-800 dark:text-gray-200">My Useless Videos</span>
                          </DropdownMenuItem>
                        </Link>

                        <Link href="/upload">
                          <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <Upload className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-800 dark:text-gray-200">Upload Video</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator
                          className="border-gray-300 dark:border-gray-600"
                          style={{ borderStyle: "dashed" }}
                        />

                        <div className="p-4">
                          <PhantomWalletButton
                            onWalletConnected={handleWalletConnected}
                            onWalletDisconnected={handleWalletDisconnected}
                            loading={loading}
                            setLoading={setLoading}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 p-6" style={{ transform: "rotate(0.2deg)" }}>
          <Card
            className="bg-gray-100 dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg transform -rotate-1 transition-colors duration-300"
            style={{ borderStyle: "dashed" }}
          >
            <CardContent className="p-4">
              <nav className="space-y-3">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block p-3 bg-white dark:bg-gray-700 border-2 border-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-md transform hover:scale-105"
                    style={{
                      fontFamily: "Comic Sans MS, cursive",
                      transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index + 1) * 0.5}deg)`,
                      borderStyle: "solid",
                    }}
                  >
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Results Header */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <Card
                className="bg-yellow-50 dark:bg-yellow-900/20 border-3 border-yellow-500 dark:border-yellow-600 shadow-lg transform rotate-0.5 transition-colors duration-300"
                style={{ borderStyle: "dashed" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        className="text-xl font-bold text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: "Comic Sans MS, cursive" }}
                      >
                        Search Results for "{searchQuery}"
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        Found {searchResults.length} useless videos
                      </p>
                    </div>
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="border-2 border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transform hover:scale-105"
                      style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                    >
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.length > 0
              ? displayVideos.map((video, index) => (
                  <Link key={video.id} href={`/watch/${video.id}`}>
                    <Card
                      className="bg-white dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 duration-300"
                      style={{
                        borderStyle: "dashed",
                        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1) * 0.3}deg)`,
                      }}
                    >
                      <CardContent className="p-0">
                        {/* Video Thumbnail Section */}
                        <div
                          className="relative aspect-video border-b-3 border-gray-800 dark:border-gray-600 flex items-center justify-center overflow-hidden"
                          style={{
                            borderStyle: "dashed",
                            backgroundImage: video.thumbnail_url
                              ? `url(${video.thumbnail_url})`
                              : "linear-gradient(to bottom right, rgb(229, 231, 235), rgb(75, 85, 99))",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {!video.thumbnail_url && (
                            <div className="text-center">
                              <Play className="w-12 h-12 text-red-600 mx-auto mb-2 fill-current" />
                              <p
                                className="text-gray-800 dark:text-gray-200 font-bold"
                                style={{ fontFamily: "Comic Sans MS, cursive" }}
                              >
                                USELESS
                              </p>
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                          </div>
                          {video.creator_name === "UselessTube Official" && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                              <VerifiedBadge isVerified={true} size="sm" className="text-white" />
                              <span>VERIFIED</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3
                            className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2"
                            style={{ fontFamily: "Comic Sans MS, cursive" }}
                          >
                            {video.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="w-8 h-8 border-2 border-black dark:border-gray-300">
                              <AvatarImage
                                src={video.creator_avatar || "/placeholder.svg"}
                                alt={video.creator_name || ""}
                              />
                              <AvatarFallback className="bg-red-600 text-white font-bold text-xs">
                                {(video.creator_name || "U").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center space-x-1">
                              <span
                                className="text-sm text-gray-700 dark:text-gray-300 font-semibold"
                                style={{ fontFamily: "Comic Sans MS, cursive" }}
                              >
                                {video.creator_name || "Anonymous"}
                              </span>
                              <VerifiedBadge isVerified={video.creator_name === "UselessTube Official"} />
                            </div>
                          </div>
                          <div
                            className="text-xs text-gray-600 dark:text-gray-400"
                            style={{ fontFamily: "Comic Sans MS, cursive" }}
                          >
                            {video.views.toLocaleString()} views • {new Date(video.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              : // Placeholder videos when no real videos exist
                Array.from({ length: 9 }, (_, i) => (
                  <Link key={i} href={`/watch/${i + 1}`}>
                    <Card
                      className="bg-white dark:bg-gray-800 border-3 border-gray-800 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 duration-300"
                      style={{
                        borderStyle: "dashed",
                        transform: `rotate(${(i % 2 === 0 ? 1 : -1) * ((i % 3) + 1) * 0.3}deg)`,
                      }}
                    >
                      <CardContent className="p-0">
                        <div
                          className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-b-3 border-gray-800 dark:border-gray-600 flex items-center justify-center"
                          style={{ borderStyle: "dashed" }}
                        >
                          <div className="text-center">
                            <Play className="w-12 h-12 text-red-600 mx-auto mb-2 fill-current" />
                            <p
                              className="text-gray-800 dark:text-gray-200 font-bold"
                              style={{ fontFamily: "Comic Sans MS, cursive" }}
                            >
                              USELESS
                            </p>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.floor(Math.random() * 10) + 1}:
                            {Math.floor(Math.random() * 60)
                              .toString()
                              .padStart(2, "0")}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3
                            className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2"
                            style={{ fontFamily: "Comic Sans MS, cursive" }}
                          >
                            Useless Video #{i + 1}: How to waste {Math.floor(Math.random() * 60) + 1} minutes of your
                            life
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-black dark:border-gray-300 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">U</span>
                            </div>
                            <span
                              className="text-sm text-gray-700 dark:text-gray-300 font-semibold"
                              style={{ fontFamily: "Comic Sans MS, cursive" }}
                            >
                              UselessCreator{i + 1}
                            </span>
                          </div>
                          <div
                            className="text-xs text-gray-600 dark:text-gray-400"
                            style={{ fontFamily: "Comic Sans MS, cursive" }}
                          >
                            {Math.floor(Math.random() * 999)}K views • {Math.floor(Math.random() * 10) + 1} hours ago
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </main>
      </div>
    </div>
  )
}
