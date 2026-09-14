import { useState, useEffect } from 'react'
import { api, Settings } from '../../lib/api'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/button'

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

  if (loading) return <div className="h-64 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />

  const inputCls = "!bg-[rgba(11,17,32,0.6)] !border-white/10 !rounded-xl focus:!border-emerald-500/50 focus:!ring-emerald-500/10 !text-slate-200"

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <Button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-5 gap-1.5">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="glass-card p-6 max-w-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Site Name</label>
          <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className={`w-full px-4 py-3 rounded-xl text-sm ${inputCls}`} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Site Description</label>
          <textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} className={`w-full px-4 py-3 rounded-xl text-sm min-h-[80px] resize-none ${inputCls}`} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Posts Per Page</label>
          <input type="number" value={settings.postsPerPage} onChange={e => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) || 12 })} className={`w-32 px-4 py-3 rounded-xl text-sm ${inputCls}`} />
        </div>
        <div className="space-y-4">
          {[
            { key: 'darkMode' as const, label: 'Dark Mode (Default)' },
            { key: 'allowComments' as const, label: 'Allow Comments' },
            { key: 'requireApproval' as const, label: 'Require Comment Approval' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <label className="text-sm text-slate-300 font-medium cursor-pointer">{label}</label>
              <input
                type="checkbox"
                checked={settings[key] as boolean}
                onChange={e => setSettings({ ...settings, [key]: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
