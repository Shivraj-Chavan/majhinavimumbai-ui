"use client";

import Image from "next/image";
import { FiPhoneCall, FiMenu, FiX, FiEye, FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/slice/userSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PopUp from "../home/popUp";
import { apiGet } from "@/lib/apiClient";
import { IoBusinessSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { CiLocationArrow1, CiSquareQuestion } from "react-icons/ci";
import { RiLogoutBoxLine } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import SearchBar from "../home/searchBar";
import LocationDropdown from "../home/locationDropdown";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  const profileImage = user?.image || "/person.jpg";

  const [showModal, setShowModal] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");
  const [websiteCount, setWebsiteCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false); // for both desktop and mobile profile dropdown
  const [showSearch, setShowSearch] = useState(false);
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const mobileMenuRef = useRef(null);
  const profileRef = useRef(null);
  const profileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const pathname = usePathname();
  // const searchRef = useRef(null);
  useEffect(() => {
    const query = searchParams.get("query");
    const locationValue = searchParams.get("location");
  
    if (query) {
      setSearchTerm(query);
    }
  
    if (locationValue) {
      setLocation(locationValue);
    }
  }, [searchParams]);
  

  // Fetch live views
  useEffect(() => {
    const fetchViews = async () => {
      const data = await apiGet("/count/webview");
      setWebsiteCount(data?.visitCount || 0);
    };
    fetchViews();
  }, []);

  // location and searchbar scroll logic
  //  useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 300) {
  //       setShowSearch(true);
  //     } else {
  //       setShowSearch(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    console.log("Current Path:", pathname); // Debugging

    // Always visible on search page
    if (pathname === "/search") {
      setShowSearch(true);
      return;
    }

    // Homepage 
    if (pathname === "/") {
      const handleScroll = () => {
        setShowSearch(window.scrollY > 300);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    setShowSearch(true);
  }, [pathname]);


  // Initialize user session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      const user = { phone: "unknown" };
      dispatch(login({ user, token }));
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }

      // Close mobile menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenu(false);
      }

      // Close location dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      // Close search suggestions dropdown (if you want this separate, use its own state)
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        // setShowSearchDropdown(false); //  safer than killing showSearch
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleBusinessClick = () => {
    if (isLoggedIn) {
      router.push("/businessRegister");
    } else {
      setAuthPurpose("business");
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    console.log("trigger");

    localStorage.clear();
    dispatch(logout());
    setOpenProfile(false);
    setMobileMenu(false);
    toast.success("You have logged out successfully!")
    router.push("/");
  };

  const handleNavigate = (path) => {
    console.log("Navigating to path ", path)
    router.push(path);
    setOpenProfile(false);
    setMobileMenu(false);
  };

  const handleLoginSuccess = (userObj, token) => {
    localStorage.setItem("token", token);
    dispatch(login({ user: userObj || { phone: "unknown" }, token }));
    setShowModal(false);
  };

  
  // Close dropdown if clicked outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target) &&
  //       searchRef.current &&
  //       !searchRef.current.contains(event.target)
  //     ) {
  //       setShowDropdown(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
  
    const handleScroll = () => {
      setShowDropdown(false); 
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []); 
  
  
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-90">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        {/* Desktop View  */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Left: Logo */}
          <a href="/" className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={160} height={50} priority />
          </a>

          {/* Compact & Clean Search Bar */}
          {showSearch && (
            <div className=" sm:flex items-center max-w-lg mx-auto gap-2 p-1 bg-white rounded-full shadow-md transition-transform duration-200 hover:scale-[1.01]">

              {/* Location Dropdown */}
              <div className="flex items-center border-r border-gray-300 pr-2">
                <LocationDropdown
                  location={location}
                  setLocation={setLocation}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  dropdownRef={dropdownRef}
                  className="focus:outline-none text-gray-700 font-medium hover:text-blue-500 transition-colors duration-200"
                />
              </div>

              {/* Search Input with Button */}
              <div className="flex-1 relative">
                <SearchBar  ref={searchDropdownRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-3 py-2 rounded-full border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 placeholder-gray-400 text-gray-800 transition-all duration-200"
                  placeholder="Search for services..."
                />

            {/* <button
              onClick={() => router.push(`/search?query=${searchTerm}`)}
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm shadow transition duration-300"
            >
              🔍
            </button> */}
              </div>

            </div>
          )}

          {/* Right: All elements */}
          <div className="flex items-center gap-3">
            {/* Phone */}
            <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
              <FiPhoneCall className="text-md" />
              <span>+91 91524 18196</span>
            </div>

            {/* Live Views */}
            <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Live Views: {websiteCount}</span>
            </div>

            {/* Add Business */}
            <button
              onClick={handleBusinessClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 uppercase cursor-pointer rounded-full text-sm shadow-md transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:translate-y-0"
            >
              + Add Business
            </button>

            {/* Login / Profile */}
            {!isLoggedIn ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm shadow-md transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:translate-y-0"
              >
                Login
              </button>
            ) : (
              <div className="relative  z-50" ref={profileRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenProfile((prev) => !prev);
                  }}
                  className="flex items-center gap-2 border border-gray-300 rounded-full p-1 hover:shadow bg-white"
                >
                  <Image
                    src={profileImage}
                    alt="User"
                    width={36}
                    height={36}
                    className="rounded-full object-cover transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-100 active:translate-y-0"
                  />
                </button>

                {/* Desktop dropdown */}
                {openProfile && (
                  <div ref={profileMenuRef} className="absolute right-0 mt-3 w-40 bg-gradient-to-tl from-green-100 via-white to-orange-100 rounded-xl shadow-xl ring-1 ring-gray-200 z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => handleNavigate("/mybussiness")}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50"
                        >
                          <IoBusinessSharp className="text-lg" /> My Business
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50"
                        >
                          <FaUserCircle className="text-lg" /> My Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("/myreviews")}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50"
                        >
                          <CiSquareQuestion className="text-lg" /> My Reviews
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("/myenquiries")}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50"
                        >
                          <VscFeedback className="text-lg" /> My Enquiries
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleLogout()}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <RiLogoutBoxLine className="text-lg" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= Mobile View ================= */}
        <div className="md:hidden relative ">
          {/* Top Row: Logo + Hamburger */}
          <div className="flex items-center justify-between">
            <a href="/">
              <Image src="/logo.png" alt="Logo" width={140} height={40} priority />
            </a>

            {/* Live Views */}
            <div className="flex items-center gap-1 text-gray-700">
              <FiEye className="text-lg text-blue-600" />
              <span className="text-sm font-medium">{websiteCount}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenu((prev) => !prev);
                setOpenProfile(false); // close profile dropdown when toggling
              }}
              className="text-2xl text-gray-700"
            >
              {mobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Dropdown Menu */}
          {mobileMenu && (
            <div
              ref={mobileMenuRef}
              className="top-full left-0 right-0 w-full bg-white p-3 z-50"
            >
              {/* Phone Number (Above Search Bar) */}
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center text-green-600 font-semibold text-sm">
                  <FiPhoneCall className="mr-1 text-base" />
                  +91 91524 18196
                </div>
              </div>

              {/* Mobile Search Bar */}
              {/* <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 mb-4 transition-all duration-300 focus-within:shadow-md"> */}

              {/* Location Dropdown - compact */}
              <div className="flex items-center gap-2 rounded-full bg-white shadow-sm px-2 py-1 mb-4 transition-all duration-300 focus-within:shadow-md">

                {/* Location Icon + Dropdown */}
                <div className="flex items-center justify-center w-12 relative border-r border-gray-300 pr-2">
                  <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800 text-lg"
                  >
                    <CiLocationArrow1 className="text-gray-500 text-xl mr-2" />
                  </button>

                  {showDropdown && (
                    <div className="absolute top-10 left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <LocationDropdown
                        showDropdown={showDropdown}
                        setShowDropdown={setShowDropdown}
                        dropdownRef={dropdownRef}
                        className="focus:outline-none text-gray-800 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <SearchBar
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400"
                    placeholder="Search services..."
                  />

                  {/* Search Button */}
                  <button
                    onClick={() => router.push(`/search?query=${searchTerm}&location=${location}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow text-sm transition duration-300"
                  >
                    🔍
                  </button>
                </div>
              </div>

              {/* </div> */}

              {/* Add Business + Login/Profile */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={handleBusinessClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-full flex-1 text-sm font-semibold"
                >
                  + ADD BUSINESS
                </button>

                {!isLoggedIn ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full flex-1 text-sm font-semibold"
                  >
                    LOGIN
                  </button>
                ) : (
                  <div className="relative  z-50" ref={profileRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenProfile((prev) => !prev);
                      }}
                      className="flex items-center gap-2 border border-gray-300 rounded-full p-1 hover:shadow bg-white"
                    >
                      <Image
                        src={profileImage}
                        alt="User"
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    </button>

                    {/* Mobile Profile Dropdown */}
                    {openProfile && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-36 bg-gradient-to-tl from-green-100 via-white to-orange-100 rounded-xl shadow-xl ring-1 ring-gray-200 z-50">
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <button
                              onClick={() => handleNavigate("/mybussiness")}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            >
                              <IoBusinessSharp className="text-lg" /> My Business
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/profile")}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            >
                              <FaUserCircle className="text-lg" /> My Profile
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/myreviews")}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            >
                              <CiSquareQuestion className="text-lg" /> My Reviews
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleLogout()}
                              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              <RiLogoutBoxLine className="text-lg" /> Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <PopUp
        showModal={showModal}
        setShowModal={setShowModal}
        authPurpose={authPurpose}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}
