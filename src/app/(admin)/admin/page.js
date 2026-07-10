"use client";

import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Edit, Mail, AlertCircle, Briefcase } from "lucide-react";
import { apiGet } from "@/lib/apiClient";
import DownloadReport from "./components/DownloadReport";

function StatCard({ icon: Icon, label, value, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 rounded-lg ${bgColor}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ label, current, total, icon: Icon, color, bgColor }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-gray-900">{current.toLocaleString()}</span>
          <span className="text-sm font-medium text-gray-500">of {total.toLocaleString()}</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-gray-500">{percentage}% of total users</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null); // admin-stats
  const [dashboardStats, setDashboardStats] = useState(null); // admin dashboard
  const [loading, setLoading] = useState(true);
  
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("authRole")
      : null;

      useEffect(() => {
        const fetchData = async () => {
          try {
            const role = localStorage.getItem("authRole");
      
            // ALWAYS get admin-stats
            const adminStatsRes = await apiGet("/dashboard/admin-stats");
            setStats(adminStatsRes);
      
            // ONLY ADMIN gets dashboard data
            if (role === "admin") {
              const dashboardRes = await apiGet("/dashboard");
              setDashboardStats(dashboardRes);
            }
          } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setStats(null);
            setDashboardStats(null);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (role === "admin" && !dashboardStats)
    return <p>Failed to load dashboard data</p>;
  
  if (role !== "admin" && !stats)
    return <p>Failed to load dashboard data</p>;
  // Extract subadmin stats array from the API response


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-center text-red-700 font-semibold">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }
  const adminData =
  role === "admin"
    ? dashboardStats || {}
    : stats || {};

const {
  totalUsers = 0,
  todayUsers = 0,
  monthlyUsers = 0,

  totalBusinesses = 0,
  todayBusinesses = 0,
  monthlyBusinesses = 0,

  verifiedBusinesses = 0,
  pendingVerifications = 0,
  pendingUpdates = 0,
  contactMessages = 0,
  reviewDeleteRequests = 0,
  businessEnquiries = 0,
} = adminData;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
    <div className="max-w-7xl mx-auto">
  
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {role === "admin" ? "Admin Dashboard" : "Sub Admin Dashboard"}
        </h1>
  
        <p className="text-gray-600">
          Monitor and manage your platform metrics
        </p>
  
        {role === "admin" && <DownloadReport />}
      </div>
  
      {/* SUB ADMIN DASHBOARD */}
      {role !== "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        
          
        <StatCard
            icon={Users}
            label="Today's Users"
            value={todayUsers}
            color="text-green-600"
            bgColor="bg-green-50"
          />

          <StatCard
            icon={Briefcase}
            label="Today's Businesses"
            value={todayBusinesses}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />

          <StatCard
            icon={Users}
            label="Total Users Created"
            value={totalUsers}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
  
          {/* <StatCard
            icon={Users}
            label="Today's Users"
            value={todayUsers}
            color="text-green-600"
            bgColor="bg-green-50"
          /> */}
  
          <StatCard
            icon={Users}
            label="Monthly Users"
            value={monthlyUsers}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
  
          <StatCard
            icon={Briefcase}
            label="Total Businesses Created"
            value={totalBusinesses}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
  
          {/* <StatCard
            icon={Briefcase}
            label="Today's Businesses"
            value={todayBusinesses}
            color="text-green-600"
            bgColor="bg-green-50"
          /> */}
  
          <StatCard
            icon={Briefcase}
            label="Monthly Businesses"
            value={monthlyBusinesses}
            color="text-red-600"
            bgColor="bg-red-50"
          />
  
        </div>
      )}
  
      {/* ADMIN DASHBOARD */}
      {role === "admin" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
  
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="w-7 h-7" />
                  </div>
                  <h2 className="text-lg font-semibold">
                    Total Users
                  </h2>
                </div>
  
                <p className="text-5xl font-bold mb-2">
                  {totalUsers.toLocaleString()}
                </p>
  
                <p className="text-blue-100 text-sm">
                  Total registered accounts
                </p>
              </div>
            </div>
  
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  
                <StatCard
                  icon={Edit}
                  label="Verified Businesses"
                  value={verifiedBusinesses}
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
  
                <StatCard
                  icon={Clock}
                  label="Pending Verifications"
                  value={pendingVerifications}
                  color="text-amber-600"
                  bgColor="bg-amber-50"
                />
  
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
  
            <StatCard
              icon={Edit}
              label="Pending Updates"
              value={pendingUpdates}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
  
            <StatCard
              icon={Mail}
              label="Contact Messages"
              value={contactMessages}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
  
            <StatCard
              icon={AlertCircle}
              label="Delete Requests"
              value={reviewDeleteRequests}
              color="text-red-600"
              bgColor="bg-red-50"
            />
  
            <StatCard
              icon={Briefcase}
              label="Business Enquiries"
              value={businessEnquiries}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
  
          </div>
  
        </>
      )}
  
    </div>
  </div>
  );
}