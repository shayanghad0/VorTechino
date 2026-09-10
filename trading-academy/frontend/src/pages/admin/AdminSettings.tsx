import { useState, useEffect } from 'react'
import { api, Settings } from '../../lib/api'
import { Save, Settings as SettingsIcon } from 'lucide-react'
import toast from 'react-hot-toast'

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

  if (loading) return <div className="h-64 bg-surface-900 rounded-xl animate-pulse" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-100">Settings</h1>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="card space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Site Name</label>
          <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Site Description</label>
          <textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} className="input min-h-[80px] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Posts Per Page</label>
          <input type="number" value={settings.postsPerPage} onChange={e => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) || 12 })} className="input w-32" />
        </div>
        <div className="space-y-3">
          {[
            { key: 'darkMode' as const, label: 'Dark Mode (Default)' },
            { key: 'allowComments' as const, label: 'Allow Comments' },
            { key: 'requireApproval' as const, label: 'Require Comment Approval' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings[key] as boolean} onChange={e => setSettings({ ...settings, [key]: e.target.checked })} className="rounded" />
              <span className="text-sm text-surface-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
