import { edgestoreClient } from './edgestore'
import axios from 'axios'

export const uploadToEdgeStore = async (url: string, type: 'image' | 'video') => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data)

  const upload = await edgestoreClient.upload({
    file: buffer,
    options: {
      contentType: type === 'image' ? 'image/jpeg' : 'video/mp4',
      fullPath: `insta/${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`,
    },
  })

  return upload.url
}
