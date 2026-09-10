import { Link } from 'react-router-dom'
import { Bookmark, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Bookmarks() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-surface-100 mb-2">Please login</h2>
          <Link to="/login" className="text-primary-400 hover:underline">Go to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-surface-100 mb-8 flex items-center gap-3">
        <Bookmark className="w-7 h-7" /> Bookmarks
      </h1>
      <div className="text-center py-16">
        <Bookmark className="w-16 h-16 text-surface-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-surface-300 mb-2">Your bookmarks appear here</h3>
        <p className="text-surface-500 mb-6">Save lessons you want to read later by clicking the bookmark button</p>
        <Link to="/lessons" className="btn-primary">Browse Lessons</Link>
      </div>
    </div>
  )
}
