"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";
import { adImageUrl } from "@/lib/adConfig";
import { AD_IMAGE_RULES, AD_IMAGE_COMMON, validateAdImage } from "@/lib/adImageRules";
import { apiGet } from "@/lib/apiClient";

const field =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
const label = "mb-1 block text-xs font-semibold text-gray-600";

const toDateInput = (d) => (d ? new Date(d).toLocaleDateString("en-CA") : "");

/* One image picker with preview, size hint and validation */
function ImagePicker({ title, hint, file, existing, onPick, error }) {
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview || (existing ? adImageUrl(existing) : null);

  return (
    <div>
      <span className={label}>{title}</span>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-center hover:border-orange-400">
        {shown ? (
          <img src={shown} alt={title} className="h-24 w-full rounded-md object-contain" />
        ) : (
          <ImagePlus className="h-6 w-6 text-gray-400" />
        )}
        <span className="text-xs font-medium text-gray-600">{shown ? "Change image" : "Choose image"}</span>
        <input
          type="file"
          accept={AD_IMAGE_COMMON.types.join(",")}
          className="hidden"
          onChange={(e) => {
            onPick(e.target.files?.[0] || null);
            e.target.value = ""; // lets the same file be picked again after a fix
          }}
        />
      </label>
      <p className={`mt-1 text-[11px] ${error ? "font-medium text-red-600" : "text-gray-400"}`}>
        {error || hint}
      </p>
    </div>
  );
}

/* Searchable dropdown of all businesses */
function BusinessPicker({ value, initialName, onPick }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    apiGet("/businesses/business-views")
      .then((res) => {
        if (cancelled) return;
        setList(
          (res?.data || []).map((b) => ({
            id: String(b.business_id ?? b.id),
            name: b.business_name ?? b.name ?? `Business #${b.business_id ?? b.id}`,
            owner: b.owner_name || "",
            slug: b.slug || "",
          }))
        );
      })
      .catch(() => { if (!cancelled) setList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = list.find((b) => b.id === String(value));
  const selectedLabel = selected ? selected.name : value ? initialName || `Business #${value}` : "";
  const term = q.trim().toLowerCase();
  const matches = (term
    ? list.filter((b) => b.name.toLowerCase().includes(term) || b.owner.toLowerCase().includes(term) || b.id === term)
    : list
  ).slice(0, 50);

  return (
    <div ref={boxRef} className="relative">
      <label className={label}>Business</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${field} flex items-center justify-between text-left`}
      >
        <span className={`truncate ${selectedLabel ? "text-gray-900" : "text-gray-400"}`}>
          {loading ? "Loading businesses..." : selectedLabel || "Select business"}
        </span>
        <span className="ml-2 text-xs text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, owner or ID..."
            className="w-full rounded-t-lg border-b border-gray-100 px-3 py-2 text-sm outline-none"
          />
          <ul className="max-h-56 overflow-y-auto py-1 text-sm">
            <li>
              <button type="button" onClick={() => { onPick(null); setOpen(false); setQ(""); }} className="w-full px-3 py-1.5 text-left text-gray-500 hover:bg-gray-50">
                No business
              </button>
            </li>
            {matches.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => { onPick(b); setOpen(false); setQ(""); }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-orange-50 ${b.id === String(value) ? "bg-orange-50 font-semibold" : ""}`}
                >
                  <span className="block truncate text-gray-900">{b.name}</span>
                  <span className="block truncate text-[11px] text-gray-400">ID {b.id}{b.owner ? ` · ${b.owner}` : ""}</span>
                </button>
              </li>
            ))}
            {!loading && matches.length === 0 && <li className="px-3 py-2 text-gray-400">No business found</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdvertisementForm({
  initial,
  categories = [],
  saving,
  onSubmit,
  onCancel,
  defaults = {},        // prefill for a NEW ad, e.g. { placement: "homepage", position: "left" }
  lockPlacement = false, // true = placement and side cannot be changed (used by the homepage banner screen)
}) {
  const editing = !!initial;

  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    placement: initial?.placement || defaults.placement || "homepage",
    position: initial?.position || defaults.position || "left", // homepage only: left or right banner
    category_id: initial?.category_id ? String(initial.category_id) : "",
    business_id: initial?.business_id ? String(initial.business_id) : "",
    redirect_url: initial?.redirect_url || "",
    display_order: initial?.display_order ?? 0,
    price: initial?.price ?? 999,
    duration_days: initial?.duration_days ?? 30,
    start_date: toDateInput(initial?.start_date),
    end_date: toDateInput(initial?.end_date),
    is_active: initial ? !!initial.is_active : true,
  });
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showBusinessList, setShowBusinessList] = useState(false);
  const [businessSearch, setBusinessSearch] = useState("");
  const [businesses, setBusinesses] = useState([]);

