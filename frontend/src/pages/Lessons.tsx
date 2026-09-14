import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post, Category } from '../lib/api'
import { BookOpen, Clock, Eye, Filter, Search } from 'lucide-react'

export default function Lessons() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setCategories(res.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ published: 'true', limit: '50' })
    if (category !== 'All') params.set('category', category)
    if (search) params.set('search', search)
    api.get<{ posts: Post[] }>(`/posts?${params}`)
      .then(res => setPosts(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-50 mb-2">All Lessons</h1>
        <p className="text-surface-400">Browse our complete trading education library</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons..."
            className="input pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-surface-500" />
          <button
            onClick={() => setCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              category === 'All'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-surface-800/40 text-surface-400 hover:text-surface-200 border border-surface-800/40'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat.name
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-surface-800/40 text-surface-400 hover:text-surface-200 border border-surface-800/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-surface-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-300 mb-2">No lessons found</h3>
          <p className="text-surface-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              to={`/lessons/${post.slug}`}
              className="card card-hover group animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-primary">{post.category}</span>
              </div>
              <h3 className="font-semibold text-surface-50 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-surface-400 line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
              <div className="flex items-center justify-between text-xs text-surface-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200) || 5} min</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.viewCount || 0}</span>
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
