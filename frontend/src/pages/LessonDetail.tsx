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
import { Clock, Eye, Calendar, MessageSquare, Star, Bookmark, Share2, ThumbsUp, Reply } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'

export default function LessonDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
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
        <div className="h-8 bg-muted/30 rounded-xl w-1/3 animate-pulse mb-4 shimmer" />
        <div className="h-4 bg-muted/30 rounded-xl w-1/2 animate-pulse mb-8 shimmer" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Lesson not found</h1>
        <Button variant="link" asChild><Link to="/lessons">Browse all lessons</Link></Button>
      </div>
    )
  }

  const wordCount = post.content?.split(/\s+/).length || 0
  const readTime = Math.ceil(wordCount / 200)

  return (
    <div>
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-muted/50">
        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to={`/category/${post.category?.toLowerCase()}`}>
              <Badge variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">{post.category}</Badge>
            </Link>
            {post.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 text-balance tracking-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {readTime} min read</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.viewCount} views</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-gold-500" /> {avgRating.toFixed(1)} ({ratingCount})</span>
          </div>
        </header>

        <Separator className="my-8" />

        <div className="prose-dark mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-xl !bg-surface-950/60 !border !border-border">
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

        {/* Rating & Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1.5">Rate this lesson</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => handleRate(v)} className="p-0.5 transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${v <= (userRating || Math.round(avgRating)) ? 'text-gold-500 fill-gold-500' : 'text-muted-foreground/30'}`} />
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{avgRating.toFixed(1)} ({ratingCount} ratings)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={bookmarked ? 'default' : 'ghost'} size="sm" onClick={handleBookmark} className="gap-1.5">
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }} className="gap-1.5">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Reply className="w-3 h-3" /> Replying to comment
                  <button type="button" onClick={() => setReplyTo(null)} className="text-primary hover:underline">Cancel</button>
                </div>
              )}
              <Textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[100px] resize-none"
                required
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" size="sm" disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-muted-foreground text-sm mb-8">
              <Button variant="link" asChild className="p-0 h-auto"><Link to="/login">Login</Link></Button> to leave a comment.
            </p>
          )}

          <div className="space-y-4">
            {comments.filter(c => !c.parentId).map(comment => (
              <CommentCard key={comment.id} comment={comment} replies={comments.filter(c => c.parentId === comment.id)} onReply={setReplyTo} />
            ))}
            {comments.length === 0 && (
              <p className="text-muted-foreground text-sm py-8 text-center">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>
      </article>
    </div>
  )
}

function CommentCard({ comment, replies, onReply }: { comment: Comment; replies: Comment[]; onReply: (id: string) => void }) {
  return (
    <Card className="!p-4">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
            {comment.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{comment.username}</span>
            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="w-3 h-3" /> {comment.likes || 0}
            </button>
            <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Reply className="w-3 h-3" /> Reply
            </button>
          </div>
        </div>
      </div>
      {replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l-2 border-border pl-4">
          {replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-3">
              <Avatar className="w-6 h-6 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                  {reply.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{reply.username}</span>
                  <span className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
