// SidebarItem.jsx
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function SidebarItem({ icon, title, href }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-200
          ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-800 hover:bg-blue-50'}
        `}
      >
        <div className="flex items-center gap-2 text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis">
        {icon}
        <span className="truncate">{title}</span>
      </div>

      </Link>
    </li>
  )
}
