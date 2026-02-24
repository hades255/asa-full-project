import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const RevenueGraph = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <filter id="shadow" height="200%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#0E8345"
                floodOpacity="0.9"
              />
            </filter>
          </defs>

          {/* Add grid and axes */}
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickFormatter={(value) => value.split(" ")[0]}
          />
          <YAxis
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#0E8345"
            strokeWidth={4}
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
