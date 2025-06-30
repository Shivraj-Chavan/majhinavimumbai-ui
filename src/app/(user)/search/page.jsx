"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/apiClient";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { ImMail4 } from "react-icons/im";
import { FcFinePrint } from "react-icons/fc";
import Link from "next/link";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}`);
        console.log('On search',res);
        setResults(res.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Search results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="space-y-6 mt-10">
          {results.map((business) => (
            <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
              <div className="relative w-full sm:w-48 h-40 rounded-xl mt-5 overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={business.image_url || "/image.png"}
                  alt={business.name || "Business Image"}
                  fill
                  className="object-cover"
                />
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
                        <a
                          href={`https://wa.me/91${business.wp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 text-sm"
                        >
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
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
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
                    {business.wp_number && (
                      <a
                        href={`https://wa.me/+91${business.wp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105"
                      >
                        <TbBrandWhatsapp className="text-xl" />
                        WhatsApp
                      </a>
                    )}
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
        <p>No businesses found for this search.</p>
      )}

       {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
