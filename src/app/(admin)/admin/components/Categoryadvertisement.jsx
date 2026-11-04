"use client";

import React, { useEffect, useState } from "react";
import ENDPOINT from "@/lib/endpoints";
import { apiGet } from "@/lib/apiClient";
import AdvertisementCarousel from "./AdvertisementCarousel";

const isPaid = (ad) => String(ad?.payment_status ?? "").toLowerCase() === "paid";

/**
 * Category page banner. Loads only paid ads for the category and rotates them.
 * With no paid ad it shows `fallbackSrc` (your static category banner).
 *
 * Usage (category page):
 *   <CategoryAdvertisement categoryId={category?.id} variant="desktop" fallbackSrc={imageSrc || "/advertise/default.jpg"} />
 *   <CategoryAdvertisement categoryId={category?.id} variant="mobile"  fallbackSrc={imageSrc || "/assets/banner.jpg"} />
 */
export default function CategoryAdvertisement({
  categoryId,
  variant = "desktop",
  fallbackSrc,
  alt,
  className = "",
}) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!categoryId) { setAds([]); return; }
    let cancelled = false;
    apiGet(ENDPOINT.getCategoryAd(categoryId))
      .then((res) => { if (!cancelled) setAds((res?.data || []).filter(isPaid)); })
      .catch(() => { if (!cancelled) setAds([]); });
    return () => { cancelled = true; };
  }, [categoryId]);

  const size = variant === "mobile" ? "aspect-[8/3]" : "aspect-[16/3] max-h-[220px]";

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${size} ${className}`}>
      <AdvertisementCarousel ads={ads} variant={variant} fallbackSrc={fallbackSrc} alt={alt} />
    </div>
  );
}