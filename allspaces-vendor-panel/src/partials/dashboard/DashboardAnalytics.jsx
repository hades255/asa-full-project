import React, { useEffect } from "react";
import LineChart from "../../charts/LineChart08";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

import ArrowUpIcon from "../../images/arrow-up-icon.png";
import { format } from "date-fns";

function DashboardAnalytics(props) {
  const chartData = {
    labels:
      props.data?.graph_data?.map((item) =>
        format(item.grouped_date, "MM-dd-yyyy")
      ) || [],
    datasets: [
      // Line
      {
        data:
          props.data?.graph_data?.map((item) => Math.round(item.total_spend)) ||
          [],
        fill: true,
        backgroundColor: tailwindConfig().theme.colors.transparent,
        borderColor: tailwindConfig().theme.colors.black,
        borderWidth: 1,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.gray[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.gray[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-2xl p-5">
      <header>
        <h3 className="text-sm font-normal text-lightGray mb-1">
          {props.data?.label}
        </h3>
        <div className="text-2xl font-bold text-black mb-1">
          {~~props.data?._sum?.spend || 0}
        </div>
        {/* <div className="flex text-sm">
          <img src={ArrowUpIcon} width="18" height="18" />
          <span className="font-medium text-[#0E8345] mx-1">37.8%</span> this
          month
        </div> */}
      </header>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        {chartData.labels.length > 0 && (
          <LineChart data={chartData} width={286} height={98} />
        )}
      </div>
    </div>
  );
}

export default DashboardAnalytics;
