import { useDataFetch } from '@/hooks/useDataFetch'
import { fetchUsers } from './usersService'
import type { User } from '@/types'

export function useUsers() {
  return useDataFetch<User[]>(fetchUsers)
}