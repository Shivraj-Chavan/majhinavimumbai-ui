import CONFIG from "@/constance";

// Primary recommended size (shown in the UI) plus any other accepted sizes.
// Add more entries to `alt` any time you want to allow another size.
export const AD_SIZE_OPTIONS = {
  homepage: {
    desktop: { recommended: { w: 1024, h: 113 }, alt: [{ w: 1024, h: 113 }] },
    mobile: { recommended: { w: 800, h: 400 }, alt: [{ w: 1024, h: 113 }] },
  },
  category: {
    desktop: { recommended: { w: 1024, h: 113 }, alt: [{ w: 1024, h: 113 }] },
    mobile: { recommended: { w: 800, h: 300 }, alt: [{ w: 1024, h: 113 }] },
  },
};

// Kept for anything that still imports AD_SIZES directly (shows the recommended size)
export const AD_SIZES = {
  homepage: { desktop: AD_SIZE_OPTIONS.homepage.desktop.recommended, mobile: AD_SIZE_OPTIONS.homepage.mobile.recommended },
  category: { desktop: AD_SIZE_OPTIONS.category.desktop.recommended, mobile: AD_SIZE_OPTIONS.category.mobile.recommended },
};

// How far an upload may differ from an allowed size and still be accepted.
// Must match the backend's SIZE_TOLERANCE in utils/adImages.js.
export const SIZE_TOLERANCE = 0.10;

export const MAX_FILE_MB = 2;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const AD_ENDPOINT = {
  base: "/advertisements",
  byId: (id) => `/advertisements/${id}`,
  status: (id) => `/advertisements/${id}/status`,
  homepage: "/advertisements/homepage",
  category: (categoryId) => `/advertisements/category/${categoryId}`,
};

export const adImageUrl = (name) => (name ? `${CONFIG.API_IMAGE_BASE_URL}/images/${name}` : "");