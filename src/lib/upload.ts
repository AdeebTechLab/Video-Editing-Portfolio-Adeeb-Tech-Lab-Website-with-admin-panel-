// Image uploads are kept in this browser as compressed WebP data, so they work with no server.
// For many or large images, upload them to a host such as Cloudinary and paste the link instead,
// or put them in the project's public/images folder and use /images/file-name.jpg.

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
export const MAX_FILE_MB = 10

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return `${file.name}: use a JPG, PNG, WebP, GIF, AVIF or SVG image.`
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `${file.name} is larger than ${MAX_FILE_MB} MB. Use a smaller image.`
  return null
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`${file.name} could not be read as an image.`))
    }
    image.src = url
  })
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/** Resizes the image (longest side `maxSide` px) and returns it as WebP data. */
export async function imageToData(file: File, maxSide = 1400, quality = 0.8): Promise<string> {
  const problem = validateImage(file)
  if (problem) throw new Error(problem)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return toDataUrl(file)
  const image = await loadImage(file)
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.naturalWidth * scale)
  canvas.height = Math.round(image.naturalHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return toDataUrl(file)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality))
  return toDataUrl(blob && blob.size < file.size ? blob : file)
}

/** Approximate size of a data URL in bytes. */
export function dataUrlBytes(url: string) {
  if (!url.startsWith('data:')) return 0
  const comma = url.indexOf(',')
  return Math.round(((url.length - comma - 1) * 3) / 4)
}
