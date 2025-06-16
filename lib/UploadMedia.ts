import { edgestoreClient } from './edgestore'

export const uploadToEdgeStore = async (url: string, filename: string) => {
  const res = await fetch(url)
  const blob = await res.blob()

  const buffer = Buffer.from(await blob.arrayBuffer())

  const file = await edgestoreClient.files.upload({
    file: {
      buffer,
      size: buffer.length,
      mimetype: blob.type,
      originalName: filename,
    },
  })

  return file.url
}
