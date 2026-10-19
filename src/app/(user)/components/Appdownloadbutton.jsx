"use client";

import Image from "next/image";

// 👉 Replace with your real store links
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.anonymous.Mymnmapp";
// const APP_STORE_URL = "https://apps.apple.com/app/idYOUR_APP_ID";

export default function AppDownloadButton({ compact = false }) {
  const handleClick = () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    window.open(isIOS ? APP_STORE_URL : PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  };

  const px = compact ? 34 : 40;

  return (
    <div className="relative group">
 <button
  type="button"
  onClick={handleClick}
  aria-label="Download MNM app"
  className="group relative inline-flex shrink-0 items-center gap-1.5
    overflow-hidden rounded-full border border-green-500/40
    bg-gradient-to-r from-white via-green-50 to-emerald-100
    px-2.5 py-1.5 text-green-800 shadow-md
    animate-bounce
    transition-all duration-300
    hover:scale-105 hover:border-green-600
    hover:shadow-lg hover:shadow-green-500/25
    active:scale-95"
>
      {/* Animated shine */}
      <span
  className="pointer-events-none absolute inset-0
    -translate-x-full bg-gradient-to-r
    from-transparent via-white/80 to-transparent
    animate-[shimmer_3s_ease-in-out_infinite]"
/>

      {/* Play Store icon */}
      <svg
        viewBox="0 0 21 21"
        className="relative z-10 h-4 w-4 shrink-0
          transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        <path fill="#34A853" d="M3.5 2.5 13 12 3.5 21.5Q3 21 3 20V4Q3 3 3.5 2.5Z" />
        <path fill="#4285F4" d="m13 12 3-3 4.5 2.6q1.5.9 0 1.8L16 16l-3-4Z" />
        <path fill="#FBBC04" d="m3.5 2.5 12.5 6.5-3 3-9.5-9.5Z" />
        <path fill="#EA4335" d="m3.5 21.5 12.5-5.5-3-4-9.5 9.5Z" />
      </svg>

      <span className="relative z-10 whitespace-nowrap text-[10px] font-bold tracking-wide">
        Download App
      </span>

      {/* Small animated indicator */}
      <span className="relative z-10 h-1.5 w-1.5 rounded-full
        bg-emerald-400 shadow-[0_0_6px_#34d399]
        animate-pulse"
      />
    </button>

      {/* Tooltip (desktop hover) */}
      {!compact && (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
          Get the App
        </span>
      )}
    </div>
  );
}