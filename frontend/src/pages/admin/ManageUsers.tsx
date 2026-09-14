import { useState, useEffect } from 'react'
import { api, User } from '../../lib/api'
import { Shield, ShieldOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'

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
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Manage Users</h1>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="glass-card p-4 flex items-center gap-4">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
                  {u.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{u.username}</span>
                  <Badge variant="outline" className={`text-xs ${u.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                    {u.role}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">{u.email}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleRole(u.id, u.role === 'admin' ? 'user' : 'admin')} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Toggle role">
                  {u.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">
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
