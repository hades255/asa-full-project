import { ArrowDown, ArrowUp } from "iconsax-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Utility Func to generate random bookings data
const generateData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      bookings: Math.floor(Math.random() * 100) + 10,
    });
  }
  return data;
};

const LINE_GRAPH_DATA = generateData();

export const StatCard = ({ stat }) => {
  return (
    <div className="lg:w-full p-5 flex flex-col gap-y-8 bg-semantic-background-backgroundPrimary rounded-2xl shadow-md">
      <div className="flex flex-col gap-y-1">
        <p className="font-normal text-body2 text-semantic-content-contentInverseTertionary">
          {stat.title}
        </p>
        <p className="font-semibold text-heading2 text-semantic-content-contentPrimary">
          {stat.value}
        </p>
        <div className="flex items-center gap-x-1">
          {stat.percentage.includes("+") ? (
            <ArrowUp className="w-4 h-4 text-semanticExtensions-content-contentPositive" />
          ) : (
            <ArrowDown className="w-4 h-4 text-semanticExtensions-content-contentNegative" />
          )}
          <span
            className={`font-normal text-caption1 ${
              stat.percentage.includes("+")
                ? "text-semanticExtensions-content-contentPositive"
                : "text-semanticExtensions-content-contentNegative"
            }`}
          >
            {stat.percentage}
            <span className="text-semantic-content-contentPrimary">{` this month`}</span>
          </span>
        </div>
      </div>
      <div className="w-full h-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stat.graphData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#000"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
