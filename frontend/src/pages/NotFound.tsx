import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-9xl font-extrabold gradient-text mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-surface-50 mb-3">Page Not Found</h1>
        <p className="text-surface-400 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
