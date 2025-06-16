import { createEdgeStoreClient } from '@edgestore/server'

export const edgestoreClient = createEdgeStoreClient({
  endpoint: process.env.ES_ENDPOINT!,
  apiKey: process.env.ES_API_KEY!,
})
