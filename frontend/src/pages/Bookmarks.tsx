import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock, Trash2 } from 'lucide-react'
import { api, Post, Bookmark as BookmarkType } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

export default function Bookmarks() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    api.get<{ bookmarks: BookmarkType[] }>('/bookmarks')
      .then(async ({ bookmarks }) => {
        if (bookmarks.length === 0) return setPosts([])
        const results = await Promise.all(
          bookmarks.map(b => api.get<{ post: Post }>(`/posts/${b.postId}`).then(r => r.post).catch(() => null))
        )
        setPosts(results.filter(Boolean) as Post[])
      })
      .catch(() => toast.error('Failed to load bookmarks'))
      .finally(() => setLoading(false))
  }, [user])

  const handleRemove = async (postId: string) => {
    try {
      await api.post<{ bookmarked: boolean }>('/bookmarks/toggle', { postId })
      setPosts(prev => prev.filter(p => p.id !== postId))
      toast.success('Bookmark removed')
    } catch (e: any) {
      toast.error(e.message || 'Failed to remove bookmark')
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Please login</h2>
          <Button variant="link" asChild><Link to="/login">Go to login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
        <Bookmark className="w-7 h-7" /> Bookmarks
      </h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">Save lessons you want to read later by clicking the bookmark button</p>
          <Button asChild><Link to="/lessons">Browse Lessons</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="hover:border-border/50 transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <Link to={`/lessons/${post.slug}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                  <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground truncate mt-1">{post.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil((post.content?.split(/\s+/).length || 0) / 200)} min read</span>
                    <span>{post.category}</span>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
