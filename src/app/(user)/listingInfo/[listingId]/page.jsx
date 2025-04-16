"use client";

import React from "react";
import Image from "next/image";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FcGlobe, FcDownRight, FcCallback, FcBookmark } from "react-icons/fc";
import Actionbtn from "../../components/categorylisting/Actionbtn";
import Info from "../../components/categorylisting/Info";
import Tab from "../../components/categorylisting/Tab";
import Photos from "../../components/categorylisting/Photos";
import { TbBrandWhatsapp } from "react-icons/tb";

const hours = {
  Monday: "10 AM - 10 PM",
  Tuesday: "10 AM - 10 PM",
  Wednesday: "10 AM - 10 PM",
  Thursday: "10 AM - 10 PM",
  Friday: "10 AM - 11 PM",
  Saturday: "9 AM - 11 PM",
  Sunday: "9 AM - 9 PM",
};

export default function ListingInfo({ params }) {
  const business = {
    name: "Cafe Creme",
    category: "Cafe",
    location: "Vashi, near Blue Diamond",
    rating: 3.9,
    reviews: "1.2K",
    contact: "435785321",
    description: "A cozy cafe offering delightful brews and pastries in the heart of Vashi.",
    images: [
      "/resto.jpeg",
      "/resto.jpeg",
      "/resto.jpeg",
      "/resto.jpeg",
      "/resto.jpeg",
    ],
    mapLink: "https://www.google.com/maps/embed?pb=...",
    website: "https://cafecreme.com",
    priceRange: "₹200 - ₹400 per person",
    menu: [
      { item: "Espresso", price: "₹350" },
      { item: "Latte", price: "₹250" },
      { item: "Pastries", price: "₹100" },
      { item: "Veg Farmhouse Pizza", price: "₹300" },
    ],
    reviewsList: [
      { user: "Ravi", comment: "Authentic and delicious!", rating: 5 },
      { user: "Meera", comment: "Loved the ambience.", rating: 4 },
      { user: "Om", comment: "Amazing coffee.", rating: 3.5 },
      { user: "Neha", comment: "Loved the quantity.", rating: 5 },
    ],
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => <FaStar key={`full-${i}`} />)}
        {half && <FaStarHalfAlt />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="text-3xl font-bold text-blue-900">{business.name}</h1>
        </div>
        <p className="text-md text-gray-600">
          {business.category} · {business.location}
        </p>

        <div className="flex items-center gap-2 mt-1 text-yellow-500">
          {renderStars(business.rating)}
          <span className="text-gray-800 font-medium ml-1">
            {business.rating}
          </span>
          <span className="text-gray-500 text-md">
            ({business.reviews} reviews)
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-4">
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
          <TbBrandWhatsapp className="text-xl" />
          WhatsApp
        </button>

        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
          <TfiShare className="text-lg" />
          Share
        </button>
      </div>

        {/* Photos */}
        <Photos business={business} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <Actionbtn href={business.website} icon={<FcGlobe />} label="Website" ringColor="blue" />
        <Actionbtn href={business.mapLink} icon={<FcDownRight />} label="Directions" ringColor="gray" />
        <Actionbtn href={`tel:${business.contact}`} icon={<FcCallback />} label="Call" ringColor="green" />
        <Actionbtn icon={<FcBookmark/>} label="Save" ringColor="orange" isButton />
      </div>

      {/* Info & Tabs */}
      <Info business={business} hours={hours} />
      <Tab business={business} renderStars={renderStars} />
    </div>
  );
}
