import { useState, useEffect } from 'react'
import { api, ActivityLog as ActivityLogEntry } from '../../lib/api'
import { Clock, User, FileText, MessageSquare, Star, Settings, Trash2 } from 'lucide-react'
import { Badge } from '../../components/ui/badge'

const iconMap: Record<string, typeof Clock> = {
  login: User, logout: User, lesson_created: FileText, lesson_updated: FileText,
  lesson_deleted: Trash2, comment_deleted: MessageSquare, rating_submitted: Star, error: Settings,
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ logs: ActivityLogEntry[] }>('/activity?limit=50')
      .then(res => setLogs(res.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Activity Log</h1>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 rounded-xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No activity recorded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => {
            const Icon = iconMap[log.action] || Clock
            return (
              <div key={log.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{log.details}</p>
                  <p className="text-xs text-slate-600">{log.username} &middot; {new Date(log.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 bg-white/5 text-slate-500 border-white/10">{log.action}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
