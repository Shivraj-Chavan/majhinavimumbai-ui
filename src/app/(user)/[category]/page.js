"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCategories } from '@/redux/slice/categoriesSlice';
import { fetchBusinesses } from '@/redux/slice/bussinessSlice';
import { FcFinePrint } from 'react-icons/fc';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { IoCallSharp } from 'react-icons/io5';
import { useParams } from 'next/navigation';

// Skeleton loaders
const SubcategorySkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-xl mb-3" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
  </div>
);

const BusinessSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col animate-pulse">
    <div className="w-full h-40 mb-4 bg-gray-200 rounded-xl" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-3" />
    <div className="h-3 bg-gray-300 rounded w-1/2" />
  </div>
);

export default function Page() {
  const { category } = useParams();
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector((state) => state.businesses);

  useEffect(() => {
    if (category) {
      dispatch(fetchBusinesses({ categoryslug: category }));
    }
  }, [dispatch, category]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const selectedCategory = categories.find(data => data.slug === category);

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
  }

  if (!selectedCategory && !loading) {
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
        {!selectedCategory ? (
          <div className="w-full h-full bg-gray-300 animate-pulse" />
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Subcategory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-900/10 py-10 px-4 sm:px-6 lg:px-8 rounded-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 place-items-center">
            {loading || !selectedCategory ? (
              Array.from({ length: 6 }).map((_, idx) => <SubcategorySkeleton key={idx} />)
            ) : (
              selectedCategory.subcategories.map((data) => (
                <Link key={data.slug} href={`/${category}/${data.slug}`} className="w-full">
                  <div className="group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all w-full text-center p-4 cursor-pointer hover:border-orange-400 hover:-translate-y-1 duration-300">
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-3 bg-gray-100">
                      <Image
                        src={`/assests/category/${category}/${data.slug}.jpg`}
                        alt={data.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors truncate">
                      {data.name}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Businesses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {businessesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <BusinessSkeleton key={idx} />
            ))}
          </div>
        ) : businessesError ? (
          <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {businesses?.data?.length > 0 ? (
              businesses.data.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col"
                >
                  {/* Business Image */}
                  <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={business?.images?.[0] || "/image.png"}
                      alt={business?.name || "Business Image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Business Info */}
                  <div className="flex flex-col gap-2 flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{business.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {(business.address || "Address")}, {(business.landmark || "Landmark")}, {(business.sector || "Sector")}, {(business.area || "Area")}
                    </p>
                    <div className='flex gap-6'>
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-600 font-medium">
                        <IoCallSharp className="text-blue-600" />
                        <a href={`tel:${business.phone}`} className="hover:underline">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Timings */}
                  {business.timings && business.timings.length > 0 && (
                    <div className="mt-3 border-t pt-2 text-xs text-gray-600">
                      <div className="font-semibold mb-1 text-gray-700">Timings:</div>
                      <ul className="space-y-1">
                        {business.timings.map((timing, idx) => (
                          <li key={idx}>
                            {timing.day}: {timing.open} - {timing.close}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Website */}
                  <div className="mt-2 border-b pb-5 border-gray-300 ">
                    {business.website && (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline block">
                        🌐 {business.website}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <Link href={`/listinginfo/${business.slug}`}>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs shadow flex items-center">
                        <FcFinePrint className="text-xl mr-1" />
                        View Details
                      </button>
                    </Link>

                    {business.wp_number && (
                      <a
                        href={`https://wa.me/+91${business.wp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs shadow flex items-center gap-2"
                      >
                        <TbBrandWhatsapp className="text-lg" />
                        {business.wp_number}
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 font-semibold py-10">No Businesses Found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
