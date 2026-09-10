import { Router } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth, signToken } from '../middleware/auth.js'

interface User { id: string; username: string; email: string; password: string; role: string; avatar?: string; createdAt: string }

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const users = await db.readTable<User>('users')
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered' })
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'Username taken' })

    const hash = await bcrypt.hash(password, 10)
    const user: User = { id: db.uuid(), username, email, password: hash, role: users.length === 0 ? 'admin' : 'user', createdAt: new Date().toISOString() }
    users.push(user)
    await db.writeTable('users', users)

    const token = signToken({ id: user.id, username: user.username, email: user.email, role: user.role })
    await db.logActivity('register', user.id, user.username, `New user registered: ${username}`)

    const { password: _, ...safe } = user
    res.json({ user: safe, token })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const users = await db.readTable<User>('users')
    const user = users.find(u => u.email === email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken({ id: user.id, username: user.username, email: user.email, role: user.role })
    await db.logActivity('login', user.id, user.username, `User logged in: ${user.username}`)

    const { password: _, ...safe } = user
    res.json({ user: safe, token })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const users = await db.readTable<User>('users')
    const user = users.find(u => u.id === req.user!.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { password: _, ...safe } = user
    res.json({ user: safe })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
