"use client";

import Link from 'next/link';
import React, { useState } from 'react';
// import ContactPopup from '@/app/components/home/contactPopup';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="bg-gray-100 text-gray-800 mt-10 border-t border-t-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 text-sm">


        {/* Column 1 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-orange-500 transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-orange-500 transition">About Us</Link></li>
            <li><span onClick={() => setShowContact(true)} className="hover:text-orange-500 transition cursor-pointer">Contact Us</span></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/business-listing" className="hover:text-blue-700 transition">Business Listing</Link></li>
            <li><Link href="/categories" className="hover:text-blue-700 transition">Categories</Link></li>
            <li><Link href="/subcategories" className="hover:text-blue-700 transition">Subcategories</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Account</h3>
          <ul className="space-y-2">
            <li><Link href="/login" className="hover:text-blue-700 transition">Login</Link></li>
            <li><Link href="/signup" className="hover:text-blue-700 transition">Signup</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-green-600 transition">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-green-600 transition">Terms & Conditions</Link></li>
            <li><Link href="#" className="hover:text-green-600 transition">Infringement Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} माझी Navi Mumbai. All Rights Reserved.
      </div>

      {/* <ContactPopup showContact={showContact} setShowContact={setShowContact} /> */}
    </footer>
  );
}
