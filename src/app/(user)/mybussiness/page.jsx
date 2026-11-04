"use client";

import { useState, useEffect, useCallback } from "react";
import EditBusinessPopup from "@/app/(user)/components/profileComp/EditBusinessPopup";
import PopUp from "../components/home/popUp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcFinePrint } from "react-icons/fc";
import { apiGet, apiPut, apiPost } from "@/lib/apiClient";
import { GrEdit } from "react-icons/gr";
import { toast } from "react-toastify";
import Image from "next/image";
import PricingPlans from "../components/profileComp/PricingPlans";
import { ImCross } from "react-icons/im";
import { HiMiniStar } from "react-icons/hi2";
import { TbTargetArrow } from "react-icons/tb";
import CONFIG from "@/constance";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { FiCreditCard, FiRefreshCw, FiClock, FiCheckCircle, FiX, FiLoader, FiImage, FiSend } from "react-icons/fi";

/* ───────── Advertisement helpers (same logic as MazhiMumbai) ───────── */
const todayYmd = () => new Date().toLocaleDateString("en-CA");
const isAdExpired = (ad) => !!ad?.end_date && String(ad.end_date).slice(0, 10) < todayYmd();
const isAdPaid = (ad) =>
  String(ad?.payment_status || "").toLowerCase() === "paid" && !isAdExpired(ad);

/* unpaid | live | expired | renewal_pending | renewal_approved | renewal_rejected */
const adPhase = (ad) => {
  if (isAdPaid(ad)) return "live";
  if (String(ad?.payment_status || "").toLowerCase() !== "paid") return "unpaid";
  if (ad.renewal_status === "pending") return "renewal_pending";
  if (ad.renewal_status === "approved") return "renewal_approved";
  if (ad.renewal_status === "rejected") return "renewal_rejected";
  return "expired";
};

const PHASE_META = {
  unpaid: { label: "Payment pending", cls: "text-orange-600" },
  live: { label: "Live", cls: "text-emerald-600" },
  expired: { label: "Expired", cls: "text-red-600" },
  renewal_pending: { label: "Renewal requested · waiting for admin", cls: "text-amber-600" },
  renewal_approved: { label: "Renewal approved · pay to go live", cls: "text-emerald-600" },
  renewal_rejected: { label: "Renewal rejected", cls: "text-red-600" },
};

const REQ_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

// adjust if your Navi image base differs
const adImageUrl = (ad) => `${CONFIG.IMAGE_BASE_URL}/uploads/ads/${encodeURIComponent(ad.image_desktop)}`;
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

// { [businessId]: ads[] }
const toList = (res) =>
  Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : Array.isArray(res?.ads) ? res.ads : [];

// { [businessId]: ads[] }
const fetchAdsMap = async (list) => {
  const map = {};
  await Promise.all(
    (list || []).map(async (b) => {
      try {
        const res = await apiGet(`/AdPayment/business/${b.id}`);
        console.log("[ads] business", b.id, res);
        map[b.id] = toList(res);
      } catch (e) {
        console.error("[ads] load failed for business", b.id, e?.response?.status, e?.response?.data || e.message);
        map[b.id] = [];
      }
    })
  );
  return map;
};

