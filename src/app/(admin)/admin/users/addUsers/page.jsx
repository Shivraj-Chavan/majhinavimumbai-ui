"use client";

import { apiPost } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function AddUserForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("userCreated") === "true") {
      showToast("User Created Successfully!", "success");
      localStorage.removeItem("userCreated");
    }
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3200);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Must be exactly 10 digits, numbers only.";
    }
    if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apiPost("/users/users", formData);
      console.log("User created:", res);
      localStorage.setItem("userCreated", "true");
      showToast("User Created Successfully!", "success");
      setFormData({ name: "", phone: "", email: "" });
      setErrors({});
    } catch (error) {
      console.error("Error creating user:", error);
      showToast(error?.response?.data?.message || "Failed to create user.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .auf-wrap {
          font-family: 'DM Sans', sans-serif;
          max-width: 420px;
          margin: 7rem auto;
          background: linear-gradient(145deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf8 100%);
          border-radius: 20px;
          padding: 2px;
        }
        .auf-inner {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 19px;
          padding: 1.75rem 1.75rem 1.5rem;
        }
        .auf-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.4rem;
        }
        .auf-header-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .auf-header-icon svg {
          width: 20px;
          height: 20px;
          stroke: #fff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .auf-title {
          font-size: 17px;
          font-weight: 600;
          color: #1e1b4b;
          margin: 0;
          line-height: 1.2;
        }
        .auf-subtitle {
          font-size: 12px;
          color: #8b8fb0;
          margin: 2px 0 0;
        }
        .auf-field {
          margin-bottom: 1rem;
        }
        .auf-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 500;
          color: #5b5e8a;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .auf-badge {
          font-size: 10px;
          font-weight: 500;
          color: #a78bfa;
          background: #ede9fe;
          border-radius: 4px;
          padding: 1px 6px;
          letter-spacing: 0;
          text-transform: none;
        }
        .auf-req {
          color: #f472b6;
          font-size: 14px;
          line-height: 1;
        }
        .auf-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auf-input-icon {
          position: absolute;
          left: 11px;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .auf-input-icon svg {
          width: 16px;
          height: 16px;
          stroke: #a5b4fc;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .auf-input {
          width: 100%;
          height: 40px;
          padding: 0 12px 0 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #1e1b4b;
          background: #fafafe;
          border: 1.5px solid #e0e3f5;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .auf-input::placeholder {
          color: #b0b4d0;
          font-size: 13px;
        }
        .auf-input:focus {
          border-color: #a78bfa;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
        }
        .auf-input.auf-input--error {
          border-color: #f9a8d4;
          background: #fff5fb;
        }
        .auf-error {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: #db2777;
          margin-top: 4px;
          padding-left: 2px;
        }
        .auf-error svg {
          width: 13px;
          height: 13px;
          stroke: #db2777;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }
        .auf-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8eaf5 20%, #e8eaf5 80%, transparent);
          margin: 1.2rem 0;
        }
        .auf-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .auf-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #b0b4d0;
        }
        .auf-hint svg {
          width: 13px;
          height: 13px;
          stroke: #b0b4d0;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .auf-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          border: none;
          border-radius: 10px;
          padding: 0 20px;
          height: 40px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(129, 140, 248, 0.35);
        }
        .auf-btn:hover:not(:disabled) {
          opacity: 0.9;
          box-shadow: 0 4px 18px rgba(129, 140, 248, 0.45);
        }
        .auf-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
        .auf-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .auf-btn svg {
          width: 15px;
          height: 15px;
          stroke: #fff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .auf-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: auf-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes auf-spin {
          to { transform: rotate(360deg); }
        }
        .auf-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(80px);
          background: #1e1b4b;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
          z-index: 9999;
          white-space: nowrap;
          box-shadow: 0 6px 24px rgba(30, 27, 75, 0.2);
          pointer-events: none;
        }
        .auf-toast.auf-toast--show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        .auf-toast svg {
          width: 16px;
          height: 16px;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }
        .auf-toast--success svg { stroke: #6ee7b7; }
        .auf-toast--error svg { stroke: #fca5a5; }
      `}</style>

      {/* Toast */}
      <div className={`auf-toast auf-toast--${toast.type} ${toast.show ? "auf-toast--show" : ""}`}>
        {toast.type === "success" ? (
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        ) : (
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        )}
        {toast.message}
      </div>

      <div className="auf-wrap">
        <div className="auf-inner">

          {/* Header */}
          <div className="auf-header">
            <div className="auf-header-icon">
              <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div>
              <p className="auf-title">Add New User</p>
              <p className="auf-subtitle">Fill in the details below to register</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="auf-field">
              <label className="auf-label">
                Name <span className="auf-badge">optional</span>
              </label>
              <div className="auf-input-wrap">
                <span className="auf-input-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  className="auf-input"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="auf-field">
              <label className="auf-label">
                Phone <span className="auf-req">*</span>
              </label>
              <div className="auf-input-wrap">
                <span className="auf-input-icon">
                  <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </span>
                <input
                  className={`auf-input ${errors.phone ? "auf-input--error" : ""}`}
                  type="text"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {errors.phone && (
                <div className="auf-error">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="auf-field">
              <label className="auf-label">
                Email <span className="auf-badge">optional</span>
              </label>
              <div className="auf-input-wrap">
                <span className="auf-input-icon">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  className={`auf-input ${errors.email ? "auf-input--error" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && (
                <div className="auf-error">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="auf-divider" />

            <div className="auf-footer">
              <span className="auf-hint">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure & private
              </span>
              <button className="auf-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><div className="auf-spinner" /> Saving…</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Submit
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}