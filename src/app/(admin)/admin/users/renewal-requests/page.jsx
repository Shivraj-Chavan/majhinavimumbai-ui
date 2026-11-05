"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search, Check, X, History as HistoryIcon, Loader2, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { apiGet, apiPut } from "@/lib/apiClient";
import CONFIG from "@/constance"; // adjust if your admin app uses another config path

/* Direct API paths (mounted at /api/AdPayment) */
const API = {
  list: "/AdPayment/renewals",
  approve: (id) => `/AdPayment/renewals/${id}/approve`,
  reject: (id) => `/AdPayment/renewals/${id}/reject`,
  history: (adId) => `/AdPayment/${adId}/history`,
};

const adImageUrl = (img) => {
  if (!img) return "/assets/store.jpg";

  // Already a complete URL
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // Remove leading slashes
  const imageName = img.replace(/^\/+/, "");

  // Avoid adding /images twice
  if (imageName.startsWith("images/")) {
    return `${CONFIG.IMAGE_BASE_URL}/${imageName}`;
  }

  return `${CONFIG.IMAGE_BASE_URL}/images/${imageName}`;
};

const errMsg = (e, fallback) =>
  e?.response?.data?.detail || e?.response?.data?.message || e?.response?.data?.msg ||
  e?.data?.message || e?.data?.msg || e?.message || fallback;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T00:00:00`);
  d.setDate(d.getDate() + Number(n || 0));
  return d.toLocaleDateString("en-CA");
};
const diffDays = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000);
const todayYmd = () => new Date().toLocaleDateString("en-CA");

const TABS = [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["paid", "Paid"], ["", "All"]];
const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
const lbl = "mb-1 block text-xs font-semibold text-gray-600";

const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const s = Math.max(2, current - 1);
  const e = Math.min(total - 1, current + 1);
  if (s > 2) pages.push("…");
  for (let i = s; i <= e; i++) pages.push(i);
  if (e < total - 1) pages.push("…");
  pages.push(total);
  return pages;
};

/* ───────── Approve popup: admin sets price and dates ───────── */
function ApproveModal({ req, saving, onSave, onClose }) {
  const [price, setPrice] = useState(String(req.current_price ?? ""));
  const [start, setStart] = useState(todayYmd());
  const [days, setDays] = useState(30);
  const [end, setEnd] = useState(addDays(todayYmd(), 30));

  const onStart = (v) => { setStart(v); if (v) setEnd(addDays(v, days)); };
  const onDays = (v) => { setDays(v); if (start && v !== "") setEnd(addDays(start, v)); };
  const onEnd = (v) => { setEnd(v); if (start && v) setDays(diffDays(start, v)); };

  const submit = (e) => {
    e.preventDefault();
    if (!(Number(price) >= 1)) return toast.error("Enter a price of at least ₹1");
    if (!start || !end) return toast.error("Choose the start and end dates");
    if (end < start) return toast.error("End date cannot be before the start date");
    onSave({ price: Number(price), start_date: start, end_date: end });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-bold text-gray-900">Approve renewal</h3>
        <p className="mt-0.5 text-xs text-gray-500">{req.title} · {req.business_name}. After approval the owner can pay this amount.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Price (₹)</label>
            <input type="number" min="1" step="0.01" className={field} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Start date</label>
            <input type="date" className={field} value={start} onChange={(e) => onStart(e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Days</label>
            <input type="number" min="1" className={field} value={days} onChange={(e) => onDays(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>End date</label>
            <input type="date" className={field} value={end} min={start} onChange={(e) => onEnd(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
          </button>
        </div>
      </form>
    </div>
  );
}

/* ───────── Reject popup ───────── */
function RejectModal({ req, saving, onSave, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-bold text-gray-900">Reject renewal</h3>
        <p className="mt-0.5 text-xs text-gray-500">{req.title} · {req.business_name}. The owner will see your reason.</p>
        <textarea rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" className={`${field} mt-3`} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(reason)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── History popup: every payment and request of one banner ───────── */
function HistoryModal({ req, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet(API.history(req.advertisement_id))
      .then((res) => { if (!cancelled) setData(res?.data || null); })
      .catch(() => { if (!cancelled) setData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [req.advertisement_id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-gray-900">{req.title} · History</h3>
            <p className="text-xs text-gray-400">{req.business_name} · {req.owner_name}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="space-y-5 overflow-y-auto px-5 py-4 text-xs">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
          ) : !data ? (
            <p className="py-8 text-center text-sm text-gray-500">Could not load the history.</p>
          ) : (
            <>
              <section>
                <h4 className="mb-2 font-bold uppercase tracking-wide text-gray-500">Payments</h4>
                {data.payments.length === 0 ? (
                  data.ad?.payment_status === "paid" ? (
                    <div className="mb-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <b className="text-sm text-gray-900">₹{data.ad.price}</b>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Paid</span>
                        <span className="rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">Initial</span>
                      </div>
                      <p className="mt-1 text-gray-600">Period: {fmtDate(data.ad.start_date)} – {fmtDate(data.ad.end_date)}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">Payment ID not recorded for this run.</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No payments yet.</p>
                  )
                ) : data.payments.map((p) => (
                  <div key={p.id} className="mb-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        <b className="text-sm text-gray-900">₹{p.price}</b>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Paid</span>
                        <span className="rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                          {p.renewal_request_id ? "Renewal" : "Initial"}
                        </span>
                      </span>
                      <span className="text-gray-400">{fmtDate(p.paid_at)}</span>
                    </div>
                    <p className="mt-1 text-gray-600">Period: {fmtDate(p.period_start)} – {fmtDate(p.period_end)}</p>
                    <p className="mt-0.5 break-all text-gray-400">Payment ID {p.razorpay_payment_id || "-"}</p>
                  </div>
                ))}
              </section>
              <section>
                <h4 className="mb-2 font-bold uppercase tracking-wide text-gray-500">Renewal requests</h4>
                {data.requests.length === 0 ? <p className="text-gray-400">No renewal requests.</p> : data.requests.map((r) => (
                  <div key={r.id} className="mb-2 rounded-xl border border-gray-100 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[r.status] || STATUS_STYLE.pending}`}>{r.status}</span>
                      <span className="text-gray-400">Requested {fmtDate(r.created_at)}</span>
                    </div>
                    {r.note && <p className="mt-1.5 text-gray-600">Owner: {r.note}</p>}
                    {r.admin_reason && <p className="mt-1 text-gray-600">Admin: {r.admin_reason}</p>}
                    {(r.status === "approved" || r.status === "paid") && (
                      <p className="mt-1 font-medium text-gray-700">{fmtDate(r.approved_start)} – {fmtDate(r.approved_end)} · ₹{r.approved_price}</p>
                    )}
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Screen ───────── */
export default function RenewalRequests() {
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, paid: 0 });
  const [loading, setLoading] = useState(true);

  const [approveReq, setApproveReq] = useState(null);
  const [rejectReq, setRejectReq] = useState(null);
  const [historyReq, setHistoryReq] = useState(null);
  const [zoomImg, setZoomImg] = useState(null); // { src, title }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!zoomImg) return;
    const onKey = (e) => { if (e.key === "Escape") setZoomImg(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomImg]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (tab) qs.set("status", tab);
      if (search.trim()) qs.set("search", search.trim());
      const res = await apiGet(`${API.list}?${qs.toString()}`);
      setRows(res?.data || []);
      setTotal(res?.total ?? 0);
      setTotalPages(res?.totalPages || 1);
      if (res?.counts) setCounts(res.counts);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load renewal requests"));
    } finally {
      setLoading(false);
    }
  }, [tab, search, page, limit]);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search typing
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => { setPage(1); }, [tab, search, limit]);

  const approve = async (body) => {
    setSaving(true);
    try {
      const res = await apiPut(API.approve(approveReq.id), body);
      toast.success(res?.message || "Renewal approved");
      setApproveReq(null);
      load();
    } catch (e) {
      toast.error(errMsg(e, "Could not approve"));
    } finally {
      setSaving(false);
    }
  };

  const reject = async (reason) => {
    setSaving(true);
    try {
      const res = await apiPut(API.reject(rejectReq.id), { reason });
      toast.success(res?.message || "Renewal rejected");
      setRejectReq(null);
      load();
    } catch (e) {
      toast.error(errMsg(e, "Could not reject"));
    } finally {
      setSaving(false);
    }
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-10 pt-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Renewal Requests</h1>
        <p className="text-md text-gray-500">Owners ask to renew an expired banner here. Approve with a price and dates, or reject.</p>
      </div>

      {/* Tabs + search */}
      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(([key, name]) => (
            <button
              key={name}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {name}
              {key && (
                <span className={`rounded-full px-1.5 text-[11px] ${tab === key ? "bg-white/25" : key === "pending" && counts.pending ? "bg-blue-500 text-white" : "bg-white text-gray-500"}`}>
                  {counts[key] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative max-w-md">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${field} pl-9`} placeholder="Search banner, business, owner, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center">
          <p className="font-semibold text-gray-700">No renewal requests here</p>
          <p className="mt-1 text-sm text-gray-400">New requests from owners will appear in Pending.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setZoomImg({ src: adImageUrl(r.image_desktop), title: r.title })}
                  aria-label={`Zoom ${r.title}`}
                  className="shrink-0 cursor-zoom-in self-start rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <img
  src={adImageUrl(r.image_desktop)}
  alt={r.title || "Advertisement banner"}
  onError={(e) => {
    console.error("Banner image failed:", e.currentTarget.src);
    e.currentTarget.src = "/assets/store.jpg";
  }}
  className="h-24 w-16 shrink-0 rounded-lg border border-gray-100 bg-gray-100 object-cover sm:h-20 sm:w-28"
/>

                </button>

                <div className="min-w-0 flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{r.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[r.status] || STATUS_STYLE.pending}`}>{r.status}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] capitalize text-gray-600">
                      {r.placement}{r.placement === "homepage" && r.position ? ` · ${r.position}` : ""}
                    </span>
                  </div>

                  <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    <p className="text-gray-700"><b>{r.business_name}</b></p>
                    <p className="text-gray-500">Requested {fmtDate(r.created_at)}</p>
                    <p className="flex flex-wrap items-center gap-x-3 text-gray-600">
                      <span>{r.owner_name}</span>
                      {r.owner_phone && <a href={`tel:${r.owner_phone}`} className="inline-flex items-center gap-1 text-blue-600"><Phone size={11} />{r.owner_phone}</a>}
                      {r.owner_email && <a href={`mailto:${r.owner_email}`} className="inline-flex items-center gap-1 text-blue-600"><Mail size={11} />{r.owner_email}</a>}
                    </p>
                    <p className="text-gray-500">Banner period {fmtDate(r.prev_start)} – {fmtDate(r.prev_end)} · last price ₹{r.current_price}</p>
                  </div>

                  {r.note && <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">Owner note: {r.note}</p>}
                  {r.admin_reason && <p className="rounded-lg bg-red-50 px-3 py-2 text-blue-700">Reason: {r.admin_reason}</p>}
                  {(r.status === "approved" || r.status === "paid") && (
                    <p className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-800">
                      Approved: {fmtDate(r.approved_start)} – {fmtDate(r.approved_end)} · ₹{r.approved_price}
                      {r.status === "approved" ? " · waiting for payment" : ` · paid ${fmtDate(r.paid_at)}`}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => setApproveReq(r)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 sm:flex-none">
                        <Check size={14} /> Approve
                      </button>
                      <button onClick={() => setRejectReq(r)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 sm:flex-none">
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => setHistoryReq(r)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:flex-none">
                    <HistoryIcon size={14} /> History
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>Showing <b className="text-gray-700">{from}–{to}</b> of <b className="text-gray-700">{total}</b></span>
            <label className="flex items-center gap-1.5">Rows
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium outline-none">
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={15} /></button>
            <div className="hidden items-center gap-1 sm:flex">
              {getPages(page, totalPages).map((p, i) => p === "…" ? (
                <span key={`d${i}`} className="px-1 text-xs text-gray-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`h-8 min-w-[2rem] rounded-lg px-2 text-xs font-semibold ${p === page ? "bg-blue-500 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>{p}</button>
              ))}
            </div>
            <span className="px-3 text-xs font-medium text-gray-600 sm:hidden">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={15} /></button>
          </nav>
        </div>
      )}

      {approveReq && <ApproveModal req={approveReq} saving={saving} onSave={approve} onClose={() => !saving && setApproveReq(null)} />}
      {rejectReq && <RejectModal req={rejectReq} saving={saving} onSave={reject} onClose={() => !saving && setRejectReq(null)} />}
      {historyReq && <HistoryModal req={historyReq} onClose={() => setHistoryReq(null)} />}

      {zoomImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setZoomImg(null)} role="dialog" aria-modal="true">
          <button type="button" onClick={() => setZoomImg(null)} aria-label="Close image" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
            <X size={18} />
          </button>
          <img src={zoomImg.src} alt={zoomImg.title} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}