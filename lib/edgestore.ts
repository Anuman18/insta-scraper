import { createClient } from '@edgestore/server'

export const edgestoreClient = createClient({
  endpoint: process.env.ES_ENDPOINT!,
  apiKey: process.env.ES_API_KEY!,
})
