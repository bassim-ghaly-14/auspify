import { fetchJson } from '@/services/apiClient'
import type { User } from '@/types'

export function fetchUsers(): Promise<User[]> {
  return fetchJson<{ users: User[] }>('/users?limit=100').then((response) => response.users)
}