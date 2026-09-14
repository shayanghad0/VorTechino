import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Category } from '../lib/api'
import { BookOpen, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const [subjects, setSubjects] = useState<Category[]>([])

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setSubjects(res.categories || []))
      .catch(() => {})
  }, [])

  return (
    <footer className="border-t border-surface-800/50 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-50 tracking-tight">Trading Academy</span>
            </Link>
            <p className="text-surface-400 text-sm max-w-md leading-relaxed">
              Learn trading from the ground up. Free lessons covering technical analysis, price action, psychology, and risk management.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">Subjects</h3>
            <div className="space-y-2.5">
              {subjects.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">{cat.name}</Link>
              ))}
              {subjects.length === 0 && (
                <>
                  <Link to="/category/beginner" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Beginner</Link>
                  <Link to="/category/price-action" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Price Action</Link>
                  <Link to="/category/psychology" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Psychology</Link>
                  <Link to="/category/risk-management" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Risk Management</Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">Community</h3>
            <div className="space-y-2.5">
              <Link to="/lessons" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">All Lessons</Link>
              <Link to="/search" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Search</Link>
              <a href="#" className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors"><Github className="w-4 h-4" /> GitHub</a>
              <a href="#" className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors"><Twitter className="w-4 h-4" /> Twitter</a>
            </div>
          </div>
        </div>
        <div className="divider mt-8 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-500">&copy; {new Date().getFullYear()} Trading Academy. All rights reserved.</p>
          <p className="text-xs text-surface-600">Built with passion for traders, by traders.</p>
        </div>
      </div>
    </footer>
  )
}
