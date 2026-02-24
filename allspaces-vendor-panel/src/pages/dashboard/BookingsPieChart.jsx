import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = [
  "#FFEB3B",
  "#FDD835",
  "#FBC02D",
  "#F9A825",
  "#0E8345",
  "#DE1135",
];

export const BookingsPieChart = ({ data }) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="lg:flex-row lg:items-center flex flex-col">
      <div className="w-full lg:w-72 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        {data.map((item, index) => (
          <div key={index.toString()} className="flex items-center gap-x-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <p className="font-normal text-caption1 text-semantic-content-contentPrimary">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
