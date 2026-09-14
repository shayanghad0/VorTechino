import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { api, Post, Comment } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Clock, Eye, Calendar, ChevronLeft, ChevronRight, MessageSquare, Star, Bookmark, Share2, ThumbsUp, Reply } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LessonDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      api.get<{ post: Post }>(`/posts/slug/${slug}`),
      api.get<{ comments: Comment[] }>(`/comments?postId=`),
    ]).then(async ([postRes]) => {
      setPost(postRes.post)
      const commRes = await api.get<{ comments: Comment[] }>(`/comments?postId=${postRes.post.id}`)
      setComments(commRes.comments)
      try {
        const ratingRes = await api.get<{ average: number; count: number }>(`/ratings/${postRes.post.id}`)
        setAvgRating(ratingRes.average)
        setRatingCount(ratingRes.count)
      } catch {}
    }).catch(() => toast.error('Failed to load lesson'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!post || !user) return
    api.get<{ bookmarked: boolean }>(`/bookmarks/check/${post.id}`)
      .then(res => setBookmarked(res.bookmarked))
      .catch(() => {})
  }, [post?.id, user])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const el = contentRef.current
      const total = el.scrollHeight - el.clientHeight
      const current = window.scrollY - el.offsetTop
      setProgress(Math.min(Math.max((current / total) * 100, 0), 100))
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleRate = async (value: number) => {
    if (!post || !user) return toast.error('Please login to rate')
    try {
      await api.post('/ratings', { postId: post.id, value })
      setRating(value)
      setUserRating(value)
      const res = await api.get<{ average: number; count: number }>(`/ratings/${post.id}`)
      setAvgRating(res.average)
      setRatingCount(res.count)
      toast.success('Rating submitted!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to rate')
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !user || !commentText.trim()) return
    try {
      await api.post('/comments', { postId: post.id, content: commentText, parentId: replyTo || undefined })
      setCommentText('')
      setReplyTo(null)
      const res = await api.get<{ comments: Comment[] }>(`/comments?postId=${post.id}`)
      setComments(res.comments)
      toast.success('Comment posted!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to post comment')
    }
  }

  const handleBookmark = async () => {
    if (!post || !user) return toast.error('Please login to bookmark')
    try {
      const res = await api.post<{ bookmarked: boolean }>('/bookmarks/toggle', { postId: post.id })
      setBookmarked(res.bookmarked)
      toast.success(res.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch (e: any) {
      toast.error(e.message || 'Failed to bookmark')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-surface-900 rounded w-1/3 animate-pulse mb-4" />
        <div className="h-4 bg-surface-900 rounded w-1/2 animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-surface-900 rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-surface-100 mb-2">Lesson not found</h1>
        <Link to="/lessons" className="text-primary-400 hover:underline">Browse all lessons</Link>
      </div>
    )
  }

  const wordCount = post.content?.split(/\s+/).length || 0
  const readTime = Math.ceil(wordCount / 200)

  return (
    <div>
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-surface-900">
        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to={`/category/${post.category?.toLowerCase()}`} className="badge-primary hover:bg-primary-600/30 transition-colors">
              {post.category}
            </Link>
            {post.tags?.map(tag => (
              <span key={tag} className="badge-surface">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-100 mb-4 text-balance">{post.title}</h1>
          <p className="text-lg text-surface-400 mb-6">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {readTime} min read</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.viewCount} views</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-500" /> {avgRating.toFixed(1)} ({ratingCount})</span>
          </div>
        </header>

        <div className="divider mb-8" />

        <div className="prose-dark mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-xl !bg-surface-900 !border !border-surface-800">
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>{children}</code>
                )
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="card mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-surface-400 mb-1">Rate this lesson</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => handleRate(v)} className="p-0.5 transition-transform hover:scale-110">
                    <Star className={`w-6 h-6 ${v <= (userRating || Math.round(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-surface-600'}`} />
                  </button>
                ))}
                <span className="text-sm text-surface-400 ml-2">{avgRating.toFixed(1)} ({ratingCount} ratings)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleBookmark} className={`btn-ghost ${bookmarked ? 'text-primary-400' : ''}`}>
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }} className="btn-ghost">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-surface-100 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 text-sm text-surface-400">
                  <Reply className="w-3 h-3" /> Replying to comment
                  <button type="button" onClick={() => setReplyTo(null)} className="text-primary-400 hover:underline">Cancel</button>
                </div>
              )}
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="input min-h-[100px] resize-none"
                required
              />
              <div className="flex justify-end mt-2">
                <button type="submit" className="btn-primary text-sm" disabled={!commentText.trim()}>
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <p className="text-surface-400 text-sm mb-8">
              <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to leave a comment.
            </p>
          )}

          <div className="space-y-4">
            {comments.filter(c => !c.parentId).map(comment => (
              <CommentCard key={comment.id} comment={comment} replies={comments.filter(c => c.parentId === comment.id)} onReply={setReplyTo} />
            ))}
            {comments.length === 0 && (
              <p className="text-surface-500 text-sm py-8 text-center">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>
      </article>
    </div>
  )
}

function CommentCard({ comment, replies, onReply }: { comment: Comment; replies: Comment[]; onReply: (id: string) => void }) {
  return (
    <div className="card !p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {comment.username?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-surface-200">{comment.username}</span>
            <span className="text-xs text-surface-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-surface-300 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-300">
              <ThumbsUp className="w-3 h-3" /> {comment.likes || 0}
            </button>
            <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-300">
              <Reply className="w-3 h-3" /> Reply
            </button>
          </div>
        </div>
      </div>
      {replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l-2 border-surface-800 pl-4">
          {replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-300 shrink-0">
                {reply.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-surface-200">{reply.username}</span>
                  <span className="text-xs text-surface-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-surface-300 whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
