"use client";

import React, { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcFinePrint, FcRating } from "react-icons/fc";
import { IoLocationOutline } from "react-icons/io5";
import FilterBar from "../../components/categorylisting/Filterbar";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import { SlCallIn } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "@/redux/slice/bussinessSlice";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function Page({ params }) {
  const { category, subcategories } = use(params);
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector((state) => state.businesses);

        useEffect(() => {
          if (category && subcategories) {
            dispatch(fetchBusinesses({categorySlug:category,subcategoryslug:subcategories }));
          }
        }, [dispatch, category, subcategories]);

        useEffect(() => {
          if (categories.length === 0) {
            dispatch(fetchCategories());
          }
        }, [dispatch, categories.length]);

    
      if (loading) {
        return <div className="text-center py-10 font-semibold">Loading...</div>;
      }
    
      if (error) {
        return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
      }
  
      const selectedCategory = categories.find(data => data.slug === category);

      if (!selectedCategory) {
        return (
          <div className="text-center text-red-500 font-semibold text-lg py-20">
            Category not found.
          </div>
        );
      }

  const listings = [
    {
      id: 1,
      name: "Cafe Creme",
      description: "Tasty treats and great coffee",
      location: "Vashi",
      ratings: "3.5",
      totalRatings: 120,
      contact: "6543209725",
    },
    {
      id: 2,
      name: "SkyLounge Hotel",
      description: "Enjoy a luxurious stay with premium amenities.",
      location: "Kharghar",
      ratings: "4.4",
      totalRatings: 130,
      contact: "9876543210",
    },
    {
      id: 3,
      name: "Food Corner",
      description: "Best burgers in town",
      location: "Panvel",
      ratings: "5",
      totalRatings: 90,
      contact: "9123456780",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        {/* <Link
          href={`/${category}`}
          className="inline-block mb-2 text-blue-600 hover:underline"
        >
          ← Back to {category}
        </Link> */}

        <h1 className="text-4xl font-bold text-blue-900 capitalize">
          {subcategories.replace(/-/g, " ")} Listings
        </h1>
        <p className="text-gray-600 mt-2">
          Browse top businesses in this subcategory.
        </p>
        <div className="mt-7 flex justify-center">
          <FilterBar />
        </div>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="text-center text-red-500 font-medium text-lg">
          No listings found in this subcategory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-xl hover:shadow-2xl transition rounded-3xl p-5 flex flex-col sm:flex-row gap-6 border border-gray-100"
            >
              {/* Image */}
              <div className="relative items-center w-full sm:w-48 h-40 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src='/resto.jpeg'
                  alt={listing.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-blue-800">
                  {listing.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {listing.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className="text-blue-600" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FcRating />
                    <span>{listing.ratings} ★({listing.totalRatings} ratings)</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <SlCallIn/> 
                    <span>{listing.contact}</span>
                  </div>
                </div>

              {/* view, wp, share btn */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <Link
                    href={`/listingInfo/${listing.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
                  >
                    <FcFinePrint className="text-xl" />
                    View Details
                  </Link>

                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
                    <TbBrandWhatsapp className="text-xl" />
                    Whatsapp
                  </button>

                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
                    <TfiShare className="text-xl" />
                    Share
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Businesses Card Section */}
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
               <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 uppercase mb-10 tracking-wide">
                 Explore Businesses
               </h2>
     
               {businessesLoading ? (
                 <div className="text-center py-10 font-semibold">Loading Businesses...</div>
               ) : businessesError ? (
                 <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {businesses?.length > 0 ? (
                     businesses.data.map((business) => (
                       <div
                       key={business.id}
                       className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col"
                     >
                       {/* Business Image */}
                       <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                         <Image
                           src={business.imageUrl || "/default-business.jpg"}
                           alt={business.name || "Business Image"}
                           fill
                           className="object-cover"
                         />
                       </div>
                     
                       {/* Business Info */}
                       <div className="flex flex-col gap-2 flex-grow">
                         {/* Business Name */}
                         <h3 className="text-lg font-bold text-gray-800 truncate">{business.name || "Business Name"}</h3>
                     
                         {/* Full Address */}
                         <p className="text-sm text-gray-500 truncate">
                           {(business.address || "Address")}, {(business.landmark || "Landmark")}, {(business.sector || "Sector")}, {(business.area || "Area")}
                         </p>
                     
                         {/* Pincode */}
                         <p className="text-sm text-gray-500">
                           Pin Code: {business.pin_code || "Pin Code"}
                         </p>
                     
                         {/* Phone */}
                         <div className="mt-1 flex items-center gap-1 text-sm text-gray-600 font-medium">
                           📞 {business.phone || "Phone number"}
                         </div>
                     
                         {/* WhatsApp */}
                         {business.wp_number && (
                           <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                             🟢 WhatsApp: {business.wp_number}
                           </div>
                         )}
                     
                         {/* Email */}
                         {business.email && (
                           <a href={`mailto:${business.email}`} className="text-sm text-blue-500 hover:underline">
                             📧 {business.email}
                           </a>
                         )}
                       </div>
                     
                       {/* Timings */}
                       {business.timings && business.timings.length > 0 && (
                         <div className="mt-3 border-t pt-2 text-xs text-gray-600">
                           <div className="font-semibold mb-1 text-gray-700">Timings:</div>
                           <ul className="space-y-1">
                             {business.timings.map((timing, idx) => (
                               <li key={idx}>
                                 {timing.day || "Day"}: {timing.open || "09:00"} - {timing.close || "18:00"}
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}
                     
                       {/* Website */}
                       <div className="mt-4 border-t pt-3">
                         {business.website && (
                           <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline block">
                             🌐 Visit Website
                           </a>
                         )}
                       </div>
                     </div>
                     ))
                   ) : (
                     <div className="text-center text-gray-500 font-semibold py-10">
                       No Businesses Found.
                     </div>
                   )}
                 </div>
               )}
             </div>
     

    </div>
  );
}
