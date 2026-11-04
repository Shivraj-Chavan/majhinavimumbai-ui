"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Search, Check, X, Loader2, ChevronLeft, ChevronRight, Phone, Mail, Plus } from "lucide-react";
import { apiGet, apiPut } from "@/lib/apiClient";
import CONFIG from "@/constance";
import AdForm from "../../components/AdForm"; // adjust the path to where you saved it

const ADS_PAGE = "/admin/advertisements"; // adjust: your Navi admin Advertisements route
const refImg = (n) => `${CONFIG.IMAGE_BASE_URL}/images/${n}`; // adjust to where multer saves the files

const errMsg = (e, f) => e?.response?.data?.detail || e?.response?.data?.message || e?.data?.message || e?.message || f;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-");

const TABS = [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["", "All"]];
const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};
const field = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

function NoteModal({ title, sub, label, required, confirmText, confirmCls, saving, onSave, onClose }) {
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
        <textarea rows={3} maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder={label} className={`${field} mt-3`} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { if (required && !text.trim()) return toast.error("Please write a reason"); onSave(text); }}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${confirmCls}`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />} {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdRequests() {
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [approveReq, setApproveReq] = useState(null);
  const [rejectReq, setRejectReq] = useState(null);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [createReq, setCreateReq] = useState(null); // prefill for the Add advertisement form
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const list = (r) => (Array.isArray(r) ? r : r?.data || r?.businesses || r?.categories || r?.results || r?.rows || []);
    apiGet("/businesses?limit=1000").then((r) => setBusinesses(list(r))).catch(() => {});
    apiGet("/categories").then((r) => setCategories(list(r))).catch(() => {});
  }, []);

  const openCreate = (r) => {
    const biz = businesses.find((b) => String(b.id) === String(r.business_id));
    const days = Math.max(1, Math.round((new Date(r.end_date) - new Date(r.start_date)) / 86400000));
    setCreateReq({
      business_id: r.business_id,
      duration_days: days,
      description: r.message || "",
      redirect_url: biz?.slug ? `/listinginfo/${biz.slug}` : "",
    });
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (tab) qs.set("status", tab);
      if (search.trim()) qs.set("search", search.trim());
      const res = await apiGet(`/AdRequest/admin?${qs.toString()}`);
      setRows(res?.data || []);
      setTotal(res?.total ?? 0);
      setTotalPages(res?.totalPages || 1);
      if (res?.counts) setCounts(res.counts);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load requests"));
    } finally {
      setLoading(false);
    }
  }, [tab, search, page]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  useEffect(() => { setPage(1); }, [tab, search]);

  const approve = async (message) => {
    setSaving(true);
    try {
      await apiPut(`/AdRequest/admin/${approveReq.id}/approve`, { message });
      toast.success("Request approved");
      const req = approveReq;
      setApproveReq(null);
      load();
      openCreate(req);
    } catch (e) {
      toast.error(errMsg(e, "Could not approve"));
    } finally {
      setSaving(false);
    }
  };

  const reject = async (reason) => {
    setSaving(true);
    try {
      await apiPut(`/AdRequest/admin/${rejectReq.id}/reject`, { reason });
      toast.success("Request rejected");
      setRejectReq(null);
      load();
    } catch (e) {
      toast.error(errMsg(e, "Could not reject"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-10 pt-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advertisement Requests</h1>
        <p className="text-gray-500">Owners ask for a banner here. Approve to open the Add advertisement form, or reject with a reason.</p>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map(([key, name]) => (
            <button key={name} onClick={() => setTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {name}
              {key && (
                <span className={`rounded-full px-1.5 text-[11px] ${tab === key ? "bg-white/25" : key === "pending" && counts.pending ? "bg-red-500 text-white" : "bg-white text-gray-500"}`}>
                  {counts[key] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative max-w-md">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${field} pl-9`} placeholder="Search business, owner, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center">
          <p className="font-semibold text-gray-700">No requests here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="min-w-0 flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{r.business_name}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </div>
                  <p className="flex flex-wrap items-center gap-x-3 text-gray-600">
                    <span>{r.owner_name}</span>
                    {r.owner_phone && <a href={`tel:${r.owner_phone}`} className="inline-flex items-center gap-1 text-blue-600"><Phone size={11} />{r.owner_phone}</a>}
                    {r.owner_email && <a href={`mailto:${r.owner_email}`} className="inline-flex items-center gap-1 text-blue-600"><Mail size={11} />{r.owner_email}</a>}
                  </p>
                  <p className="text-gray-700">Wants: <b>{fmtDate(r.start_date)} – {fmtDate(r.end_date)}</b> · requested {fmtDate(r.created_at)}</p>
                  {r.message && <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">Owner: {r.message}</p>}
                  {r.admin_reason && (
                    <p className={`rounded-lg px-3 py-2 ${r.status === "rejected" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>Admin: {r.admin_reason}</p>
                  )}
                  {(r.image_desktop || r.image_mobile) && (
                    <div className="flex gap-2">
                      {[r.image_desktop, r.image_mobile].filter(Boolean).map((img) => (
                        <button key={img} type="button" onClick={() => setZoom(refImg(img))} className="cursor-zoom-in">
                          <img src={refImg(img)} alt="Reference" className="h-14 w-24 rounded border border-gray-100 bg-gray-100 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => setApproveReq(r)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 sm:flex-none"><Check size={14} /> Approve</button>
                      <button onClick={() => setRejectReq(r)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 sm:flex-none"><X size={14} /> Reject</button>
                    </>
                  )}
                  {r.status === "approved" && (
                  <button onClick={() => openCreate(r)} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600">
                      <Plus size={14} /> Create advertisement
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && total > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-500">
          <span>{(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 p-1.5 disabled:opacity-40"><ChevronLeft size={15} /></button>
            <span className="px-2 font-medium">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-300 p-1.5 disabled:opacity-40"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}

      {approveReq && (
        <NoteModal title="Approve request" sub={`${approveReq.business_name}. You will go to the Add advertisement form next.`}
          label="Message for the owner (optional)" confirmText="Approve" confirmCls="bg-emerald-600 hover:bg-emerald-700"
          saving={saving} onSave={approve} onClose={() => !saving && setApproveReq(null)} />
      )}
      {rejectReq && (
        <NoteModal title="Reject request" sub={`${rejectReq.business_name}. The owner will see this reason.`}
          label="Reason for rejecting" required confirmText="Reject" confirmCls="bg-red-600 hover:bg-red-700"
          saving={saving} onSave={reject} onClose={() => !saving && setRejectReq(null)} />
      )}

{createReq && (
        <AdForm
          prefill={createReq}
          businesses={businesses}
          categories={categories}
          onClose={() => setCreateReq(null)}
          onSaved={() => setCreateReq(null)}
        />
      )}

      {zoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setZoom(null)}>
          <img src={zoom} alt="Reference" onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}