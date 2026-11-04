export const AD_IMAGE_RULES = {
    category: {
      desktop: { width: 1024, height: 113, exact: true },
      mobile: { width: 1800, height: 600, exact: true },
    },
    homepage: {
      desktop: {  width: 1024, height: 113, exact: true }, // left and right banner
      mobile: { width: 1800, height: 600, exact: true },
    },
  };
  
  export const AD_IMAGE_COMMON = {
    types: ["image/jpeg", "image/png", "image/webp"],
    maxMB: 2,
    tolerance: 0.05, // only used by rules without exact: true
  };
  
  const readImageSize = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
      img.src = url;
    });
  
  /** Returns an error message, or null when the image is fine. */
  export async function validateAdImage(file, rule, label) {
    const { types, maxMB, tolerance } = AD_IMAGE_COMMON;
    if (!types.includes(file.type)) return `${label}: only JPG, PNG or WEBP images are allowed.`;
    if (file.size > maxMB * 1024 * 1024) return `${label}: image must be under ${maxMB} MB.`;
    if (!rule) return null;
  
    let size;
    try { size = await readImageSize(file); } catch { return `${label}: could not read this image.`; }
  
    if (rule.exact) {
      if (size.width !== rule.width || size.height !== rule.height) {
        return `${label}: must be exactly ${rule.width}×${rule.height}px. Yours is ${size.width}×${size.height}px.`;
      }
      return null;
    }
  
    const wantRatio = rule.width / rule.height;
    const gotRatio = size.width / size.height;
    const ratioOff = Math.abs(gotRatio - wantRatio) / wantRatio > tolerance;
    if (ratioOff || size.width < rule.width) {
      return `${label}: use ${rule.width}×${rule.height}px (or the same shape, at least ${rule.width}px wide). Yours is ${size.width}×${size.height}px.`;
    }
    return null;
  }