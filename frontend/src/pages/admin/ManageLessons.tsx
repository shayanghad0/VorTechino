import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post } from '../../lib/api'
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

export default function ManageLessons() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const loadPosts = () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (category !== 'All') params.set('category', category)
    if (search) params.set('search', search)
    api.get<{ posts: Post[] }>(`/posts?${params}`)
      .then(res => setPosts(res.posts))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [category, search])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await api.delete(`/posts/${id}`)
      toast.success('Deleted')
      loadPosts()
    } catch { toast.error('Failed to delete') }
  }

  const handleTogglePublish = async (post: Post) => {
    try {
      await api.put(`/posts/${post.id}`, { published: !post.published })
      toast.success(post.published ? 'Unpublished' : 'Published')
      loadPosts()
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Manage Lessons</h1>
        <Link to="/admin/lessons/new" className="btn-primary !py-2 !px-5 gap-1.5">
          <Plus className="w-4 h-4" /> New Lesson
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[rgba(11,17,32,0.6)] border border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[rgba(11,17,32,0.6)] border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Beginner">Beginner</option>
          <option value="Price Action">Price Action</option>
          <option value="Psychology">Psychology</option>
          <option value="Risk Management">Risk Management</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 rounded-xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">No lessons found</p>
          <Link to="/admin/lessons/new" className="btn-primary inline-flex">Create First Lesson</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-slate-200 truncate">{post.title}</h3>
                  <Badge variant="secondary" className="text-xs bg-white/5 text-slate-400 border-white/10">{post.category}</Badge>
                  <Badge variant="outline" className={`text-xs ${post.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 truncate">{post.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleTogglePublish(post)} className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                  {post.published ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <Link to={`/admin/lessons/edit/${post.id}`} className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(post.id, post.title)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
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
