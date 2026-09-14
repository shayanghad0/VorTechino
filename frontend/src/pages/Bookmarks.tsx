import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock, Trash2 } from 'lucide-react'
import { api, Post, Bookmark as BookmarkType } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'

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
        <div className="text-center animate-fade-up">
          <h2 className="text-xl font-bold text-slate-100 mb-2">Please login</h2>
          <Button variant="link" asChild><Link to="/login" className="text-emerald-400">Go to login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3 animate-fade-up">
        <Bookmark className="w-7 h-7" /> Bookmarks
      </h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No bookmarks yet</h3>
          <p className="text-slate-500 mb-6">Save lessons you want to read later by clicking the bookmark button</p>
          <Button asChild className="btn-primary"><Link to="/lessons">Browse Lessons</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <div key={post.id} className="glass-card p-5 flex items-center justify-between animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <Link to={`/lessons/${post.slug}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                <h3 className="font-semibold text-slate-200 truncate">{post.title}</h3>
                <p className="text-sm text-slate-500 truncate mt-1">{post.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil((post.content?.split(/\s+/).length || 0) / 200)} min read</span>
                  <span>{post.category}</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" className="shrink-0 text-slate-600 hover:text-rose-400 transition-colors" onClick={() => handleRemove(post.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
