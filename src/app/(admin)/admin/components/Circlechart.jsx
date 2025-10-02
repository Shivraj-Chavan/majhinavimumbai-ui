"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Doughnut from "./ChatWrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CircleChart({ label, value, total, color = "#4ade80" }) {
  // console.log("Rendering chart with:", { label, value, total });

  // Determine custom colors based on label
  let fillColor = color;
  let remainingColor = "#e5e7eb"; // default: gray

  if (label === "Verified Businesses","Pending Verifications", "Total Users") {
    fillColor = "#22c55e";      // green
    remainingColor = "#facc15"; // yellow
  }

  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [value || 0, Math.max(0, (total || 0) - (value || 0))],
        backgroundColor: [fillColor, remainingColor],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col justify-between items-center p-4 shadow rounded-xl bg-white w-48 h-55">
      <h3 className="font-medium text-center text-sm">{label}</h3>
      <div className="relative w-32 h-32 flex items-center justify-center">
        {typeof total === "number" && total > 0 && (
          <Doughnut data={data} options={options} />
        )}
      </div>
      <p className="text-xs font-semibold">
        {value} / {total}
      </p>
    </div>
  );
}
