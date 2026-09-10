import { Router } from 'express'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth } from '../middleware/auth.js'

interface Rating { id: string; postId: string; userId: string; value: number; createdAt: string }

const router = Router()

router.get('/:postId', async (req, res) => {
  try {
    const ratings = await db.readTable<Rating>('ratings')
    const postRatings = ratings.filter(r => r.postId === req.params.postId)
    const average = postRatings.length ? postRatings.reduce((sum, r) => sum + r.value, 0) / postRatings.length : 0
    res.json({ average, count: postRatings.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { postId, value } = req.body
    if (!postId || !value || value < 1 || value > 5) return res.status(400).json({ message: 'Valid rating (1-5) required' })
    const ratings = await db.readTable<Rating>('ratings')
    const existing = ratings.find(r => r.postId === postId && r.userId === req.user!.id)
    if (existing) {
      existing.value = value
    } else {
      ratings.push({ id: db.uuid(), postId, userId: req.user!.id, value, createdAt: new Date().toISOString() })
    }
    await db.writeTable('ratings', ratings)
    await db.logActivity('rating_submitted', req.user!.id, req.user!.username, `Rated post ${postId}: ${value}/5`)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
