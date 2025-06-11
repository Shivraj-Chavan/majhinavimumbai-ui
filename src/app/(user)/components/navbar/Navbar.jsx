"use client";

import Button from '../form/Button';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiX } from "react-icons/fi";
import PopUp from '../home/popUp';
import LocationDropdown from '../home/locationDropdown';
import SearchBar from '../home/searchBar';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/redux/slice/userSlice';
import { IoBusinessSharp } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';
import { RiLogoutBoxLine } from "react-icons/ri";
import { CiSquareQuestion } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import Payment from '../payment/payment';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { VscFeedback } from 'react-icons/vsc';

export function handleLoginSuccess (user, token) {
  
  const dispatch = useDispatch();
  localStorage.setItem("token", token);
  // localStorage.setItem("authRole", user.role);
  // localStorage.setItem("authUser", JSON.stringify(user));
  dispatch(login({ user, token, role: user.role }));
  setShowModal(false);
};

export default function Navbar() {
  const [location, setLocation] = useState("Navi-mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const user = useSelector((state) => state.user.user);
  const profileImage = user?.image || '/person.jpg';

  const dispatch = useDispatch();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem("token");
     // const role = localStorage.getItem("authRole");
    // const userStr = localStorage.getItem("authUser"); // Get the user from localStorage
    // const user = userStr ? JSON.parse(userStr) : null;

    if (token) {
      const user = { phone: "unknown" };
      dispatch(login({ user, token }));
    }
    setTimeout(() => setIsLoading(false), 1000); //loading
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authRole");
    // localStorage.removeItem("authUser");
    dispatch(logout());
    setOpen(false);
  };

  const handleNavigate = (path) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <nav className="bg-blue-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href='/' className="flex items-center">
          <Image src='/logo.png' alt="Logo" width={160} height={50} priority />
        </Link>

        {/* Location and searchbar */}

              {/* Location */}
              {/* <div className="flex flex-col sm:flex-row gap-0 border border-gray-100 shadow rounded-lg">
                <div className="flex-1">
                  <LocationDropdown
                    location={location}
                    setLocation={setLocation}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    dropdownRef={dropdownRef}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div> */}
        
                {/* Search */}
                {/* <div className="flex-2">
                  <SearchBar
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div> */}
  
        {/* Business Listing & Profile/Login */}
        <div className="hidden md:flex items-center space-x-4">
          <Payment />
  
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton width={130} height={36} borderRadius={8} />
              <Skeleton circle width={40} height={40} />
            </div>
          ) : (
            <>
              <Button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/businessRegister");
                  } else {
                    setAuthPurpose("business");
                    setShowModal(true);
                  }
                }}
                className="bg-orange-400 hover:bg-orange-500 text-sm uppercase cursor-pointer"
              >
                Business Listing
              </Button>
                {/* User Avatar or Login Button */}
              <div className="relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 bg-white border border-gray-300 rounded-full hover:shadow transition"
                    >
                      <Image
                        src={profileImage}
                        alt="User"
                        width={38}
                        height={38}
                        className="rounded-full object-cover"
                      />
                    </button>
  
                    {open && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <button
                              onClick={() => handleNavigate("/myBussiness")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <IoBusinessSharp className="text-md" />
                              My Business
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate('/profile')}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <FaUserCircle className="text-md" />
                              My Profile
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/myReviews")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <CiSquareQuestion className="text-md" />
                              My Reviews
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/myEnquiries")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <VscFeedback className="text-md" />
                              My Enquiries
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <RiLogoutBoxLine className="text-md" />
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-sm uppercase cursor-pointer"
                  >
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
  
        {/* Mobile Menu Toggle */}
        <Button
          className="block md:hidden text-2xl text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </Button>
      </div>
  
      {/* Mobile Menu */}
      {isMenuOpen && (
       <div className="w-full mt-5 md:hidden flex flex-col gap-5 px-4 pb-4">
         {/* Location & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex rounded-lg">
              <div className="w-1/2">
                <LocationDropdown
                  location={location}
                  setLocation={setLocation}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  dropdownRef={dropdownRef}
                  className="w-full border border-gray-300 px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="w-1/2">
                <SearchBar
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border-l-0 border border-gray-300 px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>
  
          {/* Buttons */}
          <div className="w-full flex justify-center">
            <div className="flex gap-3 items-center">
              {/* Business Listing Button */}
              <Button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/businessRegister");
                  } else {
                    setAuthPurpose("business");
                    setShowModal(true);
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-sm uppercase cursor-pointer"
              >
                Business Listing
              </Button>
                {/* User Avatar or Login Button */}
              <div className="relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-2 hover:shadow transition"
                    >
                      <Image
                        src="resto.jpg"
                        // alt="User"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm">User</span>
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
  
                    {open && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <button
                              onClick={() => handleNavigate("/my-business")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <IoBusinessSharp className="text-md" />
                              My Business
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/profile")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <FaUserCircle className="text-md" />
                              My Profile
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/requests")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <CiSquareQuestion className="text-md" />
                              My Reviews
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleNavigate("/myEnquiries")}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                            >
                              <VscFeedback className="text-md" />
                              My Enquiries
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <RiLogoutBoxLine className="text-md" />
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-sm uppercase cursor-pointer"
                  >
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Login / OTP Popup */}
      <PopUp showModal={showModal} setShowModal={setShowModal} authPurpose={authPurpose}/>
    </nav>
  );
  
}
