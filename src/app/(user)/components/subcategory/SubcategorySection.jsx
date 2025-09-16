"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiGrid, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import AdsImg2 from "../home/adsImg2";

export default function SubcategoryCard() {
  const dispatch = useDispatch();
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState('compact'); // 'compact' or 'detailed'

  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const toggleCategory = (categorySlug) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedCategories(newExpanded);
  };

  // Skeleton components
  const SkeletonSubcategory = () => (
    <div className="flex items-center p-2 rounded-lg animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-gray-300 flex-shrink-0" />
      <div className="ml-3 h-4 w-20 bg-gray-300 rounded" />
    </div>
  );

  const SkeletonCompactCard = () => (
    <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
      <div className="space-y-1">
        {[...Array(3)].map((_, idx) => (
          <SkeletonSubcategory key={idx} />
        ))}
      </div>
    </div>
  );

  const SkeletonDetailedCard = () => (
    <div className="p-5 rounded-3xl bg-white border border-orange-100 shadow-md animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-40 mb-5"></div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-center">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex flex-col items-center p-2 rounded-xl">
            <div className="w-20 h-20 rounded-2xl bg-gray-300 border border-gray-300" />
            <div className="mt-2 h-4 w-16 bg-gray-300 rounded" />
          </div>
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

  const filteredCategories = categories?.filter(
    (category) => Array.isArray(category.subcategories) && category.subcategories.length > 0
  ) || [];

  return (
    <div id="subcategories" className="bg-gradient-to-br from-orange-50/50 to-orange-500/50 min-h-screen">
      <AdsImg2 />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Browse Categories
            </h1>
            <p className="text-gray-600">
              Discover our wide range of services organized by category
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'compact'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiGrid className="inline mr-2" />
              Compact
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'detailed'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiGrid className="inline mr-2" />
              Detailed
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {viewMode === 'compact' ? (
          // Compact View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {loading
              ? [...Array(12)].map((_, idx) => <SkeletonCompactCard key={idx} />)
              : filteredCategories.map((category) => (
                <div
                key={category.slug}
                className="group relative p-4 min-h-[300px] rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-cover bg-center"
                style={{ backgroundImage: `url(/assests/categories/${category.slug}.jpg)` }}
              >
                    
              <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4 z-2 relative">
                      <Link href={`/${category.slug}`}>
                      <h3 className="text-sm sm:text-base font-semibold text-center text-white group-hover:text-orange-600 transition-colors duration-300 leading-tight min-h-[2.5rem] flex items-center justify-center">
                      <span className="px-1" title={category.name}>
                        {category.name.length > 18 ? category.name.slice(0, 18) + ".." : category.name}
                      </span>
                    </h3>

                      </Link>
                      <button
                        onClick={() => toggleCategory(category.slug)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors duration-200"
                      >
                        {expandedCategories.has(category.slug) ? (
                          <FiChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Subcategories List */}
                    <div className="space-y-1 relative z-2">
                      {(category?.subcategories || [])
                        .slice(0, expandedCategories.has(category.slug) ? undefined : 3)
                        .map((sub) => (
                          <Link
                            href={`/${category.slug}/${sub.slug}`}
                            key={sub.slug}
                            className="flex items-center  p-1 rounded-lg hover:bg-orange-50 transition-colors duration-200 group/sub"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden relative border border-gray-300 flex-shrink-0">
                              <Image
                                src={`/assests/category/${category.slug}/${sub.slug}.jpg`}
                                alt={sub.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <p className="text-sm font-medium ml-3 text-white group-hover/sub:text-orange-600 transition-colors duration-200">
                              {sub.name}
                            </p>
                          </Link>
                        ))}
                    </div>

                    {/* Show More/Less indicator */}
                    {category.subcategories && category.subcategories.length > 3 && (
                      <div className="mt-1 py-2 border-t  relative z-50 border-b mb-6 border-gray-100">
                        <p className="text-xs text-white text-center">
                          {expandedCategories.has(category.slug)
                            ? `Showing all ${category.subcategories.length} services`
                            : `+${category.subcategories.length - 3} more services`}
                        </p>
                      </div>
                    )}

                    {/* View All Button */}
                    <div className="  z-2  w-full pb-3 absolute bottom-0 border-gray-800">
                      <Link
                        href={`/${category.slug}`}
                        className="group/link flex items-center justify-center gap-2 text-orange-500 font-medium hover:text-orange-500 transition-all duration-300 text-sm"
                      >
                        View All Services
                        <FiArrowRight className="transform transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        ) : (
          // Detailed View (Original Style but improved)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {loading
              ? [...Array(8)].map((_, idx) => <SkeletonDetailedCard key={idx} />)
              : filteredCategories.map((category) => (
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
        )}

      </div>
    </div>
  );
}