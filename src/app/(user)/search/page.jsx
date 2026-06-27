// "use client";

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { apiGet } from "@/lib/apiClient";
// import Image from "next/image";
// import { FaWhatsapp } from "react-icons/fa";
// import { IoIosCall } from "react-icons/io";
// import { ImMail4 } from "react-icons/im";
// import { FcFinePrint } from "react-icons/fc";
// import Link from "next/link";
// import { TbBrandWhatsapp } from "react-icons/tb";
// import { TfiShare } from "react-icons/tfi";
// import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
// import CONFIG from "@/constance";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query") || "";
//   const location = searchParams.get("location") || "";
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) return;
//       setLoading(true);
//       try {
//         const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}&location=${location}`);
//         console.log('On search',res);
//         setResults(res.data || []);
//       } catch (err) {
//         console.error("Search failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query]);
  
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="px-4 py-6 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
//         Search results for: <span className="text-blue-600">"{query}"</span>
//       </h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : results.length > 0 ? (
//         <div className="space-y-6 mt-10">
//           {results.map((business) => (
//             <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row gap-4 border border-gray-200">
//               <div className="relative w-full sm:w-48 h-40 rounded-xl mt-5 overflow-hidden bg-gray-100 flex-shrink-0">
//                 <Image
//                     src={business?.image_url ? `${CONFIG.IMAGE_BASE_URL}${business?.image_url}`   :"/image.png"}
//                     alt={business.name || "Business Image"}
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               <div className="flex-1 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {(business.address || "Address")}, {(business.landmark || "Landmark")}
//                   </p>
//                   <p className="text-sm text-gray-600">Pin Code: {business.pin_code}</p>
//                   <div className="mt-2 space-y-1">
//                     {business.phone && (
//                       <p className="flex items-center gap-2 text-sm text-gray-700">
//                         <IoIosCall className="text-lg text-blue-600" />
//                         <a href={`tel:${business.phone}`} className="hover:underline">
//                           {business.phone}
//                         </a>
//                       </p>
//                     )}
//                     {business.wp_number && (
//                       <p className="flex items-center gap-2">
//                         <FaWhatsapp className="text-green-500 text-md" />
//                         <a
//                           href={`https://wa.me/91${business.wp_number}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-green-600 text-sm"
//                         >
//                           {business.wp_number}
//                         </a>
//                       </p>
//                     )}
//                     {business.email && (
//                       <p className="flex items-center gap-2 text-sm text-gray-700">
//                         <ImMail4 className="text-red-600 text-lg" />
//                         <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
//                           {business.email}
//                         </a>
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-2 flex flex-col gap-2">
//                   {business.website && (
//                     <a
//                       href={business.website}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-500 hover:underline"
//                     >
//                       🌐 {business.website}
//                     </a>
//                   )}

//                   <div className="flex flex-wrap gap-2 mt-2">
//                     <Link href={`/listinginfo/${business.slug}`}>
//                       <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
//                         <FcFinePrint className="text-xl mr-1" />
//                         View Details
//                       </button>
//                     </Link>
//                     {business.wp_number && (
//                       <a
//                         href={`https://wa.me/+91${business.wp_number}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105"
//                       >
//                         <TbBrandWhatsapp className="text-xl" />
//                         WhatsApp
//                       </a>
//                     )}
//                     <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm shadow flex items-center">
//                       <TfiShare className="text-xl mr-1" />
//                       Share
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No businesses found for this search.</p>
//       )}

//        {/* Pagination */}
//             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//     </div>
//   );
// }
























"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/apiClient";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { ImMail4 } from "react-icons/im";
import { FcFinePrint } from "react-icons/fc";
import Link from "next/link";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TfiShare } from "react-icons/tfi";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
import CONFIG from "@/constance";

