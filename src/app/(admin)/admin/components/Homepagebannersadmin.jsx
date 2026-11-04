// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Plus, Pencil, Trash2, Monitor, Smartphone, ImageOff } from "lucide-react";
// import { apiDelete, apiGet, apiPostWithImage, apiPutWithImage } from "@/lib/apiClient";
// import { AD_ENDPOINT, adImageUrl } from "@/lib/adConfig";
// import { AD_IMAGE_RULES, validateAdImage } from "@/lib/adImageRules";
// import AdvertisementForm from "./AdvertisementForm";

// const errMsg = (e, fallback) =>
//   e?.response?.data?.detail ||
//   e?.response?.data?.message ||
//   e?.response?.data?.msg ||
//   e?.data?.msg ||
//   e?.data?.message ||
//   e?.message ||
//   fallback;

// const ymd = (d) => (d ? new Date(d).toLocaleDateString("en-CA") : null);
// const fmt = (d) =>
//   d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

// const PAY_STYLE = {
//   paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
//   pending: "border-amber-200 bg-amber-50 text-amber-700",
//   failed: "border-red-200 bg-red-50 text-red-700",
// };

// function liveStatus(ad) {
//   if (!ad.is_active) return { label: "Inactive", cls: "bg-gray-100 text-gray-600" };
//   const t = new Date().toLocaleDateString("en-CA");
//   const start = ymd(ad.start_date);
//   const end = ymd(ad.end_date);
//   if (start && start > t) return { label: "Scheduled", cls: "bg-blue-100 text-blue-700" };
//   if (end && end < t) return { label: "Expired", cls: "bg-red-100 text-red-700" };
//   return { label: "Live", cls: "bg-green-100 text-green-700" };
// }

// const SIZE = AD_IMAGE_RULES.homepage;

// /* One side (left or right) */
// function SideCard({ side, ad, onAdd, onEdit, onDelete }) {
//   const title = side === "left" ? "Left banner" : "Right banner";
//   const st = ad ? liveStatus(ad) : null;
//   const pay = ad?.payment_status || "pending";

//   return (
//     <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="mb-3 flex items-start justify-between gap-2">
//         <div>
//           <h3 className="text-base font-bold text-gray-900">{title}</h3>
//           <p className="text-xs text-gray-400">Desktop {SIZE.desktop.width}×{SIZE.desktop.height}px · Mobile {SIZE.mobile.width}×{SIZE.mobile.height}px</p>
//         </div>
//         {ad && (
//           <div className="flex flex-wrap justify-end gap-1.5">
//             <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
//             <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${PAY_STYLE[pay] || PAY_STYLE.pending}`}>{pay}</span>
//           </div>
//         )}
//       </div>

//       {!ad ? (
//         <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-center">
//           <ImageOff className="h-8 w-8 text-gray-300" />
//           <p className="text-sm text-gray-500">No {side} banner yet</p>
//           <button onClick={() => onAdd(side)} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
//             <Plus size={15} /> Add {side} banner
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-[110px_1fr] gap-3">
//             {/* Desktop (vertical) */}
//             <div>
//               <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-gray-500"><Monitor size={12} /> Desktop</p>
//               <div className="aspect-[1/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
//                 {ad.image_desktop ? (
//                   <img src={adImageUrl(ad.image_desktop)} alt={`${title} desktop`} className="h-full w-full object-cover" />
//                 ) : null}
//               </div>
//             </div>

//             {/* Mobile (wide) + details */}
//             <div className="min-w-0">
//               <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-gray-500"><Smartphone size={12} /> Mobile</p>
//               <div className="aspect-[3/1] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
//                 {ad.image_mobile ? (
//                   <img src={adImageUrl(ad.image_mobile)} alt={`${title} mobile`} className="h-full w-full object-cover" />
//                 ) : (
//                   <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-amber-600">No mobile image</div>
//                 )}
//               </div>

