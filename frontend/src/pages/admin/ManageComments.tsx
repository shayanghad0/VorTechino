import { useState, useEffect } from 'react'
import { api, Comment } from '../../lib/api'
import { Check, X, Trash2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

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
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Manage Comments</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-white/[0.02] text-slate-500 border border-white/5 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No comments found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map(c => (
            <div key={c.id} className="glass-card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-200">{c.username}</span>
                  <Badge variant="outline" className={`text-xs ${
                    c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    c.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-white/5 text-slate-500 border-white/10'
                  }`}>
                    {c.status}
                  </Badge>
                  <span className="text-xs text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{c.content}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {c.status !== 'approved' && (
                  <button onClick={() => handleStatus(c.id, 'approved')} className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {c.status !== 'rejected' && (
                  <button onClick={() => handleStatus(c.id, 'rejected')} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Reject">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
