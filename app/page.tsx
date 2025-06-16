'use client'

import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

type MediaItem = {
  src: string
  type: 'image' | 'video'
  uploadedUrl?: string | null
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)

  const handleScrape = async () => {
    setLoading(true)
    setMedia([])
    const res = await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    setMedia(data.media)
    setLoading(false)
  }

  const downloadAll = async (items: MediaItem[], type: 'image' | 'video') => {
    const zip = new JSZip()
    const folder = zip.folder(type === 'image' ? 'images' : 'videos')!

    for (let i = 0; i < items.length; i++) {
      const file = items[i]
      const url = file.uploadedUrl || file.src
      const response = await fetch(url)
      const blob = await response.blob()
      folder.file(`media-${i}.${type === 'image' ? 'jpg' : 'mp4'}`, blob)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `instagram-${type}s.zip`)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Instagram Content Scraper</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Instagram username or profile URL"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleScrape}
          disabled={loading || !username}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </div>

      {media.length > 0 && (
        <>
          <div className="flex gap-4 mt-6 mb-6">
            <button
              onClick={() => downloadAll(media.filter((m) => m.type === 'image'), 'image')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download All Images
            </button>
            <button
              onClick={() => downloadAll(media.filter((m) => m.type === 'video'), 'video')}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Download All Videos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {media.map((item, index) => (
              <div key={index} className="bg-white rounded shadow p-2">
                {item.type === 'image' ? (
                  <>
                    <img src={item.uploadedUrl || item.src} alt="Scraped" className="w-full" />
                    <a
                      href={item.uploadedUrl || item.src}
                      download
                      className="text-blue-600 text-sm underline block mt-1"
                    >
                      Download
                    </a>
                  </>
                ) : (
                  <>
                    <video src={item.uploadedUrl || item.src} controls className="w-full" />
                    <a
                      href={item.uploadedUrl || item.src}
                      download
                      className="text-blue-600 text-sm underline block mt-1"
                    >
                      Download
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
