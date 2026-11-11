import { Avatar } from '../ui/Avatar'
import type { User } from '@/types'

interface UserRowProps {
  user: User
}

export function UserRow({ user }: UserRowProps) {
  return (
    <tr className="border-b border-border hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors">
      <td className="p-3">
        <Avatar src={user.image} name={`${user.firstName} ${user.lastName}`} />
      </td>
      <td className="p-3 text-text font-medium">{user.firstName} {user.lastName}</td>
      <td className="p-3 text-text-secondary overflow-hidden whitespace-nowrap max-w-55 text-ellipsis">{user.email}</td>
      <td className="p-3 text-text-secondary">{user.company.department}</td>
      <td className="p-3 text-text-secondary max-w-55 overflow-hidden text-ellipsis whitespace-nowrap">{user.company.name}</td>
    </tr>
  )
}