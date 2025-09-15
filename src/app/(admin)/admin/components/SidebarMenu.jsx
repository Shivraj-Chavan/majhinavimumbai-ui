// SidebarMenu.jsx
import React, { useEffect, useState } from 'react'
import SidebarItem from "./SidebarItem"
import { LuUsers, LuSettings, LuMail } from "react-icons/lu"
import { apiGet } from '@/lib/apiClient';
import { usePathname } from 'next/navigation';
import { MdAttachMoney } from 'react-icons/md';

export default function SidebarMenu() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname()

  useEffect(() => {
    const fetchStats = async () =>{
      try {
        const res = await apiGet('/dashboard')
        setStats(res)
      } catch (error) {
        console.log("Error fetched stat:", err);  
      }
      finally{
        setLoading(false)
      }
    }
    fetchStats();
  },[pathname])


  return (
<div className="w-full h-screen px-4 py-6"> 
  <h2 className="text-lg font-bold text-gray-600 mb-4 ps-2">Admin Panel</h2>
  <ul className="space-y-2 overflow-hidden scrollbar-hide">
    <SidebarItem title="Create Users" href="/admin/users/addUsers" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="All Users" href="/admin/users" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="Verified Businesses" href="/admin/users/businessUsers" icon={<LuUsers className="h-5 w-5" />} />
    <SidebarItem title="Pending Business Verification" href="/admin/users/pendingRequest" icon={<LuSettings className="h-5 w-5" />} count={stats.pendingVerifications || 0} loading={false}  />
    <SidebarItem title="Pending Business Update Request" href="/admin/users/pendingbusinessrequest" icon={<LuSettings className="h-5 w-5" />} count={stats.pendingUpdates || 0} loading={false}/>
    <SidebarItem title="Contact List" href="/admin/users/contactList" icon={<LuMail className="h-5 w-5"/>} count={stats.unviewedContacts || 0} loading={false} />
    <SidebarItem title="Review Delete Queries" href="/admin/users/reviewList" icon={<LuMail className="h-5 w-5" />} loading={false}/>
    <SidebarItem title="Enquiry To business" href="/admin/users/enquiryList" icon={<LuMail className="h-5 w-5" />} count={stats.businessEnquiries || 0} loading={false}/>
  
  
   {/* <SidebarItem title="Payment & Plans" href="/admin/users/paymentandplans" icon={<MdAttachMoney className="h-5 w-5" />}/> */}

  </ul>
</div>

  )
}
    