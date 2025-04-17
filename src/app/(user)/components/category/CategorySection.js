"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import category from "@/dummy/category";
import Link from "next/link";
import { apiGet } from "@/lib/apiClient";


export default function CategoryCards() {
  const [categories,setCategories] = useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
       const data=await apiGet("categories")
       setCategories(data)
    }
    fetchData()
  },[])

  return (
    <div className="p-2 sm:p-4 max-w-6xl xl:max-w-7xl mx-auto mt-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4 font-poppins">
        {categories.map((categoryItem) => (
          <Link
          href={`/${categoryItem.slug}`}
            key={categoryItem.id}
            className="w-full flex justify-center"
          >
            <div className="flex flex-col items-center justify-center w-full max-w-[100px] sm:max-w-[120px] md:max-w-[160px] p-2 bg-white rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md">
              
              {/* Image Box */}
              <div className="relative w-full h-[80px] sm:h-[100px] md:h-[120px] sm:text-sm rounded-xl overflow-hidden border border-gray-300">
                <Image
                  src={`/assests/categories/${categoryItem.slug}.jpg`}
                  alt={categoryItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <p className="text-xs sm:text-sm md:text-md font-semibold text-center mt-2 px-1 text-gray-800">
                {categoryItem.name}
              </p>
              
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
