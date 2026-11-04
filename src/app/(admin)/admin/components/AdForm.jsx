"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";
import { apiGet, apiPostWithImage, apiPutWithImage } from "@/lib/apiClient";
import CONFIG from "@/constance";

const API = { create: "/advertisements", update: (id) => `/advertisements/${id}` };
const SITE_URL = "";

export const SIZES = {
  homepage: { desktop: [1024, 113], mobile: [1800, 600] },
  category: { desktop: [1024, 113], mobile: [1800, 600] },
};

const imgUrl = (n) => `${CONFIG.API_IMAGE_BASE_URL}/images/${n}`;
const errMsg = (e, f) => e?.response?.data?.detail || e?.response?.data?.message || e?.data?.message || e?.message || f;
const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
const lbl = "mb-1 block text-xs font-semibold text-gray-600";

const readSize = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => { resolve([im.naturalWidth, im.naturalHeight]); URL.revokeObjectURL(url); };
    im.onerror = () => { reject(new Error("Not a valid image")); URL.revokeObjectURL(url); };
    im.src = url;
  });

  function RedirectBusinessInput({
    businesses,
    businessId,
    value,
    onType,
    onPick,
  }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [results, setResults] = useState(businesses || []);
    const [searching, setSearching] = useState(false);
  
    useEffect(() => {
      setResults(businesses || []);
    }, [businesses]);
  
    useEffect(() => {
      if (!open || !q.trim()) return;
  
      const timer = setTimeout(async () => {
        try {
          setSearching(true);
  
          const res = await apiGet(
            `/businesses?limit=50&name=${encodeURIComponent(q.trim())}`
          );
  
          const list = Array.isArray(res)
            ? res
            : res?.data || res?.businesses || res?.results || res?.rows || [];
  
          setResults(list);
        } catch (error) {
          console.error("Business search failed:", error);
        } finally {
          setSearching(false);
        }
      }, 400);
  
      return () => clearTimeout(timer);
    }, [q, open]);
  
    const selected = businesses.find(
      (b) => String(b.id) === String(businessId)
    );
  
    return (
      <div className="relative">
        <input
          className={field}
          placeholder="Search business name or paste a URL"
          value={value}
          onFocus={() => {
            setOpen(true);
            setQ("");
            setResults(businesses);
          }}
          onChange={(e) => {
            const v = e.target.value;
            onType(v);
            setQ(v);
            setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
        />
  
        {open && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
  
            {searching && (
              <li className="px-3 py-2 text-xs text-gray-400">
                Searching businesses...
              </li>
            )}
  
            {!searching && results.length === 0 && (
              <li className="px-3 py-2 text-xs text-gray-400">
                No business found
              </li>
            )}
  
            {!searching && results.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(b);
                    setOpen(false);
                    setQ("");
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50"
                >
                  {b.name}
                  <span className="ml-1 text-xs text-gray-400">
                    #{b.id}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
  
        {selected && (
          <p className="mt-1 text-[11px] text-emerald-700">
            Linked business: {selected.name} (#{selected.id})
          </p>
        )}
      </div>
    );
  }

function ImageField({ label, current, file, onPick }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return (
    <div>
      <label className={lbl}>{label}</label>
      <input
        type="file"
        accept="image/*"
        className="text-xs"
        onChange={async (e) => {
          const input = e.target;
          const ok = await onPick(input.files?.[0]);
          if (!ok) input.value = "";
        }}
      />
      <div className="mt-2 flex items-end gap-3">
        {current && (
          <div>
            <p className="mb-0.5 text-[10px] text-gray-400">Current</p>
            <img src={imgUrl(current)} alt="" className={`h-14 rounded border object-contain ${preview ? "opacity-40" : ""}`} />
          </div>
        )}
        {preview && (
          <div>
            <p className="mb-0.5 text-[10px] font-semibold text-emerald-700">New (will replace)</p>
            <img src={preview} alt="" className="h-14 rounded border border-emerald-300 object-contain" />
          </div>
        )}
      </div>
      {current && !preview && <p className="mt-1 text-[11px] text-gray-400">Leave empty to keep the current image.</p>}
    </div>
  );
}

export default function AdForm({ ad, prefill, businesses, categories, onClose, onSaved }) {
  const editing = !!ad;
  const [f, setF] = useState({
    title: ad?.title || "",
    description: ad?.description || prefill?.description || "",
    placement: ad?.placement || "homepage",
    category_id: ad?.category_id || "",
    business_id: ad?.business_id || prefill?.business_id || "",
    redirect_url: ad?.redirect_url || prefill?.redirect_url || "",
    price: ad?.price ?? "",
    duration_days: ad?.duration_days ?? prefill?.duration_days ?? 30,
    display_order: ad?.display_order ?? 0,
    is_active: ad ? !!ad.is_active : true,
  });
  const [desktop, setDesktop] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const [dw, dh] = SIZES[f.placement].desktop;
  const [mw, mh] = SIZES[f.placement].mobile;

  const pick = async (file, kind, setter) => {
    if (!file) return setter(null);
    try {
      const [w, h] = await readSize(file);
      const [rw, rh] = SIZES[f.placement][kind];
      if (w !== rw || h !== rh) {
        toast.error(`${kind} image must be exactly ${rw}×${rh}px (this one is ${w}×${h})`);
        return setter(null);
      }
      setter(file);
    } catch (e) { toast.error(e.message); setter(null); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    if (!f.business_id) return toast.error("Click the Redirect URL field and pick a business from the list");
    if (f.placement === "category" && !f.category_id) return toast.error("Select a category");
    if (!(Number(f.price) >= 1)) return toast.error("Price must be at least ₹1");
    if (!(Number(f.duration_days) >= 1)) return toast.error("Duration must be at least 1 day");
    if (!editing && (!desktop || !mobile)) return toast.error("Upload both the desktop and mobile images");

    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (k === "category_id" && f.placement !== "category") return;
      fd.append(k, typeof v === "boolean" ? (v ? 1 : 0) : v);
    });
    if (desktop) fd.append("image_desktop", desktop);
    if (mobile) fd.append("image_mobile", mobile);

    setSaving(true);
    try {
      const res = editing
        ? await apiPutWithImage(API.update(ad.id), fd)
        : await apiPostWithImage(API.create, fd);

      toast.success(
        res?.data?.message ||
        res?.message ||
        (editing ? "Advertisement updated" : "Advertisement created")
      );

      onSaved();

    } catch (err) {
      toast.error(errMsg(err, "Could not save"));
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-gray-900">{editing ? "Edit advertisement" : "Add advertisement"}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto px-5 py-4">
          <div className="col-span-2">
            <label className={lbl}>Title</label>
            <input className={field} value={f.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Placement</label>
            <select className={field} value={f.placement} onChange={(e) => { set("placement", e.target.value); setDesktop(null); setMobile(null); }}>
              <option value="homepage">Homepage</option>
              <option value="category">Category</option>
            </select>
          </div>
          {f.placement === "category" && (
            <div>
              <label className={lbl}>Category</label>
              <select className={field} value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className={lbl}>Price (₹)</label>
            <input type="number" min="1" step="0.01" className={field} value={f.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Duration (days)</label>
            <input type="number" min="1" className={field} value={f.duration_days} onChange={(e) => set("duration_days", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Display order</label>
            <input type="number" className={field} value={f.display_order} onChange={(e) => set("display_order", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Redirect URL / Business</label>
            <RedirectBusinessInput
              businesses={businesses}
              businessId={f.business_id}
              value={f.redirect_url}
              onType={(v) => set("redirect_url", v)}
              onPick={(b) => setF((p) => ({ ...p, business_id: b.id, redirect_url: `${SITE_URL}/listinginfo/${b.slug}` }))}
            />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Description</label>
            <textarea rows={2} className={field} value={f.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <ImageField
            label={`Desktop image (${dw}×${dh})`}
            current={editing ? ad.image_desktop : null}
            file={desktop}
            onPick={(file) => pick(file, "desktop", setDesktop)}
          />
          <ImageField
            label={`Mobile image (${mw}×${mh})`}
            current={editing ? ad.image_mobile : null}
            file={mobile}
            onPick={(file) => pick(file, "mobile", setMobile)}
          />

          <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />} {editing ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}