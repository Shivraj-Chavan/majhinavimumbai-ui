import React from "react";

export default function StatCard({ label, value, color = "text-black" }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    {/* <h3 className="font-medium text-center text-sm">{label}</h3> */}
    <div className={`text-4xl font-extrabold mb-2 ${color}`}>
            {value}
        </div>
        <div className="text-sm font-medium text-center text-gray-500">
            {label}
        </div>
        </div>
  );
}
