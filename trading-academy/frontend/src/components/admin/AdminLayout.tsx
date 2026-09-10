import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, MessageSquare, Users, Settings, Activity, BookOpen, ArrowLeft, FolderOpen } from 'lucide-react'

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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-100 mb-2">Access Denied</h1>
          <p className="text-surface-400 mb-6">You need admin privileges to access this area.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <aside className="w-64 bg-surface-900 border-r border-surface-800 flex flex-col fixed h-full">
        <div className="p-4 border-b border-surface-800">
          <Link to="/" className="flex items-center gap-2 text-surface-400 hover:text-surface-200 text-sm mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-surface-100">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20'
                    : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-surface-200">{user?.username}</p>
              <p className="text-xs text-surface-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
