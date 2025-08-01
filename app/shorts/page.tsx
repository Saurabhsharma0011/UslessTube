"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  ThumbsDown,
  Volume2,
  VolumeX,
  Play,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Short {
  id: number
  title: string
  creator: string
  avatar: string
  likes: string
  comments: string
  shares: string
  description: string
  hashtags: string[]
}

export default function UselessShorts() {
  const [currentShort, setCurrentShort] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [liked, setLiked] = useState<number[]>([])
  const [disliked, setDisliked] = useState<number[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  const shorts: Short[] = [
    {
      id: 1,
      title: "How to waste 15 seconds perfectly",
      creator: "UselessMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: "42K",
      comments: "1.2K",
      shares: "856",
      description: "The most useless 15 seconds of your life! You're welcome 😂",
      hashtags: ["#useless", "#waste", "#perfect", "#shorts"],
    },
    {
      id: 2,
      title: "Staring at nothing for 30 seconds",
      creator: "VoidWatcher",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: "38K",
      comments: "892",
      shares: "654",
      description: "Pure emptiness. This is what peak uselessness looks like.",
      hashtags: ["#void", "#nothing", "#meditation", "#useless"],
    },
    {
      id: 3,
      title: "Counting backwards from 10 very slowly",
      creator: "SlowCounter",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: "51K",
      comments: "2.1K",
      shares: "1.2K",
      description: "10... 9... 8... You know what comes next but you'll watch anyway",
      hashtags: ["#counting", "#slow", "#backwards", "#useless"],
    },
    {
      id: 4,
      title: "Watching paint dry in real time",
      creator: "PaintDryGuy",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: "67K",
      comments: "3.4K",
      shares: "2.1K",
      description: "The most riveting paint drying experience you'll ever have!",
      hashtags: ["#paint", "#dry", "#realtime", "#thrilling"],
    },
    {
      id: 5,
      title: "Explaining why this video is useless",
      creator: "MetaUseless",
      avatar: "/placeholder.svg?height=40&width=40",
      likes: "89K",
      comments: "5.6K",
      shares: "3.2K",
      description: "A deep dive into the uselessness of this very video. Meta!",
      hashtags: ["#meta", "#explanation", "#useless", "#philosophy"],
    },
  ]

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const nextShort = () => {
    if (currentShort < shorts.length - 1) {
      setCurrentShort(currentShort + 1)
    }
  }

  const prevShort = () => {
    if (currentShort > 0) {
      setCurrentShort(currentShort - 1)
    }
  }

  const toggleLike = (id: number) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((likeId) => likeId !== id) : [...prev, id]))
    setDisliked((prev) => prev.filter((dislikeId) => dislikeId !== id))
  }

  const toggleDislike = (id: number) => {
    setDisliked((prev) => (prev.includes(id) ? prev.filter((dislikeId) => dislikeId !== id) : [...prev, id]))
    setLiked((prev) => prev.filter((likeId) => likeId !== id))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        prevShort()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        nextShort()
      } else if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentShort])

  const currentShortData = shorts[currentShort]

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 border-2 border-white/30 rounded-full transform -rotate-2"
            style={{ borderStyle: "dashed" }}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>

        <h1
          className="text-white text-xl font-bold transform rotate-1"
          style={{
            fontFamily: "Comic Sans MS, cursive",
            textShadow: "2px 2px 0px #ef4444",
          }}
        >
          Useless Shorts
        </h1>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 border-2 border-white/30 rounded-full transform rotate-3"
          style={{ borderStyle: "dashed" }}
        >
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Video Container */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Fake Video Background */}
        <div className="w-full max-w-sm h-full bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 relative overflow-hidden">
          {/* Simulated Video Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-32 h-32 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white transform rotate-12">
                <Play className="w-16 h-16 text-white fill-current" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                {currentShortData.title}
              </h2>
              <p className="text-lg opacity-80" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                This is where the useless magic happens!
              </p>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            {!isPlaying && (
              <div className="bg-black/50 rounded-full p-4 transform scale-110">
                <Play className="w-12 h-12 text-white fill-current" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
          {/* Like Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleLike(currentShortData.id)}
              className={`w-12 h-12 rounded-full border-2 border-white/30 transform hover:scale-110 transition-all ${
                liked.includes(currentShortData.id) ? "bg-red-600 text-white" : "text-white hover:bg-white/20"
              }`}
              style={{ borderStyle: "dashed", transform: "rotate(-5deg)" }}
            >
              <Heart className={`w-6 h-6 ${liked.includes(currentShortData.id) ? "fill-current" : ""}`} />
            </Button>
            <span className="text-white text-xs mt-1 font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentShortData.likes}
            </span>
          </div>

          {/* Dislike Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleDislike(currentShortData.id)}
              className={`w-12 h-12 rounded-full border-2 border-white/30 transform hover:scale-110 transition-all ${
                disliked.includes(currentShortData.id) ? "bg-gray-600 text-white" : "text-white hover:bg-white/20"
              }`}
              style={{ borderStyle: "dashed", transform: "rotate(5deg)" }}
            >
              <ThumbsDown className={`w-6 h-6 ${disliked.includes(currentShortData.id) ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:bg-white/20 transform hover:scale-110 transition-all"
              style={{ borderStyle: "dashed", transform: "rotate(-3deg)" }}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentShortData.comments}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:bg-white/20 transform hover:scale-110 transition-all"
              style={{ borderStyle: "dashed", transform: "rotate(7deg)" }}
            >
              <Share className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentShortData.shares}
            </span>
          </div>

          {/* Mute Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:bg-white/20 transform hover:scale-110 transition-all"
            style={{ borderStyle: "dashed", transform: "rotate(-7deg)" }}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevShort}
            disabled={currentShort === 0}
            className="w-10 h-10 rounded-full border-2 border-white/30 text-white hover:bg-white/20 disabled:opacity-30 transform hover:scale-110 transition-all"
            style={{ borderStyle: "dashed", transform: "rotate(10deg)" }}
          >
            <ChevronUp className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextShort}
            disabled={currentShort === shorts.length - 1}
            className="w-10 h-10 rounded-full border-2 border-white/30 text-white hover:bg-white/20 disabled:opacity-30 transform hover:scale-110 transition-all"
            style={{ borderStyle: "dashed", transform: "rotate(-10deg)" }}
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-sm">
            {/* Creator Info */}
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-10 h-10 border-2 border-white transform -rotate-3">
                <AvatarImage src={currentShortData.avatar || "/placeholder.svg"} alt={currentShortData.creator} />
                <AvatarFallback className="bg-red-600 text-white font-bold">
                  {currentShortData.creator.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  @{currentShortData.creator}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-white rounded-full px-4 transform rotate-2"
                style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
              >
                Follow
              </Button>
            </div>

            {/* Description */}
            <p className="text-white text-sm mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentShortData.description}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {currentShortData.hashtags.map((tag, index) => (
                <span
                  key={tag}
                  className="text-blue-300 text-sm font-semibold"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-2">
            {shorts.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-8 rounded-full transition-all ${index === currentShort ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
