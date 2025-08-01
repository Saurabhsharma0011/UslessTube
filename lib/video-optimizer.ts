export interface VideoMetadata {
  duration: number
  width: number
  height: number
  format: string
  size: number
  bitrate?: number
}

export interface VideoOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  maxBitrate?: number
  quality?: 'low' | 'medium' | 'high'
  format?: 'mp4' | 'webm'
}

export class VideoOptimizer {
  private static readonly DEFAULT_OPTIONS: VideoOptimizationOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    maxBitrate: 5000000, // 5 Mbps
    quality: 'medium',
    format: 'mp4',
  }

  /**
   * Get video metadata from a file
   */
  static async getVideoMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        const metadata: VideoMetadata = {
          duration: Math.floor(video.duration) || 0,
          width: video.videoWidth,
          height: video.videoHeight,
          format: file.type.split('/')[1] || 'unknown',
          size: file.size,
        }

        URL.revokeObjectURL(video.src)
        resolve(metadata)
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video metadata'))
      }

      video.src = URL.createObjectURL(file)
    })
  }

  /**
   * Validate video file
   */
  static validateVideo(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv']

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Unsupported video format. Please use MP4, WebM, AVI, MOV, or WMV')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Generate thumbnail from video
   */
  static async generateThumbnail(file: File, time: number = 1): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.currentTime = time
      }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
        URL.revokeObjectURL(video.src)
        resolve(thumbnail)
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to generate thumbnail'))
      }

      video.src = URL.createObjectURL(file)
    })
  }

  /**
   * Format duration for display
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Calculate upload progress
   */
  static calculateProgress(loaded: number, total: number): number {
    return Math.round((loaded / total) * 100)
  }
} 