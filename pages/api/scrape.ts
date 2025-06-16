import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'

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

    const media = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map((el) => ({
        src: el.getAttribute('src'),
        type: 'image',
      }))
      const vids = Array.from(document.querySelectorAll('video')).map((el) => ({
        src: el.getAttribute('src'),
        type: 'video',
      }))
      return [...imgs, ...vids].filter((item) => item.src)
    })

    await browser.close()

    res.status(200).json({ media })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to scrape profile' })
  }
}
