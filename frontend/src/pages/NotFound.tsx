import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="text-center animate-fade-up relative">
        <div className="text-[8rem] font-extrabold gradient-text mb-2 leading-none tracking-tighter">404</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  )
}
