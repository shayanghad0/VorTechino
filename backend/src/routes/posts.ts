import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth, requireAdmin } from '../middleware/auth.js'

interface Post { id: string; slug: string; title: string; description: string; content: string; category: string; tags: string[]; cover?: string; author: string; published: boolean; viewCount: number; createdAt: string; updatedAt: string }

const router = Router()
const DOCS_DIR = path.resolve(process.cwd(), '..', 'docs')

async function loadDocsFromDisk(): Promise<Post[]> {
  const posts: Post[] = []
  try {
    const categories = await fs.readdir(DOCS_DIR)
    for (const cat of categories) {
      const catPath = path.join(DOCS_DIR, cat)
      const stat = await fs.stat(catPath)
      if (!stat.isDirectory()) continue
      const files = await fs.readdir(catPath)
      for (const file of files) {
        if (!file.endsWith('.md')) continue
        const filePath = path.join(catPath, file)
        const raw = await fs.readFile(filePath, 'utf-8')
        const { data, content } = matter(raw)
        const slug = file.replace('.md', '')
        posts.push({
          id: db.uuid(),
          slug: data.slug || slug,
          title: data.title || slug.replace(/-/g, ' '),
          description: data.description || content.substring(0, 150),
          content,
          category: data.category || cat,
          tags: data.tags || [],
          cover: data.cover,
          author: data.author || 'Admin',
          published: data.published !== false,
          viewCount: 0,
          createdAt: data.date || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }
  } catch {}
  return posts
}

async function syncDocsWithDB() {
  const diskPosts = await loadDocsFromDisk()
  if (diskPosts.length === 0) return
  const dbPosts = await db.readTable<Post>('posts')
  const existingSlugs = new Set(dbPosts.map(p => p.slug))
  let added = 0
  for (const dp of diskPosts) {
    if (!existingSlugs.has(dp.slug)) {
      dbPosts.push(dp)
      added++
    }
  }
  if (added > 0) await db.writeTable('posts', dbPosts)
}

router.get('/', async (req, res) => {
  try {
    await syncDocsWithDB()
    let posts = await db.readTable<Post>('posts')
    const { category, search, published, limit } = req.query

    if (published === 'true') posts = posts.filter(p => p.published)
    if (category) posts = posts.filter(p => p.category.toLowerCase() === (category as string).toLowerCase())
    if (search) {
      const q = (search as string).toLowerCase()
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.content?.toLowerCase().includes(q))
    }

    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const total = posts.length
    const lim = parseInt(limit as string) || 50
    posts = posts.slice(0, lim)

    res.json({ posts, total })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/slug/:slug', async (req, res) => {
  try {
    const posts = await db.readTable<Post>('posts')
    const post = posts.find(p => p.slug === req.params.slug)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.viewCount = (post.viewCount || 0) + 1
    await db.writeTable('posts', posts)
    res.json({ post })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const posts = await db.readTable<Post>('posts')
    const post = posts.find(p => p.id === req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ post })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, slug, description, content, category, tags, cover, published } = req.body
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' })
    const posts = await db.readTable<Post>('posts')
    const post: Post = {
      id: db.uuid(), slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title, description: description || '', content,
      category: category || 'Beginner', tags: tags || [], cover, author: req.user!.username,
      published: published || false, viewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    posts.push(post)
    await db.writeTable('posts', posts)
    await db.logActivity('lesson_created', req.user!.id, req.user!.username, `Created lesson: ${title}`)
    res.json({ post })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const posts = await db.readTable<Post>('posts')
    const idx = posts.findIndex(p => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ message: 'Post not found' })
    posts[idx] = { ...posts[idx], ...req.body, updatedAt: new Date().toISOString() }
    await db.writeTable('posts', posts)
    await db.logActivity('lesson_updated', req.user!.id, req.user!.username, `Updated lesson: ${posts[idx].title}`)
    res.json({ post: posts[idx] })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let posts = await db.readTable<Post>('posts')
    const post = posts.find(p => p.id === req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    posts = posts.filter(p => p.id !== req.params.id)
    await db.writeTable('posts', posts)
    await db.logActivity('lesson_deleted', req.user!.id, req.user!.username, `Deleted lesson: ${post.title}`)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
