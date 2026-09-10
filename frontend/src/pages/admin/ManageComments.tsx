import { useState, useEffect } from 'react'
import { api, Comment } from '../../lib/api'
import { Check, X, Trash2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

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
      <h1 className="text-2xl font-bold text-surface-100 mb-6">Manage Comments</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-surface-800 text-surface-400 hover:text-surface-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface-900 rounded-xl animate-pulse" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-400">No comments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="card !p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-surface-200">{c.username}</span>
                    <span className={`badge text-xs ${c.status === 'approved' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : c.status === 'rejected' ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-surface-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-surface-300 line-clamp-2">{c.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status !== 'approved' && (
                    <button onClick={() => handleStatus(c.id, 'approved')} className="btn-ghost !px-2 text-green-400 hover:text-green-300" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {c.status !== 'rejected' && (
                    <button onClick={() => handleStatus(c.id, 'rejected')} className="btn-ghost !px-2 text-yellow-400 hover:text-yellow-300" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(c.id)} className="btn-ghost !px-2 text-red-400 hover:text-red-300" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
