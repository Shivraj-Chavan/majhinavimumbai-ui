"use client";

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCategories } from '@/redux/slice/categoriesSlice';
import { fetchBusinesses } from '@/redux/slice/bussinessSlice';

export default function Page({ params }) {
  const { category } = use(params);
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector((state) => state.businesses );

      useEffect(()=>{
        if(category){
          // alert()
          dispatch(fetchBusinesses({categorySlug:category}))
        }
      console.log({businesses})
      },[category])

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

        <div className="bg-blue-900/10 py-10 px-4 sm:px-6 lg:px-8 rounded-3xl">
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 place-items-center">
        {selectedCategory.subcategories.map((data) => (
        <Link key={data.slug} href={`/${category}/${data.slug}`} className="w-full">
          <div className="group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all w-full text-center p-4 cursor-pointer hover:border-orange-400 hover:-translate-y-1 duration-300">
          
          {/* Subcategory Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-3 bg-gray-100">
            <Image
              src={`/assests/category/${category}/${data.slug}.jpg`} 
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Subcategory Name */}
          <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors truncate">
            {data.name}
          </p>
          
        </div>
      </Link>
    ))}
  </div>
</div>

      </div>

        {/* Businesses Card Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 uppercase mb-10 tracking-wide">
            Explore Businesses
          </h2>

          {businessesLoading ? (
            <div className="text-center py-10 font-semibold">Loading Businesses...</div>
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
                      src={business.imageUrl || "/default-business.jpg"}
                      alt={business.name || "Business Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                
                  {/* Business Info */}
                  <div className="flex flex-col gap-2 flex-grow">
                    {/* Business Name */}
                    <h3 className="text-lg font-bold text-gray-800 truncate">{business.name || "Business Name"}</h3>
                
                    {/* Full Address */}
                    <p className="text-sm text-gray-500 truncate">
                      {(business.address || "Address")}, {(business.landmark || "Landmark")}, {(business.sector || "Sector")}, {(business.area || "Area")}
                    </p>
                
                    {/* Pincode */}
                    <p className="text-sm text-gray-500">
                      Pin Code: {business.pin_code || "Pin Code"}
                    </p>
                
                    {/* Phone */}
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600 font-medium">
                      📞 {business.phone || "Phone number"}
                    </div>
                
                    {/* WhatsApp */}
                    {business.wp_number && (
                      <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                        🟢 WhatsApp: {business.wp_number}
                      </div>
                    )}
                
                    {/* Email */}
                    {business.email && (
                      <a href={`mailto:${business.email}`} className="text-sm text-blue-500 hover:underline">
                        📧 {business.email}
                      </a>
                    )}
                  </div>
                
                  {/* Timings */}
                  {business.timings && business.timings.length > 0 && (
                    <div className="mt-3 border-t pt-2 text-xs text-gray-600">
                      <div className="font-semibold mb-1 text-gray-700">Timings:</div>
                      <ul className="space-y-1">
                        {business.timings.map((timing, idx) => (
                          <li key={idx}>
                            {timing.day || "Day"}: {timing.open || "09:00"} - {timing.close || "18:00"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                
                  {/* Website */}
                  <div className="mt-4 border-t pt-3">
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs hover:underline block"
                      >
                        🌐 Visit Website
                      </a>
                    )}
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center text-gray-500 font-semibold py-10">
                  No Businesses Found.
                </div>
              )}
            </div>
          )}
        </div>


          </div>
        );
      }
