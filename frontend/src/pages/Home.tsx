import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post, Category } from '../lib/api'
import { BookOpen, TrendingUp, Shield, Brain, Clock, ArrowRight, Star, Users, ChevronRight, Zap } from 'lucide-react'

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/8 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-accent-500/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              Free Trading Education
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-50 mb-6 animate-slide-up text-balance tracking-tight">
              Master the Art of{' '}
              <span className="gradient-text">Trading</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-400 mb-10 animate-slide-up leading-relaxed max-w-2xl mx-auto">
              Comprehensive lessons from beginner to advanced. Learn technical analysis, price action, risk management, and trading psychology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/lessons" className="btn-primary !px-8 !py-3.5 text-base">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              {categories.length > 0 && (
                <Link to={`/category/${categories[0].slug}`} className="btn-secondary !px-8 !py-3.5 text-base">
                  {categories[0].name} Guide
                </Link>
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
              <div key={label} className="text-center p-5 rounded-2xl bg-surface-900/30 border border-surface-800/30">
                <Icon className="w-5 h-5 text-primary-400 mx-auto mb-2.5" />
                <p className="text-sm font-semibold text-surface-100">{label}</p>
                <p className="text-xs text-surface-500 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-surface-50">Browse by Subject</h2>
            <p className="text-surface-400 mt-1">Find lessons that match your skill level</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.slug] || BookOpen
            const color = colorMap[cat.slug] || fallbackColors[i % fallbackColors.length]
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="card card-hover group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-surface-50 mb-1.5">{cat.name}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{cat.description}</p>
                <div className="flex items-center gap-1 text-primary-400 text-sm mt-4 group-hover:gap-2 transition-all duration-300">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-surface-50">Latest Lessons</h2>
            <p className="text-surface-400 mt-1">Fresh content to boost your skills</p>
          </div>
          <Link to="/lessons" className="btn-ghost text-sm">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-surface-700 mx-auto mb-4" />
            <p className="text-surface-400">No lessons published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/lessons/${post.slug}`}
                className="card card-hover group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-primary">{post.category}</span>
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="badge-surface">{tag}</span>
                  ))}
                </div>
                <h3 className="font-semibold text-surface-50 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-surface-400 line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span>{post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card bg-gradient-to-br from-primary-600/10 via-surface-900/60 to-accent-600/10 border-primary-500/20 text-center py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-surface-50 mb-3">Ready to Start Trading?</h2>
            <p className="text-surface-400 mb-8 max-w-lg mx-auto">
              Join our community and get access to all lessons. Start with the basics and work your way up.
            </p>
            <Link to="/register" className="btn-primary !px-8 !py-3.5 text-base">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
