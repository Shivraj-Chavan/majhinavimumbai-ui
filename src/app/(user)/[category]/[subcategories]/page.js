"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcFinePrint, FcRating } from "react-icons/fc";
import { IoLocationOutline } from "react-icons/io5";
import FilterBar from "../../components/categorylisting/Filterbar";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import { SlCallIn } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "@/redux/slice/bussinessSlice";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import { apiGet } from "@/lib/apiClient";

export default function Page({ params }) {
  const { category, subcategories, id } = use(params);
  const [business, setBusiness] = useState(null);
  const [loadingg, setLoadingg] = useState(true);
  const [errorr, setErrorr] = useState(null);
  const dispatch = useDispatch();

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const { businesses, loading: businessesLoading, error: businessesError } = useSelector((state) => state.businesses);

        useEffect(() => {
          if (category && subcategories) {
            dispatch(fetchBusinesses({categorySlug:category,subcategoryslug:subcategories }));
          }
        }, [dispatch, category, subcategories]);

        useEffect(() => {
          if (categories.length === 0) {
            dispatch(fetchCategories());
          }
        }, [dispatch, categories.length]);

        useEffect(() => {
          const fetchBusiness = async () => {
            try {
              const data = await apiGet(`/businesses/${id}`);
              console.log('getbussiness',data);
              setBusiness(data);
            } catch (err) {
              setErrorr(err.message || "Something went wrong");
            } finally {
              setLoadingg(false);
            }
          };
        
          if (id) fetchBusiness();
        }, [id]);

    
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

  const listings = [
    {
      id: 1,
      name: "Cafe Creme",
      description: "Tasty treats and great coffee",
      location: "Vashi",
      ratings: "3.5",
      totalRatings: 120,
      contact: "6543209725",
    },
    {
      id: 2,
      name: "SkyLounge Hotel",
      description: "Enjoy a luxurious stay with premium amenities.",
      location: "Kharghar",
      ratings: "4.4",
      totalRatings: 130,
      contact: "9876543210",
    },
    {
      id: 3,
      name: "Food Corner",
      description: "Best burgers in town",
      location: "Panvel",
      ratings: "5",
      totalRatings: 90,
      contact: "9123456780",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        {/* <Link
          href={`/${category}`}
          className="inline-block mb-2 text-blue-600 hover:underline"
        >
          ← Back to {category}
        </Link> */}

        <h1 className="text-4xl font-bold text-blue-900 capitalize">
          {subcategories.replace(/-/g, " ")} Listings
        </h1>
        <p className="text-gray-600 mt-2">
          Browse top businesses in this subcategory.
        </p>
        <div className="mt-7 flex justify-center">
          <FilterBar />
        </div>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="text-center text-red-500 font-medium text-lg">
          No listings found in this subcategory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-xl hover:shadow-2xl transition rounded-3xl p-5 flex flex-col sm:flex-row gap-6 border border-gray-100"
            >
              {/* Image */}
              <div className="relative items-center w-full sm:w-48 h-40 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src='/resto.jpeg'
                  alt={listing.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-blue-800">
                  {listing.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {listing.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className="text-blue-600" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FcRating />
                    <span>{listing.ratings} ★({listing.totalRatings} ratings)</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <SlCallIn/> 
                    <span>{listing.contact}</span>
                  </div>
                </div>

              {/* view, wp, share btn */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <Link
                    href={`/listingInfo/${listing.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
                  >
                    <FcFinePrint className="text-xl" />
                    View Details
                  </Link>

                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
                    <TbBrandWhatsapp className="text-xl" />
                    Whatsapp
                  </button>

                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform">
                    <TfiShare className="text-xl" />
                    Share
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
      
       {/* Businesses Card Section */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-500 uppercase mb-10 tracking-wide">
          Explore Businesses
        </h2>

        {businessesLoading ? (
          <div className="text-center py-10 font-semibold">Loading Businesses...</div>
        ) : businessesError ? (
          <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
        ) : (
          <div className="space-y-6">
            {businesses?.data?.length > 0 ? (
              businesses?.data?.map((business) => (
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
                {/* Business Image */}
                <div key={business.id} className="relative w-full sm:w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={business.imageUrl || "/default-business.jpg"}
                    alt={business.name || "Business Image"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Business Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {(business.address || "Address")}, {(business.landmark || "Landmark")}
                    </p>
                    <p className="text-sm text-gray-600">Pin Code: {business.pin_code}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700">📞 {business.phone}</p>
                      {business.wp_number && <p className="text-sm text-green-600">🟢 WhatsApp: {business.wp_number}</p>}
                      {business.email && <p className="text-sm text-blue-600">📧 {business.email}</p>}
                    </div>
                  </div>

                  {/* Website + Action Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        🌐 Visit Website
                      </a>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Link href={`/listingInfo/${business.id}`}>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
                          <FcFinePrint className="text-xl mr-1" />
                          View Details
                        </button>
                      </Link>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
                        <TbBrandWhatsapp className="text-xl mr-1" />
                        Whatsapp
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
                        <TfiShare className="text-xl mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
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