//               <div className="mt-3 space-y-1 text-xs text-gray-600">
//                 <p className="truncate font-semibold text-gray-900">{ad.title}</p>
//                 {ad.redirect_url && <p className="truncate text-blue-600">{ad.redirect_url}</p>}
//                 <p>Start {fmt(ad.start_date)} · End {fmt(ad.end_date)}</p>
//                 <p>Order {ad.display_order ?? 0}</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
//             <button onClick={() => onEdit(ad)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
//               <Pencil size={14} /> Edit
//             </button>
//             <button onClick={() => onDelete(ad)} className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
//               <Trash2 size={14} /> Delete
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default function HomepageBannersAdmin() {
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState({ open: false, ad: null, side: "left" });
//   const [saving, setSaving] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiGet(`${AD_ENDPOINT.base}?placement=homepage&limit=50`);
//       setAds(res?.data || []);
//     } catch (e) {
//       toast.error(errMsg(e, "Failed to load homepage banners"));
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const byDisplay = (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || b.id - a.id;
//   const leftAd = [...ads].sort(byDisplay).find((a) => a.position === "left");
//   const rightAd = [...ads].sort(byDisplay).find((a) => a.position === "right");
//   const noSide = ads.filter((a) => !a.position);

//   const handleSave = async (formData) => {
//     // Safety net: re-check the image sizes before uploading
//     const checks = [
//       ["image_desktop", "desktop", "Desktop image"],
//       ["image_mobile", "mobile", "Mobile image"],
//     ];
//     for (const [fieldName, kind, label] of checks) {
//       const file = formData.get(fieldName);
//       if (file instanceof File && file.size > 0) {
//         const problem = await validateAdImage(file, SIZE[kind], label);
//         if (problem) { toast.error(problem); return; }
//       }
//     }

//     setSaving(true);
//     try {
//       if (modal.ad) await apiPutWithImage(AD_ENDPOINT.byId(modal.ad.id), formData);
//       else await apiPostWithImage(AD_ENDPOINT.base, formData);
//       toast.success(modal.ad ? "Banner updated" : "Banner created");
//       setModal({ open: false, ad: null, side: "left" });
//       load();
//     } catch (e) {
//       toast.error(errMsg(e, "Failed to save banner"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await apiDelete(AD_ENDPOINT.byId(deleteTarget.id));
//       toast.success("Banner deleted");
//       setAds((list) => list.filter((a) => a.id !== deleteTarget.id));
//       setDeleteTarget(null);
//     } catch (e) {
//       toast.error(errMsg(e, "Failed to delete banner"));
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const openAdd = (side) => setModal({ open: true, ad: null, side });
//   const openEdit = (ad) => setModal({ open: true, ad, side: ad.position || "left" });

//   return (
//     <div className="mx-auto max-w-5xl space-y-4 px-4 pb-10 pt-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Homepage Banners</h1>
//         <p className="text-md text-gray-500">One vertical banner on the left and one on the right of the homepage hero. Phones show a wide banner instead.</p>
//       </div>

//       {/* Size guide */}
//       <div className="grid gap-2 rounded-xl border border-orange-100 bg-orange-50/60 p-3 text-sm sm:grid-cols-3">
//         <p className="flex items-center gap-2 text-gray-700"><Monitor size={15} className="text-orange-500" /> Desktop (left and right): <b>{SIZE.desktop.width} × {SIZE.desktop.height} px</b></p>
//         <p className="flex items-center gap-2 text-gray-700"><Smartphone size={15} className="text-orange-500" /> Mobile: <b>{SIZE.mobile.width} × {SIZE.mobile.height} px</b></p>
//         <p className="text-gray-500">JPG, PNG or WEBP · max 2 MB · exact size</p>
//       </div>

//       {loading ? (
//         <div className="grid gap-4 md:grid-cols-2">
//           {[0, 1].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />)}
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2">
//           <SideCard side="left" ad={leftAd} onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteTarget} />
//           <SideCard side="right" ad={rightAd} onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteTarget} />
//         </div>
//       )}

//       {/* Old homepage ads that were saved before left/right existed */}
//       {!loading && noSide.length > 0 && (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
//           <p className="text-sm font-semibold text-amber-800">{noSide.length} homepage ad{noSide.length > 1 ? "s" : ""} without a side</p>
//           <p className="mb-2 text-xs text-amber-700">Edit each one and choose Left or Right, or it will not show in a side slot.</p>
//           <ul className="space-y-1.5">
//             {noSide.map((a) => (
//               <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm">
//                 <span className="truncate font-medium text-gray-800">{a.title}</span>
//                 <button onClick={() => openEdit(a)} className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">Set side</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Add / Edit modal */}
//       {modal.open && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true">
//           <div className="my-6 w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl">
//             <h2 className="mb-4 text-lg font-bold text-gray-900">
//               {modal.ad ? "Edit" : "Add"} {modal.side} homepage banner
//             </h2>
//             <AdvertisementForm
//               initial={modal.ad}
//               categories={[]}
//               defaults={{ placement: "homepage", position: modal.side }}
//               lockPlacement={!!modal.ad?.position || !modal.ad}
//               saving={saving}
//               onSubmit={handleSave}
//               onCancel={() => !saving && setModal({ open: false, ad: null, side: "left" })}
//             />
//           </div>
//         </div>
//       )}

//       {/* Delete confirmation */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true">
//           <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
//             <h3 className="text-base font-bold text-gray-900">Delete this banner?</h3>
//             <p className="mt-1 text-sm text-gray-500">"{deleteTarget.title}" and its images will be removed. This cannot be undone.</p>
//             <div className="mt-5 flex justify-end gap-2">
//               <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
//               <button onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deleting ? "Deleting..." : "Delete"}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Monitor, Smartphone, ImageOff } from "lucide-react";
import { apiDelete, apiGet, apiPostWithImage, apiPutWithImage } from "@/lib/apiClient";
import { AD_ENDPOINT, adImageUrl } from "@/lib/adConfig";
import { AD_IMAGE_RULES, validateAdImage } from "@/lib/adBannerRules";
import AdvertisementForm from "./AdvertisementForm";

const errMsg = (e, fallback) =>
  e?.response?.data?.detail ||
  e?.response?.data?.message ||
  e?.response?.data?.msg ||
  e?.data?.msg ||
  e?.data?.message ||
  e?.message ||
  fallback;

const ymd = (d) => (d ? new Date(d).toLocaleDateString("en-CA") : null);
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const PAY_STYLE = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-red-200 bg-red-50 text-red-700",
};

function liveStatus(ad) {
  if (!ad.is_active) return { label: "Inactive", cls: "bg-gray-100 text-gray-600" };
  const t = new Date().toLocaleDateString("en-CA");
  const start = ymd(ad.start_date);
  const end = ymd(ad.end_date);
  if (start && start > t) return { label: "Scheduled", cls: "bg-blue-100 text-blue-700" };
  if (end && end < t) return { label: "Expired", cls: "bg-red-100 text-red-700" };
  return { label: "Live", cls: "bg-green-100 text-green-700" };
}

const SIZE = AD_IMAGE_RULES.homepage;

/* One side (left or right) */
function SideCard({ side, ad, onAdd, onEdit, onDelete }) {
  const title = side === "left" ? "Left banner" : "Right banner";
  const st = ad ? liveStatus(ad) : null;
  const pay = ad?.payment_status || "pending";

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-400">Desktop {SIZE.desktop.width}×{SIZE.desktop.height}px · Mobile {SIZE.mobile.width}×{SIZE.mobile.height}px</p>
        </div>
        {ad && (
          <div className="flex flex-wrap justify-end gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${PAY_STYLE[pay] || PAY_STYLE.pending}`}>{pay}</span>
          </div>
        )}
      </div>

      {!ad ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-center">
          <ImageOff className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No {side} banner yet</p>
          <button onClick={() => onAdd(side)} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            <Plus size={15} /> Add {side} banner
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[110px_1fr] gap-3">
            {/* Desktop (vertical) */}
            <div>
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-gray-500"><Monitor size={12} /> Desktop</p>
              <div className="aspect-[1/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                {ad.image_desktop ? (
                  <img src={adImageUrl(ad.image_desktop)} alt={`${title} desktop`} className="h-full w-full object-cover" />
                ) : null}
              </div>
            </div>

            {/* Mobile (wide) + details */}
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-gray-500"><Smartphone size={12} /> Mobile</p>
              <div className="aspect-[3/1] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                {ad.image_mobile ? (
                  <img src={adImageUrl(ad.image_mobile)} alt={`${title} mobile`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-amber-600">No mobile image</div>
                )}
              </div>

              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p className="truncate font-semibold text-gray-900">{ad.title}</p>
                {ad.redirect_url && <p className="truncate text-blue-600">{ad.redirect_url}</p>}
                <p>Start {fmt(ad.start_date)} · End {fmt(ad.end_date)}</p>
                <p>Order {ad.display_order ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
            <button onClick={() => onEdit(ad)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Pencil size={14} /> Edit
            </button>
            <button onClick={() => onDelete(ad)} className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function HomepageBannersAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, ad: null, side: "left" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet(`${AD_ENDPOINT.base}?placement=homepage&limit=50`);
      setAds(res?.data || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load homepage banners"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const byDisplay = (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || b.id - a.id;
  const leftAd = [...ads].sort(byDisplay).find((a) => a.position === "left");
  const rightAd = [...ads].sort(byDisplay).find((a) => a.position === "right");
  const noSide = ads.filter((a) => !a.position);

  const handleSave = async (formData) => {
    // Safety net: re-check the image sizes before uploading
    const checks = [
      ["image_desktop", "desktop", "Desktop image"],
      ["image_mobile", "mobile", "Mobile image"],
    ];
    for (const [fieldName, kind, label] of checks) {
      const file = formData.get(fieldName);
      if (file instanceof File && file.size > 0) {
        const problem = await validateAdImage(file, SIZE[kind], label);
        if (problem) { toast.error(problem); return; }
      }
    }

    setSaving(true);
    try {
      if (modal.ad) await apiPutWithImage(AD_ENDPOINT.byId(modal.ad.id), formData);
      else await apiPostWithImage(AD_ENDPOINT.base, formData);
      toast.success(modal.ad ? "Banner updated" : "Banner created");
      setModal({ open: false, ad: null, side: "left" });
      load();
    } catch (e) {
      toast.error(errMsg(e, "Failed to save banner"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(AD_ENDPOINT.byId(deleteTarget.id));
      toast.success("Banner deleted");
      setAds((list) => list.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      toast.error(errMsg(e, "Failed to delete banner"));
    } finally {
      setDeleting(false);
    }
  };

  const openAdd = (side) => setModal({ open: true, ad: null, side });
  const openEdit = (ad) => setModal({ open: true, ad, side: ad.position || "left" });

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 pb-10 pt-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage Banners</h1>
        <p className="text-md text-gray-500">One vertical banner on the left and one on the right of the homepage hero. Phones show a wide banner instead.</p>
      </div>

      {/* Size guide */}
      <div className="grid gap-2 rounded-xl border border-orange-100 bg-orange-50/60 p-3 text-sm sm:grid-cols-3">
        <p className="flex items-center gap-2 text-gray-700"><Monitor size={15} className="text-orange-500" /> Desktop (left and right): <b>{SIZE.desktop.width} × {SIZE.desktop.height} px</b></p>
        <p className="flex items-center gap-2 text-gray-700"><Smartphone size={15} className="text-orange-500" /> Mobile: <b>{SIZE.mobile.width} × {SIZE.mobile.height} px</b></p>
        <p className="text-gray-500">JPG, PNG or WEBP · max 2 MB · exact size</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <SideCard side="left" ad={leftAd} onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteTarget} />
          <SideCard side="right" ad={rightAd} onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteTarget} />
        </div>
      )}

      {/* Old homepage ads that were saved before left/right existed */}
      {!loading && noSide.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-800">{noSide.length} homepage ad{noSide.length > 1 ? "s" : ""} without a side</p>
          <p className="mb-2 text-xs text-amber-700">Edit each one and choose Left or Right, or it will not show in a side slot.</p>
          <ul className="space-y-1.5">
            {noSide.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm">
                <span className="truncate font-medium text-gray-800">{a.title}</span>
                <button onClick={() => openEdit(a)} className="shrink-0 rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">Set side</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="my-6 w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              {modal.ad ? "Edit" : "Add"} {modal.side} homepage banner
            </h2>
            <AdvertisementForm
              initial={modal.ad}
              categories={[]}
              defaults={{ placement: "homepage", position: modal.side }}
              lockPlacement={!!modal.ad?.position || !modal.ad}
              saving={saving}
              onSubmit={handleSave}
              onCancel={() => !saving && setModal({ open: false, ad: null, side: "left" })}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Delete this banner?</h3>
            <p className="mt-1 text-sm text-gray-500">"{deleteTarget.title}" and its images will be removed. This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}