/* ───────── Ad panel shown inside each business card ───────── */
function AdPanel({ ads, business, payingAdId, onPay, onPreview, onRenew, onHistory }) {
  if (!ads?.length) return <p className="text-[11px] text-gray-400">No banners yet</p>;
  return (
    <div className="w-full rounded-xl border border-gray-200 divide-y divide-gray-100 text-left">
      {ads.map((ad) => {
        const phase = adPhase(ad);
        const paying = payingAdId === ad.id;
        return (
          <div key={ad.id} className="flex flex-wrap items-center gap-2 p-2">
            <button
              type="button"
              onClick={() => onPreview(ad)}
              className="w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center"
            >
              {ad.image_desktop ? (
                <img src={adImageUrl(ad)} alt={ad.title || "Advertisement"} className="w-full h-full object-cover" />
              ) : (
                <FiImage className="text-gray-300" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${PHASE_META[phase].cls}`}>
                {PHASE_META[phase].label}
                {isAdExpired(ad) && (
                  <span className="rounded-full bg-red-50 border border-red-200 text-red-600 text-[9px] font-bold px-1.5 py-0.5">
                    Inactive
                  </span>
                )}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">{ad.title || "Untitled banner"}</p>
              <p className="text-[11px] text-gray-400 truncate">
                {phase === "renewal_approved"
                  ? `New: ${fmtDate(ad.renewal_start)} – ${fmtDate(ad.renewal_end)} · ₹${ad.renewal_price}`
                  : phase === "renewal_rejected"
                  ? `Rejected${ad.renewal_reason ? `: ${ad.renewal_reason}` : ""}`
                  : phase === "unpaid"
                  ? ad.category_name || ""
                  : `Start ${fmtDate(ad.start_date)} · End ${fmtDate(ad.end_date)}`}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
            <button
                type="button"
                onClick={() => onHistory(ad, business)}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                View
              </button>
              {phase === "live" && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1.5">
                  <FiCheckCircle /> Paid
                </span>
              )}
              {(phase === "expired" || phase === "renewal_rejected") && (
                <button
                  type="button"
                  onClick={() => onRenew(ad, business)}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5"
                >
                  <FiRefreshCw /> {phase === "expired" ? "Renew" : "Renew again"}
                </button>
              )}
              {phase === "renewal_pending" && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1.5">
                  <FiClock /> Pending
                </span>
              )}
              {(phase === "unpaid" || phase === "renewal_approved") && (
                <button
                  type="button"
                  disabled={paying}
                  onClick={() => onPay(business, ad)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5"
                >
                  {paying ? <FiLoader className="animate-spin" /> : <FiCreditCard />}
                  {paying ? "Processing…" : "Pay now"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── Image preview popup ───────── */
function AdPreviewModal({ ad, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
      >
        <FiX />
      </button>
      <div className="max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        <img src={adImageUrl(ad)} alt={ad.title || "Advertisement"} className="max-h-[80vh] max-w-full rounded-lg object-contain" />
        <p className="mt-2 text-center text-sm text-white">
          {ad.title} · {fmtDate(ad.start_date)} – {fmtDate(ad.end_date)}
        </p>
      </div>
    </div>
  );
}

/* ───────── Renewal request popup ───────── */
function RenewModal({ target, form, setForm, sending, onSend, onClose }) {
  const today = new Date().toLocaleDateString("en-CA");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const input = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !sending) onClose(); }} role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl">
        <h3 className="text-base font-bold text-gray-900">Request renewal</h3>
        <p className="mt-1 text-xs text-gray-500">"{target.ad.title}" ended on {fmtDate(target.ad.end_date)}. The admin will approve it and set the price.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-gray-600">Start date
            <input type="date" min={today} value={form.start} onChange={(e) => set("start", e.target.value)} className={input} />
          </label>
          <label className="text-xs font-semibold text-gray-600">End date
            <input type="date" min={form.start || today} value={form.end} onChange={(e) => set("end", e.target.value)} className={input} />
          </label>
        </div>
        <label className="mt-3 block text-xs font-semibold text-gray-600">Description
          <textarea rows={3} maxLength={500} value={form.note} onChange={(e) => set("note", e.target.value)}
            placeholder="Why you want to renew, any changes to the banner" className={input} />
        </label>
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} disabled={sending} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onSend} disabled={sending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
            {sending ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
            {sending ? "Sending…" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── History popup: every payment and renewal request ───────── */
function AdHistoryModal({ target, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet(`/AdPayment/${target.ad.id}/history`)
      .then((res) => { if (!cancelled) setData(res?.data || null); })
      .catch(() => { if (!cancelled) setData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [target.ad.id]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{target.ad.title || "Banner"} · History</h3>
            <p className="text-xs text-gray-400 mt-0.5">All payments and renewal requests for this banner</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0">
            <FiX />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5 text-xs">
          {loading ? (
            <div className="flex justify-center py-10"><FiLoader className="animate-spin text-orange-500" size={22} /></div>
          ) : !data ? (
            <p className="text-sm text-gray-500 text-center py-10">Could not load the history.</p>
          ) : (
            <>
              <section className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <img src={adImageUrl(target.ad)} alt="" className="h-14 w-20 rounded border object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{target.ad.title}</p>
                  <p className="text-gray-500 truncate">{target.business?.name}</p>
                  <p className="mt-0.5 text-gray-600">
                    Latest run: {fmtDate(target.ad.start_date)} – {fmtDate(target.ad.end_date)}
                    {isAdExpired(target.ad) && <span className="ml-1.5 font-bold text-red-600">Expired</span>}
                  </p>
                </div>
              </section>

              <section>
                <h4 className="font-bold uppercase tracking-wide text-gray-500 mb-2">Payments</h4>
                {data.payments.length === 0 ? (
                  data.ad?.payment_status === "paid" ? (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                      <b className="text-sm text-gray-900">₹{data.ad.price}</b>{" "}
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Paid</span>{" "}
                      <span className="rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">Initial</span>
                      <p className="mt-1 text-gray-600">Period: {fmtDate(data.ad.start_date)} – {fmtDate(data.ad.end_date)}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No payments yet.</p>
                  )
                ) : (
                  data.payments.map((p) => (
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
                      <p className="mt-0.5 text-gray-400 break-all">Payment ID {p.razorpay_payment_id || "-"}</p>
                    </div>
                  ))
                )}
              </section>

              <section>
                <h4 className="font-bold uppercase tracking-wide text-gray-500 mb-2">Renewal requests</h4>
                {data.requests.length === 0 ? (
                  <p className="text-gray-400">No renewal requests.</p>
                ) : (
                  data.requests.map((r) => (
                    <div key={r.id} className="mb-2 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${REQ_STYLE[r.status] || REQ_STYLE.pending}`}>{r.status}</span>
                        <span className="text-gray-400">Requested {fmtDate(r.created_at)}</span>
                      </div>
                      {r.note && <p className="mt-1.5 text-gray-600">Your note: {r.note}</p>}
                      {r.admin_reason && <p className="mt-1 text-gray-600">Admin: {r.admin_reason}</p>}
                      {(r.status === "approved" || r.status === "paid") && (
                        <p className="mt-1 font-medium text-gray-700">
                          {fmtDate(r.approved_start)} – {fmtDate(r.approved_end)} · ₹{r.approved_price}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


/* ───────── Advertisement request ───────── */
const EMPTY_AD_REQ = { start: "", end: "", message: "", desktop: null, mobile: null };

// { [businessId]: latest request }
const fetchMyAdRequests = async () => {
  try {
    const res = await apiGet("/AdRequest/mine");
    const map = {};
    toList(res).forEach((r) => { if (!map[r.business_id]) map[r.business_id] = r; }); // newest first
    return map;
  } catch (e) {
    console.error("Failed to load ad requests", e);
    return {};
  }
};

function AdRequestBox({ business, adRequest, onRequest }) {
  return (
    <div className="w-full flex flex-col gap-2 rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-left">
      <div className="text-xs">
        {!adRequest && <p className="text-gray-600">Want a banner for this business? Send an advertisement request.</p>}
        {adRequest?.status === "pending" && (
          <p className="font-semibold text-amber-700">
            Request sent · {fmtDate(adRequest.start_date)} – {fmtDate(adRequest.end_date)} · waiting for admin
          </p>
        )}
        {adRequest?.status === "approved" && (
          <>
            <p className="font-semibold text-emerald-700">Request approved</p>
            {adRequest.admin_reason && <p className="mt-0.5 text-gray-600">Admin: {adRequest.admin_reason}</p>}
            <p className="mt-0.5 text-gray-500">Your banner will appear above with a Pay now button once it is set up.</p>
          </>
        )}
        {adRequest?.status === "rejected" && (
          <>
            <p className="font-semibold text-red-600">Request rejected</p>
            {adRequest.admin_reason && <p className="mt-0.5 text-gray-600">Reason: {adRequest.admin_reason}</p>}
          </>
        )}
      </div>
      {adRequest?.status !== "pending" && (
        <button
          type="button"
          onClick={() => onRequest(business)}
          className="self-start inline-flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2"
        >
          <FiSend /> {adRequest ? "Request again" : "Advertise"}
        </button>
      )}
    </div>
  );
}

function AdRequestModal({ target, form, setForm, sending, onSend, onClose }) {
  const today = new Date().toLocaleDateString("en-CA");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const input = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400";
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !sending) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <h3 className="text-base font-bold text-gray-900">Advertise {target.name}</h3>
        <p className="mt-1 text-xs text-gray-500">Tell us when you want your banner to run. The admin will review it and set up the advertisement.</p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-gray-600">Start date
            <input type="date" min={today} value={form.start} onChange={(e) => set("start", e.target.value)} className={input} />
          </label>
          <label className="text-xs font-semibold text-gray-600">End date
            <input type="date" min={form.start || today} value={form.end} onChange={(e) => set("end", e.target.value)} className={input} />
          </label>
        </div>

        <label className="mt-3 block text-xs font-semibold text-gray-600">Message (optional)
          <textarea rows={3} maxLength={500} value={form.message} onChange={(e) => set("message", e.target.value)}
            placeholder="Where you want it to show, offer details, etc." className={input} />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-gray-600">Desktop image (optional)
            <input type="file" accept="image/*" onChange={(e) => set("desktop", e.target.files?.[0] || null)} className="mt-1 block w-full text-[11px]" />
          </label>
          <label className="text-xs font-semibold text-gray-600">Mobile image (optional)
            <input type="file" accept="image/*" onChange={(e) => set("mobile", e.target.files?.[0] || null)} className="mt-1 block w-full text-[11px]" />
          </label>
        </div>
        <p className="mt-1.5 text-[11px] text-gray-400">Images are only for reference. The admin can also prepare the banner for you.</p>

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} disabled={sending} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onSend} disabled={sending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
            {sending ? <FiLoader className="animate-spin" /> : <FiSend />}
            {sending ? "Sending…" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyBusinessPage() {
  const [businesses, setBusinesses] = useState([]); 
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [token, setToken] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [userBusiness, setUserBusiness] = useState(null);
  const [plans, setPlans] = useState([]);
  const [businessList, setBusinessList] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [businessAds, setBusinessAds] = useState({});
  const [adRequests, setAdRequests] = useState({});
  const [adReqTarget, setAdReqTarget] = useState(null);
  const [adReqForm, setAdReqForm] = useState(EMPTY_AD_REQ);
  const [adReqSending, setAdReqSending] = useState(false);
  const [payingAdId, setPayingAdId] = useState(null);
  const [previewAd, setPreviewAd] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null); // { ad, business }
  const [renewForm, setRenewForm] = useState({ note: "", start: "", end: "" });
  const [renewing, setRenewing] = useState(false);
  const [historyTarget, setHistoryTarget] = useState(null); // { ad }
  const router = useRouter();
  
  // This comes after all your useState declarations
const fetchBusiness = useCallback(async () => {
  try {
    const res = await apiGet(`/businesses/user`);
    console.log("businesses:", res);
    setBusinessList(res || []);

    if (res.businesses) {
      setBusinesses(res.businesses);
      fetchAdsMap(res.businesses).then(setBusinessAds); // ads load without blocking the page
      fetchMyAdRequests().then(setAdRequests);
      //next_phase
      await fetchSelectedPlans(res.businesses);
    } else {
      console.warn("Unexpected response format:", res);
      setBusinesses([]);
    }
  } catch (err) {
    console.error("Failed to load businesses:", err);
  } finally {
    setLoading(false);
  }
}, []);


// For selected plan   next_phase 
const fetchSelectedPlans = useCallback(async (businessList) => {
  if (!Array.isArray(businessList)) {
    console.error("businessList is undefined or not an array:", businessList);
    return;
  } 

  const planMap = {};

  await Promise.all(
    businessList.map(async (biz) => {
      try {
        const res = await apiGet(`/plan/selectedplan/${biz.id}`);
        console.log('selectedplan', res);

        if (res && res.name) {
          planMap[biz.id] = res; // store by business id
        }
      } catch (err) {
        console.warn(`No plan found for business ${biz.id}`, err);
      }
    })
  );

  setSelectedPlans(planMap);  
}, []); 


//next_phase
useEffect(() => {
  if (businessList && Array.isArray(businessList)) {
    fetchSelectedPlans(businessList);
  } else {
    console.warn("businessList not ready yet:", businessList);
  }
}, [businessList]);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);

  if (!storedToken) {
    router.push("/");
    return;
  }

  setIsAuthenticated(true);
  fetchBusiness();
  fetchSelectedPlans();
}, [fetchBusiness]);


useEffect(() => {
  if (!businesses.length) return;
  const reload = () => {
    if (document.visibilityState === "visible") {
      fetchAdsMap(businesses).then(setBusinessAds);
      fetchMyAdRequests().then(setAdRequests);
    }
  };
  document.addEventListener("visibilitychange", reload);
  return () => document.removeEventListener("visibilitychange", reload);
}, [businesses]);

if (!isAuthenticated) {
  console.log("Rendering popup...");
    return <>{showPopup && <PopUp onClose={() => setShowPopup(false)} />}</>;
  }

  const handleLoginSuccess = () => {
    const newToken = localStorage.getItem("token");
    if (newToken) {
      setToken(newToken);
    }
  };

  const handleSubmit = async (updatedBusinessData) => {
    try {
      const res = await apiPut(`/businesses/${businessToEdit.id}`, updatedBusinessData);
      console.log("Updating Business", res);

      if (res.business) {
        handleUpdate(res.business); 
      } else {
        alert("Update succeeded, but response format is unexpected.");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update business info.");
    }
  };

  const handleUpdate = (updatedData) => {
    setBusinesses((prev) =>
      prev.map((b) => b.id === updatedData.id ? { ...b, ...updatedData, is_verified: b.is_verified }: b));
    setShowEditPopup(false);
    setBusinessToEdit(null);
  };
  
  const refreshAds = async (businessId) => {
    try {
      const res = await apiGet(`/AdPayment/business/${businessId}`);
      setBusinessAds((prev) => ({ ...prev, [businessId]: toList(res) }));
    } catch (e) {
      console.error("Failed to refresh ads", e);
    }
  };

  const submitAdRequest = async () => {
    if (!adReqTarget) return;
    const { start, end, message, desktop, mobile } = adReqForm;
    if (!start || !end) return toast.error("Choose the start and end dates");
    if (end < start) return toast.error("End date cannot be before the start date");
    try {
      setAdReqSending(true);
      const fd = new FormData();
      fd.append("start_date", start);
      fd.append("end_date", end);
      fd.append("message", message);
      if (desktop) fd.append("image_desktop", desktop);
      if (mobile) fd.append("image_mobile", mobile);
      const res = await apiPost(`/AdRequest/business/${adReqTarget.id}`, fd);
      toast.success(res?.message || "Request sent to the admin");
      setAdReqTarget(null);
      setAdReqForm(EMPTY_AD_REQ);
      fetchMyAdRequests().then(setAdRequests);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.data?.message || err?.message || "Could not send the request");
    } finally {
      setAdReqSending(false);
    }
  };

  const submitRenewal = async () => {
    if (!renewTarget) return;
    const { note, start, end } = renewForm;
    if (!note.trim()) return toast.error("Please add a description");
    if (!start || !end) return toast.error("Choose the start and end dates");
    if (end < start) return toast.error("End date cannot be before the start date");
    try {
      setRenewing(true);
      const res = await apiPost(`/AdPayment/${renewTarget.ad.id}/renewal-request`, { note, start_date: start, end_date: end });
      toast.success(res?.message || "Renewal request sent to the admin");
      await refreshAds(renewTarget.business.id);
      setRenewTarget(null);
      setRenewForm({ note: "", start: "", end: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.data?.message || err?.message || "Could not send the request");
    } finally {
      setRenewing(false);
    }
  };

  const handlePayAd = async (business, ad) => {
    if (payingAdId) return;
    setPayingAdId(ad.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Unable to load Razorpay. Check your connection and try again.");

      const orderRes = await apiPost(`/AdPayment/${ad.id}/createOrder`, {
        advertisement_id: ad.id,
        business_id: business.id,
      });
      const order = orderRes?.order || orderRes?.data || orderRes;
      if (!order?.id) throw new Error("Could not start payment. Please try again.");

      const rzp = new window.Razorpay({
        key: order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: business.name,
        description: `Advertisement: ${ad.title || "Banner"}`,
        order_id: order.id,
        prefill: { name: business.owner_name, email: business.email, contact: business.phone },
        theme: { color: "#f97316" },
        modal: { ondismiss: () => setPayingAdId(null) },
        handler: async (response) => {
          try {
            await apiPost(`/AdPayment/${ad.id}/verifyPayment`, {
              advertisement_id: ad.id,
              business_id: business.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful. Your banner is now live.");
            await refreshAds(business.id);
          } catch (err) {
            console.error(err);
            toast.error(`Payment received but could not be verified. Payment ID: ${response.razorpay_payment_id}`);
          } finally {
            setPayingAdId(null);
          }
        },
      });
      rzp.on("payment.failed", (resp) => {
        toast.error(resp?.error?.description || "Payment failed. Please try again.");
        setPayingAdId(null);
      });
      rzp.open();
    } catch (err) {
      console.error("[AdPay] failed:", err);
      toast.error(
        err?.response?.data?.detail || err?.response?.data?.message || err?.data?.message || err?.message || "Payment could not be started."
      );
      setPayingAdId(null);
    }
  };

  if (!token) return <PopUp onClose={handleLoginSuccess} />;

  // Skeleton
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-lg p-6 space-y-6 animate-pulse flex flex-col justify-between">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full shadow-md" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-40 mx-auto" />
            <div className="h-3 bg-gray-100 rounded w-52 mx-auto" />
          </div>
          <div className="h-6 w-24 bg-gray-100 rounded-full mx-auto" />
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-center gap-3">
          <div className="h-9 w-24 bg-gray-200 rounded-lg" />
          <div className="h-9 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    ));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        My Business Profiles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          renderSkeletons()
        ) : businesses.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
           You have not added any Business Yet !!
          </p>
        ) : (
          businesses.map((business) => {
            // next_phase
            const planDetails = selectedPlans[business.id]; 
            console.log("Plan Details for", business.id, planDetails);
            console.log({business})
            return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-6 flex flex-col justify-between"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden shadow-md">
                  <Image
                   src={business?.images?.length>0 ? `${CONFIG.IMAGE_BASE_URL}${business?.images[0].url}`   :"/image.png"}
                    alt="Business Logo"
                    width={128} 
                    height={128}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {business.name}
                  </h2>
                  {/* <div className="text-gray-600 text-sm mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: business.description || "<p>No description provided.</p>",}}/> */}
                </div>

                <div>
                    {(() => {
                      console.log("Businesses:", business);
                      console.log("Verification Status:", business.is_verified);

                      return business.is_verified? (
                        <span className="text-green-600 font-semibold text-sm bg-green-100 px-4 py-1.5 rounded-full border border-green-300">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold text-sm bg-red-100 px-4 py-1.5 rounded-full border border-red-300">
                          Unverified
                        </span>
                      );
                    })()}
                  </div>

                   {/*SHOW SELECTED PLAN */}
                   {/* next_phase */}
                    {planDetails ? (
                      <div>
                        <p className="text-md text-green-600 font-semibold">
                          {planDetails.name}
                        </p>
                        <div className="text-sm text-gray-500 mt-1">
                        <p className="flex gap-1">
                        Active from {new Date(planDetails.start_date).toLocaleDateString('en-GB')} to {new Date(planDetails.end_date).toLocaleDateString('en-GB')}
                      </p>
                       </div>
                      </div>
                    ) : (
                      <p className="flex items-center text-sm gap-2 text-slate-400">
                     Please choose plan for this Business
                     </p>
                    )}
                 </div>

                 <AdRequestBox
                business={business}
                adRequest={adRequests[business.id]}
                onRequest={(biz) => { setAdReqForm(EMPTY_AD_REQ); setAdReqTarget(biz); }}
              />

              <hr className="border-gray-200" />    
                 <AdPanel
                ads={businessAds[business.id] || []}
                business={business}
                payingAdId={payingAdId}
                onPay={handlePayAd}
                onPreview={setPreviewAd}
                onRenew={(ad, biz) => setRenewTarget({ ad, business: biz })}
                onHistory={(ad, biz) => setHistoryTarget({ ad, business: biz })}
              />

              <hr className="border-gray-200" />
              <div className="flex justify-center gap-3">
                <Link href={`/listinginfo/${business.slug}`}>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm shadow flex items-center">
                    <FcFinePrint className="text-xl mr-1" />
                    View Details
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setBusinessToEdit(business);
                    setShowEditPopup(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center px-2 py-2 rounded-lg text-sm shadow"
                >
                  <GrEdit className="text-md mr-1" /> Edit
                </button>

                 {/*Choose Plan button if no completed plan next_phase*/}
               
                {planDetails ? (
                  planDetails.name.toLowerCase() === "free" ? (
                    <button
                      onClick={() => {
                        setUserBusiness(business);
                        setShowPricingPopup(true);
                      }}
                      className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                    >
                      Upgrade Plan
                    </button>
                  ) : (
                    // <button
                    //   className="bg-gray-400 cursor-not-allowed px-4 py-2 rounded-lg text-sm shadow text-white"
                    //   disabled
                    // >
                    //   Choose Plan
                    // </button>
                    <></>
                  )
                ) : (
                  <button
                    onClick={() => {
                      setUserBusiness(business);
                      setShowPricingPopup(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                  >
                    Choose Plan
                  </button>
                )}

      {/* after choose plan switch to Upgrade */}
        {/* {planDetails ? (
          <button 
            onClick={() => {
              setUserBusiness(business);
              setShowPricingPopup(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            Upgrade Plan
          </button>
        ) : (
          <button
            onClick={() => {
              setUserBusiness(business);
              setShowPricingPopup(true);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            Choose Plan
          </button>
        )} */}
              </div>
            </div>
            )
      })
        )}
      </div>

      {/* Edit Popup */}
      {showEditPopup && businessToEdit && (
        <EditBusinessPopup business={businessToEdit} 
        plan={selectedPlans[businessToEdit?.id]}
          onClose={() => { setShowEditPopup(false); setBusinessToEdit(null);}} onSave={handleSubmit}/>
      )}

{previewAd && <AdPreviewModal ad={previewAd} onClose={() => setPreviewAd(null)} />}

{adReqTarget && (
  <AdRequestModal
    target={adReqTarget}
    form={adReqForm}
    setForm={setAdReqForm}
    sending={adReqSending}
    onSend={submitAdRequest}
    onClose={() => { setAdReqTarget(null); setAdReqForm(EMPTY_AD_REQ); }}
  />
)}

{renewTarget && (
  <RenewModal
    target={renewTarget}
    form={renewForm}
    setForm={setRenewForm}
    sending={renewing}
    onSend={submitRenewal}
    onClose={() => { setRenewTarget(null); setRenewForm({ note: "", start: "", end: "" }); }}
  />
)}

{historyTarget && <AdHistoryModal target={historyTarget} onClose={() => setHistoryTarget(null)} />}

{/* Payment popup next_phase */}
      {showPricingPopup && (
        <PricingPlans show={showPricingPopup} onClose={() => setShowPricingPopup(false)} business={userBusiness} onPlanActivated={fetchBusiness} setSelectedPlans={setSelectedPlans}/>
      )}
    </div>
  );
}

