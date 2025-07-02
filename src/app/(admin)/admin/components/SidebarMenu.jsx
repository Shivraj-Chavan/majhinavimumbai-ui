import React from 'react'
import SidebarItem from "./SidebarItem"
import SidebarItemWithSubmenu from './SidebarItemWithSubmenu'
import SidebarSubItem from './SidebarSubItem'
import {  LuMenu,LuUsers, LuSettings, LuMail } from "react-icons/lu"

export default function SidebarMenu() {
  return (
    <div>
         <ul className="space-y-1">
              {/* <SidebarItem icon={<LuSettings className="h-5 w-5" />} title="Dashboard" href="/dashboard" /> */}
        
              {/* <SidebarItemWithSubmenu icon={<LuSettings className="h-5 w-5" />} title="Analytics">
                <SidebarSubItem title="Overview" href="/analytics/overview" />
                <SidebarSubItem title="Reports" href="/analytics/reports" />
                <SidebarSubItem title="Metrics" href="/analytics/metrics" />
              </SidebarItemWithSubmenu> */}
        
              {/* <SidebarItemWithSubmenu icon={<LuUsers className="h-5 w-5" />} title="Users"> */}
                {/* <SidebarSubItem title="Business Users" href="/admin/users/businessUsers" />
                <SidebarSubItem title="Users" href="/admin/users" />
                <SidebarSubItem title="Pending Requests" href="/admin/users/pendingRequest" /> */}
              {/* </SidebarItemWithSubmenu> */}
        
              {/* <SidebarItemWithSubmenu icon={<LuMail className="h-5 w-5" />} title="Messages">
                <SidebarSubItem title="Inbox" href="/messages/inbox" />
                <SidebarSubItem title="Sent" href="/messages/sent" />
                <SidebarSubItem title="Drafts" href="/messages/drafts" />
              </SidebarItemWithSubmenu> */}
            {/* <h1 className="ms-3 font-bold flex items-center gap-2"> <LuUsers className="h-5 w-5" /> Users</h1> */}
            <SidebarItem title="Create Users " href="/admin/users/addUsers"/>
            <SidebarItem title="All Users" href="/admin/users" />
            <SidebarItem title="Verified Businesses" href="/admin/users/businessUsers" />
            <SidebarItem title="Pending Business Verification" href="/admin/users/pendingRequest" />
            <SidebarItem title="Pending Business Update Request" href="/admin/users/pendingbusinessrequest"/>
            <SidebarItem title="Contact List" href="/admin/users/contactList"/>
            <SidebarItem title="Review Delete Queries" href="/admin/users/reviewList"/>
            <SidebarItem title="Enquiry To business" href="/admin/users/enquiryList"/>
            


              {/* <SidebarItem icon={<LuSettings className="h-5 w-5" />} title="Settings" href="/settings" /> */}
            </ul>
    </div>
  )
}
