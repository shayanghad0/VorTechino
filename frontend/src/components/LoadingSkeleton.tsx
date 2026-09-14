export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 bg-white/[0.02] border-b border-white/5 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse shimmer bg-white/[0.02] border border-white/5" />)}
        </div>
      </div>
    </div>
  )
}
