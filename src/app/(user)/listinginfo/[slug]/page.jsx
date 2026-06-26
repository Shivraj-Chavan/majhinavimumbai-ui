// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Actionbtn from "../../components/categorylisting/Actionbtn";
// import Info from "../../components/categorylisting/Info";
// import Tab from "../../components/categorylisting/Tab";
// import Photos from "../../components/categorylisting/Photos";
// import { TbBrandWhatsapp } from "react-icons/tb";
// import { TfiShare } from "react-icons/tfi";
// import { FcGlobe, FcDownRight, FcCallback, FcBookmark } from "react-icons/fc";
// import { PiChatText } from "react-icons/pi";
// import { apiGet } from "@/lib/apiClient";
// import UsersndMsg from "../../components/categorylisting/UsersndMsg";
// import Enquirymsg from "../../components/categorylisting/Enquirymsg";
// import Link from "next/link";
// import { IoIosCall } from "react-icons/io";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
// import ShareButton from "../../components/categorylisting/Sharebtn";
// import PlanBadge from "../../components/planBadge";


// // Skeleton loader kept same
// function SkeletonLoader() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 pt-10 animate-pulse">
//       <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>
//       <div className="bg-blue-100 rounded-3xl p-8 mb-10 relative overflow-hidden">
//         <div className="flex flex-col sm:flex-row gap-5 mb-6">
//           <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
//           <div className="flex-1 space-y-3 py-1">
//             <div className="h-8 bg-gray-300 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/4"></div>
//           </div>
//         </div>
//         <div className="h-48 bg-gray-300 rounded"></div>
//       </div>
//       <div className="flex justify-center gap-6 mb-9">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="w-20 h-12 bg-gray-300 rounded-full"></div>
//         ))}
//       </div>
//       <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
//         <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//         <div className="h-6 bg-gray-300 rounded w-full"></div>
//         <div className="h-6 bg-gray-300 rounded w-5/6"></div>
//         <div className="h-48 bg-gray-300 rounded"></div>
//       </div>
//     </div>
//   );
// }

// export default function ListingInfo() {
//   const params = useParams();
//   const slug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
//   const [business, setBusiness] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
//   const [showStickyHero, setShowStickyHero] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [refreshApi,setRefreshApi]=useState(0)
//   const [myReview,setMyReview]=useState(false)


//   useEffect(() => {
//     if (!slug) return;
//     const fetchBusiness = async () => {
//       try {
//         setLoading(true);

//         const data = await apiGet(`/businesses/s/${slug}`);
//         if (!data.business) throw new Error("Business not found.");
//         setBusiness(data.business);
        
//       } catch (err) {
//         setError("⏳ Business verification is in progress. Please allow 24–48 hours for completion."|| "Error loading business");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBusiness();
//   }, [slug,refreshApi]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const heroSection = document.getElementById("hero-section");
//       if (!heroSection) return;
//       const rect = heroSection.getBoundingClientRect();
//       setShowStickyHero(rect.bottom <= 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
  

//   const renderStars = (rating) => {
//     const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
//     const full = Math.max(0, Math.floor(safeRating));
//     const half = safeRating - full >= 0.5 ? 1 : 0;
//     const empty = 5 - full - half;

//     return (
//       <>
//         {[...Array(full)].map((_, i) => (
//           <FaStar key={`full-${i}`} className="text-yellow-400" />
//         ))}
//         {half === 1 && <FaStarHalfAlt className="text-yellow-400" />}
//         {[...Array(empty)].map((_, i) => (
//           <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
//         ))}
//       </>
//     );
//   };

//   if (loading) return <SkeletonLoader />;
//   if (error) return <div className="text-center text-2xl font-semibold text-green-700 py-25">{error}</div>;

//   return (
//     <div>
//       {/* breadcrumb */}
//       {business?.category && business?.subcategory && (
//         <div className="relative z-30 text-sm text-black px-4 md:px-0">
//           <nav className="flex items-center flex-wrap gap-2">
//             <Link href="/" className="hover:underline text-black font-semibold">Home</Link>
//             <span>/</span>
//             <Link href={`/category/${business.categorySlug || business.category}`} className="hover:underline text-black capitalize">
//               {business.category.replace(/-/g, " ")}
//             </Link>
//             <span>/</span>
//             <span className="text-gray-800 capitalize">{business.subcategory.replace(/-/g, " ")}</span>
//           </nav>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 pt-8">
//         {/* Hero Section */}
//         <div id="hero-section" className="relative bg-gradient-to-tr from-blue-50 to-blue-100 shadow-xl p-5 sm:p-8 rounded-3xl mt-4 mb-10 overflow-hidden">
//           <div className="absolute bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />

