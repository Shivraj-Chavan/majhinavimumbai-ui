// SidebarMenu.jsx
import React from 'react'
import SidebarItem from "./SidebarItem"
import { LuUsers, LuSettings, LuMail } from "react-icons/lu"

export default function SidebarMenu() {
  return (
<div className="w-full h-screen px-4 py-6">
  <h2 className="text-lg font-bold text-gray-600 mb-4 ps-2">Admin Panel</h2>
  <ul className="space-y-2 overflow-hidden scrollbar-hide">
    <SidebarItem title="Create Users" href="/admin/users/addUsers" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="All Users" href="/admin/users" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="Verified Businesses" href="/admin/users/businessUsers" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="Pending Business Verification" href="/admin/users/pendingRequest" icon={<LuSettings className="h-5 w-5" />} />
    <SidebarItem title="Pending Business Update Request" href="/admin/users/pendingbusinessrequest" icon={<LuSettings className="h-5 w-5" />} />
    <SidebarItem title="Contact List" href="/admin/users/contactList" icon={<LuMail className="h-5 w-5" />} />
    <SidebarItem title="Review Delete Queries" href="/admin/users/reviewList" icon={<LuMail className="h-5 w-5" />} />
    <SidebarItem title="Enquiry To business" href="/admin/users/enquiryList" icon={<LuMail className="h-5 w-5" />} />
  </ul>
</div>

  )
}
    