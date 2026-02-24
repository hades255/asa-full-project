import React from 'react';
import LineChart from '../../charts/LineChart08';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

import ArrowUpIcon from '../../images/arrow-up-icon.png';

function FintechCard10() {

  const chartData = {
    labels: [
      '09-01-2022',
      '10-01-2022',
      '11-01-2022',
      '12-01-2022',
      '01-01-2023',
    ],
    datasets: [
      // Line
      {
        data: [252, 323, 322, 270, 232],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.rose[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.rose[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.rose[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.rose[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-2xl">
      <div className="px-5 pt-5">
        <header>
          <h3 className="text-sm font-normal text-lightGray uppercase mb-1">
            Upcoming Bookings
          </h3>
          <div className="text-3xl font-bold text-black mb-1">2900</div>
          <div className="flex text-sm">
            <img src={ArrowUpIcon} width="18" height="18" />
            <span className="font-medium text-[#0E8345] mx-1">37.8%</span> this month
          </div>
        </header>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={286} height={98} />
      </div>
    </div>
  );
}

export default FintechCard10;
