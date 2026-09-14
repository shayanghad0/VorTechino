import { useState, useEffect } from 'react'
import { api, Category } from '../../lib/api'
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const load = () => {
    setLoading(true)
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setCategories(res.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return toast.error('Name required')
    try {
      await api.post('/categories', { name, description })
      toast.success('Category added')
      setName('')
      setDescription('')
      setAdding(false)
      load()
    } catch (e: any) { toast.error(e.message || 'Failed') }
  }

  const handleUpdate = async (id: string) => {
    if (!name.trim()) return toast.error('Name required')
    try {
      await api.put(`/categories/${id}`, { name, description })
      toast.success('Updated')
      setEditing(null)
      setName('')
      setDescription('')
      load()
    } catch (e: any) { toast.error(e.message || 'Failed') }
  }

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete "${catName}"?`)) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed') }
  }

  const startEdit = (cat: Category) => {
    setEditing(cat.id)
    setAdding(false)
    setName(cat.name)
    setDescription(cat.description)
  }

  const cancel = () => {
    setEditing(null)
    setAdding(false)
    setName('')
    setDescription('')
  }

  const inputCls = "!bg-[rgba(11,17,32,0.6)] !border-white/10 !rounded-xl focus:!border-emerald-500/50 focus:!ring-emerald-500/10 !text-slate-200 placeholder:!text-slate-600"

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Manage Subjects</h1>
        <button onClick={() => { setAdding(true); setEditing(null); setName(''); setDescription('') }} className="btn-primary !py-2 !px-5 gap-1.5">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {(adding || editing) && (
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold text-slate-100 mb-4">{editing ? 'Edit Subject' : 'New Subject'}</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Technical Analysis" autoFocus className={`w-full px-4 py-2.5 rounded-xl text-sm ${inputCls}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">Description</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of this subject" className={`w-full px-4 py-2.5 rounded-xl text-sm ${inputCls}`} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => editing ? handleUpdate(editing) : handleAdd()} className="btn-primary !py-2 !px-5 gap-1.5 !text-sm">
                <Save className="w-4 h-4" /> {editing ? 'Update' : 'Add'}
              </button>
              <button onClick={cancel} className="btn-ghost gap-1.5 !text-sm text-slate-400">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No subjects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-200">{cat.name}</h3>
                <p className="text-xs text-slate-600">{cat.description || 'No description'}</p>
                <p className="text-xs text-slate-700 mt-1">slug: {cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(cat)} className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
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
