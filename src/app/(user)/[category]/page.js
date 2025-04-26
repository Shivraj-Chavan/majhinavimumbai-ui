"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCategories } from '@/redux/slice/categoriesSlice';

export default function Page({ params }) {
  const { category } = params;
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);

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

  const selectedCategory = categories.find(data => data.slug === category);

  if (!selectedCategory) {
    return (
      <div className="text-center text-red-500 font-semibold text-lg py-20">
        Category not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[400px]">
        <Image
          src={`/assests/categories/${selectedCategory.slug}.jpg`} 
          alt={selectedCategory.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center drop-shadow-xl px-4">
            {selectedCategory.name}
          </h1>
        </div>
      </div>

      {/* Subcategory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 uppercase mb-10 tracking-wide">
          Explore Subcategories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 place-items-center">
          {selectedCategory.subcategories.map((data) => (
            <Link key={data.slug} href={`/${category}/${data.slug}`}>
              <div className="group bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all w-32 sm:w-36 md:w-40 text-center p-3 cursor-pointer hover:border-orange-400">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
                  <Image
                    src={`/assests/category/${category}/${data.slug}.jpg`} 
                    alt={data.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors truncate">
                  {data.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