// Search businesses from the API, not just the first 10 loaded records.
useEffect(() => {
  const term = businessSearch.trim();

  // Don't fetch again when a business is selected or the search is cleared.
  if (term.length < 2 || !showBusinessList) {
    setBusinesses([]);
    return;
  }

  let cancelled = false;

  const timer = setTimeout(async () => {
    try {
      const response = await apiGet(
        `/businesses?search=${encodeURIComponent(term)}&page=1&limit=10`
      );

      if (cancelled) return;

      // Supports either an array response or a paginated response.
      const rows = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      setBusinesses(
        rows.map((b) => ({
          ...b,
          id: String(b.business_id ?? b.id),
          name: b.business_name ?? b.name ?? "",
          slug: b.slug ?? "",
        }))
      );
    } catch (error) {
      if (!cancelled) {
        console.error("Failed to search businesses:", error);
        setBusinesses([]);
      }
    }
  }, 350);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [businessSearch, showBusinessList]);

  // Filter businesses based on typing
  const filteredBusinesses = businesses.filter((business) =>
    business.name?.toLowerCase().includes(businessSearch.toLowerCase())
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const rules = AD_IMAGE_RULES[form.placement] || {};
  const sizeText = (r) =>
    r
      ? `${r.exact ? "Exactly" : "Recommended"} ${r.width}×${r.height}px · JPG, PNG or WEBP · max ${AD_IMAGE_COMMON.maxMB} MB`
      : "";

  const pickImage = async (kind, file) => {
    const key = kind === "desktop" ? "image_desktop" : "image_mobile";
    if (!file) {
      kind === "desktop" ? setDesktopFile(null) : setMobileFile(null);
      setErrors((e) => ({ ...e, [key]: null }));
      return;
    }
    // Keep the file even when it is the wrong size: it stays visible in the preview
    // and is checked again if the placement changes. Saving is blocked while it has an error.
    kind === "desktop" ? setDesktopFile(file) : setMobileFile(file);
    const problem = await validateAdImage(file, rules[kind], kind === "desktop" ? "Desktop image" : "Mobile image");
    setErrors((e) => ({ ...e, [key]: problem || null }));
    if (problem) toast.error(problem);
  };

  // Placement decides the allowed size, so re-check both images when it changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      if (desktopFile) next.image_desktop = await validateAdImage(desktopFile, rules.desktop, "Desktop image");
      if (mobileFile) next.image_mobile = await validateAdImage(mobileFile, rules.mobile, "Mobile image");
      if (!cancelled && Object.keys(next).length) setErrors((e) => ({ ...e, ...next }));
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.placement]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.placement === "category" && !form.category_id) e.category_id = "Choose a category";
    if (!editing && !desktopFile) e.image_desktop = "Desktop image is required";
    if (form.start_date && form.end_date && form.end_date < form.start_date) e.end_date = "End date must be after the start date";
    if (Number(form.price) < 0) e.price = "Price cannot be negative";
    setErrors((prev) => ({ ...prev, ...e }));
    if (errors.image_desktop || errors.image_mobile) toast.error("Fix the image size before saving.");
    return Object.keys(e).length === 0 && !errors.image_desktop && !errors.image_mobile;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    const values = {
      title: form.title.trim(),
      description: form.description.trim(),
      placement: form.placement,
      position: form.placement === "homepage" ? form.position : "",
      category_id: form.placement === "category" ? form.category_id : "",
      business_id: form.business_id,
      redirect_url: form.redirect_url.trim(),
      display_order: form.display_order,
      price: form.price,
      duration_days: form.duration_days,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active ? 1 : 0,
    };
    // empty values are skipped so the backend never receives "" for numbers or dates
    Object.entries(values).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
    });
    if (desktopFile) fd.append("image_desktop", desktopFile);
    if (mobileFile) fd.append("image_mobile", mobileFile);
    onSubmit(fd);
  };

  const err = (k) => (errors[k] ? <p className="mt-1 text-[11px] font-medium text-red-600">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Title *</label>
          <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={150} placeholder="Banner title" />
          {err("title")}
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Description</label>
          <textarea className={field} rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={500} placeholder="Short description (optional)" />
        </div>

        <div>
          <label className={label}>Placement *</label>
          <select className={field} value={form.placement} disabled={lockPlacement} onChange={(e) => set("placement", e.target.value)}>
            <option value="homepage">Homepage</option>
            <option value="category">Category</option>
          </select>
        </div>

        {form.placement === "homepage" && (
          <div>
            <label className={label}>Banner side *</label>
            <select className={field} value={form.position} disabled={lockPlacement} onChange={(e) => set("position", e.target.value)}>
              <option value="left">Left banner (vertical)</option>
              <option value="right">Right banner (vertical)</option>
            </select>
            <p className="mt-1 text-[11px] text-gray-400">Create one advertisement for the left and one for the right.</p>
          </div>
        )}

        {form.placement === "category" && (
          <div>
            <label className={label}>Category *</label>
            <select className={field} value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {err("category_id")}
          </div>
        )}

        {/* <div>
          <label className={label}>Business ID</label>
          <input type="number" min="0" className={field} value={form.business_id} onChange={(e) => set("business_id", e.target.value)} placeholder="Owner business (needed for payment)" />
        </div> */}

        {/* <div>
          <label className={label}>Redirect URL</label>
          <input className={field} value={form.redirect_url} onChange={(e) => set("redirect_url", e.target.value)} placeholder="/businessDetail/slug" />
          <p className="mt-1 text-[11px] text-gray-400">Filled automatically when you pick a business. You can also type any link.</p>
        </div> */}


<div className="relative">
  <label className={label}>Redirect URL</label>

  <input
    className={field}
    value={businessSearch}
    onChange={(e) => {
      const value = e.target.value;
      setBusinessSearch(value);
      set("redirect_url", value);
      setShowBusinessList(true);
    }}
    onFocus={() => {
      // Keep searching independent of the selected URL.
      setBusinessSearch("");
      setShowBusinessList(true);
    }}
    placeholder="Search business or enter URL..."
    autoComplete="off"
  />

  {showBusinessList && (
    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {filteredBusinesses.length > 0 ? (
        <ul className="max-h-56 overflow-y-auto">
          {filteredBusinesses.map((business) => (
            <li key={business.id}>
              <button
                type="button"
                onClick={() => {
                  const url = `/businessDetail/${business.slug}`;

                  set("business_id", business.id);
                  set("redirect_url", url);
                  setBusinessSearch(url);
                  setShowBusinessList(false);
                }}
                className="w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50"
              >
                <p className="font-medium">{business.name}</p>
                <p className="text-xs text-gray-400">
                  {business.slug}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-3 text-sm text-gray-500">
          No businesses found. You can enter a custom URL.
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setShowBusinessList(false);
          set("redirect_url", businessSearch);
        }}
        className="w-full border-t px-4 py-2 text-left text-xs text-gray-500 hover:bg-gray-50"
      >
        Use this URL / Close list
      </button>
    </div>
  )}

  <p className="mt-1 text-[11px] text-gray-400">
    Search and select a business to fill its redirect URL,
    or enter a custom URL.
  </p>
</div>


        <div>
          <label className={label}>Price (₹)</label>
          <input type="number" min="0" step="0.01" className={field} value={form.price} onChange={(e) => set("price", e.target.value)} />
          {err("price")}
        </div>

        <div>
          <label className={label}>Duration after payment (days)</label>
          <input type="number" min="1" className={field} value={form.duration_days} onChange={(e) => set("duration_days", e.target.value)} />
        </div>

        <div>
          <label className={label}>Start date</label>
          <input type="date" className={field} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
        </div>

        <div>
          <label className={label}>End date</label>
          <input type="date" className={field} value={form.end_date} min={form.start_date || undefined} onChange={(e) => set("end_date", e.target.value)} />
          {err("end_date")}
        </div>

        <div>
          <label className={label}>Display order</label>
          <input type="number" className={field} value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
        </div>

        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-orange-500" />
          Active
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ImagePicker
          title={`Desktop image${editing ? "" : " *"}`}
          hint={sizeText(rules.desktop)}
          file={desktopFile}
          existing={initial?.image_desktop}
          onPick={(f) => pickImage("desktop", f)}
          error={errors.image_desktop}
        />
        <ImagePicker
          title="Mobile image"
          hint={sizeText(rules.mobile)}
          file={mobileFile}
          existing={initial?.image_mobile}
          onPick={(f) => pickImage("mobile", f)}
          error={errors.image_mobile}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button type="button" onClick={onCancel} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {saving ? "Saving..." : editing ? "Update Advertisement" : "Create Advertisement"}
        </button>
      </div>
    </form>
  );
}