'use client'
import { useState } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')

  const handleSubmit = async () => {
    if (!username) return
    const res = await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    console.log(data)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Instagram Scraper</h1>
      <input
        className="border p-2 rounded w-72 text-black"
        placeholder="Enter Instagram username or profile link"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </main>
  )
}
