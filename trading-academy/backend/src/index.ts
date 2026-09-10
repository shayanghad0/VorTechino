import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { db } from './database/db.js'
import { authMiddleware } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import ratingRoutes from './routes/ratings.js'
import searchRoutes from './routes/search.js'
import userRoutes from './routes/users.js'
import settingsRoutes from './routes/settings.js'
import activityRoutes from './routes/activity.js'
import uploadRoutes from './routes/upload.js'

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

app.get('/api/categories', async (req, res) => {
  try {
    const posts = await db.readTable<any>('posts')
    const categories = [...new Set(posts.map(p => p.category))].filter(Boolean)
    res.json({ categories })
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
