// "use client";
// import React, { useState, useEffect } from "react";
// import { apiGet } from "@/lib/apiClient";
// import CONFIG from "@/constance";

// const DEFAULT_MOBILE = [{ type: "image", src: "/assests/DiwaliMobileBanner.png" }];
// const DEFAULT_DESKTOP = [{ type: "image", src: "/assests/DiwaliBanner.png" }];

// const todayYmd = () => new Date().toLocaleDateString("en-CA");
// const ymd = (d) => String(d || "").slice(0, 10);
// const AD_IMAGE_PATH = "uploads/ads"; // same folder the admin page uses
// const adImg = (n) => {
//   if (!n) return "";
//   if (/^https?:\/\//.test(n)) return n;
//   const base = String(CONFIG.IMAGE_BASE_URL || "").replace(/\/+$/, "");
//   const path = AD_IMAGE_PATH ? `${AD_IMAGE_PATH}/` : "";
//   return `${base}/${path}${String(n).replace(/^\/+/, "")}`;
// };

// /* Show only paid, active banners that are inside their dates */
// const isRunning = (a) => {
//   const today = todayYmd();
//   if (a.payment_status && String(a.payment_status).toLowerCase() !== "paid") return false;
//   if (a.is_active === 0 || a.is_active === false) return false;
//   if (a.start_date && ymd(a.start_date) > today) return false;
//   if (a.end_date && ymd(a.end_date) < today) return false;
//   return !!(a.image_desktop || a.image_mobile);
// };

// const Adsvideo = () => {
//   const [ads, setAds] = useState([]);

//   useEffect(() => {
//     let cancelled = false;
//     apiGet("/advertisements/homepage")
//       .then((res) => {
//         const list = Array.isArray(res) ? res : res?.data || [];
//         console.log("[homepage ads] raw:", list, "running:", list.filter(isRunning));
//         if (!cancelled) setAds(list.filter(isRunning));
//       })
//       .catch(() => { if (!cancelled) setAds([]); }); // on error the default images stay
//     return () => { cancelled = true; };
//   }, []);

//   // Mobile slides
//   const slidesMobile = ads.length
//     ? ads.map((a) => {
//         const img = a.image_mobile || a.image_desktop;
//         return { type: "image", src: img ? adImg(img) : DEFAULT_MOBILE[0].src, href: img ? a.redirect_url : undefined };
//       })
//     : DEFAULT_MOBILE;

//   // Desktop slides
//   const slidesDesktop = ads.length
//     ? ads.map((a) => {
//         const img = a.image_desktop || a.image_mobile;
//         return { type: "image", src: img ? adImg(img) : DEFAULT_DESKTOP[0].src, href: img ? a.redirect_url : undefined };
//       })
//     : DEFAULT_DESKTOP;

//   const [currentIndexMobile, setCurrentIndexMobile] = useState(0);
//   const [currentIndexDesktop, setCurrentIndexDesktop] = useState(0);

//   useEffect(() => {
//     const intervalMobile = setInterval(() => {
//       setCurrentIndexMobile((prev) => (prev + 1) % slidesMobile.length);
//     }, 5000);

//     const intervalDesktop = setInterval(() => {
//       setCurrentIndexDesktop((prev) => (prev + 1) % slidesDesktop.length);
//     }, 5000);

//     return () => {
//       clearInterval(intervalMobile);
//       clearInterval(intervalDesktop);
//     };
//   }, [slidesMobile.length, slidesDesktop.length]);

//   useEffect(() => {
//     setCurrentIndexMobile(0);
//     setCurrentIndexDesktop(0);
//   }, [ads.length]);

//   return (
//     <>
//       {/* ===================== DESKTOP VIEW ===================== */}
//       <div className="hidden md:block w-full h-50 relative overflow-hidden rounded-xl mb-3">
//         {slidesDesktop.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
//               index === currentIndexDesktop ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             {slide.type === "image" ? (
//                       <a href={slide.href || undefined} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
//                                  <img
//                 src={slide.src}
//                 alt="slide"
//                 className="w-full h-full object-contain"
//                 onError={(e) => {
//                   console.warn("[homepage ads] image failed:", slide.src);
//                   e.currentTarget.onerror = null;
//                   e.currentTarget.src = DEFAULT_DESKTOP[0].src;
//                 }}
//               />
//                     </a>
//             ) : (
//               <video src={slide.src} className="w-full h-full object-contain p-1" autoPlay muted loop />
//             )
//             }
//           </div>
//         ))}
//       </div>

//       {/* ===================== MOBILE VIEW ===================== */}
//       <div className="md:hidden w-full h-36 relative overflow-hidden rounded-xl mt-5">
//         {slidesMobile.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
//               index === currentIndexMobile ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             {slide.type === "image" ? (
//                       <a href={slide.href || undefined} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
//                                   <img
//                 src={slide.src}
//                 alt="slide"
//                 className="w-full h-full object-cover object-center"
//                 onError={(e) => {
//                   console.warn("[homepage ads] image failed:", slide.src);
//                   e.currentTarget.onerror = null;
//                   e.currentTarget.src = DEFAULT_MOBILE[0].src;
//                 }}
//               />
//                     </a>
//             ) : (
//               <video src={slide.src} className="w-full h-full object-cover object-center" autoPlay muted loop />
//             )}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Adsvideo;



"use client";

import React, { useState, useEffect } from "react";
import { apiGet } from "@/lib/apiClient";
import CONFIG from "@/constance";

const DEFAULT_MOBILE = [
  { type: "image", src: "/assests/DiwaliMobileBanner.png" },
];

const DEFAULT_DESKTOP = [
  { type: "image", src: "/assests/DiwaliBanner.png" },
];

