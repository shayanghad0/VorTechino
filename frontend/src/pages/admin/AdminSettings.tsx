import { useState, useEffect } from 'react'
import { api, Settings } from '../../lib/api'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent } from '../../components/ui/card'

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({ siteName: 'Trading Academy', siteDescription: 'Learn trading from beginners to advanced', darkMode: true, allowComments: true, requireApproval: true, postsPerPage: 12 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get<{ settings: Settings }>('/settings')
      .then(res => setSettings(res.settings))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', settings)
      toast.success('Settings saved!')
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="h-64 bg-muted/30 rounded-xl animate-pulse shimmer" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <Button onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Site Description</Label>
            <Textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} className="min-h-[80px] resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Posts Per Page</Label>
            <Input type="number" value={settings.postsPerPage} onChange={e => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) || 12 })} className="w-32" />
          </div>
          <div className="space-y-4">
            {[
              { key: 'darkMode' as const, label: 'Dark Mode (Default)' },
              { key: 'allowComments' as const, label: 'Allow Comments' },
              { key: 'requireApproval' as const, label: 'Require Comment Approval' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="cursor-pointer">{label}</Label>
                <Switch checked={settings[key] as boolean} onCheckedChange={checked => setSettings({ ...settings, [key]: checked })} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
