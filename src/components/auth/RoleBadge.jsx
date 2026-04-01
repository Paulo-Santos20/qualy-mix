// src/components/auth/RoleBadge.jsx
import { ROLE_LABELS, ROLE_COLORS } from '@/context/AuthContext'

export default function RoleBadge({ role, size = 'sm' }) {
  if (!role) return null
  const label = ROLE_LABELS[role] ?? role
  const color = ROLE_COLORS[role] ?? 'bg-gray-100 text-gray-600'
  const sz    = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-block font-black rounded-full uppercase tracking-wide ${color} ${sz}`}>
      {label}
    </span>
  )
}
