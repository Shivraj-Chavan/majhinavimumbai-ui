"use client";

import React, { useEffect, useState } from "react";
import CONFIG from "@/constance";

/* Pick the right image file for desktop / mobile */
export const adSrc = (ad, variant = "desktop") => {
  const file =
    variant === "mobile"
      ? ad?.image_mobile || ad?.image_desktop
      : ad?.image_desktop || ad?.image_mobile;
  return file ? `${CONFIG.API_IMAGE_BASE_URL}/images/${file}` : null;
};

/**
 * Rotating banner. It fills its parent, so the parent must be `relative` and have a size
 * (for example an aspect ratio). Falls back to `fallbackSrc` when there are no ads.
 *
 * <div className="relative w-full aspect-[16/3] overflow-hidden">
 *   <AdvertisementCarousel ads={ads} variant="desktop" fallbackSrc="/assets/banner.jpg" />
 * </div>
 */
export default function AdvertisementCarousel({
  ads = [],
  variant = "desktop",
  fallbackSrc,
  alt = "Advertisement",
  interval = 4000,
  fit = "contain", // "contain" | "cover"
  showDots = true,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { setIndex(0); }, [ads]);

  useEffect(() => {
    if (ads.length < 2 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ads.length), interval);
    return () => clearInterval(t);
  }, [ads.length, paused, interval]);

  const ad = ads[index] || null;
  const src = (ad && adSrc(ad, variant)) || fallbackSrc;
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  const img = src ? (
    <img
      src={src}
      alt={ad?.title || alt}
      className={`absolute inset-0 h-full w-full ${fitClass}`}
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== new URL(fallbackSrc, window.location.origin).href) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
    />
  ) : null;

  const external = ad?.redirect_url && /^https?:\/\//i.test(ad.redirect_url);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {ad?.redirect_url ? (
        <a
          href={ad.redirect_url}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={ad.title || "Advertisement"}
          className="absolute inset-0 block"
        >
          {img}
        </a>
      ) : (
        img
      )}

      {showDots && ads.length > 1 && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {ads.map((a, i) => (
            <span
              key={a.id ?? i}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}