import { EmptyState } from '../ui/EmptyState'
import { UserRow } from './UserRow'
import type { User } from '@/types'

interface UserTableProps {
  users: User[]
  onClearFilters?: () => void
}

export function UserTable({ users, onClearFilters }: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try adjusting your search or sorting."
        action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : undefined}
      />
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface shadow-sm overflow-x-auto">
      <table className="min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-hover">
            <th className="h-11 px-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Avatar</th>
            <th className="h-11 px-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Name</th>
            <th className="h-11 px-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Email</th>
            <th className="h-11 px-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Department</th>
            <th className="h-11 px-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Company</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}