//           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div className="flex items-start gap-5">
//             <div className="p-0">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-4 border-blue-300 rounded-full flex items-center justify-center text-xl sm:text-2xl font-extrabold text-blue-700 shadow-lg shrink-0"> {business.name?.[0]}</div>
//         </div>


//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-1">{business.name}</h1>
//                 <PlanBadge plan={business.plan_name} />
//                 <p className="text-sm sm:text-base text-gray-600 mb-2">{business.category} {business.address}</p>
//                 {/* <div className="flex items-center gap-2">{renderStars(business.rating)}</div> */}
//               </div>
//             </div>

//             <div className="flex flex-wrap justify-center gap-3">
//               <button className="inline-flex items-center gap-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all" onClick={() => setShowEnquiryPopup(true)}>
//                 <PiChatText className="text-xl" /> Enquiry
//               </button>

//               {showEnquiryPopup && (
//                 <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto px-4 py-10">
//                   <div className="bg-white p-6 rounded-xl max-w-2xl w-full relative shadow-2xl">
//                     <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg" onClick={() => setShowEnquiryPopup(false)}>
//                       &times;
//                     </button>
//                     <Enquirymsg closePopup={() => setShowEnquiryPopup(false)} businessId={business.id} />
//                   </div>
//                 </div>
//               )}

//               <a href={`https://wa.me/+91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
//                 <TbBrandWhatsapp className="text-xl" /> WhatsApp
//               </a>

//               {/* <button onClick={handleShare} className="inline-flex items-center cursor-pointer gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
//                 <TfiShare className="text-lg" /> Share
//               </button> */}
//               <ShareButton/>
//             </div>
//           </div>

//           <div className="mt-8 relative">
//             <Photos business={business} />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap justify-center gap-5 mb-9">
//           <Actionbtn
//            href={
//             business.website?.startsWith("http")
//               ? business.website
//               : `https://${business.website}`
//           }
//           icon={<FcGlobe />} label="Website" isButton={false} ringColor="blue" />
//           {/* <Actionbtn href={`https://www.google.co.in/maps/search/?q=${encodeURIComponent(business.mapLink || business.name || "Your Business Location")}`} icon={<FcDownRight />} label="Directions" ringColor="gray" /> */}
//           {/* <Actionbtn
//             href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             icon={<FcDownRight />}
//             label="Directions"
//             ringColor="gray"
//           /> */}
//           <Actionbtn
//             href={
//               business?.latitude && business?.longitude
//                 ? `https://maps.google.com/?daddr=${business.latitude},${business.longitude}`
//                 : `https://maps.google.com/?q=${encodeURIComponent(business?.name || "Your Business Location")}`
//             }
//             target="_blank"
//           label="Directions"
//             rel="noopener noreferrer"
//             icon={<FcDownRight />}
//             ringColor="gray"
//           />                                                                                                                 

//           <Actionbtn href={`tel:${business.phone}`} icon={<FcCallback />} label="Call" ringColor="green" />
//           {/* <Actionbtn icon={<FcBookmark />} label="Save" ringColor="orange" isButton /> */}
//         </div>

//         <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8">
//         {/* <Info hours={business.timings} /> */}
//           <div className="mt-2">
//           <Tab setRefreshApi={setRefreshApi} setMyReview={setMyReview} business={business} renderStars={renderStars} businessOwnerId={business?.owner_id} currentUserId={currentUserId}/>

//           </div>
//           <div className="mt-12">
//             <UsersndMsg myReview={myReview} setRefreshApi={setRefreshApi} setReviews={setReviews} businessId={business.id} />
//           </div>
//         </div>

