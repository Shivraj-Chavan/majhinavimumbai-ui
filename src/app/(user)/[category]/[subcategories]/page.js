// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FcFinePrint } from "react-icons/fc";
// import { TbBrandWhatsapp } from "react-icons/tb";
// import { TfiShare } from "react-icons/tfi";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBusinesses } from "@/redux/slice/bussinessSlice";
// import { fetchCategories } from "@/redux/slice/categoriesSlice";
// import FilterBar from "../../components/categorylisting/Filterbar";
// import { FaWhatsapp } from "react-icons/fa";
// import { IoIosCall } from "react-icons/io";
// import { ImMail4 } from "react-icons/im";
// import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
// import CONFIG from "@/constance";
// import ShareButton from "../../components/categorylisting/Sharebtn";

// const SkeletonCard = () => (
//   <div className="animate-pulse bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
//     <div className="w-full sm:w-48 h-40 bg-gray-300 rounded-xl"></div>
//     <div className="flex-1 space-y-3">
//       <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//       <div className="flex gap-2 mt-4">
//         <div className="h-8 w-24 bg-gray-300 rounded"></div>
//         <div className="h-8 w-24 bg-gray-300 rounded"></div>
//         <div className="h-8 w-24 bg-gray-300 rounded"></div>
//       </div>
//     </div>
//   </div>
// );

// export default function Page({ params }) {
//   const { category, subcategories } = params;
//   const dispatch = useDispatch();
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);


//   const { categories = [], loading, error } = useSelector((state) => state.categories);
//   const { businesses, totalCount,  loading: businessesLoading, error: businessesError } = useSelector(
//     (state) => state.businesses
//   );

//   const limit = 20;
  

//   // shanpana
//   // useEffect(() => {
//   //   console.log({businesses})
//   //   if (businesses?.totalCount) {
//   //     const pages = Math.ceil(businesses.totalCount / limit);
//   //     setTotalPages(pages > 0 ? pages : 1);
//   //   }
//   // }, [businesses?.totalCount, limit]);
   
//      useEffect(() => {
//       console.log({businesses})
//          setTotalPages(businesses.totalPages || 0);
       
//      }, [businesses]);

//   useEffect(() => {
//     if (category && subcategories) {
//       dispatch(fetchBusinesses({ categorySlug: category, subcategoryslug: subcategories, page: currentPage, limit: limit, }));
//     }
//   }, [dispatch, category, subcategories, currentPage, limit]);

//   useEffect(() => {
//     if (categories.length === 0) {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categories.length]);

//   if (loading) {
//     return <div className="text-center py-10 font-semibold">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
//   }

//   const selectedCategory = categories.find((data) => data.slug === category);

//   if (!selectedCategory) {
//     return (
//       <div className="text-center text-red-500 font-semibold text-lg py-20">
//         Category not found.
//       </div>
//     );
//   }

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       {/* Header */}
//       <div className="text-center mb-2">
//         <div className="text-sm text-gray-600 mb-4 font-semibold">
//           <nav className="flex items-center space-x-2">
//             <Link href="/" className="hover:underline text-black">Home</Link>
//             <span>/</span>
//             <Link href={`/${category}`} className="hover:underline text-black capitalize">
//               {category.replace(/-/g, " ")}
//             </Link>
//             <span>/</span>
//             <span className="text-gray-800 capitalize">{subcategories.replace(/-/g, " ")}</span>
//           </nav>
//         </div>

//         <div className="text-center mb-2">
//           <h1 className="text-4xl font-bold text-blue-900 capitalize">
//             {subcategories.replace(/-/g, " ")}
//           </h1>
//           <p className="text-gray-600 mt-1">Browse top businesses in this subcategory.</p>
//         </div>

//         {/* FilterBar */}
//       <div className="flex justify-center md:justify-end mt-2">
//         <FilterBar onSortChange={(order) => setSortOrder(order)} />
//       </div>
//       </div>

