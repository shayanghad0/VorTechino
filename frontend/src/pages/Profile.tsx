import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, Post } from '../lib/api'
import { User, Mail, Calendar, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback } from '../components/ui/avatar'

export default function Profile() {
  const { user } = useAuth()
  const [history, setHistory] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api.get<{ posts: Post[] }>('/posts?limit=10&published=true')
      .then(res => setHistory(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <h2 className="text-xl font-bold text-slate-100 mb-2">Please login</h2>
          <Button variant="link" asChild><Link to="/login" className="text-emerald-400">Go to login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass-card p-6 mb-8 animate-fade-up">
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100">{user.username}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{user.role}</Badge>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-100 mb-4">Recent Activity</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No activity yet. Start exploring lessons!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((post, i) => (
            <Link key={post.id} to={`/lessons/${post.slug}`} className="group glass-card p-5 block animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <h3 className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
