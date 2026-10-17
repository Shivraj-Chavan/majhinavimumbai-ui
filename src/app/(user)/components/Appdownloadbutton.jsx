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
        aria-label="Download our app"
        className="relative flex items-center justify-center rounded-full animate-bounce hover:scale-110 transition-transform duration-300"
        style={{ width: px, height: px }}
      >
        {/* Pulsing ring to catch the eye */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-60 animate-ping" />

        {/* App logo */}
        <Image
          src="/assests/MNMLOGO.png"
          alt="Download MNM app"
          width={px}
          height={px}
          className="relative rounded-full object-cover shadow-md ring-2 ring-white"
        />

        {/* Notification dot */}
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
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