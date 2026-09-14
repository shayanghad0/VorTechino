import { useState, useEffect } from 'react'
import { api, User } from '../../lib/api'
import { Users, Shield, ShieldOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = () => {
    setLoading(true)
    api.get<{ users: User[] }>('/users')
      .then(res => setUsers(res.users || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const handleRole = async (id: string, role: string) => {
    try {
      await api.put(`/users/${id}`, { role })
      toast.success('Updated')
      loadUsers()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('Deleted')
      loadUsers()
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-50 mb-6">Manage Users</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="card !p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-surface-200">{u.username}</span>
                  <span className={`badge text-xs ${u.role === 'admin' ? 'badge-primary' : 'badge-surface'}`}>
                    {u.role}
                  </span>
                </div>
                <p className="text-xs text-surface-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleRole(u.id, u.role === 'admin' ? 'user' : 'admin')} className="btn-ghost text-sm" title="Toggle role">
                  {u.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(u.id)} className="btn-ghost text-sm text-danger-400 hover:text-danger-300" title="Delete">
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
