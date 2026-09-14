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
    <footer className="border-t border-white/5 bg-[#070A0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-tight">VorTechino</span>
            </Link>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              Master the markets with comprehensive trading education. From candlestick patterns to advanced risk management — everything you need to become a profitable trader.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 tracking-wide uppercase">Subjects</h3>
            <div className="space-y-3">
              {subjects.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-200">{cat.name}</Link>
              ))}
              {subjects.length === 0 && (
                <>
                  <Link to="/category/beginner" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Beginner</Link>
                  <Link to="/category/price-action" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Price Action</Link>
                  <Link to="/category/psychology" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Psychology</Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 tracking-wide uppercase">Resources</h3>
            <div className="space-y-3">
              <Link to="/lessons" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">All Lessons</Link>
              <Link to="/search" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Search</Link>
              <a href="#" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors"><Github className="w-4 h-4" /> GitHub</a>
              <a href="#" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors"><Twitter className="w-4 h-4" /> Twitter</a>
            </div>
          </div>
        </div>
        <div className="divider my-10" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} VorTechino. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built for traders, by traders.</p>
        </div>
      </div>
    </footer>
  )
}
