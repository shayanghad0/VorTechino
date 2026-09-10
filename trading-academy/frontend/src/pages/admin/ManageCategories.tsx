import { useState, useEffect } from 'react'
import { api, Category } from '../../lib/api'
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-100">Manage Subjects</h1>
        <button onClick={() => { setAdding(true); setEditing(null); setName(''); setDescription('') }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {(adding || editing) && (
        <div className="card mb-6">
          <h3 className="font-semibold text-surface-100 mb-4">{editing ? 'Edit Subject' : 'New Subject'}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Technical Analysis" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Description</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input" placeholder="Short description of this subject" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => editing ? handleUpdate(editing) : handleAdd()} className="btn-primary text-sm">
                <Save className="w-4 h-4" /> {editing ? 'Update' : 'Add'}
              </button>
              <button onClick={cancel} className="btn-ghost text-sm"><X className="w-4 h-4" /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface-900 rounded-xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-surface-400">No subjects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="card !p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-surface-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-surface-100">{cat.name}</h3>
                <p className="text-xs text-surface-400">{cat.description || 'No description'}</p>
                <p className="text-xs text-surface-600 mt-1">slug: {cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(cat)} className="btn-ghost !px-2 !py-1.5"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="btn-ghost !px-2 !py-1.5 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
