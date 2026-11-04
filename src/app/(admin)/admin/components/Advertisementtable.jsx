"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { adImageUrl } from "@/lib/adConfig";

// Local YYYY-MM-DD. Works for plain dates and for ISO timestamps from the API.
const ymd = (d) => (d ? new Date(d).toLocaleDateString("en-CA") : null);
const today = () => new Date().toLocaleDateString("en-CA");

function statusOf(ad) {
  if (!ad.is_active) return { label: "Inactive", cls: "bg-gray-100 text-gray-600" };
  const t = today();
  const start = ymd(ad.start_date);
  const end = ymd(ad.end_date);
  if (start && start > t) return { label: "Scheduled", cls: "bg-blue-100 text-blue-700" };
  if (end && end < t) return { label: "Expired", cls: "bg-red-100 text-red-700" };
  return { label: "Live", cls: "bg-green-100 text-green-700" };
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");

const PAY_STYLE = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-red-200 bg-red-50 text-red-700",
};

const HEADERS = ["Preview", "Title", "Placement", "Category", "Business", "Status", "Payment", "Order", "Start", "End", "Created", "Actions"];

export default function AdvertisementTable({ ads, loading, onEdit, onDelete, onToggle, onPaymentStatus }) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center">
        <p className="font-semibold text-gray-700">No advertisements found</p>
        <p className="mt-1 text-sm text-gray-400">Add a banner or change the filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-[1000px] w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            {HEADERS.map((h) => (
              <th key={h} className="px-2 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ads.map((ad) => {
            const st = statusOf(ad);
            const pay = ad.payment_status || "pending";
            return (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="px-2 py-2">
                  <img src={adImageUrl(ad.image_desktop)} alt={ad.title} className="h-12 w-28 rounded-md object-cover" />
                </td>
                <td className="max-w-[180px] px-3 py-2 font-medium text-gray-800">
                  <p className="truncate">{ad.title}</p>
                </td>
                <td className="px-3 py-2 capitalize">{ad.placement}</td>
                <td className="px-3 py-2">{ad.category_name || "—"}</td>
                <td className="px-3 py-2 max-w-[140px]">
                  {ad.business_name ? (
                    <div>
                      <p className="truncate font-medium text-gray-800">{ad.business_name}</p>
                      <p className="truncate text-[11px] text-gray-400">{ad.business_phone || ad.business_email || ""}</p>
                    </div>
                  ) : "—"}
                </td>

                {/* Status (live toggle) */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      role="switch"
                      aria-checked={!!ad.is_active}
                      aria-label="Toggle advertisement status"
                      onClick={() => onToggle(ad)}
                      className={`relative h-5 w-9 rounded-full transition ${ad.is_active ? "bg-blue-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${ad.is_active ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
                  </div>
                </td>

                {/* Payment (admin can change) */}
                <td className="px-3 py-2">
                  {onPaymentStatus ? (
                    <select
                      value={pay}
                      onChange={(e) => onPaymentStatus(ad, e.target.value)}
                      className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize outline-none ${PAY_STYLE[pay] || PAY_STYLE.pending}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  ) : (
                    <span className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${PAY_STYLE[pay] || PAY_STYLE.pending}`}>{pay}</span>
                  )}
                </td>

                <td className="px-2 py-2">{ad.display_order}</td>
                <td className="px-2 py-2 whitespace-nowrap">{fmt(ad.start_date)}</td>
                <td className="px-2 py-2 whitespace-nowrap">{fmt(ad.end_date)}</td>
                <td className="px-2 py-2 whitespace-nowrap">{fmt(ad.created_at)}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-0">
                    <button onClick={() => onEdit(ad)} className="rounded-lg p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600" aria-label="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(ad)} className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}