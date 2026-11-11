import { Button } from '../ui/Button'

interface PaginationProps {
  page: number
  setPage: (page: number) => void
  totalPages: number
  totalItems: number
  pageSize: number
  label?: string
}

function pageRange(current: number, total: number): Array<number | string> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const result: Array<number | string> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) result.push('...')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < total - 1) result.push('...')
  result.push(total)
  return result
}

export function Pagination({ page, setPage, totalPages, totalItems, pageSize, label = 'Pagination' }: PaginationProps) {
  const start = Math.min((page - 1) * pageSize + 1, totalItems)
  const end = Math.min(page * pageSize, totalItems)
  const pages = pageRange(page, totalPages)

  const go = (target: number) => {
    const next = Math.min(Math.max(1, target), totalPages)
    if (next !== page) setPage(next)
  }

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-end gap-3" aria-label={label}>
      <p className="text-sm text-text-muted">
        Showing <span className="font-semibold text-text">{start}</span>{' – '}<span className="font-semibold text-text">{end}</span> of{' '}
        <span className="font-semibold text-text">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" disabled={page === 1} onClick={() => go(page - 1)} size="sm">
          Previous
        </Button>
        {pages.map((item) => (item === '...' ? (
          <span key="ellipsis" className="px-2 text-text-muted">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            disabled={item === page}
            onClick={() => go(item as number)}
            size="sm"
          >
            {item}
          </Button>
        )))}
        <Button variant="outline" disabled={page === totalPages} onClick={() => go(page + 1)} size="sm">
          Next
        </Button>
      </div>
    </nav>
  )
}