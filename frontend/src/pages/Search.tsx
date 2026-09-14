import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { Search as SearchIcon, BookOpen, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'

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
      <h1 className="text-3xl font-bold text-foreground mb-8">Search Lessons</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, category, tags, or content..."
            className="pl-12 pr-24 h-12 text-base"
            autoFocus
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-8" size="sm">
            Search
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : searched ? (
        results.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try different keywords or browse categories</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {results.map(post => (
                <Card key={post.id} className="hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                  <Link to={`/lessons/${post.slug}`} className="block p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.tags?.slice(0, 3).map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200)} min</span>
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Find your next lesson</h3>
          <p className="text-muted-foreground">Search across all categories, tags, and content</p>
        </div>
      )}
    </div>
  )
}
