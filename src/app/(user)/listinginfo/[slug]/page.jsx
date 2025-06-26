"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Actionbtn from "../../components/categorylisting/Actionbtn";
import Info from "../../components/categorylisting/Info";
import Tab from "../../components/categorylisting/Tab";
import Photos from "../../components/categorylisting/Photos";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import { FcGlobe, FcDownRight, FcCallback, FcBookmark } from "react-icons/fc";
import { PiChatText } from "react-icons/pi";
import { apiGet } from "@/lib/apiClient";
import UsersndMsg from "../../components/categorylisting/UsersndMsg";
import Enquirymsg from "../../components/categorylisting/Enquirymsg";
import Link from "next/link";
import { IoIosCall } from "react-icons/io";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const hours = {
  Monday: "10 AM - 10 PM",
  Tuesday: "10 AM - 10 PM",
  Wednesday: "10 AM - 10 PM",
  Thursday: "10 AM - 10 PM",
  Friday: "10 AM - 11 PM",
  Saturday: "9 AM - 11 PM",
  Sunday: "9 AM - 9 PM",
};

// Skeleton loader kept same
function SkeletonLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 animate-pulse">
      <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>
      <div className="bg-blue-100 rounded-3xl p-8 mb-10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
      <div className="flex justify-center gap-6 mb-9">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-12 bg-gray-300 rounded-full"></div>
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-5/6"></div>
        <div className="h-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default function ListingInfo() {
  const params = useParams();
  const slug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const [showStickyHero, setShowStickyHero] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);


  useEffect(() => {
    if (!slug) return;
    const fetchBusiness = async () => {
      try {
        const data = await apiGet(`/businesses/s/${slug}`);
        if (!data.business) throw new Error("Business not found.");
        setBusiness(data.business);
      } catch (err) {
        setError("Oops ! Your Business is not Verified"|| "Error loading business");
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      setShowStickyHero(rect.bottom <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderStars = (rating) => {
    const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
    const full = Math.max(0, Math.floor(safeRating));
    const half = safeRating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {half === 1 && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(empty)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
        ))}
      </>
    );
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div>
      {/* breadcrumb */}
      {business?.category && business?.subcategory && (
        <div className="relative z-30 text-sm text-black px-4 md:px-0">
          <nav className="flex items-center flex-wrap gap-2">
            <Link href="/" className="hover:underline text-black font-semibold">Home</Link>
            <span>/</span>
            <Link href={`/category/${business.categorySlug || business.category}`} className="hover:underline text-black capitalize">
              {business.category.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-800 capitalize">{business.subcategory.replace(/-/g, " ")}</span>
          </nav>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Hero Section */}
        <div id="hero-section" className="relative bg-gradient-to-tr from-blue-50 to-blue-100 shadow-xl p-5 sm:p-8 rounded-3xl mt-4 mb-10 overflow-hidden">
          <div className="absolute bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-white border-4 border-blue-300 rounded-full flex items-center justify-center text-2xl font-extrabold text-blue-700 shadow-lg">{business.name?.[0]}</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-1">{business.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{business.category} · {business.address}</p>
                <div className="flex items-center gap-2">{renderStars(business.rating)}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button className="inline-flex items-center gap-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all" onClick={() => setShowEnquiryPopup(true)}>
                <PiChatText className="text-xl" /> Enquiry
              </button>

              {showEnquiryPopup && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl max-w-2xl w-full relative shadow-2xl">
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg" onClick={() => setShowEnquiryPopup(false)}>
                      &times;
                    </button>
                    <Enquirymsg closePopup={() => setShowEnquiryPopup(false)} businessId={business.id} />
                  </div>
                </div>
              )}

              <a href={`https://wa.me/+91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
                <TbBrandWhatsapp className="text-xl" /> WhatsApp
              </a>

              <button className="inline-flex items-center cursor-pointer gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
                <TfiShare className="text-lg" /> Share
              </button>
            </div>
          </div>

          <div className="mt-8 relative">
            <Photos business={business} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-5 mb-9">
          <Actionbtn href={business.website} icon={<FcGlobe />} label="Website" ringColor="blue" />
          <Actionbtn href={`https://www.google.co.in/maps/search/?q=${encodeURIComponent(business.mapLink || business.name || "Your Business Location")}`} icon={<FcDownRight />} label="Directions" ringColor="gray" />
          <Actionbtn href={`tel:${business.phone}`} icon={<FcCallback />} label="Call" ringColor="green" />
          {/* <Actionbtn icon={<FcBookmark />} label="Save" ringColor="orange" isButton /> */}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8">
          <Info business={business} hours={hours} />
          <div className="mt-8">
          <Tab business={business} renderStars={renderStars} businessOwnerId={business?.owner_id} currentUserId={currentUserId}/>

          </div>
          <div className="mt-12">
            <UsersndMsg setReviews={setReviews} businessId={business.id} />
          </div>
        </div>

        {/* Sticky Bottom Hero Bar */}
        {showStickyHero && (
          <div className="fixed bottom-0 left-0 w-full bg-gradient-to-tr from-blue-50 to-blue-300 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-14 h-14 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center text-lg font-bold text-blue-700 shadow">{business.name?.[0]}</div>
                <div className="text-base sm:text-lg">
                  <div className="font-semibold text-blue-900">{business.name}</div>
                  <div className="text-gray-500 text-xs">{business.category}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${business.phone}`} className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-full text-sm font-medium flex items-center gap-2 shadow hover:bg-blue-600 transition">
                  <IoIosCall className="text-lg" /> Call
                </a>
                <button onClick={() => setShowEnquiryPopup(true)} className="inline-flex  cursor-pointer items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
                  <PiChatText className="text-xl" /> Enquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
