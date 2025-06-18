"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ContactPopup from "../home/contactPopup"
import PopUp from '../home/popUp';

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");

  useEffect(() => {
    // Simulate loading delay, e.g. fetching config or something async
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton block helper
  const SkeletonBlock = ({ width = "full", height = "4" }) => (
    <div className={`bg-gray-300 animate-pulse rounded`} style={{ width: width === "full" ? "100%" : width, height: `${height}px`}} />
  );

  return (
    <footer className="bg-gray-100 text-gray-800 mt-10 border-t border-t-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 text-sm">

        {/* Column 1 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
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
                <li><Link href="/" className="hover:text-orange-500 transition">Home</Link></li>
                <li><Link href="/about" className="hover:text-orange-500 transition">About Us</Link></li>
                <li><span onClick={() => setShowContact(true)} className="hover:text-orange-500 transition cursor-pointer"> Contact Us </span></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
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
                <li><Link href="/businessRegister" className="hover:text-blue-700 transition">Business Listing</Link></li>
                <li><Link href="/" className="hover:text-blue-700 transition">Categories</Link></li>
                <li><Link href="/subcategories" className="hover:text-blue-700 transition">Subcategories</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
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
                <li><span onClick={() => setShowModal(true)} className="hover:text-blue-700 transition cursor-pointer"> Login </span></li>
                {/* <li><Link href="/signup" className="hover:text-blue-700 transition">Signup</Link></li> */}
              </>
            )}
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
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
                <li><Link href="#" className="hover:text-green-600 transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-green-600 transition">Terms & Conditions</Link></li>
                {/* <li><Link href="#" className="hover:text-green-600 transition">Infringement Policy</Link></li> */}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        {loading ? (
          <SkeletonBlock width={160} height={16} className="mx-auto" />
        ) : (
          <> &copy; {new Date().getFullYear()} माझी Navi Mumbai. All Rights Reserved.</>
        )}
      </div>

      <ContactPopup showContact={showContact} setShowContact={setShowContact} />
      <PopUp showModal={showModal} setShowModal={setShowModal} authPurpose={authPurpose}/>
    </footer>
  );
}
