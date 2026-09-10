export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="h-16 bg-surface-900 border-b border-surface-800 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-surface-900 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-surface-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
