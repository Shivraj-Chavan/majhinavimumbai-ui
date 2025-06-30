"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// import './../../globals.css'
import SidebarMenu from '@/app/(admin)/admin/components/SidebarMenu';
import {LuMenu, LuX, LuBell, LuSearch, LuUser, LuLogOut,} from "react-icons/lu";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/userSlice";
import PopUp from "@/app/(user)/components/home/contactPopup";
import Image from "next/image";
import CONFIG from './../../../../constance'
export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");
  const [userEmail, setUserEmail] = useState("");
const [token,setToken]=useState(null)
  const pathname = usePathname();
  const router = useRouter();

 useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
     router.push("/");
    } else {
     setToken(storedToken);
     }
    }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authRole");
    localStorage.removeItem("email");
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("authRole");
    const email = localStorage.getItem("email");
    if (token && role === "admin") {
      setIsLoggedIn(true);
      setUserEmail(email);
      setShowLoginPopup(false);
    } else {
      setIsLoggedIn(false);
      setShowLoginPopup(true);
      localStorage.clear();
      dispatch(logout());
      router.push("/");
    }
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return (
      <PopUp showModal={showLoginPopup} setShowModal={setShowLoginPopup} authPurpose={authPurpose}/>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            
              {/* <div className="h-8 w-8 rounded-md bg-blue-600" /> */}
              {/* <span className="ml-2 text-lg font-semibold">majhiNaviMumbai</span> */}
              <Link href='/admin' className="flex items-center p-4">
                <Image src='/logo.png' alt="Logo" width={160} height={50} priority />
                </Link>
            
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <LuX className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <SidebarMenu />
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="ml-2">
                <p className="text-sm font-medium">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button className="mr-4 md:hidden" onClick={() => setSidebarOpen(true)}>
              <LuMenu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block">
              {/* <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> */}
              {/* <input
                type="text"
                placeholder="Search..."
                className="h-9 rounded-md border border-gray-300 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              /> */}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* <button className="relative rounded-full p-1 hover:bg-gray-100">
              <LuBell className="h-6 w-6" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button> */}

            <div className="relative">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <LuUser className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="font-medium">ADMIN</p>
                    <p className="text-sm text-gray-500">{userEmail || "admin@example.com"}</p>
                  </div>
                  <div className="border-t py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LuLogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
