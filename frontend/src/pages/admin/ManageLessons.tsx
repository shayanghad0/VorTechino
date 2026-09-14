import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Post } from '../../lib/api'
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

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
        <h1 className="text-2xl font-bold text-foreground">Manage Lessons</h1>
        <Button asChild>
          <Link to="/admin/lessons/new" className="gap-1.5"><Plus className="w-4 h-4" /> New Lesson</Link>
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lessons..." className="pl-10" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Price Action">Price Action</SelectItem>
            <SelectItem value="Psychology">Psychology</SelectItem>
            <SelectItem value="Risk Management">Risk Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse shimmer" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No lessons found</p>
          <Button asChild><Link to="/admin/lessons/new">Create First Lesson</Link></Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <Card key={post.id} className="!p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <Badge variant={post.published ? 'default' : 'outline'} className="text-xs">
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{post.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTogglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'}>
                    {post.published ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/admin/lessons/edit/${post.id}`}><Edit className="w-4 h-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(post.id, post.title)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
