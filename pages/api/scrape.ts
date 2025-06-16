import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'
import { uploadToEdgeStore } from '@/lib/uploadMedia'

type MediaItem = {
  src: string
  type: 'image' | 'video'
  uploadedUrl?: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const { username } = JSON.parse(req.body)

  if (!username) return res.status(400).json({ error: 'No username provided' })

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()

    const profileURL = username.includes('instagram.com')
      ? username
      : `https://www.instagram.com/${username}`

    await page.goto(profileURL, { waitUntil: 'networkidle2' })

    await page.waitForSelector('img, video', { timeout: 10000 })

    const media: MediaItem[] = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map((el) => ({
        src: el.getAttribute('src'),
        type: 'image' as const,
      }))
      const vids = Array.from(document.querySelectorAll('video')).map((el) => ({
        src: el.getAttribute('src'),
        type: 'video' as const,
      }))
      return [...imgs, ...vids].filter((item) => item.src)
    })

    await browser.close()

    // ⬆ Upload to EdgeStore
    const uploaded = await Promise.all(
      media.map(async (item) => {
        try {
          const url = await uploadToEdgeStore(item.src, item.type)
          return { ...item, uploadedUrl: url }
        } catch (err) {
          console.error(`Upload failed for ${item.src}`, err)
          return { ...item, uploadedUrl: null }
        }
      })
    )

    return res.status(200).json({ media: uploaded })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to scrape or upload media' })
  }
}
