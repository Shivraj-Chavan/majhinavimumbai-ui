// import {useState} from 'react'
// import { LuChevronDown, LuChevronRight,  } from "react-icons/lu"

// export default function SidebarItemWithSubmenu({ icon, title, children }) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <li>
//       <button
//         className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center">
//           <span className="mr-3">{icon}</span>
//           <span>{title}</span>
//         </div>
//         <span>{isOpen ? <LuChevronDown className="h-4 w-4" /> : <LuChevronRight className="h-4 w-4" />}</span>
//       </button>

//       {isOpen && <ul className="mt-1 space-y-1 pl-10">{children}</ul>}
//     </li>
//   )
// }




"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LuChevronDown } from "react-icons/lu";

export default function SidebarItemWithSubmenu({ icon, title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className={`sb-item sb-item--submenu ${isOpen ? "sb-item--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sb-item-icon">{icon}</span>
        <span className="sb-item-title">{title}</span>
        <span className={`sb-chevron ${isOpen ? "sb-chevron--open" : ""}`}>
          <LuChevronDown size={14} />
        </span>
      </button>

      <ul className={`sb-submenu ${isOpen ? "sb-submenu--open" : ""}`}>
        {children}
      </ul>
    </li>
  );
}