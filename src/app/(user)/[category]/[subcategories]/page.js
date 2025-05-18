"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcFinePrint } from "react-icons/fc";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "@/redux/slice/bussinessSlice";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import FilterBar from "../../components/categorylisting/Filterbar";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { ImMail4 } from "react-icons/im";

export default function Page({ params }) {
  const { category, subcategories } = params;
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector(
    (state) => state.businesses
  );

  useEffect(() => {
    if (category && subcategories) {
      dispatch(fetchBusinesses({ categorySlug: category, subcategoryslug: subcategories }));
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

  const selectedCategory = categories.find((data) => data.slug === category);

  if (!selectedCategory) {
    return (
      <div className="text-center text-red-500 font-semibold text-lg py-20">
        Category not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 capitalize">
          {subcategories.replace(/-/g, " ")} 
        </h1>
        <p className="text-gray-600 mt-2">
          Browse top businesses in this subcategory.
        </p>
        <div className="mt-7 flex justify-center">
          <FilterBar />
        </div>
      </div>

      {/* Businesses Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
        {businessesLoading ? (
          <div className="text-center py-10 font-semibold">Loading Businesses...</div>
        ) : businessesError ? (
          <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
        ) : (
          <div className="space-y-6">
            {businesses?.data?.length > 0 ? (
              businesses.data.map((business) => (
                <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
                  {/* Business Image */}
                  <div className="relative w-full sm:w-48 h-40 rounded-xl mt-5 overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src="/image.png" alt={business.name || "Business Image"} fill className="object-cover"/>
                  </div>

                  {/* Business Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {(business.address || "Address")}, {(business.landmark || "Landmark")}
                      </p>
                      <p className="text-sm text-gray-600">Pin Code: {business.pin_code}</p>
                      <div className="mt-2 space-y-1">
                      {business.phone && (<p className="flex items-center gap-2 text-sm text-gray-700"><IoIosCall className="text-lg text-blue-600" /> <a href={`tel:${business.phone}`} className="hover:underline">{business.phone}</a></p>)}
                        {business.wp_number && (<p className="flex items-center gap-2"> <FaWhatsapp className="text-green-500 text-md" />
                           <a href={`https://wa.me/91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="text-green-600"> {business.wp_number}</a> </p>)}
                           {business.email && (
                        <p className="flex items-center gap-2 text-sm text-gray-700"> <ImMail4 className="text-red-600 text-lg" /> <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline"> {business.email}</a></p>)}
                      </div>
                    </div>

                    {/* Website + Action Buttons */}
                    <div className="mt-4 flex flex-col gap-2">
                      {business.website && (
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                          🌐 {business.website}
                        </a>
                      )}

                      <div className="flex flex-wrap gap-2 mt-2">
                        <Link href={`/listinginfo/${business.slug}`}>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
                            <FcFinePrint className="text-xl mr-1" />
                            View Details
                          </button>
                        </Link>
                        <a href={`https://wa.me/+91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105">
                           <TbBrandWhatsapp className="text-xl" />
                            WhatsApp
                        </a>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
                          <TfiShare className="text-xl mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 font-semibold py-10">No Businesses Found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
