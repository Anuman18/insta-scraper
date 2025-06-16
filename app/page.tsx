'use client'
import { useState } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username) return
    setLoading(true)
    setMedia([])

    const res = await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    setMedia(data.media || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Instagram Scraper</h1>

      <div className="flex justify-center gap-2">
        <input
          className="border p-2 rounded w-72 text-black"
          placeholder="Enter Instagram username or profile link"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Scraping...' : 'Search'}
        </button>
      </div>

      {media.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((item, i) => (
              <div key={i} className="border rounded p-2 bg-white">
                {item.type === 'image' ? (
                  <img src={item.src} alt="media" className="w-full" />
                ) : (
                  <video src={item.src} controls className="w-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
