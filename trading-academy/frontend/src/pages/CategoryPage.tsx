import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { BookOpen, Clock, Eye } from 'lucide-react'

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-100 mb-2">{title}</h1>
        <p className="text-surface-400">Lessons in the {title} category</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-56 bg-surface-900 rounded-xl animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-surface-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-300 mb-2">No lessons in this category yet</h3>
          <Link to="/lessons" className="text-primary-400 hover:underline">Browse all lessons</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} to={`/lessons/${post.slug}`} className="card card-hover group">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-primary">{post.category}</span>
              </div>
              <h3 className="font-semibold text-surface-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-sm text-surface-400 line-clamp-2 mb-4">{post.description}</p>
              <div className="flex items-center gap-3 text-xs text-surface-500">
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
