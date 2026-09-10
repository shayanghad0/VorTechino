import { Router } from 'express'
import { db } from '../database/db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const settings = await db.readTable<any>('settings')
    res.json({ settings: settings[0] || {} })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const settings = await db.readTable<any>('settings')
    if (settings.length === 0) {
      settings.push({ ...req.body })
    } else {
      settings[0] = { ...settings[0], ...req.body }
    }
    await db.writeTable('settings', settings)
    res.json({ settings: settings[0] })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
