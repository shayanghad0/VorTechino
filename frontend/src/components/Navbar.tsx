import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, Category } from '../lib/api'
import { Search, Menu, X, BookOpen, User, LogOut, Shield, ChevronDown, Bookmark } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [subjectsOpen, setSubjectsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjects, setSubjects] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setSubjects(res.categories || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-200">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-100 hidden sm:block">Trading Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/lessons" className="btn-ghost text-sm">Lessons</Link>

            <div className="relative" onMouseEnter={() => setSubjectsOpen(true)} onMouseLeave={() => setSubjectsOpen(false)}>
              <button className="btn-ghost text-sm flex items-center gap-1">
                Subjects <ChevronDown className={`w-3 h-3 transition-transform ${subjectsOpen ? 'rotate-180' : ''}`} />
              </button>
              {subjectsOpen && (
                <div className="absolute left-0 top-full mt-0 w-80 bg-surface-900 border border-surface-800 rounded-xl shadow-xl shadow-surface-950/50 py-2 animate-scale-in z-50">
                  {subjects.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-surface-500">No subjects yet</div>
                  ) : (
                    subjects.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="block px-4 py-3 hover:bg-surface-800 transition-colors"
                        onClick={() => setSubjectsOpen(false)}
                      >
                        <div className="font-medium text-surface-200 text-sm">{cat.name}</div>
                        {cat.description && (
                          <div className="text-xs text-surface-500 mt-0.5">{cat.description}</div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="w-64 pl-10 pr-4 py-2 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-surface-300 hidden sm:block">{user.username}</span>
                  <ChevronDown className="w-3 h-3 text-surface-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface-900 border border-surface-800 rounded-xl shadow-xl shadow-surface-950/50 py-1 animate-scale-in z-50">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-surface-300 hover:bg-surface-800" onClick={() => setProfileOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/bookmarks" className="flex items-center gap-2 px-4 py-2 text-sm text-surface-300 hover:bg-surface-800" onClick={() => setProfileOpen(false)}>
                      <Bookmark className="w-4 h-4" /> Bookmarks
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-400 hover:bg-surface-800" onClick={() => setProfileOpen(false)}>
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="divider my-1" />
                    <button onClick={() => { logout(); setProfileOpen(false) }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-surface-800 w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-1.5">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-surface-400 hover:text-surface-200">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-800 bg-surface-950 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search lessons..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <Link to="/lessons" className="block px-4 py-2.5 text-surface-300 hover:bg-surface-800 rounded-lg" onClick={() => setMobileOpen(false)}>Lessons</Link>
            <div className="px-4 py-1 text-xs font-semibold text-surface-500 uppercase tracking-wider">Subjects</div>
            {subjects.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="block px-4 py-2.5 text-surface-300 hover:bg-surface-800 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
