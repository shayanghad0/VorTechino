import { Router } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth, requireAdmin } from '../middleware/auth.js'

interface User { id: string; username: string; email: string; password: string; role: string; avatar?: string; createdAt: string }

const router = Router()

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await db.readTable<User>('users')
    const safe = users.map(({ password, ...u }) => u)
    res.json({ users: safe })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await db.readTable<User>('users')
    const idx = users.findIndex(u => u.id === req.params.id)
    if (idx === -1) return res.status(404).json({ message: 'User not found' })
    if (req.body.role) users[idx].role = req.body.role
    if (req.body.username) users[idx].username = req.body.username
    if (req.body.email) users[idx].email = req.body.email
    if (req.body.password) users[idx].password = await bcrypt.hash(req.body.password, 10)
    await db.writeTable('users', users)
    const { password, ...safe } = users[idx]
    res.json({ user: safe })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let users = await db.readTable<User>('users')
    const user = users.find(u => u.id === req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.id === req.user!.id) return res.status(400).json({ message: 'Cannot delete yourself' })
    users = users.filter(u => u.id !== req.params.id)
    await db.writeTable('users', users)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