/* ── Plan / Verified Badge ── */
const PlanBadge = ({ plan }) => {
  if (!plan || plan === "free" || plan === "") return null;

  const label =
    plan === "premium" ? "Premium" :
    plan === "gold"    ? "Gold"    :
    plan === "silver"  ? "Silver"  : "Verified";

  const styles = {
    premium: { bg: "#FFF3EB", border: "#FFB380", text: "#CC4400", dot: "#FF6B00" },
    gold:    { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E", dot: "#F59E0B" },
    silver:  { bg: "#F1F5F9", border: "#CBD5E1", text: "#334155", dot: "#64748B" },
  };
  const s = styles[plan] || styles.premium;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
      style={{ background: s.bg, border: `0.5px solid ${s.border}`, color: s.text }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={s.dot}
           strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l2.4 4.9 5.6.8-4 3.9.9 5.4L12 14.4l-4.9 2.6.9-5.4-4-3.9 5.6-.8z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
      {label}
    </span>
  );
};

/* ── Main Page ── */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const location = searchParams.get("location") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}&location=${location}`);
        console.log('On search', res);
        setResults(res.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F9F9F9" }}>

      {/* ── Header ── */}
      <div className="relative overflow-hidden" style={{ background: "#FF6B00" }}>
        <span className="absolute -top-6 -right-6 w-36 h-36 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.08)" }} />
        <span className="absolute -bottom-4 left-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-7 sm:py-9 text-center">
          <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Search Results
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
            Results for{" "}
            <span className="px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.18)" }}>
              "{query}"
            </span>
          </h1>
          {location && (
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.75)" }}>
              📍 {location}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-6 md:px-8 lg:px-16">

        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <div className="space-y-3 mt-4">
            {results.map((business) => {
              const isPaid =
                business.plan &&
                business.plan !== "free" &&
                business.plan !== null &&
                business.plan !== "";

              return (
                <div
                  key={business.id}
                  className="group bg-white rounded-xl overflow-hidden flex flex-row relative transition-all duration-200"
                  style={{
                    border: isPaid ? "1px solid #FFB380" : "0.5px solid #E8E8E8",
                    boxShadow: isPaid
                      ? "0 2px 12px rgba(255,107,0,0.09)"
                      : "0 1px 6px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = isPaid
                      ? "0 4px 20px rgba(255,107,0,0.18)"
                      : "0 4px 16px rgba(0,0,0,0.09)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = isPaid
                      ? "0 2px 12px rgba(255,107,0,0.09)"
                      : "0 1px 6px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Verified top stripe */}
                  {isPaid && (
                    <span
                      className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
                      style={{ background: "linear-gradient(90deg,#FF6B00,#FFB380,#FF6B00)" }}
                    />
                  )}

                  {/* ── Image ── */}
                  <div
                    className="relative flex-shrink-0 bg-orange-50 overflow-hidden"
                    style={{ width: "110px", minHeight: "130px" }}
                  >
                    <Image
                      src={business?.image_url ? `${CONFIG.IMAGE_BASE_URL}${business?.image_url}` : "/image.png"}
                      alt={business.name || "Business Image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isPaid && (
                      <span
                        className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded-full pointer-events-none"
                        style={{ background: "#FF6B00", fontSize: "10px", fontWeight: 500 }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white"
                             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2l2.4 4.9 5.6.8-4 3.9.9 5.4L12 14.4l-4.9 2.6.9-5.4-4-3.9 5.6-.8z"/>
                          <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        ✓
                      </span>
                    )}
                  </div>

                  {/* ── Content ── */}
                  <div className="flex-1 flex flex-col justify-between px-3 py-3 min-w-0">
                    <div>
                      {/* Name + PlanBadge */}
                      <div className="flex justify-between items-center gap-1.5 flex-wrap mb-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                          {business.name}
                        </h3>
                        <PlanBadge plan={business.plan} />
                      </div>

                      {/* Address — original logic */}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(business.address || "Address")}, {(business.landmark || "Landmark")}
                      </p>
                      <p className="text-xs text-gray-400">Pin Code: {business.pin_code}</p>

                      {/* Contacts — original logic */}
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {business.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-700">
                            <IoIosCall className="text-blue-600 text-sm flex-shrink-0" />
                            <a href={`tel:${business.phone}`} className="hover:underline">
                              {business.phone}
                            </a>
                          </p>
                        )}
                        {business.wp_number && (
                          <p className="flex items-center gap-1">
                            <FaWhatsapp className="text-green-500 text-xs flex-shrink-0" />
                            <a
                              href={`https://wa.me/91${business.wp_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 text-xs"
                            >
                              {business.wp_number}
                            </a>
                          </p>
                        )}
                        {business.email && (
                          <p className="flex items-center gap-1 text-xs text-gray-700">
                            <ImMail4 className="text-red-600 text-xs flex-shrink-0" />
                            <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline truncate max-w-[140px]">
                              {business.email}
                            </a>
                          </p>
                        )}
                      </div>

                      {/* Website — original logic */}
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1.5 text-xs text-blue-500 hover:underline truncate max-w-[200px]"
                        >
                          🌐 {business.website}
                        </a>
                      )}
                    </div>

                    {/* Action Buttons — original logic */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                      <Link href={`/listinginfo/${business.slug}`}>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
                          style={{ background: "#FF6B00" }}
                        >
                          <FcFinePrint className="text-sm" />
                          View Details
                        </button>
                      </Link>

                      {business.wp_number && (
                        <a
                          href={`https://wa.me/+91${business.wp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
                          style={{ background: "#22C55E" }}
                        >
                          <TbBrandWhatsapp className="text-sm" />
                          WhatsApp
                        </a>
                      )}

                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 active:scale-95"
                        style={{ border: "0.5px solid #E8E8E8", color: "#6B7280", background: "transparent" }}
                      >
                        <TfiShare className="text-xs" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No businesses found for this search.</p>
        )}

        {/* Pagination — original logic */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}