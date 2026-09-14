import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, Post, Category } from '../../lib/api'
import { Save, ArrowLeft, Eye, Maximize2, Minimize2, Bold, Italic, Code, List, Quote, Image, Link as LinkIcon, Table, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

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

  if (loading) return <div className="h-64 bg-muted/30 rounded-xl animate-pulse shimmer" />

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/lessons')} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">{isEditing ? 'Edit Lesson' : 'New Lesson'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{wordCount} words &middot; {readTime} min read</span>
          <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)} className="gap-1.5">
            <Eye className="w-4 h-4" /> {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${fullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} flex-1 min-h-0`}>
        <div className="flex flex-col gap-3">
          <Input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Lesson title..." className="text-lg font-semibold" />
          <Input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-slug" className="text-sm" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." className="text-sm min-h-[60px] resize-none" />

          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
                {categories.length === 0 && <SelectItem value="Beginner">Beginner</SelectItem>}
              </SelectContent>
            </Select>
            <Input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="flex-1" />
            <div className="flex items-center gap-2 px-3 border border-input rounded-lg">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label className="text-sm cursor-pointer">Published</Label>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
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
              <Button key={title} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={action} title={title}>
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Textarea
            id="editor"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your markdown content here..."
            className="flex-1 min-h-[400px] font-mono text-sm resize-none leading-relaxed"
          />
        </div>

        {!fullscreen && (
          <div className="border border-border rounded-xl overflow-auto bg-muted/30 p-6">
            {preview ? (
              <div className="prose-dark">
                <h1 className="text-2xl font-bold text-foreground mb-4">{title || 'Untitled'}</h1>
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-20">
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
