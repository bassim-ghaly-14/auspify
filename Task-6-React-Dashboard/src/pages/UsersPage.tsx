import { useEffect, useMemo, useState } from 'react'
import { useRegisterRefresh } from '@/store/dataRefresh'
import { useUsers } from '@/features/users/useUsers'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageLoader } from '@/components/ui/PageLoader'
import { UserFilters } from '@/components/users/UserFilters'
import { UserTable } from '@/components/users/UserTable'
import { Pagination } from '@/components/pagination/Pagination'
import type { User } from '@/types'
import type { UserSort } from '@/components/users/UserFilters'

const PAGE_SIZE = 10

function sortComparator(sort: UserSort) {
  return (a: User, b: User) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
    if (sort === 'name-desc') return nameB.localeCompare(nameA)
    return nameA.localeCompare(nameB)
  }
}

export function UsersPage() {
  const { data: users, loading, error, retry } = useUsers()
  useRegisterRefresh('users', retry)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<UserSort>('name-asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    const base = (users ?? []).filter(
      (user) =>
        !query ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    )
    const list = [...base].sort(sortComparator(sort))
    return list
  }, [users, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Keep the current page within range when filters shrink the result set.
  useEffect(() => {
    // Keeps pagination in range when the filtered result set shrinks.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages) setPage(totalPages)
  }, [filtered, page, totalPages])

  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <PageLoader message="Loading users…" />
  if (error) return <ErrorState message={error} onRetry={retry} />

  const clearFilters = () => {
    setSearch('')
    setSort('name-asc')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text">Users</h1>
        <p className="text-sm text-text-muted">
          Demo user accounts from the DummyJSON Users API. No sensitive personal data is displayed.
        </p>
      </div>

      <UserFilters search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

      <div className="mt-4">
        <p className="text-sm text-text-muted">
          {filtered.length} user{filtered.length !== 1 ? 's' : ''} matching your filters.
        </p>
      </div>

      <UserTable users={current} onClearFilters={clearFilters} />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        label="User pagination"
      />
    </div>
  )
}