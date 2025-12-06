import React, { useEffect, useState } from 'react';
import SidebarItem from "./SidebarItem";
import { LuUsers, LuSettings, LuMail } from "react-icons/lu";
import { MdAttachMoney } from 'react-icons/md';
import { apiGet } from '@/lib/apiClient';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function SidebarMenu() {
  const pathname = usePathname();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Get role from Redux or fallback to localStorage
  const reduxRole = useSelector((state) => state.user.role);
  const role = reduxRole || (typeof window !== 'undefined' ? localStorage.getItem("authRole") : null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiGet('/dashboard');
        setStats(res);
      } catch (err) {
        console.log("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [pathname]);

  // Sidebar items
  const allMenus = [
    { title: "Create Users", href: "/admin/users/addUsers", icon: <LuUsers className="h-5 w-5" /> },
    { title: "All Users", href: "/admin/users", icon: <LuUsers className="h-5 w-5" /> },
    { title: "Verified Businesses", href: "/admin/users/businessUsers", icon: <LuUsers className="h-5 w-5" /> },
    { title: "Pending Business Verification", href: "/admin/users/pendingRequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingVerifications || 0 },
    { title: "Pending Business Update Request", href: "/admin/users/pendingbusinessrequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingUpdates || 0 },
    { title: "Contact List", href: "/admin/users/contactList", icon: <LuMail className="h-5 w-5" />, count: stats.unviewedContacts || 0 },
    { title: "Sub-Admin Actions", href: "/admin/users/adminActions", icon: <LuMail className="h-5 w-5" />, count: stats.businessadminActions || 0 },
    { title: "Review Delete Queries", href: "/admin/users/reviewList", icon: <LuMail className="h-5 w-5" /> },
    { title: "Enquiry To Business", href: "/admin/users/enquiryList", icon: <LuMail className="h-5 w-5" />, count: stats.businessEnquiries || 0 },
    // { title: "Payment & Plans", href: "/admin/users/paymentandplans", icon: <MdAttachMoney className="h-5 w-5" /> },
  ];

  // Show limited menus for sub-admin
  const subAdminMenus = [
    { title: "Create Users", href: "/admin/users/addUsers", icon: <LuUsers className="h-5 w-5" /> },
    { title: "All Users", href: "/admin/users", icon: <LuUsers className="h-5 w-5" /> },
    { title: "Verified Businesses", href: "/admin/users/businessUsers", icon: <LuUsers className="h-5 w-5" /> },
    { title: "Pending Business Verification", href: "/admin/users/pendingRequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingVerifications || 0 },
    { title: "Pending Business Update Request", href: "/admin/users/pendingbusinessrequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingUpdates || 0 },
  ];

  const menusToRender = role === "admin" ? allMenus : role === "sub-admin" ? subAdminMenus : [];

  return (
    <div className="w-full h-screen px-4 py-6"> 
      <h2 className="text-lg font-bold text-gray-600 mb-4 ps-2">Admin Panel</h2>
      <ul className="space-y-2 overflow-hidden scrollbar-hide">
        {menusToRender.map((item, index) => (
          <SidebarItem key={index} {...item} loading={loading}/>
        ))}
      </ul>
    </div>
  );
}
