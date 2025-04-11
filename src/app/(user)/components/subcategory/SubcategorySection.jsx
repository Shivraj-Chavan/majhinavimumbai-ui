"use client";

import React from "react";
import Image from "next/image";
import subcategoryApiData from "@/dummy/subcategories";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function SubcategoryCard() {
  return (
    <div className="bg-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-7 mt-6 sm:mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {subcategoryApiData.map((category) => (
            <div
              key={category.slug}
              className="mb-6 p-4 sm:p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Category Name */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-600">
                {category.name}
              </h2>

              {/* Subcategory Grid */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center">
                {category?.subcategories?.slice(0, 3).map((sub) => (
                  <div
                    key={sub.slug}
                    className="flex flex-col items-center bg-white p-1 rounded-md hover:shadow-lg transition duration-200"
                  >
                    <div className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gray-300 overflow-hidden relative">
                      <Image
                        src={`/assests/category/${category.slug}/${sub.slug}.jpg`}
                        alt={sub.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold mt-2 leading-tight break-words">
                      {sub.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Read More Button */}
              <div className="flex justify-end mt-3">

                <Link href={`/assests/category/${category.slug}`} className="group flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 transition-all duration-300 text-sm sm:text-base" >
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