//       {/* Listings */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
//         {businessesLoading ? (
//           <div className="space-y-6">
//             {Array.from({ length: 10 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ) : businessesError ? (
//           <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
//         ) : businesses?.data?.length > 0 ? (
//           <div className="space-y-6">
//             {[...businesses.data]
//               .sort((a, b) => {
//                 if (!a.name || !b.name) return 0;
//                 return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
//               })
//               .map((business) => (
//                 <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
//                   <div className="relative w-full sm:w-48 h-40 rounded-xl mt-5 overflow-hidden bg-gray-100 flex-shrink-0">
//                   <Link href={`/listinginfo/${business.slug}`}>
//                     <Image                      
//                     src={business?.image_url ? `${CONFIG.IMAGE_BASE_URL}${business?.image_url}`   :"/image.png"}
//                     alt={business.name || "Business Image"} fill className="object-cover" />
                    
//                   </Link>
//                   </div>

//                   <div className="flex-1 flex flex-col justify-between">
                    
//                   <div>
//                     <Link href={`/listinginfo/${business.slug}`}>
//                       <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
//                       </Link>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {(business.address)}, {(business.area)}, {(business.landmark)}
//                       </p>
//                       <p className="text-sm text-gray-600">Pin Code: {business.pin_code}</p>

                     
//                       <div className="mt-2 space-y-1">
//                         {business.phone && (
//                           <p className="flex items-center gap-2 text-sm text-gray-700">
//                             <IoIosCall className="text-lg text-blue-600" />
//                             <a href={`tel:${business.phone}`} className="hover:underline">
//                               {business.phone}
//                             </a>
//                           </p>
//                         )}
//                         {business.wp_number && (
//                           <p className="flex items-center gap-2">
//                             <FaWhatsapp className="text-green-500 text-md" />
//                             <a href={`https://wa.me/91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-sm">
//                               {business.wp_number}
//                             </a>
//                           </p>
//                         )}
//                         {business.email && (
//                           <p className="flex items-center gap-2 text-sm text-gray-700">
//                             <ImMail4 className="text-red-600 text-lg" />
//                             <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
//                               {business.email}
//                             </a>
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="mt-2 flex flex-col gap-2">
//                       {business.website && (
//                         <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
//                           🌐 {business.website}
//                         </a>
//                       )}

//                       <div className="flex flex-wrap gap-2 mt-2">
//                       <Link href={`/listinginfo/${business.slug}`}>
//                       <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 cursor-pointer rounded-md text-sm shadow flex items-center gap-1 transition-all hover:scale-105">
//                         <FcFinePrint className="text-xl" />
//                         View Details
//                       </button>
//                     </Link>

//                     <a
//                       href={`https://wa.me/+91${business.wp_number}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 cursor-pointer rounded-md text-sm shadow flex items-center gap-1 transition-all hover:scale-105"
//                     >
//                       <TbBrandWhatsapp className="text-xl" />
//                       WhatsApp
//                     </a>
//                         {/* <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
//                           <TfiShare className="text-xl mr-1" />
//                           Share
//                         </button> */}
//                         <ShareButton/>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 font-semibold py-10">No Businesses Found.</div>
//         )}
//       </div>

//       {/* Pagination */}
//       {
//         totalPages>0 &&
//       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//       }
//     </div>
//   );
// }







"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcFinePrint } from "react-icons/fc";
import { TbBrandWhatsapp } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "@/redux/slice/bussinessSlice";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import FilterBar from "../../components/categorylisting/Filterbar";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { ImMail4 } from "react-icons/im";
import { MdVerified } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
import CONFIG from "@/constance";
import ShareButton from "../../components/categorylisting/Sharebtn";
import { MapPin } from "lucide-react";
import PlanBadge from "../../components/planBadge";

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-gray-100 shadow-sm p-0 flex flex-col sm:flex-row overflow-hidden">
    <div className="w-full sm:w-44 h-44 bg-gray-200 flex-shrink-0" />
    <div className="flex-1 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-2/5" />
        <div className="h-5 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-px bg-gray-100 my-2" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        <div className="h-8 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);


// ─── Plan Tag (small pill in footer) ─────────────────────────────────────────

const PlanTag = ({ plan }) => {
  const label = plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase() : "Free";

  const styles = {
    free: "bg-gray-100 text-gray-400",
    basic: "bg-blue-50 text-blue-500",
    premium: "bg-emerald-50 text-emerald-600",
  };

  const key = (plan || "free").toLowerCase();
  const cls = styles[key] || styles.free;

  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
};

// ─── Business Card ────────────────────────────────────────────────────────────

