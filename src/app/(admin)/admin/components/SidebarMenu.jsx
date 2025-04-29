import React from 'react'
import SidebarItem from "./SidebarItem"
import SidebarItemWithSubmenu from './SidebarItemWithSubmenu'
import SidebarSubItem from './SidebarSubItem'
import {  LuMenu,LuUsers, LuSettings, LuMail } from "react-icons/lu"

export default function SidebarMenu() {
  return (
    <div>
         <ul className="space-y-1">
              <SidebarItem icon={<LuSettings className="h-5 w-5" />} title="Dashboard" href="/dashboard" />
        
              <SidebarItemWithSubmenu icon={<LuSettings className="h-5 w-5" />} title="Analytics">
                <SidebarSubItem title="Overview" href="/analytics/overview" />
                <SidebarSubItem title="Reports" href="/analytics/reports" />
                <SidebarSubItem title="Metrics" href="/analytics/metrics" />
              </SidebarItemWithSubmenu>
        
              <SidebarItemWithSubmenu icon={<LuUsers className="h-5 w-5" />} title="Users">
              <SidebarSubItem title="Business Users" href="/admin/users/businessUsers" />
                <SidebarSubItem title="Users" href="/admin/users/users" />
                <SidebarSubItem title="User Activity" href="/users/activity" />
              </SidebarItemWithSubmenu>
        
              <SidebarItemWithSubmenu icon={<LuMail className="h-5 w-5" />} title="Messages">
                <SidebarSubItem title="Inbox" href="/messages/inbox" />
                <SidebarSubItem title="Sent" href="/messages/sent" />
                <SidebarSubItem title="Drafts" href="/messages/drafts" />
              </SidebarItemWithSubmenu>
        
              <SidebarItem icon={<LuSettings className="h-5 w-5" />} title="Settings" href="/settings" />
            </ul>
    </div>
  )
}
