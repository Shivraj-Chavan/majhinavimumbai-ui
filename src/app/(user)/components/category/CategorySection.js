"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import { FiGrid, FiList, FiSearch, FiTrendingUp, FiStar } from "react-icons/fi";

export default function CategoryCards() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Filter categories based on search
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Show limited categories initially
  const displayCategories = showAll ? filteredCategories : filteredCategories.slice(0, 12);

  // Skeleton loader components
  const SkeletonGridCard = () => (
    <div className="group p-3 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="w-full h-16 sm:h-20 rounded-xl bg-gray-300 mb-3" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
    </div>
  );

  const SkeletonListCard = () => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-gray-300 flex-shrink-0" />
      <div className="ml-4 flex-1">
        <div className="h-5 bg-gray-300 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-48" />
      </div>
      <div className="w-6 h-6 bg-gray-300 rounded" />
    </div>
  );

  if (error) {
    return (
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 py-10">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
          <div className="text-red-500 font-semibold text-lg mb-2">Oops! Something went wrong</div>
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div id="categories" className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-orange-500 mb-2">
            <FiTrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Popular Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            What Are You Looking For?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our comprehensive range of services and find exactly what you need
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiList className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Categories Display */}
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {loading
              ? Array.from({ length: 12 }).map((_, idx) => <SkeletonGridCard key={idx} />)
              : displayCategories.map((categoryItem) => (
                  <Link
                    href={`/${categoryItem.slug}`}
                    key={categoryItem.id}
                    className="group"
                  >
                    <div className="group p-2 md:p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative w-full h-16 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 mb-3 border border-gray-200">
                        <Image
                          src={`/assests/categories/${categoryItem.slug}.jpg`}
                          alt={categoryItem.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-semibold text-center text-gray-800 group-hover:text-orange-600 transition-colors duration-300 leading-tight line-clamp-2 min-h-[2rem] flex items-center justify-center">
                        <span className="truncate px-1" title={categoryItem.name}>
                          {categoryItem.name}
                        </span>
                      </h3>
                    </div>
                  </Link>
                ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3 mb-8">
            {loading
              ? Array.from({ length: 12 }).map((_, idx) => <SkeletonListCard key={idx} />)
              : displayCategories.map((categoryItem) => (
                  <Link
                    href={`/${categoryItem.slug}`}
                    key={categoryItem.id}
                    className="group block"
                  >
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:bg-orange-50/30">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 flex-shrink-0 border border-gray-200">
                        <Image
                          src={`/assests/categories/${categoryItem.slug}.jpg`}
                          alt={categoryItem.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-1">
                          {categoryItem.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Explore {categoryItem.name.toLowerCase()} services
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="text-gray-400 group-hover:text-orange-500 transition-colors duration-300">
                        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {!loading && filteredCategories.length > 12 && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {showAll ? 'Show Less' : `Show All ${filteredCategories.length} Categories`}
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        )}

        {/* Stats Section */}
        {!loading && categories?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <FiStar className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{categories.length}+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <FiTrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">                {filteredCategories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)}
                +</div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">24</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">100%</div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}