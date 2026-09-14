import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post, Category } from '../lib/api'
import { BookOpen, Clock, Eye, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'

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
        <h1 className="text-3xl font-bold text-foreground mb-2">All Lessons</h1>
        <p className="text-muted-foreground">Browse our complete trading education library</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={category === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('All')}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={category === cat.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 bg-muted/30 rounded-xl animate-pulse shimmer" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No lessons found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Card key={post.id} className="group hover:border-border/50 hover:bg-muted/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <Link to={`/lessons/${post.slug}`} className="block p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(post.content?.split(' ').length / 200) || 5} min</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.viewCount || 0}</span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