//         {/* Sticky Bottom Hero Bar */}
//         {showStickyHero && (
//           <div className="fixed bottom-0 left-0 w-full bg-gradient-to-tr from-blue-50 to-blue-300 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 px-4 py-3">
//             <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
//               <div className="flex items-center gap-3 mb-2 sm:mb-0">
//                 <div className="w-14 h-14 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center text-lg font-bold text-blue-700 shadow">{business.name?.[0]}</div>
//                 <div className="text-base sm:text-lg">
//                   <div className="font-semibold text-blue-900">{business.name}</div>
//                   <div className="text-gray-500 text-xs">{business.category}</div>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <a href={`tel:${business.phone}`} className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-full text-sm font-medium flex items-center gap-2 shadow hover:bg-blue-600 transition">
//                   <IoIosCall className="text-lg" /> Call
//                 </a>
//                 <button onClick={() => setShowEnquiryPopup(true)} className="inline-flex  cursor-pointer items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all">
//                   <PiChatText className="text-xl" /> Enquiry
//                 </button>
//                 <ShareButton/>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Actionbtn from "../../components/categorylisting/Actionbtn";
import Tab from "../../components/categorylisting/Tab";
import Photos from "../../components/categorylisting/Photos";
import { TbBrandWhatsapp } from "react-icons/tb";
import { FcGlobe, FcDownRight, FcCallback } from "react-icons/fc";
import { PiChatText } from "react-icons/pi";
import { apiGet } from "@/lib/apiClient";
import UsersndMsg from "../../components/categorylisting/UsersndMsg";
import Enquirymsg from "../../components/categorylisting/Enquirymsg";
import Link from "next/link";
import { IoIosCall } from "react-icons/io";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ShareButton from "../../components/categorylisting/Sharebtn";
import PlanBadge from "../../components/planBadge";
import { MdLocationOn, MdPhone, MdLanguage, MdShare } from "react-icons/md";
import { HiOutlineChevronRight } from "react-icons/hi";

// ─── Color map for business initial avatar ────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#E8F0FE", text: "#1A73E8" },
  { bg: "#E6F4EA", text: "#1E8E3E" },
  { bg: "#FEF7E0", text: "#F9AB00" },
  { bg: "#FCE8E6", text: "#D93025" },
  { bg: "#F3E8FD", text: "#9334E6" },
  { bg: "#E8F5E9", text: "#2E7D32" },
];

