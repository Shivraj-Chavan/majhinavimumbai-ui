import React from 'react'
import { usePathname } from "next/navigation"
import Link from "next/link"
export default function SidebarSubItem({ title, href }) {
    const pathname = usePathname()
    const isActive = pathname === href
  
    return (
      <li>
        <Link
          href={href}
          className={`block rounded-md px-3 py-2 text-sm ${
            isActive ? "font-medium text-blue-600" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {title}
        </Link>
      </li>
    )
  }
  
