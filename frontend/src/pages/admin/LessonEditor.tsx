import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, Post, Category } from '../../lib/api'
import { Save, ArrowLeft, Eye, Maximize2, Minimize2, Bold, Italic, Code, List, Quote, Image, Link as LinkIcon, Table, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LessonEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Beginner')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.get<{ categories: Category[] }>('/categories')
      .then(res => setCategories(res.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (id) {
      api.get<{ post: Post }>(`/posts/${id}`)
        .then(res => {
          const p = res.post
          setTitle(p.title)
          setSlug(p.slug)
          setDescription(p.description)
          setContent(p.content)
          setCategory(p.category)
          setTags(p.tags?.join(', ') || '')
          setPublished(p.published)
        })
        .catch(() => toast.error('Failed to load post'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEditing) setSlug(generateSlug(val))
  }

  const insertMarkdown = (prefix: string, suffix = '') => {
    const el = document.getElementById('editor') as HTMLTextAreaElement
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.substring(start, end)
    const newText = content.substring(0, start) + prefix + selected + suffix + content.substring(end)
    setContent(newText)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return toast.error('Title and content required')
    setSaving(true)
    try {
      const body = { title, slug, description, content, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean), published }
      if (isEditing) {
        await api.put(`/posts/${id}`, body)
        toast.success('Updated!')
      } else {
        const res = await api.post<{ post: Post }>('/posts', body)
        toast.success('Created!')
        navigate(`/admin/lessons/edit/${res.post.id}`)
      }
    } catch (e: any) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readTime = Math.ceil(wordCount / 200)

  if (loading) return <div className="h-64 bg-surface-900/40 rounded-2xl animate-pulse shimmer" />

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/lessons')} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
          <h1 className="text-xl font-bold text-surface-50">{isEditing ? 'Edit Lesson' : 'New Lesson'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">{wordCount} words &middot; {readTime} min read</span>
          <button onClick={() => setPreview(!preview)} className="btn-ghost text-sm">
            <Eye className="w-4 h-4" /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => setFullscreen(!fullscreen)} className="btn-ghost">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button onClick={handleSave} className="btn-primary text-sm" disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${fullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} flex-1 min-h-0`}>
        <div className="flex flex-col gap-3">
          <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Lesson title..." className="input text-lg font-semibold" />
          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-slug" className="input text-sm" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." className="input text-sm min-h-[60px] resize-none" />

          <div className="flex gap-2">
            <select value={category} onChange={e => setCategory(e.target.value)} className="input flex-1">
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              {categories.length === 0 && <option>Beginner</option>}
            </select>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="input flex-1" />
            <label className="flex items-center gap-2 px-3 bg-surface-800/40 border border-surface-800/40 rounded-xl cursor-pointer">
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded" />
              <span className="text-sm text-surface-300">Published</span>
            </label>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-800/40 rounded-xl border border-surface-800/40">
            {[
              { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
              { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
              { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Code' },
              { icon: List, action: () => insertMarkdown('- '), title: 'List' },
              { icon: Quote, action: () => insertMarkdown('> '), title: 'Quote' },
              { icon: LinkIcon, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
              { icon: Image, action: () => insertMarkdown('![alt](', ')'), title: 'Image' },
              { icon: Table, action: () => insertMarkdown('\n| Col1 | Col2 |\n|------|------|\n| ', ' | data |\n'), title: 'Table' },
              { icon: AlertTriangle, action: () => insertMarkdown('\n> **Note:** ', '\n'), title: 'Alert' },
            ].map(({ icon: Icon, action, title }) => (
              <button key={title} onClick={action} className="p-2 text-surface-400 hover:text-surface-200 hover:bg-surface-700/40 rounded-lg transition-colors" title={title}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <textarea
            id="editor"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your markdown content here..."
            className="input flex-1 min-h-[400px] font-mono text-sm resize-none leading-relaxed"
          />
        </div>

        {!fullscreen && (
          <div className="border border-surface-800/50 rounded-2xl overflow-auto bg-surface-900/40 p-6">
            {preview ? (
              <div className="prose-dark">
                <h1 className="text-2xl font-bold text-surface-50 mb-4">{title || 'Untitled'}</h1>
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
              </div>
            ) : (
              <div className="text-center text-surface-500 py-20">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Toggle preview to see your content</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