function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className="bg-white min-h-screen">
      <div className="w-full h-[260px] bg-gray-100 animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[360px] shrink-0 space-y-5 animate-pulse">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-200 rounded-full w-4/5" />
              <div className="h-4 bg-gray-100 rounded-full w-3/5" />
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 flex-1 bg-gray-100 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded-full" style={{ width: `${85 - i * 12}%` }} />
            ))}
          </div>
        </div>
        <div className="flex-1 animate-pulse space-y-4 pt-2">
          <div className="h-10 bg-gray-100 rounded-full w-2/3" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: `${100 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vertical action button (Google Maps style) ───────────────────────────────
function ActionPill({ href, onClick, icon, label, variant = "default" }) {
  const variantStyles = {
    default: "bg-[#E8F0FE] text-[#1A73E8] hover:bg-[#D2E3FC]",
    green:   "bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#CEEAD6]",
    gray:    "bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E8EAED]",
    orange:  "bg-[#FEF3E2] text-[#E37400] hover:bg-[#FDE9C3]",
  };
  const cls = `flex flex-col items-center justify-center gap-1.5 w-full py-3 px-2 rounded-2xl text-[11px] font-medium tracking-wide transition-all duration-150 active:scale-95 cursor-pointer select-none ${variantStyles[variant] || variantStyles.default}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span className="text-[22px] leading-none">{icon}</span>
        <span>{label}</span>
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      <span className="text-[22px] leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, children }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#F1F3F4] last:border-0">
      <span className="text-[#5F6368] text-xl mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0 text-sm text-[#202124] leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ListingInfo() {
  const params = useParams();
  const slug = params?.slug
    ? Array.isArray(params.slug) ? params.slug[0] : params.slug
    : null;

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const [showStickyHero, setShowStickyHero] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshApi, setRefreshApi] = useState(0);
  const [myReview, setMyReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/businesses/s/${slug}`);
        if (!data.business) throw new Error("Business not found.");
        setBusiness(data.business);
      } catch (err) {
        setError(
          "⏳ Business verification is in progress. Please allow 24–48 hours for completion."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug, refreshApi]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (!heroSection) return;
      setShowStickyHero(heroSection.getBoundingClientRect().bottom <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderStars = (rating) => {
    const safe = typeof rating === "number" && !isNaN(rating) ? rating : 0;
    const full = Math.max(0, Math.floor(safe));
    const half = safe - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <>
        {[...Array(full)].map((_, i) => <FaStar key={`f${i}`} className="text-[#F9AB00]" />)}
        {half === 1 && <FaStarHalfAlt className="text-[#F9AB00]" />}
        {[...Array(empty)].map((_, i) => <FaRegStar key={`e${i}`} className="text-[#F9AB00]" />)}
      </>
    );
  };

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white">
        <div className="max-w-sm text-center px-6 py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FEF3E2] flex items-center justify-center text-3xl">⏳</div>
          <p className="text-[#202124] text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );

  const initial = business.name?.[0]?.toUpperCase() ?? "B";
  const avatarColor = getAvatarColor(business.name);
  const websiteHref = business.website?.startsWith("http")
    ? business.website
    : `https://${business.website}`;
  const directionsHref =
    business?.latitude && business?.longitude
      ? `https://maps.google.com/?daddr=${business.latitude},${business.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(business?.name || "")}`;

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Google Sans', Roboto, sans-serif", color: "#202124" }}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      {business?.category && business?.subcategory && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-1">
          <nav className="flex items-center gap-1 text-[12px] text-[#70757A] flex-wrap">
            <Link href="/" className="hover:text-[#1A73E8] hover:underline transition-colors">Home</Link>
            <HiOutlineChevronRight className="text-[10px] text-[#BDC1C6]" />
            <Link
              href={`/category/${business.categorySlug || business.category}`}
              className="hover:text-[#1A73E8] hover:underline capitalize transition-colors"
            >
              {business.category.replace(/-/g, " ")}
            </Link>
            <HiOutlineChevronRight className="text-[10px] text-[#BDC1C6]" />
            <span className="capitalize text-[#202124]">{business.subcategory.replace(/-/g, " ")}</span>
          </nav>
        </div>
      )}

      {/* ── Full-width photo hero ────────────────────────────────────────── */}
      <div
        id="hero-section"
        className="max-w-7xl mx-auto  overflow-hidden bg-[#F1F3F4] p-5 rounded-xl"
        style={{ maxHeight: 280, minHeight: 180 }}
      >
        <Photos business={business} />
      </div>

      {/* ── Page body ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 lg:items-start">

          {/* ════ LEFT SIDEBAR ════════════════════════════════════════════ */}
          <aside className="lg:w-[360px] shrink-0 lg:sticky lg:top-4 pt-5 pb-4 lg:pt-7 lg:pb-8">

            {/* Business identity block */}
            <div className="flex items-center gap-4 mb-4">
              {/* Monogram avatar */}
              <div
                className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-[26px] font-bold shrink-0"
                style={{ background: avatarColor.bg, color: avatarColor.text, letterSpacing: "-0.5px" }}
              > 
                {initial}
              </div>
              <div className="min-w-0">
                <h1 className="text-[20px] font-semibold leading-snug text-[#202124] break-words">
                  {business.name}
                </h1>
                <div className="mt-0.5">
                  <PlanBadge plan={business.plan_name} />
                </div>
              </div>
            </div>

            {/* Category + address tag line */}
            <p className="text-[13px] text-[#70757A] leading-relaxed mb-3">
              <span className="capitalize">{business.category?.replace(/-/g, " ")}</span>
              {business.address && (
                <> &nbsp;·&nbsp; {business.address}</>
              )}
            </p>

            {/* Rating row */}
            {typeof business.rating === "number" && !isNaN(business.rating) && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[18px] font-semibold text-[#202124]">
                  {business.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-[2px] text-[13px]">
                  {renderStars(business.rating)}
                </div>
                {business.review_count > 0 && (
                  <span className="text-[13px] text-[#1A73E8] hover:underline cursor-pointer">
                    ({business.review_count} reviews)
                  </span>
                )}
              </div>
            )}

            {/* ── 4-up action grid ── */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <ActionPill
                onClick={() => setShowEnquiryPopup(true)}
                icon={<PiChatText />}
                label="Enquiry"
                variant="orange"
              />
              <ActionPill
                href={`https://wa.me/+91${business.wp_number}`}
                icon={<TbBrandWhatsapp style={{ color: "#25D366" }} />}
                label="Chat"
                variant="green"
              />
              <ActionPill
                href={directionsHref}
                icon={<FcDownRight />}
                label="Directions"
                variant="default"
              />
              <ActionPill
                href={`tel:${business.phone}`}
                icon={<FcCallback />}
                label="Call"
                variant="gray"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[#E8EAED] mb-1" />

            {/* Contact info rows */}
            <div>
              {business.phone && (
                <InfoRow icon={<MdPhone />}>
                  <a href={`tel:${business.phone}`} className="text-[#1A73E8] hover:underline">
                    {business.phone}
                  </a>
                </InfoRow>
              )}
              {business.website && (
                <InfoRow icon={<MdLanguage />}>
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A73E8] hover:underline truncate block max-w-[260px]"
                  >
                    {business.website.replace(/^https?:\/\//, "")}
                  </a>
                </InfoRow>
              )}
              {business.address && (
                <InfoRow icon={<MdLocationOn />}>
                  <span className="text-[#202124]">{business.address}</span>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-0.5 text-[12px] text-[#1A73E8] hover:underline"
                  >
                    Get directions
                  </a>
                </InfoRow>
              )}
            </div>

            {/* Share button */}
            <div className="mt-3 pt-3 border-t border-[#E8EAED]">
              <div className="flex items-center gap-2 text-[13px] text-[#1A73E8] cursor-pointer hover:bg-[#F8F9FA] px-3 py-2 rounded-xl transition-colors -mx-1">
                <MdShare className="text-lg text-[#5F6368]" />
                <ShareButton />
              </div>
            </div>
          </aside>

          {/* ════ RIGHT CONTENT ═══════════════════════════════════════════ */}
          <main className="flex-1 min-w-0 pt-4 lg:pt-7 pb-28">
            {/* Tabs */}
            <div className="border-b border-[#E8EAED] mb-0">
              <Tab
                setRefreshApi={setRefreshApi}
                setMyReview={setMyReview}
                business={business}
                renderStars={renderStars}
                businessOwnerId={business?.owner_id}
                currentUserId={currentUserId}
              />
            </div>

            {/* Reviews / messages */}
            <div className="mt-6">
              <UsersndMsg
                myReview={myReview}
                setRefreshApi={setRefreshApi}
                setReviews={setReviews}
                businessId={business.id}
              />
            </div>
          </main>
        </div>
      </div>

      {/* ── Enquiry modal ─────────────────────────────────────────────────── */}
      {showEnquiryPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(32,33,36,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEnquiryPopup(false); }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl relative overflow-hidden"
            style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.18)" }}
          >
            {/* Coloured top stripe — Google blue */}
            <div className="h-1 w-full bg-[#1A73E8]" />
            <div className="p-6 sm:p-8">
              <button
                onClick={() => setShowEnquiryPopup(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#5F6368] hover:bg-[#F1F3F4] text-xl transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <Enquirymsg
                closePopup={() => setShowEnquiryPopup(false)}
                businessId={business.id}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky bottom bar ─────────────────────────────────────────────── */}
      {showStickyHero && (
        <div
          className="fixed bottom-0 left-0 w-full z-50 bg-white"
          style={{ borderTop: "1px solid #E8EAED", boxShadow: "0 -2px 8px rgba(0,0,0,0.08)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            {/* Left: identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[16px] font-bold"
                style={{ background: avatarColor.bg, color: avatarColor.text }}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#202124] truncate leading-tight">
                  {business.name}
                </p>
                <p className="text-[11px] text-[#70757A] capitalize truncate">
                  {business.category?.replace(/-/g, " ")}
                </p>
              </div>
            </div>

            {/* Right: CTAs */}
            <div className="flex gap-2 shrink-0">
              <a
                href={`tel:${business.phone}`}
                className="inline-flex items-center gap-1.5 bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#1A73E8] text-[13px] font-medium px-4 py-2 rounded-full transition-colors"
              >
                <IoIosCall className="text-base" />
                <span className="hidden sm:inline">Call</span>
              </a>
              <button
                onClick={() => setShowEnquiryPopup(true)}
                className="inline-flex items-center gap-1.5 bg-[#1A73E8] hover:bg-[#1765CC] text-white text-[13px] font-medium px-4 py-2 rounded-full transition-colors"
              >
                <PiChatText className="text-base" />
                <span className="hidden sm:inline">Enquiry</span>
              </button>
              <ShareButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}