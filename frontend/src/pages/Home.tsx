import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post, Category } from '../lib/api'
import { BookOpen, TrendingUp, Shield, Brain, Clock, ArrowRight, Star, Users, ChevronRight, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const iconMap: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  'price-action': TrendingUp,
  psychology: Brain,
  'risk-management': Shield,
}
const colorMap: Record<string, string> = {
  beginner: 'from-primary-500 to-primary-600',
  'price-action': 'from-accent-500 to-accent-600',
  psychology: 'from-gold-500 to-gold-600',
  'risk-management': 'from-danger-500 to-danger-600',
}
const fallbackColors = ['from-primary-500 to-primary-600', 'from-accent-500 to-accent-600', 'from-gold-500 to-gold-600', 'from-danger-500 to-danger-600', 'from-primary-400 to-accent-500']

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<{ posts: Post[]; total: number }>('/posts?limit=6&published=true'),
      api.get<{ categories: Category[] }>('/categories'),
    ]).then(([postsRes, catsRes]) => {
      setPosts(postsRes.posts)
      setCategories(catsRes.categories || [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-8 animate-fade-in gap-1.5 px-4 py-1.5 text-sm">
              <Zap className="w-3.5 h-3.5" />
              Free Trading Education
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-slide-up text-balance tracking-tight">
              Master the Art of{' '}
              <span className="gradient-text">Trading</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 animate-slide-up leading-relaxed max-w-2xl mx-auto">
              Comprehensive lessons from beginner to advanced. Learn technical analysis, price action, risk management, and trading psychology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button size="lg" asChild className="gap-2">
                <Link to="/lessons">Start Learning <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              {categories.length > 0 && (
                <Button size="lg" variant="outline" asChild>
                  <Link to={`/category/${categories[0].slug}`}>{categories[0].name} Guide</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-2xl mx-auto">
            {[
              { icon: BookOpen, label: '50+ Lessons', value: 'Comprehensive' },
              { icon: Users, label: 'Community', value: 'Active' },
              { icon: Star, label: 'Quality', value: 'Expert-Led' },
              { icon: Clock, label: 'Updated', value: 'Weekly' },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="text-center p-5 bg-muted/30 border-border/30">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2.5" />
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Browse by Subject</h2>
            <p className="text-muted-foreground mt-1">Find lessons that match your skill level</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.slug] || BookOpen
            const color = colorMap[cat.slug] || fallbackColors[i % fallbackColors.length]
            return (
              <Card key={cat.id} className="group cursor-pointer hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                <Link to={`/category/${cat.slug}`} className="block p-6">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                  <div className="flex items-center gap-1 text-primary text-sm mt-4 group-hover:gap-2 transition-all duration-300">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Latest Lessons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Latest Lessons</h2>
            <p className="text-muted-foreground mt-1">Fresh content to boost your skills</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to="/lessons">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted/30 rounded-xl animate-pulse shimmer" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No lessons published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.id} className="group hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
                <Link to={`/lessons/${post.slug}`} className="block p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    {post.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-br from-primary/10 via-muted/60 to-accent/10 border-primary/20 text-center py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <CardContent className="relative">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Start Trading?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join our community and get access to all lessons. Start with the basics and work your way up.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
