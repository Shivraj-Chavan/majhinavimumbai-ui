"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { apiGet } from "@/lib/apiClient";
import axios from "axios";
import axiosInstance from "@/lib/axios";

export default function DownloadReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/businesses/export?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: "arraybuffer", 
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `businesses_${startDate}_to_${endDate}.xlsx`;
      link.click();

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition 
          ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            Downloading...
          </>
        ) : (
          <>
            <Download size={18} />
            Download Excel
          </>
        )}
      </button>
    </div>
  );
}
