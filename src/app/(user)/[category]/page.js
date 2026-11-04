"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCategories } from '@/redux/slice/categoriesSlice';
import { fetchBusinesses } from '@/redux/slice/bussinessSlice';
import { FcFinePrint } from 'react-icons/fc';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { IoCallSharp } from 'react-icons/io5';
import { useParams, useRouter } from 'next/navigation';
import CONFIG from '@/constance';
import Pagination from '@/app/(admin)/admin/components/usercomp/Pagination';


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


function BannerCarousel({ slides, fallbackSrc, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeIndex];

  const bannerContent = (
    <img
      src={currentSlide?.src || fallbackSrc}
      alt={currentSlide?.title || "Category banner"}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackSrc;
      }}
    />
  );

  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${className}`}>
      {currentSlide?.href ? (
        <a
          href={currentSlide.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {bannerContent}
        </a>
      ) : (
        bannerContent
      )}

      {slides.length > 1 && (
        <>
    

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export default function Page() {
  const { category } = useParams();
  const dispatch = useDispatch();
  
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryBanners, setCategoryBanners] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);

  const { categories = [], loading, error } = useSelector(
    (state) => state.categories
  );

  const {
    businesses,
    loading: businessesLoading,
    error: businessesError,
  } = useSelector((state) => state.businesses);

  const limit = 20;

  // IMPORTANT: Declare selectedCategory before using it anywhere.
  const selectedCategory = categories.find(
    (data) => data.slug === category
  );

  // Default category image
  const defaultBanner = selectedCategory
    ? `/assests/categories/${selectedCategory.slug}.jpg`
    : "/image.png";

  // Construct banner image URL
  const getBannerImage = (image) => {
    if (!image) return defaultBanner;

    const value = String(image).trim();

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const base = String(CONFIG.IMAGE_BASE_URL || "").replace(/\/+$/, "");
    const filename = value.replace(/^\/+/, "");

    if (!base) return `/${filename}`;

    if (filename.startsWith("images/")) {
      return `${base}/${filename}`;
    }

    if (filename.startsWith("uploads/")) {
      return `${base}/${filename}`;
    }

    return `${base}/uploads/ads/${filename}`;
  };

  // Fetch businesses
  useEffect(() => {
    if (category) {
      dispatch(
        fetchBusinesses({
          categoryslug: category,
          page: currentPage,
          limit,
        })
      );
    }
  }, [dispatch, category, currentPage]);

  // Fetch categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
    setCategoryBanners([]);
  }, [category]);

  // Fetch category banners
  useEffect(() => {
    if (!selectedCategory?.id) return;

    const controller = new AbortController();

    const getCategoryBanners = async () => {
      try {
        setBannerLoading(true);
        setCategoryBanners([]);

        const API_BASE = String(CONFIG.API_BASE_URL || "").replace(
          /\/+$/,
          ""
        );

        if (!API_BASE) {
          throw new Error("CONFIG.API_BASE_URL is missing");
        }

        const response = await fetch(
          `${API_BASE}/AdPayment/category/${selectedCategory.id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Banner API failed with status ${response.status}`
          );
        }

        const result = await response.json();

        console.log("CATEGORY BANNER API RESPONSE:", result);

        const banners = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
          ? result.data.data
          : [];

        setCategoryBanners(banners);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Category banner error:", err);
          setCategoryBanners([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setBannerLoading(false);
        }
      }
    };

    getCategoryBanners();

    return () => controller.abort();
  }, [selectedCategory?.id]);

  // Update pagination
  useEffect(() => {
    if (businesses?.totalPages) {
      setTotalPages(businesses.totalPages);
    } else {
      setTotalPages(1);
    }
  }, [businesses]);

  // Desktop banners
  const desktopSlides = categoryBanners
    .filter((banner) => banner.image_desktop)
    .map((banner) => ({
      src: getBannerImage(banner.image_desktop),
      href: banner.redirect_url,
      title: banner.title,
    }));

  // Mobile banners
  const mobileSlides = categoryBanners
    .filter(
      (banner) => banner.image_mobile || banner.image_desktop
    )
    .map((banner) => ({
      src: getBannerImage(
        banner.image_mobile || banner.image_desktop
      ),
      href: banner.redirect_url,
      title: banner.title,
    }));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );
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

      {/* Category Banner Section */}
      <div className="w-full bg-gray-50">

        {!selectedCategory ? (
          <div className="w-full h-[120px] sm:h-[160px] bg-gray-300 animate-pulse " />
        ) : (
          <>
            {/* Desktop Banner */}
            <div className="hidden sm:block max-w-8xl mx-auto">
              <BannerCarousel
                slides={
                  desktopSlides.length > 0
                    ? desktopSlides
                    : [
                        {
                          src: defaultBanner,
                          title: selectedCategory.name,
                        },
                      ]
                }
                fallbackSrc={defaultBanner}
                className="h-[150px] md:h-[180px] lg:h-[210px]"
              />
            </div>

            {/* Mobile Banner */}
            <div className="block sm:hidden w-full">
              <BannerCarousel
                slides={
                  mobileSlides.length > 0
                    ? mobileSlides
                    : [
                        {
                          src: defaultBanner,
                          title: selectedCategory.name,
                        },
                      ]
                }
                fallbackSrc={defaultBanner}
                className="h-[120px] sm:h-[140px]"
              />
            </div>
          </>
        )}
      </div>

      {/* Subcategory Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-900/10 py-10 px-4 sm:px-6 lg:px-8 rounded-3xl">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 place-items-center">

            {loading || !selectedCategory ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <SubcategorySkeleton key={idx} />
              ))
            ) : (
              (selectedCategory.subcategories || []).map((data) => (
                <Link
                  key={data.slug}
                  href={`/${category}/${data.slug}`}
                  className="w-full"
                >
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {businessesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <BusinessSkeleton key={idx} />
            ))}
          </div>
        ) : businessesError ? (
          <div className="text-center py-10 text-red-500 font-semibold">
            {businessesError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {businesses?.data?.length > 0 ? (
           businesses.data.map((business) => (
            <div
              key={business.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/listinginfo/${business.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/listinginfo/${business.slug}`);
                }
              }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all p-4 flex flex-col cursor-pointer"
            >
              {/* Business Image */}
              <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={
                    business?.image_url
                      ? `${CONFIG.IMAGE_BASE_URL}${business.image_url}`
                      : "/image.png"
                  }
                  alt={business?.name || "Business Image"}
                  fill
                  className="object-cover"
                />
              </div>
          
              {/* Business Info */}
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {business.name}
                </h3>
          
                <p className="text-sm text-gray-500 truncate">
                  {business.address || "Address"},{" "}
                  {business.landmark || "Landmark"},{" "}
                  {business.sector || "Sector"},{" "}
                  {business.area || "Area"}
                </p>
          
                {/* Phone */}
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600 font-medium">
                  <IoCallSharp className="text-blue-600" />
          
                  <a
                    href={`tel:${business.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
          
              {/* Timings */}
              {business.timings?.length > 0 && (
                <div className="mt-3 border-t pt-2 text-xs text-gray-600">
                  <div className="font-semibold mb-1 text-gray-700">
                    Timings:
                  </div>
          
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
              <div className="mt-2 border-b pb-5 border-gray-300">
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-500 text-sm hover:underline block"
                  >
                    🌐 {business.website}
                  </a>
                )}
              </div>
          
              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
          
                {/* View Details */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/listinginfo/${business.slug}`);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs shadow flex items-center"
                >
                  <FcFinePrint className="text-xl mr-1" />
                  View Details
                </button>
          
                {/* WhatsApp */}
                {business.wp_number && (
                  <a
                    href={`https://wa.me/91${business.wp_number}?text=${encodeURIComponent(
                      "Found you on majhinavimumbai.com and your services are exactly what I've been looking for."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
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
              <div className="text-center text-gray-500 font-semibold py-10">
                No Businesses Found.
              </div>
            )}

          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </div>
  );
}
