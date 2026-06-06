// import React, { useEffect, useState } from 'react';
// import SidebarItem from "./SidebarItem";
// import { LuUsers, LuSettings, LuMail } from "react-icons/lu";
// import { MdAttachMoney } from 'react-icons/md';
// import { apiGet } from '@/lib/apiClient';
// import { usePathname } from 'next/navigation';
// import { useSelector } from 'react-redux';

// export default function SidebarMenu() {
//   const pathname = usePathname();

//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Get role from Redux or fallback to localStorage
//   const reduxRole = useSelector((state) => state.user.role);
//   const role = reduxRole || (typeof window !== 'undefined' ? localStorage.getItem("authRole") : null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await apiGet('/dashboard');
//         setStats(res);
//       } catch (err) {
//         console.log("Error fetching stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [pathname]);

//   // Sidebar items
//   const allMenus = [
//     { title: "Create Users", href: "/admin/users/addUsers", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "All Users", href: "/admin/users", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "Verified Businesses", href: "/admin/users/businessUsers", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "Pending Business Verification", href: "/admin/users/pendingRequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingVerifications || 0 },
//     { title: "Pending Business Update Request", href: "/admin/users/pendingbusinessrequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingUpdates || 0 },
//     { title: "Contact List", href: "/admin/users/contactList", icon: <LuMail className="h-5 w-5" />, count: stats.unviewedContacts || 0 },
//     { title: "Sub-Admin Actions", href: "/admin/users/adminActions", icon: <LuMail className="h-5 w-5" />, count: stats.businessadminActions || 0 },
//     { title: "Review Delete Queries", href: "/admin/users/reviewList", icon: <LuMail className="h-5 w-5" /> },
//     { title: "Enquiry To Business", href: "/admin/users/enquiryList", icon: <LuMail className="h-5 w-5" /> },
//     { title: "Payment & Plans", href: "/admin/users/paymentandplans", icon: <MdAttachMoney className="h-5 w-5" /> },
//   ];

//   // Show limited menus for sub-admin
//   const subAdminMenus = [
//     { title: "Create Users", href: "/admin/users/addUsers", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "All Users", href: "/admin/users", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "Verified Businesses", href: "/admin/users/businessUsers", icon: <LuUsers className="h-5 w-5" /> },
//     { title: "Pending Business Verification", href: "/admin/users/pendingRequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingVerifications || 0 },
//     { title: "Pending Business Update Request", href: "/admin/users/pendingbusinessrequest", icon: <LuSettings className="h-5 w-5" />, count: stats.pendingUpdates || 0 },
//   ];

//   const menusToRender = role === "admin" ? allMenus : role === "sub-admin" ? subAdminMenus : [];

//   return (
//     <div className="w-full h-screen px-4 py-6 bg-red"> 
//       <h2 className="text-lg font-bold text-gray-600 mb-4 ps-2">Admin Panel</h2>
//       <ul className="space-y-2 overflow-hidden scrollbar-hide">
//         {menusToRender.map((item, index) => (
//           <SidebarItem key={index} {...item} loading={loading}/>
//         ))}
//       </ul>
//     </div>
//   );
// }







