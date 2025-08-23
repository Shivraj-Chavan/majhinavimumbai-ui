"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";
import CircleChart from "./components/Circlechart";
import StatCard from "./components/Statcard";

function CardWrapper({ children }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-2xl shadow-lg p-6 transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-inner">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await apiGet("/dashboard");
      console.log("stats", res);
      setStats(res);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    console.log("Stats State Updated:", stats);
  }, [stats]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold text-gray-600">
        Loading dashboard stats...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Failed to load dashboard data.
      </div>
    );
  }

  const {
    totalUsers,
    verifiedBusinesses,
    pendingVerifications,
    pendingUpdates,
    contactMessages,
    reviewDeleteRequests,
    businessEnquiries,
  } = stats;

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-700">Admin Dashboard</h1>

    <div className="space-y-5">

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Total Users */}
      <CardWrapper>
        <CircleChart
          label="Total Users"
          value={totalUsers || 0}
          total={10000}
          fillColor="#22c55e"
          remainingColor="#facc15"
        />
      </CardWrapper>

      {/* Verified + Pending in one combined card */}
      <div className="lg:col-span-2">
        <CardWrapper>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full">
            {/* Verified */}
            <div className="flex flex-col items-center">
              <CircleChart
                label="Verified Businesses"
                value={verifiedBusinesses || 0}
                total={totalUsers}
                fillColor="#22c55e"
                remainingColor="#facc15"
              />
            </div>

            {/* Pending */}
            <div className="flex flex-col items-center">
              <CircleChart
                label="Pending Verifications"
                value={pendingVerifications || 0}
                total={totalUsers}
                fillColor="#facc15"
                remainingColor="#22c55e"
              />
            </div>
          </div>
        </CardWrapper>
      </div>

      </div>


      {/* Row 2: 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardWrapper>
          <StatCard label="Pending Updates" value={pendingUpdates || 0} color="#facc15" />
        </CardWrapper>

        <CardWrapper>
          <StatCard label="Contact Messages" value={contactMessages || 0} color="text-orange-500" />
        </CardWrapper>

        <CardWrapper>
          <StatCard label="Review Delete Requests" value={reviewDeleteRequests || 0} color="text-red-500" />
        </CardWrapper>

        <CardWrapper>
          <StatCard label="Business Enquiries" value={businessEnquiries || 0} color="text-yellow-500" />
        </CardWrapper>
      </div>

      </div>

          </div>
        );
      }