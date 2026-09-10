import { Router } from 'express'
import { db } from '../database/db.js'

interface Post { id: string; slug: string; title: string; description: string; content: string; category: string; tags: string[]; author: string; published: boolean; viewCount: number; createdAt: string }

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ posts: [] })
    const posts = await db.readTable<Post>('posts')
    const query = (q as string).toLowerCase()
    const results = posts
      .filter(p => p.published)
      .filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.content?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query) ? 2 : 0
        const bTitle = b.title.toLowerCase().includes(query) ? 2 : 0
        return bTitle - aTitle || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 50)
    res.json({ posts: results })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
