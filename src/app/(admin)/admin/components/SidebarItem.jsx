// // SidebarItem.jsx
// import React, { useEffect, useState } from 'react'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import { apiGet } from '@/lib/apiClient'

// export default function SidebarItem({ icon, title, href, count, loading }) {
//   const pathname = usePathname()
//   const isActive = pathname === href


//   return (
//     <li>
//       <Link
//       // Left side
//         href={href}
//         className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-200
//           ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-800 hover:bg-blue-50'}
//         `}
//       >
//         <div className="flex items-center gap-2 text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis">
//         {icon}
//         <span className="truncate">{title}</span>
//       </div>

//       {/* Right side*/}
//       {!loading && count > 0 && (
//         <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//           {count} 
//         </span>
//       )}


//       </Link>
//     </li>
//   )
// }




"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SidebarItem({ icon, title, href, count, loading }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`sb-item ${isActive ? "sb-item--active" : ""}`}
      >
        {/* Active left bar */}
        {isActive && <span className="sb-active-bar" />}

        {/* Icon */}
        <span className={`sb-item-icon ${isActive ? "sb-item-icon--active" : ""}`}>
          {icon}
        </span>

        {/* Title */}
        <span className="sb-item-title">{title}</span>

        {/* Badge */}
        {!loading && count > 0 && (
          <span className="sb-badge">{count > 99 ? "99+" : count}</span>
        )}
      </Link>
    </li>
  );
}