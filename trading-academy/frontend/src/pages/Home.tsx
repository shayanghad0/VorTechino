import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post } from '../lib/api'
import { BookOpen, TrendingUp, Shield, Brain, Clock, ArrowRight, Star, Users, ChevronRight } from 'lucide-react'

const categories = [
  { name: 'Beginner', slug: 'beginner', icon: BookOpen, color: 'from-blue-500 to-blue-600', desc: 'Start your trading journey' },
  { name: 'Price Action', slug: 'price-action', icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', desc: 'Read the market like a pro' },
  { name: 'Psychology', slug: 'psychology', icon: Brain, color: 'from-purple-500 to-purple-600', desc: 'Master your emotions' },
  { name: 'Risk Management', slug: 'risk-management', icon: Shield, color: 'from-amber-500 to-amber-600', desc: 'Protect your capital' },
]

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ posts: Post[]; total: number }>('/posts?limit=6&published=true')
      .then(res => setPosts(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 text-sm mb-6 animate-fade-in">
              <TrendingUp className="w-3.5 h-3.5" />
              Free Trading Education
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-100 mb-6 animate-slide-up text-balance">
              Master the Art of{' '}
              <span className="gradient-text">Trading</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-400 mb-8 animate-slide-up leading-relaxed">
              Comprehensive lessons from beginner to advanced. Learn technical analysis, price action, risk management, and trading psychology.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
              <Link to="/lessons" className="btn-primary !px-8 !py-3 text-base">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/category/beginner" className="btn-secondary !px-8 !py-3 text-base">
                Beginner Guide
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
            {[
              { icon: BookOpen, label: '50+ Lessons', value: 'Comprehensive' },
              { icon: Users, label: 'Community', value: 'Active' },
              { icon: Star, label: 'Quality', value: 'Expert-Led' },
              { icon: Clock, label: 'Updated', value: 'Weekly' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4">
                <Icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-surface-200">{label}</p>
                <p className="text-xs text-surface-500">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-100">Browse by Category</h2>
            <p className="text-surface-400 mt-1">Find lessons that match your skill level</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="card card-hover group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-surface-100 mb-1">{cat.name}</h3>
              <p className="text-sm text-surface-400">{cat.desc}</p>
              <div className="flex items-center gap-1 text-primary-400 text-sm mt-3 group-hover:gap-2 transition-all duration-200">
                Explore <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-100">Latest Lessons</h2>
            <p className="text-surface-400 mt-1">Fresh content to boost your skills</p>
          </div>
          <Link to="/lessons" className="btn-ghost text-sm">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-surface-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-surface-600 mx-auto mb-4" />
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
                <h3 className="font-semibold text-surface-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-surface-400 line-clamp-2 mb-4">{post.description}</p>
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
        <div className="card bg-gradient-to-br from-primary-600/10 to-accent-600/10 border-primary-600/20 text-center py-12">
          <h2 className="text-2xl font-bold text-surface-100 mb-3">Ready to Start Trading?</h2>
          <p className="text-surface-400 mb-6 max-w-lg mx-auto">
            Join our community and get access to all lessons. Start with the basics and work your way up.
          </p>
          <Link to="/register" className="btn-primary !px-8 !py-3">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
