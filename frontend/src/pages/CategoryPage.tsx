import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { BookOpen, Clock, Eye } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function CategoryPage() {
  const { category } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    api.get<{ posts: Post[] }>(`/posts?category=${category}&published=true&limit=50`)
      .then(res => setPosts(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category])

  const title = category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Category'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">{title}</h1>
        <p className="text-slate-500">Lessons in the {title} category</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="h-52 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No lessons in this category yet</h3>
          <Button variant="link" asChild><Link to="/lessons" className="text-emerald-400">Browse all lessons</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link key={post.id} to={`/lessons/${post.slug}`} className="group glass-card p-6 block animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{post.category}</Badge>
              </div>
              <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200)} min</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.viewCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
