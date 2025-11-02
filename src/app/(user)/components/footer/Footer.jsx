"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ContactPopup from "../home/contactPopup"
import PopUp from '../home/popUp';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");
  // const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    // Simulate loading delay, e.g. fetching config or something async
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton block helper
  const SkeletonBlock = ({ width = "full", height = "4" }) => (
    <div className={`bg-gray-300 animate-pulse rounded`} style={{ width: width === "full" ? "100%" : width, height: `${height}px`}} />
  );

  // your actual login state
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
     const token = localStorage.getItem("token");
    //  if (token && !isLoggedIn) {
    //    const user = { phone: "unknown" };
    //    dispatch(login({ user, token }));
    //  }
   }, [dispatch, isLoggedIn]);
  

  const handleBusinessClick = () => {
    if (isLoggedIn) {
      router.push("/businessRegister");
    } else {
      setAuthPurpose("business");
      setShowModal(true);
    }
  };

  const handleScroll = (e, section) => {
    e.preventDefault();
  
    if (pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        const headerOffset = 80; 
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      router.push(`/#${section}`);
    }
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      toast.info("Uh, you’re already logged in 😎");
    } else {
      setAuthPurpose("login");
      setShowModal(true);
    }
  };
  
  return (
    <footer className="relative overflow-hidden mt-10">
    {/* Tricolor Header Strip */}
    {/* <div className="flex h-1">
      <div className="flex-1 bg-orange-500"></div>
      <div className="flex-1 bg-white border-t border-b border-gray-300"></div>
      <div className="flex-1 bg-green-500"></div>
    </div> */}

    {/* Main Footer Content */}
    <div className="bg-gradient-to-b from-orange-50 via-white to-green-50 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 text-sm">

        {/* Column 1 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-orange-600 border-b-2 border-orange-200 pb-1">
            {loading ? <SkeletonBlock width={120} height={24} /> : "Company"}
          </h3>
          <ul className="space-y-2">
            {loading ? (
              <>
                <SkeletonBlock width={100} height={16} />
                <SkeletonBlock width={110} height={16} />
                <SkeletonBlock width={90} height={16} />
              </>
            ) : (
              <>
                <li><Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors duration-200">Home</Link></li>
                <li><Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors duration-200">About Us</Link></li>
                <li><span onClick={() => setShowContact(true)} className="text-gray-700 hover:text-orange-600 transition-colors duration-200 cursor-pointer"> Contact Us </span></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b-2 border-blue-200 pb-1">
            {loading ? <SkeletonBlock width={90} height={24} /> : "Explore"}
          </h3>
          <ul className="space-y-2">
            {loading ? (
              <>
                <SkeletonBlock width={130} height={16} />
                <SkeletonBlock width={110} height={16} />
                <SkeletonBlock width={130} height={16} />
              </>
            ) : (
              <>
                <li onClick={handleBusinessClick} className="text-gray-700 hover:text-blue-700 cursor-pointer transition-colors duration-200">Add Your Business</li>
                <li>
                <button
                  onClick={(e) => handleScroll(e,"categories")}
                  className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleScroll(e,"subcategories")}
                  className="text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                  Subcategories
                </button>
              </li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-green-700 border-b-2 border-green-200 pb-1">
            {loading ? <SkeletonBlock width={70} height={24} /> : "Account"}
          </h3>
          <ul className="space-y-2">
            {loading ? (
              <>
                <SkeletonBlock width={60} height={16} />
                <SkeletonBlock width={65} height={16} />
              </>
            ) : (
              <>
                <li><span onClick={handleLoginClick}  className="text-gray-700 hover:text-green-700 transition-colors duration-200 cursor-pointer"> Login </span></li>
                {/* <li><Link href="/signup" className="hover:text-blue-700 transition">Signup</Link></li> */}
              </>
            )}
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-orange-600 border-b-2 border-orange-200 pb-1">
            {loading ? <SkeletonBlock width={100} height={24} /> : "Legal"}
          </h3>
          <ul className="space-y-2">
            {loading ? (
              <>
                <SkeletonBlock width={100} height={16} />
                <SkeletonBlock width={130} height={16} />
                <SkeletonBlock width={130} height={16} />
              </>
            ) : (
              <>
                <li><Link href="/privacypolicy" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/terms&conditions" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Terms & Conditions</Link></li>
                <li><Link href="/refundpolicy" className="hover:text-green-600 transition">Refund Policy</Link></li>
              </>
            )}
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-blue-700 border-b-2 border-blue-200 pb-1">Contact Info</h3>

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4 md:mb-0 md:w-1/2 space-y-3">
              <div>
                <p className="font-semibold text-sm text-orange-700">📧 Mail ID:</p>
                <p className="text-sm text-gray-600">majhinavimumbai@gmail.com</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-green-700">📞 Contact:</p>
                <p className="text-sm text-gray-600">+91 91524 18196</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 5 - Address desktop view */}
       
        <div className="mt-8 lg:mt-0 hidden lg:block ">
        <h3 className="font-semibold text-lg mb-3 text-green-700 border-b-2 border-green-200 pb-1">Address</h3>
        <a
          href="https://www.google.com/maps?q=F113+Railway+Station+Complex,+Nerul+West,+Navi+Mumbai+400706"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start space-x-2 hover:text-blue-600 transition-colors duration-200"
        >
          <span className="text-xl">📍</span>
          <span className="text-sm text-gray-700 leading-relaxed group-hover:underline">
            F113, Railway Station Complex, <br />
            Nerul West, Navi Mumbai – 400706
          </span>
        </a>

        {/* Map */}
        <div className="mt-4">
          <div className="w-full rounded-md overflow-hidden shadow-sm border border-orange-200">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps?q=F113+Railway+Station+Complex,+Nerul+West,+Navi+Mumbai+400706&output=embed"
              allowFullScreen
              loading="lazy"
              className="w-full h-[180px] border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile View: Address Section */}
      <div className="block lg:hidden px-4">
        <h3 className="font-semibold text-lg mb-3 text-green-700 border-b-2 border-green-200 pb-1">Address</h3>

        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-start space-x-3 mb-3">
            <span className="text-xl">📍</span>
            <span className="text-sm text-gray-700 leading-relaxed">
              F113, Railway Station Complex,<br />
              Nerul West, Navi Mumbai – 400706
            </span>
          </div>

          {/* Google Maps */}
          <div className="rounded-md overflow-hidden border border-orange-200">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps?q=F113+Railway+Station+Complex,+Nerul+West,+Navi+Mumbai+400706&output=embed"
              allowFullScreen
              loading="lazy"
              className="w-full h-[180px] border-0"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Column 5 - Social media */}
    <div className="max-w-7xl mx-auto px-4 pb-5">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold mb-3 text-green-700">Follow Us</h2>
        <div className="flex gap-4 text-2xl">
          <a
            href="https://x.com/majhinavimumbai?s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-black transition"
          >
            <SiX/>
          </a>
          <a
            href="https://youtube.com/watch?v=U1TvvhV7NBM&feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600  hover:text-red-700 transition"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.instagram.com/invites/contact/?igsh=rd4wqglt4ujv&utm_content=xlzw37g"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>

    </div>

    

    {/* Bottom Section with Enhanced Tricolor */}
    <div className="relative">
      {/* Decorative Tricolor Pattern */}
      {/* <div className="flex h-3">
        <div className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="flex-1 bg-white border-t border-b border-gray-300"></div>
        <div className="flex-1 bg-gradient-to-r from-green-500 to-green-600"></div>
      </div> */}
      
      {/* Copyright Section */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 text-center py-3 text-sm border-t border-gray-200">
        {loading ? (
          <SkeletonBlock width={160} height={16} className="mx-auto" />
        ) : (
          <div className="text-gray-700">
            <span className="text-orange-600">&copy;</span> {new Date().getFullYear()} <span className="font-semibold text-blue-700">माझी</span> <span className="text-green-600 font-semibold">Navi Mumbai</span>. 
            <span className="text-orange-600"> All Rights Reserved.</span>
            Owned and operated by <strong className="text-blue-700">Ekagrata Trading LLP</strong>.
          </div>
        )}
      </div>
    </div>

    <ContactPopup showContact={showContact} setShowContact={setShowContact} />
    <PopUp showModal={showModal} setShowModal={setShowModal} authPurpose={authPurpose}/>
  </footer>
  );
}
