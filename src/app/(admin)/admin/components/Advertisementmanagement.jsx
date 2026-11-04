"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { apiDelete, apiGet, apiPut, apiPostWithImage, apiPutWithImage } from "@/lib/apiClient";
import { fetchCategories } from "@/redux/slice/categoriesSlice";
import { AD_ENDPOINT } from "@/lib/adConfig";
import { AD_IMAGE_RULES, validateAdImage } from "@/lib/adImageRules";
import AdvertisementTable from "./Advertisementtable";
import AdvertisementForm from "./Advertisementform";

/* 1 … 4 5 6 … 20 style list of page numbers */
const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
};

const errMsg = (e, fallback) =>
  e?.response?.data?.detail ||
  e?.response?.data?.message ||
  e?.response?.data?.msg ||
  e?.data?.msg ||
  e?.data?.message ||
  e?.message ||
  fallback;
const field = "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

export default function AdvertisementManagement() {
  const dispatch = useDispatch();
  const { list: categories = [] } = useSelector((s) => s.categories);

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", placement: "", category_id: "", status: "", date: "", date_type: "created" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState({ open: false, ad: null });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
        page: String(page),
        limit: String(limit),
      }).toString();
      const res = await apiGet(`${AD_ENDPOINT.base}?${qs}`);
      setAds(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      setTotal(res?.total ?? 0);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load advertisements"));
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search typing
    return () => clearTimeout(t);
  }, [load]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.placement, filters.category_id, filters.status, filters.date, limit, filters.date_type]);

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const handleSave = async (formData) => {
    // Safety net: re-check new image uploads (skipped when editing without a new file)
    const placement = formData.get("placement") || modal.ad?.placement;
    const checks = [
      ["image_desktop", "desktop", "Desktop image"],
      ["image_mobile", "mobile", "Mobile image"],
    ];
    for (const [fieldName, kind, label] of checks) {
      const file = formData.get(fieldName);
      if (file instanceof File && file.size > 0) {
        const problem = await validateAdImage(file, AD_IMAGE_RULES[placement]?.[kind], label);
        if (problem) { toast.error(problem); return; }
      }
    }

    setSaving(true);
    try {
      if (modal.ad) await apiPutWithImage(AD_ENDPOINT.byId(modal.ad.id), formData);
      else await apiPostWithImage(AD_ENDPOINT.base, formData);
      toast.success(modal.ad ? "Advertisement updated" : "Advertisement created");
      setModal({ open: false, ad: null });
      load();
    } catch (e) {
      toast.error(errMsg(e, "Failed to save advertisement"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (ad) => {
    try {
      const res = await apiPut(AD_ENDPOINT.status(ad.id), {});
      setAds((list) => list.map((a) => (a.id === ad.id ? { ...a, is_active: res?.data?.is_active } : a)));
      toast.success(res?.message || "Status updated");
    } catch (e) {
      toast.error(errMsg(e, "Failed to update status"));
    }
  };

  const handlePaymentStatus = async (ad, payment_status) => {
    if (!window.confirm(`Change payment status of "${ad.title}" to ${payment_status}?`)) return;
    try {
      const res = await apiPut(`/AdPayment/${ad.id}/paymentStatus`, { payment_status });
      setAds((list) => list.map((a) => (a.id === ad.id ? { ...a, ...(res?.data || {}) } : a)));
      toast.success(res?.message || "Payment status updated");
    } catch (e) {
      toast.error(errMsg(e, "Failed to update payment status"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(AD_ENDPOINT.byId(deleteTarget.id));
      toast.success("Advertisement deleted");
      setDeleteTarget(null);
      if (ads.length === 1 && page > 1) setPage((p) => p - 1); // last row of the page: go back one page
      else load();
    } catch (e) {
      toast.error(errMsg(e, "Failed to delete advertisement"));
    } finally {
      setDeleting(false);
    }
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className=" max-w-6xl space-y-4 px-1 pb-10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-md text-gray-500">Manage homepage and category banners.</p>
        </div>
        <button onClick={() => setModal({ open: true, ad: null })} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={16} /> Add Advertisement
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-2 rounded-xl border border-gray-200 bg-white p-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${field} w-full pl-9`} placeholder="Search advertisements..." value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
        </div>
        <select className={field} value={filters.placement} onChange={(e) => setFilter("placement", e.target.value)}>
          <option value="">All placements</option>
          <option value="homepage">Homepage</option>
          <option value="category">Category</option>
        </select>
        <select className={field} value={filters.category_id} onChange={(e) => setFilter("category_id", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={field} value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">Active + Inactive</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* <div className="flex gap-1.5">
          <select className={field} value={filters.date_type} onChange={(e) => setFilter("date_type", e.target.value)} title="What the date means">
            <option value="created">Created on</option>
            <option value="start">Starts on</option>
            <option value="running">Running on</option>
          </select>
          <input type="date" className={`${field} min-w-0 flex-1`} value={filters.date} onChange={(e) => setFilter("date", e.target.value)} />
          {filters.date && (
            <button type="button" onClick={() => setFilter("date", "")} className="rounded-lg border border-gray-300 px-2 text-sm text-gray-500 hover:bg-gray-50" aria-label="Clear date">✕</button>
          )}
        </div> */}

      </div>

      <AdvertisementTable
        ads={ads}
        loading={loading}
        onEdit={(ad) => setModal({ open: true, ad })}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        onPaymentStatus={handlePaymentStatus}
      />

{!loading && total > 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              Showing <b className="text-gray-700">{from}–{to}</b> of <b className="text-gray-700">{total}</b>
            </span>
            <label className="flex items-center gap-1.5">
              Rows
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-400"
              >
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>

          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {getPages(page, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`h-8 min-w-[2rem] rounded-lg px-2 text-xs font-semibold ${
                      p === page ? "bg-orange-500 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <span className="px-3 text-xs font-medium text-gray-600 sm:hidden">{page} / {totalPages}</span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="my-6 w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-900">{modal.ad ? "Edit Advertisement" : "Add Advertisement"}</h2>
            <AdvertisementForm
              initial={modal.ad}
              categories={categories}
              saving={saving}
              onSubmit={handleSave}
              onCancel={() => !saving && setModal({ open: false, ad: null })}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Are you sure you want to delete this advertisement?</h3>
            <p className="mt-1 text-sm text-gray-500">"{deleteTarget.title}" and its images will be removed. This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}