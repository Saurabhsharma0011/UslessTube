import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  public_id: string
  format: string
  size: number
}

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string = 'useless-tube',
  resourceType: 'image' | 'video' = 'video'
): Promise<UploadResult> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          allowed_formats: resourceType === 'video' 
            ? ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'] 
            : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: resourceType === 'video' 
            ? { quality: 'auto', fetch_format: 'auto' }
            : { quality: 'auto', fetch_format: 'auto' },
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              size: result.bytes,
            })
          } else {
            reject(new Error('Upload failed'))
          }
        }
      )

      uploadStream.end(file)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('File upload failed')
  }
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    // Don't throw error for delete failures as they're not critical
  }
}

// Fallback function for when Cloudinary is not configured
export const uploadToLocalStorage = async (
  file: Buffer,
  filename: string
): Promise<UploadResult> => {
  // This is a fallback - in production, you'd want to use a proper file storage service
  const base64 = file.toString('base64')
  const dataUrl = `data:application/octet-stream;base64,${base64}`
  
  return {
    url: dataUrl,
    public_id: filename,
    format: 'base64',
    size: file.length,
  }
} 