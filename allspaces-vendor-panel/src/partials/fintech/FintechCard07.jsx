import React from 'react';
import LineChart from '../../charts/LineChart06';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function FintechCard07({ data }) {

  const chartData = {
    labels: data?.map(item => item.date) || [],
    datasets: [
      // Indigo line
      {
        label: 'Spaces Portfolio',
        data: data?.map(item => item.totalSpend) || [],
        borderColor: "#0E8345",
        fill: true,
        backgroundColor: tailwindConfig().theme.colors.transparent,
        borderWidth: 4,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 6,
          pointBackgroundColor: "#0E8345",
          pointHoverBackgroundColor: "#0E8345",
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,          
          clip: 20,
      }
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-8 bg-white shadow-lg rounded-2xl p-5">
      <header className="flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Revenue</h2>
      </header>

      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        {chartData.labels.length > 0 ?
          <LineChart data={chartData} width={389} height={262} /> :
          "No record found"
        }
      </div>      
    </div>
  );
}

export default FintechCard07;
