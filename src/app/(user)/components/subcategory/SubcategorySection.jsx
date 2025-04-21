"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { apiGet } from "@/lib/apiClient";

export default function SubcategoryCard() {

  const [subcategoryData, setSubcategoryData] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await apiGet("subcategories"); // adjust the endpoint if needed
        setSubcategoryData(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    <div className="bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {subcategoryData.map((category) => (
            <div
              key={category.slug}
              className="group p-5 sm:p-6 rounded-3xl bg-white border border-orange-100 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              {/* Category Name */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-orange-600 transition">
                {category.name}
              </h2>

              {/* Subcategory Grid */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center hover:text-orange-500">
                {category?.subcategories?.slice(0, 3).map((sub) => (
                  <Link href={`/listing/${sub.slug}`}
                    key={sub.slug}
                    className="flex flex-col items-center p-2 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gray-200 overflow-hidden relative border border-gray-300">
                      <Image
                        src={`/assests/category/${category.slug}/${sub.slug}.jpg`}
                        alt={sub.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold mt-2 text-gray-800 hover:text-green-500 ">
                      {sub.name}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Read More Button */}
              <div className="flex justify-end mt-5">
                <Link
                  href={`/${category.slug}`}
                  className="group flex items-center gap-1 text-green-600 font-semibold hover:text-green-500 transition-all duration-300 text-sm sm:text-base"
                >
                  Read More
                  <FiArrowRight className="mt-[1px] transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
