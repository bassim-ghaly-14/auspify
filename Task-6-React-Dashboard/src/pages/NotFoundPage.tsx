import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <h2 className="text-base font-semibold text-text">Page not found</h2>
      <p className="text-sm text-text-muted">The page you are looking for does not exist.</p>
      <Button variant="default" size="sm" onClick={() => navigate('/')}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to overview
      </Button>
    </div>
  )
}