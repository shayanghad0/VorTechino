import { Router } from 'express'
import { db } from '../database/db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const logs = await db.readTable<any>('logs')
    const limit = parseInt(req.query.limit as string) || 50
    res.json({ logs: logs.slice(0, limit) })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
