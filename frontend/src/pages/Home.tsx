import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post, Category } from '../lib/api'
import { BookOpen, TrendingUp, Shield, Brain, Clock, ArrowRight, Star, Users, ChevronRight, Zap, ArrowUpRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'

const iconMap: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  'price-action': TrendingUp,
  psychology: Brain,
  'risk-management': Shield,
}
const colorMap: Record<string, string> = {
  beginner: 'from-emerald-500 to-emerald-600',
  'price-action': 'from-cyan-500 to-cyan-600',
  psychology: 'from-amber-500 to-amber-600',
  'risk-management': 'from-rose-500 to-rose-600',
}
const fallbackColors = ['from-emerald-500 to-emerald-600', 'from-cyan-500 to-cyan-600', 'from-amber-500 to-amber-600', 'from-rose-500 to-rose-600', 'from-emerald-400 to-cyan-500']

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
        {/* Background glow effects */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-emerald-500/8 via-transparent to-transparent" />
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-fade-up">
              <Badge variant="secondary" className="mb-8 gap-1.5 px-4 py-1.5 text-sm bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 transition-colors cursor-default">
                <Zap className="w-3.5 h-3.5" />
                Free Trading Education
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 mb-6 animate-fade-up animate-delay-100 text-balance tracking-tight leading-[1.1]">
              Master the Art of{' '}
              <span className="gradient-text">Trading</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 animate-fade-up animate-delay-200 leading-relaxed max-w-2xl mx-auto">
              Comprehensive lessons from beginner to advanced. Learn technical analysis, price action, risk management, and trading psychology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-300">
              <Link to="/lessons" className="btn-primary gap-2">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              {categories.length > 0 && (
                <Link to={`/category/${categories[0].slug}`} className="btn-secondary">
                  {categories[0].name} Guide
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-2xl mx-auto animate-fade-up animate-delay-400">
            {[
              { icon: BookOpen, label: '50+', value: 'Lessons', color: 'text-emerald-400' },
              { icon: Users, label: 'Active', value: 'Community', color: 'text-cyan-400' },
              { icon: Star, label: 'Expert', value: 'Led Content', color: 'text-amber-400' },
              { icon: Clock, label: 'Weekly', value: 'Updates', color: 'text-rose-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-2.5`} />
                <p className="text-sm font-bold text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Browse by Subject</h2>
            <p className="text-slate-500 mt-1.5">Find lessons that match your skill level</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.slug] || BookOpen
            const color = colorMap[cat.slug] || fallbackColors[i % fallbackColors.length]
            return (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="group glass-card p-6 block">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-100 mb-1.5">{cat.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-1 text-emerald-400 text-sm mt-4 group-hover:gap-2 transition-all duration-300 font-medium">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Latest Lessons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Latest Lessons</h2>
            <p className="text-slate-500 mt-1.5">Fresh content to boost your skills</p>
          </div>
          <Link to="/lessons" className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No lessons published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <Link key={post.id} to={`/lessons/${post.slug}`} className="group glass-card p-6 block animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{post.category}</Badge>
                  {post.tags?.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-white/10 text-slate-500">{tag}</Badge>
                  ))}
                </div>
                <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-2xl overflow-hidden gradient-bg-strong border border-white/5 p-14 text-center">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Ready to Start Trading?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join our community and get access to all lessons. Start with the basics and work your way up to profitability.
            </p>
            <Link to="/register" className="btn-primary gap-2">
              Create Free Account <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
