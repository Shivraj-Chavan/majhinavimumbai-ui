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
          console.log("API data response:", data); 
    
          if (!data.business) {
            throw new Error("Business not found.");
          }
    
          setBusiness(data.business); 
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err.message || "Error loading business");
        } finally {
          setLoading(false);
        }
      };
    
      fetchBusiness();
    }, [slug]);
    
  
  // useEffect(() => {
  //   const fetchBusiness = async () => {
  //     try {
  //       const data = await apiGet(`/businesses/${id}`);
  //       console.log("Fetched business:", data);
  //       setBusiness(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.message || "Failed to fetch business.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) fetchBusiness();
  //   console.log('Params',params);
  // }, [id]);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {/* {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} />)}
        {half && <FaStarHalfAlt />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} />)} */}
      </>
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <p>Logo</p>
          <h1 className="text-3xl font-bold text-blue-900">{business.name}</h1>
        </div>
        <p className="text-md text-gray-600">
          {business.category} · {business.location}
        </p>

        <div className="flex items-center gap-2 mt-1 text-yellow-500">
          {renderStars(business.rating)}
          <span className="text-gray-800 font-medium ml-1">{business.rating}</span>
          <span className="text-gray-500 text-md">({business.reviews} reviews)</span>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
            <TbBrandWhatsapp className="text-xl" />
            WhatsApp
          </button>

          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
            <TfiShare className="text-lg" />
            Share
          </button>
        </div>

        <Photos business={business} />
      </div>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <Actionbtn href={business.website} icon={<FcGlobe />} label="Website" ringColor="blue" />
        <Actionbtn href={business.mapLink} icon={<FcDownRight />} label="Directions" ringColor="gray" />
        <Actionbtn href={`tel:${business.phone}`} icon={<FcCallback />} label="Call" ringColor="green" />
        <Actionbtn icon={<FcBookmark />} label="Save" ringColor="orange" isButton />
      </div>

      <Info business={business} hours={hours} />
      <Tab business={business} renderStars={renderStars} />

        {/* send enquiry to business owners */}
        <UsersndMsg/>
    </div>
  );
}