"use client";
import React, { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { apiGet } from "@/lib/apiClient";
import {
  LuUsers, LuSettings, LuMail, LuLayoutDashboard,
  LuBuilding2, LuClipboardCheck, LuRefreshCw,
  LuMessageSquare, LuStar, LuCreditCard, LuShield,
} from "react-icons/lu";

export default function SidebarMenu() {
  const pathname = usePathname();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const reduxRole = useSelector((state) => state.user.role);
  const role = reduxRole || (typeof window !== "undefined" ? localStorage.getItem("authRole") : null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiGet("/dashboard");
        setStats(res);
      } catch (err) {
        console.log("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [pathname]);

  const allMenus = [
    { title: "Create Users",                    href: "/admin/users/addUsers",                icon: <LuUsers size={17} /> },
    { title: "All Users",                        href: "/admin/users",                          icon: <LuLayoutDashboard size={17} /> },
    { title: "Verified Businesses",              href: "/admin/users/businessUsers",            icon: <LuBuilding2 size={17} /> },
    { title: "Pending Verification",             href: "/admin/users/pendingRequest",           icon: <LuClipboardCheck size={17} />, count: stats.pendingVerifications || 0 },
    { title: "Pending Update Request",           href: "/admin/users/pendingbusinessrequest",   icon: <LuRefreshCw size={17} />,      count: stats.pendingUpdates || 0 },
    { title: "Contact List",                     href: "/admin/users/contactList",              icon: <LuMail size={17} />,            count: stats.unviewedContacts || 0 },
    { title: "Sub-Admin Actions",                href: "/admin/users/adminActions",             icon: <LuShield size={17} />,          count: stats.businessadminActions || 0 },
    { title: "Sub-Admin Actions",                href: "/admin/users/adminActions2",             icon: <LuShield size={17} />,          count: stats.businessadminActions || 0 },
    { title: "Review Delete Queries",            href: "/admin/users/reviewList",               icon: <LuStar size={17} /> },
    { title: "Enquiry To Business",              href: "/admin/users/enquiryList",              icon: <LuMessageSquare size={17} /> },
     { title: "Payment & Plans",                  href: "/admin/users/paymentandplans",          icon: <LuCreditCard size={17} /> },
  ];

  const subAdminMenus = [
    { title: "Create Users",            href: "/admin/users/addUsers",              icon: <LuUsers size={17} /> },
    { title: "All Users",               href: "/admin/users",                        icon: <LuLayoutDashboard size={17} /> },
    { title: "Verified Businesses",     href: "/admin/users/businessUsers",          icon: <LuBuilding2 size={17} /> },
    { title: "Pending Verification",    href: "/admin/users/pendingRequest",         icon: <LuClipboardCheck size={17} />, count: stats.pendingVerifications || 0 },
    { title: "Pending Update Request",  href: "/admin/users/pendingbusinessrequest", icon: <LuRefreshCw size={17} />,      count: stats.pendingUpdates || 0 },
  ];

  const menusToRender =
    role === "admin" ? allMenus : role === "sub-admin" ? subAdminMenus : [];

  return (
    <>

<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .sb-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    border-right: 1px solid #e8ecf8;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* Soft top-right ambient tint */
  .sb-root::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -40px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(165,180,252,0.22) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .sb-header {
    position: relative;
    z-index: 1;
    padding: 20px 18px 14px;
    flex-shrink: 0;
  }

  .sb-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sb-brand-logo {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 10px rgba(99,102,241,0.28);
    flex-shrink: 0;
  }

  .sb-brand-logo svg {
    width: 17px;
    height: 17px;
    stroke: #fff;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .sb-brand-text {
    display: flex;
    flex-direction: column;
  }

  .sb-brand-name {
    font-size: 14px;
    font-weight: 700;
    color: #1e1b4b;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .sb-brand-sub {
    font-size: 10px;
    font-weight: 600;
    color: #818cf8;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Role Pill ── */
  .sb-role-wrap {
    margin-top: 10px;
  }

  .sb-role-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 20px;
    padding: 3px 10px 3px 7px;
    font-size: 11px;
    font-weight: 600;
    color: #4338ca;
    text-transform: capitalize;
  }

  .sb-role-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6366f1;
    animation: sb-pulse 2s ease-in-out infinite;
  }

  @keyframes sb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* ── Section Label ── */
  .sb-section-label {
    padding: 14px 18px 5px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a5b4fc;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  /* ── Nav ── */
  .sb-nav {
    flex: 1;
    overflow-y: auto;
    padding: 2px 10px 16px;
    position: relative;
    z-index: 1;
    scrollbar-width: none;
  }
  .sb-nav::-webkit-scrollbar { display: none; }

  .sb-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  /* ── Item ── */
  .sb-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 12.5px;
    font-weight: 500;
    color: #64748b;
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .sb-item:hover {
    background: #f0f3ff;
    color: #3730a3;
  }

  .sb-item--active {
    background: linear-gradient(90deg, #eef2ff, #f0f3ff) !important;
    color: #4338ca !important;
    font-weight: 600;
  }

  .sb-active-bar {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 55%;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #6366f1, #818cf8);
  }

  /* ── Icon ── */
  .sb-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: #f1f5f9;
    color: #94a3b8;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }

  .sb-item:hover .sb-item-icon {
    background: #e0e7ff;
    color: #6366f1;
  }

  .sb-item-icon--active {
    background: #e0e7ff !important;
    color: #6366f1 !important;
  }

  /* ── Title ── */
  .sb-item-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12.5px;
  }

  /* ── Badge ── */
  .sb-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: linear-gradient(135deg, #f87171, #ef4444);
    color: #fff;
    font-size: 9.5px;
    font-weight: 700;
    flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Submenu chevron ── */
  .sb-item--submenu { justify-content: flex-start; }
  .sb-chevron {
    margin-left: auto;
    color: #cbd5e1;
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }
  .sb-chevron--open { transform: rotate(180deg); color: #6366f1; }

  /* ── Submenu ── */
  .sb-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.28s ease, opacity 0.22s ease;
    opacity: 0;
  }
  .sb-submenu--open { max-height: 400px; opacity: 1; }
  .sb-submenu-inner {
    padding: 4px 0 4px 42px;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  /* ── Sub Item ── */
  .sb-subitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .sb-subitem:hover { background: #f0f3ff; color: #4338ca; }
  .sb-subitem--active { color: #4338ca; background: #eef2ff; }
  .sb-subitem-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.55;
    flex-shrink: 0;
  }
  .sb-subitem--active .sb-subitem-dot { opacity: 1; }

  /* ── Divider ── */
  .sb-divider {
    height: 1px;
    background: #eceef8;
    margin: 6px 2px;
  }

  /* ── Footer ── */
  .sb-footer {
    position: relative;
    z-index: 1;
    padding: 10px 16px;
    border-top: 1px solid #eceef8;
    background: linear-gradient(0deg, #f4f6ff, transparent);
    flex-shrink: 0;
  }
  .sb-footer-text {
    font-size: 10px;
    color: #c7d2fe;
    text-align: center;
    letter-spacing: 0.03em;
  }
`}</style>

      <div className="sb-root">
        {/* Header / Brand */}
        <div className="sb-header">
          <div className="sb-brand">
            <div className="sb-brand-logo">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="sb-brand-text">
              <span className="sb-brand-name">AdminHub</span>
              <span className="sb-brand-sub">Control Panel</span>
            </div>
          </div>
          {role && (
            <div className="sb-role-wrap">
              <span className="sb-role-pill">
                <span className="sb-role-dot" />
                {role}
              </span>
            </div>
          )}
        </div>

        {/* Section Label */}
        <div className="sb-section-label">Navigation</div>

        {/* Nav */}
        <nav className="sb-nav">
          <ul className="sb-list">
            {menusToRender.map((item, index) => (
              <SidebarItem key={index} {...item} loading={loading} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}