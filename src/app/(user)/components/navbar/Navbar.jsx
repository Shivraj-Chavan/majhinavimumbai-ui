"use client";

import Button from '../form/Button';
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from 'react';
import { FiMenu, FiX } from "react-icons/fi"; 
import PopUp from '../home/popUp';
import LocationDropdown from '../home/locationDropdown';
import SearchBar from '../home/searchBar';




export default function Navbar() {
  const [location, setLocation] = useState("Navi-mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const dropdownRef = useRef(null);

  return (
      <nav className="bg-blue-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">

      {/* Logo */}
      <Link href='/' className="flex items-center">
          <Image src='/logo.png' alt="Logo" width={160} height={50} priority />
        </Link>

        {/* Location & Searchbar */}
        {/* LocationDropdown  */}
        {/* <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center" >
            <LocationDropdown 
              location={location}
              setLocation={setLocation}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              dropdownRef={dropdownRef}
            />
            <SearchBar />
          </div>
        </div> */}

         {/*Business Listing & Login */}
         <div className="hidden md:flex items-center space-x-4">

          {/* Buiness Listing Btn */}
        <Button onClick={() => setShowModal(true)} className="bg-orange-400 hover:bg-orange-500 text-sm uppercase"> Business Listing </Button>

          {/* Login/Signup Btn */}
          <Button onClick={() => setShowModal(true)} className="bg-green-500 hover:bg-green-600 text-sm uppercase"> Login / Sign Up </Button>

          </div>

          {/* Mobile Menu Button */}
          <Button className="block md:hidden text-2xl text-blue-600" onClick={() => setIsMenuOpen(!isMenuOpen)} >
          {isMenuOpen ? <FiX /> : <FiMenu />}
           </Button>
         </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
          <div className="w-full mt-10 md:hidden flex flex-col gap-5">
            
          {/* Location + Search */}
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

            {/* Right */}
            <div className="w-1/2">
              <SearchBar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border-l-0 border border-gray-300 px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mb-5 justify-center">
              <Button
                onClick={() => setShowModal(true)}
                className="bg-orange-400 hover:bg-orange-500 text-sm w-40 uppercase"
              >
                Business Listing
              </Button>

              <Button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-sm w-40 uppercase"
              >
                Login / Sign Up
              </Button>
            </div>
            </div>
        
            )}
            
            {/*  Login Modal */}
            <PopUp showModal={showModal} setShowModal={setShowModal}/>
            
          </nav>
        );
      }
          
  