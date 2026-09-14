import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, MessageSquare, Users, Settings, Activity, BookOpen, ArrowLeft, FolderOpen } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this area.</p>
          <Button asChild><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-muted/50 backdrop-blur-xl border-r border-border flex flex-col fixed h-full z-40">
        <div className="p-4 border-b border-border">
          <Button variant="ghost" size="sm" asChild className="mb-3 text-muted-foreground hover:text-foreground">
            <Link to="/" className="gap-1.5"><ArrowLeft className="w-4 h-4" /> Back to site</Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Admin Panel</span>
          </div>
        </div>
        <ScrollArea className="flex-1 p-3">
          <nav className="space-y-1">
            {navItems.map(({ path, icon: Icon, label, exact }) => {
              const active = exact ? location.pathname === path : location.pathname.startsWith(path)
              return (
                <Link key={path} to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active ? 'bg-primary/10 text-primary font-medium'
                           : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8"><Outlet /></main>
    </div>
  )
}
