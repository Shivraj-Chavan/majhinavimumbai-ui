"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Actionbtn from "../../components/categorylisting/Actionbtn";
import Info from "../../components/categorylisting/Info";
import Tab from "../../components/categorylisting/Tab";
import Photos from "../../components/categorylisting/Photos";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FcGlobe, FcDownRight, FcCallback, FcBookmark } from "react-icons/fc";
import { apiGet } from "@/lib/apiClient";
import UsersndMsg from "../../components/categorylisting/UsersndMsg";

const hours = {
  Monday: "10 AM - 10 PM",
  Tuesday: "10 AM - 10 PM",
  Wednesday: "10 AM - 10 PM",
  Thursday: "10 AM - 10 PM",
  Friday: "10 AM - 11 PM",
  Saturday: "9 AM - 11 PM",
  Sunday: "9 AM - 9 PM",
};

export default function ListingInfo() {
  const params = useParams();
  const slug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchBusiness = async () => {
      try {
        const data = await apiGet(`/businesses/s/${slug}`);
        if (!data.business) throw new Error("Business not found.");
        setBusiness(data.business);
      } catch (err) {
        setError(err.message || "Error loading business");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug]);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <>
        {/* {[...Array(full)].map((_, i) => (<FaStar key={`f-${i}`} className="text-yellow-400" /> ))}
        {half && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(empty)].map((_, i) => (<FaRegStar key={`e-${i}`} className="text-yellow-400" />))} */
        }
      </>
    );
  };

  if (loading) return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-tr from-blue-50 to-blue-100 shadow-xl p-8 sm:p-12 rounded-3xl mb-10 overflow-hidden">
        <div className="absolute  bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* logo */}
            <div className="w-20 h-20 bg-white border-4 border-blue-300 rounded-full flex items-center justify-center text-2xl font-extrabold text-blue-700 shadow-lg">
              {business.name?.[0]}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-1">
                {business.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-2">
                {business.category} · {business.address}
              </p>
              <div className="flex items-center gap-2">
                {renderStars(business.rating)}
                <span className="text-gray-800 font-semibold">{business.rating}</span>
                <span className="text-gray-500 text-sm">({business.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-105">
              <TbBrandWhatsapp className="text-xl" />
              WhatsApp
            </button>
            <button className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-105">
              <TfiShare className="text-lg" />
              Share
            </button>
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <Photos business={business} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-9">
        <Actionbtn href={business.website} icon={<FcGlobe />} label="Website" ringColor="blue" />
        <Actionbtn href={business.mapLink} icon={<FcDownRight />} label="Directions" ringColor="gray" />
        <Actionbtn href={`tel:${business.phone}`} icon={<FcCallback />} label="Call" ringColor="green" />
        <Actionbtn icon={<FcBookmark />} label="Save" ringColor="orange" isButton />
      </div>

      {/* Info & Tabs */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <Info business={business} hours={hours} />
        <div className="mt-8">
          <Tab business={business} renderStars={renderStars} />
        </div>

        {/* Enquiry Section */}
      <div className="mt-12">
        <UsersndMsg/>
      </div>
      </div>

      
    </div>
  );
}