const todayYmd = () => new Date().toLocaleDateString("en-CA");
const ymd = (d) => String(d || "").slice(0, 10);

const AD_IMAGE_PATH = "uploads/ads";

const adImg = (n) => {
  if (!n) return "";

  if (/^https?:\/\//i.test(n)) return n;

  const base = String(CONFIG.IMAGE_BASE_URL || "").replace(/\/+$/, "");
  const path = String(n).replace(/^\/+/, "");

  if (path.startsWith("uploads/")) {
    return `${base}/${path}`;
  }

  return `${base}/${AD_IMAGE_PATH}/${path}`;
};

/* Show only paid, active banners within their dates */
const isRunning = (a) => {
  const today = todayYmd();

  if (
    a.payment_status &&
    String(a.payment_status).toLowerCase() !== "paid"
  ) return false;

  if (a.is_active === 0 || a.is_active === false) return false;
  if (a.start_date && ymd(a.start_date) > today) return false;
  if (a.end_date && ymd(a.end_date) < today) return false;

  return !!(a.image_desktop || a.image_mobile);
};

const Adsvideo = () => {
  const [ads, setAds] = useState([]);
  const [currentIndexMobile, setCurrentIndexMobile] = useState(0);
  const [currentIndexDesktop, setCurrentIndexDesktop] = useState(0);

  useEffect(() => {
    let cancelled = false;

    apiGet("/advertisements/homepage")
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || [];

        console.log(
          "[homepage ads] raw:",
          list,
          "running:",
          list.filter(isRunning)
        );

        if (!cancelled) {
          setAds(list.filter(isRunning));
        }
      })
      .catch((err) => {
        console.error("[homepage ads] API error:", err);
        if (!cancelled) setAds([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Mobile slides
  const slidesMobile = ads.length
    ? ads.map((a) => {
        const img = a.image_mobile || a.image_desktop;

        return {
          type: "image",
          src: adImg(img),
          href: a.redirect_url,
        };
      })
    : DEFAULT_MOBILE;

  // Desktop slides
  const slidesDesktop = ads.length
    ? ads.map((a) => {
        const img = a.image_desktop || a.image_mobile;

        return {
          type: "image",
          src: adImg(img),
          href: a.redirect_url,
        };
      })
    : DEFAULT_DESKTOP;

  // Reset indexes when ads change
  useEffect(() => {
    setCurrentIndexMobile(0);
    setCurrentIndexDesktop(0);
  }, [ads.length]);

  // Mobile autoplay
  useEffect(() => {
    if (slidesMobile.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndexMobile((prev) => (prev + 1) % slidesMobile.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesMobile.length]);

  // Desktop autoplay
  useEffect(() => {
    if (slidesDesktop.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndexDesktop((prev) => (prev + 1) % slidesDesktop.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesDesktop.length]);

  const prevMobile = () => {
    setCurrentIndexMobile((prev) =>
      (prev - 1 + slidesMobile.length) % slidesMobile.length
    );
  };

  const nextMobile = () => {
    setCurrentIndexMobile((prev) =>
      (prev + 1) % slidesMobile.length
    );
  };

  const prevDesktop = () => {
    setCurrentIndexDesktop((prev) =>
      (prev - 1 + slidesDesktop.length) % slidesDesktop.length
    );
  };

  const nextDesktop = () => {
    setCurrentIndexDesktop((prev) =>
      (prev + 1) % slidesDesktop.length
    );
  };

  const renderSlide = (slide, index, currentIndex, isMobile = false) => (
    <div
      key={index}
      className={`absolute inset-0 transition-opacity duration-700 ${
        index === currentIndex
          ? "opacity-100 z-10"
          : "opacity-0 z-0 pointer-events-none"
      }`}
    >
      <a
        href={slide.href || undefined}
        target={slide.href ? "_blank" : undefined}
        rel={slide.href ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          if (!slide.href) e.preventDefault();
        }}
        className="block w-full h-full"
      >
        <img
          src={slide.src}
          alt="Advertisement banner"
          className={`w-full h-full ${
            isMobile
              ? "object-cover object-center"
              : "object-contain object-center"
          }`}
          onError={(e) => {
            console.warn("[homepage ads] image failed:", slide.src);
            e.currentTarget.onerror = null;
            e.currentTarget.src = isMobile
              ? DEFAULT_MOBILE[0].src
              : DEFAULT_DESKTOP[0].src;
          }}
        />
      </a>
    </div>
  );

  return (
    <div className="w-full max-w-[90rem] mx-auto px-3 sm:px-4">

      {/* ================= DESKTOP CAROUSEL ================= */}
      <div className="hidden md:block relative w-full h-[180px] lg:h-[220px] xl:h-[260px] overflow-hidden rounded-xl mb-4 group">

        {slidesDesktop.map((slide, index) =>
          renderSlide(slide, index, currentIndexDesktop)
        )}

        {slidesDesktop.length > 1 && (
          <>
          

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
              {slidesDesktop.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndexDesktop(index)}
                  aria-label={`Go to desktop banner ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndexDesktop
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ================= MOBILE CAROUSEL ================= */}
      <div className="md:hidden relative w-full h-[130px] sm:h-[160px] overflow-hidden rounded-xl mt-4 mb-3 group">

        {slidesMobile.map((slide, index) =>
          renderSlide(slide, index, currentIndexMobile, true)
        )}

        {slidesMobile.length > 1 && (
          <>
        

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-2">
              {slidesMobile.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndexMobile(index)}
                  aria-label={`Go to mobile banner ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndexMobile
                      ? "w-5 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Adsvideo;