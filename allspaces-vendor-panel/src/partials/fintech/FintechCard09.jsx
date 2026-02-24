import React from "react";
import PieChart from "../../charts/PieChart";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";
import DoughnutChart from "../../charts/DoughnutChart";

function FintechCard09({ data }) {
  const chartData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        label: "Bookings",
        // data:[20, 30],
        data: [data.completed_count ?? 0, data.cancelled_count ?? 0],
        backgroundColor: ["#0E8345", "#DE1135"],
        borderColor: ["#0E8345", "#DE1135"],
        borderWidth: 20,
        hoverBorderColor: ["#0E8345", "#DE1135"],
        hoverBorderWidth: 30,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-2xl p-5">
      <header className="flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Orders Overview
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {data.cancelled_count <= 0 && data.completed_count <= 0 && (
        <DoughnutChart data={chartData} width={240} height={240} />
      )}
    </div>
  );
}

export default FintechCard09;
