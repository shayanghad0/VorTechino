import { useState, useEffect } from 'react'
import { api, Category } from '../../lib/api'
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'

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
        <h1 className="text-2xl font-bold text-foreground">Manage Subjects</h1>
        <Button onClick={() => { setAdding(true); setEditing(null); setName(''); setDescription('') }} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      {(adding || editing) && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">{editing ? 'Edit Subject' : 'New Subject'}</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Technical Analysis" autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of this subject" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => editing ? handleUpdate(editing) : handleAdd()} className="gap-1.5">
                  <Save className="w-4 h-4" /> {editing ? 'Update' : 'Add'}
                </Button>
                <Button size="sm" variant="ghost" onClick={cancel} className="gap-1.5"><X className="w-4 h-4" /> Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No subjects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <Card key={cat.id} className="!p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.description || 'No description'}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">slug: {cat.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(cat)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id, cat.name)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
