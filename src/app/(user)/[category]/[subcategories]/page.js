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
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
    <div className="w-full sm:w-48 h-40 bg-gray-300 rounded-xl"></div>
    <div className="flex-1 space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-24 bg-gray-300 rounded"></div>
        <div className="h-8 w-24 bg-gray-300 rounded"></div>
        <div className="h-8 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

export default function Page({ params }) {
  const { category, subcategories } = params;
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector(
    (state) => state.businesses
  );

  const limit = 10;

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-sm text-gray-600 mb-4 font-semibold">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="hover:underline text-black">Home</Link>
            <span>/</span>
            <Link href={`/category/${category}`} className="hover:underline text-black capitalize">
              {category.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-800 capitalize">{subcategories.replace(/-/g, " ")}</span>
          </nav>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold text-blue-900 capitalize">
            {subcategories.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-600 mt-1">Browse top businesses in this subcategory.</p>
        </div>

        {/* FilterBar */}
      <div className="flex justify-center md:justify-end mt-2">
        <FilterBar onSortChange={(order) => setSortOrder(order)} />
      </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {businessesLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : businessesError ? (
          <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
        ) : businesses?.data?.length > 0 ? (
          <div className="space-y-6">
            {[...businesses.data]
              .sort((a, b) => {
                if (!a.name || !b.name) return 0;
                return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
              })
              .map((business) => (
                <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
                  <div className="relative w-full sm:w-48 h-40 rounded-xl mt-5 overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src="/image.png" alt={business.name || "Business Image"} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {(business.address || "Address")}, {(business.landmark || "Landmark")}
                      </p>
                      <p className="text-sm text-gray-600">Pin Code: {business.pin_code}</p>
                      <div className="mt-2 space-y-1">
                        {business.phone && (
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <IoIosCall className="text-lg text-blue-600" />
                            <a href={`tel:${business.phone}`} className="hover:underline">
                              {business.phone}
                            </a>
                          </p>
                        )}
                        {business.wp_number && (
                          <p className="flex items-center gap-2">
                            <FaWhatsapp className="text-green-500 text-md" />
                            <a href={`https://wa.me/91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-sm">
                              {business.wp_number}
                            </a>
                          </p>
                        )}
                        {business.email && (
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <ImMail4 className="text-red-600 text-lg" />
                            <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                              {business.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
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
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 font-semibold py-10">No Businesses Found.</div>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
