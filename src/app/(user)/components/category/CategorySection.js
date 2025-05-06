"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function CategoryCards() {
  const dispatch = useDispatch();
  
    const { categories, loading, error } = useSelector((state) => state.categories);
  
    useEffect(() => {
      if (categories?.length === 0) {
        dispatch(fetchCategories());
      }
    }, [dispatch, categories]);

    const handleCategoryClick = (slug) => {
    };
  
    // if (loading) {
    //   return <div className="text-center py-10 font-semibold">Loading categories...</div>;
    // }
  
    // if (error) {
    //   return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
    // }
  
  return (
    <div className="p-2 sm:p-4 max-w-6xl xl:max-w-7xl mx-auto mt-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4 font-poppins">
        {categories.map((categoryItem) => (
          <Link
            href={`/${categoryItem.slug}`}
            key={categoryItem.id}
            className="w-full flex justify-center"
            onClick={() => handleCategoryClick(categoryItem.slug)}
          >
            <div className="group flex flex-col items-center justify-center w-full max-w-[100px] sm:max-w-[120px] md:max-w-[160px] p-2 bg-white rounded-lg cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              
              {/* Image */}
              <div className="relative w-full h-[80px] sm:h-[100px] md:h-[120px] rounded-xl overflow-hidden border border-gray-300 transition-all duration-300">
                <Image
                  src={`/assests/categories/${categoryItem.slug}.jpg`}
                  alt={categoryItem.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title */}
              <p className="text-xs sm:text-sm md:text-md font-semibold text-center mt-2 px-1 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                {categoryItem.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
