import { useState, useEffect } from 'react'
import { api, Comment } from '../../lib/api'
import { Check, X, Trash2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'

export default function ManageComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const loadComments = () => {
    setLoading(true)
    api.get<{ comments: Comment[] }>(`/comments?status=${filter}`)
      .then(res => setComments(res.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadComments() }, [filter])

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.put(`/comments/${id}`, { status })
      toast.success(`Comment ${status}`)
      loadComments()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    try {
      await api.delete(`/comments/${id}`)
      toast.success('Deleted')
      loadComments()
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Comments</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No comments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(c => (
            <Card key={c.id} className="!p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{c.username}</span>
                    <Badge variant={c.status === 'approved' ? 'default' : c.status === 'rejected' ? 'destructive' : 'secondary'} className="text-xs">
                      {c.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status !== 'approved' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleStatus(c.id, 'approved')} title="Approve">
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  {c.status !== 'rejected' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gold-500" onClick={() => handleStatus(c.id, 'rejected')} title="Reject">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)} title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
