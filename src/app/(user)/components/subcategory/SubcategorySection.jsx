"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function SubcategoryCard() {
  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Skeleton for subcategory image + text block
  const SkeletonSubcategory = () => (
    <div className="flex flex-col items-center p-2 rounded-xl animate-pulse">
      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gray-300 border border-gray-300" />
      <div className="mt-2 h-4 w-16 bg-gray-300 rounded" />
    </div>
  );

  // Skeleton card mimicking the category card shape
  const SkeletonCategoryCard = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-orange-100 shadow-md animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-40 mb-5"></div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center">
        {/* Show 3 skeleton subcategories */}
        {[...Array(3)].map((_, idx) => (
          <SkeletonSubcategory key={idx} />
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {loading
            ?
              [...Array(20)].map((_, idx) => <SkeletonCategoryCard key={idx} />)
            : categories?.map((category) => (
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
                    {(category?.subcategories || []).slice(0, 3).map((sub) => (
                      <Link
                        href={`/${category.slug}/${sub.slug}`}
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
                        <p className="text-xs sm:text-sm font-semibold mt-2 text-gray-800 hover:text-green-500">
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
