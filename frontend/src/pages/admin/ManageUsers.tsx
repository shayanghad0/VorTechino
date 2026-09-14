import { useState, useEffect } from 'react'
import { api, User } from '../../lib/api'
import { Shield, ShieldOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
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
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Users</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <Card key={u.id} className="!p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                    {u.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{u.username}</span>
                    <Badge variant={u.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                      {u.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleRole(u.id, u.role === 'admin' ? 'user' : 'admin')} title="Toggle role" className="gap-1">
                    {u.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(u.id)} title="Delete">
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
