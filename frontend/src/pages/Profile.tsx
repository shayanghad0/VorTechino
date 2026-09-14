import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, Post } from '../lib/api'
import { User, Mail, Calendar, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'

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
          <h2 className="text-xl font-bold text-foreground mb-2">Please login</h2>
          <Button variant="link" asChild><Link to="/login">Go to login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No activity yet. Start exploring lessons!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(post => (
            <Card key={post.id} className="hover:border-border/50 hover:bg-muted/30 transition-all duration-300">
              <Link to={`/lessons/${post.slug}`} className="block p-6">
                <h3 className="font-medium text-foreground hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
