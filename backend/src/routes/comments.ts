import { Router } from 'express'
import { db } from '../database/db.js'
import { AuthRequest, requireAuth } from '../middleware/auth.js'

interface Comment { id: string; postId: string; userId: string; username: string; content: string; parentId?: string; likes: number; likedBy: string[]; status: string; createdAt: string; updatedAt: string }

const router = Router()

router.get('/', async (req, res) => {
  try {
    let comments = await db.readTable<Comment>('comments')
    const { postId, status } = req.query
    if (postId) comments = comments.filter(c => c.postId === postId)
    if (status && status !== 'all') comments = comments.filter(c => c.status === status)
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    res.json({ comments })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { postId, content, parentId } = req.body
    if (!postId || !content?.trim()) return res.status(400).json({ message: 'Post ID and content required' })
    const comments = await db.readTable<Comment>('comments')
    const comment: Comment = {
      id: db.uuid(), postId, userId: req.user!.id, username: req.user!.username, content: content.trim(),
      parentId: parentId || undefined, likes: 0, likedBy: [], status: 'approved',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    comments.push(comment)
    await db.writeTable('comments', comments)
    res.json({ comment })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const comments = await db.readTable<Comment>('comments')
    const idx = comments.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ message: 'Comment not found' })
    if (req.user!.role !== 'admin' && comments[idx].userId !== req.user!.id) return res.status(403).json({ message: 'Forbidden' })
    comments[idx] = { ...comments[idx], ...req.body, updatedAt: new Date().toISOString() }
    await db.writeTable('comments', comments)
    res.json({ comment: comments[idx] })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    let comments = await db.readTable<Comment>('comments')
    const comment = comments.find(c => c.id === req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    if (req.user!.role !== 'admin' && comment.userId !== req.user!.id) return res.status(403).json({ message: 'Forbidden' })
    comments = comments.filter(c => c.id !== req.params.id && c.parentId !== req.params.id)
    await db.writeTable('comments', comments)
    await db.logActivity('comment_deleted', req.user!.id, req.user!.username, `Deleted comment on post ${comment.postId}`)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
