"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  FileText,
  Download,
} from "lucide-react";
import {
  apiGet,
  apiPostWithImage,
  apiPutWithImage,
  apiPut,
  apiDelete,
} from "@/lib/apiClient";
import CONFIG from "@/constance";

/* ── Edit these paths to match the Navi backend ── */
const API = {
  list: "/advertisements?limit=100",        // real route: GET /api/advertisements
  create: "/advertisements",                // guess: POST multipart
  update: (id) => `/advertisements/${id}`,  // guess: PUT multipart
  remove: (id) => `/advertisements/${id}`,  // guess: DELETE
  paymentStatus: (id) => `/AdPayment/${id}/paymentStatus`, // confirmed from your controller
  businesses: "/businesses?limit=1000",     // getBusinesses; check the Network tab for the real response shape          // guess: returns [{id, name}] (or { businesses: [...] })
  categories: "/categories",                // guess: returns [{id, name}]
};

const SIZES = {
  homepage: { desktop: [1024, 113], mobile: [1800, 600] },
  category: { desktop: [1024, 113], mobile: [1800, 600] },
};

const imgUrl = (n) =>
  n ? `${CONFIG.IMAGE_BASE_URL}/uploads/ads/${encodeURIComponent(n)}` : ""; const todayYmd = () => new Date().toLocaleDateString("en-CA");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-");
const errMsg = (e, f) => e?.response?.data?.detail || e?.response?.data?.message || e?.data?.message || e?.message || f;
const asList = (res) => (Array.isArray(res) ? res : res?.data || res?.businesses || res?.categories || res?.results || res?.rows || []);

const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
const lbl = "mb-1 block text-xs font-semibold text-gray-600";

const readSize = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => { resolve([im.naturalWidth, im.naturalHeight]); URL.revokeObjectURL(url); };
    im.onerror = () => { reject(new Error("Not a valid image")); URL.revokeObjectURL(url); };
    im.src = url;
  });

const isExpired = (a) => !!a.end_date && a.end_date < todayYmd();

