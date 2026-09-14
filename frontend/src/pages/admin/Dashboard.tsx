import { useState, useEffect } from 'react'
import { api, Post, User, Comment, ActivityLog } from '../../lib/api'
import { MessageSquare, Users, Eye, FileText, Clock } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, users: 0, comments: 0, views: 0 })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<{ posts: Post[]; total: number }>('/posts?limit=5'),
      api.get<{ users: User[] }>('/users'),
      api.get<{ comments: Comment[] }>('/comments'),
      api.get<{ logs: ActivityLog[] }>('/activity?limit=5'),
    ]).then(([postsRes, usersRes, commentsRes, activityRes]) => {
      const totalViews = postsRes.posts.reduce((sum, p) => sum + (p.viewCount || 0), 0)
      setStats({ posts: postsRes.total, users: usersRes.users?.length || 0, comments: commentsRes.comments?.length || 0, views: totalViews })
      setRecentPosts(postsRes.posts)
      setRecentActivity(activityRes.logs || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Lessons', value: stats.posts, icon: FileText, color: 'from-primary to-primary-600' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-accent to-accent-600' },
    { label: 'Comments', value: stats.comments, icon: MessageSquare, color: 'from-gold-500 to-gold-600' },
    { label: 'Total Views', value: stats.views, icon: Eye, color: 'from-danger-500 to-danger-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{loading ? '...' : c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Lessons</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground">{log.username} &middot; {new Date(log.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
