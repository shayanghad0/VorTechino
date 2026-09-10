import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-surface-100 mb-2">Page Not Found</h1>
        <p className="text-surface-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
