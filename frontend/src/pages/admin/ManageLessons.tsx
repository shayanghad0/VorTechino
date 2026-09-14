import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post } from '../../lib/api'
import { Plus, Edit, Trash2, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-50">Manage Lessons</h1>
        <Link to="/admin/lessons/new" className="btn-primary">
          <Plus className="w-4 h-4" /> New Lesson
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lessons..." className="input pl-10" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input w-auto">
          <option value="All">All Categories</option>
          <option value="Beginner">Beginner</option>
          <option value="Price Action">Price Action</option>
          <option value="Psychology">Psychology</option>
          <option value="Risk Management">Risk Management</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-surface-400 mb-4">No lessons found</p>
          <Link to="/admin/lessons/new" className="btn-primary">Create First Lesson</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="card !p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-surface-50 truncate">{post.title}</h3>
                  <span className="badge-primary text-xs">{post.category}</span>
                  <span className={`badge text-xs ${post.published ? 'badge-primary' : 'badge-surface'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-surface-500 truncate">{post.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleTogglePublish(post)} className="btn-ghost !px-2 !py-1.5" title={post.published ? 'Unpublish' : 'Publish'}>
                  {post.published ? <ToggleRight className="w-5 h-5 text-primary-400" /> : <ToggleLeft className="w-5 h-5 text-surface-500" />}
                </button>
                <Link to={`/admin/lessons/edit/${post.id}`} className="btn-ghost !px-2 !py-1.5">
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(post.id, post.title)} className="btn-ghost !px-2 !py-1.5 text-danger-400 hover:text-danger-300">
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
