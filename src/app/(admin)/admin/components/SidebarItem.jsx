import React from 'react'
import { usePathname } from "next/navigation"
import Link from 'next/link'
export default function SidebarItem({ icon, title, href }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
          isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{title}</span>
      </Link>
    </li>
  )
}
