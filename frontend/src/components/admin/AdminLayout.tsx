import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, MessageSquare, Users, Settings, Activity, BookOpen, ArrowLeft, FolderOpen } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/lessons', icon: FileText, label: 'Lessons' },
  { path: '/admin/subjects', icon: FolderOpen, label: 'Subjects' },
  { path: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/activity', icon: Activity, label: 'Activity Log' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You need admin privileges to access this area.</p>
          <Button asChild className="btn-primary"><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-[#0C1017] backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-40">
        <div className="p-4 border-b border-white/5">
          <Button variant="ghost" size="sm" asChild className="mb-3 text-slate-500 hover:text-slate-300 !justify-start gap-1.5">
            <Link to="/"><ArrowLeft className="w-4 h-4" /> Back to site</Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-slate-100">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path)
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                         : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-[11px] font-bold text-white">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-200">{user?.username}</p>
              <p className="text-xs text-slate-600">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8"><Outlet /></main>
    </div>
  )
}
