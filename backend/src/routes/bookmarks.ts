import { Router } from 'express'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth } from '../middleware/auth.js'

interface Bookmark { id: string; postId: string; userId: string; createdAt: string }

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const bookmarks = await db.readTable<Bookmark>('bookmarks')
    const userBookmarks = bookmarks.filter(b => b.userId === req.user!.id)
    res.json({ bookmarks: userBookmarks })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/check/:postId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const bookmarks = await db.readTable<Bookmark>('bookmarks')
    const exists = bookmarks.some(b => b.postId === req.params.postId && b.userId === req.user!.id)
    res.json({ bookmarked: exists })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/toggle', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.body
    if (!postId) return res.status(400).json({ message: 'postId required' })
    const bookmarks = await db.readTable<Bookmark>('bookmarks')
    const idx = bookmarks.findIndex(b => b.postId === postId && b.userId === req.user!.id)
    if (idx >= 0) {
      bookmarks.splice(idx, 1)
      await db.writeTable('bookmarks', bookmarks)
      return res.json({ bookmarked: false })
    }
    bookmarks.push({ id: db.uuid(), postId, userId: req.user!.id, createdAt: new Date().toISOString() })
    await db.writeTable('bookmarks', bookmarks)
    res.json({ bookmarked: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
