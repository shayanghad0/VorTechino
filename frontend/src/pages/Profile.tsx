import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, Post } from '../lib/api'
import { User, Mail, Calendar, BookOpen } from 'lucide-react'

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
        <div className="text-center">
          <h2 className="text-xl font-bold text-surface-50 mb-2">Please login</h2>
          <Link to="/login" className="text-primary-400 hover:underline">Go to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-lg shadow-primary-500/20">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-50">{user.username}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              <span className="badge-primary">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-surface-50 mb-4">Recent Activity</h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-400">No activity yet. Start exploring lessons!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(post => (
            <Link key={post.id} to={`/lessons/${post.slug}`} className="card card-hover block">
              <h3 className="font-medium text-surface-50 hover:text-primary-400 transition-colors">{post.title}</h3>
              <p className="text-sm text-surface-400 mt-1 line-clamp-1">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