/* ── Searchable business dropdown ── */
function BusinessSelect({ businesses, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = businesses.find((b) => String(b.id) === String(value));
  const list = businesses.filter((b) => (b.name || "").toLowerCase().includes(q.toLowerCase())).slice(0, 50);
  return (
    <div className="relative">
      {/* <button type="button" onClick={() => setOpen((o) => !o)} className={`${field} flex items-center justify-between text-left`}>
        <span className={selected ? "text-gray-900" : "text-gray-400"}>{selected?.name || "Select business"}</span>
        <ChevronDown size={14} />
      </button> */}
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business..." className="w-full border-b border-gray-100 px-3 py-2 text-sm outline-none" />
          <ul className="max-h-48 overflow-y-auto">
            {list.length === 0 && <li className="px-3 py-2 text-xs text-gray-400">No match</li>}
            {list.map((b) => (
              <li key={b.id}>
                <button type="button" onClick={() => { onChange(b.id); setOpen(false); setQ(""); }} className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50">
                  {b.name} <span className="text-xs text-gray-400">#{b.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


/* ── Redirect URL input that lists businesses on focus and filters while typing ── */
const SITE_URL = ""; // e.g. "https://mazhinavimumbai.com". Leave "" for a relative path.

function RedirectBusinessInput({ businesses, businessId, value, onType, onPick }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = businesses.find((b) => String(b.id) === String(businessId));
  const list = businesses
    .filter((b) => (b.name || "").toLowerCase().includes(q.trim().toLowerCase()))
    .slice(0, 50);

  return (
    <div className="relative">
      <input
        className={field}
        placeholder="Click and type a business name, or paste a URL"
        value={value}
        onFocus={() => { setQ(""); setOpen(true); }}
        onChange={(e) => { onType(e.target.value); setQ(e.target.value); setOpen(true); }}
        onBlur={() => setOpen(false)}
      />
      {open && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {list.length === 0 && <li className="px-3 py-2 text-xs text-gray-400">No business found</li>}
          {list.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(b); setOpen(false); setQ(""); }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                {b.name} <span className="text-xs text-gray-400">#{b.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <p className="mt-1 text-[11px] text-emerald-700">Linked business: {selected.name} (#{selected.id})</p>
      )}
    </div>
  );
}

/* ── Create / edit form ── */
function AdForm({ ad, businesses, categories, onClose, onSaved }) {
  const editing = !!ad;
  const [f, setF] = useState({
    title: ad?.title || "",
    description: ad?.description || "",
    placement: ad?.placement || "homepage",
    category_id: ad?.category_id || "",
    business_id: ad?.business_id || "",
    redirect_url: ad?.redirect_url || "",
    price: ad?.price ?? "",
    duration_days: ad?.duration_days ?? 30,
    display_order: ad?.display_order ?? 0,
    is_active: ad ? !!ad.is_active : true,
    start_date: ad?.start_date ? String(ad.start_date).slice(0, 10) : "",
    end_date: ad?.end_date ? String(ad.end_date).slice(0, 10) : "",
  });

  const [desktop, setDesktop] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const [dw, dh] = SIZES[f.placement].desktop;
  const [mw, mh] = SIZES[f.placement].mobile;

  const pick = async (file, kind, setter) => {
    if (!file) { setter(null); return true; }
    try {
      const [w, h] = await readSize(file);
      const [rw, rh] = SIZES[f.placement][kind];
      if (w !== rw || h !== rh) {
        toast.error(`${kind} image must be exactly ${rw}×${rh}px (this one is ${w}×${h})`);
        setter(null);
        return false;
      }
      setter(file);
      return true;
    } catch (e) { toast.error(e.message); setter(null); return false; }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    if (!f.business_id) return toast.error("Click the Redirect URL field and pick a business from the list");
    if (f.placement === "category" && !f.category_id) return toast.error("Select a category");
    if (!(Number(f.price) >= 1)) return toast.error("Price must be at least ₹1");
    if (!(Number(f.duration_days) >= 1)) return toast.error("Duration must be at least 1 day");
    if (f.start_date && f.end_date && f.end_date < f.start_date) return toast.error("End date cannot be before the start date");
    if (f.start_date && f.end_date && f.end_date < f.start_date) return toast.error("End date cannot be before the start date");
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
        res?.message || (editing ? "Advertisement updated" : "Advertisement created")
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
          {/* <div className="col-span-2">
            <label className={lbl}>Business</label>
            <BusinessSelect businesses={businesses} value={f.business_id} onChange={(v) => set("business_id", v)} />
          </div> */}
          <div>
            <label className={lbl}>Placement</label>
            <select className={field} value={f.placement} disabled={editing} onChange={(e) => { set("placement", e.target.value); setDesktop(null); setMobile(null); }}>
              <option value="homepage">Homepage</option>
              <option value="category">Category</option>
            </select>
          </div>
          {f.placement === "homepage" ? null : (
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
          {/* <div className="col-span-2">
          <div>
            <label className={lbl}>Start date</label>
            <input type="date" className={field} value={f.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>End date</label>
            <input type="date" className={field} min={f.start_date || undefined} value={f.end_date} onChange={(e) => set("end_date", e.target.value)} />
          </div>
          <p className="col-span-2 -mt-1 text-[11px] text-gray-400">
            Optional when creating. The dates are set when the owner pays. Changing them here changes when the banner runs.
          </p>
          </div> */}

          <div>
            <label className={lbl}>Start date</label>
            <input type="date" className={field} value={f.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>End date</label>
            <input type="date" className={field} min={f.start_date || undefined} value={f.end_date} onChange={(e) => set("end_date", e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className={lbl}>Redirect URL / Business</label>
            <RedirectBusinessInput
              businesses={businesses}
              businessId={f.business_id}
              value={f.redirect_url}
              onType={(v) => set("redirect_url", v)}
              onPick={(b) =>
                setF((p) => ({
                  ...p,
                  business_id: b.id,
                  redirect_url: `${SITE_URL}/listinginfo/${b.slug}`,
                }))
              }
            />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Description</label>
            <textarea rows={2} className={field} value={f.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div>
            <label className={lbl}>Desktop image ({dw}×{dh})</label>
            <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0], "desktop", setDesktop)} className="text-xs" />
            {editing && !desktop && ad.image_desktop && <img src={imgUrl(ad.image_desktop)} alt="" className="mt-2 h-14 rounded border object-contain" />}
          </div>
          <div>
            <label className={lbl}>Mobile image ({mw}×{mh})</label>
            <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0], "mobile", setMobile)} className="text-xs" />
            {editing && !mobile && ad.image_mobile && <img src={imgUrl(ad.image_mobile)} alt="" className="mt-2 h-14 rounded border object-contain" />}
          </div>

          <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={f.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
          </label>
          {!editing && <p className="col-span-2 text-xs text-gray-400">New banners start as unpaid. The owner pays from My Business, or you can mark it paid in the table.</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />} {editing ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Screen ── */
export default function Advertisements() {
  const [ads, setAds] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);   // null | "new" | ad
  const [zoom, setZoom] = useState(null);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState("");
  const [payment, setPayment] = useState("");
  const [state, setState] = useState("");        // "" | running | expired | renewal
  const [dateMode, setDateMode] = useState("created"); // created | starts | running
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [invoiceModal, setInvoiceModal] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setAds(asList(await apiGet(API.list))); }
    catch (e) { toast.error(errMsg(e, "Failed to load advertisements")); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    apiGet(API.businesses).then((r) => setBusinesses(asList(r))).catch(() => {});
    apiGet(API.categories).then((r) => setCategories(asList(r))).catch(() => {});
  }, [load]);

  const openInvoiceHistory = async (ad) => {
    setInvoiceModal(ad);
    setInvoices([]);
    setInvoiceLoading(true);
  
    try {
      const response = await apiGet(
        `/advertisement-invoices/business/${ad.business_id}`
      );
  
      setInvoices(
        Array.isArray(response)
          ? response
          : response?.data || []
      );
    } catch (error) {
      console.error("Failed to load invoice history:", error);
      toast.error("Unable to load invoice history");
    } finally {
      setInvoiceLoading(false);
    }
  };


  
const downloadInvoice = async (invoice) => {
  try {
    setDownloadingId(invoice.id);

    const response = await fetch(
      `${CONFIG.API_BASE_URL}/advertisement-invoices/${invoice.id}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not download invoice");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoice_number || "Invoice"}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice download error:", error);
    toast.error(error.message || "Invoice download failed");
  } finally {
    setDownloadingId(null);
  }
};


  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return ads.filter((a) => {
      if (s && ![a.title, a.business_name, a.category_name].some((x) => (x || "").toLowerCase().includes(s))) return false;
      if (placement && a.placement !== placement) return false;
      if (payment && a.payment_status !== payment) return false;
      if (state === "expired" && !isExpired(a)) return false;
      if (state === "running" && !(a.payment_status === "paid" && a.is_active && !isExpired(a))) return false;
      if (state === "renewal" && a.renewal_status !== "pending") return false;
      if (date) {
        if (dateMode === "created" && String(a.created_at || "").slice(0, 10) !== date) return false;
        if (dateMode === "starts" && String(a.start_date || "").slice(0, 10) !== date) return false;
        if (dateMode === "running" && !(a.start_date && a.end_date && a.start_date <= date && a.end_date >= date)) return false;
      }
      return true;
    });
  }, [ads, search, placement, payment, state, dateMode, date]);

  useEffect(() => { setPage(1); }, [search, placement, payment, state, dateMode, date, limit]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const rows = filtered.slice((page - 1) * limit, page * limit);

  const changePayment = async (a, value) => {
    try {
      await apiPut(API.paymentStatus(a.id), { payment_status: value });
      toast.success("Payment status updated");
      load();
    } catch (e) { toast.error(errMsg(e, "Could not update payment status")); }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try { await apiDelete(API.remove(a.id)); toast.success("Deleted"); load(); }
    catch (e) { toast.error(errMsg(e, "Could not delete")); }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-500">Add banners, set price and duration, and manage payment status.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => setForm("new")} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"><Plus size={15} /> Add advertisement</button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${field} pl-9`} placeholder="Search title, business, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={field} value={placement} onChange={(e) => setPlacement(e.target.value)}>
          <option value="">All placements</option><option value="homepage">Homepage</option><option value="category">Category</option>
        </select>
        <select className={field} value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="">All payments</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option>
        </select>
        <select className={field} value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All states</option><option value="running">Running</option><option value="expired">Expired</option><option value="renewal">Renewal requested</option>
        </select>
        <div className="flex gap-1">
          <select className={`${field} !w-auto`} value={dateMode} onChange={(e) => setDateMode(e.target.value)}>
            <option value="created">Created</option><option value="starts">Starts</option><option value="running">Running on</option>
          </select>
          <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {["Banner", "Placement", "Start", "End", "Price", "Payment", "Status", ""].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
             <tr><td colSpan={8} className="px-3 py-10 text-center text-gray-400"><Loader2 className="mx-auto animate-spin" /></td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-10 text-center text-gray-400">No advertisements found</td></tr>
            ) : rows.map((a) => (
              <tr key={a.id} className="align-middle">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setZoom(a)} className="cursor-zoom-in">
                      <img src={imgUrl(a.image_desktop)} alt={a.title} className="h-12 w-16 rounded border border-gray-100 bg-gray-100 object-cover" />
                    </button>
                    <span className="max-w-[160px] truncate font-semibold text-gray-900">{a.title}</span>
                  </div>
                </td>
                <td className="px-3 py-2 capitalize text-gray-600">
                {a.placement}{a.placement === "category" && a.category_name ? ` · ${a.category_name}` : ""}        
                        </td>
                <td className="px-3 py-2 text-gray-600">{fmtDate(a.start_date)}</td>
                <td className="px-3 py-2 text-gray-600">{fmtDate(a.end_date)}</td>
                <td className="px-3 py-2 text-gray-600">₹{a.price}</td>
                <td className="px-3 py-2">
                  <select value={a.payment_status} onChange={(e) => changePayment(a, e.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium">
                    <option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {isExpired(a)
                      ? <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">Expired</span>
                      : a.payment_status === "paid" && a.is_active
                        ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Running</span>
                        : <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-500">Inactive</span>}
                    {a.renewal_status === "pending" && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Renewal requested</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                <div className="flex gap-1">
  <button
    onClick={() => setForm(a)}
    aria-label="Edit"
    className="rounded-lg border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50"
  >
    <Pencil size={14} />
  </button>

  <button
    onClick={() => openInvoiceHistory(a)}
    title="Invoice History"
    className="rounded-lg border border-blue-200 p-1.5 text-blue-600 hover:bg-blue-50"
  >
    <FileText size={14} />
  </button>

  <button
    onClick={() => remove(a)}
    aria-label="Delete"
    className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
  >
    <Trash2 size={14} />
  </button>
</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{(page - 1) * limit + 1}–{Math.min(page * limit, filtered.length)} of {filtered.length}</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-md border border-gray-300 px-2 py-1">
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n} rows</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 p-1.5 disabled:opacity-40"><ChevronLeft size={15} /></button>
            <span className="px-2 font-medium">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-300 p-1.5 disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}

      {form && (
        <AdForm
          ad={form === "new" ? null : form}
          businesses={businesses}
          categories={categories}
          onClose={() => setForm(null)}
          onSaved={() => { setForm(null); load(); }}
        />
      )}

      {zoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setZoom(null)}>
          <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white"><X size={18} /></button>
          <img src={imgUrl(zoom.image_desktop)} alt={zoom.title} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain" />
        </div>
      )}



{invoiceModal && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Invoice History
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {invoiceModal.business_name || "Business"} 
            {" · "}Advertisement #{invoiceModal.id}
          </p>
        </div>

        <button
          onClick={() => setInvoiceModal(null)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Invoice count */}
      <div className="flex items-center justify-between bg-gray-50 px-5 py-3">
        <span className="text-sm font-semibold text-gray-700">
          All Invoices
        </span>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {invoices.length} Invoices
        </span>
      </div>

      {/* Invoice list */}
      <div className="max-h-[55vh] overflow-y-auto p-5">

        {invoiceLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={28} />
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center">
            <FileText size={38} className="mx-auto mb-3 text-gray-300" />

            <h3 className="font-semibold text-gray-700">
              No invoices found
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Invoices will appear here after successful payments.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-800">
                      {invoice.invoice_number}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {invoice.ad_title || "Advertisement"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {invoice.payment_date
                        ? new Date(invoice.payment_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{Number(invoice.amount || 0).toLocaleString("en-IN")}
                    </p>

                    <span className="text-[11px] font-medium text-emerald-600">
                      Paid
                    </span>
                  </div>

                  <button
                    onClick={() => downloadInvoice(invoice)}
                    disabled={downloadingId === invoice.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {downloadingId === invoice.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}

                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t bg-gray-50 px-5 py-3">
        <p className="self-center text-xs text-gray-500">
          Previous and latest invoices
        </p>

        <button
          onClick={() => setInvoiceModal(null)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}