import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { Search as SearchIcon, BookOpen, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

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
      <h1 className="text-3xl font-bold text-slate-100 mb-8 animate-fade-up">Search Lessons</h1>

      <form onSubmit={handleSubmit} className="mb-8 animate-fade-up animate-delay-100">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, category, tags, or content..."
            className="w-full pl-12 pr-24 h-12 text-base rounded-xl bg-[rgba(11,17,32,0.6)] border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            autoFocus
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2 !px-5 !rounded-lg" size="sm">
            Search
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : searched ? (
        results.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No results found</h3>
            <p className="text-slate-500">Try different keywords or browse categories</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {results.map((post, i) => (
                <Link key={post.id} to={`/lessons/${post.slug}`} className="group glass-card p-6 block animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{post.category}</Badge>
                    {post.tags?.slice(0, 3).map(t => <Badge key={t} variant="outline" className="text-xs border-white/10 text-slate-500">{t}</Badge>)}
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
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
          <SearchIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Find your next lesson</h3>
          <p className="text-slate-500">Search across all categories, tags, and content</p>
        </div>
      )}
    </div>
  )
}