const BusinessCard = ({ business }) => {
  const imageUrl = business?.image_url
    ? `${CONFIG.IMAGE_BASE_URL}${business.image_url}`
    : "/image.png";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col sm:flex-row overflow-hidden">
      {/* Image */}
      <div className="relative w-full sm:w-44 h-44 bg-gray-50 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100">
        <Link href={`/listinginfo/${business.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={business.name || "Business"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 min-w-0">
        {/* Top section */}
        <div>
          {/* Name + Badge */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <Link href={`/listinginfo/${business.slug}`}>
              <h3 className="  utext-base font-semibold text-gray-900 leading-snug hover:text-blue-700 transition-colors line-clamp-2">
                {business.name}
              </h3>
            </Link>
            <PlanBadge plan={business.plan} />
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mt-0.5">
          <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />

          <p className="text-xs text-gray-500 leading-relaxed ">
            {[business.address, business.area, business.landmark]
              .filter(Boolean)
              .join(", ")}
            {business.pin_code && (
              <span className="text-gray-400 ms-2">{business.pin_code}</span>
            )}
          </p>
        </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3" />

          {/* Contact rows */}
          <div className="flex flex-col gap-1.5">
            {business.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <IoIosCall className="text-blue-500 text-sm flex-shrink-0" />
                <a href={`tel:${business.phone}`} className="hover:underline hover:text-blue-700">
                  {business.phone}
                </a>
              </div>
            )}
            {business.wp_number && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FaWhatsapp className="text-emerald-500 text-sm flex-shrink-0" />
                <a
                  href={`https://wa.me/91${business.wp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-emerald-700"
                >
                  {business.wp_number}
                </a>
              </div>
            )}
            {business.email && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ImMail4 className="text-red-400 text-sm flex-shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:underline hover:text-blue-700 truncate">
                  {business.email}
                </a>
              </div>
            )}
            {business.website && (
              <div className="flex items-center gap-1.5 text-xs mt-0.5">
                <span className="text-gray-400">🌐</span>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {business.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Link href={`/listinginfo/${business.slug}`}>
            <button className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors">
              <FcFinePrint className="text-base" />
              View details
            </button>
          </Link>

          {business.wp_number && (
            <a
              href={`https://wa.me/+91${business.wp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <TbBrandWhatsapp className="text-base" />
              WhatsApp
            </a>
          )}

          <ShareButton />

            {/* Plan tag pushed to the right */}
            {/* <span className="ml-auto">
            <PlanTag plan={business.plan} />
          </span> */}

        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page({ params }) {
  const { category, subcategories } = params;
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { categories = [], loading, error } = useSelector((state) => state.categories);
  const {
    businesses,
    loading: businessesLoading,
    error: businessesError,
  } = useSelector((state) => state.businesses);

  const limit = 20;

  useEffect(() => {
    setTotalPages(businesses.totalPages || 0);
  }, [businesses]);

  useEffect(() => {
    if (category && subcategories) {
      dispatch(
        fetchBusinesses({
          categorySlug: category,
          subcategoryslug: subcategories,
          page: currentPage,
          limit,
        })
      );
    }
  }, [dispatch, category, subcategories, currentPage, limit]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return <div className="text-center py-10 font-semibold text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
  }

  const selectedCategory = categories.find((data) => data.slug === category);

  if (!selectedCategory) {
    return (
      <div className="text-center text-red-500 font-semibold text-lg py-20">
        Category not found.
      </div>
    );
  }

  const sortedBusinesses = businesses?.data
    ? [...businesses.data].sort((a, b) => {
        if (!a.name || !b.name) return 0;
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:underline text-gray-700">Home</Link>
        <span>/</span>
        <Link href={`/${category}`} className="hover:underline text-gray-700 capitalize">
          {category.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-gray-900 capitalize font-medium">
          {subcategories.replace(/-/g, " ")}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 capitalize leading-tight">
            {subcategories.replace(/-/g, " ")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse top businesses in this subcategory.
          </p>
        </div>
        <FilterBar onSortChange={(order) => setSortOrder(order)} />
      </div>

      {/* Listings */}
      {businessesLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : businessesError ? (
        <div className="text-center py-10 text-red-500 font-semibold">{businessesError}</div>
      ) : sortedBusinesses.length > 0 ? (
        <div className="space-y-4">
          {sortedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 font-medium">
          No businesses found in this category yet.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}