import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { db } from './database/db.js'
import { authMiddleware, AuthRequest, requireAuth, requireAdmin } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import ratingRoutes from './routes/ratings.js'
import searchRoutes from './routes/search.js'
import userRoutes from './routes/users.js'
import settingsRoutes from './routes/settings.js'
import activityRoutes from './routes/activity.js'
import uploadRoutes from './routes/upload.js'
import bookmarkRoutes from './routes/bookmarks.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))
app.use('/docs', express.static(path.resolve(process.cwd(), '..', 'docs')))

app.use(authMiddleware)

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/ratings', ratingRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', userRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/bookmarks', bookmarkRoutes)

interface Category { id: string; name: string; slug: string; description: string; order: number }

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.readTable<Category>('categories')
    categories.sort((a, b) => (a.order || 99) - (b.order || 99))
    res.json({ categories })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

app.post('/api/categories', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Name required' })
    const categories = await db.readTable<Category>('categories')
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (categories.find(c => c.slug === slug)) return res.status(400).json({ message: 'Category already exists' })
    const cat: Category = { id: db.uuid(), name: name.trim(), slug, description: description?.trim() || '', order: categories.length + 1 }
    categories.push(cat)
    await db.writeTable('categories', categories)
    res.json({ category: cat })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

app.put('/api/categories/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const categories = await db.readTable<Category>('categories')
    const idx = categories.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ message: 'Category not found' })
    if (req.body.name) categories[idx].name = req.body.name.trim()
    if (req.body.description !== undefined) categories[idx].description = req.body.description.trim()
    if (req.body.order !== undefined) categories[idx].order = req.body.order
    if (req.body.name) categories[idx].slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    await db.writeTable('categories', categories)
    res.json({ category: categories[idx] })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

app.delete('/api/categories/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let categories = await db.readTable<Category>('categories')
    const cat = categories.find(c => c.id === req.params.id)
    if (!cat) return res.status(404).json({ message: 'Category not found' })
    categories = categories.filter(c => c.id !== req.params.id)
    await db.writeTable('categories', categories)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/api/tags', async (req, res) => {
  try {
    const posts = await db.readTable<any>('posts')
    const tags = [...new Set(posts.flatMap(p => p.tags || []))].filter(Boolean)
    res.json({ tags })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

async function start() {
  await db.ensureFiles()
  console.log('Database initialized')

  const fs = await import('fs/promises')
  const uploadsDir = path.resolve(process.cwd(), 'uploads')
  try { await fs.access(uploadsDir) } catch { await fs.mkdir(uploadsDir, { recursive: true }) }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
