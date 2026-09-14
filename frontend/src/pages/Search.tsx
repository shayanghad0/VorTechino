import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { Search as SearchIcon, BookOpen, Clock } from 'lucide-react'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      doSearch(q)
    }
  }, [searchParams])

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await api.get<{ posts: Post[] }>(`/search?q=${encodeURIComponent(q.trim())}`)
      setResults(res.posts)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams({ q: query })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-surface-50 mb-8">Search Lessons</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, category, tags, or content..."
            className="input pl-12 pr-24 py-3.5 text-base"
            autoFocus
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2 text-sm">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />)}
        </div>
      ) : searched ? (
        results.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-surface-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-300 mb-2">No results found</h3>
            <p className="text-surface-500">Try different keywords or browse categories</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-surface-400 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {results.map(post => (
                <Link key={post.id} to={`/lessons/${post.slug}`} className="card card-hover block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-primary">{post.category}</span>
                    {post.tags?.slice(0, 3).map(t => <span key={t} className="badge-surface">{t}</span>)}
                  </div>
                  <h3 className="font-semibold text-surface-50 mb-1 hover:text-primary-400 transition-colors">{post.title}</h3>
                  <p className="text-sm text-surface-400 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200)} min</span>
                    <span>{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-surface-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-300 mb-2">Find your next lesson</h3>
          <p className="text-surface-500">Search across all categories, tags, and content</p>
        </div>
      )}
    </div>
  )
}
